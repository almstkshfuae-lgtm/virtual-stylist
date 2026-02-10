/* Local development proxy server to emulate the Vercel serverless proxy.
   Run locally with `npm run start:api` and keep it running in a separate terminal.
   It reads `API_KEY` from .env.local via dotenv.
*/
import dotenv from 'dotenv';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
  console.log(`✓ Found .env.local at: ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.warn(`⚠️  .env.local not found at: ${envPath}`);
}

const app = express();
app.use(express.json({ limit: '10mb' }));

// Optional Clerk auth middleware: if @clerk/express is missing, continue without blocking startup.
let clerkReady = false;
await (async () => {
  try {
    const { clerkMiddleware } = await import('@clerk/express');
    app.use(clerkMiddleware());
    clerkReady = true;
  } catch (err) {
    console.warn('⚠️  @clerk/express not installed; skipping Clerk auth middleware. Error code:', err?.code || err?.message);
  }
})();

app.use((req, res, next) => {
  const allowOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  res.header('Access-Control-Allow-Origin', allowOrigin);
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const API_KEY = process.env.API_KEY;
const API_SECRET =
  process.env.API_SECRET ||
  process.env.VERCEL_API_SECRET ||
  process.env.VITE_API_SECRET;
if (!API_KEY) {
  console.error('❌ CRITICAL ERROR: API_KEY not loaded from .env.local');
  console.error(`   Expected file at: ${envPath}`);
  console.error(`   File exists: ${fs.existsSync(envPath)}`);
  console.error('\n   FIX: Add your API key to .env.local:');
  console.error('   API_KEY=your_google_genai_api_key');
  console.error('\n   Get your key from: https://aistudio.google.com/apikey\n');
  process.exit(1);
} else {
  console.log('✓ API_KEY loaded successfully');
}

const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const BASE64_REGEX = /^[A-Za-z0-9+/=]+$/;
const LIMITS = {
  modelMaxLength: 64,
  maxContents: 24,
  maxPartsPerContent: 32,
  maxTextLength: 20_000,
  maxSystemInstructionLength: 12_000,
  maxInlineDataLength: 8_000_000,
};

const ALLOWED_MODELS = new Set([
  'gemini-3-flash-preview',
  'gemini-2.5-flash-image',
  'gemini-2.5-flash',
  'gemini-3-pro-preview'
]);

const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX_AUTH || 60);
const RATE_LIMIT_MAX_UNAUTH = Number(process.env.RATE_LIMIT_MAX_UNAUTH || 20);
const tokenBuckets = new Map();

const isObject = (value) => typeof value === 'object' && value !== null;
const rejectUnknownKeys = (obj, allowedKeys, path) => {
  const unknown = Object.keys(obj).filter((key) => !allowedKeys.includes(key));
  if (unknown.length > 0) {
    return { error: `${path} contains unexpected field(s): ${unknown.join(', ')}` };
  }
  return { value: null };
};

const cleanString = (value, maxLength) => {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(CONTROL_CHARS_REGEX, '').trim();
  if (!cleaned || cleaned.length > maxLength) return null;
  return cleaned;
};

const clampNumber = (value, fallback, min, max) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(Math.max(num, min), max);
};

const hashToken = (value) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
};

const extractClientIp = (req) => {
  const forwardedFor = typeof req.headers['x-forwarded-for'] === 'string' ? req.headers['x-forwarded-for'] : '';
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return typeof req.headers['x-real-ip'] === 'string' ? req.headers['x-real-ip'] : 'unknown';
};

const logEvent = (event, fields = {}) => {
  console.log(JSON.stringify({ ts: new Date().toISOString(), event, ...fields }));
};

const sanitizeInlineData = (raw) => {
  if (!isObject(raw)) return { error: 'inlineData must be an object' };
  const unknownKeys = rejectUnknownKeys(raw, ['data', 'mimeType'], 'inlineData');
  if (unknownKeys.error) return unknownKeys;

  const mimeType = cleanString(raw.mimeType, 128);
  if (!mimeType || !/^image\/[a-zA-Z0-9.+-]+$/.test(mimeType)) {
    return { error: 'inlineData.mimeType must be a valid image MIME type' };
  }

  if (typeof raw.data !== 'string') {
    return { error: 'inlineData.data must be a base64 string' };
  }

  const data = raw.data.trim();
  if (!data || data.length > LIMITS.maxInlineDataLength || !BASE64_REGEX.test(data)) {
    return { error: 'inlineData.data is invalid or too large' };
  }

  return { value: { data, mimeType } };
};

const sanitizePart = (raw) => {
  if (!isObject(raw)) return { error: 'part must be an object' };
  const unknownKeys = rejectUnknownKeys(raw, ['text', 'inlineData'], 'part');
  if (unknownKeys.error) return unknownKeys;

  const hasText = raw.text !== undefined;
  const hasInlineData = raw.inlineData !== undefined;
  if (hasText === hasInlineData) {
    return { error: 'part must contain exactly one of "text" or "inlineData"' };
  }

  if (hasText) {
    const text = cleanString(raw.text, LIMITS.maxTextLength);
    if (!text) return { error: 'part.text is empty or too long' };
    return { value: { text } };
  }

  if (hasInlineData) {
    const inlineData = sanitizeInlineData(raw.inlineData);
    if (inlineData.error) return inlineData;
    return { value: { inlineData: inlineData.value } };
  }

  return { error: 'part must contain text or inlineData' };
};

const sanitizeContent = (raw) => {
  if (typeof raw === 'string') {
    const text = cleanString(raw, LIMITS.maxTextLength);
    if (!text) return { error: 'content string is empty or too long' };
    return { value: { parts: [{ text }] } };
  }

  if (!isObject(raw)) return { error: 'content must be a string or object' };
  const unknownKeys = rejectUnknownKeys(raw, ['parts', 'role'], 'content');
  if (unknownKeys.error) return unknownKeys;
  if (!Array.isArray(raw.parts) || raw.parts.length === 0 || raw.parts.length > LIMITS.maxPartsPerContent) {
    return { error: 'content.parts must be a non-empty array within limits' };
  }

  const parts = [];
  for (const part of raw.parts) {
    const cleanPart = sanitizePart(part);
    if (cleanPart.error) return cleanPart;
    parts.push(cleanPart.value);
  }

  const role = cleanString(raw.role, 10);
  if (role && role !== 'user' && role !== 'model' && role !== 'system') {
    return { error: 'content.role is invalid' };
  }

  return { value: role ? { role, parts } : { parts } };
};

const sanitizePayload = (payload) => {
  if (!isObject(payload)) return { error: 'payload must be an object' };
  const unknownKeys = rejectUnknownKeys(payload, ['contents', 'systemInstruction', 'config'], 'payload');
  if (unknownKeys.error) return unknownKeys;
  if (payload.contents === undefined) {
    return { error: 'payload.contents is required' };
  }

  const contentsInput = Array.isArray(payload.contents) ? payload.contents : [payload.contents];
  if (contentsInput.length === 0 || contentsInput.length > LIMITS.maxContents) {
    return { error: 'payload.contents must be a non-empty array within limits' };
  }

  const contents = [];
  for (const content of contentsInput) {
    const cleanContent = sanitizeContent(content);
    if (cleanContent.error) return cleanContent;
    contents.push(cleanContent.value);
  }

  let systemInstruction;
  if (payload.systemInstruction !== undefined) {
    if (typeof payload.systemInstruction === 'string') {
      const cleaned = cleanString(payload.systemInstruction, LIMITS.maxSystemInstructionLength);
      if (!cleaned) return { error: 'payload.systemInstruction is invalid' };
      systemInstruction = cleaned;
    } else {
      const cleanInstruction = sanitizeContent(payload.systemInstruction);
      if (cleanInstruction.error) {
        return { error: `payload.systemInstruction: ${cleanInstruction.error}` };
      }
      systemInstruction = cleanInstruction.value;
    }
  }

  let config;
  if (payload.config !== undefined) {
    if (!isObject(payload.config)) {
      return { error: 'payload.config must be an object' };
    }
    const unknownConfigKeys = rejectUnknownKeys(
      payload.config,
      ['responseMimeType', 'maxOutputTokens', 'temperature', 'topP', 'topK', 'tools', 'toolConfig'],
      'payload.config'
    );
    if (unknownConfigKeys.error) return unknownConfigKeys;

    const responseMimeType = cleanString(payload.config.responseMimeType, 64);
    config = {
      maxOutputTokens: Math.round(clampNumber(payload.config.maxOutputTokens, 512, 1, 2048)),
      temperature: clampNumber(payload.config.temperature, 0.7, 0, 1),
      topP: clampNumber(payload.config.topP, 0.95, 0, 1),
      topK: Math.round(clampNumber(payload.config.topK, 40, 1, 200)),
      tools: payload.config.tools,
      toolConfig: payload.config.toolConfig,
    };

    if (responseMimeType && ['application/json', 'text/plain'].includes(responseMimeType)) {
      config.responseMimeType = responseMimeType;
    }
  }

  return { value: { contents, systemInstruction, config } };
};

const takeRateLimit = (tokenKey, limit) => {
  const now = Date.now();
  const bucket = tokenBuckets.get(tokenKey) || { start: now, count: 0 };
  if (now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    bucket.start = now;
    bucket.count = 0;
  }
  bucket.count += 1;
  tokenBuckets.set(tokenKey, bucket);
  const resetAtMs = bucket.start + RATE_LIMIT_WINDOW_MS;
  const retryAfterSec = Math.max(1, Math.ceil((resetAtMs - now) / 1000));
  return {
    limited: bucket.count > limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSec,
    resetAtMs,
  };
};

app.get('/', (req, res) => {
  res.json({
    message: 'Virtual Stylist AI - Local Proxy Server',
    endpoint: 'POST /api/gemini-proxy',
    description: 'Forward Gemini API requests with the API key (kept server-side)',
  });
});

app.post('/api/gemini-proxy', async (req, res) => {
  // Enforce auth when Clerk is present; otherwise rely on API_SECRET header as before.
  const auth = req.auth;
  if (clerkReady && !auth?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const start = Date.now();
  const requestId = typeof req.headers['x-request-id'] === 'string'
    ? req.headers['x-request-id']
    : `req_${Math.random().toString(36).slice(2, 10)}`;
  const clientIp = extractClientIp(req);
  logEvent('proxy.request.received', { requestId, clientIp });

  if (!API_KEY) {
    console.error('❌ CRITICAL: API_KEY is missing');
    return res.status(500).json({
      error: 'API key not configured on server',
      help: 'Set API_KEY in .env.local. Get it from https://aistudio.google.com/apikey'
    });
  }

if (!API_SECRET) {
  console.error('❌ CRITICAL: API_SECRET missing. Set API_SECRET (or VITE_API_SECRET) in .env.local');
    return res.status(500).json({ error: 'API secret not configured on server' });
  }

  const authHeader = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  if (!token || token !== API_SECRET) {
    const unauthLimit = takeRateLimit(`unauth:${clientIp}`, RATE_LIMIT_MAX_UNAUTH);
    res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX_UNAUTH));
    res.setHeader('X-RateLimit-Remaining', String(unauthLimit.remaining));
    res.setHeader('X-RateLimit-Reset', String(unauthLimit.resetAtMs));
    if (unauthLimit.limited) {
      res.setHeader('Retry-After', String(unauthLimit.retryAfterSec));
      logEvent('proxy.rejected.rate_limit', { requestId, clientIp, bucket: 'unauth', retryAfterSec: unauthLimit.retryAfterSec });
      return res.status(429).json({ error: 'Too many unauthorized attempts. Try again later.' });
    }
    logEvent('proxy.rejected.unauthorized', { requestId, clientIp });
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const authLimit = takeRateLimit(`auth:${clientIp}:${hashToken(token)}`, RATE_LIMIT_MAX);
  res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
  res.setHeader('X-RateLimit-Remaining', String(authLimit.remaining));
  res.setHeader('X-RateLimit-Reset', String(authLimit.resetAtMs));
  if (authLimit.limited) {
    res.setHeader('Retry-After', String(authLimit.retryAfterSec));
    logEvent('proxy.rejected.rate_limit', { requestId, clientIp, bucket: 'auth', retryAfterSec: authLimit.retryAfterSec });
    return res.status(429).json({ error: 'Rate limit exceeded. Try again shortly.' });
  }

  if (!isObject(req.body)) {
    logEvent('proxy.rejected.validation', { requestId, clientIp, reason: 'invalid_body' });
    return res.status(400).json({ error: 'Request body must be a JSON object' });
  }
  const unknownRootKeys = rejectUnknownKeys(req.body, ['model', 'payload'], 'request body');
  if (unknownRootKeys.error) {
    logEvent('proxy.rejected.validation', { requestId, clientIp, reason: unknownRootKeys.error });
    return res.status(400).json({ error: unknownRootKeys.error });
  }

  const model = cleanString(req.body.model, LIMITS.modelMaxLength);
  if (!model) {
    logEvent('proxy.rejected.validation', { requestId, clientIp, reason: 'invalid_model' });
    return res.status(400).json({ error: 'Invalid "model" in request body' });
  }

  if (!ALLOWED_MODELS.has(model)) {
    logEvent('proxy.rejected.validation', { requestId, clientIp, model, reason: 'model_not_allowed' });
    return res.status(400).json({ error: 'Model not allowed' });
  }

  if (req.body.payload === undefined) {
    logEvent('proxy.rejected.validation', { requestId, clientIp, model, reason: 'missing_payload' });
    return res.status(400).json({ error: 'Missing "payload" in request body' });
  }

  const safePayload = sanitizePayload(req.body.payload);
  if (safePayload.error) {
    logEvent('proxy.rejected.validation', { requestId, clientIp, model, reason: safePayload.error });
    return res.status(400).json({ error: safePayload.error });
  }

  const payloadStats = {
    contentsCount: safePayload.value.contents.length,
    partsCount: safePayload.value.contents.reduce((sum, item) => sum + item.parts.length, 0),
    hasSystemInstruction: !!safePayload.value.systemInstruction,
    hasConfig: !!safePayload.value.config,
  };

  try {
    logEvent('proxy.request.start', { requestId, clientIp, model, ...payloadStats });

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const result = await ai.models.generateContent({
      model,
      ...safePayload.value,
    });

    logEvent('proxy.request.success', { requestId, clientIp, model, durationMs: Date.now() - start });
    res.json(result);
  } catch (error) {
    const errorMsg = error?.message || String(error);
    console.error(`❌ API Error (${model}):`, errorMsg);
    logEvent('proxy.request.error', {
      requestId,
      clientIp,
      model,
      durationMs: Date.now() - start,
      error: errorMsg,
    });

    let userMessage = errorMsg;
    if (errorMsg.includes('401') || errorMsg.includes('UNAUTHENTICATED')) {
      userMessage = 'Invalid API key - check your .env.local API_KEY value';
    } else if (errorMsg.includes('429')) {
      userMessage = 'Rate limit exceeded - wait a moment and try again';
    } else if (errorMsg.includes('PERMISSION_DENIED')) {
      userMessage = 'API key lacks required permissions. Regenerate it from https://aistudio.google.com/apikey';
    }

    res.status(500).json({
      error: userMessage,
      debug: process.env.NODE_ENV === 'development' ? errorMsg : undefined
    });
  }
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`\n✓ Local API proxy listening on http://localhost:${port}`);
  console.log(`  POST http://localhost:${port}/api/gemini-proxy to forward Gemini requests`);
  console.log(`  GET  http://localhost:${port}/ for info\n`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  console.error(reason instanceof Error ? reason.stack : reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

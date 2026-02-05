import { GoogleGenAI } from '@google/genai';
import type { ApiRequest, ApiResponse } from './vercelTypes';

const safeJsonParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

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
const RATE_LIMIT_MAX_AUTH = Number(process.env.RATE_LIMIT_MAX_AUTH || 60);
const RATE_LIMIT_MAX_UNAUTH = Number(process.env.RATE_LIMIT_MAX_UNAUTH || 20);

type ValidationResult<T> = { value: T } | { error: string };
type CleanPart = { text: string } | { inlineData: { data: string; mimeType: string } };
type CleanRole = 'user' | 'model' | 'system';
type CleanContent = { parts: CleanPart[]; role?: CleanRole };
type CleanConfig = {
  maxOutputTokens: number;
  temperature: number;
  topP: number;
  topK: number;
  responseMimeType?: 'application/json' | 'text/plain';
};
type RateBucket = { start: number; count: number };
type RateLimitResult = {
  limited: boolean;
  remaining: number;
  retryAfterSec: number;
  resetAtMs: number;
};

const isAllowedRole = (value: string): value is CleanRole =>
  value === 'user' || value === 'model' || value === 'system';

const asObject = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;

const rejectUnknownKeys = (
  obj: Record<string, unknown>,
  allowedKeys: readonly string[],
  path: string
): ValidationResult<null> => {
  const unknown = Object.keys(obj).filter((key) => !allowedKeys.includes(key));
  if (unknown.length > 0) {
    return { error: `${path} contains unexpected field(s): ${unknown.join(', ')}` };
  }
  return { value: null };
};

const cleanString = (value: unknown, maxLength: number): string | null => {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(CONTROL_CHARS_REGEX, '').trim();
  if (!cleaned || cleaned.length > maxLength) return null;
  return cleaned;
};

const clampNumber = (value: unknown, fallback: number, min: number, max: number) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(Math.max(num, min), max);
};

const sanitizeInlineData = (raw: unknown): ValidationResult<{ data: string; mimeType: string }> => {
  const obj = asObject(raw);
  if (!obj) return { error: 'inlineData must be an object' };
  const unknownKeys = rejectUnknownKeys(obj, ['data', 'mimeType'], 'inlineData');
  if ('error' in unknownKeys) return unknownKeys;

  const mimeType = cleanString(obj.mimeType, 128);
  if (!mimeType || !/^image\/[a-zA-Z0-9.+-]+$/.test(mimeType)) {
    return { error: 'inlineData.mimeType must be a valid image MIME type' };
  }

  if (typeof obj.data !== 'string') {
    return { error: 'inlineData.data must be a base64 string' };
  }
  const data = obj.data.trim();
  if (!data || data.length > LIMITS.maxInlineDataLength || !BASE64_REGEX.test(data)) {
    return { error: 'inlineData.data is invalid or too large' };
  }

  return { value: { data, mimeType } };
};

const sanitizePart = (raw: unknown): ValidationResult<CleanPart> => {
  const obj = asObject(raw);
  if (!obj) return { error: 'part must be an object' };
  const unknownKeys = rejectUnknownKeys(obj, ['text', 'inlineData'], 'part');
  if ('error' in unknownKeys) return unknownKeys;

  const hasText = obj.text !== undefined;
  const hasInlineData = obj.inlineData !== undefined;
  if (hasText === hasInlineData) {
    return { error: 'part must contain exactly one of "text" or "inlineData"' };
  }

  if (hasText) {
    const text = cleanString(obj.text, LIMITS.maxTextLength);
    if (!text) return { error: 'part.text is empty or too long' };
    return { value: { text } };
  }

  if (hasInlineData) {
    const inlineData = sanitizeInlineData(obj.inlineData);
    if ('error' in inlineData) return inlineData;
    return { value: { inlineData: inlineData.value } };
  }

  return { error: 'part must contain text or inlineData' };
};

const sanitizeContent = (raw: unknown): ValidationResult<CleanContent> => {
  if (typeof raw === 'string') {
    const text = cleanString(raw, LIMITS.maxTextLength);
    if (!text) return { error: 'content string is empty or too long' };
    return { value: { parts: [{ text }] } };
  }

  const obj = asObject(raw);
  if (!obj) return { error: 'content must be a string or object' };
  const unknownKeys = rejectUnknownKeys(obj, ['parts', 'role'], 'content');
  if ('error' in unknownKeys) return unknownKeys;

  if (!Array.isArray(obj.parts) || obj.parts.length === 0 || obj.parts.length > LIMITS.maxPartsPerContent) {
    return { error: 'content.parts must be a non-empty array within limits' };
  }

  const parts: CleanPart[] = [];
  for (const part of obj.parts) {
    const cleanPart = sanitizePart(part);
    if ('error' in cleanPart) return cleanPart;
    parts.push(cleanPart.value);
  }

  const rawRole = cleanString(obj.role, 10);
  if (rawRole) {
    if (!isAllowedRole(rawRole)) {
      return { error: 'content.role is invalid' };
    }
    return { value: { role: rawRole, parts } };
  }

  return { value: { parts } };
};

const sanitizePayload = (payload: unknown): ValidationResult<{ contents: CleanContent[]; systemInstruction?: string | CleanContent; config?: CleanConfig }> => {
  const obj = asObject(payload);
  if (!obj) return { error: 'payload must be an object' };
  const unknownKeys = rejectUnknownKeys(obj, ['contents', 'systemInstruction', 'config'], 'payload');
  if ('error' in unknownKeys) return unknownKeys;

  if (obj.contents === undefined) {
    return { error: 'payload.contents is required' };
  }

  const contentsInput = Array.isArray(obj.contents) ? obj.contents : [obj.contents];
  if (contentsInput.length === 0 || contentsInput.length > LIMITS.maxContents) {
    return { error: 'payload.contents must be a non-empty array within limits' };
  }

  const contents: CleanContent[] = [];
  for (const content of contentsInput) {
    const cleanContent = sanitizeContent(content);
    if ('error' in cleanContent) return cleanContent;
    contents.push(cleanContent.value);
  }

  let systemInstruction: string | CleanContent | undefined;
  if (obj.systemInstruction !== undefined) {
    if (typeof obj.systemInstruction === 'string') {
      const cleaned = cleanString(obj.systemInstruction, LIMITS.maxSystemInstructionLength);
      if (!cleaned) return { error: 'payload.systemInstruction is invalid' };
      systemInstruction = cleaned;
    } else {
      const cleanInstruction = sanitizeContent(obj.systemInstruction);
      if ('error' in cleanInstruction) return { error: `payload.systemInstruction: ${cleanInstruction.error}` };
      systemInstruction = cleanInstruction.value;
    }
  }

  let config: CleanConfig | undefined;
  if (obj.config !== undefined) {
    const configObj = asObject(obj.config);
    if (!configObj) return { error: 'payload.config must be an object' };
    const unknownConfigKeys = rejectUnknownKeys(
      configObj,
      ['responseMimeType', 'maxOutputTokens', 'temperature', 'topP', 'topK'],
      'payload.config'
    );
    if ('error' in unknownConfigKeys) return unknownConfigKeys;

    const responseMimeType = cleanString(configObj.responseMimeType, 64);
    config = {
      maxOutputTokens: Math.round(clampNumber(configObj.maxOutputTokens, 512, 1, 2048)),
      temperature: clampNumber(configObj.temperature, 0.7, 0, 1),
      topP: clampNumber(configObj.topP, 0.95, 0, 1),
      topK: Math.round(clampNumber(configObj.topK, 40, 1, 200)),
    };
    if (responseMimeType === 'application/json' || responseMimeType === 'text/plain') {
      config.responseMimeType = responseMimeType;
    }
  }

  return { value: { contents, systemInstruction, config } };
};

const parseBody = (req: ApiRequest): Record<string, unknown> | null => {
  const body = typeof req.body === 'string' ? safeJsonParse(req.body) : req.body;
  return asObject(body);
};

const rateBuckets = new Map<string, RateBucket>();

const getHeader = (req: ApiRequest, key: string) => {
  const raw = req.headers[key];
  if (Array.isArray(raw)) return raw[0] || '';
  return raw || '';
};

const extractClientIp = (req: ApiRequest) => {
  const forwardedFor = getHeader(req, 'x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return getHeader(req, 'x-real-ip') || 'unknown';
};

const extractBearerToken = (req: ApiRequest) => {
  const header = getHeader(req, 'authorization');
  return header.startsWith('Bearer ') ? header.slice(7).trim() : '';
};

const hashToken = (value: string) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
};

const logEvent = (event: string, fields: Record<string, unknown>) => {
  const payload = { ts: new Date().toISOString(), event, ...fields };
  console.log(JSON.stringify(payload));
};

const safeStringify = (value: unknown) => {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
};

const normalizeUpstreamError = (err: any) => {
  const rawMessage = err?.message ?? String(err);
  const message = typeof rawMessage === 'string' ? rawMessage : String(rawMessage);
  let status = 500;

  const parsed = typeof message === 'string' ? safeJsonParse(message) : null;
  const parsedObj = asObject(parsed);
  const innerErr = parsedObj?.error;

  const numeric = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : null);
  const candidates: Array<number | null> = [
    numeric(err?.status),
    numeric(err?.code),
    numeric(err?.error?.code),
    numeric((innerErr as any)?.code),
    numeric(parsedObj?.code),
  ];
  for (const candidate of candidates) {
    if (candidate && candidate >= 400 && candidate <= 599) {
      status = candidate;
      break;
    }
  }

  const detailsObject =
    (asObject(err?.error) as Record<string, unknown> | null) ||
    (asObject(innerErr) as Record<string, unknown> | null) ||
    parsedObj;

  return {
    status,
    message,
    details: detailsObject ? (safeStringify(detailsObject) ? detailsObject : undefined) : undefined,
  };
};

const applyRateLimitHeaders = (res: ApiResponse, limit: number, result: RateLimitResult) => {
  const response = res as any;
  response.setHeader?.('X-RateLimit-Limit', String(limit));
  response.setHeader?.('X-RateLimit-Remaining', String(result.remaining));
  response.setHeader?.('X-RateLimit-Reset', String(result.resetAtMs));
  if (result.limited) {
    response.setHeader?.('Retry-After', String(result.retryAfterSec));
  }
};

const takeRateLimit = (key: string, limit: number): RateLimitResult => {
  const now = Date.now();
  const bucket = rateBuckets.get(key) || { start: now, count: 0 };
  if (now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    bucket.start = now;
    bucket.count = 0;
  }

  bucket.count += 1;
  rateBuckets.set(key, bucket);

  const remaining = Math.max(0, limit - bucket.count);
  const resetAtMs = bucket.start + RATE_LIMIT_WINDOW_MS;
  const retryAfterSec = Math.max(1, Math.ceil((resetAtMs - now) / 1000));
  return {
    limited: bucket.count > limit,
    remaining,
    retryAfterSec,
    resetAtMs,
  };
};

const getExpectedSecret = () =>
  (process.env.API_SECRET || '').trim() ||
  (process.env.VERCEL_API_SECRET || '').trim() ||
  // Allow using the client secret for dev/previews when set in Vercel
  (process.env.VITE_API_SECRET || '').trim();

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const start = Date.now();
  const requestId = getHeader(req, 'x-request-id') || `req_${Math.random().toString(36).slice(2, 10)}`;
  const clientIp = extractClientIp(req);

  if (req.method !== 'POST') {
    logEvent('proxy.rejected.method', { requestId, clientIp, method: req.method || 'unknown' });
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const expectedSecret = getExpectedSecret();
  if (!expectedSecret) {
    logEvent('proxy.error.config', {
      requestId,
      clientIp,
      error: 'api_secret_missing',
      vercelEnv: (process.env.VERCEL_ENV || '').trim() || undefined,
      nodeEnv: (process.env.NODE_ENV || '').trim() || undefined,
      hasApiSecret: Boolean((process.env.API_SECRET || '').trim()),
      hasVercelApiSecret: Boolean((process.env.VERCEL_API_SECRET || '').trim()),
      hasViteApiSecret: Boolean((process.env.VITE_API_SECRET || '').trim()),
    });
    res.status(500).json({
      error:
        'API secret not configured on server. Set API_SECRET (recommended) or VERCEL_API_SECRET in Vercel env vars ' +
        '(Production/Preview as needed), redeploy, and set VITE_API_SECRET to the same value on the client.',
    });
    return;
  }

  if (extractBearerToken(req) !== expectedSecret) {
    const unauthLimit = takeRateLimit(`unauth:${clientIp}`, RATE_LIMIT_MAX_UNAUTH);
    applyRateLimitHeaders(res, RATE_LIMIT_MAX_UNAUTH, unauthLimit);
    logEvent('proxy.rejected.unauthorized', {
      requestId,
      clientIp,
      limited: unauthLimit.limited,
      retryAfterSec: unauthLimit.retryAfterSec,
    });
    if (unauthLimit.limited) {
      res.status(429).json({ error: 'Too many unauthorized attempts. Try again later.' });
      return;
    }
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const authToken = extractBearerToken(req);
  const authKey = `auth:${clientIp}:${hashToken(authToken)}`;
  const authLimit = takeRateLimit(authKey, RATE_LIMIT_MAX_AUTH);
  applyRateLimitHeaders(res, RATE_LIMIT_MAX_AUTH, authLimit);
  if (authLimit.limited) {
    logEvent('proxy.rejected.rate_limit', {
      requestId,
      clientIp,
      bucket: 'auth',
      retryAfterSec: authLimit.retryAfterSec,
    });
    res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    return;
  }

  const isDev =
    (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') ||
    process.env.NODE_ENV === 'development';

  const apiKey =
    process.env.API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY;
  
  if (isDev) {
    // Minimal, non-sensitive log for troubleshooting in dev only
    console.log('API Route called (dev)');
  }
  
  if (!apiKey) {
    console.error('CRITICAL: API_KEY not found in process.env');
    logEvent('proxy.error.config', { requestId, clientIp, error: 'api_key_missing' });
    res.status(500).json({ 
      error: 'API key not configured on server'
    });
    return;
  }

  const body = parseBody(req);
  if (!body) {
    logEvent('proxy.rejected.validation', { requestId, clientIp, reason: 'invalid_body' });
    res.status(400).json({ error: 'Request body must be a JSON object' });
    return;
  }
  const unknownRootKeys = rejectUnknownKeys(body, ['model', 'payload'], 'request body');
  if ('error' in unknownRootKeys) {
    logEvent('proxy.rejected.validation', { requestId, clientIp, reason: unknownRootKeys.error });
    res.status(400).json({ error: unknownRootKeys.error });
    return;
  }

  const model = cleanString(body.model, LIMITS.modelMaxLength);
  if (!model) {
    logEvent('proxy.rejected.validation', { requestId, clientIp, reason: 'invalid_model' });
    res.status(400).json({ error: 'Invalid "model" in request body' });
    return;
  }
  if (!ALLOWED_MODELS.has(model)) {
    logEvent('proxy.rejected.validation', { requestId, clientIp, model, reason: 'model_not_allowed' });
    res.status(400).json({ error: 'Model not allowed' });
    return;
  }

  if (body.payload === undefined) {
    logEvent('proxy.rejected.validation', { requestId, clientIp, model, reason: 'missing_payload' });
    res.status(400).json({ error: 'Missing "payload" in request body' });
    return;
  }

  const safePayload = sanitizePayload(body.payload);
  if ('error' in safePayload) {
    logEvent('proxy.rejected.validation', { requestId, clientIp, model, reason: safePayload.error });
    res.status(400).json({ error: safePayload.error });
    return;
  }

  const payloadStats = {
    contentsCount: safePayload.value.contents.length,
    partsCount: safePayload.value.contents.reduce((sum, item) => sum + item.parts.length, 0),
    hasSystemInstruction: !!safePayload.value.systemInstruction,
    hasConfig: !!safePayload.value.config,
  };

  try {
    if (isDev) {
      console.log(`Calling ${model}...`);
    }
    logEvent('proxy.request.start', { requestId, clientIp, model, ...payloadStats });
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({ model, ...safePayload.value });
    if (isDev) {
      console.log(`Success: ${model}`);
    }
    logEvent('proxy.request.success', {
      requestId,
      clientIp,
      model,
      durationMs: Date.now() - start,
    });
    res.status(200).json(result);
  } catch (err: any) {
    const normalized = normalizeUpstreamError(err);
    console.error('API Error:', normalized.message);
    logEvent('proxy.request.error', {
      requestId,
      clientIp,
      model,
      durationMs: Date.now() - start,
      error: normalized.message,
      upstreamStatus: normalized.status,
    });
    res.status(normalized.status).json({
      error: normalized.message,
      ...(normalized.details ? { details: normalized.details } : null),
    });
  }
}

import { GoogleGenAI } from '@google/genai';
import type { ApiRequest, ApiResponse } from './vercelTypes';

const safeJsonParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const ALLOWED_MODELS = new Set([
  'gemini-3-flash-preview',
  'gemini-2.5-flash-image',
  'gemini-2.5-flash',
  'gemini-3-pro-preview'
]);

const requireAuth = (req: ApiRequest) => {
  const expected = process.env.API_SECRET || process.env.VERCEL_API_SECRET;
  if (!expected) return false;
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  return !!token && token === expected;
};

// Defensive payload scrubber: only allow known keys, drop tool configs to avoid unintended external calls.
const sanitizePayload = (payload: any) => {
  if (typeof payload !== 'object' || payload === null) return null;
  const allowed: any = {
    contents: payload.contents,
    systemInstruction: payload.systemInstruction,
    config: undefined,
  };

  // Retain config only if it does not contain tools/toolConfig which could trigger external calls.
  if (payload.config && typeof payload.config === 'object') {
    const { responseMimeType, maxOutputTokens, temperature, topP, topK } = payload.config;
    allowed.config = { responseMimeType, maxOutputTokens, temperature, topP, topK };
  }
  return allowed;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!requireAuth(req)) {
    res.status(401).json({ error: 'Unauthorized' });
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
    res.status(500).json({ 
      error: 'API key not configured on server'
    });
    return;
  }

  // Support both parsed JSON and raw string bodies
  const body = typeof req.body === 'string' ? safeJsonParse(req.body) : req.body;
  const { model, payload } = body || {};
  if (!model || !payload) {
    res.status(400).json({ error: 'Missing model or payload in request body' });
    return;
  }

  if (!ALLOWED_MODELS.has(model)) {
    res.status(400).json({ error: 'Model not allowed' });
    return;
  }

  const safePayload = sanitizePayload(payload);
  if (!safePayload) {
    res.status(400).json({ error: 'Invalid payload format' });
    return;
  }

  try {
    if (isDev) {
      console.log(`Calling ${model}...`);
    }
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({ model, ...safePayload });
    if (isDev) {
      console.log(`Success: ${model}`);
    }
    res.status(200).json(result);
  } catch (err: any) {
    console.error('API Error:', err?.message || String(err));
    res.status(500).json({ error: err?.message || String(err) });
  }
}

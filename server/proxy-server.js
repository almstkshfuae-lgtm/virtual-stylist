/* Local development proxy server (CommonJS).
   IMPORTANT: Kept for backward compatibility but now hardened to match the ESM proxy.
   Prefer `server/proxy-server.mjs`. */
require('dotenv').config({ path: './.env.local' });

const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json({ limit: '10mb' }));

// Restrictive CORS for local dev only; default to localhost:5173
app.use((req, res, next) => {
  const allowOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  res.header('Access-Control-Allow-Origin', allowOrigin);
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET || process.env.VERCEL_API_SECRET;
if (!API_KEY) {
  console.error('❌ CRITICAL: API_KEY not set in .env.local — proxy will exit.');
  process.exit(1);
}
if (!API_SECRET) {
  console.error('❌ CRITICAL: API_SECRET not set. Add API_SECRET to .env.local to start the proxy.');
  process.exit(1);
}

const ALLOWED_MODELS = new Set([
  'gemini-3-flash-preview',
  'gemini-2.5-flash-image',
  'gemini-2.5-flash',
  'gemini-3-pro-preview'
]);

const clampConfig = (config = {}) => {
  const maxOutputTokens = Math.min(Number(config.maxOutputTokens) || 512, 2048);
  const temperature = Math.min(Math.max(config.temperature ?? 0.7, 0), 1);
  const topP = Math.min(Math.max(config.topP ?? 0.95, 0), 1);
  const topK = Math.min(Math.max(config.topK ?? 40, 1), 200);
  const responseMimeType = typeof config.responseMimeType === 'string' ? config.responseMimeType : undefined;
  return { maxOutputTokens, temperature, topP, topK, responseMimeType };
};

const sanitizePayload = (input) => {
  if (typeof input !== 'object' || input === null) return null;
  const { contents, systemInstruction, config } = input;
  return {
    contents,
    systemInstruction,
    config: clampConfig(config)
  };
};

app.get('/', (req, res) => {
  res.json({
    message: 'Virtual Stylist AI - Local Proxy Server (CJS)',
    endpoint: 'POST /api/gemini-proxy',
    description: 'Forward Gemini API requests with the API key (kept server-side). Prefer proxy-server.mjs.',
  });
});

app.post('/api/gemini-proxy', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token || token !== API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { model, payload } = req.body || {};
  if (!model) return res.status(400).json({ error: 'Missing "model" in request body.' });
  if (!payload) return res.status(400).json({ error: 'Missing "payload" in request body.' });
  if (!ALLOWED_MODELS.has(model)) return res.status(400).json({ error: 'Model not allowed' });

  const safePayload = sanitizePayload(payload);
  if (!safePayload) return res.status(400).json({ error: 'Invalid payload format' });

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const result = await ai.models.generateContent({ model, ...safePayload });
    res.json(result);
  } catch (err) {
    const msg = err?.message || String(err);
    console.error('Proxy error:', msg);
    res.status(500).json({ error: msg });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`\n✓ Hardened CJS API proxy listening on http://localhost:${port}`);
  console.log(`  POST http://localhost:${port}/api/gemini-proxy (requires Bearer API_SECRET)`);
}).on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

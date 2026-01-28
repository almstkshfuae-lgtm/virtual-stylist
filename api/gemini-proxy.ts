import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const safeJsonParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
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

  try {
    if (isDev) {
      console.log(`Calling ${model}...`);
    }
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({ model, ...payload });
    if (isDev) {
      console.log(`Success: ${model}`);
    }
    res.status(200).json(result);
  } catch (err: any) {
    console.error('API Error:', err?.message || String(err));
    res.status(500).json({ error: err?.message || String(err) });
  }
}

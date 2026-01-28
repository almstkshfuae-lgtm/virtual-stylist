import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'API key not configured on server' });
    return;
  }

  const { model, payload } = req.body || {};
  if (!model || !payload) {
    res.status(400).json({ error: 'Missing model or payload in request body' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({ model, ...payload });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || String(err) });
  }
}

/* Local development proxy server to emulate the Vercel serverless proxy.
   Run locally with `npm run start:api` and keep it running in a separate terminal.
   It reads `API_KEY` from .env.local via dotenv.
*/
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn('Warning: API_KEY not set in .env.local — server proxy will not work without it.');
}

app.post('/api/gemini-proxy', async (req, res) => {
  if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });
  const { model, payload } = req.body || {};
  if (!model || !payload) return res.status(400).json({ error: 'Missing model or payload' });

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const result = await ai.models.generateContent({ model, ...payload });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Local API proxy listening on http://localhost:${port}`);
});

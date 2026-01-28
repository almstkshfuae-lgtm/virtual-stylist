/* Local development proxy server to emulate the Vercel serverless proxy.
   Run locally with `npm run start:api` and keep it running in a separate terminal.
   It reads `API_KEY` from .env.local via dotenv.
*/
require('dotenv').config({ path: './.env.local' });

const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json({ limit: '10mb' }));

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn('Warning: API_KEY not set in .env.local — server proxy will not work without it.');
}

app.get('/', (req, res) => {
  res.json({
    message: 'Virtual Stylist AI - Local Proxy Server',
    endpoint: 'POST /api/gemini-proxy',
    description: 'Forward Gemini API requests with the API key (kept server-side)',
  });
});

app.post('/api/gemini-proxy', async (req, res) => {
  if (!API_KEY) {
    console.error('ERROR: API_KEY not set in .env.local');
    return res.status(500).json({ error: 'API key not configured on server' });
  }
  const { model, payload } = req.body || {};
  if (!model || !payload) return res.status(400).json({ error: 'Missing model or payload' });

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const result = await ai.models.generateContent({ model, ...payload });
    res.json(result);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`\n✓ Local API proxy listening on http://localhost:${port}`);
  console.log(`  POST http://localhost:${port}/api/gemini-proxy to forward Gemini requests\n`);
}).on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

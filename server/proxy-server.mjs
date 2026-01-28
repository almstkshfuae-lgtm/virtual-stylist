/* Local development proxy server to emulate the Vercel serverless proxy.
   Run locally with `npm run start:api` and keep it running in a separate terminal.
   It reads `API_KEY` from .env.local via dotenv.
*/
import dotenv from 'dotenv';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const app = express();
app.use(express.json({ limit: '10mb' }));

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn('⚠️  Warning: API_KEY not set in .env.local — proxy will not work without it.');
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
    console.error('❌ ERROR: API_KEY not set in .env.local');
    return res.status(500).json({ error: 'API key not configured on server' });
  }
  const { model, payload } = req.body || {};
  if (!model || !payload) {
    return res.status(400).json({ error: 'Missing model or payload in request body' });
  }

  try {
    console.log(`📤 Calling model: ${model}`);
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const result = await ai.models.generateContent({ model, ...payload });
    console.log(`✓ Received response from ${model}`);
    res.json(result);
  } catch (err) {
    console.error('❌ Proxy error:', err.message || err);
    res.status(500).json({ error: err.message || String(err) });
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

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});

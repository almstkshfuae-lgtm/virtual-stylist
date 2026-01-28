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

// Load .env.local with detailed logging
if (fs.existsSync(envPath)) {
  console.log(`✓ Found .env.local at: ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.warn(`⚠️  .env.local not found at: ${envPath}`);
}

const app = express();
app.use(express.json({ limit: '10mb' }));

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error('❌ ERROR: API_KEY not loaded from .env.local');
  console.error(`    Expected file at: ${envPath}`);
  console.error(`    File exists: ${fs.existsSync(envPath)}`);
} else {
  console.log('✓ API_KEY loaded successfully');
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
    console.error('❌ ERROR: API_KEY not set');
    return res.status(500).json({ error: 'API key not configured' });
  }
  
  const { model, payload } = req.body || {};
  if (!model || !payload) {
    return res.status(400).json({ error: 'Missing model or payload' });
  }

  try {
    console.log(`📤 Calling ${model}...`);
    
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const result = await ai.models.generateContent({
      model,
      ...payload,
    });
    
    console.log(`✓ Got response from ${model}`);
    res.json(result);
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
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

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  console.error(reason instanceof Error ? reason.stack : reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

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

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error('❌ CRITICAL ERROR: API_KEY not loaded from .env.local');
  console.error(`   Expected file at: ${envPath}`);
  console.error(`   File exists: ${fs.existsSync(envPath)}`);
  console.error('\n   FIX: Add your API key to .env.local:');
  console.error('   API_KEY=your_google_genai_api_key');
  console.error('\n   Get your key from: https://aistudio.google.com/apikey\n');
  process.exit(1);
} else {
  const masked = API_KEY.substring(0, 8) + '...' + API_KEY.substring(API_KEY.length - 4);
  console.log(`✓ API_KEY loaded successfully (${masked})`);
}

app.get('/', (req, res) => {
  res.json({
    message: 'Virtual Stylist AI - Local Proxy Server',
    endpoint: 'POST /api/gemini-proxy',
    description: 'Forward Gemini API requests with the API key (kept server-side)',
  });
});

app.post('/api/gemini-proxy', async (req, res) => {
  console.log('📥 Received request:', { 
    apiKeyExists: !!API_KEY,
    body: req.body 
  });
  
  if (!API_KEY) {
    console.error('❌ CRITICAL: API_KEY is missing');
    return res.status(500).json({ 
      error: 'API key not configured on server',
      help: 'Set API_KEY in .env.local. Get it from https://aistudio.google.com/apikey'
    });
  }
  
  const { model, payload } = req.body || {};
  if (!model) {
    return res.status(400).json({ error: 'Missing "model" in request body. Example: "gemini-2.0-flash"' });
  }
  if (!payload) {
    return res.status(400).json({ error: 'Missing "payload" in request body' });
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
    const errorMsg = error.message || String(error);
    console.error(`❌ API Error (${model}):`, errorMsg);
    
    // Better error messages for common issues
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

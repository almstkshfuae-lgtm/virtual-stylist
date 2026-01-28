# API Configuration - Complete Setup Guide

## Quick Start

```bash
# 1. Verify everything is configured correctly
npm run verify:setup

# 2. Start both frontend and proxy server together
npm run dev:all
```

## What You Need

### 1. Google Gemini API Key

Get your free API key from: **https://aistudio.google.com/apikey**

### 2. Store it in `.env.local`

Create or update `c:\Users\ceo\OneDrive\Desktop\stylish\virtual-stylist\.env.local`:

```bash
API_KEY=your_actual_api_key_here
```

**⚠️ IMPORTANT:**
- Never commit `.env.local` to git
- Never share your API key publicly
- Keep backups of your key

## How It Works

```
Browser (http://localhost:5174)
    ↓ calls /api/gemini-proxy
    ↓ (Vite dev proxy)
    ↓
Local Proxy Server (http://localhost:3000)
    ↓ uses API_KEY from .env.local
    ↓
Google Gemini API
```

## Troubleshooting

### Error: "API key not configured on server"

1. **Check .env.local exists:**
   ```bash
   Test-Path -Path ".\.env.local"  # Windows
   ```

2. **Verify API_KEY is set:**
   ```bash
   # On Windows PowerShell:
   (Get-Content .env.local | Select-String 'API_KEY=').Line
   ```

3. **Check API key is valid:**
   - Go to https://aistudio.google.com/apikey
   - Verify key hasn't been revoked
   - Regenerate if needed

4. **Restart dev:all:**
   ```bash
   npm run dev:all
   ```

### Error: "Rate limit exceeded"

- Wait 60 seconds and try again
- Check your API quota at https://aistudio.google.com

### Error: "Invalid API key"

1. Regenerate key from https://aistudio.google.com/apikey
2. Update `.env.local` with new key
3. Restart dev:all

### Proxy server won't start

Check if port 3000 is in use:

```bash
# On Windows PowerShell:
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
```

If in use, either:
- Kill the process: `taskkill /PID <PID> /F`
- Or use alt port: `npm run dev -- --port 5174`

## Available Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Frontend only (http://localhost:5173/5174) |
| `npm run dev:all` | **Frontend + Proxy together** (recommended) |
| `npm run start:api` | Proxy server only (http://localhost:3000) |
| `npm run verify:setup` | Check configuration before starting |
| `npm run build` | Production build |

## Security Notes

### For Development
- `.env.local` contains your API key and is gitignored ✅
- Keys are never exposed to the browser ✅
- All API calls go through your local proxy ✅

### For Production
- Use Vercel environment variables
- Or deploy proxy to a private server
- Never commit API keys to git

## Questions?

Check these files:
- Proxy config: [server/proxy-server.mjs](../../server/proxy-server.mjs)
- Frontend config: [vite.config.ts](../../vite.config.ts)
- Service layer: [services/geminiService.ts](../../services/geminiService.ts)

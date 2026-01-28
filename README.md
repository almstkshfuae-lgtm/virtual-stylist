<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1YsOrqPoGzy7ZluonQ12x5QqiX7xwpEoP

## Run Locally

**Prerequisites:**  Node.js (v18+)

### Quick Start (with API Proxy)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set your API key** in [.env.local](.env.local):
   ```
   API_KEY=your-google-ai-studio-key
   ```

3. **Start the API proxy** (Terminal 1):
   ```bash
   npm run start:api
   ```
   This keeps your API key server-side. The proxy listens on `http://localhost:3000`.

4. **Start the frontend** (Terminal 2):
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5175`.

5. **Open the app**: Visit `http://localhost:5175` in your browser.

### What's Included

- **✅ Web App**: React + TypeScript + Vite (runs on `http://localhost:5175`)
- **✅ API Proxy**: Express server keeps API key off the frontend (runs on `http://localhost:3000`)
- **✅ Convex Backend**: Database for user profiles, saved outfits, chat history (runs on `http://127.0.0.1:3210`)
- **✅ Vercel Deployment**: Serverless proxy for production (auto-deploys on GitHub push)
- **✅ Android App**: Capacitor integration ready for Google Play
- **✅ CI/CD**: GitHub Actions workflows for build, deploy, and publish

### Documentation

- [Setup Guide](SETUP_GUIDE.md) — Detailed web and Android setup
- [Deployment Guide](DEPLOYMENT_GUIDE.md) — Deploy to Vercel and Google Play
- [Deployment Status](DEPLOYMENT_STATUS.md) — Current status and next steps
- [GitHub Secrets Setup](GITHUB_SECRETS_SETUP.md) — Configure CI/CD secrets

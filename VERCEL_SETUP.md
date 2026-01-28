# Vercel Deployment Setup - Step by Step

This guide walks you through deploying your Virtual Stylist AI app to Vercel with automatic CI/CD.

## Overview

Your app is now in GitHub with a Vercel deployment workflow. You have two options:

### Option A: Vercel Dashboard (Easiest - Recommended) ⭐
- **Time**: ~5 minutes
- **Auto-deploys**: Every push to `main`
- **No secrets to manage**: Vercel handles environment variables

### Option B: GitHub Actions + Vercel Token
- **Time**: ~10 minutes
- **More control**: Can manage secrets in GitHub
- **Requires**: Manual token setup

---

## Option A: Vercel Dashboard (Recommended)

### Step 1: Create Vercel Account
1. Go to https://vercel.com/signup
2. Sign up with GitHub (easiest - grants access to your repos)
3. Verify your email

### Step 2: Import Your GitHub Repository
1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Find and select `almstkshfuae-lgtm/virtual-stylist`
4. Click **"Import"**

### Step 3: Add Environment Variables
1. In the import dialog, you'll see **"Environment Variables"** section
2. Click **"Add"** and fill in:
   - **Name**: `API_KEY`
   - **Value**: `AIzaSyDTwN5vmJdvq6cERfCtQilc070Dl2QeqWk` (your Google AI key)
   - **Environments**: Select `Production`, `Preview`, and `Development`
3. Click **"Add New"** if you have other variables to set
4. Click **"Deploy"**

### Step 4: Wait for Deployment
- Vercel will build and deploy your app
- You'll see a deployment URL like: `https://virtual-stylist-xxxx.vercel.app`
- Click the URL to visit your live app

### Step 5: Enable Auto-Deployments
By default, Vercel auto-deploys when you push to `main`. To verify:
1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Git"**
3. Confirm **"Deploy on push"** is enabled for the `main` branch

### Step 6: Future Deployments
Now every time you push to GitHub:
```bash
git push origin main
```
Vercel automatically rebuilds and deploys your app. ✨

---

## Option B: GitHub Actions + Vercel Token

### Step 1: Create Vercel Token
1. Go to https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name it: `Virtual Stylist Deploy`
4. Copy the token (you'll use it next)

### Step 2: Get Vercel Project IDs
1. Go to https://vercel.com/dashboard
2. Click on your project (or create one first)
3. Go to **Settings** → **General**
4. Copy and save:
   - **Project ID**: (looks like `prj_abc123...`)
   - **Org ID**: (looks like `team_xyz789...`)

### Step 3: Add GitHub Secrets
1. Go to your GitHub repo: https://github.com/almstkshfuae-lgtm/virtual-stylist
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add these three:

   **Secret 1:**
   - Name: `VERCEL_TOKEN`
   - Value: (paste the token from Step 1)
   - Click **"Add secret"**

   **Secret 2:**
   - Name: `VERCEL_ORG_ID`
   - Value: (your Org ID from Step 2)
   - Click **"Add secret"**

   **Secret 3:**
   - Name: `VERCEL_PROJECT_ID`
   - Value: (your Project ID from Step 2)
   - Click **"Add secret"**

### Step 4: Trigger the Workflow
1. Make a small change to the repo (e.g., update README.md)
2. Push to main:
   ```bash
   git push origin main
   ```
3. Go to **Actions** tab in GitHub
4. Watch the **"Deploy to Vercel"** workflow run
5. Once complete, you'll see a Vercel deployment URL

---

## Verify Your Deployment

### Test the Web App
1. Visit your Vercel URL
2. Try uploading an image
3. Test the outfit generation
4. Confirm the app is working

### Check the Logs
If deployment fails:
1. Go to your Vercel project dashboard
2. Click **"Deployments"**
3. Click the failed deployment
4. Click **"Logs"** to see error messages
5. Common issues:
   - Missing `API_KEY` environment variable
   - Invalid API key (check it's not expired)
   - Network errors (usually temporary)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"API key not valid"** | Check the `API_KEY` env var in Vercel project settings. Verify it matches your `.env.local`. |
| **Build fails with "Module not found"** | Run `npm install` locally, ensure `package.json` is committed. |
| **Deployment stuck** | Wait 5-10 minutes. If still stuck, cancel and redeploy from the Vercel dashboard. |
| **App works locally but not on Vercel** | Check that `API_KEY` is set in Vercel (Settings → Environment Variables). |

---

## Next Steps

- ✅ **Web deployed to Vercel**
- 📱 **Optional**: Deploy Android app to Google Play (see `GOOGLE_PLAY_SETUP.md`)
- 🔄 **Keep pushing**: Every push to `main` auto-deploys

---

## Quick Reference

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Repo**: https://github.com/almstkshfuae-lgtm/virtual-stylist
- **Deployment Docs**: https://vercel.com/docs

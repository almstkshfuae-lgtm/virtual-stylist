# GitHub Secrets & Deployment Setup

This guide walks you through setting up GitHub secrets for CI/CD deployments to Vercel and Google Play.

## Prerequisites

You need:
1. A GitHub repository (push this code there first)
2. A Vercel account and project (for web deployment)
3. A Google Play Console account (for Android deployment)
4. Valid `API_KEY` from Google AI Studio with billing enabled

## Step 1: Push code to GitHub

```bash
git init
git add .
git commit -m "Initial commit with CI/CD workflows"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Step 2: Vercel Secrets (Web Deployment)

### Option A: Connect via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Set environment variables in Vercel project settings:
   - `API_KEY` = your Google AI Studio API key
4. Click "Deploy"
5. Vercel will auto-deploy on every push to `main`

### Option B: GitHub Actions + Vercel Token

If you prefer GitHub Actions to deploy:

1. Create a Vercel token:
   - https://vercel.com/account/tokens
   - Copy the token

2. Get your Vercel IDs:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login
   vercel login
   
   # Link project (follow prompts)
   vercel link
   
   # Show org/project IDs
   cat .vercel/project.json
   ```
   You'll see:
   ```json
   {
     "orgId": "...",
     "projectId": "..."
   }
   ```

3. Add GitHub secrets:
   - Go to: GitHub repo → Settings → Secrets and variables → Actions → New repository secret
   - Add these three secrets:
     - `VERCEL_TOKEN` = (your token from step 1)
     - `VERCEL_ORG_ID` = (orgId from step 2)
     - `VERCEL_PROJECT_ID` = (projectId from step 2)

4. Push to `main` — the `deploy-vercel.yml` workflow will deploy

## Step 3: Google Play Secrets (Android Deployment)

### Create a Google Play Service Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app or select an existing one
3. In left sidebar → Settings → API access
4. Click "Create Service Account"
5. It opens Google Cloud Console — create a new service account:
   - Name: `virtual-stylist-release`
   - Grant role: `Service Account Admin` (or `Editor` for testing)
6. Create a JSON key:
   - Go to the service account → Keys → Add Key → JSON
   - Download the JSON file
7. Back in Play Console, grant the service account the `Release Manager` role:
   - In API access section, link the service account and assign roles

### Add to GitHub Secrets

1. Open the downloaded JSON file in a text editor
2. Copy the entire JSON contents
3. Go to GitHub repo → Settings → Secrets and variables → Actions → New repository secret
4. Create secret:
   - Name: `GOOGLE_PLAY_SERVICE_ACCOUNT`
   - Value: (paste the entire JSON)

## Step 4: Verify Workflows

### Web (Vercel)

Push to `main`:
```bash
git push origin main
```

Then:
- GitHub Actions: https://github.com/<your-username>/<repo>/actions → `Deploy to Vercel`
- Check Vercel: https://vercel.com/dashboard → your project → Deployments

### Android (Google Play)

The workflow requires the `android/` directory and Play Console setup:

1. Locally, add Android (if not already done):
   ```bash
   npm run build:web
   npx cap add android
   npx cap sync android
   ```

2. Configure signing in `android/app/build.gradle`:
   ```gradle
   android {
       signingConfigs {
           release {
               keyAlias 'android-key'
               keyPassword 'YOUR_KEY_PASSWORD'
               storeFile file('android-keystore.jks')
               storePassword 'YOUR_KEYSTORE_PASSWORD'
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
           }
       }
   }
   ```

3. Generate keystore (run once, locally):
   ```bash
   keytool -genkey -v -keystore android-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias android-key
   ```
   Add the .jks file to your local `.gitignore` and reference it in the gradle config or CI secrets.

4. Push to `main`:
   ```bash
   git push origin main
   ```

5. Workflow will run:
   - GitHub Actions: https://github.com/<your-username>/<repo>/actions → `Android - Build AAB and Upload to Google Play`
   - Check Play Console → Your app → Releases → Internal testing

## Step 5: Local Development

### Running the App Locally with Proxy

```bash
# Terminal 1 - Start the local API proxy
npm install
npm run start:api

# Terminal 2 - Start the frontend
npm run dev
```

Visit http://localhost:5173 — the app calls `http://localhost:3000/api/gemini-proxy` for Gemini requests.

### Building Android Locally

```bash
npm run build:web
npm run cap:sync:android
npm run android:build:aab
# AAB will be at: android/app/build/outputs/bundle/release/app-release.aab
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Vercel deployment fails | Check that `API_KEY` is set in Vercel project env vars. Ensure it's a valid Google Cloud API key with Generative Language API enabled. |
| Android workflow fails | Ensure `android/` exists and keystore/signing is configured. Check that `GOOGLE_PLAY_SERVICE_ACCOUNT` secret is valid JSON with correct permissions. |
| Local proxy returns error | Ensure `.env.local` has `API_KEY=...` set. Run `npm install` to ensure `express`, `dotenv` are installed. |

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and linked (Option A or B)
- [ ] `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets added (if using Option B)
- [ ] Google Play service account created and JSON downloaded
- [ ] `GOOGLE_PLAY_SERVICE_ACCOUNT` secret added to GitHub
- [ ] Android keystore generated and configured in `android/app/build.gradle`
- [ ] Local proxy tested with `npm run start:api`
- [ ] Frontend tested locally with `npm run dev`

---

Once all secrets are set, push to `main` and watch the workflows run!

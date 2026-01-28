# Deployment & CI Guide

This document explains how to connect the repo to GitHub, deploy the web app to Vercel, and publish the Android app to Google Play using CI.

## GitHub
1. Create a new repository on GitHub and push this project:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-org-or-username>/<repo>.git
git push -u origin main
```

2. The repository already contains GitHub Actions workflows:
- `.github/workflows/ci.yml` — builds the web site and uploads `dist/` as an artifact.
- `.github/workflows/deploy-vercel.yml` — builds and deploys to Vercel using a Vercel token.
- `.github/workflows/android-deploy.yml` — builds an Android AAB and can upload to Google Play.

## Vercel (Web)
Preferred: connect your GitHub repo to Vercel through Vercel dashboard (recommended for automatic preview & production deployments).

Required Vercel secrets (if using the GitHub Action approach):
- `VERCEL_TOKEN` — personal Vercel token (create in Vercel settings -> Tokens)
- `VERCEL_ORG_ID` — org id for the project
- `VERCEL_PROJECT_ID` — project id

To set up via Vercel dashboard (recommended):
1. Go to https://vercel.com/new and connect your GitHub repo.
2. Set environment variables in the Vercel project settings:
   - `API_KEY` (RECOMMENDED: do NOT expose production API_KEY in client builds; instead configure a server-side proxy or Vercel Edge Function to keep the key secret)
3. Vercel will automatically build and deploy on pushes to `main`.

If you prefer GitHub Actions (already provided): the action uses `amondnet/vercel-action` and expects the three secrets above.

## Google Play (Android)

This project uses Capacitor for converting the web app into an Android app. Follow these steps locally first:

1. Install Capacitor & add Android platform:

```bash
npm install @capacitor/cli --save-dev
npm run build:web
npx cap add android
npx cap sync android
```

2. Open Android Studio:

```bash
npx cap open android
```

3. Configure signing and versioning in `android/app/build.gradle` (set `versionCode` and `versionName`) and add a signing config for release.

4. Generate a release AAB locally to verify before CI:

```bash
cd android
./gradlew bundleRelease
# AAB will be at: android/app/build/outputs/bundle/release/app-release.aab
```

5. To upload to Google Play via CI, create a Google Play service account and grant it `Release Manager` (or appropriate) role. Download the JSON key file.

6. In GitHub repository secrets, add:
- `GOOGLE_PLAY_SERVICE_ACCOUNT` — contents of the JSON service account file

7. The workflow `.github/workflows/android-deploy.yml` will build the AAB and upload it using `r0adkll/upload-google-play` when `GOOGLE_PLAY_SERVICE_ACCOUNT` is present.

Notes and security:
- Do not store production API keys in the frontend. Use a server-side endpoint, Vercel Serverless Function, or Edge Function to keep keys secret and forward requests to the Generative Language API.

## Secrets Recap (GitHub repository -> Settings -> Secrets)
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `GOOGLE_PLAY_SERVICE_ACCOUNT` (JSON contents)

## Quick checks after setup
- Push to `main` and confirm the `CI - Build` workflow completes successfully.
- Confirm Vercel deploys (if connected) or that the `Deploy to Vercel` workflow runs and returns a Vercel deployment URL.
- For Android, confirm the `android-deploy.yml` completes and the Play Console shows the uploaded AAB.

---

If you'd like, I can:
- Add a server-side proxy (Express) and a GitHub Action to deploy it as an API to Vercel (recommended).
- Run the first deploy step for you (create a PR that configures the workflows further) if you provide the Vercel and Google Play secrets.

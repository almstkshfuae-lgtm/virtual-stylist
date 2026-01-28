# Google Play Setup - Step by Step

This guide walks you through publishing your Virtual Stylist AI Android app to Google Play.

## Overview

Your app has GitHub Actions workflows to automatically build and publish Android AABs to Google Play. You'll need:
1. A Google Play Console account
2. A Google Play app project
3. A service account with release permissions
4. The service account JSON key (added to GitHub secrets)

---

## Step 1: Create/Access Google Play Console

### If you don't have a Play Console account:
1. Go to https://play.google.com/console
2. Click **"Create account"**
3. Accept the terms and pay the $25 registration fee (one-time)
4. Verify your Google identity

### If you already have one:
1. Go to https://play.google.com/console
2. Sign in with your Google account

---

## Step 2: Create an App in Play Console

1. Click **"Create app"** (or use existing app)
2. Fill in:
   - **App name**: `Virtual Stylist AI`
   - **Default language**: `English`
   - **App type**: `Apps`
   - **Category**: `Lifestyle` or `Shopping`
3. Accept declarations
4. Click **"Create app"**

---

## Step 3: Create Google Cloud Project (for service account)

Your Play Console account is linked to a Google Cloud project. You need to create a service account in that project.

### Option A: From Play Console (Easiest)
1. In Play Console, go left sidebar → **Settings** → **API access**
2. Scroll to **"Service accounts"**
3. Click **"Google Cloud Console"** link (opens Cloud Console)

### Option B: Direct to Google Cloud
1. Go to https://console.cloud.google.com
2. Create a new project or select existing one (usually auto-linked to Play Console)

---

## Step 4: Create Service Account

### In Google Cloud Console:
1. Go to **APIs & Services** → **Service accounts**
2. Click **"Create Service Account"**
3. Fill in:
   - **Service account name**: `virtual-stylist-release`
   - **Service account ID**: Auto-filled (e.g., `virtual-stylist-release@...`)
   - **Description**: `Release manager for Virtual Stylist AI`
4. Click **"Create and Continue"**
5. Skip the optional steps
6. Click **"Create Service Account"**

### Grant Permissions:
1. Click the newly created service account
2. Go to **"Roles"** tab
3. Click **"Add Role"** and search for:
   - Role: `Service Account Admin` (for testing) OR
   - Role: `Editor` (for full access)
4. Click **"Save"**

---

## Step 5: Create JSON Key

1. In the service account page, go to **"Keys"** tab
2. Click **"Add Key"** → **"Create new key"**
3. Choose **"JSON"**
4. Click **"Create"**
5. A JSON file will download automatically
6. **Save this file securely** — you'll need it next

---

## Step 6: Link Service Account to Play Console

1. Go back to Play Console → **Settings** → **API access**
2. In the **"Service accounts"** section, you should see your new service account
3. Click on it
4. Under **"Roles"**, assign:
   - ✅ **Release Manager** (allows uploading AABs)
   - ✅ **View app information** (allows reading build status)
5. Click **"Invite user"** or **"Apply"** (depending on interface)

---

## Step 7: Add JSON Key to GitHub Secrets

Now the CI/CD workflow can upload AABs automatically.

### Get the JSON Content:
1. Open the JSON key file you downloaded in Step 5
2. Select all content (Ctrl+A) and copy it

### Add to GitHub:
1. Go to GitHub repo: https://github.com/almstkshfuae-lgtm/virtual-stylist
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Fill in:
   - **Name**: `GOOGLE_PLAY_SERVICE_ACCOUNT`
   - **Value**: (paste the entire JSON content)
5. Click **"Add secret"**

---

## Step 8: Configure Android Signing

Before the workflow can build a release AAB, you need a signing configuration.

### Generate Keystore (Run Locally Once):
```bash
keytool -genkey -v -keystore android-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias android-key
```

When prompted:
- **Keystore password**: Create a strong password (e.g., `MySecurePass123!`)
- **Key password**: Same as keystore password
- **First and last name**: Your name
- **Organizational unit**: `Development`
- **Organization**: `Stylish`
- **City**: Your city
- **State**: Your state
- **Country**: Your country code (e.g., `US`)

This creates `android-keystore.jks` in your project.

### Add to GitHub Secrets:
1. Convert keystore to base64:
   ```bash
   certutil -encodehex -f android-keystore.jks android-keystore.b64
   ```
2. Open `android-keystore.b64` and copy the content
3. GitHub → **Settings** → **Secrets** → **New secret**:
   - Name: `ANDROID_KEYSTORE`
   - Value: (base64 content)
4. Add these secrets too:
   - `ANDROID_KEYSTORE_PASSWORD`: `MySecurePass123!`
   - `ANDROID_KEY_ALIAS`: `android-key`
   - `ANDROID_KEY_PASSWORD`: `MySecurePass123!`

### Update Gradle Config:
Edit `android/app/build.gradle`:
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

---

## Step 9: Build and Upload from CI

Once everything is set up, the workflow runs automatically:

### Trigger:
1. Ensure you have:
   - `GOOGLE_PLAY_SERVICE_ACCOUNT` secret in GitHub
   - Signed Android app (`android/` directory configured)
2. Push to `main`:
   ```bash
   git push origin main
   ```

### Monitor:
1. Go to GitHub → **Actions** tab
2. Watch **"Android - Build AAB and Upload to Google Play"** workflow
3. Once completed (✅), check Play Console

### In Play Console:
1. Go to your app
2. Left sidebar → **Release** → **Internal testing**
3. You should see the newly uploaded AAB

---

## Step 10: Submit for Review

Once the AAB is uploaded to Play Console:

1. Go **Release** → **Production**
2. Click **"New Release"**
3. Select the AAB from Internal testing
4. Add **Release notes** (e.g., "Initial launch of Virtual Stylist AI")
5. Click **"Review"**
6. Review the app details (icon, screenshots, description, etc.)
7. Click **"Submit for Review"**
8. Google will review your app (typically 1-3 days)
9. Once approved, your app goes live on Google Play! 🎉

---

## App Store Listing

Before submitting, you'll need to complete:

### Content Rating:
1. Go **Setup** → **Content Rating**
2. Fill in the questionnaire
3. Get your content rating

### App Listing:
1. Go **Setup** → **App content**
2. Add:
   - **App name**: `Virtual Stylist AI`
   - **Short description**: `AI-powered fashion styling app`
   - **Full description**: Detailed description of features
   - **Screenshots**: Upload app screenshots (min 2, up to 8 per device type)
   - **Feature graphic**: 1024x500 PNG
   - **Icon**: 512x512 PNG

### Pricing:
1. Go **Setup** → **Pricing & distribution**
2. Select: **Free** or **Paid**
3. Choose countries

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Service account not found"** | Ensure service account is created in Google Cloud and linked in Play Console. |
| **"Permission denied" when uploading** | Verify service account has `Release Manager` role in Play Console. |
| **AAB upload fails in workflow** | Check that `GOOGLE_PLAY_SERVICE_ACCOUNT` secret contains valid JSON. |
| **Build fails: "Signing config not found"** | Ensure `android/app/build.gradle` has signing configuration. |
| **App rejected after submission** | Check Play Console for rejection reasons, fix, and resubmit. |

---

## Quick Reference

- **Play Console**: https://play.google.com/console
- **Google Cloud Console**: https://console.cloud.google.com
- **Play Store**: https://play.google.com/store/apps/details?id=com.stylish.virtualstylist
- **App Policies**: https://play.google.com/about/developer-content-policy

---

## Next Steps

- ✅ **Web deployed** (Vercel)
- ✅ **Android configured** (Google Play)
- 🔄 **Every push to `main` auto-deploys** both web and Android

Your app is now production-ready! 🚀

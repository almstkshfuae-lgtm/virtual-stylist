# Virtual Stylist AI - Complete Setup Guide

## Project Overview
**Virtual Stylist AI** is an AI-powered fashion styling application powered by Google Gemini API. The project is configured as:
- **Primary**: Web Application (React + TypeScript + Vite)
- **Secondary**: Android App (React Native / Capacitor-ready)

---

## ✅ Current Environment Status

### Completed Setup Steps
1. ✅ **Created `.env.local`** - API key configuration file
2. ✅ **Installed Dependencies** - All npm packages ready
3. ✅ **Verified Project Structure** - TypeScript, Tailwind CSS, Vite configured
4. ✅ **Development Server Running** - Available at `http://localhost:5173/`

---

## 🌐 Web App Setup

### Quick Start

#### 1. Environment Configuration
The `.env.local` file is created. Add your Gemini API key:

```
API_KEY=your_gemini_api_key_here
```

**Get your API key:**
- Visit: https://ai.studio
- Create/view your app: https://ai.studio/apps/drive/1YsOrqPoGzy7ZluonQ12x5QqiX7xwpEoP
- Generate API key from Google AI Studio

#### 2. Development Server
```bash
npm run dev
```
- Opens at: `http://localhost:5173/`
- Hot reload enabled for rapid development
- All TypeScript checks enforced

#### 3. Production Build
```bash
npm run build
```
- Creates optimized build in `dist/` folder
- Uses Vite for fast compilation
- Minified and tree-shaken

#### 4. Preview Production Build
```bash
npm run preview
```
- Test production build locally

### Key Web Technologies
- **Framework**: React 19.0.0
- **Language**: TypeScript 5.2.0
- **Build Tool**: Vite 5.2.0
- **Styling**: Tailwind CSS 3.4.3
- **AI**: Google Generative AI (@google/genai 1.38.0)
- **Icons**: Custom SVG icon components

### Project Structure
```
components/          # React components
├── BodyShapeSelector.tsx
├── Chatbot.tsx
├── CombinationCard.tsx
├── ImageUploader.tsx
├── ItemCollection.tsx
├── LandingPage.tsx
├── OutfitCard.tsx
├── RejectedStyleCard.tsx
├── StyleSelector.tsx
├── TrendAnalysisModal.tsx
├── StoreLocatorModal.tsx
└── icons/          # Icon components

services/
├── geminiService.ts  # Google Gemini API integration

i18n/
├── LanguageContext.tsx
├── translations.ts   # Multi-language support

theme/
├── ThemeContext.tsx  # Dark/Light theme

App.tsx              # Main app component
index.tsx            # Entry point
types.ts             # TypeScript type definitions
```

### Available Features
- 📸 **Image Upload**: Clothing item recognition
- 🎨 **Style Selection**: User preference selection
- 👕 **Outfit Generation**: AI-powered outfit combinations
- 💬 **Chatbot**: Interactive styling advice
- 🏪 **Store Locator**: Find clothing stores nearby
- 📊 **Trend Analysis**: Fashion trend insights
- 🌍 **Multi-language**: International support
- 🌙 **Dark Mode**: Theme toggle

---

## 📱 Android App Setup (React Native / Capacitor)

### Prerequisites for Android Development
- **Node.js**: v18+ (already installed)
- **Java Development Kit (JDK)**: 11 or higher
- **Android SDK**: API 24 or higher
- **Android Studio**: Latest version recommended
- **Gradle**: 7.0 or higher

### Installation Steps

#### 1. Install Capacitor CLI (if not already installed)
```bash
npm install -g @capacitor/cli
```

#### 2. Add Android Platform
```bash
# From project root
npx cap add android
```
This creates an `android/` directory with native Android project.

#### 3. Install Android Dependencies
```bash
# Open Android project in Android Studio
npx cap open android

# Or sync from command line
npx cap sync android
```

#### 4. Build Web Assets for Android
```bash
npm run build
npx cap sync android
```

#### 5. Develop in Android Studio
1. Open Android Studio
2. Open: `android/` folder
3. Select Device/Emulator
4. Click "Run" or press `Shift + F10`

#### 6. Live Reload (Development)
```bash
npm run dev
npx cap open android

### Local API Proxy (development)

To keep your API key off the frontend, a server-side proxy is provided for Vercel and for local development.

- For Vercel, there's a serverless endpoint at `/api/gemini-proxy` which the frontend calls. Set `API_KEY` in the Vercel project environment variables.
- Locally, run the Express proxy in a separate terminal:

```bash
# install new deps
npm install

# start the local API proxy
npm run start:api

# start the frontend in another terminal
npm run dev
```

The local proxy reads `API_KEY` from `.env.local`.
```
│       │   ├── AndroidManifest.xml
│       │   └── java/
│       │       └── MainActivity.java
│       └── test/
├── build.gradle
└── settings.gradle

capacitor.config.ts      # Capacitor configuration
```

### Android Configuration

#### Update `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stylish.virtualstylist',
  appName: 'Virtual Stylist AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
```

#### Update `android/app/build.gradle`:
```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.stylish.virtualstylist"
        minSdkVersion 24
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

### Android Permissions (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### Building APK for Android
```bash
# Build web assets
npm run build

# Sync to Android
npx cap sync android

# Build from Android Studio OR use Gradle
cd android
./gradlew assembleDebug      # Debug APK
./gradlew assembleRelease    # Release APK

# APK will be in: android/app/build/outputs/apk/
```

### Testing on Emulator
```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_4_API_31

# Or use Android Studio's Device Manager

# Deploy to emulator
npx cap open android
# Click Run in Android Studio
```

### Testing on Physical Device
1. **Enable USB Debugging**:
   - Go to Settings → About phone
   - Tap "Build number" 7 times
   - Go to Developer options
   - Enable "USB Debugging"

2. **Connect Device** via USB cable

3. **Deploy**:
   ```bash
   # Verify device connected
   adb devices
   
   # Deploy APK
   adb install path/to/app-debug.apk
   ```

---

## 🔑 API Configuration

### Gemini API Key Setup
1. Visit: https://ai.studio
2. Sign in with Google account
3. View your app: https://ai.studio/apps/drive/1YsOrqPoGzy7ZluonQ12x5QqiX7xwpEoP
4. Generate/copy API key
5. Add to `.env.local`:
   ```
   API_KEY=your_key_here
   ```

### API Features Used
- **Image Analysis**: Clothing item recognition
- **Text Generation**: Style recommendations
- **Chat**: Interactive chatbot
- **Trend Analysis**: Fashion insights
- **Store Location**: Location-based services

---

## 🚀 Development Workflow

### Web Development
```bash
# Start dev server
npm run dev

# In another terminal - build watching
npm run build -- --watch

# Run tests (if configured)
npm test
```

### Android Development
```bash
# 1. Build web assets
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Open in Android Studio
npx cap open android

# 4. Run on device/emulator from Android Studio
```

### Docker Deployment (Production)
```bash
# Build Docker image
docker build -t virtual-stylist:latest .

# Run container
docker run -p 80:80 -e API_KEY=your_key virtual-stylist:latest

# Available at: http://localhost
```

---

## 📋 Troubleshooting

### Web Issues
| Issue | Solution |
|-------|----------|
| `API_KEY not set` | Check `.env.local` file exists with `API_KEY=...` |
| Port 5173 in use | Change port: `npm run dev -- --port 3000` |
| Module not found | Run `npm install` again |
| TypeScript errors | Run `npm run build` to see full errors |

### Android Issues
| Issue | Solution |
|-------|----------|
| Android SDK not found | Install via Android Studio SDK Manager |
| Gradle build fails | Run `./gradlew clean build` in android/ |
| Device not detected | Enable USB debugging & run `adb devices` |
| API key issues | Verify in Capacitor runtime config |

---

## 📚 Resources

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Google Generative AI**: https://ai.google.dev
- **Capacitor**: https://capacitorjs.com
- **Android Development**: https://developer.android.com
- **AI Studio**: https://ai.studio

---

## 📝 Environment Variables

```env
# Required
API_KEY=your_gemini_api_key

# Optional (with defaults)
VITE_API_BASE=https://generativelanguage.googleapis.com
```

---

## 🎯 Next Steps

1. ✅ **Add Gemini API Key** to `.env.local`
2. ✅ **Start Development Server**: `npm run dev`
3. ✅ **Install Android SDK** (for mobile dev)
4. ✅ **Setup Capacitor** for Android
5. ✅ **Test on Emulator/Device**
6. ✅ **Deploy to Production**

---

**Last Updated**: January 28, 2026
**Project**: Virtual Stylist AI
**Version**: 0.0.1

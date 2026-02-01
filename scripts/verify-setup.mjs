#!/usr/bin/env node
/**
 * Startup verification script - ensures all required configuration is in place
 * Run this before starting dev:all to catch configuration issues early
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const envPath = path.resolve(rootDir, '.env.local');

console.log('\n🔍 Virtual Stylist - Configuration Verification\n');
console.log('━'.repeat(60));

let allGood = true;

// Check .env.local exists
if (!fs.existsSync(envPath)) {
  console.error('❌ CRITICAL: .env.local not found');
  console.error(`   Expected at: ${envPath}`);
  allGood = false;
} else {
  console.log('✅ .env.local found');
}

// Load and check API_KEY
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  dotenv.config({ path: envPath });
}

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error('❌ CRITICAL: API_KEY not set in .env.local');
  console.error('   Add this line to .env.local:');
  console.error('   API_KEY=your_google_genai_api_key');
  allGood = false;
} else if (apiKey.length < 10) {
  console.error('❌ CRITICAL: API_KEY is too short (invalid format)');
  allGood = false;
} else {
  console.log(`✅ API_KEY is configured (length: ${apiKey.length} characters)`);
}


// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion < 16) {
  console.error(`❌ Node.js ${nodeVersion} is too old (requires 16+)`);
  allGood = false;
} else {
  console.log(`✅ Node.js ${nodeVersion} is compatible`);
}

// Check required dependencies
const packageJsonPath = path.resolve(rootDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const required = ['@google/genai', 'express', 'dotenv'];
  const installed = Object.keys(packageJson.dependencies || {});
  
  let depsOk = true;
  required.forEach(dep => {
    if (!installed.includes(dep)) {
      console.error(`❌ Missing dependency: ${dep}`);
      depsOk = false;
      allGood = false;
    }
  });
  
  if (depsOk) {
    console.log(`✅ All required dependencies are listed`);
  }
}

console.log('━'.repeat(60));

if (allGood) {
  console.log('\n✨ All checks passed! Ready to start dev:all\n');
  process.exit(0);
} else {
  console.error('\n❌ Configuration issues detected. Please fix the above errors.\n');
  console.error('Quick fix: Make sure .env.local has a valid API_KEY\n');
  process.exit(1);
}

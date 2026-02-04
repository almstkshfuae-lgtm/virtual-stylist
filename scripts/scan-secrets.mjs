#!/usr/bin/env node
/**
 * Lightweight secret scanner to catch hard-coded credentials before deploys.
 * Exits non-zero if a high-risk pattern is found.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const skipDirs = new Set([
  '.git',
  'node_modules',
  'dist',
  '.vercel',
  '.turbo',
  '.next',
  'build',
  '.cache',
]);

const patterns = [
  { name: 'OpenAI key', regex: /sk-[A-Za-z0-9]{20,}/g },
  { name: 'Google API key', regex: /AIza[0-9A-Za-z\\-_]{15,}/g },
  { name: 'GitHub token', regex: /gh[pous]_[A-Za-z0-9]{20,}/g },
  { name: 'GitHub fine-grained token', regex: /github_pat_[A-Za-z0-9]{20,}/g },
  { name: 'Generic PAT', regex: /pat_[A-Za-z0-9]{20,}/g },
  { name: 'JWT-like token', regex: /eyJ[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}/g },
  { name: 'Private key block', regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
];

const findings = [];
const maxSizeBytes = 512 * 1024;

const walk = async (dir) => {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (entry.isFile()) {
      await scanFile(fullPath);
    }
  }
};

const scanFile = async (fullPath) => {
  const stat = await fs.promises.stat(fullPath);
  if (stat.size > maxSizeBytes) return;
  const content = await fs.promises.readFile(fullPath, 'utf8').catch(() => null);
  if (!content || content.includes('\u0000')) return; // skip binary

  for (const { name, regex } of patterns) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const before = content.slice(0, match.index);
      const line = before.split('\n').length;
      const relPath = path.relative(rootDir, fullPath);
      findings.push({
        type: name,
        path: relPath,
        line,
        sample: match[0].slice(0, 80),
      });
    }
  }
};

const run = async () => {
  await walk(rootDir);

  if (findings.length === 0) {
    console.log('✅ No high-risk secrets detected in scanned files.');
    return;
  }

  console.error('❌ Potential secrets found:');
  for (const f of findings) {
    console.error(` - [${f.type}] ${f.path}:${f.line} :: ${f.sample}`);
  }
  console.error('\nReview the files above and replace secrets with environment variables.');
  process.exit(1);
};

run().catch((err) => {
  console.error('Secret scan failed:', err);
  process.exit(1);
});

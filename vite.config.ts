import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Keep the shared API secret in sync for both server (API_SECRET / VERCEL_API_SECRET)
  // and client (VITE_API_SECRET). If they diverge, the proxy will 401 after a redeploy.
  const serverSecret = env.API_SECRET || env.VERCEL_API_SECRET;
  let clientSecret = env.VITE_API_SECRET;

  if (serverSecret && clientSecret && serverSecret !== clientSecret) {
    throw new Error(
      'API secret mismatch: VITE_API_SECRET must match API_SECRET (or VERCEL_API_SECRET). ' +
      'Update your env vars so they are identical, then redeploy.'
    );
  }

  if (!clientSecret && serverSecret) {
    clientSecret = serverSecret;
    process.env.VITE_API_SECRET = serverSecret;
    env.VITE_API_SECRET = serverSecret;
    console.log('Synced VITE_API_SECRET from API_SECRET so both client and server share the same token.');
  }

  if (!env.VITE_API_SECRET) {
    // Helpful debug on Vercel: prints presence only (never prints values).
    console.warn(
      `Env check: has API_SECRET=${Boolean(env.API_SECRET)}, ` +
      `has VERCEL_API_SECRET=${Boolean(env.VERCEL_API_SECRET)}, ` +
      `has VITE_API_SECRET=${Boolean(env.VITE_API_SECRET)}`
    );
    console.warn('VITE_API_SECRET is missing; client calls to /api/gemini-proxy will fail until it is set.');
  }

  const convexEnabled = Boolean(env.VITE_CONVEX_URL);
  return {
    plugins: [react()],
    build: {
      minify: 'esbuild',
      cssMinify: 'esbuild',
      target: 'es2020',
      rollupOptions: {
        external: ['./api/**'],
        input: {
          main: './index.html',
        },
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('react')) return 'react';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('lucide-react')) return 'icons';
            // Avoid Rollup "Generated an empty chunk: 'convex'" when Convex is tree-shaken (e.g., no VITE_CONVEX_URL at build time)
            if (convexEnabled && id.includes('convex')) return 'convex';
            if (id.includes('dompurify') || id.includes('marked')) return 'markdown';
            return 'vendor';
          },
        },
      },
      outDir: 'dist',
    },
    server: {
      proxy: {
        '/api/gemini-proxy': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    }
  }
})

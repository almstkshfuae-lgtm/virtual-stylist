import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  const convexEnabled = Boolean(env.VITE_CONVEX_URL);
  return {
    plugins: [react()],
    build: {
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

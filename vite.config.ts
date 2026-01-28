import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('react')) return 'react';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('convex')) return 'convex';
            if (id.includes('dompurify') || id.includes('marked')) return 'markdown';
            return 'vendor';
          },
        },
      },
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

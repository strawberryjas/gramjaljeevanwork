import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer can be added later if needed
  ],
  server: {
    host: '127.0.0.1',
    port: 5178,
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          recharts: ['recharts'],
          i18n: ['i18next', 'react-i18next'],
          ui: ['lucide-react'],
        },
      },
    },
  },
  // Ensure service worker is copied to dist
  publicDir: 'public',
});

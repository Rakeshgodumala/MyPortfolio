import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development the API runs on :5000 and is proxied, so the browser sees one origin
// and the HttpOnly session cookie works without any cross-site settings.
export default defineConfig({
  plugins: [react()],
  // Avoid inheriting PostCSS configuration from parent directories.
  css: {
    postcss: {
      plugins: [],
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 700,
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for the Tata Boutique frontend (deployed to Cloudflare Pages).
// The API base URL is injected via VITE_API_BASE_URL at build time and points
// to the Cloudflare Worker (see src/config/env.ts).
export default defineConfig({
  plugins: [react()],
  // Relative base so the built asset URLs (./assets/...) resolve correctly
  // both under a custom domain root (Cloudflare Pages production) and under
  // a nested preview path (Computer's sandbox preview proxy).
  base: './',
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020',
  },
});

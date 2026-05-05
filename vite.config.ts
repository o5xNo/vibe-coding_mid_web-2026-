import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/vibe-coding_mid_web-2026-/',
  plugins: [react()],
  server: {
    port: 4173,
  },
});

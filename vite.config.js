import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5173 },
  preview: { host: '0.0.0.0', port: 4173 },
  build: {
    target: ['es2018', 'chrome75', 'edge79', 'firefox68', 'safari12.1', 'ios12.2'],
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
          vendor: ['react', 'react-dom', 'lenis', 'canvas-confetti', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    // live counts, testimonials, policies and forms all come from the back-end
    proxy: {
      '/public': { target: 'https://api.quizpe.in', changeOrigin: true },
      '/legal':  { target: 'https://api.quizpe.in', changeOrigin: true },
      '/assets': { target: 'https://api.quizpe.in', changeOrigin: true },
    },
  },
  build: { outDir: 'dist', sourcemap: false },
});

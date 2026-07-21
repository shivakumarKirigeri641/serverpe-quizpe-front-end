import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    // live counts, testimonials, policies and forms all come from the back-end
    proxy: {
      '/public': { target: 'http://localhost:5008', changeOrigin: true },
      '/legal':  { target: 'http://localhost:5008', changeOrigin: true },
      '/assets': { target: 'http://localhost:5008', changeOrigin: true },
    },
  },
  build: { outDir: 'dist', sourcemap: false },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Where `npm run dev` sends API calls. Defaults to the local back-end so a
// developer is never unknowingly reading or writing PRODUCTION data — point it
// at https://api.quizpe.in deliberately, via the env var, when that is what you
// actually want.
const API = process.env.VITE_PROXY_TARGET || 'http://localhost:5008';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    // live counts, testimonials, policies and forms all come from the back-end
    proxy: {
      '/public': { target: API, changeOrigin: true },
      '/legal':  { target: API, changeOrigin: true },
      '/assets': { target: API, changeOrigin: true },
    },
  },
  build: { outDir: 'dist', sourcemap: false },
});

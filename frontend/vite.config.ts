import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['skillhub.zlongame.com'],
    proxy: {
      '/api': {
        target: 'http://localhost:5172',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5172',
        changeOrigin: true,
      },
    },
  },
});

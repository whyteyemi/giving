import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      // Local dev: if you run PHP separately (e.g. XAMPP), set VITE_API_PROXY_TARGET.
      // Production: no proxy needed (static dist + php endpoints are on same origin).
      proxy: {
        '/api.php': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost',
          changeOrigin: true,
          rewrite: (p) => p
        },
        '/donate.php': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost',
          changeOrigin: true,
          rewrite: (p) => p
        },
        '/uploads': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost',
          changeOrigin: true,
        }
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api.php': {
          target: 'https://givingwithoutlimit.org.ng/api',
          changeOrigin: true,
          rewrite: (path) => path // keep path as-is
        },
        '/donate.php': {
          target: 'https://givingwithoutlimit.org.ng/api',
          changeOrigin: true,
          rewrite: (path) => path // keep path as-is
        },
        '/uploads': {
          target: 'https://givingwithoutlimit.org.ng/api',
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

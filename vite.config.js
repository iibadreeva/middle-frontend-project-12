import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      __ROLLBAR_ACCESS_TOKEN__: JSON.stringify(env.VITE_ROLLBAR_ACCESS_TOKEN ?? ''),
      __ROLLBAR_ENVIRONMENT__: JSON.stringify(env.VITE_APP_ENV ?? mode),
      __ROLLBAR_CODE_VERSION__: JSON.stringify(env.VITE_GIT_SHA ?? ''),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5002,
      proxy: {
        // Проксируем запросы к API
        '/api': {
          target: 'http://localhost:5001',
        },
        // Проксируем WebSocket соединения
        '/socket.io': {
          target: 'ws://localhost:5001',
          ws: true,
          rewriteWsOrigin: true,
        },
      },
    },
  };
});

import process from 'node:process'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      __ROLLBAR_ACCESS_TOKEN__:
        JSON.stringify(typeof env.VITE_ROLLBAR_ACCESS_TOKEN === 'undefined' ? '' : env.VITE_ROLLBAR_ACCESS_TOKEN),
      __ROLLBAR_ENVIRONMENT__:
        JSON.stringify(typeof env.VITE_APP_ENV === 'undefined' ? mode : env.VITE_APP_ENV),
      __ROLLBAR_CODE_VERSION__:
        JSON.stringify(typeof env.VITE_GIT_SHA === 'undefined' ? '' : env.VITE_GIT_SHA),
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
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
  }
})

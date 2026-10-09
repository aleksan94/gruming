import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // PORT читается из .env (общий с docker-compose) или из окружения
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }

  return {
    plugins: [vue()],
    server: {
      host: true,
      port: Number(env.PORT) || 5173,
      strictPort: true,
    },
  }
})

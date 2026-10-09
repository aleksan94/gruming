import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

export default defineConfig(({ mode }) => {
  // PORT читается из .env (общий с docker-compose) или из окружения
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }

  return {
    plugins: [vue(), svgLoader({ svgo: false })],
    server: {
      host: true,
      port: Number(env.PORT) || 5173,
      strictPort: true,
    },
  }
})

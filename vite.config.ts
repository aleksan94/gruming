import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

export default defineConfig(({ mode }) => {
  // PORT читается из .env (общий с docker-compose) или из окружения
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }

  return {
    // относительные пути: сайт открывается и из корня домена, и из подпапки (GitHub Pages)
    base: './',
    plugins: [vue(), svgLoader({ svgo: false })],
    css: {
      preprocessorOptions: {
        scss: {
          // переменные и миксины доступны во всех scss и <style lang="scss">
          additionalData: `@use '/src/styles/variables' as *;\n@use '/src/styles/mixins' as *;\n`,
        },
      },
    },
    server: {
      host: true,
      port: Number(env.PORT) || 5173,
      strictPort: true,
    },
  }
})

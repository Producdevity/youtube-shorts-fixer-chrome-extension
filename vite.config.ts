import { defineConfig, UserConfig } from 'vite'
import eslintPlugin from '@nabla/vite-plugin-eslint'

const userConfig: UserConfig = {
  plugins: [eslintPlugin()],
  build: {
    rollupOptions: {
      input: {
        background: 'src/background.ts',
      },
      output: {
        dir: 'dist',
      },
    },
  },
  publicDir: 'public',
}

export default defineConfig(userConfig)

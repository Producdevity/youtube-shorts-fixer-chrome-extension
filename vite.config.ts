import path from 'path'
import { defineConfig, UserConfig } from 'vite'
import eslintPlugin from '@nabla/vite-plugin-eslint'
// import eslint from 'vite-plugin-eslint';

import webExtension, { readJsonFile } from 'vite-plugin-web-extension'

const root = (...paths: string[]) => path.resolve(__dirname, ...paths)

function generateManifest() {
  const manifest = readJsonFile('./public/manifest.json')
  const pkg = readJsonFile('./package.json')
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  }
}

const userConfig: UserConfig = {
  plugins: [
    eslintPlugin(),
    webExtension({
      manifest: generateManifest,
      watchFilePaths: ['package.json', 'manifest.json'],
    }),
  ],
  build: {
    outDir: root('dist'),
    emptyOutDir: true,
  },
}

export default defineConfig(userConfig)

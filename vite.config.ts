import { resolve } from 'path'
import url from 'url'
import * as fs from 'fs'
import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'
import react from '@vitejs/plugin-react'

const makeManifest: () => PluginOption = () => {
  const manifestFile = resolve(__dirname, 'src/manifest.js')
  return {
    name: 'make-manifest',
    enforce: 'post',
    buildStart() {
      this.addWatchFile(resolve(__dirname, 'src/manifest.js'))
    },
    async writeBundle() {
      let path = `manifestFile?${Date.now().toString()}`
      if (process.platform === 'win32') {
        path = url.pathToFileURL(manifestFile).href + '?' + Date.now().toString()
      }
      const { default: manifest } = await import(path)
      const dest = resolve(__dirname, 'dist/manifest.json')
      fs.writeFileSync(dest, JSON.stringify(manifest, null, 2))
    }
  }
}
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [react(), makeManifest()],
  server: {
    open: 'workbench.html',
  },
  build: {
    chunkSizeWarningLimit: 1024,
    watch: {},
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        workbench: resolve(__dirname, 'workbench.html'),
        service_worker: resolve(__dirname, 'src/service-worker/index.ts'),
      },
      output: {
        entryFileNames(chunkInfo) {
          if (chunkInfo.name === 'service_worker') {
            return 'service-worker.js'
          } else {
            return 'assets/[name].js'
          }
        }
      }
    }
  }
})

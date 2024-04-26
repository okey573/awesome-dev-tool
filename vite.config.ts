import { resolve } from 'path'
import * as fs from 'fs'
import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import manifest from './src/manifest'

const makeManifest: () => PluginOption = () => {
  return {
    name: 'make-manifest',
    buildStart() {
      this.addWatchFile(resolve(__dirname, 'src/manifest.ts'))
    },
    writeBundle() {
      const dest = resolve(__dirname, 'dist/manifest.json')
      fs.writeFileSync(dest, JSON.stringify(manifest, null, 2))
    }
  }
}
export default defineConfig({
  plugins: [react(), makeManifest()],
  server: {
    open: 'popup.html',
  },
  build: {
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

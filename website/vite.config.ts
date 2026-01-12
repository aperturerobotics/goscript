import { defineConfig, Plugin } from 'vite'
import { resolve } from 'path'
import * as esbuild from 'esbuild'

const VIRTUAL_MODULE_ID = 'virtual:goscript-runtime'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

// Plugin to bundle the GoScript runtime as a virtual module
function goscriptRuntimePlugin(): Plugin {
  const runtimeEntry = resolve(__dirname, '../gs/builtin/index.ts')
  let bundledCode: string | null = null

  async function bundleRuntime(): Promise<string> {
    const result = await esbuild.build({
      entryPoints: [runtimeEntry],
      bundle: true,
      format: 'esm',
      platform: 'browser',
      target: 'es2022',
      minify: false,
      write: false,
    })
    return result.outputFiles[0].text
  }

  return {
    name: 'goscript-runtime',

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID || id === '@goscript/builtin') {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },

    async load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        if (!bundledCode) {
          console.log('Bundling GoScript runtime...')
          bundledCode = await bundleRuntime()
          console.log('GoScript runtime bundled.')
        }
        return bundledCode
      }
    },

    configureServer(server) {
      // Watch the runtime source files and rebuild on change
      const runtimeDir = resolve(__dirname, '../gs/builtin')
      server.watcher.add(runtimeDir)
      server.watcher.on('change', async (path) => {
        if (path.startsWith(runtimeDir)) {
          console.log('Rebuilding GoScript runtime...')
          bundledCode = await bundleRuntime()
          // Invalidate the virtual module
          const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)
          if (mod) {
            server.moduleGraph.invalidateModule(mod)
            server.ws.send({ type: 'full-reload' })
          }
        }
      })
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [goscriptRuntimePlugin()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        playground: resolve(__dirname, 'playground/index.html'),
        tests: resolve(__dirname, 'tests/index.html'),
      },
    },
  },
  server: {
    port: 5173,
  },
})

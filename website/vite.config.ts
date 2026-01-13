import { defineConfig, Plugin } from 'vite'
import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'
import * as esbuild from 'esbuild'

const VIRTUAL_MODULE_ID = 'virtual:goscript-runtime'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

const VIRTUAL_PACKAGES_ID = 'virtual:goscript-packages'
const RESOLVED_VIRTUAL_PACKAGES_ID = '\0' + VIRTUAL_PACKAGES_ID

const PACKAGES_JSON = resolve(__dirname, 'public/data/required-packages.json')
const GS_DIR = resolve(__dirname, '../gs')

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

// Plugin to bundle additional goscript packages for the playground
function goscriptPackagesPlugin(): Plugin {
  let bundledPackages: Record<string, string> = {}
  let bundledCode: string | null = null

  // Read the list of required packages from the generated manifest
  function getRequiredPackages(): string[] {
    if (!existsSync(PACKAGES_JSON)) {
      console.warn('required-packages.json not found, no extra packages will be bundled')
      return []
    }
    const data = JSON.parse(readFileSync(PACKAGES_JSON, 'utf-8'))
    return data.packages || []
  }

  // Bundle a single package and return its code
  async function bundlePackage(pkg: string): Promise<string> {
    // @goscript/io -> gs/io/index.ts
    const relativePath = pkg.replace('@goscript/', '')
    const entryPoint = resolve(GS_DIR, relativePath, 'index.ts')

    if (!existsSync(entryPoint)) {
      console.warn(`Package entry not found: ${entryPoint}`)
      return `export {}`
    }

    const result = await esbuild.build({
      entryPoints: [entryPoint],
      bundle: true,
      format: 'esm',
      platform: 'browser',
      target: 'es2022',
      minify: false,
      write: false,
      // Mark @goscript/builtin as external since it's provided separately
      external: ['@goscript/builtin', '@goscript/builtin/index.js'],
    })
    return result.outputFiles[0].text
  }

  async function bundleAllPackages(): Promise<void> {
    const packages = getRequiredPackages()
    console.log(`Bundling ${packages.length} goscript packages...`)

    bundledPackages = {}
    for (const pkg of packages) {
      console.log(`  Bundling ${pkg}...`)
      bundledPackages[pkg] = await bundlePackage(pkg)
      // Also add with /index.js suffix for compatibility
      bundledPackages[`${pkg}/index.js`] = bundledPackages[pkg]
    }

    // Generate a module that exports the package map
    bundledCode = `export const packages = ${JSON.stringify(bundledPackages)};`
    console.log('Goscript packages bundled.')
  }

  return {
    name: 'goscript-packages',

    resolveId(id) {
      if (id === VIRTUAL_PACKAGES_ID) {
        return RESOLVED_VIRTUAL_PACKAGES_ID
      }
    },

    async load(id) {
      if (id === RESOLVED_VIRTUAL_PACKAGES_ID) {
        if (!bundledCode) {
          await bundleAllPackages()
        }
        return bundledCode
      }
    },

    configureServer(server) {
      // Watch the gs directory and rebuild on change
      server.watcher.add(GS_DIR)
      server.watcher.on('change', async (path) => {
        if (path.startsWith(GS_DIR) && !path.includes('builtin')) {
          console.log('Rebuilding goscript packages...')
          await bundleAllPackages()
          const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_PACKAGES_ID)
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
  plugins: [goscriptRuntimePlugin(), goscriptPackagesPlugin()],
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

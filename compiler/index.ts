import * as path from 'node:path'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = dirname(__dirname)

/**
 * Configuration options for the GoScript compiler.
 */
export interface CompileConfig {
  /** The Go package path or pattern to compile. */
  pkg: string
  /** The output directory for the generated TypeScript files. Defaults to './output'. */
  output?: string
  /** The working directory for the compiler. Defaults to the current working directory. */
  dir?: string
  /** Compile all transitive dependencies of the requested package. */
  allDependencies?: boolean
  /** Go import paths to reject from the compiled package graph. */
  packageBlocklist?: string[] | string
  /** The path to the goscript executable. Defaults to `go run ./cmd/goscript`. */
  goscriptPath?: string
}

/**
 * Compiles a Go package to TypeScript using the goscript compiler.
 */
export async function compile(config: CompileConfig): Promise<void> {
  if (!config.pkg) {
    throw new Error('Package path (pkg) must be specified.')
  }

  const cwd = config.dir ? path.resolve(config.dir) : process.cwd()
  const output = config.output ? path.resolve(config.output) : './output'
  const args = [
    'compile',
    '--package',
    config.pkg,
    '--output',
    output,
    '--dir',
    cwd,
  ]
  if (config.allDependencies) {
    args.push('--all-dependencies')
  }
  const packageBlocklist = normalizePackageBlocklist(config.packageBlocklist)
  if (packageBlocklist) {
    args.push('--package-blocklist', packageBlocklist)
  }

  if (config.goscriptPath) {
    await execFileAsync(config.goscriptPath, args)
    return
  }

  await execFileAsync('go', [
    'run',
    path.join(projectRoot, 'cmd/goscript'),
    ...args,
  ])
}

function normalizePackageBlocklist(value: string[] | string | undefined): string {
  if (!value) {
    return ''
  }
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean).join(',')
  }
  return value.trim()
}

/**
 * Default export for convenience.
 */
export default {
  compile,
}

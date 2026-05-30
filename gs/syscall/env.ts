import * as $ from '@goscript/builtin/index.js'

type ProcessEnv = Record<string, string | undefined>

interface ProcessLike {
  env?: ProcessEnv
}

function hostEnv(): ProcessEnv | undefined {
  return (globalThis as { process?: ProcessLike }).process?.env
}

// Environment variable functions using Node.js/browser APIs
export function Getenv(key: string): [string, boolean] {
  const env = hostEnv()
  if (env !== undefined) {
    const value = env[key]
    return value !== undefined ? [value, true] : ['', false]
  }
  return ['', false]
}

export function Setenv(key: string, value: string): $.GoError {
  const env = hostEnv()
  if (env !== undefined) {
    env[key] = value
    return null
  }
  return { Error: () => 'setenv not supported' }
}

export function Unsetenv(key: string): $.GoError {
  const env = hostEnv()
  if (env !== undefined) {
    delete env[key]
    return null
  }
  return { Error: () => 'unsetenv not supported' }
}

export function Clearenv(): void {
  const env = hostEnv()
  if (env !== undefined) {
    for (const key in env) {
      delete env[key]
    }
  }
}

export function Environ(): $.Slice<string> {
  const host = hostEnv()
  if (host !== undefined) {
    const values: string[] = []
    for (const [key, value] of Object.entries(host)) {
      if (value !== undefined) {
        values.push(`${key}=${value}`)
      }
    }
    return $.arrayToSlice(values)
  }
  return $.arrayToSlice([])
}

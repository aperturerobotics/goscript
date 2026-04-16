export class HostUnsupportedError extends Error {
  constructor() {
    super('operation not implemented in JavaScript environment')
  }
}

export type NodeFSModule = {
  readSync(
    fd: number,
    buffer: Uint8Array,
    offset?: number,
    length?: number,
    position?: number | null,
  ): number
  writeSync(
    fd: number,
    buffer: Uint8Array,
    offset?: number,
    length?: number,
    position?: number | null,
  ): number
  closeSync?(fd: number): void
  fstatSync?(fd: number): any
  fsyncSync?(fd: number): void
  ftruncateSync?(fd: number, len?: number): void
  openSync?(path: string, flags: number | string, mode?: number): number
  chmodSync?(path: string, mode: number): void
  chownSync?(path: string, uid: number, gid: number): void
  lchownSync?(path: string, uid: number, gid: number): void
  linkSync?(existingPath: string, newPath: string): void
  lstatSync?(path: string): any
  mkdirSync?(path: string, options?: number | { mode?: number; recursive?: boolean }): void
  readFileSync?(path: string): Uint8Array
  readdirSync?(path: string, options?: { withFileTypes?: boolean }): any[]
  readlinkSync?(path: string): string
  renameSync?(oldPath: string, newPath: string): void
  rmSync?(path: string, options?: { force?: boolean; recursive?: boolean }): void
  rmdirSync?(path: string): void
  statSync?(path: string): any
  symlinkSync?(target: string, path: string): void
  truncateSync?(path: string, len?: number): void
  unlinkSync?(path: string): void
  utimesSync?(path: string, atime: Date | number, mtime: Date | number): void
  writeFileSync?(path: string, data: Uint8Array, options?: { mode?: number }): void
}

export type DenoStream = {
  readSync?(buffer: Uint8Array): number | null
  writeSync?(buffer: Uint8Array): number
}

export type DenoFileLike = DenoStream & {
  close?(): void
  rid?: number
  seekSync?(offset: number, whence: number): number
  syncSync?(): void
  statSync?(): any
  truncateSync?(len?: number): void
}

type HostReadFD = (fd: number, buffer: Uint8Array) => number | null
type HostWriteFD = (fd: number, buffer: Uint8Array) => number
type HostTextWrite = (data: string) => void

export type HostRuntime = {
  deno: any | null
  nodeFS: NodeFSModule | null
  platform: string
  processObj: any | null
  getEnv(name: string): string
  getStdioHandle(fd: number): DenoFileLike | null
  readFD: HostReadFD
  writeFD: HostWriteFD
  writeStderrText: HostTextWrite
  writeStdoutText: HostTextWrite
}

export type MainScriptMeta = {
  url: string
  main?: boolean
}

const encoder = new TextEncoder()

function getDynamicRequire(): ((specifier: string) => unknown) | null {
  try {
    return Function(
      "return typeof require !== 'undefined' ? require : null",
    )() as ((specifier: string) => unknown) | null
  } catch {
    return null
  }
}

function writeAllSync(
  writeChunk: (chunk: Uint8Array) => number,
  buffer: Uint8Array,
): number {
  let offset = 0
  while (offset < buffer.length) {
    const n = writeChunk(buffer.subarray(offset))
    if (!Number.isFinite(n) || n < 0) {
      throw new Error(`invalid write result: ${n}`)
    }
    if (n === 0) {
      throw new Error('short write')
    }
    offset += n
  }
  return buffer.length
}

function writeAllText(
  writeChunk: (chunk: Uint8Array) => number,
  data: string,
): void {
  const bytes = encoder.encode(data)
  if (bytes.length === 0) {
    return
  }
  writeAllSync(writeChunk, bytes)
}

function detectNodeFS(processObj: any | null): NodeFSModule | null {
  if (processObj && typeof processObj.getBuiltinModule === 'function') {
    const module = processObj.getBuiltinModule('fs')
    if (
      module &&
      typeof module.readSync === 'function' &&
      typeof module.writeSync === 'function'
    ) {
      return module as NodeFSModule
    }
  }

  const requireFn = getDynamicRequire()
  if (requireFn) {
    for (const specifier of ['node:fs', 'fs']) {
      try {
        const module = requireFn(specifier) as NodeFSModule | null
        if (
          module &&
          typeof module.readSync === 'function' &&
          typeof module.writeSync === 'function'
        ) {
          return module
        }
      } catch {
        // Try the next fallback.
      }
    }
  }

  return null
}

function hasURLScheme(path: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path)
}

function isAbsoluteScriptPath(path: string): boolean {
  return path.startsWith('/') || /^[A-Za-z]:[\\/]/.test(path)
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, '/')
}

function absolutePathToFileURL(path: string, isDirectory: boolean): string {
  const normalized = normalizePath(path)
  const suffix = isDirectory && !normalized.endsWith('/') ? '/' : ''
  if (/^[A-Za-z]:\//.test(normalized)) {
    return new URL(`file:///${normalized}${suffix}`).href
  }
  return new URL(`file://${normalized}${suffix}`).href
}

function getCurrentWorkingDirectory(): string | null {
  try {
    if (typeof hostRuntime?.processObj?.cwd === 'function') {
      return hostRuntime.processObj.cwd()
    }
  } catch {
    // Fall through to Deno cwd.
  }

  try {
    if (typeof hostRuntime?.deno?.cwd === 'function') {
      return hostRuntime.deno.cwd()
    }
  } catch {
    // No cwd fallback available.
  }

  return null
}

function fileURLFromScriptPath(path: string): string | null {
  try {
    if (hasURLScheme(path)) {
      return new URL(path).href
    }

    if (isAbsoluteScriptPath(path)) {
      return absolutePathToFileURL(path, false)
    }

    const cwd = getCurrentWorkingDirectory()
    if (!cwd) {
      return null
    }
    return new URL(normalizePath(path), absolutePathToFileURL(cwd, true)).href
  } catch {
    return null
  }
}

function fallbackConsoleWriter(method: 'error' | 'log'): HostTextWrite {
  return (data: string) => {
    const consoleMethod = (globalThis as any).console?.[method]
    if (!consoleMethod) {
      return
    }
    if (data.endsWith('\n')) {
      consoleMethod.call((globalThis as any).console, data.slice(0, -1))
      return
    }
    consoleMethod.call((globalThis as any).console, data)
  }
}

function detectHostRuntime(): HostRuntime {
  const globalObj = globalThis as any
  const deno = globalObj.Deno ?? null
  const processObj = globalObj.process ?? null
  const nodeFS = detectNodeFS(processObj)

  const getStdioHandle = (fd: number): DenoFileLike | null => {
    if (!deno) {
      return null
    }
    switch (fd) {
      case 0:
        return deno.stdin ?? null
      case 1:
        return deno.stdout ?? null
      case 2:
        return deno.stderr ?? null
      default:
        return null
    }
  }

  const platform =
    deno?.build?.os ??
    processObj?.platform ??
    'unknown'

  const getEnv = (name: string): string => {
    if (deno?.env?.get) {
      try {
        return deno.env.get(name) ?? ''
      } catch {
        return ''
      }
    }
    return processObj?.env?.[name] ?? ''
  }

  const readFD: HostReadFD = (fd: number, buffer: Uint8Array): number | null => {
    const handle = getStdioHandle(fd)
    if (handle && typeof handle.readSync === 'function') {
      return handle.readSync(buffer)
    }
    if (nodeFS) {
      return nodeFS.readSync(fd, buffer, 0, buffer.length, null)
    }
    throw new HostUnsupportedError()
  }
  const writeFD: HostWriteFD = (fd: number, buffer: Uint8Array): number => {
    const handle = getStdioHandle(fd)
    if (handle && typeof handle.writeSync === 'function') {
      return writeAllSync(
        (chunk: Uint8Array) => handle.writeSync!(chunk),
        buffer,
      )
    }
    if (nodeFS) {
      return writeAllSync(
        (chunk: Uint8Array) =>
          nodeFS.writeSync(fd, chunk, 0, chunk.length, null),
        buffer,
      )
    }
    throw new HostUnsupportedError()
  }
  const writeStdoutText: HostTextWrite = (data: string) => {
    const handle = getStdioHandle(1)
    if (handle && typeof handle.writeSync === 'function') {
      writeAllText((chunk: Uint8Array) => handle.writeSync!(chunk), data)
      return
    }
    if (nodeFS) {
      writeAllText(
        (chunk: Uint8Array) => nodeFS.writeSync(1, chunk, 0, chunk.length, null),
        data,
      )
      return
    }
    fallbackConsoleWriter('log')(data)
  }
  const writeStderrText: HostTextWrite = (data: string) => {
    const handle = getStdioHandle(2)
    if (handle && typeof handle.writeSync === 'function') {
      writeAllText((chunk: Uint8Array) => handle.writeSync!(chunk), data)
      return
    }
    if (nodeFS) {
      writeAllText(
        (chunk: Uint8Array) => nodeFS.writeSync(2, chunk, 0, chunk.length, null),
        data,
      )
      return
    }
    fallbackConsoleWriter('error')(data)
  }

  return {
    deno,
    getEnv,
    getStdioHandle,
    nodeFS,
    platform,
    processObj,
    readFD,
    writeFD,
    writeStderrText,
    writeStdoutText,
  }
}

export let hostRuntime = detectHostRuntime()

export function resetHostRuntimeForTests(): void {
  hostRuntime = detectHostRuntime()
}

export function writeHostStdoutText(data: string): void {
  hostRuntime.writeStdoutText(data)
}

export function writeHostStderrText(data: string): void {
  hostRuntime.writeStderrText(data)
}

export function isMainScript(meta: MainScriptMeta): boolean {
  if (meta.main === true) {
    return true
  }

  const entryPath = hostRuntime.processObj?.argv?.[1]
  if (typeof entryPath !== 'string' || entryPath === '') {
    return false
  }

  const entryURL = fileURLFromScriptPath(entryPath)
  if (!entryURL) {
    return false
  }

  try {
    return new URL(meta.url).href === entryURL
  } catch {
    return meta.url === entryURL
  }
}

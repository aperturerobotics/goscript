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

function unsupportedReadFD(_fd: number, _buffer: Uint8Array): number | null {
  throw new HostUnsupportedError()
}

function unsupportedWriteFD(_fd: number, _buffer: Uint8Array): number {
  throw new HostUnsupportedError()
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

  let readFD: HostReadFD = unsupportedReadFD
  let writeFD: HostWriteFD = unsupportedWriteFD
  let writeStdoutText: HostTextWrite = fallbackConsoleWriter('log')
  let writeStderrText: HostTextWrite = fallbackConsoleWriter('error')

  if (deno) {
    readFD = (fd: number, buffer: Uint8Array): number | null => {
      const handle = getStdioHandle(fd)
      if (!handle || typeof handle.readSync !== 'function') {
        throw new HostUnsupportedError()
      }
      return handle.readSync(buffer)
    }
    writeFD = (fd: number, buffer: Uint8Array): number => {
      const handle = getStdioHandle(fd)
      if (!handle || typeof handle.writeSync !== 'function') {
        throw new HostUnsupportedError()
      }
      return writeAllSync(
        (chunk: Uint8Array) => handle.writeSync!(chunk),
        buffer,
      )
    }
    writeStdoutText = (data: string) => {
      const handle = getStdioHandle(1)
      if (!handle || typeof handle.writeSync !== 'function') {
        fallbackConsoleWriter('log')(data)
        return
      }
      writeAllText((chunk: Uint8Array) => handle.writeSync!(chunk), data)
    }
    writeStderrText = (data: string) => {
      const handle = getStdioHandle(2)
      if (!handle || typeof handle.writeSync !== 'function') {
        fallbackConsoleWriter('error')(data)
        return
      }
      writeAllText((chunk: Uint8Array) => handle.writeSync!(chunk), data)
    }
  } else if (nodeFS) {
    readFD = (fd: number, buffer: Uint8Array): number | null =>
      nodeFS.readSync(fd, buffer, 0, buffer.length, null)
    writeFD = (fd: number, buffer: Uint8Array): number =>
      writeAllSync(
        (chunk: Uint8Array) =>
          nodeFS.writeSync(fd, chunk, 0, chunk.length, null),
        buffer,
      )
    writeStdoutText = (data: string) =>
      writeAllText(
        (chunk: Uint8Array) => nodeFS.writeSync(1, chunk, 0, chunk.length, null),
        data,
      )
    writeStderrText = (data: string) =>
      writeAllText(
        (chunk: Uint8Array) => nodeFS.writeSync(2, chunk, 0, chunk.length, null),
        data,
      )
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

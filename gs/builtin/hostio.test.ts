import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  getHostRuntime,
  HostRuntimeOwner,
  type HostRuntime,
  isMainScript,
  resetHostRuntimeForTests,
  writeHostStderrText,
  writeHostStdoutText,
} from './hostio.js'

const originalDeno = (globalThis as any).Deno
const originalProcess = (globalThis as any).process

afterEach(() => {
  vi.restoreAllMocks()

  if (originalDeno === undefined) {
    delete (globalThis as any).Deno
  } else {
    ;(globalThis as any).Deno = originalDeno
  }

  if (originalProcess === undefined) {
    delete (globalThis as any).process
  } else {
    ;(globalThis as any).process = originalProcess
  }

  resetHostRuntimeForTests()
})

function runtimeFixture(platform: string): HostRuntime {
  return {
    deno: null,
    getEnv: () => '',
    getStdioHandle: () => null,
    nodeCrypto: null,
    nodeFS: null,
    platform,
    processObj: null,
    readFD: () => null,
    writeFD: () => 0,
    writeStderrText: () => {},
    writeStdoutText: () => {},
  }
}

describe('hostio runtime owner', () => {
  it('caches host capability detection until reset', () => {
    let detects = 0
    const owner = new HostRuntimeOwner(() => {
      detects++
      return runtimeFixture(`host-${detects}`)
    })

    expect(owner.current().platform).toBe('host-1')
    expect(owner.current().platform).toBe('host-1')
    expect(detects).toBe(1)

    owner.reset()

    expect(owner.current().platform).toBe('host-2')
    expect(detects).toBe(2)
  })
})

describe('hostio text writes', () => {
  it('uses sync node fs writes for stdout and stderr', () => {
    const writes: Array<{ fd: number; bytes: number[] }> = []
    const writeSync = vi.fn(
      (
        fd: number,
        buffer: Uint8Array,
        _offset?: number,
        length?: number,
        _position?: number | null,
      ) => {
        writes.push({
          bytes: Array.from(buffer.subarray(0, length ?? buffer.length)),
          fd,
        })
        return length ?? buffer.length
      },
    )

    delete (globalThis as any).Deno
    ;(globalThis as any).process = {
      getBuiltinModule: vi.fn(() => ({
        readSync: vi.fn(),
        writeSync,
      })),
      stderr: { write: vi.fn() },
      stdout: { write: vi.fn() },
    }
    resetHostRuntimeForTests()

    writeHostStdoutText('ok\n')
    writeHostStderrText('err\n')

    expect(writeSync).toHaveBeenCalledTimes(2)
    expect(writes).toEqual([
      { bytes: [111, 107, 10], fd: 1 },
      { bytes: [101, 114, 114, 10], fd: 2 },
    ])
    expect((globalThis as any).process.stdout.write).not.toHaveBeenCalled()
    expect((globalThis as any).process.stderr.write).not.toHaveBeenCalled()
  })

  it('falls back to node fs when Deno is present without sync stdio', () => {
    const writes: Array<{ fd: number; bytes: number[] }> = []
    const writeSync = vi.fn(
      (
        fd: number,
        buffer: Uint8Array,
        _offset?: number,
        length?: number,
        _position?: number | null,
      ) => {
        writes.push({
          bytes: Array.from(buffer.subarray(0, length ?? buffer.length)),
          fd,
        })
        return length ?? buffer.length
      },
    )

    ;(globalThis as any).Deno = {
      stderr: {},
      stdout: {},
    }
    ;(globalThis as any).process = {
      getBuiltinModule: vi.fn(() => ({
        readSync: vi.fn(),
        writeSync,
      })),
    }
    resetHostRuntimeForTests()

    writeHostStdoutText('bun\n')
    writeHostStderrText('err\n')

    expect(writeSync).toHaveBeenCalledTimes(2)
    expect(writes).toEqual([
      { bytes: [98, 117, 110, 10], fd: 1 },
      { bytes: [101, 114, 114, 10], fd: 2 },
    ])
    expect(getHostRuntime().platform).toBe('unknown')
  })

  it('prefers Deno sync stdio when it is available', () => {
    const denoWrites: Array<{ bytes: number[]; stream: string }> = []
    const nodeWriteSync = vi.fn()
    const denoWriteSync = vi.fn((buffer: Uint8Array) => {
      denoWrites.push({
        bytes: Array.from(buffer),
        stream: 'stdout',
      })
      return buffer.length
    })

    ;(globalThis as any).Deno = {
      build: { os: 'darwin' },
      stdout: { writeSync: denoWriteSync },
    }
    ;(globalThis as any).process = {
      getBuiltinModule: vi.fn(() => ({
        readSync: vi.fn(),
        writeSync: nodeWriteSync,
      })),
    }
    resetHostRuntimeForTests()

    writeHostStdoutText('deno\n')

    expect(denoWriteSync).toHaveBeenCalledTimes(1)
    expect(nodeWriteSync).not.toHaveBeenCalled()
    expect(denoWrites).toEqual([
      { bytes: [100, 101, 110, 111, 10], stream: 'stdout' },
    ])
    expect(getHostRuntime().platform).toBe('darwin')
  })

  it('uses console fallback in browser-like hosts', () => {
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})

    delete (globalThis as any).Deno
    delete (globalThis as any).process
    resetHostRuntimeForTests()

    writeHostStdoutText('browser\n')

    expect(getHostRuntime().platform).toBe('unknown')
    expect(getHostRuntime().nodeFS).toBeNull()
    expect(consoleLog).toHaveBeenCalledWith('browser')
  })

  it('writes stdout and stderr file descriptors to console.log in browser-like hosts', () => {
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    delete (globalThis as any).Deno
    delete (globalThis as any).process
    resetHostRuntimeForTests()

    const runtime = getHostRuntime()
    expect(runtime.writeFD(1, new Uint8Array([111, 107, 10]))).toBe(3)
    expect(runtime.writeFD(2, new Uint8Array([101, 114, 114, 10]))).toBe(4)

    expect(consoleLog).toHaveBeenCalledWith('ok')
    expect(consoleLog).toHaveBeenCalledWith('err')
    expect(consoleError).not.toHaveBeenCalled()
  })
})

describe('hostio isMainScript', () => {
  it('returns true when the runtime marks the module as main', () => {
    expect(
      isMainScript({
        main: true,
        url: 'file:///tmp/example.gs.ts',
      }),
    ).toBe(true)
  })

  it('matches process argv[1] against the module url', () => {
    delete (globalThis as any).Deno
    ;(globalThis as any).process = {
      argv: ['bun', './dist/app.gs.ts'],
      cwd: vi.fn(() => '/tmp/project'),
      getBuiltinModule: vi.fn(() => ({
        readSync: vi.fn(),
        writeSync: vi.fn(),
      })),
    }
    resetHostRuntimeForTests()

    expect(
      isMainScript({
        url: 'file:///tmp/project/dist/app.gs.ts',
      }),
    ).toBe(true)
  })

  it('returns false when the module was imported instead of executed', () => {
    delete (globalThis as any).Deno
    ;(globalThis as any).process = {
      argv: ['bun', './runner.ts'],
      cwd: vi.fn(() => '/tmp/project'),
      getBuiltinModule: vi.fn(() => ({
        readSync: vi.fn(),
        writeSync: vi.fn(),
      })),
    }
    resetHostRuntimeForTests()

    expect(
      isMainScript({
        url: 'file:///tmp/project/dist/app.gs.ts',
      }),
    ).toBe(false)
  })
})

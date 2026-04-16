import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  isMainScript,
  resetHostRuntimeForTests,
  writeHostStderrText,
  writeHostStdoutText,
} from './hostio.js'

const originalDeno = (globalThis as any).Deno
const originalProcess = (globalThis as any).process

afterEach(() => {
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

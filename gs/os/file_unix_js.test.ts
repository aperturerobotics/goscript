import { afterEach, describe, expect, it, vi } from 'vitest'

import * as io from '@goscript/io/index.js'

import { NewFile, Stderr, Stdin, Stdout } from './file_unix_js.gs.js'
import { ErrClosed } from './error.gs.js'

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
})

describe('os stdio', () => {
  it('exports standard file descriptors', () => {
    expect(Stdin).not.toBeNull()
    expect(Stdout).not.toBeNull()
    expect(Stderr).not.toBeNull()
    expect(Stdin!.Fd()).toBe(0)
    expect(Stdout!.Fd()).toBe(1)
    expect(Stderr!.Fd()).toBe(2)
  })

  it('uses Deno sync stdio when available', () => {
    const stdoutWriteSync = vi.fn((buffer: Uint8Array) => buffer.length)
    const stdinReadSync = vi.fn((buffer: Uint8Array) => {
      buffer.set([1, 2, 3], 0)
      return 3
    })

    ;(globalThis as any).Deno = {
      stderr: { writeSync: vi.fn((buffer: Uint8Array) => buffer.length) },
      stdin: { readSync: stdinReadSync },
      stdout: { writeSync: stdoutWriteSync },
    }
    delete (globalThis as any).process

    const input = NewFile(0, 'stdin')
    const output = NewFile(1, 'stdout')
    const readBuf = new Uint8Array(4)

    const [readN, readErr] = input!.Read(readBuf)
    expect(readN).toBe(3)
    expect(readErr).toBeNull()
    expect(Array.from(readBuf.slice(0, 3))).toEqual([1, 2, 3])

    const writeBuf = new Uint8Array([4, 5, 6])
    const [writeN, writeErr] = output!.Write(writeBuf)
    expect(writeN).toBe(3)
    expect(writeErr).toBeNull()
    expect(stdoutWriteSync).toHaveBeenCalledTimes(1)
    expect(stdoutWriteSync).toHaveBeenCalledWith(writeBuf)
  })

  it('uses process builtin fs sync stdio when Deno is unavailable', () => {
    const readSync = vi.fn(
      (
        _fd: number,
        buffer: Uint8Array,
        _offset?: number,
        _length?: number,
        _position?: number | null,
      ) => {
        buffer.set([7, 8], 0)
        return 2
      },
    )
    const writeSync = vi.fn(
      (
        _fd: number,
        _buffer: Uint8Array,
        _offset?: number,
        length?: number,
        _position?: number | null,
      ) => length ?? 0,
    )

    delete (globalThis as any).Deno
    ;(globalThis as any).process = {
      getBuiltinModule: vi.fn(() => ({
        readSync,
        writeSync,
      })),
    }

    const input = NewFile(0, 'stdin')
    const output = NewFile(1, 'stdout')
    const readBuf = new Uint8Array(2)

    const [readN, readErr] = input!.Read(readBuf)
    expect(readN).toBe(2)
    expect(readErr).toBeNull()
    expect(Array.from(readBuf)).toEqual([7, 8])

    const writeBuf = new Uint8Array([9, 10, 11, 12])
    const [writeN, writeErr] = output!.Write(writeBuf)
    expect(writeN).toBe(4)
    expect(writeErr).toBeNull()
    expect(writeSync).toHaveBeenCalledTimes(1)
  })

  it('returns EOF on zero-byte reads and ErrClosed after Close', () => {
    const stdinReadSync = vi.fn(() => 0)

    ;(globalThis as any).Deno = {
      stdin: { readSync: stdinReadSync },
    }
    delete (globalThis as any).process

    const input = NewFile(0, 'stdin')!
    const [readN, readErr] = input.Read(new Uint8Array(1))
    expect(readN).toBe(0)
    expect(readErr).toBe(io.EOF)

    expect(input.Close()).toBeNull()
    const [closedN, closedErr] = input.Read(new Uint8Array(1))
    expect(closedN).toBe(0)
    expect(closedErr).toBe(ErrClosed)
  })
})

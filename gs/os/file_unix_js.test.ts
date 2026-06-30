import { afterEach, describe, expect, it, vi } from 'vitest'

import * as io from '@goscript/io/index.js'

import { NewFile, Stderr, Stdin, Stdout } from './file_unix_js.gs.js'
import { ErrClosed } from './error.gs.js'
import { createHostFile, resetHostRuntimeForTests } from './types_js.gs.js'

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
    resetHostRuntimeForTests()

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
    resetHostRuntimeForTests()

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

  it('writes stderr to console.log in browser-like hosts', () => {
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    delete (globalThis as any).Deno
    delete (globalThis as any).process
    resetHostRuntimeForTests()

    try {
      const stderr = NewFile(2, 'stderr')!
      const [writeN, writeErr] = stderr.Write(new TextEncoder().encode('err\n'))

      expect(writeN).toBe(4)
      expect(writeErr).toBeNull()
      expect(consoleLog).toHaveBeenCalledWith('err')
      expect(consoleError).not.toHaveBeenCalled()
    } finally {
      consoleLog.mockRestore()
      consoleError.mockRestore()
    }
  })

  it('falls back to process builtin fs when Deno lacks sync stdio', () => {
    const readSync = vi.fn(
      (
        _fd: number,
        buffer: Uint8Array,
        _offset?: number,
        _length?: number,
        _position?: number | null,
      ) => {
        buffer.set([5, 6], 0)
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

    ;(globalThis as any).Deno = {
      stdin: {},
      stdout: {},
    }
    ;(globalThis as any).process = {
      getBuiltinModule: vi.fn(() => ({
        readSync,
        writeSync,
      })),
    }
    resetHostRuntimeForTests()

    const input = NewFile(0, 'stdin')
    const output = NewFile(1, 'stdout')
    const readBuf = new Uint8Array(2)

    const [readN, readErr] = input!.Read(readBuf)
    expect(readN).toBe(2)
    expect(readErr).toBeNull()
    expect(Array.from(readBuf)).toEqual([5, 6])

    const [writeN, writeErr] = output!.Write(new Uint8Array([7, 8, 9]))
    expect(writeN).toBe(3)
    expect(writeErr).toBeNull()
    expect(writeSync).toHaveBeenCalledTimes(1)
  })

  it('returns EOF on zero-byte reads and ErrClosed after Close', () => {
    const stdinReadSync = vi.fn(() => 0)

    ;(globalThis as any).Deno = {
      stdin: { readSync: stdinReadSync },
    }
    delete (globalThis as any).process
    resetHostRuntimeForTests()

    const input = NewFile(0, 'stdin')!
    const [readN, readErr] = input.Read(new Uint8Array(1))
    expect(readN).toBe(0)
    expect(readErr).toBe(io.EOF)

    expect(input.Close()).toBeNull()
    const [closedN, closedErr] = input.Read(new Uint8Array(1))
    expect(closedN).toBe(0)
    expect(closedErr).toBe(ErrClosed)
  })

  it('retries short writes until the full buffer is written', () => {
    const writeSync = vi
      .fn<(buffer: Uint8Array) => number>()
      .mockImplementationOnce((_buffer: Uint8Array) => 2)
      .mockImplementationOnce((buffer: Uint8Array) => buffer.length)

    ;(globalThis as any).Deno = {
      stdout: { writeSync },
    }
    delete (globalThis as any).process
    resetHostRuntimeForTests()

    const output = NewFile(1, 'stdout')!
    const [writeN, writeErr] = output.Write(new Uint8Array([1, 2, 3, 4, 5]))
    expect(writeN).toBe(5)
    expect(writeErr).toBeNull()
    expect(writeSync).toHaveBeenCalledTimes(2)
    expect(Array.from(writeSync.mock.calls[1][0])).toEqual([3, 4, 5])
  })

  it('prefers direct handle read and write methods when available', () => {
    const handle = {
      readSync: vi.fn((buffer: Uint8Array) => {
        buffer.set([11, 12, 13], 0)
        return 3
      }),
      writeSync: vi
        .fn<(buffer: Uint8Array) => number>()
        .mockImplementationOnce((_buffer: Uint8Array) => 1)
        .mockImplementationOnce((buffer: Uint8Array) => buffer.length),
    }

    const file = createHostFile('host-file', 99, handle)
    const readBuf = new Uint8Array(4)

    const [readN, readErr] = file.Read(readBuf)
    expect(readN).toBe(3)
    expect(readErr).toBeNull()
    expect(Array.from(readBuf.slice(0, 3))).toEqual([11, 12, 13])

    const [writeN, writeErr] = file.Write(new Uint8Array([21, 22, 23]))
    expect(writeN).toBe(3)
    expect(writeErr).toBeNull()
    expect(handle.writeSync).toHaveBeenCalledTimes(2)
    expect(Array.from(handle.writeSync.mock.calls[1][0])).toEqual([22, 23])
  })

  it('supports ReadAt and WriteAt on process fs descriptors', () => {
    const readSync = vi.fn(
      (
        _fd: number,
        buffer: Uint8Array,
        offset?: number,
        length?: number,
        position?: number | null,
      ) => {
        expect(offset).toBe(0)
        expect(length).toBe(3)
        expect(position).toBe(5)
        buffer.set([31, 32, 33], 0)
        return 3
      },
    )
    const writeSync = vi.fn(
      (
        _fd: number,
        _buffer: Uint8Array,
        offset?: number,
        length?: number,
        position?: number | null,
      ) => {
        expect(offset).toBe(0)
        expect(length).toBe(2)
        expect(position).toBe(8)
        return length ?? 0
      },
    )

    delete (globalThis as any).Deno
    ;(globalThis as any).process = {
      getBuiltinModule: vi.fn(() => ({
        readSync,
        writeSync,
      })),
    }
    resetHostRuntimeForTests()

    const file = createHostFile('descriptor-file', 7)
    const buf = new Uint8Array(3)

    const [readN, readErr] = file.ReadAt(buf, 5n)
    expect(readN).toBe(3)
    expect(readErr).toBeNull()
    expect(Array.from(buf)).toEqual([31, 32, 33])

    const [writeN, writeErr] = file.WriteAt(new Uint8Array([41, 42]), 8n)
    expect(writeN).toBe(2)
    expect(writeErr).toBeNull()
    expect(readSync).toHaveBeenCalledTimes(1)
    expect(writeSync).toHaveBeenCalledTimes(1)
  })

  it('copies from File without recursing through io.Copy', async () => {
    const readSync = vi
      .fn<(buffer: Uint8Array) => number>()
      .mockImplementationOnce((buffer) => {
        buffer.set([65, 66, 67], 0)
        return 3
      })
      .mockImplementationOnce(() => 0)

    const file = createHostFile('descriptor-file', 7, { readSync })
    const chunks: number[] = []
    const writer = {
      Write(p: Uint8Array): [number, null] {
        chunks.push(...Array.from(p))
        return [p.length, null]
      },
    }

    const [n, err] = await io.Copy(writer, file)

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(chunks).toString('utf8')).toBe('ABC')
  })

  it('copies into File without recursing through io.Copy', async () => {
    const writes: number[] = []
    const writeSync = vi.fn((buffer: Uint8Array) => {
      writes.push(...Array.from(buffer))
      return buffer.length
    })

    let sent = false
    const reader = {
      Read(p: Uint8Array): [number, typeof io.EOF | null] {
        if (sent) {
          return [0, io.EOF]
        }
        sent = true
        p.set([88, 89, 90], 0)
        return [3, null]
      },
    }
    const file = createHostFile('descriptor-file', 7, { writeSync })

    const [n, err] = await io.Copy(file, reader)

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(writes).toString('utf8')).toBe('XYZ')
  })
})

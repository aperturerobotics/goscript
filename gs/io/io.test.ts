import * as $ from '@goscript/builtin/index.js'
import {
  EOF,
  LimitedReader,
  MultiWriter,
  NewSectionReader,
  NopCloser,
  Pipe,
  ReadAll,
  TeeReader,
} from './index.js'
import { describe, expect, test } from 'vitest'

class sliceReader {
  constructor(private data: Uint8Array) {}

  Read(p: $.Bytes): [number, $.GoError] {
    const n = Math.min($.len(p), this.data.length)
    p!.set(this.data.subarray(0, n), 0)
    this.data = this.data.subarray(n)
    return [n, n === 0 ? (new Error('EOF') as $.GoError) : null]
  }
}

class captureWriter {
  public chunks: number[] = []

  Write(p: $.Bytes): [number, $.GoError] {
    this.chunks.push(...Array.from(p ?? []))
    return [$.len(p), null]
  }
}

class syncReaderAt {
  constructor(private data: Uint8Array) {}

  ReadAt(p: $.Bytes, off: bigint): [number, $.GoError] {
    const n = $.copy(p, this.data.subarray(Number(off)))
    return [n, n < $.len(p) ? (new Error('EOF') as $.GoError) : null]
  }
}

describe('io override', () => {
  test('LimitedReader accepts generated struct-literal construction', async () => {
    const reader = new LimitedReader({
      R: new sliceReader($.stringToBytes('abcdef')),
      N: 3n,
    })
    const buf = new Uint8Array(8)

    const [n, err] = await reader.Read(buf)

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(buf.subarray(0, n)).toString('utf8')).toBe('abc')
  })

  test('TeeReader accepts nullable generated interface values', async () => {
    const writer = new captureWriter()
    const reader = TeeReader(new sliceReader($.stringToBytes('abc')), writer)
    const buf = new Uint8Array(4)

    const [n, err] = await reader.Read(buf)

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(writer.chunks).toString('utf8')).toBe('abc')
  })

  test('NopCloser accepts nullable generated interface values', () => {
    const reader: sliceReader | null = new sliceReader($.stringToBytes('abc'))
    const body = NopCloser(reader)
    const buf = new Uint8Array(4)

    const [n, err] = body.Read(buf)

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(body.Close()).toBeNull()
  })

  test('TeeReader awaits async readers and writers', async () => {
    const chunks: number[] = []
    const reader = TeeReader(
      {
        async Read(p: $.Bytes): Promise<[number, $.GoError]> {
          await Promise.resolve()
          p!.set($.stringToBytes('abc'), 0)
          return [3, null]
        },
      } as any,
      {
        async Write(p: $.Bytes): Promise<[number, $.GoError]> {
          await Promise.resolve()
          chunks.push(...Array.from(p ?? []))
          return [$.len(p), null]
        },
      } as any,
    )
    const buf = new Uint8Array(4)

    const [n, err] = await reader.Read(buf)

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(chunks).toString('utf8')).toBe('abc')
  })

  test('MultiWriter accepts nullable generated interface values', async () => {
    const first = new captureWriter()
    const second = new captureWriter()
    const writer = MultiWriter(first, second)

    const [n, err] = await writer.Write($.stringToBytes('abc'))

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(first.chunks).toString('utf8')).toBe('abc')
    expect(Buffer.from(second.chunks).toString('utf8')).toBe('abc')
  })

  test('MultiWriter awaits async generated writers', async () => {
    const chunks: number[] = []
    const writer = MultiWriter({
      async Write(p: $.Bytes): Promise<[number, $.GoError]> {
        await Promise.resolve()
        chunks.push(...Array.from(p ?? []))
        return [$.len(p), null]
      },
    })

    const [n, err] = await writer.Write($.stringToBytes('abc'))

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(chunks).toString('utf8')).toBe('abc')
  })

  test('SectionReader preserves sync reads for sync ReaderAt', () => {
    const reader = NewSectionReader(
      new syncReaderAt($.stringToBytes('abcdef')),
      1,
      3,
    )
    const buf = new Uint8Array(4)

    const result = reader.Read(buf)
    expect(result).not.toBeInstanceOf(Promise)
    const [n, err] = result

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(buf.subarray(0, n)).toString('utf8')).toBe('bcd')
  })

  test('SectionReader awaits async ReaderAt', async () => {
    const reader = NewSectionReader(
      {
        async ReadAt(p: $.Bytes, off: bigint): Promise<[number, $.GoError]> {
          await Promise.resolve()
          const data = $.stringToBytes('abcdef')
          const n = $.copy(p, data.subarray(Number(off)))
          return [n, n < $.len(p) ? (new Error('EOF') as $.GoError) : null]
        },
      } as any,
      1,
      3,
    )
    const buf = new Uint8Array(4)

    const [n, err] = await reader.Read(buf)

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(buf.subarray(0, n)).toString('utf8')).toBe('bcd')
  })

  test('PipeReader waits for a later write', async () => {
    const [reader, writer] = Pipe()
    const buf = new Uint8Array(5)

    const read = reader.Read(buf)
    const [written, writeErr] = await writer.Write($.stringToBytes('later'))
    const [readBytes, readErr] = await read

    expect(writeErr).toBeNull()
    expect(written).toBe(5)
    expect(readErr).toBeNull()
    expect(readBytes).toBe(5)
    expect(Buffer.from(buf).toString('utf8')).toBe('later')
  })

  test('ReadAll returns the bytes already read with a non-EOF error', async () => {
    const boom = new Error('boom') as $.GoError
    let called = false
    const reader = {
      Read(p: $.Bytes): [number, $.GoError] {
        if (called) {
          return [0, EOF]
        }
        called = true
        const data = $.stringToBytes('hello')
        p!.set(data, 0)
        return [$.len(data), boom]
      },
    }

    const [data, err] = await ReadAll(reader)
    expect(err).toBe(boom)
    expect($.bytesToString(data)).toBe('hello')
  })

  test('ReadAll reports EOF as a nil error', async () => {
    const data = $.stringToBytes('world')
    let offset = 0
    const reader = {
      Read(p: $.Bytes): [number, $.GoError] {
        if (offset >= $.len(data)) {
          return [0, EOF]
        }
        const n = Math.min($.len(p), $.len(data) - offset)
        p!.set((data as Uint8Array).subarray(offset, offset + n), 0)
        offset += n
        return [n, null]
      },
    }

    const [out, err] = await ReadAll(reader)
    expect(err).toBeNull()
    expect($.bytesToString(out)).toBe('world')
  })
})

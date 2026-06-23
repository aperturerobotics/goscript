import { describe, expect, test } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  EOF,
  ErrShortBuffer,
  ErrUnexpectedEOF,
  LimitReader,
  NewOffsetWriter,
  ReadAtLeast,
} from './index.js'

// A Reader that hands out its data and returns the EOF sentinel once drained,
// matching Go's convention that a Read may return n>0 with a nil error.
class chunkReader {
  constructor(private data: Uint8Array) {}

  Read(p: $.Bytes): [number, $.GoError] {
    if (this.data.length === 0) {
      return [0, EOF]
    }
    const n = Math.min($.len(p), this.data.length)
    p!.set(this.data.subarray(0, n), 0)
    this.data = this.data.subarray(n)
    return [n, null]
  }
}

// A WriterAt that records bytes at their absolute offset.
class bufferWriterAt {
  public buf: number[] = []

  WriteAt(p: $.Bytes, off: bigint): [number, $.GoError] {
    const base = Number(off)
    const bytes = p ?? new Uint8Array(0)
    for (let i = 0; i < bytes.length; i++) {
      this.buf[base + i] = bytes[i]
    }
    return [$.len(p), null]
  }
}

describe('io coverage (Go semantics)', () => {
  test('LimitReader stops with EOF after n bytes', async () => {
    const lr = LimitReader(new chunkReader($.stringToBytes('hello world')), 5n)
    const buf = new Uint8Array(32)
    const [n, err] = await (lr.Read(buf) as any)
    expect(n).toBe(5)
    expect(err).toBeNull()
    expect($.bytesToString($.goSlice(buf, 0, n))).toBe('hello')
    const [n2, err2] = await (lr.Read(buf) as any)
    expect(n2).toBe(0)
    expect(err2).toBe(EOF)
  })

  test('NewOffsetWriter writes at the base offset', () => {
    const w = new bufferWriterAt()
    const ow = NewOffsetWriter(w, 3n)
    const [n, err] = ow.Write($.stringToBytes('abc'))
    expect(n).toBe(3)
    expect(err).toBeNull()
    expect(String.fromCharCode(w.buf[3], w.buf[4], w.buf[5])).toBe('abc')
    expect(w.buf[0]).toBeUndefined()
  })

  test('ReadAtLeast reads until min and reports short reads', async () => {
    const buf4 = new Uint8Array(4)
    const [n, err] = await ReadAtLeast(
      new chunkReader($.stringToBytes('abcdef')),
      buf4,
      4,
    )
    expect(n).toBe(4)
    expect(err).toBeNull()
    expect($.bytesToString(buf4)).toBe('abcd')

    const buf5 = new Uint8Array(5)
    const [n2, err2] = await ReadAtLeast(
      new chunkReader($.stringToBytes('ab')),
      buf5,
      4,
    )
    expect(n2).toBe(2)
    expect(err2).toBe(ErrUnexpectedEOF)

    const [n3, err3] = await ReadAtLeast(
      new chunkReader(new Uint8Array(0)),
      new Uint8Array(4),
      4,
    )
    expect(n3).toBe(0)
    expect(err3).toBe(EOF)

    const [n4, err4] = await ReadAtLeast(
      new chunkReader($.stringToBytes('abcdef')),
      new Uint8Array(3),
      5,
    )
    expect(n4).toBe(0)
    expect(err4).toBe(ErrShortBuffer)
  })
})

import * as $ from '@goscript/builtin/index.js'
import { LimitedReader, MultiWriter, TeeReader } from './index.js'

class sliceReader {
  constructor(private data: Uint8Array) {}

  Read(p: $.Bytes): [number, $.GoError] {
    const n = Math.min($.len(p), this.data.length)
    p!.set(this.data.subarray(0, n), 0)
    this.data = this.data.subarray(n)
    return [n, n === 0 ? new Error('EOF') as $.GoError : null]
  }
}

class captureWriter {
  public chunks: number[] = []

  Write(p: $.Bytes): [number, $.GoError] {
    this.chunks.push(...Array.from(p ?? []))
    return [$.len(p), null]
  }
}

describe('io override', () => {
  test('LimitedReader accepts generated struct-literal construction', async () => {
    const reader = new LimitedReader({
      R: new sliceReader($.stringToBytes('abcdef')),
      N: 3,
    })
    const buf = new Uint8Array(8)

    const [n, err] = await reader.Read(buf)

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(buf.subarray(0, n)).toString('utf8')).toBe('abc')
  })

  test('TeeReader accepts nullable generated interface values', () => {
    const writer = new captureWriter()
    const reader = TeeReader(new sliceReader($.stringToBytes('abc')), writer)
    const buf = new Uint8Array(4)

    const [n, err] = reader.Read(buf)

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(writer.chunks).toString('utf8')).toBe('abc')
  })

  test('MultiWriter accepts nullable generated interface values', () => {
    const first = new captureWriter()
    const second = new captureWriter()
    const writer = MultiWriter(first, second)

    const [n, err] = writer.Write($.stringToBytes('abc'))

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(first.chunks).toString('utf8')).toBe('abc')
    expect(Buffer.from(second.chunks).toString('utf8')).toBe('abc')
  })
})

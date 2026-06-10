import { describe, expect, test } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'
import * as io from '@goscript/io/index.js'

import {
  BestCompression,
  BestSpeed,
  DefaultCompression,
  ErrHeader,
  HuffmanOnly,
  NewReader,
  NewWriter,
  NewWriterLevel,
  NoCompression,
} from './index.js'

describe('compress/gzip override', () => {
  test('exports flate compression level constants', () => {
    expect(NoCompression).toBe(0)
    expect(BestSpeed).toBe(1)
    expect(BestCompression).toBe(9)
    expect(DefaultCompression).toBe(-1)
    expect(HuffmanOnly).toBe(-2)
  })

  test('rejects invalid compression levels', () => {
    const buf = $.markAsStructValue(new bytes.Buffer())

    expect(NewWriterLevel(buf, HuffmanOnly)[1]).toBeNull()
    expect(NewWriterLevel(buf, BestCompression)[1]).toBeNull()
    expect(NewWriterLevel(buf, HuffmanOnly - 1)[1]?.Error()).toBe(
      'gzip: invalid compression level: -3',
    )
    expect(NewWriterLevel(buf, BestCompression + 1)[1]?.Error()).toBe(
      'gzip: invalid compression level: 10',
    )
  })

  test('round trips bytes through writer and reader', async () => {
    const input = $.stringToBytes('hello gzip world')
    const buf = $.markAsStructValue(new bytes.Buffer())
    const writer = NewWriter(buf)

    const [written, writeErr] = writer.Write(input)
    expect(writeErr).toBeNull()
    expect(written).toBe(input.length)
    expect(await writer.Close()).toBeNull()

    const [reader, readerErr] = NewReader(bytes.NewReader(buf.Bytes()))
    expect(readerErr).toBeNull()
    expect(reader).not.toBeNull()

    const [out, readErr] = await io.ReadAll(reader!)
    expect(readErr).toBeNull()
    expect($.bytesToString(out)).toBe('hello gzip world')
  })

  test('reader reset accepts async generated readers', async () => {
    const compressed = $.markAsStructValue(new bytes.Buffer())
    const writer = NewWriter(compressed)
    expect(writer.Write($.stringToBytes('async gzip source'))[1]).toBeNull()
    expect(await writer.Close()).toBeNull()

    const source = bytes.NewReader(compressed.Bytes())
    const asyncReader = {
      async Read(p: $.Bytes): Promise<[number, $.GoError]> {
        await Promise.resolve()
        return source.Read(p)
      },
    }

    const [reader, readerErr] = NewReader(asyncReader as io.Reader)
    expect(readerErr).toBeNull()
    const [out, readErr] = await io.ReadAll(reader!)
    expect(readErr).toBeNull()
    expect($.bytesToString(out)).toBe('async gzip source')
  })

  test('invalid gzip bytes return ErrHeader', () => {
    const [reader, err] = NewReader(bytes.NewReader($.stringToBytes('plain')))
    expect(reader).toBeNull()
    expect(err).toBe(ErrHeader)
  })
})

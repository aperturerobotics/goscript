import { describe, expect, test } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'
import * as io from '@goscript/io/index.js'

import {
  BestCompression,
  BestSpeed,
  DefaultCompression,
  ErrChecksum,
  ErrDictionary,
  HuffmanOnly,
  NewReader,
  NewReaderDict,
  NewWriter,
  NewWriterLevel,
  NewWriterLevelDict,
  NoCompression,
} from './index.js'

describe('compress/zlib override', () => {
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
      'zlib: invalid compression level: -3',
    )
    expect(NewWriterLevelDict(buf, BestCompression + 1, null)[1]?.Error()).toBe(
      'zlib: invalid compression level: 10',
    )
  })

  test('round trips bytes through writer and reader', async () => {
    const input = $.stringToBytes('hello compressed world')
    const buf = $.markAsStructValue(new bytes.Buffer())
    const writer = NewWriter(buf)

    const [written, writeErr] = writer.Write(input)
    expect(writeErr).toBeNull()
    expect(written).toBe(input.length)
    expect(await writer.Close()).toBeNull()

    const [reader, readerErr] = await NewReader(bytes.NewReader(buf.Bytes()))
    expect(readerErr).toBeNull()
    expect(reader).not.toBeNull()

    const [out, readErr] = await io.ReadAll(reader!)
    expect(readErr).toBeNull()
    expect($.bytesToString(out)).toBe('hello compressed world')
  })

  test('reader implements resettable zlib reader contract', async () => {
    const first = $.markAsStructValue(new bytes.Buffer())
    const firstWriter = NewWriter(first)
    expect(firstWriter.Write($.stringToBytes('first stream'))[1]).toBeNull()
    expect(await firstWriter.Close()).toBeNull()

    const second = $.markAsStructValue(new bytes.Buffer())
    const secondWriter = NewWriter(second)
    expect(secondWriter.Write($.stringToBytes('second stream'))[1]).toBeNull()
    expect(await secondWriter.Close()).toBeNull()

    const readerInterface = $.registerInterfaceType(
      'compress/zlib.testReader',
      null,
      [
        { name: 'Close', args: [], returns: [{ type: 'error' }] },
        {
          name: 'Read',
          args: [
            {
              name: 'p',
              type: {
                kind: $.TypeKind.Slice,
                elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
              },
            },
          ],
          returns: [{ type: 'int' }, { type: 'error' }],
        },
        {
          name: 'Reset',
          args: [{ type: 'io.Reader' }, { type: '[]byte' }],
          returns: [{ type: 'error' }],
        },
      ],
    )

    const [reader, readerErr] = NewReader(bytes.NewReader(first.Bytes()))
    expect(readerErr).toBeNull()
    const [zlibReader, ok] = $.typeAssertTuple<
      io.ReadCloser & {
        Reset(r: io.Reader | null, dict: $.Bytes | null): $.GoError
      }
    >(reader, readerInterface)
    expect(ok).toBe(true)

    const [firstOut, firstReadErr] = await io.ReadAll(zlibReader)
    expect(firstReadErr).toBeNull()
    expect($.bytesToString(firstOut)).toBe('first stream')

    expect(zlibReader.Reset(bytes.NewReader(second.Bytes()), null)).toBeNull()
    const [secondOut, secondReadErr] = await io.ReadAll(zlibReader)
    expect(secondReadErr).toBeNull()
    expect($.bytesToString(secondOut)).toBe('second stream')
  })

  test('writer and reader honor preset dictionaries', async () => {
    const dict = $.stringToBytes('hello dictionary')
    const compressed = $.markAsStructValue(new bytes.Buffer())
    const [writer, writerErr] = NewWriterLevelDict(
      compressed,
      DefaultCompression,
      dict,
    )
    expect(writerErr).toBeNull()
    expect(
      writer!.Write($.stringToBytes('hello dictionary payload'))[1],
    ).toBeNull()
    expect(await writer!.Close()).toBeNull()

    const [missingDictReader, missingDictErr] = NewReader(
      bytes.NewReader(compressed.Bytes()),
    )
    expect(missingDictReader).toBeNull()
    expect(missingDictErr).toBe(ErrDictionary)

    const [reader, readerErr] = NewReaderDict(
      bytes.NewReader(compressed.Bytes()),
      dict,
    )
    expect(readerErr).toBeNull()
    const [out, readErr] = await io.ReadAll(reader!)
    expect(readErr).toBeNull()
    expect($.bytesToString(out)).toBe('hello dictionary payload')

    const [, wrongDictErr] = NewReaderDict(
      bytes.NewReader(compressed.Bytes()),
      $.stringToBytes('wrong dictionary'),
    )
    expect(wrongDictErr).toBe(ErrDictionary)

    const corrupt = Uint8Array.from(compressed.Bytes())
    corrupt[corrupt.length - 1] ^= 0xff
    const [, corruptErr] = NewReaderDict(bytes.NewReader(corrupt), dict)
    expect(corruptErr).toBe(ErrChecksum)
  })

  test('reader reset accepts async generated readers', async () => {
    const compressed = $.markAsStructValue(new bytes.Buffer())
    const writer = NewWriter(compressed)
    expect(writer.Write($.stringToBytes('async source stream'))[1]).toBeNull()
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
    expect($.bytesToString(out)).toBe('async source stream')
  })

  test('Close awaits pointer-wrapped generated writers', async () => {
    const chunks: number[] = []
    const sink = {
      async Write(p: $.Bytes): Promise<[number, $.GoError]> {
        await Promise.resolve()
        chunks.push(...Array.from(p ?? []))
        return [$.len(p), null]
      },
    }
    const writer = NewWriter(
      $.interfaceValue($.varRef(sink), '*zlib.asyncWriter'),
    )

    const [written, writeErr] = writer.Write($.stringToBytes('async zlib sink'))
    expect(writeErr).toBeNull()
    expect(written).toBe('async zlib sink'.length)
    expect(await writer.Close()).toBeNull()
    expect(chunks.length).toBeGreaterThan(0)
  })
})

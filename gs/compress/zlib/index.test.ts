import { describe, expect, test } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'
import * as io from '@goscript/io/index.js'

import { NewReader, NewWriter } from './index.js'

describe('compress/zlib override', () => {
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

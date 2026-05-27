import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'

import { New, Size, Sum } from './index.js'

describe('crypto/sha1 override', () => {
  it('matches Node digest', async () => {
    const data = new TextEncoder().encode('goscript sha1')

    expect(toHex(await Sum(data))).toBe(nodeHash(data))
  })

  it('supports incremental hash.Hash use', async () => {
    const h = New()
    h.Write(new TextEncoder().encode('go'))
    h.Write(new TextEncoder().encode('script'))

    expect(toHex(await h.Sum(null))).toBe(
      nodeHash(new TextEncoder().encode('goscript')),
    )
  })

  it('appends into spare byte-slice backing', async () => {
    const h = New()
    h.Write(new TextEncoder().encode('abc'))

    const backing = $.makeSlice<number>(Size, undefined, 'byte')
    const out = await h.Sum($.goSlice(backing, 0, 0))
    expect(out.length).toBe(Size)
    expect(backing[0]).toBe(out[0])
    expect(backing[Size - 1]).toBe(out[Size - 1])
    expect(toHex($.bytesToUint8Array(backing))).toBe(
      nodeHash(new TextEncoder().encode('abc')),
    )
  })
})

function nodeHash(data: Uint8Array): string {
  return createHash('sha1').update(data).digest('hex')
}

function toHex(value: Uint8Array): string {
  return Buffer.from(value).toString('hex')
}

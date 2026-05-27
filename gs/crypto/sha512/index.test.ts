import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'

import { New, Size, Sum384, Sum512, Sum512_224, Sum512_256 } from './index.js'

describe('crypto/sha512 override', () => {
  it('matches Node digests', async () => {
    const data = new TextEncoder().encode('goscript sha512')

    expect(toHex(await Sum512(data))).toBe(nodeHash('sha512', data))
    expect(toHex(await Sum384(data))).toBe(nodeHash('sha384', data))
    expect(toHex(await Sum512_224(data))).toBe(nodeHash('sha512-224', data))
    expect(toHex(await Sum512_256(data))).toBe(nodeHash('sha512-256', data))
  })

  it('supports incremental hash.Hash use', async () => {
    const h = New()
    h.Write(new TextEncoder().encode('go'))
    h.Write(new TextEncoder().encode('script'))

    expect(toHex(await h.Sum(null))).toBe(
      nodeHash('sha512', new TextEncoder().encode('goscript')),
    )
  })

  it('appends into spare byte-slice backing', async () => {
    const h = New()
    h.Write(new TextEncoder().encode('abc'))

    const backing = $.makeSlice<number>(Size, undefined, 'byte')
    const out = await h.Sum($.goSlice(backing, 0, 0))
    expect(out.length).toBe(Size)
    expect(toHex($.bytesToUint8Array(backing))).toBe(
      nodeHash('sha512', new TextEncoder().encode('abc')),
    )
  })
})

function nodeHash(algorithm: string, data: Uint8Array): string {
  return createHash(algorithm).update(data).digest('hex')
}

function toHex(value: Uint8Array): string {
  return Buffer.from(value).toString('hex')
}

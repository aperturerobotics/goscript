import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'

import { New, Sum } from './index.js'

describe('crypto/sha1 override', () => {
  it('matches Node digest', async () => {
    const data = new TextEncoder().encode('goscript sha1')

    expect(toHex(await Sum(data))).toBe(nodeHash(data))
  })

  it('supports incremental hash.Hash use', async () => {
    const h = New()
    h.Write(new TextEncoder().encode('go'))
    h.Write(new TextEncoder().encode('script'))

    expect(toHex(await h.Sum(null))).toBe(nodeHash(new TextEncoder().encode('goscript')))
  })
})

function nodeHash(data: Uint8Array): string {
  return createHash('sha1').update(data).digest('hex')
}

function toHex(value: Uint8Array): string {
  return Buffer.from(value).toString('hex')
}

import { describe, expect, it } from 'vitest'

import { makeMap, mapGet, mapSet } from './map.js'
import {
  bytesToString,
  copy,
  indexString,
  len,
  sliceString,
  stringCompare,
  stringEqual,
  stringToBytes,
} from './slice.js'

describe('builtin string byte representation', () => {
  it('round-trips non-UTF-8 byte strings without external provenance', () => {
    const original = new Uint8Array([0, 255, 128, 65, 66])
    const str = bytesToString(original)

    expect(Array.from(stringToBytes(str))).toEqual(Array.from(original))
    expect(len(str)).toBe(original.length)
    expect(indexString(str, 1)).toBe(255)
    expect(Array.from(stringToBytes(sliceString(str, 1, 4)))).toEqual([
      255, 128, 65,
    ])
  })

  it('copies UTF-8 strings by bytes', () => {
    const dst = new Uint8Array(3)

    expect(copy(dst, '你')).toBe(3)
    expect(Array.from(dst)).toEqual([0xe4, 0xbd, 0xa0])
  })

  it('compares byte-backed string aliases by bytes', () => {
    const peerID = new Uint8Array([0, 255, 65])

    expect(stringEqual(peerID, bytesToString(peerID))).toBe(true)
    expect(stringEqual(peerID, '')).toBe(false)
    expect(stringEqual(new Uint8Array(0), '')).toBe(true)
  })

  it('matches byte-backed strings as map keys', () => {
    const raw = new Uint8Array([10, 36, 8, 1, 18, 32, 222, 187])
    const key = bytesToString(raw)
    const m = makeMap<string, string>()

    mapSet(m, key, 'cached')

    expect(mapGet(m, bytesToString(raw), '')).toEqual(['cached', true])
  })

  it('orders byte-backed strings by Go string bytes', () => {
    expect(
      stringCompare(new Uint8Array([0, 255]), new Uint8Array([1])),
    ).toBeLessThan(0)
    expect(
      stringCompare(new Uint8Array([1]), new Uint8Array([0, 255])),
    ).toBeGreaterThan(0)
    expect(
      stringCompare(new Uint8Array([1, 2]), new Uint8Array([1, 2, 0])),
    ).toBeLessThan(0)
    expect(
      stringCompare(
        bytesToString(new Uint8Array([255])),
        new Uint8Array([255]),
      ),
    ).toBe(0)
  })
})

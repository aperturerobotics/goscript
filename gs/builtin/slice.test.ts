import { describe, expect, it } from 'vitest'

import {
  bytesToString,
  copy,
  indexString,
  len,
  sliceString,
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
})

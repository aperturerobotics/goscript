import { describe, expect, it } from 'vitest'

import { arrayToSlice } from '@goscript/builtin/index.js'
import { TrailingZeros64 } from '@goscript/math/bits/index.js'

import { Load32, Load64, Store64 } from './index.js'

function bytes(value: string): number[] {
  return Array.from(value, (char) => char.charCodeAt(0))
}

function matchBytes(a: number[], b: number[]): number {
  const diff =
    (Load64(undefined, arrayToSlice(a), 0) as unknown as bigint) ^
    (Load64(undefined, arrayToSlice(b), 0) as unknown as bigint)
  return TrailingZeros64(diff) >> 3
}

describe('klauspost internal le override', () => {
  it('loads 32-bit little-endian values as unsigned numbers', () => {
    expect(Load32(undefined, arrayToSlice([0x78, 0x78, 0x78, 0x78]), 0)).toBe(
      2021161080,
    )
  })

  it('keeps high-byte 64-bit differences exact for S2 match length', () => {
    const base = bytes('xxxxxxxx')
    expect(matchBytes(base, bytes('yxxxxxxx'))).toBe(0)
    expect(matchBytes(base, bytes('xxxxyxxx'))).toBe(4)
  })

  it('stores 64-bit little-endian values at the requested offset', () => {
    const out = arrayToSlice<number>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    Store64(undefined, out, 1, 0x0102030405060708n)
    expect(Array.from(out!)).toEqual([0, 8, 7, 6, 5, 4, 3, 2, 1, 0])
  })
})

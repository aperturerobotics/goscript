import { describe, expect, test } from 'vitest'

import {
  BEAppendUint64,
  BEPutUint64,
  BEUint64,
  LEAppendUint64,
  LEPutUint64,
  LEUint64,
} from './index.js'

describe('internal/byteorder uint64', () => {
  test('reads and writes big-endian bigint values', () => {
    const bytes = new Uint8Array(8)

    BEPutUint64(bytes, 0x0102030405060708n)

    expect(Array.from(bytes)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(BEUint64(bytes)).toBe(0x0102030405060708n)
  })

  test('reads and writes little-endian bigint values', () => {
    const bytes = new Uint8Array(8)

    LEPutUint64(bytes, 0x0102030405060708n)

    expect(Array.from(bytes)).toEqual([8, 7, 6, 5, 4, 3, 2, 1])
    expect(LEUint64(bytes)).toBe(0x0102030405060708n)
  })

  test('appends uint64 values', () => {
    expect(Array.from(BEAppendUint64(new Uint8Array([0xaa]), 0x0102n))).toEqual([
      0xaa, 0, 0, 0, 0, 0, 0, 1, 2,
    ])
    expect(Array.from(LEAppendUint64(new Uint8Array([0xaa]), 0x0102n))).toEqual([
      0xaa, 2, 1, 0, 0, 0, 0, 0, 0,
    ])
  })
})

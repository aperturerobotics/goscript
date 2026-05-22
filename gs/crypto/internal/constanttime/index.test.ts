import { describe, expect, test } from 'vitest'

import { ByteEq, Eq, LessOrEq, Select } from './index.js'

describe('crypto/internal/constanttime override', () => {
  test('selects on any non-zero selector', () => {
    expect(Select(0, 11, 22)).toBe(22)
    expect(Select(1, 11, 22)).toBe(11)
    expect(Select(7, 11, 22)).toBe(11)
  })

  test('compares bytes and int32 values', () => {
    expect(ByteEq(0xff, 0xff)).toBe(1)
    expect(ByteEq(0x1ff, 0xff)).toBe(1)
    expect(ByteEq(0x01, 0x02)).toBe(0)
    expect(Eq(12, 12)).toBe(1)
    expect(Eq(12, 13)).toBe(0)
  })

  test('compares integer ordering', () => {
    expect(LessOrEq(1, 1)).toBe(1)
    expect(LessOrEq(1, 2)).toBe(1)
    expect(LessOrEq(2, 1)).toBe(0)
  })
})

import { describe, expect, test } from 'vitest'

import * as $ from '../../builtin/index.js'
import { AddInt64, AddUint64, AndUint64, OrUint64 } from './doc_64.gs.js'

function asBigInt(value: number): bigint {
  return typeof value === 'bigint' ? value : BigInt(value)
}

describe('sync/atomic 64-bit operations', () => {
  test('adds uint64 values without mixing number and bigint arithmetic', () => {
    const value = $.varRef($.uint('18446744073709551614', 64))

    expect(AddUint64(value, $.uint(2, 64))).toBe(0)
    expect(value.value).toBe(0)
  })

  test('preserves high uint64 bits for bitwise operations', () => {
    const value = $.varRef($.uint('9223372036854775808', 64))

    expect(asBigInt(OrUint64(value, $.uint(1, 64)))).toBe(9223372036854775808n)
    expect(asBigInt(value.value)).toBe(9223372036854775809n)

    expect(asBigInt(AndUint64(value, $.uint('18446744073709551614', 64)))).toBe(
      9223372036854775809n,
    )
    expect(asBigInt(value.value)).toBe(9223372036854775808n)
  })

  test('adds int64 values without number coercion', () => {
    const value = $.varRef($.int('9223372036854775807', 64))

    expect(AddInt64(value, 1)).toBe(-9223372036854775808)
    expect(value.value).toBe(-9223372036854775808)
  })
})

import { describe, expect, it } from 'vitest'

import { Itoa } from './itoa.gs.js'

describe('strconv.Itoa', () => {
  // GoScript represents a Go int as a runtime bigint, so Itoa must accept a
  // bigint directly. The earlier BigInt(Math.trunc(i)) body threw "Cannot
  // convert a BigInt value to a number" on every Go int argument.
  it('formats a bigint argument', () => {
    expect(Itoa(0n)).toBe('0')
    expect(Itoa(42n)).toBe('42')
    expect(Itoa(-42n)).toBe('-42')
    expect(Itoa(9223372036854775807n)).toBe('9223372036854775807')
    expect(Itoa(-9223372036854775808n)).toBe('-9223372036854775808')
  })

  it('formats a number argument', () => {
    expect(Itoa(0)).toBe('0')
    expect(Itoa(42)).toBe('42')
    expect(Itoa(-7)).toBe('-7')
  })
})

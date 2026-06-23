import { describe, expect, it } from 'vitest'

import { Compare, Less, Or } from './index.js'

describe('cmp.Compare', () => {
  it('orders ordinary values', () => {
    expect(Compare(1, 2)).toBe(-1)
    expect(Compare(2, 1)).toBe(1)
    expect(Compare(2, 2)).toBe(0)
    expect(Compare('a', 'b')).toBe(-1)
  })

  it('orders NaN below every non-NaN value (Go cmp.Compare)', () => {
    expect(Compare(Number.NaN, 1)).toBe(-1)
    expect(Compare(1, Number.NaN)).toBe(1)
    expect(Compare(Number.NaN, Number.NEGATIVE_INFINITY)).toBe(-1)
  })

  it('treats two NaNs as equal', () => {
    expect(Compare(Number.NaN, Number.NaN)).toBe(0)
  })

  it('treats -0 and 0 as equal', () => {
    expect(Compare(-0, 0)).toBe(0)
  })
})

describe('cmp.Less', () => {
  it('reports NaN as less than any non-NaN value', () => {
    expect(Less(Number.NaN, 1)).toBe(true)
    expect(Less(1, Number.NaN)).toBe(false)
    expect(Less(Number.NaN, Number.NaN)).toBe(false)
  })

  it('reports ordinary ordering', () => {
    expect(Less(1, 2)).toBe(true)
    expect(Less(2, 1)).toBe(false)
  })
})

describe('cmp.Or', () => {
  it('returns the first non-zero comparison', () => {
    expect(Or(0, 0, -1, 1)).toBe(-1)
    expect(Or(0, 0)).toBe(0)
  })
})

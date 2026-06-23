import { describe, expect, it } from 'vitest'

import { FormatFloat } from './ftoa.gs.js'

const X = 'x'.charCodeAt(0)
const XU = 'X'.charCodeAt(0)

// Ground truth captured from go1.26.4 strconv.FormatFloat with the 'x' verb.
describe("strconv.FormatFloat 'x' (Go hex-float syntax)", () => {
  it('emits normalized hex floats with a signed two-digit exponent', () => {
    expect(FormatFloat(100, X, -1, 64)).toBe('0x1.9p+06')
    expect(FormatFloat(1, X, -1, 64)).toBe('0x1p+00')
    expect(FormatFloat(0.5, X, -1, 64)).toBe('0x1p-01')
    expect(FormatFloat(3, X, -1, 64)).toBe('0x1.8p+01')
    expect(FormatFloat(255, X, -1, 64)).toBe('0x1.fep+07')
    expect(FormatFloat(0.1, X, -1, 64)).toBe('0x1.999999999999ap-04')
  })

  it('handles zero and negative values', () => {
    expect(FormatFloat(0, X, -1, 64)).toBe('0x0p+00')
    expect(FormatFloat(-100, X, -1, 64)).toBe('-0x1.9p+06')
    expect(FormatFloat(-0, X, -1, 64)).toBe('-0x0p+00')
  })

  it('respects fixed precision with round-half-to-even and carry', () => {
    expect(FormatFloat(100, X, 2, 64)).toBe('0x1.90p+06')
    expect(FormatFloat(100, X, 4, 64)).toBe('0x1.9000p+06')
    expect(FormatFloat(100, X, 13, 64)).toBe('0x1.9000000000000p+06')
    expect(FormatFloat(1.9375, X, 0, 64)).toBe('0x1p+01')
    expect(FormatFloat(1.96875, X, 1, 64)).toBe('0x1.0p+01')
    expect(FormatFloat(255, X, 0, 64)).toBe('0x1p+08')
    expect(FormatFloat(255, X, 1, 64)).toBe('0x1.0p+08')
  })

  it('formats the smallest subnormal and float32 values', () => {
    expect(FormatFloat(5e-324, X, -1, 64)).toBe('0x1p-1074')
    expect(FormatFloat(100, X, -1, 32)).toBe('0x1.9p+06')
  })

  it('uses the uppercase 0X/P form for the X verb', () => {
    expect(FormatFloat(100, XU, -1, 64)).toBe('0X1.9P+06')
  })
})

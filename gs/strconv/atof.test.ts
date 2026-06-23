import { describe, expect, it } from 'vitest'

import { ParseFloat } from './atof.gs.js'
import { ErrRange, ErrSyntax, NumError } from './atoi.gs.js'

// Ground truth captured from go1.26.4 strconv.ParseFloat over the same inputs.
describe('strconv.ParseFloat (Go float syntax)', () => {
  it('parses decimal floats and forms with a leading dot', () => {
    expect(ParseFloat('1.5', 64)).toEqual([1.5, null])
    expect(ParseFloat('.5', 64)).toEqual([0.5, null])
    expect(ParseFloat('1_000.5', 64)).toEqual([1000.5, null])
  })

  it('rejects trailing junk and leading whitespace over the whole input', () => {
    const [, errJunk] = ParseFloat('1.5abc', 64)
    expect((errJunk as NumError).Err).toBe(ErrSyntax)
    const [, errWs] = ParseFloat('  1.5', 64)
    expect((errWs as NumError).Err).toBe(ErrSyntax)
  })

  it('parses Go hexadecimal floating-point syntax', () => {
    expect(ParseFloat('0x1p2', 64)).toEqual([4, null])
    expect(ParseFloat('0x1.8p3', 64)).toEqual([12, null])
  })

  it('reports ErrRange on overflow to infinity', () => {
    const [v, err] = ParseFloat('1e400', 64)
    expect(v).toBe(Infinity)
    expect((err as NumError).Err).toBe(ErrRange)
  })

  it('rounds to float32 precision and ranges float32 overflow', () => {
    expect(ParseFloat('0.1', 32)).toEqual([0.10000000149011612, null])
    const [v, err] = ParseFloat('3.5e38', 32)
    expect(v).toBe(Infinity)
    expect((err as NumError).Err).toBe(ErrRange)
  })

  it('accepts inf and nan special forms', () => {
    expect(ParseFloat('inf', 64)).toEqual([Infinity, null])
    expect(ParseFloat('-Inf', 64)).toEqual([-Infinity, null])
    const [nan] = ParseFloat('NaN', 64)
    expect(Number.isNaN(nan)).toBe(true)
  })
})

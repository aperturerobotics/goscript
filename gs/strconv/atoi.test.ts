import { describe, expect, it } from 'vitest'

import { ErrRange, ErrSyntax, NumError, ParseInt, ParseUint } from './atoi.gs.js'

// Ground truth captured from go1.26.4 strconv.ParseUint / ParseInt.
describe('strconv.ParseUint (Go base + validation)', () => {
  it('rejects trailing non-digit junk', () => {
    const [, err] = ParseUint('12abc', 10, 64)
    expect((err as NumError).Err).toBe(ErrSyntax)
  })

  it('infers base from 0x, 0b, and 0o prefixes when base is 0', () => {
    expect(ParseUint('0xff', 0, 64)).toEqual([255n, null])
    expect(ParseUint('0b101', 0, 64)).toEqual([5n, null])
    expect(ParseUint('0o17', 0, 64)).toEqual([15n, null])
    expect(ParseUint('0', 0, 64)).toEqual([0n, null])
  })

  it('enforces the bit-size range ceiling', () => {
    expect(ParseUint('255', 10, 8)).toEqual([255n, null])
    const [v, err] = ParseUint('256', 10, 8)
    expect(v).toBe(255n)
    expect((err as NumError).Err).toBe(ErrRange)
  })

  it('allows underscores only when the base is auto-detected', () => {
    expect(ParseUint('1_000', 0, 64)).toEqual([1000n, null])
    const [, err] = ParseUint('1_000', 10, 64)
    expect((err as NumError).Err).toBe(ErrSyntax)
  })
})

describe('strconv.ParseInt (Go sign + range)', () => {
  it('parses signed values within range', () => {
    expect(ParseInt('-128', 10, 8)).toEqual([-128n, null])
    expect(ParseInt('+42', 10, 64)).toEqual([42n, null])
  })

  it('reports ErrRange past the signed ceiling', () => {
    const [v, err] = ParseInt('-129', 10, 8)
    expect(v).toBe(-128n)
    expect((err as NumError).Err).toBe(ErrRange)
  })

  it('rejects trailing junk', () => {
    const [, err] = ParseInt('12x', 10, 64)
    expect((err as NumError).Err).toBe(ErrSyntax)
  })
})

import { describe, expect, it } from 'vitest'

import { max, min } from './builtin.js'

// Go's min/max builtins work over any ordered type, including int64/uint64,
// which lower to JS bigint. Inconsistent lowering can hand min/max one number
// and one bigint operand for the same Go integer type. Math.min/Math.max throw
// "Cannot convert a BigInt value to a number" on any bigint argument, so the
// helpers must take a relational path whenever either operand is a bigint.
// Regression for the Space World finalization crash:
//   max(acceptedSeqno /* uint64 -> number */, innerSeqno+1 /* bigint */)
describe('builtin min/max mixed number/bigint operands', () => {
  it('max does not throw with number first, bigint second', () => {
    expect(() => max(5 as unknown as bigint, 10n)).not.toThrow()
    expect(max(5 as unknown as bigint, 10n)).toBe(10n)
    expect(max(50 as unknown as bigint, 10n)).toBe(50)
  })

  it('max does not throw with bigint first, number second', () => {
    expect(() => max(10n, 5 as unknown as bigint)).not.toThrow()
    expect(max(10n, 5 as unknown as bigint)).toBe(10n)
    expect(max(3n, 9 as unknown as bigint)).toBe(9)
  })

  it('min does not throw with number first, bigint second', () => {
    expect(() => min(5 as unknown as bigint, 10n)).not.toThrow()
    expect(min(5 as unknown as bigint, 10n)).toBe(5)
    expect(min(50 as unknown as bigint, 10n)).toBe(10n)
  })

  it('min does not throw with bigint first, number second', () => {
    expect(() => min(10n, 5 as unknown as bigint)).not.toThrow()
    expect(min(10n, 5 as unknown as bigint)).toBe(5)
    expect(min(3n, 9 as unknown as bigint)).toBe(3n)
  })

  it('preserves pure-bigint comparison', () => {
    expect(max(7n, 4n)).toBe(7n)
    expect(min(7n, 4n)).toBe(4n)
  })

  it('preserves pure-number comparison and float NaN semantics', () => {
    expect(max(7, 4)).toBe(7)
    expect(min(7, 4)).toBe(4)
    expect(Number.isNaN(max(NaN, 4))).toBe(true)
    expect(Number.isNaN(min(NaN, 4))).toBe(true)
  })
})

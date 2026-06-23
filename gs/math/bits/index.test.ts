import { describe, expect, it } from 'vitest'

import {
  Add,
  Add32,
  Add64,
  Div,
  Div32,
  Div64,
  LeadingZeros16,
  LeadingZeros32,
  LeadingZeros64,
  LeadingZeros8,
  Len16,
  Len32,
  Len64,
  Len8,
  Mul,
  Mul32,
  Mul64,
  OnesCount,
  OnesCount16,
  OnesCount32,
  OnesCount64,
  OnesCount8,
  Rem,
  Rem32,
  Rem64,
  Reverse,
  Reverse16,
  Reverse32,
  Reverse64,
  Reverse8,
  ReverseBytes,
  ReverseBytes16,
  ReverseBytes32,
  ReverseBytes64,
  RotateLeft16,
  RotateLeft32,
  RotateLeft64,
  RotateLeft8,
  Sub,
  Sub32,
  Sub64,
  TrailingZeros,
  TrailingZeros16,
  TrailingZeros32,
  TrailingZeros64,
  TrailingZeros8,
} from './index.js'

describe('math/bits override', () => {
  it('returns the full 128-bit product from Mul64', () => {
    expect(Mul64(0xffffffffffffffffn, 0xffffffffffffffffn)).toEqual([
      0xfffffffffffffffen,
      1n,
    ])
    expect(Mul64(0x1fffffffffffffn, 0x1fffffffffffffn)).toEqual([
      0x3ffffffffffn,
      0xffc0000000000001n,
    ])
    expect(Mul64(0x1fffffffffffff, 0x1fffffffffffff)).toEqual([
      0x3ffffffffff,
      0xffc0000000000001n,
    ])
  })

  it('counts leading zeros over the 8/16-bit width, not 32', () => {
    // Zero must yield the full width, and Len of zero is 0 (Go len8tab[0]).
    expect(LeadingZeros8(0)).toBe(8)
    expect(LeadingZeros16(0)).toBe(16)
    expect(Len8(0)).toBe(0)
    expect(Len16(0)).toBe(0)
    // Non-zero values keep their width-relative counts.
    expect(LeadingZeros8(1)).toBe(7)
    expect(LeadingZeros8(0xff)).toBe(0)
    expect(Len8(0xff)).toBe(8)
    expect(LeadingZeros16(1)).toBe(15)
    expect(Len16(0x8000)).toBe(16)
  })

  it('returns remainders from double-word division helpers', () => {
    expect(Rem32(1, 0, 3)).toBe(1)
    expect(Rem(1n, 0n, 3n)).toBe(1n)
    expect(Rem64(1n, 0n, 3n)).toBe(1n)
  })

  it('rotates right for negative counts', () => {
    expect(RotateLeft8(1, -1)).toBe(0x80)
    expect(RotateLeft16(1, -1)).toBe(0x8000)
    expect(RotateLeft32(1, -1)).toBe(0x80000000)
    expect(RotateLeft64(1n, -1)).toBe(0x8000000000000000n)
  })

  // Reference values below are produced by Go's math/bits for the same inputs.
  it('Add carries out of the high bit (Go Add/Add32/Add64)', () => {
    expect(Add32(0xffffffff, 2, 0)).toEqual([1, 1])
    expect(Add64(0xffffffffffffffffn, 2n, 0n)).toEqual([1n, 1n])
    // The width-agnostic dispatcher routes to the 64-bit path.
    expect(Add(0xffffffffffffffffn, 2n, 0n)).toEqual([1n, 1n])
  })

  it('Sub borrows below zero (Go Sub/Sub32/Sub64)', () => {
    expect(Sub32(0, 1, 0)).toEqual([4294967295, 1])
    expect(Sub64(0n, 1n, 0n)).toEqual([18446744073709551615n, 1n])
    expect(Sub(0n, 1n, 0n)).toEqual([18446744073709551615n, 1n])
  })

  it('Mul returns the full double-word product (Go Mul/Mul32/Mul64)', () => {
    expect(Mul32(0xffffffff, 0xffffffff)).toEqual([4294967294, 1])
    expect(Mul(0xffffffffffffffffn, 0xffffffffffffffffn)).toEqual([
      0xfffffffffffffffen,
      1n,
    ])
  })

  it('Div splits a double-word dividend (Go Div/Div32/Div64)', () => {
    expect(Div32(1, 0, 3)).toEqual([1431655765, 1])
    expect(Div64(1n, 0n, 3n)).toEqual([6148914691236517205n, 1n])
    expect(Div(1n, 0n, 3n)).toEqual([6148914691236517205n, 1n])
  })

  it('OnesCount counts set bits over each width (Go OnesCount*)', () => {
    expect(OnesCount(0xff)).toBe(8)
    expect(OnesCount8(0xff)).toBe(8)
    expect(OnesCount16(0xf0f0)).toBe(8)
    expect(OnesCount32(0xffffffff)).toBe(32)
    expect(OnesCount64(0xffffffffffffffffn)).toBe(64)
  })

  it('TrailingZeros counts low zero bits, full width for zero (Go TrailingZeros*)', () => {
    expect(TrailingZeros(8)).toBe(3)
    expect(TrailingZeros8(0x80)).toBe(7)
    expect(TrailingZeros16(0x8000)).toBe(15)
    expect(TrailingZeros32(0x10)).toBe(4)
    expect(TrailingZeros64(0x100000000n)).toBe(32)
    expect(TrailingZeros8(0)).toBe(8)
    expect(TrailingZeros16(0)).toBe(16)
    expect(TrailingZeros32(0)).toBe(32)
    expect(TrailingZeros64(0n)).toBe(64)
  })

  it('LeadingZeros32/64 and Len32/64 use the right width (Go)', () => {
    expect(LeadingZeros32(1)).toBe(31)
    expect(LeadingZeros32(0)).toBe(32)
    expect(LeadingZeros64(1n)).toBe(63)
    expect(LeadingZeros64(0n)).toBe(64)
    expect(Len32(0x8000)).toBe(16)
    expect(Len32(0)).toBe(0)
    expect(Len64(0x100000000n)).toBe(33)
    expect(Len64(0n)).toBe(0)
  })

  it('Reverse flips bit order over each width (Go Reverse*)', () => {
    expect(Reverse8(1)).toBe(128)
    expect(Reverse16(1)).toBe(32768)
    expect(Reverse32(1)).toBe(2147483648)
    expect(Reverse64(1n)).toBe(9223372036854775808n)
    expect(Reverse(1n)).toBe(9223372036854775808n)
  })

  it('ReverseBytes flips byte order over each width (Go ReverseBytes*)', () => {
    expect(ReverseBytes16(0x0102)).toBe(513)
    expect(ReverseBytes32(0x01020304)).toBe(67305985)
    expect(ReverseBytes64(0x0102030405060708n)).toBe(578437695752307201n)
    expect(ReverseBytes(0x0102030405060708n)).toBe(578437695752307201n)
  })
})

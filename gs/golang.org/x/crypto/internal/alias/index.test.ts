import { describe, expect, test } from 'vitest'

import { AnyOverlap, InexactOverlap } from './index.js'

describe('crypto/internal/alias override', () => {
  test('reports no overlap for distinct backings', () => {
    const x = new Uint8Array([1, 2, 3, 4])
    const y = new Uint8Array([1, 2, 3, 4])
    expect(AnyOverlap(x, y)).toBe(false)
    expect(InexactOverlap(x, y)).toBe(false)
  })

  test('reports no overlap when either slice is empty', () => {
    const buf = new Uint8Array(8)
    expect(AnyOverlap(buf, new Uint8Array(0))).toBe(false)
    expect(AnyOverlap(new Uint8Array(0), buf)).toBe(false)
  })

  test('detects overlap of views over a shared backing', () => {
    const buf = new Uint8Array(8)
    const head = buf.subarray(0, 4)
    const tail = buf.subarray(4, 8)
    const straddle = buf.subarray(2, 6)
    // Disjoint halves of the same buffer do not overlap.
    expect(AnyOverlap(head, tail)).toBe(false)
    // A straddling view overlaps both halves.
    expect(AnyOverlap(head, straddle)).toBe(true)
    expect(AnyOverlap(tail, straddle)).toBe(true)
  })

  test('InexactOverlap ignores exactly aligned identical starts', () => {
    const buf = new Uint8Array(8)
    const a = buf.subarray(0, 4)
    const b = buf.subarray(0, 4)
    // Same start address: exact overlap, so InexactOverlap is false.
    expect(InexactOverlap(a, b)).toBe(false)
    // But AnyOverlap still reports the shared memory.
    expect(AnyOverlap(a, b)).toBe(true)
  })
})

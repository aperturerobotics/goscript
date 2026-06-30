import * as $ from '@goscript/builtin/index.js'

// lessFloat64 implements Go's sort order, where NaN compares before non-NaN.
export function lessFloat64(left: number, right: number): boolean {
  return left < right || (Number.isNaN(left) && !Number.isNaN(right))
}

// compareStrings compares strings by UTF-8 bytes, matching Go string order.
export function compareStrings(left: string, right: string): number {
  const leftBytes = $.stringToBytes(left)
  const rightBytes = $.stringToBytes(right)
  const limit = Math.min(leftBytes.length, rightBytes.length)
  for (let i = 0; i < limit; i++) {
    const diff = leftBytes[i]! - rightBytes[i]!
    if (diff !== 0) {
      return diff
    }
  }
  return leftBytes.length - rightBytes.length
}

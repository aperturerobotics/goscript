import * as $ from '@goscript/builtin/index.js'

// AnyOverlap reports whether x and y share memory at any (not necessarily
// corresponding) index. The memory beyond the slice length is ignored.
//
// This mirrors the upstream pointer comparison without reflect or unsafe by
// using GoScript synthetic byte addresses. Those addresses are stride separated
// per backing array, so slices over distinct backings can never compare as
// overlapping and slices over a shared backing compare by element offset, which
// reproduces the Go semantics the crypto cipher modes rely on.
export function AnyOverlap(x: $.Bytes, y: $.Bytes): boolean {
  const xLen = $.len(x)
  const yLen = $.len(y)
  if (xLen === 0 || yLen === 0) {
    return false
  }
  const xFirst = $.indexByteAddress(x, 0, 1)
  const xLast = $.indexByteAddress(x, xLen - 1, 1)
  const yFirst = $.indexByteAddress(y, 0, 1)
  const yLast = $.indexByteAddress(y, yLen - 1, 1)
  return xFirst <= yLast && yFirst <= xLast
}

// InexactOverlap reports whether x and y share memory at any non-corresponding
// index. The memory beyond the slice length is ignored. Note that x and y can
// have different lengths and still not have any inexact overlap.
//
// InexactOverlap can be used to implement the requirements of the crypto/cipher
// AEAD, Block, BlockMode and Stream interfaces.
export function InexactOverlap(x: $.Bytes, y: $.Bytes): boolean {
  const xLen = $.len(x)
  const yLen = $.len(y)
  if (xLen === 0 || yLen === 0) {
    return false
  }
  if ($.indexByteAddress(x, 0, 1) === $.indexByteAddress(y, 0, 1)) {
    return false
  }
  return AnyOverlap(x, y)
}

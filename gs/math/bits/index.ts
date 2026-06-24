// Minimal stub for math/bits package
// This replaces the auto-generated version that has TypeScript syntax errors

// UintSize is the size of a uint in bits
export const UintSize = 64

type Word64 = number | bigint

const uint64Mask = (1n << 64n) - 1n

function toUint64(x: Word64): bigint {
  if (typeof x === 'bigint') {
    return x & uint64Mask
  }
  return BigInt(Math.trunc(x)) & uint64Mask
}

function useBigIntResult(...values: Word64[]): boolean {
  return values.some((value) => typeof value === 'bigint')
}

function word64Result(value: bigint, useBigInt: boolean): Word64 {
  return useBigInt || value > BigInt(Number.MAX_SAFE_INTEGER) ?
      value
    : Number(value)
}

function rotateCount(k: number, n: number): number {
  return ((k % n) + n) % n
}

// --- Leading zeros ---
export function LeadingZeros(x: Word64): number {
  return LeadingZeros64(x)
}

// LeadingZeros8 derives from Len8 so that zero yields the full width (8), as in
// Go. Math.clz32 counts over 32 bits and returns 32 for zero, which would be
// wrong for the 8-bit width.
export function LeadingZeros8(x: number): number {
  return 8 - Len8(x)
}

export function LeadingZeros16(x: number): number {
  return 16 - Len16(x)
}

export function LeadingZeros32(x: number): number {
  return Math.clz32(x >>> 0)
}

export function LeadingZeros64(x: Word64): number {
  // For 64-bit, we need to handle it differently
  x = toUint64(x)
  if (x === 0n) return 64
  let count = 0
  let mask = 1n << 63n
  while ((x & mask) === 0n && count < 64) {
    count++
    mask >>= 1n
  }
  return count
}

// --- Trailing zeros ---
export function TrailingZeros(x: Word64): number {
  return TrailingZeros64(x)
}

export function TrailingZeros8(x: number): number {
  if (x === 0) return 8
  return Math.min(8, TrailingZeros32(x))
}

export function TrailingZeros16(x: number): number {
  if (x === 0) return 16
  return Math.min(16, TrailingZeros32(x))
}

export function TrailingZeros32(x: number): number {
  if (x === 0) return 32
  let count = 0
  while ((x & 1) === 0) {
    count++
    x >>>= 1
  }
  return count
}

export function TrailingZeros64(x: Word64): number {
  x = toUint64(x)
  if (x === 0n) return 64
  let count = 0
  while ((x & 1n) === 0n && count < 64) {
    count++
    x >>= 1n
  }
  return count
}

// --- Ones count ---
export function OnesCount(x: Word64): number {
  return OnesCount64(x)
}

export function OnesCount8(x: number): number {
  return OnesCount32(x & 0xff)
}

export function OnesCount16(x: number): number {
  return OnesCount32(x & 0xffff)
}

export function OnesCount32(x: number): number {
  // Brian Kernighan's algorithm
  let count = 0
  x = x >>> 0 // Ensure unsigned
  while (x) {
    count++
    x &= x - 1
  }
  return count
}

export function OnesCount64(x: Word64): number {
  x = toUint64(x)
  let count = 0
  while (x > 0n) {
    count++
    x &= x - 1n
  }
  return count
}

// --- Rotate left ---
export function RotateLeft(x: number, k: number): number
export function RotateLeft(x: bigint, k: number): bigint
export function RotateLeft(x: Word64, k: number): number
export function RotateLeft(x: Word64, k: number): Word64 {
  return RotateLeft64(x, k)
}

export function RotateLeft8(x: number, k: number): number {
  const n = 8
  k = rotateCount(k, n)
  x = x & 0xff
  return ((x << k) | (x >> (n - k))) & 0xff
}

export function RotateLeft16(x: number, k: number): number {
  const n = 16
  k = rotateCount(k, n)
  x = x & 0xffff
  return ((x << k) | (x >> (n - k))) & 0xffff
}

export function RotateLeft32(x: number, k: number): number {
  const n = 32
  k = rotateCount(k, n)
  x = x >>> 0 // Ensure unsigned
  return ((x << k) | (x >>> (n - k))) >>> 0
}

export function RotateLeft64(x: number, k: number): number
export function RotateLeft64(x: bigint, k: number): bigint
export function RotateLeft64(x: Word64, k: number): number
export function RotateLeft64(x: Word64, k: number): Word64 {
  const n = 64
  k = rotateCount(k, n)
  const useBigInt = useBigIntResult(x)
  const word = toUint64(x)
  return word64Result(
    ((word << BigInt(k)) | (word >> BigInt(n - k))) & uint64Mask,
    useBigInt,
  )
}

// --- Reverse ---
export function Reverse(x: number): number
export function Reverse(x: bigint): bigint
export function Reverse(x: Word64): number
export function Reverse(x: Word64): Word64 {
  return Reverse64(x)
}

export function Reverse8(x: number): number {
  x = x & 0xff
  x = ((x & 0xf0) >> 4) | ((x & 0x0f) << 4)
  x = ((x & 0xcc) >> 2) | ((x & 0x33) << 2)
  x = ((x & 0xaa) >> 1) | ((x & 0x55) << 1)
  return x
}

export function Reverse16(x: number): number {
  x = x & 0xffff
  x = ((x & 0xff00) >> 8) | ((x & 0x00ff) << 8)
  x = ((x & 0xf0f0) >> 4) | ((x & 0x0f0f) << 4)
  x = ((x & 0xcccc) >> 2) | ((x & 0x3333) << 2)
  x = ((x & 0xaaaa) >> 1) | ((x & 0x5555) << 1)
  return x
}

export function Reverse32(x: number): number {
  x = x >>> 0 // Ensure unsigned
  x = ((x & 0xffff0000) >>> 16) | ((x & 0x0000ffff) << 16)
  x = ((x & 0xff00ff00) >>> 8) | ((x & 0x00ff00ff) << 8)
  x = ((x & 0xf0f0f0f0) >>> 4) | ((x & 0x0f0f0f0f) << 4)
  x = ((x & 0xcccccccc) >>> 2) | ((x & 0x33333333) << 2)
  x = ((x & 0xaaaaaaaa) >>> 1) | ((x & 0x55555555) << 1)
  return x >>> 0
}

export function Reverse64(x: number): number
export function Reverse64(x: bigint): bigint
export function Reverse64(x: Word64): number
export function Reverse64(x: Word64): Word64 {
  // Implement 64-bit reverse using similar bit manipulation
  const useBigInt = useBigIntResult(x)
  let word = toUint64(x)

  // Swap 32-bit halves
  word =
    ((word & 0xffffffff00000000n) >> 32n) |
    ((word & 0x00000000ffffffffn) << 32n)
  // Swap 16-bit chunks
  word =
    ((word & 0xffff0000ffff0000n) >> 16n) |
    ((word & 0x0000ffff0000ffffn) << 16n)
  // Swap 8-bit chunks
  word =
    ((word & 0xff00ff00ff00ff00n) >> 8n) | ((word & 0x00ff00ff00ff00ffn) << 8n)
  // Swap 4-bit chunks
  word =
    ((word & 0xf0f0f0f0f0f0f0f0n) >> 4n) | ((word & 0x0f0f0f0f0f0f0f0fn) << 4n)
  // Swap 2-bit chunks
  word =
    ((word & 0xccccccccccccccccn) >> 2n) | ((word & 0x3333333333333333n) << 2n)
  // Swap 1-bit chunks
  word =
    ((word & 0xaaaaaaaaaaaaaaaan) >> 1n) | ((word & 0x5555555555555555n) << 1n)

  return word64Result(word & uint64Mask, useBigInt)
}

// --- ReverseBytes ---
export function ReverseBytes(x: number): number
export function ReverseBytes(x: bigint): bigint
export function ReverseBytes(x: Word64): number
export function ReverseBytes(x: Word64): Word64 {
  return ReverseBytes64(x)
}

export function ReverseBytes16(x: number): number {
  return ((x & 0xff) << 8) | ((x & 0xff00) >> 8)
}

export function ReverseBytes32(x: number): number {
  x = x >>> 0 // Ensure unsigned
  return (
    (((x & 0xff) << 24) |
      ((x & 0xff00) << 8) |
      ((x & 0xff0000) >> 8) |
      ((x & 0xff000000) >>> 24)) >>>
    0
  )
}

export function ReverseBytes64(x: number): number
export function ReverseBytes64(x: bigint): bigint
export function ReverseBytes64(x: Word64): number
export function ReverseBytes64(x: Word64): Word64 {
  const useBigInt = useBigIntResult(x)
  const word = toUint64(x)

  return word64Result(
    (((word & 0xffn) << 56n) |
      ((word & 0xff00n) << 40n) |
      ((word & 0xff0000n) << 24n) |
      ((word & 0xff000000n) << 8n) |
      ((word & 0xff00000000n) >> 8n) |
      ((word & 0xff0000000000n) >> 24n) |
      ((word & 0xff000000000000n) >> 40n) |
      ((word & 0xff00000000000000n) >> 56n)) &
      uint64Mask,
    useBigInt,
  )
}

// --- Len ---
export function Len(x: Word64): number {
  return Len64(x)
}

// Len8 is the bit-length primitive (Go uses a len8tab lookup): the minimum
// number of bits to represent the low 8 bits of x, and 0 for x == 0.
export function Len8(x: number): number {
  x &= 0xff
  let n = 0
  while (x > 0) {
    x >>= 1
    n++
  }
  return n
}

export function Len16(x: number): number {
  x &= 0xffff
  let n = 0
  while (x > 0) {
    x >>= 1
    n++
  }
  return n
}

export function Len32(x: number): number {
  return 32 - LeadingZeros32(x)
}

export function Len64(x: Word64): number {
  return 64 - LeadingZeros64(x)
}

// --- Multiplication functions ---
export function Mul(x: number, y: number): [number, number]
export function Mul(x: bigint, y: bigint): [bigint, bigint]
export function Mul(x: Word64, y: Word64): [number, number]
export function Mul(x: Word64, y: Word64): [Word64, Word64] {
  return Mul64(x, y)
}

export function Mul32(x: number, y: number): [number, number] {
  // The product of two uint32 needs 64 bits, beyond the 53-bit mantissa of a
  // JS number, so multiply exactly via bigint before splitting hi/lo.
  const product = BigInt(x >>> 0) * BigInt(y >>> 0)
  const hi = Number((product >> 32n) & 0xffffffffn)
  const lo = Number(product & 0xffffffffn)
  return [hi, lo]
}

export function Mul64(x: number, y: number): [number, number]
export function Mul64(x: bigint, y: bigint): [bigint, bigint]
export function Mul64(x: Word64, y: Word64): [number, number]
export function Mul64(x: Word64, y: Word64): [Word64, Word64] {
  const useBigInt = useBigIntResult(x, y)
  x = toUint64(x)
  y = toUint64(y)
  const product = x * y
  const lo = product & uint64Mask
  const hi = product >> 64n

  return [word64Result(hi & uint64Mask, useBigInt), word64Result(lo, useBigInt)]
}

// --- Division functions ---
export function Div(hi: number, lo: number, y: number): [number, number]
export function Div(hi: bigint, lo: bigint, y: bigint): [bigint, bigint]
export function Div(hi: Word64, lo: Word64, y: Word64): [number, number]
export function Div(hi: Word64, lo: Word64, y: Word64): [Word64, Word64] {
  return Div64(hi, lo, y)
}

export function Div32(hi: number, lo: number, y: number): [number, number] {
  if (y === 0) {
    throw new Error('division by zero')
  }

  // Combine hi and lo into a 64-bit value using BigInt for precision
  const dividend = (BigInt(hi >>> 0) << 32n) | BigInt(lo >>> 0)
  const divisor = BigInt(y >>> 0)

  const quotient = dividend / divisor
  const remainder = dividend % divisor

  return [Number(quotient), Number(remainder)]
}

export function Div64(hi: number, lo: number, y: number): [number, number]
export function Div64(hi: bigint, lo: bigint, y: bigint): [bigint, bigint]
export function Div64(hi: Word64, lo: Word64, y: Word64): [number, number]
export function Div64(hi: Word64, lo: Word64, y: Word64): [Word64, Word64] {
  const useBigInt = useBigIntResult(hi, lo, y)
  hi = toUint64(hi)
  lo = toUint64(lo)
  y = toUint64(y)
  if (y === 0n) {
    throw new Error('division by zero')
  }

  // Combine hi and lo into a 128-bit value (simulated)
  // For simplicity, we'll use a basic implementation
  const dividend = (hi << 64n) | lo
  const quotient = dividend / y
  const remainder = dividend % y

  return [word64Result(quotient, useBigInt), word64Result(remainder, useBigInt)]
}

export function Rem(hi: Word64, lo: Word64, y: Word64): Word64 {
  return Div(hi, lo, y)[1]
}

export function Rem32(hi: number, lo: number, y: number): number {
  return Div32(hi, lo, y)[1]
}

export function Rem64(hi: number, lo: number, y: number): number
export function Rem64(hi: bigint, lo: bigint, y: bigint): bigint
export function Rem64(hi: Word64, lo: Word64, y: Word64): number
export function Rem64(hi: Word64, lo: Word64, y: Word64): Word64 {
  return Div64(hi, lo, y)[1]
}

// --- Add and Sub with carry ---
export function Add(x: number, y: number, carry: number): [number, number]
export function Add(x: bigint, y: bigint, carry: bigint): [bigint, bigint]
export function Add(x: Word64, y: Word64, carry: Word64): [number, number]
export function Add(x: Word64, y: Word64, carry: Word64): [Word64, Word64] {
  return Add64(x, y, carry)
}

export function Add32(x: number, y: number, carry: number): [number, number] {
  const sum = (x >>> 0) + (y >>> 0) + (carry >>> 0)
  const result = sum >>> 0
  const carryOut = sum > 0xffffffff ? 1 : 0
  return [result, carryOut]
}

export function Add64(x: number, y: number, carry: number): [number, number]
export function Add64(x: bigint, y: bigint, carry: bigint): [bigint, bigint]
export function Add64(x: Word64, y: Word64, carry: Word64): [number, number]
export function Add64(x: Word64, y: Word64, carry: Word64): [Word64, Word64] {
  const useBigInt = useBigIntResult(x, y, carry)
  const sum = toUint64(x) + toUint64(y) + toUint64(carry)
  const result = sum & uint64Mask
  const carryOut = sum > uint64Mask ? 1n : 0n
  return [word64Result(result, useBigInt), word64Result(carryOut, useBigInt)]
}

export function Sub(x: number, y: number, borrow: number): [number, number]
export function Sub(x: bigint, y: bigint, borrow: bigint): [bigint, bigint]
export function Sub(x: Word64, y: Word64, borrow: Word64): [number, number]
export function Sub(x: Word64, y: Word64, borrow: Word64): [Word64, Word64] {
  return Sub64(x, y, borrow)
}

export function Sub32(x: number, y: number, borrow: number): [number, number] {
  const diff = (x >>> 0) - (y >>> 0) - (borrow >>> 0)
  const result = diff >>> 0
  const borrowOut = diff < 0 ? 1 : 0
  return [result, borrowOut]
}

export function Sub64(x: number, y: number, borrow: number): [number, number]
export function Sub64(x: bigint, y: bigint, borrow: bigint): [bigint, bigint]
export function Sub64(x: Word64, y: Word64, borrow: Word64): [number, number]
export function Sub64(x: Word64, y: Word64, borrow: Word64): [Word64, Word64] {
  const useBigInt = useBigIntResult(x, y, borrow)
  const diff = toUint64(x) - toUint64(y) - toUint64(borrow)
  const result = diff & uint64Mask
  const borrowOut = diff < 0n ? 1n : 0n
  return [word64Result(result, useBigInt), word64Result(borrowOut, useBigInt)]
}

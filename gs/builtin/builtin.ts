import type { Slice, SliceProxy } from './slice.js'
import { writeHostStdoutText } from './hostio.js'
import { formatPrintedArgs } from './print.js'
import { isSliceProxy } from './slice.js'
import { isVarRef, type VarRef } from './varRef.js'

/**
 * Implementation of Go's built-in print function
 * @param args Arguments to print
 */
export function print(...args: any[]): void {
  writeHostStdoutText(args.length === 0 ? '' : formatPrintedArgs(args))
}

/**
 * Implementation of Go's built-in println function
 * @param args Arguments to print
 */
export function println(...args: any[]): void {
  const message = (args.length === 0 ? '' : formatPrintedArgs(args)) + '\n'
  writeHostStdoutText(message)
}

/**
 * Implementation of Go's built-in panic function
 * @param args Arguments passed to panic
 */
export function panic(...args: any[]): never {
  throw new Error(`panic: ${args.map((arg) => String(arg)).join(' ')}`)
}

/**
 * Implementation of Go's built-in clear function.
 * For slices, it sets all elements to their zero value.
 * For maps, it deletes all entries.
 * @param v The slice or map to clear
 */
export function clear<T>(v: Slice<T> | Map<unknown, unknown> | null): void {
  if (v === null || v === undefined) {
    return
  }
  if (v instanceof Map) {
    v.clear()
    return
  }
  if (v instanceof Uint8Array) {
    v.fill(0)
    return
  }
  if (isSliceProxy(v)) {
    const zero = clearZeroValue(v)
    for (let i = 0; i < v.length; i++) {
      v[i] = zero
    }
    return
  }
  if (Array.isArray(v)) {
    v.fill(clearZeroValue(v))
    return
  }
}

function clearZeroValue<T>(v: T[]): T {
  for (const item of v) {
    if (item !== null && item !== undefined) {
      switch (typeof item) {
        case 'number':
          return 0 as T
        case 'string':
          return '' as T
        case 'boolean':
          return false as T
      }
      break
    }
  }
  return null as T
}

/**
 * assignStruct copies all field values from source struct to target struct.
 * Used for pointer dereference assignment: *p = value
 * Copies the _fields contents from source to target.
 */
export function assignStruct<T>(target: T, source: T): void {
  if (
    target === null ||
    target === undefined ||
    source === null ||
    source === undefined
  ) {
    return
  }
  const targetFields = (target as any)._fields
  const sourceFields = (source as any)._fields
  if (!targetFields || !sourceFields) {
    return
  }
  // Copy each field's value from source to target
  for (const key of Object.keys(sourceFields)) {
    const sourceField = sourceFields[key]
    const targetField = targetFields[key]
    if (sourceField && targetField && sourceField.value !== undefined) {
      targetField.value = sourceField.value
    }
  }
}

/**
 * pointerValue unwraps a Go pointer value for generated field, method, and
 * dereference access. Struct pointers may be represented directly as class
 * instances or indirectly as VarRef values when the pointer came from taking a
 * variable's address.
 */
export function pointerValue<T>(value: T | VarRef<T> | null | undefined): T {
  if (value === null || value === undefined) {
    throw new Error(
      'runtime error: invalid memory address or nil pointer dereference',
    )
  }
  if (isVarRef(value)) {
    return value.value as T
  }
  return value
}

export function pointerValueOrNil<T>(
  value: T | VarRef<T> | null | undefined,
): T | null {
  if (value === null || value === undefined) {
    return null
  }
  if (isVarRef(value)) {
    return value.value as T
  }
  return value
}

export function arrayEqual(a: unknown, b: unknown): boolean {
  return comparableEqual(a, b)
}

export function comparableEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true
  }
  if (a === null || a === undefined || b === null || b === undefined) {
    return false
  }
  if (isArrayLike(a) && isArrayLike(b)) {
    if (a.length !== b.length) {
      return false
    }
    for (let i = 0; i < a.length; i++) {
      if (!comparableEqual(a[i], b[i])) {
        return false
      }
    }
    return true
  }
  if (isComplexValue(a) || isComplexValue(b)) {
    return (
      isComplexValue(a) &&
      isComplexValue(b) &&
      a.real === b.real &&
      a.imag === b.imag
    )
  }
  if (hasGoType(a) || hasGoType(b)) {
    if (!hasGoType(a) || !hasGoType(b) || a.__goType !== b.__goType) {
      return false
    }
    if (a.__isTypedNil || b.__isTypedNil) {
      return a.__isTypedNil === true && b.__isTypedNil === true
    }
  }
  if (isStructValue(a) && isStructValue(b)) {
    return fieldsEqual(a._fields, b._fields)
  }
  return false
}

function isArrayLike(value: unknown): value is ArrayLike<unknown> {
  return Array.isArray(value) || value instanceof Uint8Array
}

function hasGoType(value: unknown): value is {
  __goType: string
  __isTypedNil?: boolean
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { __goType?: unknown }).__goType === 'string'
  )
}

function isStructValue(value: unknown): value is {
  _fields: Record<string, VarRef<unknown>>
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { _fields?: unknown })._fields === 'object' &&
    (value as { _fields?: unknown })._fields !== null
  )
}

function fieldsEqual(
  a: Record<string, VarRef<unknown>>,
  b: Record<string, VarRef<unknown>>,
): boolean {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) {
    return false
  }
  for (const key of aKeys) {
    if (!(key in b) || !comparableEqual(a[key].value, b[key].value)) {
      return false
    }
  }
  return true
}

export interface Complex {
  real: number
  imag: number
}

function isComplexValue(value: unknown): value is Complex {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { real?: unknown }).real === 'number' &&
    typeof (value as { imag?: unknown }).imag === 'number'
  )
}

export function complex(real: number, imag: number): Complex {
  return { real, imag }
}

export function real(value: number | Complex | null | undefined): number {
  if (typeof value === 'number') {
    return value
  }
  return value?.real ?? 0
}

export function imag(value: number | Complex | null | undefined): number {
  if (typeof value === 'number') {
    return 0
  }
  return value?.imag ?? 0
}

// Bytes represents all valid []byte representations in TypeScript
// This includes Uint8Array (the preferred representation) and $.Slice<number> (which includes null)
export type Bytes = Uint8Array | Slice<number>

const maxSafeBigInt = BigInt(Number.MAX_SAFE_INTEGER)
const maxUint64BigInt = 0xffffffffffffffffn

// int converts a value to a Go int type, handling proper signed integer conversion
// This ensures that values like 2147483648 (2^31) are properly handled according to Go semantics
export function int(value: number | bigint, bits = 0): number {
  if (typeof value === 'bigint') {
    if (bits > 0 && bits <= 64) {
      return Number(BigInt.asIntN(bits, value))
    }
    return Number(value)
  }
  if (bits > 0 && bits < 64) {
    const modulo = 2 ** bits
    const sign = 2 ** (bits - 1)
    let truncated = Math.trunc(value)
    if (!Number.isFinite(truncated)) {
      return truncated
    }
    truncated %= modulo
    if (truncated < 0) {
      truncated += modulo
    }
    if (truncated >= sign) {
      truncated -= modulo
    }
    return truncated
  }
  // In Go, int is typically 64-bit on 64-bit systems, but for compatibility with JavaScript
  // we need to handle the conversion properly. The issue is that JavaScript's number type
  // can represent values larger than 32-bit signed integers, but when cast in certain contexts
  // they get interpreted as signed 32-bit integers.
  //
  // For Go's int type on 64-bit systems, we should preserve the full value
  // since JavaScript numbers can safely represent integers up to Number.MAX_SAFE_INTEGER
  //
  // For this we use Math.trunc.
  return Math.trunc(value)
}

// uint converts a value to an unsigned Go integer width.
export function uint(value: number | bigint, bits = 64): number {
  if (typeof value === 'bigint') {
    const normalized = BigInt.asUintN(Math.min(bits, 64), value)
    if (bits >= 64) {
      return uint64Result(normalized)
    }
    return Number(normalized)
  }
  if (!Number.isFinite(value)) {
    return value
  }
  if (bits === 8) {
    return value & 0xff
  }
  if (bits === 16) {
    return value & 0xffff
  }
  if (bits === 32) {
    return value >>> 0
  }
  if (bits >= 64) {
    const truncated = Math.trunc(value)
    if (truncated >= 0 && truncated <= Number.MAX_SAFE_INTEGER) {
      return truncated
    }
  }
  const modulo = bits >= 64 ? 2 ** 64 : 2 ** bits
  let truncated = Math.trunc(value)
  truncated %= modulo
  if (truncated < 0) {
    truncated += modulo
  }
  return truncated
}

export function uint64Shl(
  value: number | bigint,
  shift: number | bigint,
): number {
  return uint64Result(uint64Value(value) << BigInt(Math.trunc(Number(shift))))
}

export function uint64Shr(
  value: number | bigint,
  shift: number | bigint,
): number {
  return uint64Result(uint64Value(value) >> BigInt(Math.trunc(Number(shift))))
}

export function int64Shl(
  value: number | bigint,
  shift: number | bigint,
): number {
  return int64Result(int64Value(value) << BigInt(Math.trunc(Number(shift))))
}

export function int64Shr(
  value: number | bigint,
  shift: number | bigint,
): number {
  return int64Result(int64Value(value) >> BigInt(Math.trunc(Number(shift))))
}

export function uintShr(
  value: number | bigint,
  shift: number | bigint,
  bits = 32,
): number {
  const width = Math.min(bits, 32)
  const amount = Math.trunc(Number(shift))
  if (amount < 0) {
    throw new Error('runtime error: negative shift amount')
  }
  if (amount >= width) {
    return 0
  }
  return uint(value, width) >>> amount
}

export function uint64Mul(
  left: number | bigint,
  right: number | bigint,
): number {
  return uint64Result(uint64Value(left) * uint64Value(right))
}

export function int64Mul(
  left: number | bigint,
  right: number | bigint,
): number {
  return int64Result(int64Value(left) * int64Value(right))
}

export function uint64Div(
  left: number | bigint,
  right: number | bigint,
): number {
  const divisor = uint64Value(right)
  if (divisor === 0n) {
    throw new Error('runtime error: integer divide by zero')
  }
  return uint64Result(uint64Value(left) / divisor)
}

export function int64Div(
  left: number | bigint,
  right: number | bigint,
): number {
  const divisor = int64Value(right)
  if (divisor === 0n) {
    throw new Error('runtime error: integer divide by zero')
  }
  return int64Result(int64Value(left) / divisor)
}

export function uint64Mod(
  left: number | bigint,
  right: number | bigint,
): number {
  const divisor = uint64Value(right)
  if (divisor === 0n) {
    throw new Error('runtime error: integer divide by zero')
  }
  return uint64Result(uint64Value(left) % divisor)
}

export function int64Mod(
  left: number | bigint,
  right: number | bigint,
): number {
  const divisor = int64Value(right)
  if (divisor === 0n) {
    throw new Error('runtime error: integer divide by zero')
  }
  return int64Result(int64Value(left) % divisor)
}

export function uint64Add(
  left: number | bigint,
  right: number | bigint,
): number {
  return uint64Result(uint64Value(left) + uint64Value(right))
}

export function int64Add(
  left: number | bigint,
  right: number | bigint,
): number {
  return int64Result(int64Value(left) + int64Value(right))
}

export function uint64Sub(
  left: number | bigint,
  right: number | bigint,
): number {
  return uint64Result(uint64Value(left) - uint64Value(right))
}

export function int64Sub(
  left: number | bigint,
  right: number | bigint,
): number {
  return int64Result(int64Value(left) - int64Value(right))
}

export function uint64And(
  left: number | bigint,
  right: number | bigint,
): number {
  return uint64Result(uint64Value(left) & uint64Value(right))
}

export function int64And(
  left: number | bigint,
  right: number | bigint,
): number {
  return int64Result(int64Value(left) & int64Value(right))
}

export function uint64Or(
  left: number | bigint,
  right: number | bigint,
): number {
  return uint64Result(uint64Value(left) | uint64Value(right))
}

export function int64Or(
  left: number | bigint,
  right: number | bigint,
): number {
  return int64Result(int64Value(left) | int64Value(right))
}

export function uint64Xor(
  left: number | bigint,
  right: number | bigint,
): number {
  return uint64Result(uint64Value(left) ^ uint64Value(right))
}

export function int64Xor(
  left: number | bigint,
  right: number | bigint,
): number {
  return int64Result(int64Value(left) ^ int64Value(right))
}

function int64Value(value: number | bigint): bigint {
  if (typeof value === 'bigint') {
    return BigInt.asIntN(64, value)
  }
  if (Number.isFinite(value)) {
    const truncated = Math.trunc(value)
    if (
      truncated >= Number.MIN_SAFE_INTEGER &&
      truncated <= Number.MAX_SAFE_INTEGER
    ) {
      return BigInt(truncated)
    }
  }
  return BigInt.asIntN(64, BigInt(Math.trunc(value)))
}

function int64Result(value: bigint): number {
  const normalized =
    value >= -0x8000000000000000n && value <= 0x7fffffffffffffffn
      ? value
      : BigInt.asIntN(64, value)
  return Number(normalized)
}

function uint64Value(value: number | bigint): bigint {
  if (typeof value === 'bigint') {
    return BigInt.asUintN(64, value)
  }
  if (Number.isFinite(value)) {
    const truncated = Math.trunc(value)
    if (truncated >= 0 && truncated <= Number.MAX_SAFE_INTEGER) {
      return BigInt(truncated)
    }
  }
  return BigInt.asUintN(64, BigInt(Math.trunc(value)))
}

function uint64Result(value: bigint): number {
  const normalized =
    value >= 0n && value <= maxUint64BigInt ? value : BigInt.asUintN(64, value)
  if (normalized <= maxSafeBigInt) {
    return Number(normalized)
  }
  return normalized as unknown as number
}

/**
 * Normalizes various byte representations into a `Uint8Array` for protobuf compatibility.
 *
 * @param {Uint8Array | number[] | null | undefined | { data: number[] } | { valueOf(): number[] }} bytes
 *   The input to normalize. Accepted types:
 *   - `Uint8Array`: Returned as-is.
 *   - `number[]`: Converted to a `Uint8Array`.
 *   - `null` or `undefined`: Returns an empty `Uint8Array`.
 *   - `{ data: number[] }`: An object with a `data` property (e.g., `$.Slice<number>`), where `data` is a `number[]`.
 *   - `{ valueOf(): number[] }`: An object with a `valueOf` method that returns a `number[]`.
 * @returns {Uint8Array} A normalized `Uint8Array` representation of the input.
 * @throws {Error} If the input type is unsupported or cannot be normalized.
 */
export function normalizeBytes(
  bytes: Uint8Array | number[] | null | undefined | { data: number[] },
): Uint8Array {
  if (bytes === null || bytes === undefined) {
    return new Uint8Array(0)
  }

  if (bytes instanceof Uint8Array) {
    return bytes
  }

  // Handle $.Slice<number> (which has a .data property that's a number[])
  if (
    bytes &&
    typeof bytes === 'object' &&
    'data' in bytes &&
    Array.isArray(bytes.data)
  ) {
    return new Uint8Array(bytes.data)
  }

  // Handle plain number arrays
  if (Array.isArray(bytes)) {
    return new Uint8Array(bytes)
  }

  throw new Error(`Cannot normalize bytes of type ${typeof bytes}: ${bytes}`)
}

/**
 * sortSlice sorts a slice in ascending order.
 * Handles all slice types including null, arrays, Uint8Array, and SliceProxy.
 * @param s The slice to sort in place
 */
export function sortSlice<T extends string | number>(s: Slice<T>): void {
  if (s === null || s === undefined) {
    return // Nothing to sort for nil slice
  }

  if (Array.isArray(s)) {
    s.sort()
    return
  }

  if (s instanceof Uint8Array) {
    s.sort()
    return
  }

  // Handle SliceProxy case - sort the backing array in-place within the slice bounds
  if (isSliceProxy(s)) {
    const proxy = s as SliceProxy<T>
    const meta = proxy.__meta__
    const section = meta.backing.slice(meta.offset, meta.offset + meta.length)
    section.sort()
    // Copy sorted section back to the backing array
    for (let i = 0; i < section.length; i++) {
      meta.backing[meta.offset + i] = section[i]
    }
    return
  }
}

/**
 * bytesEqual efficiently compares two byte slices for equality.
 * Optimized for different byte representations.
 */
export function bytesEqual(a: Bytes | null, b: Bytes | null): boolean {
  // Handle null cases
  if (a === null && b === null) return true
  if (a === null || b === null) return false

  // Convert to arrays for comparison
  const aArr = bytesToArray(a)
  const bArr = bytesToArray(b)

  if (aArr.length !== bArr.length) return false

  for (let i = 0; i < aArr.length; i++) {
    if (aArr[i] !== bArr[i]) return false
  }

  return true
}

/**
 * bytesCompare compares two byte slices lexicographically.
 * Returns -1 if a < b, 0 if a == b, +1 if a > b.
 */
export function bytesCompare(a: Bytes | null, b: Bytes | null): number {
  // Handle null cases
  if (a === null && b === null) return 0
  if (a === null) return -1
  if (b === null) return 1

  const aArr = bytesToArray(a)
  const bArr = bytesToArray(b)

  const minLen = Math.min(aArr.length, bArr.length)

  for (let i = 0; i < minLen; i++) {
    if (aArr[i] < bArr[i]) return -1
    if (aArr[i] > bArr[i]) return 1
  }

  if (aArr.length < bArr.length) return -1
  if (aArr.length > bArr.length) return 1
  return 0
}

/**
 * bytesToArray converts any Bytes representation to a number array.
 */
export function bytesToArray(bytes: Bytes | null): number[] {
  if (bytes === null) return []

  if (bytes instanceof Uint8Array) {
    return Array.from(bytes)
  }

  if (isSliceProxy(bytes)) {
    const proxy = bytes as SliceProxy<number>
    const meta = proxy.__meta__
    return meta.backing.slice(meta.offset, meta.offset + meta.length)
  }

  if (Array.isArray(bytes)) {
    return bytes
  }

  throw new Error(`Cannot convert bytes of type ${typeof bytes} to array`)
}

/**
 * bytesToUint8Array converts any Bytes representation to a Uint8Array.
 */
export function bytesToUint8Array(bytes: Bytes | null): Uint8Array {
  if (bytes === null) return new Uint8Array(0)

  if (bytes instanceof Uint8Array) {
    if ((bytes as Uint8Array & { __meta__?: unknown }).__meta__ !== undefined) {
      return bytes.subarray(0)
    }
    return bytes
  }

  return new Uint8Array(bytesToArray(bytes))
}

/**
 * bytesIndexOf finds the first occurrence of subslice in bytes.
 * Returns -1 if not found.
 */
export function bytesIndexOf(
  bytes: Bytes | null,
  subslice: Bytes | null,
): number {
  if (bytes === null || subslice === null) return -1

  const haystack = bytesToArray(bytes)
  const needle = bytesToArray(subslice)

  if (needle.length === 0) return 0
  if (needle.length > haystack.length) return -1

  for (let i = 0; i <= haystack.length - needle.length; i++) {
    let found = true
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) {
        found = false
        break
      }
    }
    if (found) return i
  }

  return -1
}

/**
 * bytesLastIndexOf finds the last occurrence of subslice in bytes.
 * Returns -1 if not found.
 */
export function bytesLastIndexOf(
  bytes: Bytes | null,
  subslice: Bytes | null,
): number {
  if (bytes === null || subslice === null) return -1

  const haystack = bytesToArray(bytes)
  const needle = bytesToArray(subslice)

  if (needle.length === 0) return haystack.length
  if (needle.length > haystack.length) return -1

  for (let i = haystack.length - needle.length; i >= 0; i--) {
    let found = true
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) {
        found = false
        break
      }
    }
    if (found) return i
  }

  return -1
}

/**
 * bytesIndexByte finds the first occurrence of byte c in bytes.
 * Returns -1 if not found.
 */
export function bytesIndexByte(bytes: Bytes | null, c: number): number {
  if (bytes === null) return -1

  const arr = bytesToArray(bytes)
  return arr.indexOf(c)
}

/**
 * bytesLastIndexByte finds the last occurrence of byte c in bytes.
 * Returns -1 if not found.
 */
export function bytesLastIndexByte(bytes: Bytes | null, c: number): number {
  if (bytes === null) return -1

  const arr = bytesToArray(bytes)
  return arr.lastIndexOf(c)
}

/**
 * bytesCount counts non-overlapping instances of sep in bytes.
 */
export function bytesCount(bytes: Bytes | null, sep: Bytes | null): number {
  if (bytes === null || sep === null) return 0

  const haystack = bytesToArray(bytes)
  const needle = bytesToArray(sep)

  if (needle.length === 0) {
    // Special case: empty separator counts code points + 1
    // For now, just return length + 1 (ASCII assumption)
    return haystack.length + 1
  }

  let count = 0
  let pos = 0

  while (pos <= haystack.length - needle.length) {
    let found = true
    for (let i = 0; i < needle.length; i++) {
      if (haystack[pos + i] !== needle[i]) {
        found = false
        break
      }
    }
    if (found) {
      count++
      pos += needle.length
    } else {
      pos++
    }
  }

  return count
}

// Math functions needed by various packages
export function min(a: number, b: number): number {
  return Math.min(a, b)
}

export function max(a: number, b: number): number {
  return Math.max(a, b)
}

/**
 * Converts a rune (number) or string to a string.
 * This is used to replace String.fromCharCode() in Go string(rune) conversions.
 * Since sometimes single-char rune literals are compiled to strings, this function
 * needs to handle both numbers (runes) and strings.
 *
 * @param runeOrString A rune (Unicode code point as number) or a string
 * @returns The resulting string
 */
export function runeOrStringToString(runeOrString: number | string): string {
  if (typeof runeOrString === 'string') {
    return runeOrString
  }
  // For numbers, use String.fromCharCode to convert the rune to a string
  return String.fromCharCode(runeOrString)
}

// Panic recovery function (simplified implementation)
export function recover(): any {
  // In a real implementation, this would interact with Go's panic/recover mechanism
  // For now, return null to indicate no panic was recovered
  return null
}

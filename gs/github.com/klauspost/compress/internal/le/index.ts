import * as $ from '@goscript/builtin/index.js'

export type Indexer = number

function index(value: unknown): number {
  return Number(value)
}

function byteAt(b: $.Slice<number>, i: number): number {
  return b![i] ?? 0
}

function isSlice(value: unknown): value is $.Slice<number> {
  return (
    Array.isArray(value) ||
    value === null ||
    value instanceof Uint8Array ||
    (typeof value === 'object' && value !== undefined && '__meta__' in value)
  )
}

function loadArgs(
  typeArgsOrB: $.GenericTypeArgs | $.Slice<number> | undefined,
  bOrI?: $.Slice<number> | unknown,
  i?: unknown,
): [$.Slice<number>, number] {
  if (isSlice(typeArgsOrB)) {
    return [typeArgsOrB, index(bOrI)]
  }
  return [bOrI as $.Slice<number>, index(i)]
}

export function Load8(
  typeArgsOrB: $.GenericTypeArgs | $.Slice<number> | undefined,
  bOrI?: $.Slice<number> | unknown,
  i?: unknown,
): number {
  const [b, off] = loadArgs(typeArgsOrB, bOrI, i)
  return byteAt(b, off)
}

export function Load16(
  typeArgsOrB: $.GenericTypeArgs | $.Slice<number> | undefined,
  bOrI?: $.Slice<number> | unknown,
  i?: unknown,
): number {
  const [b, off] = loadArgs(typeArgsOrB, bOrI, i)
  return byteAt(b, off) | (byteAt(b, off + 1) << 8)
}

export function Load32(
  typeArgsOrB: $.GenericTypeArgs | $.Slice<number> | undefined,
  bOrI?: $.Slice<number> | unknown,
  i?: unknown,
): number {
  const [b, off] = loadArgs(typeArgsOrB, bOrI, i)
  return (
    (byteAt(b, off) |
      (byteAt(b, off + 1) << 8) |
      (byteAt(b, off + 2) << 16) |
      (byteAt(b, off + 3) << 24)) >>>
    0
  )
}

export function Load64(
  typeArgsOrB: $.GenericTypeArgs | $.Slice<number> | undefined,
  bOrI?: $.Slice<number> | unknown,
  i?: unknown,
): bigint {
  const [b, off] = loadArgs(typeArgsOrB, bOrI, i)
  const value =
    BigInt(byteAt(b, off)) |
    (BigInt(byteAt(b, off + 1)) << 8n) |
    (BigInt(byteAt(b, off + 2)) << 16n) |
    (BigInt(byteAt(b, off + 3)) << 24n) |
    (BigInt(byteAt(b, off + 4)) << 32n) |
    (BigInt(byteAt(b, off + 5)) << 40n) |
    (BigInt(byteAt(b, off + 6)) << 48n) |
    (BigInt(byteAt(b, off + 7)) << 56n)
  return value
}

export function Store16(b: $.Slice<number>, v: number): void {
  b![0] = v & 0xff
  b![1] = (v >> 8) & 0xff
}

export function Store32(b: $.Slice<number>, v: number): void {
  b![0] = v & 0xff
  b![1] = (v >> 8) & 0xff
  b![2] = (v >> 16) & 0xff
  b![3] = (v >> 24) & 0xff
}

export function Store64(
  typeArgsOrB: $.GenericTypeArgs | $.Slice<number> | undefined,
  bOrI?: $.Slice<number> | unknown,
  iOrV?: unknown,
  maybeV?: number | bigint,
): void {
  const genericCall = !isSlice(typeArgsOrB)
  const b = (genericCall ? bOrI : typeArgsOrB) as $.Slice<number>
  const off = genericCall ? index(iOrV) : index(bOrI)
  const v = genericCall ? maybeV : iOrV
  const value = BigInt(v as number | bigint) & ((1n << 64n) - 1n)
  b![off] = Number(value & 0xffn)
  b![off + 1] = Number((value >> 8n) & 0xffn)
  b![off + 2] = Number((value >> 16n) & 0xffn)
  b![off + 3] = Number((value >> 24n) & 0xffn)
  b![off + 4] = Number((value >> 32n) & 0xffn)
  b![off + 5] = Number((value >> 40n) & 0xffn)
  b![off + 6] = Number((value >> 48n) & 0xffn)
  b![off + 7] = Number((value >> 56n) & 0xffn)
}

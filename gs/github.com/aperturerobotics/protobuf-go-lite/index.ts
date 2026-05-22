import * as $ from '../../../builtin/index.js'

export const ErrInvalidLength = $.newError(
  'proto: negative length found during unmarshaling',
)
export const ErrIntOverflow = $.newError('proto: integer overflow')
export const ErrUnexpectedEndOfGroup = $.newError(
  'proto: unexpected end of group',
)

export interface Message {
  SizeVT(): number
  MarshalToSizedBufferVT(dAtA: $.Slice<number>): [number, $.GoError]
  MarshalVT(): [$.Slice<number>, $.GoError]
  UnmarshalVT(data: $.Slice<number>): $.GoError
  Reset(): void
}

export interface JSONMessage {
  MarshalJSON(): [$.Slice<number>, $.GoError]
  UnmarshalJSON(data: $.Slice<number>): $.GoError
}

export interface CloneMessage extends Message {
  CloneMessageVT(): CloneMessage | null
}

export interface CloneVT<T> extends CloneMessage {
  CloneVT(): T
}

export interface EqualVT<T> {
  EqualVT(other: T): boolean
}

export function CompareComparable<T>(): (t1: T, t2: T) => boolean {
  return (t1, t2) => t1 === t2
}

export function IsEqualVT<T extends EqualVT<T>>(
  t1: T | null,
  t2: T | null,
): boolean
export function IsEqualVT<T extends EqualVT<T>>(
  _typeArgs: unknown,
  t1: T | null,
  t2: T | null,
): boolean
export function IsEqualVT<T extends EqualVT<T>>(
  arg0: unknown,
  arg1: T | null,
  arg2?: T | null,
): boolean {
  const t1 = arg2 === undefined ? (arg0 as T | null) : arg1
  const t2 = arg2 === undefined ? arg1 : arg2
  if (t1 == null || t2 == null) {
    return t1 == t2
  }
  return t1.EqualVT(t2)
}

export function CompareEqualVT<T extends EqualVT<T>>(
  _typeArgs?: unknown,
): (t1: T | null, t2: T | null) => boolean {
  return (t1, t2) => IsEqualVT(t1, t2)
}

export function IsEqualVTSlice<T extends EqualVT<T>>(
  s1: $.Slice<T>,
  s2: $.Slice<T>,
): boolean {
  if ($.len(s1) !== $.len(s2)) {
    return false
  }
  for (let i = 0; i < $.len(s1); i++) {
    if (!IsEqualVT((s1 as any)[i] as T, (s2 as any)[i] as T)) {
      return false
    }
  }
  return true
}

export function EncodeVarint(
  dAtA: $.Slice<number>,
  offset: number,
  v: number,
): number {
  offset -= SizeOfVarint(v)
  const base = offset
  while (v >= 0x80) {
    setByte(dAtA, offset, (v % 0x80) | 0x80)
    v = Math.floor(v / 0x80)
    offset++
  }
  setByte(dAtA, offset, v)
  return base
}

export function AppendVarint(b: $.Slice<number>, v: number): $.Slice<number> {
  const bytes: number[] = []
  while (v >= 0x80) {
    bytes.push((v % 0x80) | 0x80)
    v = Math.floor(v / 0x80)
  }
  bytes.push(v)
  return $.append(b, ...bytes)
}

export function ConsumeVarint(b: $.Slice<number>): [number, number] {
  let v = 0
  let shift = 0
  for (let i = 0; i < 10; i++) {
    if (i >= $.len(b)) {
      return [0, -1]
    }
    const value = byteSliceValue(b, i)
    if (shift === 63 && value > 1) {
      return [0, -2]
    }
    v += (value & 0x7f) * 2 ** shift
    if (value < 0x80) {
      return [v, i + 1]
    }
    shift += 7
  }
  return [0, -2]
}

export function SizeOfVarint(x: number): number {
  let n = 1
  while (x >= 0x80) {
    x = Math.floor(x / 0x80)
    n++
  }
  return n
}

export function DecodeVarint(
  b: $.Slice<number>,
  idx: number,
): [number, number, $.GoError] {
  const [v, n] = ConsumeVarint($.goSlice(b, idx, undefined))
  if (n < 0) {
    return [0, 0, n === -1 ? ioUnexpectedEOF() : ErrIntOverflow]
  }
  return [v, idx + n, null]
}

export function DecodeVarintInt32(
  b: $.Slice<number>,
  idx: number,
): [number, number, $.GoError] {
  const [v, next, err] = DecodeVarint(b, idx)
  return [toInt32(v), next, err]
}

export function DecodeVarintInt64(
  b: $.Slice<number>,
  idx: number,
): [number, number, $.GoError] {
  return DecodeVarint(b, idx)
}

export function DecodeVarintUint32(
  b: $.Slice<number>,
  idx: number,
): [number, number, $.GoError] {
  const [v, next, err] = DecodeVarint(b, idx)
  return [v >>> 0, next, err]
}

export function DecodeFixed32(
  b: $.Slice<number>,
  idx: number,
): [number, number, $.GoError] {
  if (idx + 4 > $.len(b)) {
    return [0, 0, ioUnexpectedEOF()]
  }
  const value =
    byteSliceValue(b, idx) +
    byteSliceValue(b, idx + 1) * 2 ** 8 +
    byteSliceValue(b, idx + 2) * 2 ** 16 +
    byteSliceValue(b, idx + 3) * 2 ** 24
  return [value >>> 0, idx + 4, null]
}

export function DecodeFixed64(
  b: $.Slice<number>,
  idx: number,
): [number, number, $.GoError] {
  if (idx + 8 > $.len(b)) {
    return [0, 0, ioUnexpectedEOF()]
  }
  const low =
    byteSliceValue(b, idx) +
    byteSliceValue(b, idx + 1) * 2 ** 8 +
    byteSliceValue(b, idx + 2) * 2 ** 16 +
    byteSliceValue(b, idx + 3) * 2 ** 24
  const high =
    byteSliceValue(b, idx + 4) +
    byteSliceValue(b, idx + 5) * 2 ** 8 +
    byteSliceValue(b, idx + 6) * 2 ** 16 +
    byteSliceValue(b, idx + 7) * 2 ** 24
  return [low + high * 2 ** 32, idx + 8, null]
}

export function Skip(dAtA: $.Slice<number>): [number, $.GoError] {
  const l = $.len(dAtA)
  let iNdEx = 0
  let depth = 0
  while (iNdEx < l) {
    let wire = 0
    for (let shift = 0; ; shift += 7) {
      if (shift >= 64) {
        return [0, ErrIntOverflow]
      }
      if (iNdEx >= l) {
        return [0, ioUnexpectedEOF()]
      }
      const b = byteSliceValue(dAtA, iNdEx)
      iNdEx++
      wire += (b & 0x7f) * 2 ** shift
      if (b < 0x80) {
        break
      }
    }

    const wireType = wire & 0x7
    switch (wireType) {
      case 0:
        for (let shift = 0; ; shift += 7) {
          if (shift >= 64) {
            return [0, ErrIntOverflow]
          }
          if (iNdEx >= l) {
            return [0, ioUnexpectedEOF()]
          }
          const b = byteSliceValue(dAtA, iNdEx)
          iNdEx++
          if (b < 0x80) {
            break
          }
        }
        break
      case 1:
        iNdEx += 8
        break
      case 2: {
        let length = 0
        for (let shift = 0; ; shift += 7) {
          if (shift >= 64) {
            return [0, ErrIntOverflow]
          }
          if (iNdEx >= l) {
            return [0, ioUnexpectedEOF()]
          }
          const b = byteSliceValue(dAtA, iNdEx)
          iNdEx++
          length += (b & 0x7f) * 2 ** shift
          if (b < 0x80) {
            break
          }
        }
        if (length < 0) {
          return [0, ErrInvalidLength]
        }
        iNdEx += length
        break
      }
      case 3:
        depth++
        break
      case 4:
        if (depth === 0) {
          return [0, ErrUnexpectedEndOfGroup]
        }
        depth--
        break
      case 5:
        iNdEx += 4
        break
      default:
        return [0, $.newError(`proto: illegal wireType ${wireType}`)]
    }
    if (iNdEx < 0) {
      return [0, ErrInvalidLength]
    }
    if (depth === 0) {
      return [iNdEx, null]
    }
  }
  return [0, ioUnexpectedEOF()]
}

function byteSliceValue(b: $.Slice<number>, idx: number): number {
  return $.indexStringOrBytes(b, idx)
}

function setByte(b: $.Slice<number>, idx: number, value: number): void {
  if (b == null) {
    throw new Error('assignment to nil byte slice')
  }
  b[idx] = value & 0xff
}

function toInt32(v: number): number {
  return v | 0
}

function ioUnexpectedEOF(): $.GoError {
  return $.newError('unexpected EOF')
}

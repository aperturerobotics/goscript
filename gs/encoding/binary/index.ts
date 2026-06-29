import * as $ from '@goscript/builtin/index.js'
import * as io from '@goscript/io/index.js'

export interface ByteOrder {
  Uint16(b: $.Slice<number>): number
  Uint32(b: $.Slice<number>): number
  Uint64(b: $.Slice<number>): bigint
  PutUint16(b: $.Slice<number>, v: number): void
  PutUint32(b: $.Slice<number>, v: number): void
  PutUint64(b: $.Slice<number>, v: number | bigint): void
  String(): string
}

export interface AppendByteOrder {
  AppendUint16(b: $.Slice<number>, v: number): $.Slice<number>
  AppendUint32(b: $.Slice<number>, v: number): $.Slice<number>
  AppendUint64(b: $.Slice<number>, v: number | bigint): $.Slice<number>
  String(): string
}

type fixedKind =
  | 'bool'
  | 'int8'
  | 'uint8'
  | 'int16'
  | 'uint16'
  | 'int32'
  | 'uint32'
  | 'int64'
  | 'uint64'
  | 'float32'
  | 'float64'
  | '[]bool'
  | '[]int8'
  | '[]uint8'
  | '[]int16'
  | '[]uint16'
  | '[]int32'
  | '[]uint32'
  | '[]int64'
  | '[]uint64'
  | '[]float32'
  | '[]float64'

type boxedValue = {
  __goType?: string
  __goTypeInfo?: $.TypeInfo | string
  __goValue?: unknown
}

// binShape recursively describes a fixed-size value for the struct and complex
// paths that the flat fixedKind union cannot express.
type binShape =
  | { tag: 'scalar'; kind: fixedKind }
  | { tag: 'complex'; elem: 'float32' | 'float64' }
  | { tag: 'array'; elem: binShape; count: number }
  | { tag: 'struct'; fields: { key: string; shape: binShape }[] }

type decodedTarget = {
  kind: fixedKind | null
  shape?: binShape
  value: unknown
  settable: ((value: unknown) => void) | null
}

type byteReader = {
  ReadByte(): [number, $.GoError] | Promise<[number, $.GoError]>
}

const errBufferTooSmall = $.newError('buffer too small')
const errOverflow = $.newError('binary: varint overflows a 64-bit integer')

export const MaxVarintLen16 = 3
export const MaxVarintLen32 = 5
export const MaxVarintLen64 = 10

class littleEndian implements ByteOrder, AppendByteOrder {
  public Uint(b: $.Slice<number>): bigint {
    return this.Uint64(b)
  }

  public Uint16(b: $.Slice<number>): number {
    requireLen(b, 2)
    return byteAt(b, 0) | (byteAt(b, 1) << 8)
  }

  public Uint32(b: $.Slice<number>): number {
    requireLen(b, 4)
    return (
      (byteAt(b, 0) |
        (byteAt(b, 1) << 8) |
        (byteAt(b, 2) << 16) |
        (byteAt(b, 3) << 24)) >>>
      0
    )
  }

  public Uint64(b: $.Slice<number>): bigint {
    requireLen(b, 8)
    let value = 0n
    for (let i = 0; i < 8; i++) {
      value |= BigInt(byteAt(b, i)) << BigInt(8 * i)
    }
    return uint64Result(value)
  }

  public PutUint16(b: $.Slice<number>, v: number): void {
    requireLen(b, 2)
    setByte(b, 0, v)
    setByte(b, 1, v >> 8)
  }

  public PutUint32(b: $.Slice<number>, v: number): void {
    requireLen(b, 4)
    const value = Number($.uint(v, 32))
    setByte(b, 0, value)
    setByte(b, 1, value >>> 8)
    setByte(b, 2, value >>> 16)
    setByte(b, 3, value >>> 24)
  }

  public PutUint64(b: $.Slice<number>, v: number | bigint): void {
    requireLen(b, 8)
    const value = toUint64(v)
    for (let i = 0; i < 8; i++) {
      setByte(b, i, Number((value >> BigInt(8 * i)) & 0xffn))
    }
  }

  public AppendUint16(b: $.Slice<number>, v: number): $.Slice<number> {
    return $.append(b, v, v >> 8)
  }

  public AppendUint32(b: $.Slice<number>, v: number): $.Slice<number> {
    const value = Number($.uint(v, 32))
    return $.append(b, value, value >>> 8, value >>> 16, value >>> 24)
  }

  public AppendUint64(b: $.Slice<number>, v: number | bigint): $.Slice<number> {
    let out = b
    const value = toUint64(v)
    for (let i = 0; i < 8; i++) {
      out = $.append(out, Number((value >> BigInt(8 * i)) & 0xffn))
    }
    return out
  }

  public String(): string {
    return 'LittleEndian'
  }

  public GoString(): string {
    return 'binary.LittleEndian'
  }

  public clone(): littleEndian {
    return $.markAsStructValue(new littleEndian())
  }
}

class bigEndian implements ByteOrder, AppendByteOrder {
  public Uint(b: $.Slice<number>): bigint {
    return this.Uint64(b)
  }

  public Uint16(b: $.Slice<number>): number {
    requireLen(b, 2)
    return byteAt(b, 1) | (byteAt(b, 0) << 8)
  }

  public Uint32(b: $.Slice<number>): number {
    requireLen(b, 4)
    return (
      (byteAt(b, 3) |
        (byteAt(b, 2) << 8) |
        (byteAt(b, 1) << 16) |
        (byteAt(b, 0) << 24)) >>>
      0
    )
  }

  public Uint64(b: $.Slice<number>): bigint {
    requireLen(b, 8)
    let value = 0n
    for (let i = 0; i < 8; i++) {
      value = (value << 8n) | BigInt(byteAt(b, i))
    }
    return uint64Result(value)
  }

  public PutUint16(b: $.Slice<number>, v: number): void {
    requireLen(b, 2)
    setByte(b, 0, v >> 8)
    setByte(b, 1, v)
  }

  public PutUint32(b: $.Slice<number>, v: number): void {
    requireLen(b, 4)
    const value = Number($.uint(v, 32))
    setByte(b, 0, value >>> 24)
    setByte(b, 1, value >>> 16)
    setByte(b, 2, value >>> 8)
    setByte(b, 3, value)
  }

  public PutUint64(b: $.Slice<number>, v: number | bigint): void {
    requireLen(b, 8)
    const value = toUint64(v)
    for (let i = 0; i < 8; i++) {
      setByte(b, i, Number((value >> BigInt(56 - 8 * i)) & 0xffn))
    }
  }

  public AppendUint16(b: $.Slice<number>, v: number): $.Slice<number> {
    return $.append(b, v >> 8, v)
  }

  public AppendUint32(b: $.Slice<number>, v: number): $.Slice<number> {
    const value = Number($.uint(v, 32))
    return $.append(b, value >>> 24, value >>> 16, value >>> 8, value)
  }

  public AppendUint64(b: $.Slice<number>, v: number | bigint): $.Slice<number> {
    let out = b
    const value = toUint64(v)
    for (let i = 0; i < 8; i++) {
      out = $.append(out, Number((value >> BigInt(56 - 8 * i)) & 0xffn))
    }
    return out
  }

  public String(): string {
    return 'BigEndian'
  }

  public GoString(): string {
    return 'binary.BigEndian'
  }

  public clone(): bigEndian {
    return $.markAsStructValue(new bigEndian())
  }
}

export const LittleEndian = new littleEndian()
export const BigEndian = new bigEndian()
export const NativeEndian = LittleEndian

$.registerInterfaceType('binary.ByteOrder', null, [
  {
    name: 'Uint16',
    args: [byteSliceArg('b')],
    returns: [numberReturn()],
  },
  {
    name: 'Uint32',
    args: [byteSliceArg('b')],
    returns: [numberReturn()],
  },
  {
    name: 'Uint64',
    args: [byteSliceArg('b')],
    returns: [{ type: { kind: $.TypeKind.Basic, name: 'uint64' } }],
  },
  {
    name: 'PutUint16',
    args: [byteSliceArg('b'), numberArg('v')],
    returns: [],
  },
  {
    name: 'PutUint32',
    args: [byteSliceArg('b'), numberArg('v')],
    returns: [],
  },
  {
    name: 'PutUint64',
    args: [
      byteSliceArg('b'),
      { name: 'v', type: { kind: $.TypeKind.Basic, name: 'uint64' } },
    ],
    returns: [],
  },
  {
    name: 'String',
    args: [],
    returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
  },
])

$.registerInterfaceType('binary.AppendByteOrder', null, [
  {
    name: 'AppendUint16',
    args: [byteSliceArg('b'), numberArg('v')],
    returns: [{ type: byteSliceType() }],
  },
  {
    name: 'AppendUint32',
    args: [byteSliceArg('b'), numberArg('v')],
    returns: [{ type: byteSliceType() }],
  },
  {
    name: 'AppendUint64',
    args: [
      byteSliceArg('b'),
      { name: 'v', type: { kind: $.TypeKind.Basic, name: 'uint64' } },
    ],
    returns: [{ type: byteSliceType() }],
  },
  {
    name: 'String',
    args: [],
    returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
  },
])

export function AppendUvarint(
  buf: $.Slice<number>,
  x: number | bigint,
): $.Slice<number> {
  let out = buf
  let value = toUint64(x)
  while (value >= 0x80n) {
    out = $.append(out, Number(value & 0x7fn) | 0x80)
    value >>= 7n
  }
  return $.append(out, Number(value))
}

export function PutUvarint(buf: $.Slice<number>, x: number | bigint): number {
  let value = toUint64(x)
  let i = 0
  while (value >= 0x80n) {
    setByte(buf, i, Number(value & 0x7fn) | 0x80)
    value >>= 7n
    i++
  }
  setByte(buf, i, Number(value))
  return i + 1
}

export function Uvarint(buf: $.Slice<number>): [bigint, number] {
  let x = 0n
  let s = 0n
  for (let i = 0; i < $.len(buf); i++) {
    const b = byteAt(buf, i)
    if (i === MaxVarintLen64) {
      return [uint64Result(0n), -(i + 1)]
    }
    if (b < 0x80) {
      if (i === MaxVarintLen64 - 1 && b > 1) {
        return [uint64Result(0n), -(i + 1)]
      }
      return [uint64Result(x | (BigInt(b) << s)), i + 1]
    }
    x |= BigInt(b & 0x7f) << s
    s += 7n
  }
  return [uint64Result(0n), 0]
}

export function AppendVarint(buf: $.Slice<number>, x: number | bigint): $.Slice<number> {
  return AppendUvarint(buf, encodeSignedVarint(x))
}

export function PutVarint(buf: $.Slice<number>, x: number | bigint): number {
  return PutUvarint(buf, encodeSignedVarint(x))
}

export function Varint(buf: $.Slice<number>): [bigint, number] {
  const [ux, n] = Uvarint(buf)
  return [decodeSignedVarint(ux), n]
}

export async function ReadUvarint(r: byteReader): Promise<[bigint, $.GoError]> {
  let x = 0n
  let s = 0n
  for (let i = 0; i < MaxVarintLen64; i++) {
    const [b, err] = await r.ReadByte()
    if (err !== null) {
      return [uint64Result(x), i > 0 && isEOF(err) ? io.ErrUnexpectedEOF : err]
    }
    if (b < 0x80) {
      if (i === MaxVarintLen64 - 1 && b > 1) {
        return [uint64Result(x), errOverflow]
      }
      return [uint64Result(x | (BigInt(b) << s)), null]
    }
    x |= BigInt(b & 0x7f) << s
    s += 7n
  }
  return [uint64Result(x), errOverflow]
}

export async function ReadVarint(r: byteReader): Promise<[bigint, $.GoError]> {
  const [ux, err] = await ReadUvarint(r)
  return [decodeSignedVarint(ux), err]
}

export async function Read(
  r: io.Reader,
  order: ByteOrder | null,
  data: unknown,
): Promise<$.GoError> {
  const byteOrder = requireByteOrder(order)
  const target = decodeTarget(data)
  if (target === null) {
    return unsupportedError('Read', data)
  }
  const size = targetSize(target)
  if (size < 0) {
    return unsupportedError('Read', data)
  }
  const buf = $.makeSlice<number>(size, undefined, 'byte')
  const [, err] = await readFull(r, buf)
  if (err !== null) {
    return err
  }
  decodeFixed(buf, byteOrder, target)
  return null
}

export function Decode(
  buf: $.Slice<number>,
  order: ByteOrder | null,
  data: unknown,
): [number, $.GoError] {
  const byteOrder = requireByteOrder(order)
  const target = decodeTarget(data)
  if (target === null) {
    return [0, unsupportedError('Decode', data)]
  }
  const size = targetSize(target)
  if (size < 0) {
    return [0, unsupportedError('Decode', data)]
  }
  if ($.len(buf) < size) {
    return [0, errBufferTooSmall]
  }
  decodeFixed($.goSlice(buf, 0, size), byteOrder, target)
  return [size, null]
}

export async function Write(
  w: io.Writer,
  order: ByteOrder | null,
  data: unknown,
): Promise<$.GoError> {
  const encoded = encodeData(requireByteOrder(order), data)
  if (encoded === null) {
    return unsupportedError('Write', data)
  }
  const [, err] = await w.Write(encoded)
  return err
}

export function Encode(
  buf: $.Slice<number>,
  order: ByteOrder | null,
  data: unknown,
): [number, $.GoError] {
  const encoded = encodeData(requireByteOrder(order), data)
  if (encoded === null) {
    return [0, unsupportedError('Encode', data)]
  }
  if ($.len(buf) < $.len(encoded)) {
    return [0, errBufferTooSmall]
  }
  $.copy(buf, encoded)
  return [$.len(encoded), null]
}

export function Append(
  buf: $.Slice<number>,
  order: ByteOrder | null,
  data: unknown,
): [$.Slice<number>, $.GoError] {
  const encoded = encodeData(requireByteOrder(order), data)
  if (encoded === null) {
    return [null, unsupportedError('Append', data)]
  }
  return [$.appendSlice(buf, encoded), null]
}

export function Size(v: unknown): number {
  const target = decodeTarget(v)
  if (target === null) {
    return -1
  }
  return targetSize(target)
}

function targetSize(target: decodedTarget): number {
  if (target.shape !== undefined) {
    return shapeSize(target.shape)
  }
  return fixedSize(target.kind as fixedKind, target.value)
}

function requireByteOrder(order: ByteOrder | null): ByteOrder {
  if (order === null) {
    throw new Error(
      'runtime error: invalid memory address or nil pointer dereference',
    )
  }
  return order
}

function decodeFixed(
  buf: $.Slice<number>,
  order: ByteOrder,
  target: decodedTarget,
): void {
  if (target.shape !== undefined) {
    decodeShapeTarget(buf, order, target)
    return
  }
  const kind = target.kind as fixedKind
  if (kind.startsWith('[]')) {
    decodeFixedSlice(buf, order, kind, target.value)
    return
  }
  if (target.settable === null) {
    return
  }
  target.settable(decodeScalar(buf, order, kind))
}

function decodeShapeTarget(
  buf: $.Slice<number>,
  order: ByteOrder,
  target: decodedTarget,
): void {
  const shape = target.shape!
  if (shape.tag === 'struct') {
    // Populate the existing struct instance's fields in place.
    shapeDecodeInto(buf, order, shape, target.value)
    return
  }
  if (target.settable === null) {
    return
  }
  target.settable(shapeDecodeValue(buf, order, shape))
}

function decodeFixedSlice(
  buf: $.Slice<number>,
  order: ByteOrder,
  kind: fixedKind,
  target: unknown,
): void {
  const elemKind = kind.slice(2) as fixedKind
  const width = fixedSize(elemKind, 0)
  const count = $.len(target as $.Slice<unknown>)
  for (let i = 0; i < count; i++) {
    ;(target as any)[i] = decodeScalar(
      $.goSlice(buf, i * width, i * width + width),
      order,
      elemKind,
    )
  }
}

function encodeData(order: ByteOrder, data: unknown): $.Slice<number> | null {
  const target = decodeTarget(data)
  if (target === null) {
    return null
  }
  const size = targetSize(target)
  if (size < 0) {
    return null
  }
  const out = $.makeSlice<number>(size, undefined, 'byte')
  if (target.shape !== undefined) {
    shapeEncode(out, order, target.shape, target.value)
  } else {
    encodeFixed(out, order, target.kind as fixedKind, target.value)
  }
  return out
}

function encodeFixed(
  buf: $.Slice<number>,
  order: ByteOrder,
  kind: fixedKind,
  value: unknown,
): void {
  if (kind.startsWith('[]')) {
    const elemKind = kind.slice(2) as fixedKind
    const width = fixedSize(elemKind, 0)
    const count = $.len(value as $.Slice<unknown>)
    for (let i = 0; i < count; i++) {
      encodeScalar(
        $.goSlice(buf, i * width, i * width + width),
        order,
        elemKind,
        (value as any)[i],
      )
    }
    return
  }
  encodeScalar(buf, order, kind, value)
}

function decodeScalar(
  buf: $.Slice<number>,
  order: ByteOrder,
  kind: fixedKind,
): unknown {
  switch (kind) {
    case 'bool':
      return byteAt(buf, 0) !== 0
    case 'int8':
      return intN(byteAt(buf, 0), 8)
    case 'uint8':
      return byteAt(buf, 0)
    case 'int16':
      return intN(order.Uint16(buf), 16)
    case 'uint16':
      return order.Uint16(buf)
    case 'int32':
      return intN(order.Uint32(buf), 32)
    case 'uint32':
      return order.Uint32(buf)
    case 'int64':
      return int64Result(toUint64(order.Uint64(buf)))
    case 'uint64':
      return order.Uint64(buf)
    case 'float32':
      return float32FromBits(order.Uint32(buf))
    case 'float64':
      return float64FromBits(order.Uint64(buf))
    default:
      return 0
  }
}

function encodeScalar(
  buf: $.Slice<number>,
  order: ByteOrder,
  kind: fixedKind,
  value: unknown,
): void {
  switch (kind) {
    case 'bool':
      setByte(buf, 0, value ? 1 : 0)
      return
    case 'int8':
    case 'uint8':
      setByte(buf, 0, Number(value))
      return
    case 'int16':
    case 'uint16':
      order.PutUint16(buf, Number(value))
      return
    case 'int32':
    case 'uint32':
      order.PutUint32(buf, Number(value))
      return
    case 'int64':
    case 'uint64':
      order.PutUint64(buf, value as number)
      return
    case 'float32':
      order.PutUint32(buf, float32Bits(Number(value)))
      return
    case 'float64':
      order.PutUint64(buf, float64Bits(Number(value)))
      return
  }
}

function decodeTarget(data: unknown): decodedTarget | null {
  const typeName = goTypeName(data)
  const value = goValue(data)
  if (typeName !== '') {
    const info = goTypeInfo(data)
    const kind = fixedKindFromType(typeName) ?? fixedKindFromTypeInfo(info)
    if (kind !== null) {
      return {
        kind,
        value: pointerValueForKind(typeName, value),
        settable: setterFor(typeName, value),
      }
    }
    // Struct and complex types cannot be named by a flat fixedKind; describe
    // them recursively so Size/Append/Read/Decode handle them like Go.
    const shape = shapeFromType(info ?? typeName)
    if (shape !== null && shape.tag !== 'scalar') {
      return {
        kind: null,
        shape,
        value: pointerValueForKind(typeName, value),
        settable: setterFor(typeName, value),
      }
    }
    return null
  }
  if (value instanceof Uint8Array) {
    return { kind: '[]uint8', value, settable: null }
  }
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === 'boolean')) {
      return { kind: '[]bool', value, settable: null }
    }
    if (value.every((item) => typeof item === 'number')) {
      return { kind: '[]uint8', value, settable: null }
    }
  }
  return null
}

function pointerValueForKind(typeName: string, value: unknown): unknown {
  if (typeName.startsWith('*')) {
    return $.pointerValue(value as any)
  }
  return value
}

function setterFor(
  typeName: string,
  value: unknown,
): ((value: unknown) => void) | null {
  if (!typeName.startsWith('*')) {
    return null
  }
  if ($.isVarRef(value)) {
    return (next: unknown) => {
      value.value = next
    }
  }
  if (isBoxedValue(value) && $.isVarRef(value.__goValue)) {
    const ref = value.__goValue
    return (next: unknown) => {
      ref.value = next
    }
  }
  return null
}

function goTypeName(value: unknown): string {
  if (isBoxedValue(value) && typeof value.__goType === 'string') {
    return value.__goType
  }
  if (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as { __goType?: unknown }).__goType === 'string'
  ) {
    return (value as { __goType: string }).__goType
  }
  return ''
}

function goTypeInfo(value: unknown): $.TypeInfo | string | undefined {
  if (isBoxedValue(value)) {
    return value.__goTypeInfo
  }
  if (value !== null && typeof value === 'object') {
    return (value as { __goTypeInfo?: $.TypeInfo | string }).__goTypeInfo
  }
  return undefined
}

function goValue(value: unknown): unknown {
  if (isBoxedValue(value) && '__goValue' in value) {
    return value.__goValue
  }
  return value
}

function isBoxedValue(value: unknown): value is boxedValue {
  return value !== null && typeof value === 'object' && '__goValue' in value
}

function fixedKindFromType(typeName: string): fixedKind | null {
  let name = typeName
  while (name.startsWith('*')) {
    name = name.slice(1)
  }
  if (name === 'byte') {
    return 'uint8'
  }
  if (name === '[]byte') {
    return '[]uint8'
  }
  if (fixedKinds.has(name)) {
    return name as fixedKind
  }
  return null
}

function fixedKindFromTypeInfo(
  info: $.TypeInfo | string | undefined,
): fixedKind | null {
  if (info === undefined) {
    return null
  }
  if (typeof info === 'string') {
    return fixedKindFromType(info)
  }
  switch (info.kind) {
    case $.TypeKind.Pointer:
      return fixedKindFromTypeInfo(info.elemType)
    case $.TypeKind.Basic:
      return fixedKindFromBasicName(info.name)
    case $.TypeKind.Slice: {
      const elemKind = fixedKindFromTypeInfo(info.elemType)
      return elemKind === null ? null : fixedSliceKind(elemKind)
    }
    case $.TypeKind.Array: {
      const elemKind = fixedKindFromTypeInfo(info.elemType)
      return elemKind === null ? null : fixedSliceKind(elemKind)
    }
    default:
      return null
  }
}

function fixedKindFromBasicName(name: string | undefined): fixedKind | null {
  if (name === undefined) {
    return null
  }
  if (name === 'byte') {
    return 'uint8'
  }
  if (name === 'rune') {
    return 'int32'
  }
  return fixedKinds.has(name) && !name.startsWith('[]') ?
      (name as fixedKind)
    : null
}

function fixedSliceKind(elemKind: fixedKind): fixedKind | null {
  return elemKind.startsWith('[]') ? null : (`[]${elemKind}` as fixedKind)
}

function fixedSize(kind: fixedKind, value: unknown): number {
  if (kind.startsWith('[]')) {
    const elemKind = kind.slice(2) as fixedKind
    const elemSize = fixedSize(elemKind, 0)
    return elemSize < 0 ? -1 : elemSize * $.len(value as $.Slice<unknown>)
  }
  switch (kind) {
    case 'bool':
    case 'int8':
    case 'uint8':
      return 1
    case 'int16':
    case 'uint16':
      return 2
    case 'int32':
    case 'uint32':
    case 'float32':
      return 4
    case 'int64':
    case 'uint64':
    case 'float64':
      return 8
  }
  return -1
}

// shapeFromType builds a recursive fixed-size description from type info, or
// null when any element is variable-size or otherwise unsupported (which makes
// the whole struct unsupported, as in Go's dataSize).
function shapeFromType(info: $.TypeInfo | string | undefined): binShape | null {
  if (info === undefined) {
    return null
  }
  if (typeof info === 'string') {
    if (info === 'complex64') {
      return { tag: 'complex', elem: 'float32' }
    }
    if (info === 'complex128') {
      return { tag: 'complex', elem: 'float64' }
    }
    const kind = fixedKindFromType(info)
    return kind !== null && !kind.startsWith('[]') ?
        { tag: 'scalar', kind }
      : null
  }
  switch (info.kind) {
    case $.TypeKind.Pointer:
      return shapeFromType(info.elemType)
    case $.TypeKind.Basic: {
      if (info.name === 'complex64') {
        return { tag: 'complex', elem: 'float32' }
      }
      if (info.name === 'complex128') {
        return { tag: 'complex', elem: 'float64' }
      }
      const kind = fixedKindFromBasicName(info.name)
      return kind !== null ? { tag: 'scalar', kind } : null
    }
    case $.TypeKind.Array: {
      const elem = shapeFromType(info.elemType)
      return elem === null ? null : (
          { tag: 'array', elem, count: (info as $.ArrayTypeInfo).length }
        )
    }
    case $.TypeKind.Struct: {
      const fields: { key: string; shape: binShape }[] = []
      for (const field of (info as $.StructTypeInfo).fields) {
        const shape = shapeFromType(field.type)
        if (shape === null) {
          return null
        }
        fields.push({ key: field.key ?? field.name, shape })
      }
      return { tag: 'struct', fields }
    }
    default:
      return null
  }
}

function shapeSize(shape: binShape): number {
  switch (shape.tag) {
    case 'scalar':
      return fixedSize(shape.kind, 0)
    case 'complex':
      return shape.elem === 'float32' ? 8 : 16
    case 'array':
      return shapeSize(shape.elem) * shape.count
    case 'struct': {
      let total = 0
      for (const field of shape.fields) {
        total += shapeSize(field.shape)
      }
      return total
    }
  }
}

function structFieldValue(instance: unknown, key: string): unknown {
  const ref = (instance as { _fields: Record<string, $.VarRef<unknown>> })
    ._fields[key]
  return ref.value
}

function shapeEncode(
  buf: $.Slice<number>,
  order: ByteOrder,
  shape: binShape,
  value: unknown,
): void {
  switch (shape.tag) {
    case 'scalar':
      encodeScalar(buf, order, shape.kind, value)
      return
    case 'complex': {
      const c = value as { real: number; imag: number }
      if (shape.elem === 'float32') {
        order.PutUint32($.goSlice(buf, 0, 4), float32Bits(c.real))
        order.PutUint32($.goSlice(buf, 4, 8), float32Bits(c.imag))
      } else {
        order.PutUint64($.goSlice(buf, 0, 8), float64Bits(c.real))
        order.PutUint64($.goSlice(buf, 8, 16), float64Bits(c.imag))
      }
      return
    }
    case 'array': {
      const width = shapeSize(shape.elem)
      for (let i = 0; i < shape.count; i++) {
        shapeEncode(
          $.goSlice(buf, i * width, i * width + width),
          order,
          shape.elem,
          (value as $.Slice<unknown>)![i],
        )
      }
      return
    }
    case 'struct': {
      let offset = 0
      for (const field of shape.fields) {
        const width = shapeSize(field.shape)
        shapeEncode(
          $.goSlice(buf, offset, offset + width),
          order,
          field.shape,
          structFieldValue(value, field.key),
        )
        offset += width
      }
      return
    }
  }
}

function shapeDecodeValue(
  buf: $.Slice<number>,
  order: ByteOrder,
  shape: binShape,
): unknown {
  switch (shape.tag) {
    case 'scalar':
      return decodeScalar(buf, order, shape.kind)
    case 'complex':
      if (shape.elem === 'float32') {
        return {
          real: float32FromBits(order.Uint32($.goSlice(buf, 0, 4))),
          imag: float32FromBits(order.Uint32($.goSlice(buf, 4, 8))),
        }
      }
      return {
        real: float64FromBits(order.Uint64($.goSlice(buf, 0, 8))),
        imag: float64FromBits(order.Uint64($.goSlice(buf, 8, 16))),
      }
    case 'array': {
      const width = shapeSize(shape.elem)
      const out: unknown[] = []
      for (let i = 0; i < shape.count; i++) {
        out.push(
          shapeDecodeValue(
            $.goSlice(buf, i * width, i * width + width),
            order,
            shape.elem,
          ),
        )
      }
      return out
    }
    case 'struct':
      // Nested structs are populated in place by shapeDecodeInto.
      return null
  }
}

function shapeDecodeInto(
  buf: $.Slice<number>,
  order: ByteOrder,
  shape: { tag: 'struct'; fields: { key: string; shape: binShape }[] },
  instance: unknown,
): void {
  const fields = (instance as { _fields: Record<string, $.VarRef<unknown>> })
    ._fields
  let offset = 0
  for (const field of shape.fields) {
    const width = shapeSize(field.shape)
    const slice = $.goSlice(buf, offset, offset + width)
    const ref = fields[field.key]
    if (field.shape.tag === 'struct') {
      shapeDecodeInto(slice, order, field.shape, ref.value)
    } else {
      ref.value = shapeDecodeValue(slice, order, field.shape)
    }
    offset += width
  }
}

function unsupportedError(fn: string, data: unknown): $.GoError {
  return $.newError(
    `encoding/binary: ${fn} of ${unsupportedKind(data)} is not supported in the GoScript browser build`,
  )
}

function unsupportedKind(data: unknown): string {
  const typeName = goTypeName(data)
  if (typeName !== '') {
    return typeName
  }
  if ($.isVarRef(data)) {
    return 'untyped pointer'
  }
  if (Array.isArray(data)) {
    return 'array'
  }
  if (data === null || data === undefined) {
    return '<nil>'
  }
  return typeof data
}

async function readFull(
  r: io.Reader,
  buf: $.Slice<number>,
): Promise<[number, $.GoError]> {
  let offset = 0
  while (offset < $.len(buf)) {
    const [n, err] = await r.Read($.goSlice(buf, offset))
    offset += n
    if (err !== null) {
      return [offset, offset > 0 && isEOF(err) ? io.ErrUnexpectedEOF : err]
    }
    if (n === 0) {
      return [offset, io.ErrUnexpectedEOF]
    }
  }
  return [offset, null]
}

function requireLen(b: $.Slice<number>, n: number): void {
  const length = $.len(b)
  if (length < n) {
    $.panic(
      `runtime error: index out of range [${n - 1}] with length ${length}`,
    )
  }
}

function byteAt(b: $.Slice<number>, i: number): number {
  return Number((b as any)[i]) & 0xff
}

function setByte(b: $.Slice<number>, i: number, v: number): void {
  requireLen(b, i + 1)
  ;(b as any)[i] = Number(v) & 0xff
}

function encodeSignedVarint(x: number | bigint): bigint {
  let ux = BigInt.asUintN(64, BigInt.asIntN(64, toBigInt(x)) << 1n)
  if (isNegativeInt64(x)) {
    ux = BigInt.asUintN(64, ~ux)
  }
  return uint64Result(ux)
}

function decodeSignedVarint(uxValue: number | bigint): bigint {
  const ux = toUint64(uxValue)
  let x = ux >> 1n
  if ((ux & 1n) !== 0n) {
    x = BigInt.asIntN(64, ~x)
  }
  return int64Result(x)
}

function toUint64(value: number | bigint): bigint {
  if (typeof value === 'bigint') {
    return BigInt.asUintN(64, value)
  }
  return BigInt.asUintN(64, BigInt(Math.trunc(value)))
}

function toBigInt(value: number | bigint): bigint {
  if (typeof value === 'bigint') {
    return value
  }
  return BigInt(Math.trunc(value))
}

function isNegativeInt64(value: number | bigint): boolean {
  return typeof value === 'bigint' ? value < 0n : value < 0
}

// uint64Result normalizes a uint64 computation to its runtime representation.
// GoScript represents Go uint64 as a JS bigint, so this always returns a
// bigint, even when the value fits in a float. Returning a number for small
// values made binary.Uint64 yield number|bigint, and a later raw operator
// mixing that number with a bigint uint64 threw "Cannot mix BigInt and other
// types".
function uint64Result(value: bigint): bigint {
  return BigInt.asUintN(64, value)
}

// int64Result normalizes an int64 computation to its runtime representation. As
// with uint64Result, Go int64 is always a JS bigint in GoScript, so this never
// narrows to a number.
function int64Result(value: bigint): bigint {
  return BigInt.asIntN(64, value)
}

function intN(value: number, bits: number): number {
  const sign = 1 << (bits - 1)
  const mask = bits === 32 ? 0xffffffff : (1 << bits) - 1
  const normalized = value & mask
  return (normalized & sign) !== 0 ? normalized - (1 << bits) : normalized
}

function float32Bits(value: number): number {
  const bytes = new ArrayBuffer(4)
  const view = new DataView(bytes)
  view.setFloat32(0, value, true)
  return view.getUint32(0, true)
}

function float32FromBits(value: number): number {
  const bytes = new ArrayBuffer(4)
  const view = new DataView(bytes)
  view.setUint32(0, Number($.uint(value, 32)), true)
  return view.getFloat32(0, true)
}

function float64Bits(value: number): bigint {
  const bytes = new ArrayBuffer(8)
  const view = new DataView(bytes)
  view.setFloat64(0, value, true)
  return view.getBigUint64(0, true)
}

function float64FromBits(value: number | bigint): number {
  const bytes = new ArrayBuffer(8)
  const view = new DataView(bytes)
  view.setBigUint64(0, toUint64(value), true)
  return view.getFloat64(0, true)
}

function isEOF(err: $.GoError): boolean {
  return err === io.EOF || err?.Error?.() === 'EOF'
}

function byteSliceArg(name: string): $.MethodArg {
  return { name, type: byteSliceType() }
}

function numberArg(name: string): $.MethodArg {
  return { name, type: { kind: $.TypeKind.Basic, name: 'number' } }
}

function numberReturn(): $.MethodArg {
  return { type: { kind: $.TypeKind.Basic, name: 'number' } }
}

function byteSliceType(): $.TypeInfo {
  return {
    kind: $.TypeKind.Slice,
    elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
  }
}

const fixedKinds = new Set<string>([
  'bool',
  'int8',
  'uint8',
  'int16',
  'uint16',
  'int32',
  'uint32',
  'int64',
  'uint64',
  'float32',
  'float64',
  '[]bool',
  '[]int8',
  '[]uint8',
  '[]int16',
  '[]uint16',
  '[]int32',
  '[]uint32',
  '[]int64',
  '[]uint64',
  '[]float32',
  '[]float64',
])

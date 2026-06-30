import * as $ from '../../../builtin/index.js'
import * as math from '../../../math/index.js'
import * as strconv from '../../../strconv/index.js'
import * as strings from '../../../strings/index.js'

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

$.registerInterfaceType('protobuf_go_lite.Message', null, [
  { name: 'SizeVT', args: [], returns: [] },
  { name: 'MarshalToSizedBufferVT', args: [], returns: [] },
  { name: 'MarshalVT', args: [], returns: [] },
  { name: 'UnmarshalVT', args: [], returns: [] },
  { name: 'Reset', args: [], returns: [] },
])

export interface JSONMessage {
  MarshalJSON(): [$.Slice<number>, $.GoError]
  UnmarshalJSON(data: $.Slice<number>): $.GoError
}

$.registerInterfaceType('protobuf_go_lite.JSONMessage', null, [
  { name: 'MarshalJSON', args: [], returns: [] },
  { name: 'UnmarshalJSON', args: [], returns: [] },
])

export interface TextMarshaler {
  MarshalProtoText(): string
}

$.registerInterfaceType('protobuf_go_lite.TextMarshaler', null, [
  { name: 'MarshalProtoText', args: [], returns: [] },
])

export interface CloneMessage extends Message {
  CloneMessageVT(): CloneMessage | null
}

$.registerInterfaceType('protobuf_go_lite.CloneMessage', null, [
  { name: 'SizeVT', args: [], returns: [] },
  { name: 'MarshalToSizedBufferVT', args: [], returns: [] },
  { name: 'MarshalVT', args: [], returns: [] },
  { name: 'UnmarshalVT', args: [], returns: [] },
  { name: 'Reset', args: [], returns: [] },
  { name: 'CloneMessageVT', args: [], returns: [] },
])

export interface CloneVT<T> extends CloneMessage {
  CloneVT(): T
}

export function ClonePtr<T>(v: T | $.VarRef<T> | null): $.VarRef<T> | null {
  const value = $.pointerValueOrNil(v)
  return value == null ? null : $.varRef(value)
}

export function CloneBytes<S extends $.Slice<number> | Uint8Array | null>(
  v: S,
): S {
  if (v == null) {
    return null as S
  }
  if (v instanceof Uint8Array) {
    return new Uint8Array(v) as S
  }
  return $.asArray(v).slice() as S
}

export function CloneSlice<S extends $.Slice<T> | null, T>(s: S): S {
  if (s == null) {
    return null as S
  }
  if (s instanceof Uint8Array) {
    return new Uint8Array(s) as S
  }
  return $.asArray(s).slice() as S
}

export function CloneMap<K, V>(m: Map<K, V> | null): Map<K, V> | null {
  return m == null ? null : new Map(m)
}

export function CloneBytesSlice<
  S extends $.Slice<$.Slice<number> | null> | null,
>(s: S): S {
  if (s == null) {
    return null as S
  }
  return $.asArray(s).map((v) => CloneBytes(v)) as S
}

export function CloneBytesMap<K, V extends $.Slice<number> | null>(
  m: Map<K, V> | null,
): Map<K, V> | null {
  if (m == null) {
    return null
  }
  const out = new Map<K, V>()
  for (const [k, v] of m.entries()) {
    out.set(k, CloneBytes(v) as V)
  }
  return out
}

export function CloneVTValue<T extends CloneVT<T>>(
  v: T | $.VarRef<T> | null,
): T | null {
  const value = $.pointerValueOrNil(v)
  return value == null ? null : value.CloneVT()
}

export function CloneVTSlice<T extends CloneVT<T>>(
  s: $.Slice<T | $.VarRef<T> | null> | null,
): $.Slice<T | null> | null {
  if (s == null) {
    return null
  }
  return $.asArray(s).map((v) => CloneVTValue(v))
}

export function CloneVTMap<K, V extends CloneVT<V>>(
  m: Map<K, V | $.VarRef<V> | null> | null,
): Map<K, V | null> | null {
  if (m == null) {
    return null
  }
  const out = new Map<K, V | null>()
  for (const [k, v] of m.entries()) {
    out.set(k, CloneVTValue(v))
  }
  return out
}

export interface EqualVT<T> {
  EqualVT(other: T): boolean
}

export function CompareComparable<T>(): (t1: T, t2: T) => boolean {
  return (t1, t2) => t1 === t2
}

export function IsEqualVT<T>(
  t1: T | $.VarRef<T> | null,
  t2: T | $.VarRef<T> | null,
): boolean
export function IsEqualVT<T>(
  _typeArgs: unknown,
  t1: T | $.VarRef<T> | null,
  t2: T | $.VarRef<T> | null,
): boolean
export function IsEqualVT<T>(
  arg0: unknown,
  arg1: T | $.VarRef<T> | null,
  arg2?: T | $.VarRef<T> | null,
): boolean {
  const t1 = $.pointerValueOrNil(
    arg2 === undefined ? (arg0 as T | $.VarRef<T> | null) : arg1,
  )
  const t2 = $.pointerValueOrNil(arg2 === undefined ? arg1 : arg2)
  if (t1 == null || t2 == null) {
    return t1 == t2
  }
  if (
    typeof t1 === 'object' &&
    'EqualVT' in t1 &&
    typeof t1.EqualVT === 'function'
  ) {
    return t1.EqualVT(t2)
  }
  return t1 === t2
}

export function CompareEqualVT<T>(
  _typeArgs?: unknown,
): (t1: T | $.VarRef<T> | null, t2: T | $.VarRef<T> | null) => boolean {
  return (t1, t2) => IsEqualVT(t1, t2)
}

export function IsEqualVTSlice<T>(
  s1: $.Slice<T | $.VarRef<T> | null>,
  s2: $.Slice<T | $.VarRef<T> | null>,
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

export function EqualPtr<T>(
  a: T | $.VarRef<T> | null,
  b: T | $.VarRef<T> | null,
): boolean {
  const av = $.pointerValueOrNil(a)
  const bv = $.pointerValueOrNil(b)
  return (
    (av == null && bv == null) ||
    (av != null && bv != null && $.comparableEqual(av, bv))
  )
}

export function EqualBytes(
  a: $.Slice<number> | Uint8Array | null,
  b: $.Slice<number> | Uint8Array | null,
): boolean {
  if ($.len(a) !== $.len(b)) {
    return false
  }
  const aa = $.asArray(a as $.Slice<number>)
  const bb = $.asArray(b as $.Slice<number>)
  for (let i = 0; i < aa.length; i++) {
    if (aa[i] !== bb[i]) {
      return false
    }
  }
  return true
}

export function EqualBytesPresent(
  a: $.Slice<number> | Uint8Array | null,
  b: $.Slice<number> | Uint8Array | null,
): boolean {
  return (
    (a == null && b == null) || (a != null && b != null && EqualBytes(a, b))
  )
}

export function EqualSlice<T>(
  a: $.Slice<T> | null,
  b: $.Slice<T> | null,
): boolean {
  if ($.len(a) !== $.len(b)) {
    return false
  }
  const aa = $.asArray(a)
  const bb = $.asArray(b)
  for (let i = 0; i < aa.length; i++) {
    if (!$.comparableEqual(aa[i], bb[i])) {
      return false
    }
  }
  return true
}

export function EqualMap<K, V>(
  a: Map<K, V> | null,
  b: Map<K, V> | null,
): boolean {
  if ($.len(a) !== $.len(b)) {
    return false
  }
  for (const [k, av] of (a ?? new Map<K, V>()).entries()) {
    const [bv, ok] = $.mapGet(b, k, undefined)
    if (!ok || !$.comparableEqual(av, bv)) {
      return false
    }
  }
  return true
}

export function EqualBytesSlice(
  a: $.Slice<$.Slice<number> | Uint8Array | null> | null,
  b: $.Slice<$.Slice<number> | Uint8Array | null> | null,
): boolean {
  if ($.len(a) !== $.len(b)) {
    return false
  }
  const aa = $.asArray(a)
  const bb = $.asArray(b)
  for (let i = 0; i < aa.length; i++) {
    if (!EqualBytes(aa[i], bb[i])) {
      return false
    }
  }
  return true
}

export function EqualBytesMap<K>(
  a: Map<K, $.Slice<number> | Uint8Array | null> | null,
  b: Map<K, $.Slice<number> | Uint8Array | null> | null,
): boolean {
  if ($.len(a) !== $.len(b)) {
    return false
  }
  for (const [k, av] of (a ?? new Map()).entries()) {
    const [bv, ok] = $.mapGet(b, k, null)
    if (!ok || !EqualBytes(av, bv)) {
      return false
    }
  }
  return true
}

export function EqualVTImplicit<T extends EqualVT<T>>(
  a: T | $.VarRef<T> | null,
  b: T | $.VarRef<T> | null,
  empty: () => T,
): boolean {
  let av = $.pointerValueOrNil(a)
  let bv = $.pointerValueOrNil(b)
  if (av === bv) {
    return true
  }
  if (av == null) {
    av = empty()
  }
  if (bv == null) {
    bv = empty()
  }
  return av.EqualVT(bv)
}

export function EqualVTSliceImplicit<T extends EqualVT<T>>(
  a: $.Slice<T | $.VarRef<T> | null> | null,
  b: $.Slice<T | $.VarRef<T> | null> | null,
  empty: () => T,
): boolean {
  if ($.len(a) !== $.len(b)) {
    return false
  }
  const aa = $.asArray(a)
  const bb = $.asArray(b)
  for (let i = 0; i < aa.length; i++) {
    if (!EqualVTImplicit(aa[i], bb[i], empty)) {
      return false
    }
  }
  return true
}

export function EqualVTMapImplicit<K, V extends EqualVT<V>>(
  a: Map<K, V | $.VarRef<V> | null> | null,
  b: Map<K, V | $.VarRef<V> | null> | null,
  empty: () => V,
): boolean {
  if ($.len(a) !== $.len(b)) {
    return false
  }
  for (const [k, av] of (a ?? new Map()).entries()) {
    const [bv, ok] = $.mapGet(b, k, null)
    if (!ok || !EqualVTImplicit(av, bv, empty)) {
      return false
    }
  }
  return true
}

type BoundMessageType = {
  typeName?: string
  fields?: { list(): readonly BoundFieldInfo[] }
  clone?: (value: any) => any
  equals?: (a: any, b: any) => boolean
  fromBinary: (bytes: Uint8Array | null | undefined) => any
  fromJson?: (value: unknown) => any
  fromJsonString?: (value: string | null | undefined) => any
  toBinary: (value: any) => Uint8Array
  toJson?: (value: any) => unknown
  toJsonString?: (value: any) => string
}

type BoundFieldInfo = {
  localName: string
  kind: string
  repeated?: boolean
  oneof?: { localName: string }
  T?: any
  V?: BoundFieldInfo
}

type BoundMessageCtor<T = any> = {
  new (init?: any): T
  __protobufTypeScriptFields?: Record<string, BoundMessageCtor>
  __protobufTypeScriptOneofFields?: Record<
    string,
    Record<string, BoundMessageCtor>
  >
  __protobufTypeScriptMessage?: BoundMessageType
}

const protobufScalarTypeBytes = 12

function boundMessageType(ctor: BoundMessageCtor): BoundMessageType {
  const messageType = ctor.__protobufTypeScriptMessage
  if (messageType == null) {
    throw new Error('protobuf TypeScript binding is missing message type')
  }
  return messageType
}

function resolveBoundMessageType(value: any): BoundMessageType {
  return typeof value === 'function' ? value() : value
}

function boundFieldGoName(field: BoundFieldInfo): string {
  if (field.localName.length === 0) {
    return field.localName
  }
  return field.localName[0].toUpperCase() + field.localName.slice(1)
}

function boundFieldValue(source: any, field: BoundFieldInfo): any {
  if (source == null) {
    return undefined
  }
  const local = source[field.localName]
  if (local !== undefined) {
    return local
  }
  return source[boundFieldGoName(field)]
}

function boundOneofGroupGoName(field: BoundFieldInfo): string {
  return boundFieldGoName({ ...field, localName: field.oneof?.localName ?? '' })
}

function toTypeScriptScalarValue(value: any, field?: BoundFieldInfo): any {
  const unwrapped = $.pointerValueOrNil(value)
  if (
    field?.kind === 'scalar' &&
    field.T === protobufScalarTypeBytes &&
    unwrapped != null &&
    !(unwrapped instanceof Uint8Array)
  ) {
    return Uint8Array.from($.asArray(unwrapped))
  }
  if (unwrapped instanceof Uint8Array) {
    return unwrapped
  }
  return unwrapped
}

function toTypeScriptFieldValue(
  field: BoundFieldInfo,
  value: any,
  ctor?: BoundMessageCtor,
): any {
  value = $.pointerValueOrNil(value)
  if (value == null) {
    return undefined
  }
  if (field.repeated) {
    return $.asArray(value).map((item) =>
      toTypeScriptFieldValue({ ...field, repeated: false }, item, ctor),
    )
  }
  if (field.kind === 'map') {
    const out: Record<string, unknown> = {}
    const valueInfo = field.V
    const entries =
      value instanceof Map ? Array.from(value.entries()) : Object.entries(value)
    for (const [key, item] of entries) {
      out[String(key)] =
        valueInfo != null ?
          toTypeScriptFieldValue(valueInfo, item, ctor)
        : toTypeScriptScalarValue(item)
    }
    return out
  }
  if (field.kind === 'message') {
    const messageType = resolveBoundMessageType(field.T)
    return toTypeScriptMessage(value, messageType, ctor)
  }
  return toTypeScriptScalarValue(value, field)
}

function toTypeScriptMessage(
  value: any,
  messageType: BoundMessageType,
  ctor?: BoundMessageCtor,
): any {
  value = $.pointerValueOrNil(value)
  if (value == null) {
    return undefined
  }
  const fields = messageType.fields?.list()
  if (fields == null) {
    return value
  }
  const fieldCtors = ctor?.__protobufTypeScriptFields ?? {}
  const out: Record<string, unknown> = {}
  for (const field of fields) {
    if (field.oneof != null) {
      const groupName = field.oneof.localName
      const group = boundFieldValue(value, {
        ...field,
        localName: groupName,
        oneof: undefined,
      })
      if (group == null || out[groupName] !== undefined) {
        continue
      }
      const raw = boundFieldValue(group, field)
      if (raw === undefined || raw === null) {
        continue
      }
      out[groupName] = {
        case: field.localName,
        value: toTypeScriptFieldValue(
          field,
          raw,
          fieldCtors[field.localName] ?? raw?.constructor,
        ),
      }
      continue
    }
    const raw = boundFieldValue(value, field)
    if (raw === undefined || raw === null) {
      continue
    }
    out[field.localName] = toTypeScriptFieldValue(
      field,
      raw,
      fieldCtors[field.localName],
    )
  }
  return out
}

function fromTypeScriptScalarValue(value: any): any {
  if (value instanceof Uint8Array) {
    return value
  }
  return value
}

function fromTypeScriptFieldValue(
  field: BoundFieldInfo,
  value: any,
  ctor?: BoundMessageCtor,
): any {
  if (value == null) {
    return null
  }
  if (field.repeated) {
    return $.arrayToSlice(
      value.map((item: any) =>
        fromTypeScriptFieldValue({ ...field, repeated: false }, item, ctor),
      ),
    )
  }
  if (field.kind === 'map') {
    const valueInfo = field.V
    const out = new Map<any, any>()
    for (const [key, item] of Object.entries(value)) {
      out.set(
        key,
        valueInfo != null ?
          fromTypeScriptFieldValue(valueInfo, item, ctor)
        : fromTypeScriptScalarValue(item),
      )
    }
    return out
  }
  if (field.kind === 'message') {
    const messageType = resolveBoundMessageType(field.T)
    if (ctor == null) {
      return value
    }
    return fromTypeScriptMessage(value, ctor, messageType)
  }
  return fromTypeScriptScalarValue(value)
}

function fromTypeScriptWellKnownMessage(
  value: any,
  ctor: BoundMessageCtor,
  messageType?: BoundMessageType,
): any {
  if (
    messageType?.typeName === 'google.protobuf.Timestamp' &&
    value instanceof Date
  ) {
    const ms = value.getTime()
    const seconds = Math.floor(ms / 1000)
    const nanos = Math.trunc((ms - seconds * 1000) * 1000000)
    return new ctor({ Seconds: seconds, Nanos: nanos })
  }
  return undefined
}

function fromTypeScriptMessage(
  value: any,
  ctor: BoundMessageCtor,
  messageType?: BoundMessageType,
): any {
  if (value == null) {
    return null
  }
  const wellKnown = fromTypeScriptWellKnownMessage(value, ctor, messageType)
  if (wellKnown !== undefined) {
    return wellKnown
  }
  const out = new ctor()
  const fields = (messageType ?? boundMessageType(ctor)).fields?.list()
  if (fields == null) {
    return Object.assign(out, value)
  }
  const fieldCtors = ctor.__protobufTypeScriptFields ?? {}
  const oneofCtors = ctor.__protobufTypeScriptOneofFields ?? {}
  for (const field of fields) {
    if (field.oneof != null) {
      const groupName = field.oneof.localName
      const raw = value[groupName]
      if (raw?.case !== field.localName) {
        continue
      }
      const branchCtor = oneofCtors[groupName]?.[field.localName]
      const branchValue = fromTypeScriptFieldValue(
        field,
        raw.value,
        fieldCtors[field.localName],
      )
      const branchFieldName = boundFieldGoName(field)
      out[boundOneofGroupGoName(field)] =
        branchCtor == null ?
          { [branchFieldName]: branchValue }
        : new branchCtor({ [branchFieldName]: branchValue })
      continue
    }
    const raw = value[field.localName]
    if (raw === undefined || raw === null) {
      continue
    }
    out[boundFieldGoName(field)] = fromTypeScriptFieldValue(
      field,
      raw,
      fieldCtors[field.localName],
    )
  }
  return out
}

export function CloneBoundMessage<T>(
  ctor: BoundMessageCtor<T>,
  value: T | $.VarRef<T> | null,
): T | null {
  const messageType = boundMessageType(ctor)
  const encoded = toTypeScriptMessage(value, messageType, ctor)
  const cloned = messageType.clone?.(encoded) ?? structuredClone(encoded)
  return fromTypeScriptMessage(cloned, ctor, messageType)
}

export function EqualBoundMessage<T>(
  ctor: BoundMessageCtor<T>,
  a: T | $.VarRef<T> | null,
  b: T | $.VarRef<T> | null,
): boolean {
  const messageType = boundMessageType(ctor)
  const left = toTypeScriptMessage(a, messageType, ctor)
  const right = toTypeScriptMessage(b, messageType, ctor)
  return (
    messageType.equals?.(left, right) ??
    JSON.stringify(left) === JSON.stringify(right)
  )
}

export function MarshalBoundMessageVT<T>(
  ctor: BoundMessageCtor<T>,
  value: T | $.VarRef<T> | null,
): [$.Slice<number>, $.GoError] {
  let typeName = ctor.name
  try {
    const messageType = boundMessageType(ctor)
    typeName = messageType.typeName ?? typeName
    return [
      messageType.toBinary(toTypeScriptMessage(value, messageType, ctor)),
      null,
    ]
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return [null, $.toGoError(new Error(`marshal ${typeName}: ${msg}`))]
  }
}

export function MarshalBoundMessageToSizedBufferVT<T>(
  ctor: BoundMessageCtor<T>,
  value: T | $.VarRef<T> | null,
  dAtA: $.Slice<number>,
): [number, $.GoError] {
  const [bytes, err] = MarshalBoundMessageVT(ctor, value)
  if (err != null) {
    return [0, err]
  }
  const byteCount = $.len(bytes)
  const offset = $.len(dAtA) - byteCount
  const src = $.asArray(bytes)
  for (let i = 0; i < src.length; i++) {
    ;(dAtA as any)[offset + i] = src[i]
  }
  return [byteCount, null]
}

export function SizeBoundMessageVT<T>(
  ctor: BoundMessageCtor<T>,
  value: T | $.VarRef<T> | null,
): number {
  const [bytes, err] = MarshalBoundMessageVT(ctor, value)
  return err == null ? $.len(bytes) : 0
}

export function UnmarshalBoundMessageVT<T>(
  ctor: BoundMessageCtor<T>,
  target: T | $.VarRef<T> | null,
  data: $.Slice<number>,
): $.GoError {
  try {
    const messageType = boundMessageType(ctor)
    const decoded = messageType.fromBinary(Uint8Array.from($.asArray(data)))
    const next = fromTypeScriptMessage(decoded, ctor, messageType)
    $.assignStruct($.pointerValue(target), $.markAsStructValue(next))
    return null
  } catch (err) {
    return $.toGoError(err as Error)
  }
}

export function MarshalBoundMessageJSON<T>(
  ctor: BoundMessageCtor<T>,
  value: T | $.VarRef<T> | null,
): [$.Slice<number>, $.GoError] {
  try {
    const messageType = boundMessageType(ctor)
    const encoded = toTypeScriptMessage(value, messageType, ctor)
    const json =
      messageType.toJsonString?.(encoded) ??
      JSON.stringify(messageType.toJson?.(encoded) ?? encoded)
    return [$.stringToBytes(json), null]
  } catch (err) {
    return [null, $.toGoError(err as Error)]
  }
}

export function UnmarshalBoundMessageJSON<T>(
  ctor: BoundMessageCtor<T>,
  target: T | $.VarRef<T> | null,
  data: $.Slice<number>,
): $.GoError {
  try {
    const messageType = boundMessageType(ctor)
    const text = $.bytesToString(data)
    const decoded =
      messageType.fromJsonString?.(text) ??
      messageType.fromJson?.(JSON.parse(text))
    const next = fromTypeScriptMessage(decoded, ctor, messageType)
    $.assignStruct($.pointerValue(target), $.markAsStructValue(next))
    return null
  } catch (err) {
    return $.toGoError(err as Error)
  }
}

export function MarshalBoundMessageProtoJSON<T>(
  ctor: BoundMessageCtor<T>,
  value: T | $.VarRef<T> | null,
  state: {
    Write(v: $.Slice<number>): [number, $.GoError]
    SetError(err: $.GoError): void
  } | null,
): void {
  if (state == null) {
    return
  }
  const [data, err] = MarshalBoundMessageJSON(ctor, value)
  if (err != null) {
    state.SetError(err)
    return
  }
  state.Write(data)
}

export function UnmarshalBoundMessageProtoJSON<T>(
  ctor: BoundMessageCtor<T>,
  target: T | $.VarRef<T> | null,
  state: { SetError(err: $.GoError): void } | null,
): void {
  if (state == null) {
    return
  }
  try {
    const messageType = boundMessageType(ctor)
    const decoded = messageType.fromJson?.((state as any).value)
    const next = fromTypeScriptMessage(decoded, ctor, messageType)
    $.assignStruct($.pointerValue(target), $.markAsStructValue(next))
  } catch (err) {
    state.SetError($.toGoError(err as Error))
  }
}

export function MarshalBoundMessageProtoText<T>(
  ctor: BoundMessageCtor<T>,
  value: T | $.VarRef<T> | null,
): string {
  const [data, err] = MarshalBoundMessageJSON(ctor, value)
  return err == null ? $.bytesToString(data) : err.Error()
}

export function EncodeVarint(
  dAtA: $.Slice<number>,
  offset: number,
  v: number | bigint,
): number {
  offset -= SizeOfVarint(v)
  const base = offset
  let value = normalizedVarint(v)
  while (value >= 0x80n) {
    setByte(dAtA, offset, Number((value & 0x7fn) | 0x80n))
    value >>= 7n
    offset++
  }
  setByte(dAtA, offset, Number(value))
  return base
}

export function AppendVarint(
  b: $.Slice<number>,
  v: number | bigint,
): $.Slice<number> {
  const bytes: number[] = []
  let value = normalizedVarint(v)
  while (value >= 0x80n) {
    bytes.push(Number((value & 0x7fn) | 0x80n))
    value >>= 7n
  }
  bytes.push(Number(value))
  return $.append(b, ...bytes)
}

export function ConsumeVarint(b: $.Slice<number>): [bigint, number] {
  let v = 0n
  let shift = 0n
  for (let i = 0; i < 10; i++) {
    if (i >= $.len(b)) {
      return [0n, -1]
    }
    const value = byteSliceValue(b, i)
    if (shift === 63n && value > 1) {
      return [0n, -2]
    }
    v += BigInt(value & 0x7f) << shift
    if (value < 0x80) {
      return [varintResult(v), i + 1]
    }
    shift += 7n
  }
  return [0n, -2]
}

export function SizeOfVarint(x: number | bigint): number {
  let value = normalizedVarint(x)
  let n = 1
  while (value >= 0x80n) {
    value >>= 7n
    n++
  }
  return n
}

export function SizeOfZigzag(x: number | bigint): number {
  const value =
    typeof x === 'bigint' ?
      BigInt.asIntN(64, x)
    : BigInt.asIntN(64, BigInt(Math.trunc(x)))
  return SizeOfVarint(BigInt.asUintN(64, (value << 1n) ^ (value >> 63n)))
}

export function SizeVarintValue(keySize: number, v: number | bigint): number {
  return keySize + SizeOfVarint(v)
}

export function SizeVarintNonZero(keySize: number, v: number | bigint): number {
  return normalizedVarint(v) === 0n ? 0 : SizeVarintValue(keySize, v)
}

export function SizeVarintPtr(
  keySize: number,
  v: number | bigint | $.VarRef<number | bigint> | null,
): number {
  const value = $.pointerValueOrNil(v)
  return value == null ? 0 : SizeVarintValue(keySize, value)
}

export function SizeVarintSlice(
  keySize: number,
  vals: $.Slice<number | bigint> | null,
): number {
  let n = 0
  for (const v of vals ?? []) {
    n += SizeVarintValue(keySize, v)
  }
  return n
}

export function SizeVarintPacked(
  keySize: number,
  vals: $.Slice<number | bigint> | null,
): number {
  if ($.len(vals) === 0) {
    return 0
  }
  let l = 0
  for (const v of vals ?? []) {
    l += SizeOfVarint(v)
  }
  return SizeBytesValue(keySize, l)
}

export function SizeZigzagValue(keySize: number, v: number | bigint): number {
  return keySize + SizeOfZigzag(v)
}

export function SizeZigzagNonZero(keySize: number, v: number | bigint): number {
  return BigInt.asIntN(64, normalizedVarint(v)) === 0n ?
      0
    : SizeZigzagValue(keySize, v)
}

export function SizeZigzagPtr(
  keySize: number,
  v: number | bigint | $.VarRef<number | bigint> | null,
): number {
  const value = $.pointerValueOrNil(v)
  return value == null ? 0 : SizeZigzagValue(keySize, value)
}

export function SizeZigzagSlice(
  keySize: number,
  vals: $.Slice<number | bigint> | null,
): number {
  let n = 0
  for (const v of vals ?? []) {
    n += SizeZigzagValue(keySize, v)
  }
  return n
}

export function SizeZigzagPacked(
  keySize: number,
  vals: $.Slice<number | bigint> | null,
): number {
  if ($.len(vals) === 0) {
    return 0
  }
  let l = 0
  for (const v of vals ?? []) {
    l += SizeOfZigzag(v)
  }
  return SizeBytesValue(keySize, l)
}

export function SizeFixed32Value(keySize: number): number {
  return keySize + 4
}

export function SizeFixed32NonZero(keySize: number, v: number): number {
  return v === 0 ? 0 : SizeFixed32Value(keySize)
}

export function SizeFixed32Ptr(
  keySize: number,
  v: number | $.VarRef<number> | null,
): number {
  return $.pointerValueOrNil(v) == null ? 0 : SizeFixed32Value(keySize)
}

export function SizeFixed32Slice(
  keySize: number,
  vals: $.Slice<number> | null,
): number {
  return $.len(vals) * SizeFixed32Value(keySize)
}

export function SizeFixed32Packed(
  keySize: number,
  vals: $.Slice<number> | null,
): number {
  return $.len(vals) === 0 ? 0 : SizeBytesValue(keySize, $.len(vals) * 4)
}

export function SizeFixed64Value(keySize: number): number {
  return keySize + 8
}

export function SizeFixed64NonZero(
  keySize: number,
  v: number | bigint,
): number {
  return v === 0 || v === 0n ? 0 : SizeFixed64Value(keySize)
}

export function SizeFixed64Ptr(
  keySize: number,
  v: number | bigint | $.VarRef<number | bigint> | null,
): number {
  return $.pointerValueOrNil(v) == null ? 0 : SizeFixed64Value(keySize)
}

export function SizeFixed64Slice(
  keySize: number,
  vals: $.Slice<number | bigint> | null,
): number {
  return $.len(vals) * SizeFixed64Value(keySize)
}

export function SizeFixed64Packed(
  keySize: number,
  vals: $.Slice<number | bigint> | null,
): number {
  return $.len(vals) === 0 ? 0 : SizeBytesValue(keySize, $.len(vals) * 8)
}

export function SizeBoolValue(keySize: number): number {
  return keySize + 1
}

export function SizeBoolNonZero(keySize: number, v: boolean): number {
  return v ? SizeBoolValue(keySize) : 0
}

export function SizeBoolPtr(
  keySize: number,
  v: boolean | $.VarRef<boolean> | null,
): number {
  return $.pointerValueOrNil(v) == null ? 0 : SizeBoolValue(keySize)
}

export function SizeBoolSlice(
  keySize: number,
  vals: $.Slice<boolean> | null,
): number {
  return $.len(vals) * SizeBoolValue(keySize)
}

export function SizeBoolPacked(
  keySize: number,
  vals: $.Slice<boolean> | null,
): number {
  return $.len(vals) === 0 ? 0 : SizeBytesValue(keySize, $.len(vals))
}

export function SizeStringValue(keySize: number, v: string): number {
  const l = $.len(v)
  return keySize + l + SizeOfVarint(l)
}

export function SizeStringNonEmpty(keySize: number, v: string): number {
  return $.len(v) === 0 ? 0 : SizeStringValue(keySize, v)
}

export function SizeStringPtr(
  keySize: number,
  v: string | $.VarRef<string> | null,
): number {
  const value = $.pointerValueOrNil(v)
  return value == null ? 0 : SizeStringValue(keySize, value)
}

export function SizeStringSlice(
  keySize: number,
  vals: $.Slice<string> | null,
): number {
  let n = 0
  for (const v of vals ?? []) {
    n += SizeStringValue(keySize, v)
  }
  return n
}

export function SizeBytesValue(keySize: number, l: number): number {
  return keySize + l + SizeOfVarint(l)
}

export function SizeBytesNonEmpty(
  keySize: number,
  v: $.Slice<number> | null,
): number {
  return $.len(v) === 0 ? 0 : SizeBytesValue(keySize, $.len(v))
}

export function SizeBytesPresent(
  keySize: number,
  v: $.Slice<number> | null,
): number {
  return v == null ? 0 : SizeBytesValue(keySize, $.len(v))
}

export function SizeBytesSlice(
  keySize: number,
  vals: $.Slice<$.Slice<number> | null> | null,
): number {
  let n = 0
  for (const v of vals ?? []) {
    n += SizeBytesValue(keySize, $.len(v))
  }
  return n
}

export function SizeMessage(keySize: number, msgSize: number): number {
  return SizeBytesValue(keySize, msgSize)
}

export function SizeGroup(keySize: number, msgSize: number): number {
  return msgSize + 2 * keySize
}

function normalizedVarint(value: number | bigint): bigint {
  if (typeof value === 'bigint') {
    return BigInt.asUintN(64, value)
  }
  return BigInt.asUintN(64, BigInt(Math.trunc(value)))
}

function varintResult(value: bigint): bigint {
  return BigInt.asUintN(64, value)
}

export function DecodeVarint(
  b: $.Slice<number>,
  idx: number,
): [bigint, number, $.GoError] {
  const [v, n] = ConsumeVarint($.goSlice(b, idx, undefined))
  if (n < 0) {
    return [0n, 0, n === -1 ? ioUnexpectedEOF() : ErrIntOverflow]
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
): [bigint, number, $.GoError] {
  const [v, next, err] = DecodeVarint(b, idx)
  return [BigInt.asIntN(64, v), next, err]
}

export function DecodeVarintUint32(
  b: $.Slice<number>,
  idx: number,
): [number, number, $.GoError] {
  const [v, next, err] = DecodeVarint(b, idx)
  return [low32(v), next, err]
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
): [bigint, number, $.GoError] {
  if (idx + 8 > $.len(b)) {
    return [0n, 0, ioUnexpectedEOF()]
  }
  let v = 0n
  for (let i = 7; i >= 0; i--) {
    v = (v << 8n) | BigInt(byteSliceValue(b, idx + i) & 0xff)
  }
  return [v, idx + 8, null]
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

function toInt32(v: number | bigint): number {
  return low32(v) | 0
}

function ioUnexpectedEOF(): $.GoError {
  return $.newError('unexpected EOF')
}

export function EncodeRawBytes(
  dAtA: $.Slice<number>,
  offset: number,
  v: $.Bytes | null,
): number {
  const n = $.len(v)
  offset -= n
  for (let i = 0; i < n; i++) {
    setByte(dAtA, offset + i, $.indexStringOrBytes(v!, i))
  }
  return offset
}

export function EncodeFixed32(
  dAtA: $.Slice<number>,
  offset: number,
  v: number,
): number {
  offset -= 4
  const u = v >>> 0
  setByte(dAtA, offset, u)
  setByte(dAtA, offset + 1, u >>> 8)
  setByte(dAtA, offset + 2, u >>> 16)
  setByte(dAtA, offset + 3, u >>> 24)
  return offset
}

export function EncodeFixed64(
  dAtA: $.Slice<number>,
  offset: number,
  v: number | bigint,
): number {
  offset -= 8
  let u = normalizedVarint(v)
  for (let i = 0; i < 8; i++) {
    setByte(dAtA, offset + i, Number(u & 0xffn))
    u >>= 8n
  }
  return offset
}

export function EncodeBool(
  dAtA: $.Slice<number>,
  offset: number,
  v: boolean,
): number {
  offset--
  setByte(dAtA, offset, v ? 1 : 0)
  return offset
}

export function EncodeString(
  dAtA: $.Slice<number>,
  offset: number,
  v: string,
): number {
  const bytes = $.stringToBytes(v)
  offset = EncodeRawBytes(dAtA, offset, bytes)
  return EncodeVarint(dAtA, offset, bytes.length)
}

export function EncodeBytes(
  dAtA: $.Slice<number>,
  offset: number,
  v: $.Bytes | null,
): number {
  const n = $.len(v)
  offset = EncodeRawBytes(dAtA, offset, v)
  return EncodeVarint(dAtA, offset, n)
}

export function EncodeZigzag32(
  dAtA: $.Slice<number>,
  offset: number,
  v: number,
): number {
  return EncodeVarint(dAtA, offset, ((v << 1) ^ (v >> 31)) >>> 0)
}

export function EncodeZigzag64(
  dAtA: $.Slice<number>,
  offset: number,
  v: number | bigint,
): number {
  const x = toInt64(v)
  return EncodeVarint(dAtA, offset, BigInt.asUintN(64, (x << 1n) ^ (x >> 63n)))
}

export function EncodeVarintPacked(
  dAtA: $.Slice<number>,
  offset: number,
  vals: $.Slice<number | bigint> | null,
): number {
  let total = 0
  for (const v of vals ?? []) {
    total += SizeOfVarint(v)
  }
  offset -= total
  let j = offset
  for (const v of vals ?? []) {
    j = putVarintAt(dAtA, j, v)
  }
  return EncodeVarint(dAtA, offset, total)
}

export function EncodeZigzag32Packed(
  dAtA: $.Slice<number>,
  offset: number,
  vals: $.Slice<number> | null,
): number {
  let total = 0
  for (const v of vals ?? []) {
    total += SizeOfZigzag(BigInt.asUintN(64, BigInt(v | 0)))
  }
  offset -= total
  let j = offset
  for (const v of vals ?? []) {
    j = putVarintAt(dAtA, j, ((v << 1) ^ (v >> 31)) >>> 0)
  }
  return EncodeVarint(dAtA, offset, total)
}

export function EncodeZigzag64Packed(
  dAtA: $.Slice<number>,
  offset: number,
  vals: $.Slice<number | bigint> | null,
): number {
  let total = 0
  for (const v of vals ?? []) {
    total += SizeOfZigzag(BigInt.asUintN(64, toInt64(v)))
  }
  offset -= total
  let j = offset
  for (const v of vals ?? []) {
    const x = toInt64(v)
    j = putVarintAt(dAtA, j, BigInt.asUintN(64, (x << 1n) ^ (x >> 63n)))
  }
  return EncodeVarint(dAtA, offset, total)
}

export function DecodeVarintBool(
  b: $.Slice<number>,
  idx: number,
): [boolean, number, $.GoError] {
  const [v, n] = ConsumeVarint($.goSlice(b, idx, undefined))
  if (n < 0) {
    return [false, 0, n === -1 ? ioUnexpectedEOF() : ErrIntOverflow]
  }
  return [v !== 0n, idx + n, null]
}

export function DecodeSint32(
  b: $.Slice<number>,
  idx: number,
): [number, number, $.GoError] {
  const [v, n] = ConsumeVarint($.goSlice(b, idx, undefined))
  if (n < 0) {
    return [0, 0, n === -1 ? ioUnexpectedEOF() : ErrIntOverflow]
  }
  const lo = low32(v)
  return [((lo >>> 1) ^ -(lo & 1)) | 0, idx + n, null]
}

export function DecodeSint64(
  b: $.Slice<number>,
  idx: number,
): [bigint, number, $.GoError] {
  const [v, n] = ConsumeVarint($.goSlice(b, idx, undefined))
  if (n < 0) {
    return [0n, 0, n === -1 ? ioUnexpectedEOF() : ErrIntOverflow]
  }
  const u = normalizedVarint(v)
  const mask = (u & 1n) === 1n ? 0xffffffffffffffffn : 0n
  return [BigInt.asIntN(64, (u >> 1n) ^ mask), idx + n, null]
}

export function DecodeFloat32(
  b: $.Slice<number>,
  idx: number,
): [number, number, $.GoError] {
  const [v, next, err] = DecodeFixed32(b, idx)
  if (err != null) {
    return [0, 0, err]
  }
  return [math.Float32frombits(v), next, null]
}

export function DecodeFloat64(
  b: $.Slice<number>,
  idx: number,
): [number, number, $.GoError] {
  const [v, next, err] = DecodeFixed64(b, idx)
  if (err != null) {
    return [0, 0, err]
  }
  return [math.Float64frombits(v), next, null]
}

export function DecodeLengthDelimited(
  b: $.Slice<number>,
  idx: number,
): [number, number, $.GoError] {
  const [length, next, err] = DecodeVarint(b, idx)
  if (err != null) {
    return [0, 0, err]
  }
  const l = typeof length === 'bigint' ? Number(length) : length
  if (l < 0) {
    return [0, 0, ErrInvalidLength]
  }
  const end = next + l
  if (end < 0) {
    return [0, 0, ErrInvalidLength]
  }
  if (end > $.len(b)) {
    return [0, 0, ioUnexpectedEOF()]
  }
  return [next, end, null]
}

export function DecodeBytes(
  b: $.Slice<number>,
  idx: number,
  cp: boolean,
): [$.Slice<number>, number, $.GoError] {
  const [start, end, err] = DecodeLengthDelimited(b, idx)
  if (err != null) {
    return [null, 0, err]
  }
  if (cp) {
    const out: number[] = []
    for (let i = start; i < end; i++) {
      out.push(byteSliceValue(b, i))
    }
    return [$.arrayToSlice(out), end, null]
  }
  return [$.goSlice(b, start, end), end, null]
}

export function DecodeBytesAppend(
  dst: $.Slice<number>,
  b: $.Slice<number>,
  idx: number,
): [$.Slice<number>, number, $.GoError] {
  const [start, end, err] = DecodeLengthDelimited(b, idx)
  if (err != null) {
    return [dst, 0, err]
  }
  const out: number[] = []
  for (let i = start; i < end; i++) {
    out.push(byteSliceValue(b, i))
  }
  return [$.arrayToSlice(out), end, null]
}

export function DecodeString(
  b: $.Slice<number>,
  idx: number,
): [string, number, $.GoError] {
  const [start, end, err] = DecodeLengthDelimited(b, idx)
  if (err != null) {
    return ['', 0, err]
  }
  return [$.bytesToString($.goSlice(b, start, end)), end, null]
}

export function DecodeStringUnsafe(
  b: $.Slice<number>,
  idx: number,
): [string, number, $.GoError] {
  const [start, end, err] = DecodeLengthDelimited(b, idx)
  if (err != null) {
    return ['', 0, err]
  }
  if (start === end) {
    return ['', end, null]
  }
  return [$.bytesToString($.goSlice(b, start, end)), end, null]
}

export function PackedVarintElementCount(b: $.Slice<number> | null): number {
  let n = 0
  const l = $.len(b)
  for (let i = 0; i < l; i++) {
    if (byteSliceValue(b!, i) < 0x80) {
      n++
    }
  }
  return n
}

export function PackedFixedElementCount(
  b: $.Slice<number> | null,
  width: number,
): number {
  if (width <= 0) {
    return 0
  }
  return Math.floor($.len(b) / width)
}

export function SkipWithin(
  dAtA: $.Slice<number>,
  idx: number,
  limit: number,
): [number, $.GoError] {
  const [skippy, err] = Skip($.goSlice(dAtA, idx, undefined))
  if (err != null) {
    return [0, err]
  }
  const next = idx + skippy
  if (skippy < 0 || next < 0) {
    return [0, ErrInvalidLength]
  }
  if (next > limit) {
    return [0, ioUnexpectedEOF()]
  }
  return [next, null]
}

export type TextBuilder = strings.Builder

type TextBuilderArg = strings.Builder | $.VarRef<strings.Builder> | null

export function TextStartMessage(sb: TextBuilderArg, name: string): number {
  const b = textBuilder(sb)
  b.WriteString(name)
  b.WriteString(' {')
  return $.len(name) + 2
}

export function TextFinishMessage(sb: TextBuilderArg): string {
  const b = textBuilder(sb)
  b.WriteString('}')
  return b.String()
}

export function TextWriteFieldPrefix(
  sb: TextBuilderArg,
  initialLen: number,
  name: string,
): void {
  const b = textBuilder(sb)
  if (b.Len() > initialLen) {
    b.WriteString(' ')
  }
  b.WriteString(name)
  b.WriteString(': ')
}

export function TextWriteListStart(
  sb: TextBuilderArg,
  initialLen: number,
  name: string,
): void {
  TextWriteFieldPrefix(sb, initialLen, name)
  textBuilder(sb).WriteString('[')
}

export function TextWriteListSeparator(
  sb: TextBuilderArg,
  index: number,
): void {
  if (index > 0) {
    textBuilder(sb).WriteString(', ')
  }
}

export function TextWriteListEnd(sb: TextBuilderArg): void {
  textBuilder(sb).WriteString(']')
}

export function TextWriteMapStart(
  sb: TextBuilderArg,
  initialLen: number,
  name: string,
): void {
  TextWriteFieldPrefix(sb, initialLen, name)
  textBuilder(sb).WriteString('{')
}

export function TextWriteMapEntryPrefix(sb: TextBuilderArg): void {
  textBuilder(sb).WriteString(' ')
}

export function TextWriteMapKeyValueSeparator(sb: TextBuilderArg): void {
  textBuilder(sb).WriteString(': ')
}

export function TextWriteMapEnd(sb: TextBuilderArg): void {
  textBuilder(sb).WriteString(' }')
}

export function TextSortedMapKeys<K, V>(m: Map<K, V> | null): $.Slice<K> {
  if (m == null) {
    return $.arrayToSlice<K>([])
  }
  const keys = Array.from(m.keys())
  keys.sort((a, b) =>
    a < b ? -1
    : a > b ? 1
    : 0,
  )
  return $.arrayToSlice(keys)
}

export function TextWriteTextMarshaler(
  sb: TextBuilderArg,
  v: TextMarshaler | null,
): void {
  textBuilder(sb).WriteString(v!.MarshalProtoText())
}

export function TextWriteString(sb: TextBuilderArg, v: string): void {
  textBuilder(sb).WriteString(strconv.Quote(v))
}

export function TextWriteBytes(sb: TextBuilderArg, v: $.Bytes | null): void {
  const b = textBuilder(sb)
  b.WriteString('"')
  b.WriteString(base64StdEncode(v))
  b.WriteString('"')
}

export function TextWriteStringer(
  sb: TextBuilderArg,
  v: { String(): string } | null,
): void {
  const b = textBuilder(sb)
  b.WriteString('"')
  b.WriteString(v!.String())
  b.WriteString('"')
}

export function TextWriteInt(sb: TextBuilderArg, v: number | bigint): void {
  textBuilder(sb).WriteString(strconv.FormatInt(v, 10))
}

export function TextWriteUint(sb: TextBuilderArg, v: number | bigint): void {
  textBuilder(sb).WriteString(strconv.FormatUint(v, 10))
}

export function TextWriteFloat32(sb: TextBuilderArg, v: number): void {
  textBuilder(sb).WriteString(strconv.FormatFloat(v, 103, -1, 32))
}

export function TextWriteFloat64(sb: TextBuilderArg, v: number): void {
  textBuilder(sb).WriteString(strconv.FormatFloat(v, 103, -1, 64))
}

export function TextWriteBool(sb: TextBuilderArg, v: boolean): void {
  textBuilder(sb).WriteString(strconv.FormatBool(v))
}

function textBuilder(sb: TextBuilderArg): strings.Builder {
  return $.pointerValue<strings.Builder>(sb)
}

function putVarintAt(
  dAtA: $.Slice<number>,
  offset: number,
  v: number | bigint,
): number {
  let value = normalizedVarint(v)
  while (value >= 0x80n) {
    setByte(dAtA, offset, Number((value & 0x7fn) | 0x80n))
    value >>= 7n
    offset++
  }
  setByte(dAtA, offset, Number(value))
  return offset + 1
}

function toInt64(v: number | bigint): bigint {
  return typeof v === 'bigint' ?
      BigInt.asIntN(64, v)
    : BigInt.asIntN(64, BigInt(Math.trunc(v)))
}

function low32(v: number | bigint): number {
  if (typeof v === 'bigint') {
    return Number(BigInt.asUintN(32, v))
  }
  return v >>> 0
}

const base64StdAlphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

function base64StdEncode(v: $.Bytes | null): string {
  const n = $.len(v)
  if (n === 0) {
    return ''
  }
  let out = ''
  let i = 0
  for (; i + 2 < n; i += 3) {
    const b0 = $.indexStringOrBytes(v!, i)
    const b1 = $.indexStringOrBytes(v!, i + 1)
    const b2 = $.indexStringOrBytes(v!, i + 2)
    out += base64StdAlphabet[b0 >> 2]
    out += base64StdAlphabet[((b0 & 0x3) << 4) | (b1 >> 4)]
    out += base64StdAlphabet[((b1 & 0xf) << 2) | (b2 >> 6)]
    out += base64StdAlphabet[b2 & 0x3f]
  }
  const rem = n - i
  if (rem === 1) {
    const b0 = $.indexStringOrBytes(v!, i)
    out += base64StdAlphabet[b0 >> 2]
    out += base64StdAlphabet[(b0 & 0x3) << 4]
    out += '=='
  }
  if (rem === 2) {
    const b0 = $.indexStringOrBytes(v!, i)
    const b1 = $.indexStringOrBytes(v!, i + 1)
    out += base64StdAlphabet[b0 >> 2]
    out += base64StdAlphabet[((b0 & 0x3) << 4) | (b1 >> 4)]
    out += base64StdAlphabet[(b1 & 0xf) << 2]
    out += '='
  }
  return out
}

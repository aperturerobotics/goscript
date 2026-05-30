import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'
import type * as io from '@goscript/io/index.js'

export interface Marshaler {
  MarshalJSON(): [$.Slice<number>, $.GoError]
}

export interface Unmarshaler {
  UnmarshalJSON(data: $.Slice<number>): $.GoError
}

export type RawMessage = $.Bytes
export type Number = string
export type Token = unknown
export type Delim = number

class jsonError extends Error {
  public Error(): string {
    return this.message
  }
}

type decodeOptions = {
  disallowUnknownFields?: boolean
  useNumber?: boolean
}

type fieldMetadata = {
  key: string
  name: string
  tag?: string
  type?: unknown
}

export class SyntaxError extends jsonError {
  public Offset: number

  constructor(init?: Partial<{ Offset: number; Message: string }>) {
    super(init?.Message ?? 'invalid character in JSON')
    this.name = 'SyntaxError'
    this.Offset = init?.Offset ?? 0
  }
}

export class InvalidUTF8Error extends jsonError {
  public S: string

  constructor(init?: Partial<{ S: string }>) {
    super(`json: invalid UTF-8 in string: ${init?.S ?? ''}`)
    this.name = 'InvalidUTF8Error'
    this.S = init?.S ?? ''
  }
}

export class InvalidUnmarshalError extends jsonError {
  public Type: unknown

  constructor(init?: Partial<{ Type: unknown }>) {
    super('json: Unmarshal(non-pointer)')
    this.name = 'InvalidUnmarshalError'
    this.Type = init?.Type ?? null
  }
}

export class MarshalerError extends jsonError {
  public Type: unknown
  public Err: $.GoError

  constructor(init?: Partial<{ Type: unknown; Err: $.GoError }>) {
    super(`json: error calling MarshalJSON: ${init?.Err?.Error?.() ?? ''}`)
    this.name = 'MarshalerError'
    this.Type = init?.Type ?? null
    this.Err = init?.Err ?? null
  }

  public Unwrap(): $.GoError {
    return this.Err
  }
}

export class UnmarshalFieldError extends jsonError {
  public Key: string
  public Type: unknown
  public Field: unknown

  constructor(init?: Partial<{ Key: string; Type: unknown; Field: unknown }>) {
    super(`json: cannot unmarshal object key ${init?.Key ?? ''}`)
    this.name = 'UnmarshalFieldError'
    this.Key = init?.Key ?? ''
    this.Type = init?.Type ?? null
    this.Field = init?.Field ?? null
  }
}

export class UnmarshalTypeError extends jsonError {
  public Value: string
  public Type: unknown
  public Offset: number
  public Struct: string
  public Field: string

  constructor(
    init?: Partial<{
      Value: string
      Type: unknown
      Offset: number
      Struct: string
      Field: string
    }>,
  ) {
    super(`json: cannot unmarshal ${init?.Value ?? ''}`)
    this.name = 'UnmarshalTypeError'
    this.Value = init?.Value ?? ''
    this.Type = init?.Type ?? null
    this.Offset = init?.Offset ?? 0
    this.Struct = init?.Struct ?? ''
    this.Field = init?.Field ?? ''
  }
}

export class UnsupportedTypeError extends jsonError {
  public Type: unknown

  constructor(init?: Partial<{ Type: unknown }>) {
    super('json: unsupported type')
    this.name = 'UnsupportedTypeError'
    this.Type = init?.Type ?? null
  }
}

export class UnsupportedValueError extends jsonError {
  public Value: unknown
  public Str: string

  constructor(init?: Partial<{ Value: unknown; Str: string }>) {
    super(`json: unsupported value: ${init?.Str ?? ''}`)
    this.name = 'UnsupportedValueError'
    this.Value = init?.Value ?? null
    this.Str = init?.Str ?? ''
  }
}

export class Decoder {
  private disallowUnknownFields = false
  private inputOffset = 0
  private useNumber = false

  public constructor(private readonly reader: io.Reader) {}

  public Decode(v: unknown): $.GoError {
    const [data, err] = readAllSync(this.reader)
    if (err !== null) {
      return err
    }
    this.inputOffset += $.len(data)
    return decode(data, v, {
      disallowUnknownFields: this.disallowUnknownFields,
      useNumber: this.useNumber,
    })
  }

  public Buffered(): io.Reader {
    return new bytes.Buffer()
  }

  public DisallowUnknownFields(): void {
    this.disallowUnknownFields = true
  }

  public InputOffset(): number {
    return this.inputOffset
  }

  public More(): boolean {
    return false
  }

  public Token(): [Token, $.GoError] {
    return [null, $.newError('json: token streaming is unsupported')]
  }

  public UseNumber(): void {
    this.useNumber = true
  }
}

export class Encoder {
  private escapeHTML = true
  private indent = ''
  private prefix = ''

  public constructor(private readonly writer: io.Writer) {}

  public Encode(v: unknown): $.GoError {
    const [data, err] =
      this.indent === '' && this.prefix === '' ?
        marshalBytes(v, '', '', this.escapeHTML)
      : marshalBytes(v, this.prefix, this.indent, this.escapeHTML)
    if (err !== null) {
      return err
    }

    const out = $.stringToBytes($.bytesToString(data) + '\n')
    const [n, writeErr] = this.writer.Write(out)
    if (writeErr !== null) {
      return writeErr
    }
    if (n < $.len(out)) {
      return $.newError('short write')
    }
    return null
  }

  public SetEscapeHTML(on: boolean): void {
    this.escapeHTML = on
  }

  public SetIndent(prefix: string, indent: string): void {
    this.prefix = prefix
    this.indent = indent
  }
}

export function NewDecoder(r: io.Reader): Decoder {
  return new Decoder(r)
}

export function NewEncoder(w: io.Writer): Encoder {
  return new Encoder(w)
}

$.registerInterfaceType('json.Marshaler', null, [
  {
    name: 'MarshalJSON',
    args: [],
    returns: [
      {
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      { type: 'GoError' },
    ],
  },
])

$.registerInterfaceType('json.Unmarshaler', null, [
  {
    name: 'UnmarshalJSON',
    args: [
      {
        name: 'data',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
    ],
    returns: [{ type: 'GoError' }],
  },
])

export function Marshal(v: unknown): [$.Slice<number>, $.GoError] {
  return marshalBytes(v, '', '', true)
}

function marshalBytes(
  v: unknown,
  prefix: string,
  indent: string,
  escapeHTML: boolean,
): [$.Slice<number>, $.GoError] {
  try {
    let text = JSON.stringify(marshalValue(v), null, indent)
    if (escapeHTML) {
      text = escapeHTMLString(text)
    }
    if (prefix !== '') {
      text = text
        .split('\n')
        .map((line, idx) => (idx === 0 ? line : prefix + line))
        .join('\n')
    }
    return [$.stringToBytes(text), null]
  } catch (err) {
    return [null, goError(err)]
  }
}

export function Compact(
  dst: bytes.Buffer | $.VarRef<bytes.Buffer>,
  src: $.Slice<number>,
): $.GoError {
  try {
    const text = JSON.stringify(JSON.parse($.bytesToString(src)))
    const [, err] = $.pointerValue<bytes.Buffer>(dst).Write(
      $.stringToBytes(text),
    )
    return err
  } catch (err) {
    return goError(err)
  }
}

export function HTMLEscape(
  dst: bytes.Buffer | $.VarRef<bytes.Buffer>,
  src: $.Slice<number>,
): void {
  const escaped = $.bytesToString(src).replace(/[<>&\u2028\u2029]/g, (char) => {
    switch (char) {
      case '<':
        return '\\u003c'
      case '>':
        return '\\u003e'
      case '&':
        return '\\u0026'
      case '\u2028':
        return '\\u2028'
      case '\u2029':
        return '\\u2029'
      default:
        return char
    }
  })
  $.pointerValue<bytes.Buffer>(dst).Write($.stringToBytes(escaped))
}

export function Indent(
  dst: bytes.Buffer | $.VarRef<bytes.Buffer>,
  src: $.Slice<number>,
  prefix: string,
  indent: string,
): $.GoError {
  try {
    const text = JSON.stringify(JSON.parse($.bytesToString(src)), null, indent)
    const prefixed =
      prefix === '' ? text : (
        text
          .split('\n')
          .map((line, idx) => (idx === 0 ? line : prefix + line))
          .join('\n')
      )
    const [, err] = $.pointerValue<bytes.Buffer>(dst).Write(
      $.stringToBytes(prefixed),
    )
    return err
  } catch (err) {
    return goError(err)
  }
}

export function MarshalIndent(
  v: unknown,
  prefix: string,
  indent: string,
): [$.Slice<number>, $.GoError] {
  return marshalBytes(v, prefix, indent, true)
}

export function Unmarshal(data: $.Slice<number>, v: unknown): $.GoError {
  return decode(data, v, {})
}

function decode(
  data: $.Slice<number>,
  v: unknown,
  opts: decodeOptions,
): $.GoError {
  try {
    if (!validUnmarshalTarget(v)) {
      return $.toGoError(new InvalidUnmarshalError())
    }
    const unmarshaler = unmarshalJSONTarget(v)
    if (unmarshaler !== null) {
      const err = unmarshaler.UnmarshalJSON(data)
      if (err instanceof Promise) {
        return $.newError('json: asynchronous UnmarshalJSON is unsupported')
      }
      return err
    }
    assignDecodedValue(v, parseJSON(data, opts), opts)
    return null
  } catch (err) {
    return goError(err)
  }
}

export function Valid(data: $.Slice<number>): boolean {
  try {
    JSON.parse($.bytesToString(data))
    return true
  } catch {
    return false
  }
}

export function RawMessage_MarshalJSON(
  m: RawMessage,
): [$.Slice<number>, $.GoError] {
  if (m === null) {
    return [$.stringToBytes('null'), null]
  }
  const out = $.makeSlice<number>($.len(m), undefined, 'byte')
  $.copy(out, m)
  return [out, null]
}

export function RawMessage_UnmarshalJSON(
  m: $.VarRef<RawMessage> | RawMessage | null,
  data: $.Slice<number>,
): $.GoError {
  const out = $.makeSlice<number>($.len(data), undefined, 'byte')
  $.copy(out, data)
  if ($.isVarRef(m)) {
    m.value = out
  }
  return null
}

export function Number_Float64(n: Number): [number, $.GoError] {
  if (!isValidFloat(n)) {
    return [0, $.newError(`strconv.ParseFloat: parsing "${n}": invalid syntax`)]
  }
  if (/^[+-]?nan$/i.test(n)) {
    return [Number.NaN, null]
  }
  if (/^\+?inf(?:inity)?$/i.test(n)) {
    return [Infinity, null]
  }
  if (/^-inf(?:inity)?$/i.test(n)) {
    return [-Infinity, null]
  }
  const value = Number.parseFloat(n)
  if (Number.isNaN(value)) {
    return [0, $.newError(`strconv.ParseFloat: parsing "${n}": invalid syntax`)]
  }
  if (!Number.isFinite(value) && !/^[+-]?(?:inf(?:inity)?|nan)$/i.test(n)) {
    return [
      value,
      $.newError(`strconv.ParseFloat: parsing "${n}": value out of range`),
    ]
  }
  return [value, null]
}

export function Number_Int64(n: Number): [number, $.GoError] {
  if (!/^[+-]?\d+$/.test(n)) {
    return [0, $.newError(`strconv.ParseInt: parsing "${n}": invalid syntax`)]
  }
  const value = BigInt(n)
  const min = -(1n << 63n)
  const max = (1n << 63n) - 1n
  if (value < min || value > max) {
    const clamped = value < min ? min : max
    return [
      Number(clamped),
      $.newError(`strconv.ParseInt: parsing "${n}": value out of range`),
    ]
  }
  return [Number(value), null]
}

export function Number_String(n: Number): string {
  return n
}

function isValidFloat(value: string): boolean {
  return /^[+-]?(?:(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|inf(?:inity)?|nan)$/i.test(
    value,
  )
}

function readAllSync(r: io.Reader): [$.Bytes, $.GoError] {
  const chunks: number[] = []
  const buf = $.makeSlice<number>(512, undefined, 'byte')
  while (true) {
    const read = r.Read(buf)
    if (read instanceof Promise) {
      return [null, $.newError('json: asynchronous reader is unsupported')]
    }
    const [n, err] = read
    if (n > 0) {
      chunks.push(...$.bytesToUint8Array($.goSlice(buf, 0, n)))
    }
    if (err !== null) {
      if (err.Error() === 'EOF') {
        return [new Uint8Array(chunks), null]
      }
      return [null, err]
    }
  }
}

function marshalValue(v: unknown): unknown {
  const marshaler = marshalJSONTarget(v)
  if (marshaler !== null) {
    const result = marshaler.MarshalJSON()
    if (result instanceof Promise) {
      throw new MarshalerError({
        Err: $.newError('json: asynchronous MarshalJSON is unsupported'),
      })
    }
    const [data, err] = result
    if (err !== null) {
      throw new MarshalerError({ Err: err })
    }
    try {
      return JSON.parse($.bytesToString(data))
    } catch (parseErr) {
      throw new MarshalerError({ Err: goError(parseErr) })
    }
  }
  if ($.isVarRef(v)) {
    return marshalValue(v.value)
  }
  if (v === null || v === undefined) {
    return null
  }
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) {
      throw new UnsupportedValueError({ Value: v, Str: String(v) })
    }
    return v
  }
  if (typeof v !== 'object') {
    return v
  }
  if (v instanceof Uint8Array) {
    return base64Encode(v)
  }
  if (Array.isArray(v)) {
    return v.map(marshalValue)
  }
  if (v instanceof Map) {
    const out: Record<string, unknown> = {}
    for (const [key, value] of v.entries()) {
      out[String(key)] = marshalValue(value)
    }
    return out
  }
  if (!isStructValue(v)) {
    return v
  }

  const out: Record<string, unknown> = {}
  for (const field of structFields(v)) {
    const ref = v._fields[field.key]
    if (ref === undefined) {
      continue
    }
    const jsonName = jsonFieldName(field.name, field.tag)
    if (jsonName === '') {
      continue
    }
    out[jsonName] = marshalFieldValue(ref.value, field.type)
  }
  return out
}

function marshalFieldValue(value: unknown, fieldType: unknown): unknown {
  if (isRawMessageType(fieldType)) {
    const target = $.isVarRef(value) ? value.value : value
    if (target === null || target === undefined) {
      return null
    }
    try {
      return JSON.parse($.bytesToString(target as $.Slice<number>))
    } catch (err) {
      throw new MarshalerError({ Err: goError(err) })
    }
  }
  return marshalValue(value)
}

function marshalJSONTarget(value: unknown): Marshaler | null {
  const target = $.isVarRef(value) ? value.value : value
  if (target === null || target === undefined) {
    return null
  }
  if (typeof target !== 'object' && typeof target !== 'function') {
    return null
  }
  const method = Reflect.get(target, 'MarshalJSON')
  return typeof method === 'function' ? (target as Marshaler) : null
}

function unmarshalJSONTarget(value: unknown): Unmarshaler | null {
  const target = $.isVarRef(value) ? value.value : value
  if (target === null || target === undefined) {
    return null
  }
  if (typeof target !== 'object' && typeof target !== 'function') {
    return null
  }
  const method = Reflect.get(target, 'UnmarshalJSON')
  return typeof method === 'function' ? (target as Unmarshaler) : null
}

function validUnmarshalTarget(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false
  }
  if ($.isVarRef(value)) {
    return true
  }
  return unmarshalJSONTarget(value) !== null || isStructValue(value)
}

function parseJSON(data: $.Slice<number>, opts: decodeOptions): unknown {
  const text = $.bytesToString(data)
  if (opts.useNumber) {
    return JSON.parse(text, (_key, value) =>
      typeof value === 'number' ? String(value) : value,
    )
  }
  return JSON.parse(text)
}

function assignDecodedValue(
  target: unknown,
  decoded: unknown,
  opts: decodeOptions,
): void {
  if ($.isVarRef(target)) {
    const unmarshaler = unmarshalJSONTarget(target.value)
    if (unmarshaler !== null) {
      const err = unmarshaler.UnmarshalJSON(
        $.stringToBytes(JSON.stringify(decoded)),
      )
      if (err !== null) {
        throw err
      }
      return
    }
    if (isStructValue(target.value) && isPlainObject(decoded)) {
      assignStructFields(target.value, decoded, opts)
      return
    }
    if (target.value instanceof Uint8Array && typeof decoded === 'string') {
      target.value = base64Decode(decoded)
      return
    }
    if (isPlainObject(decoded)) {
      target.value = objectToMap(decoded)
      return
    }
    target.value = decoded
    return
  }
  if (isStructValue(target) && isPlainObject(decoded)) {
    assignStructFields(target, decoded, opts)
  }
}

function assignStructFields(
  target: { _fields: Record<string, $.VarRef<unknown>> },
  decoded: Record<string, unknown>,
  opts: decodeOptions,
): void {
  const fields = structFields(target)
  const knownNames = new Set<string>()
  for (const field of fields) {
    const jsonName = jsonFieldName(field.name, field.tag)
    if (jsonName !== '') {
      knownNames.add(jsonName)
    }
  }
  if (opts.disallowUnknownFields) {
    for (const key of Object.keys(decoded)) {
      if (!knownNames.has(key)) {
        throw $.newError(`json: unknown field "${key}"`)
      }
    }
  }
  for (const field of fields) {
    const ref = target._fields[field.key]
    if (ref === undefined) {
      continue
    }
    const jsonName = jsonFieldName(field.name, field.tag)
    if (
      jsonName !== '' &&
      Object.prototype.hasOwnProperty.call(decoded, jsonName)
    ) {
      assignDecodedFieldValue(ref, decoded[jsonName], opts, field.type)
    }
  }
}

function assignDecodedFieldValue(
  target: $.VarRef<unknown>,
  decoded: unknown,
  opts: decodeOptions,
  fieldType: unknown,
): void {
  if (isRawMessageType(fieldType)) {
    target.value = $.stringToBytes(JSON.stringify(decoded))
    return
  }
  assignDecodedValue(target, decoded, opts)
}

function objectToMap(decoded: Record<string, unknown>): Map<string, unknown> {
  const out = new Map<string, unknown>()
  for (const [key, value] of Object.entries(decoded)) {
    out.set(key, isPlainObject(value) ? objectToMap(value) : value)
  }
  return out
}

function isStructValue(
  value: unknown,
): value is { _fields: Record<string, $.VarRef<unknown>> } {
  if (value === null || typeof value !== 'object') {
    return false
  }
  const fields = Reflect.get(value, '_fields')
  return (
    fields !== null &&
    fields !== undefined &&
    typeof fields === 'object' &&
    !Array.isArray(fields)
  )
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !(value instanceof Uint8Array) &&
    !(value instanceof Map)
  )
}

function structFields(value: {
  _fields: Record<string, $.VarRef<unknown>>
}): fieldMetadata[] {
  const fields = structFieldMetadata(value)
  if (fields.length !== 0) {
    return fields
  }
  return Object.keys(value._fields).map((key) => ({ key, name: key }))
}

function structFieldMetadata(value: unknown): fieldMetadata[] {
  if (value === null || typeof value !== 'object') {
    return []
  }
  const ctor = Reflect.get(value, 'constructor')
  if (
    ctor === null ||
    ctor === undefined ||
    (typeof ctor !== 'object' && typeof ctor !== 'function')
  ) {
    return []
  }
  const typeInfo = Reflect.get(ctor, '__typeInfo')
  if (
    typeInfo === null ||
    typeInfo === undefined ||
    typeof typeInfo !== 'object'
  ) {
    return []
  }
  const fields = Reflect.get(typeInfo, 'fields')
  if (Array.isArray(fields)) {
    const out: fieldMetadata[] = []
    for (const field of fields) {
      if (!$.isStructFieldInfo(field)) {
        continue
      }
      const tag = field.tag
      out.push({
        key: $.structFieldRuntimeKey(field),
        name: field.name,
        type: field.type,
        ...(typeof tag === 'string' ? { tag } : {}),
      })
    }
    return out
  }
  return []
}

function isRawMessageType(value: unknown): boolean {
  if (value === 'json.RawMessage' || value === 'encoding/json.RawMessage') {
    return true
  }
  if (!isPlainObject(value)) {
    return false
  }
  return (
    value.typeName === 'json.RawMessage' ||
    value.typeName === 'encoding/json.RawMessage' ||
    value.name === 'json.RawMessage' ||
    value.name === 'encoding/json.RawMessage'
  )
}

function goError(err: unknown): $.GoError {
  if (
    err !== null &&
    typeof err === 'object' &&
    typeof (err as { Error?: unknown }).Error === 'function'
  ) {
    return err as $.GoError
  }
  if (err instanceof Error) {
    return $.toGoError(err)
  }
  return $.newError(String(err))
}

function base64Encode(data: Uint8Array): string {
  let binary = ''
  for (const byte of data) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

function base64Decode(text: string): Uint8Array {
  const binary = atob(text)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i)
  }
  return out
}

function escapeHTMLString(text: string): string {
  return text.replace(/[<>&\u2028\u2029]/g, (char) => {
    switch (char) {
      case '<':
        return '\\u003c'
      case '>':
        return '\\u003e'
      case '&':
        return '\\u0026'
      case '\u2028':
        return '\\u2028'
      case '\u2029':
        return '\\u2029'
      default:
        return char
    }
  })
}

function jsonFieldName(fieldName: string, tag: string | undefined): string {
  if (tag === undefined || !tag.startsWith('json:"')) {
    return fieldName
  }
  const end = tag.indexOf('"', 'json:"'.length)
  if (end < 0) {
    return fieldName
  }
  const name = tag.slice('json:"'.length, end).split(',')[0]
  if (name === '-') {
    return ''
  }
  if (name === '') {
    return fieldName
  }
  return name
}

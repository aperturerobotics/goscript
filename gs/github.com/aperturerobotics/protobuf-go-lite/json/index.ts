import * as $ from '../../../../builtin/index.js'
import * as time from '../../../../time/index.js'

export interface FieldMask {
  GetPaths(): $.Slice<string>
}

export interface Marshaler {
  MarshalProtoJSON(s: MarshalState | null): void
}

export interface Unmarshaler {
  UnmarshalProtoJSON(s: UnmarshalState | null): void
}

type JSONRecord = Record<string, unknown>

export class JsonStream {
  private chunks: string[] = []
  private err: $.GoError = null

  constructor(_writer?: unknown) {}

  public Error(): $.GoError {
    return this.err
  }

  public Write(p: $.Slice<number>): [number, $.GoError] {
    this.chunks.push(bytesToString(p))
    return [$.len(p), null]
  }

  public WriteArrayEnd(): void {
    this.chunks.push(']')
  }

  public WriteArrayStart(): void {
    this.chunks.push('[')
  }

  public WriteBool(b: boolean): void {
    this.chunks.push(JSON.stringify(b))
  }

  public WriteFloat32(f: number): void {
    this.WriteFloat64(f)
  }

  public WriteFloat64(f: number): void {
    if (Number.isNaN(f)) {
      this.WriteString('NaN')
      return
    }
    if (f === Infinity) {
      this.WriteString('Infinity')
      return
    }
    if (f === -Infinity) {
      this.WriteString('-Infinity')
      return
    }
    this.chunks.push(JSON.stringify(f))
  }

  public WriteInt32(i: number): void {
    this.chunks.push(JSON.stringify(i))
  }

  public WriteMore(): void {
    this.chunks.push(',')
  }

  public WriteNil(): void {
    this.chunks.push('null')
  }

  public WriteObjectEnd(): void {
    this.chunks.push('}')
  }

  public WriteObjectField(field: string): void {
    this.WriteString(field)
    this.chunks.push(':')
  }

  public WriteObjectStart(): void {
    this.chunks.push('{')
  }

  public WriteString(str: string): void {
    this.chunks.push(JSON.stringify(str))
  }

  public WriteUint32(u: number): void {
    this.chunks.push(JSON.stringify(u))
  }

  public String(): string {
    return this.chunks.join('')
  }
}

export class MarshalerConfig {
  public EnumsAsInts = true
  public AnyTypeResolver: unknown = null

  constructor(init?: Partial<MarshalerConfig>) {
    Object.assign(this, init)
  }

  public clone(): MarshalerConfig {
    return new MarshalerConfig({
      EnumsAsInts: this.EnumsAsInts,
      AnyTypeResolver: this.AnyTypeResolver,
    })
  }

  public Marshal(m: Marshaler | null): [$.Slice<number>, $.GoError] {
    const stream = new JsonStream()
    const state = new MarshalState({ config: this, stream })
    if (m == null) {
      state.WriteNil()
    } else {
      m.MarshalProtoJSON(state)
    }
    if (state.Err() != null) {
      return [null, state.Err()]
    }
    return [stringToBytes(stream.String()), null]
  }
}

export class UnmarshalerConfig {
  public AnyTypeResolver: unknown = null

  constructor(init?: Partial<UnmarshalerConfig>) {
    Object.assign(this, init)
  }

  public clone(): UnmarshalerConfig {
    return new UnmarshalerConfig({ AnyTypeResolver: this.AnyTypeResolver })
  }

  public Unmarshal(data: $.Slice<number>, m: Unmarshaler | null): $.GoError {
    const state = NewUnmarshalState(data, this)
    if (state == null) {
      return $.newError('json: failed to allocate unmarshal state')
    }
    m?.UnmarshalProtoJSON(state)
    return state.Err()
  }
}

export const DefaultMarshalerConfig = new MarshalerConfig()
export const DefaultUnmarshalerConfig = new UnmarshalerConfig()

export class MarshalState {
  private configValue: MarshalerConfig
  private stream: JsonStream
  private err: $.GoError = null
  private fields = new Set<string>()

  constructor(init?: Partial<{ config: MarshalerConfig; stream: JsonStream }>) {
    this.configValue = init?.config?.clone() ?? DefaultMarshalerConfig.clone()
    this.stream = init?.stream ?? new JsonStream()
  }

  public AnyTypeResolver(): unknown {
    return this.configValue.AnyTypeResolver
  }

  public Config(): MarshalerConfig {
    return this.configValue.clone()
  }

  public Err(): $.GoError {
    return this.err ?? this.stream.Error()
  }

  public HasField(field: string): boolean {
    return this.fields.has(field)
  }

  public SetError(err: $.GoError): void {
    this.err = err
  }

  public SetErrorf(format: string, ...args: unknown[]): void {
    this.err = $.newError(formatError(format, args))
  }

  public Sub(js: JsonStream | null): MarshalState | null {
    return new MarshalState({ config: this.configValue, stream: js ?? new JsonStream() })
  }

  public WithField(field: string): MarshalState | null {
    const next = new MarshalState({ config: this.configValue, stream: this.stream })
    next.fields = new Set(this.fields)
    next.fields.add(field)
    return next
  }

  public WithFieldMask(...paths: string[]): MarshalState | null {
    const next = new MarshalState({ config: this.configValue, stream: this.stream })
    next.fields = new Set([...this.fields, ...paths])
    return next
  }

  public Write(v: $.Slice<number>): [number, $.GoError] {
    return this.stream.Write(v)
  }

  public WriteArrayEnd(): void {
    this.stream.WriteArrayEnd()
  }

  public WriteArrayStart(): void {
    this.stream.WriteArrayStart()
  }

  public WriteBool(v: boolean): void {
    this.stream.WriteBool(v)
  }

  public WriteBoolArray(vs: $.Slice<boolean>): void {
    this.writeArray(vs, (v) => this.WriteBool(v))
  }

  public WriteBytes(v: $.Slice<number>): void {
    this.WriteString(base64Encode(v))
  }

  public WriteBytesArray(vs: $.Slice<$.Slice<number>>): void {
    this.writeArray(vs, (v) => this.WriteBytes(v))
  }

  public WriteDuration(x: number): void {
    this.WriteString(`${x}s`)
  }

  public WriteEnum(x: number, ...valueMaps: Array<Map<number, string> | Record<number, string> | null>): void {
    if (this.configValue.EnumsAsInts) {
      this.WriteEnumNumber(x)
      return
    }
    this.WriteEnumString(x, ...valueMaps)
  }

  public WriteEnumNumber(x: number): void {
    this.WriteInt32(x)
  }

  public WriteEnumString(x: number, ...valueMaps: Array<Map<number, string> | Record<number, string> | null>): void {
    const value = enumStringValue(x, valueMaps)
    if (value == null) {
      this.WriteEnumNumber(x)
      return
    }
    this.WriteString(value)
  }

  public WriteFieldMask(x: FieldMask | null): void {
    this.WriteString(sliceValues(x?.GetPaths()).join(','))
  }

  public WriteFloat32(v: number): void {
    this.stream.WriteFloat32(v)
  }

  public WriteFloat32Array(vs: $.Slice<number>): void {
    this.writeArray(vs, (v) => this.WriteFloat32(v))
  }

  public WriteFloat64(v: number): void {
    this.stream.WriteFloat64(v)
  }

  public WriteFloat64Array(vs: $.Slice<number>): void {
    this.writeArray(vs, (v) => this.WriteFloat64(v))
  }

  public WriteInt32(v: number): void {
    this.stream.WriteInt32(v)
  }

  public WriteInt32Array(vs: $.Slice<number>): void {
    this.writeArray(vs, (v) => this.WriteInt32(v))
  }

  public WriteInt64(v: number): void {
    this.WriteString(String(Math.trunc(v)))
  }

  public WriteInt64Array(vs: $.Slice<number>): void {
    this.writeArray(vs, (v) => this.WriteInt64(v))
  }

  public WriteLegacyFieldMask(x: FieldMask | null): void {
    this.WriteFieldMask(x)
  }

  public WriteMore(): void {
    this.stream.WriteMore()
  }

  public WriteMoreIf(b: $.VarRef<boolean> | boolean): void {
    const value = typeof b === 'boolean' ? b : b.value
    if (value) {
      this.WriteMore()
      return
    }
    if (typeof b !== 'boolean') {
      b.value = true
    }
  }

  public WriteNil(): void {
    this.stream.WriteNil()
  }

  public WriteObjectBoolField(field: boolean): void {
    this.WriteObjectField(String(field))
  }

  public WriteObjectEnd(): void {
    this.stream.WriteObjectEnd()
  }

  public WriteObjectField(field: string): void {
    this.stream.WriteObjectField(field)
  }

  public WriteObjectInt32Field(field: number): void {
    this.WriteObjectField(String(Math.trunc(field)))
  }

  public WriteObjectInt64Field(field: number): void {
    this.WriteObjectField(String(Math.trunc(field)))
  }

  public WriteObjectStart(): void {
    this.stream.WriteObjectStart()
  }

  public WriteObjectStringField(field: string): void {
    this.WriteObjectField(field)
  }

  public WriteObjectUint32Field(field: number): void {
    this.WriteObjectField(String(Math.trunc(field)))
  }

  public WriteObjectUint64Field(field: number): void {
    this.WriteObjectField(String(Math.trunc(field)))
  }

  public WriteString(v: string): void {
    this.stream.WriteString(v)
  }

  public WriteStringArray(vs: $.Slice<string>): void {
    this.writeArray(vs, (v) => this.WriteString(v))
  }

  public WriteTime(x: time.Time | $.VarRef<time.Time> | null): void {
    this.WriteString($.pointerValue<time.Time>(x).Format(time.RFC3339Nano))
  }

  public WriteUint32(v: number): void {
    this.stream.WriteUint32(v)
  }

  public WriteUint32Array(vs: $.Slice<number>): void {
    this.writeArray(vs, (v) => this.WriteUint32(v))
  }

  public WriteUint64(v: number): void {
    this.WriteString(String(Math.trunc(v)))
  }

  public WriteUint64Array(vs: $.Slice<number>): void {
    this.writeArray(vs, (v) => this.WriteUint64(v))
  }

  private writeArray<T>(values: $.Slice<T>, writeValue: (value: T) => void): void {
    this.WriteArrayStart()
    let wrote = false
    for (const value of sliceValues(values)) {
      if (wrote) {
        this.WriteMore()
      }
      wrote = true
      writeValue(value)
    }
    this.WriteArrayEnd()
  }
}

export class UnmarshalState {
  private configValue: UnmarshalerConfig
  private value: unknown
  private root: UnmarshalState
  private err: $.GoError = null
  private fieldMaskPaths: Set<string>
  private path: string[]
  private objectEntries: Array<[string, unknown]> | null = null
  private objectIndex = 0

  constructor(init?: Partial<{
    config: UnmarshalerConfig
    value: unknown
    root: UnmarshalState
    fieldMaskPaths: Set<string>
    path: string[]
  }>) {
    this.configValue = init?.config?.clone() ?? DefaultUnmarshalerConfig.clone()
    this.value = init?.value ?? null
    this.root = init?.root ?? this
    this.fieldMaskPaths = init?.fieldMaskPaths ?? new Set<string>()
    this.path = init?.path ?? []
  }

  public AddField(field: string): void {
    this.fieldMaskPaths.add([...this.path, field].join('.'))
  }

  public AnyTypeResolver(): unknown {
    return this.configValue.AnyTypeResolver
  }

  public Config(): UnmarshalerConfig {
    return this.configValue.clone()
  }

  public Err(): $.GoError {
    return this.root.err
  }

  public FieldMask(): FieldMask | null {
    const paths = Array.from(this.fieldMaskPaths)
    return { GetPaths: () => $.arrayToSlice(paths) }
  }

  public ReadArray(cb: (() => void) | null): void {
    if (!Array.isArray(this.value)) {
      this.SetErrorf('expected JSON array')
      return
    }
    const original = this.value
    for (const item of this.value) {
      this.value = item
      cb?.()
      if (this.Err() != null) {
        break
      }
    }
    this.value = original
  }

  public ReadBool(): boolean {
    return this.value === true
  }

  public ReadBoolArray(): $.Slice<boolean> {
    return this.readArrayValues(() => this.ReadBool())
  }

  public ReadBoolMap(cb: ((key: boolean) => void) | null): void {
    this.readMapKeys((key) => {
      const parsed = parseBoolMapKey(key)
      if (parsed == null) {
        this.SetErrorf('invalid map key %q for bool map', key)
        return
      }
      cb?.(parsed)
    })
  }

  public ReadBytes(): $.Slice<number> {
    return base64Decode(this.ReadString())
  }

  public ReadBytesArray(): $.Slice<$.Slice<number>> {
    return this.readArrayValues(() => this.ReadBytes())
  }

  public ReadDuration(): $.VarRef<number> | null {
    return $.varRef(numberFromJSON(this.value))
  }

  public ReadEnum(...valueMaps: Array<Map<string, number> | Record<string, number> | null>): number {
    if (typeof this.value === 'number') {
      return Math.trunc(this.value)
    }
    if (typeof this.value === 'string') {
      for (const valueMap of valueMaps) {
        const mapped = lookupStringMap(valueMap, this.value)
        if (mapped !== undefined) {
          return mapped
        }
      }
      return Math.trunc(Number(this.value) || 0)
    }
    return 0
  }

  public ReadFieldMask(): FieldMask | null {
    const paths = typeof this.value === 'string'
      ? this.value.split(',').filter((part) => part !== '')
      : Array.isArray(recordValue(this.value)?.paths)
        ? sliceValues(recordValue(this.value)?.paths as $.Slice<string>)
        : []
    return { GetPaths: () => $.arrayToSlice(paths) }
  }

  public ReadFloat32(): number {
    return numberFromJSON(this.value)
  }

  public ReadFloat32Array(): $.Slice<number> {
    return this.readArrayValues(() => this.ReadFloat32())
  }

  public ReadFloat64(): number {
    return numberFromJSON(this.value)
  }

  public ReadFloat64Array(): $.Slice<number> {
    return this.readArrayValues(() => this.ReadFloat64())
  }

  public ReadInt32(): number {
    return Math.trunc(numberFromJSON(this.value))
  }

  public ReadInt32Array(): $.Slice<number> {
    return this.readArrayValues(() => this.ReadInt32())
  }

  public ReadInt32Map(cb: ((key: number) => void) | null): void {
    this.readMapKeys((key) => {
      const parsed = parseSignedMapKey(key, 32)
      if (parsed == null) {
        this.SetErrorf('invalid map key %q for int32 map', key)
        return
      }
      cb?.(parsed)
    })
  }

  public ReadInt64(): number {
    return Math.trunc(numberFromJSON(this.value))
  }

  public ReadInt64Array(): $.Slice<number> {
    return this.readArrayValues(() => this.ReadInt64())
  }

  public ReadInt64Map(cb: ((key: number) => void) | null): void {
    this.readMapKeys((key) => {
      const parsed = parseSignedMapKey(key, 64)
      if (parsed == null) {
        this.SetErrorf('invalid map key %q for int64 map', key)
        return
      }
      cb?.(parsed)
    })
  }

  public ReadNil(): boolean {
    return this.value === null
  }

  public ReadObject(cb: ((key: string) => void) | null): void {
    const record = recordValue(this.value)
    if (record == null) {
      this.SetErrorf('expected JSON object')
      return
    }
    const original = this.value
    for (const key of Object.keys(record)) {
      this.value = record[key]
      cb?.(key)
      if (this.Err() != null) {
        break
      }
    }
    this.value = original
  }

  public ReadObjectField(): string {
    const record = recordValue(this.value)
    if (record == null) {
      this.SetErrorf('expected JSON object')
      return ''
    }
    if (this.objectEntries == null) {
      this.objectEntries = Object.entries(record)
      this.objectIndex = 0
    }
    if (this.objectIndex >= this.objectEntries.length) {
      return ''
    }
    const [key, value] = this.objectEntries[this.objectIndex]
    this.objectIndex++
    this.value = value
    return key
  }

  public ReadString(): string {
    if (typeof this.value === 'string') {
      return this.value
    }
    if (this.value == null) {
      return ''
    }
    return String(this.value)
  }

  public ReadStringArray(): $.Slice<string> {
    return this.readArrayValues(() => this.ReadString())
  }

  public ReadStringMap(cb: ((key: string) => void) | null): void {
    this.readMapKeys((key) => cb?.(key))
  }

  public ReadTime(): $.VarRef<time.Time> | null {
    const [parsed, err] = time.Parse(time.RFC3339, this.ReadString())
    if (err != null) {
      this.SetError(err)
    }
    return $.varRef($.markAsStructValue($.cloneStructValue(parsed)))
  }

  public ReadUint32(): number {
    return Math.trunc(Math.max(0, numberFromJSON(this.value)))
  }

  public ReadUint32Array(): $.Slice<number> {
    return this.readArrayValues(() => this.ReadUint32())
  }

  public ReadUint32Map(cb: ((key: number) => void) | null): void {
    this.readMapKeys((key) => {
      const parsed = parseUnsignedMapKey(key, 32)
      if (parsed == null) {
        this.SetErrorf('invalid map key %q for uint32 map', key)
        return
      }
      cb?.(parsed)
    })
  }

  public ReadUint64(): number {
    return this.ReadUint32()
  }

  public ReadUint64Array(): $.Slice<number> {
    return this.readArrayValues(() => this.ReadUint64())
  }

  public ReadUint64Map(cb: ((key: number) => void) | null): void {
    this.readMapKeys((key) => {
      const parsed = parseUnsignedMapKey(key, 64)
      if (parsed == null) {
        this.SetErrorf('invalid map key %q for uint64 map', key)
        return
      }
      cb?.(parsed)
    })
  }

  public ReadWrappedBool(): boolean { return this.readWrapped(() => this.ReadBool()) }
  public ReadWrappedBytes(): $.Slice<number> { return this.readWrapped(() => this.ReadBytes()) }
  public ReadWrappedFloat32(): number { return this.readWrapped(() => this.ReadFloat32()) }
  public ReadWrappedFloat64(): number { return this.readWrapped(() => this.ReadFloat64()) }
  public ReadWrappedInt32(): number { return this.readWrapped(() => this.ReadInt32()) }
  public ReadWrappedInt64(): number { return this.readWrapped(() => this.ReadInt64()) }
  public ReadWrappedString(): string { return this.readWrapped(() => this.ReadString()) }
  public ReadWrappedUint32(): number { return this.readWrapped(() => this.ReadUint32()) }
  public ReadWrappedUint64(): number { return this.readWrapped(() => this.ReadUint64()) }

  public SetError(err: $.GoError): void {
    this.root.err = err
  }

  public SetErrorf(format: string, ...args: unknown[]): void {
    this.SetError($.newError(formatError(format, args)))
  }

  public Skip(): void {}

  public SkipAndAppendBytes(p: $.Slice<number>): $.Slice<number> {
    const encoded = new TextEncoder().encode(JSON.stringify(this.value))
    return $.append(p, encoded)
  }

  public SkipAndReturnBytes(): $.Slice<number> {
    return stringToBytes(JSON.stringify(this.value))
  }

  public Sub(data: $.Slice<number>): UnmarshalState | null {
    return NewUnmarshalState(data, this.configValue)
  }

  public WhatIsNext(): number {
    if (this.value === null) {
      return 0
    }
    if (Array.isArray(this.value)) {
      return 1
    }
    if (typeof this.value === 'object') {
      return 2
    }
    if (typeof this.value === 'string') {
      return 3
    }
    if (typeof this.value === 'number') {
      return 4
    }
    if (typeof this.value === 'boolean') {
      return 5
    }
    return 0
  }

  public WithField(_field: string, _mask: boolean = true): UnmarshalState | null {
    return new UnmarshalState({
      config: this.configValue,
      value: this.value,
      root: this.root,
      fieldMaskPaths: _mask ? this.fieldMaskPaths : new Set<string>(),
      path: [...this.path, _field],
    })
  }

  private readArrayValues<T>(read: () => T): $.Slice<T> {
    const values: T[] = []
    this.ReadArray(() => {
      values.push(read())
    })
    return $.arrayToSlice(values)
  }

  private readMapKeys(cb: (key: string) => void): void {
    const record = recordValue(this.value)
    if (record == null) {
      this.SetErrorf('expected JSON object')
      return
    }
    const original = this.value
    for (const key of Object.keys(record)) {
      this.value = record[key]
      cb(key)
      if (this.Err() != null) {
        break
      }
    }
    this.value = original
  }

  private readWrapped<T>(read: () => T): T {
    const record = recordValue(this.value)
    if (record == null) {
      return read()
    }
    if (!Object.hasOwn(record, 'value')) {
      this.SetErrorf('first field in wrapped value is not value')
      return read()
    }
    const keys = Object.keys(record)
    if (keys.length !== 1) {
      this.SetErrorf('unexpected %q field in wrapped value', keys.find((key) => key !== 'value') ?? '')
      return read()
    }
    const original = this.value
    this.value = record.value
    const value = read()
    this.value = original
    return value
  }
}

export function NewJsonStream(wr: unknown): JsonStream | null {
  return new JsonStream(wr)
}

export function NewMarshalState(config: MarshalerConfig, stream: JsonStream | null): MarshalState | null {
  return new MarshalState({ config, stream: stream ?? new JsonStream() })
}

export function NewUnmarshalState(data: $.Slice<number>, config: UnmarshalerConfig): UnmarshalState | null {
  try {
    return new UnmarshalState({ config, value: JSON.parse(bytesToString(data)) })
  } catch (err) {
    const state = new UnmarshalState({ config })
    state.SetError($.newError(err instanceof Error ? err.message : String(err)))
    return state
  }
}

export function Marshal(c: MarshalerConfig, m: Marshaler | null): [$.Slice<number>, $.GoError] {
  return c.Marshal(m)
}

export function MarshalMap<M extends Map<string, Marshaler> | Record<string, Marshaler>>(
  _typeArgs: $.GenericTypeArgs | undefined,
  c: MarshalerConfig,
  mm: M,
): [$.Slice<number>, $.GoError] {
  const stream = new JsonStream()
  const state = new MarshalState({ config: c, stream })
  state.WriteObjectStart()
  const keys = mm instanceof Map ? Array.from(mm.keys()) : Object.keys(mm)
  keys.sort()
  keys.forEach((key, idx) => {
    if (idx !== 0) {
      state.WriteMore()
    }
    state.WriteObjectField(key)
    const value = mm instanceof Map ? mm.get(key) : mm[key]
    value?.MarshalProtoJSON(state)
  })
  state.WriteObjectEnd()
  return state.Err() == null ? [stringToBytes(stream.String()), null] : [null, state.Err()]
}

export function MarshalSlice<S extends $.Slice<Marshaler>>(
  _typeArgs: $.GenericTypeArgs | undefined,
  c: MarshalerConfig,
  ms: S,
): [$.Slice<number>, $.GoError] {
  const stream = new JsonStream()
  const state = new MarshalState({ config: c, stream })
  state.WriteArrayStart()
  sliceValues(ms).forEach((value, idx) => {
    if (idx !== 0) {
      state.WriteMore()
    }
    value?.MarshalProtoJSON(state)
  })
  state.WriteArrayEnd()
  return state.Err() == null ? [stringToBytes(stream.String()), null] : [null, state.Err()]
}

export function GetEnumString(x: number, ...valueMaps: Array<Map<number, string> | Record<number, string> | null>): string {
  return enumStringValue(x, valueMaps) ?? String(x)
}

export function ParseEnumString(v: string, ...valueMaps: Array<Map<string, number> | Record<string, number> | null>): [number, $.GoError] {
  for (const valueMap of valueMaps) {
    const value = lookupStringMap(valueMap, v)
    if (value !== undefined) {
      return [value, null]
    }
  }
  const parsed = Number(v)
  return Number.isFinite(parsed) ? [parsed, null] : [0, $.newError(`invalid enum ${v}`)]
}

function sliceValues<T>(values: $.Slice<T> | readonly T[] | null | undefined): T[] {
  return Array.from((values ?? []) as Iterable<T>)
}

function bytesToString(bytes: $.Slice<number>): string {
  return new TextDecoder().decode(new Uint8Array(sliceValues(bytes)))
}

function stringToBytes(value: string): $.Slice<number> {
  return $.arrayToSlice(Array.from(new TextEncoder().encode(value)))
}

function recordValue(value: unknown): JSONRecord | null {
  if (value == null || Array.isArray(value) || typeof value !== 'object') {
    return null
  }
  return value as JSONRecord
}

function numberFromJSON(value: unknown): number {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    switch (value) {
      case 'NaN':
        return NaN
      case 'Infinity':
        return Infinity
      case '-Infinity':
        return -Infinity
      default:
        return Number(value) || 0
    }
  }
  return 0
}

function parseBoolMapKey(key: string): boolean | null {
  switch (key) {
    case 'true':
      return true
    case 'false':
      return false
    default:
      return null
  }
}

function parseSignedMapKey(key: string, bits: 32 | 64): number | null {
  if (!/^-?(0|[1-9]\d*)$/.test(key)) {
    return null
  }
  const parsed = Number(key)
  if (!Number.isSafeInteger(parsed)) {
    return null
  }
  if (bits === 32 && (parsed < -2147483648 || parsed > 2147483647)) {
    return null
  }
  return parsed
}

function parseUnsignedMapKey(key: string, bits: 32 | 64): number | null {
  if (!/^(0|[1-9]\d*)$/.test(key)) {
    return null
  }
  const parsed = Number(key)
  if (!Number.isSafeInteger(parsed)) {
    return null
  }
  if (bits === 32 && parsed > 4294967295) {
    return null
  }
  return parsed
}

function enumStringValue(
  x: number,
  valueMaps: Array<Map<number, string> | Record<number, string> | null>,
): string | null {
  for (const valueMap of valueMaps) {
    if (valueMap == null) {
      continue
    }
    const value = valueMap instanceof Map ? valueMap.get(x) : valueMap[x]
    if (value !== undefined) {
      return value
    }
  }
  return null
}

function lookupStringMap(valueMap: Map<string, number> | Record<string, number> | null, key: string): number | undefined {
  if (valueMap == null) {
    return undefined
  }
  return valueMap instanceof Map ? valueMap.get(key) : valueMap[key]
}

function formatError(format: string, args: unknown[]): string {
  return format.replace(/%[vqsd]/g, () => String(args.shift()))
}

const base64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

function base64Encode(bytes: $.Slice<number>): string {
  const data = sliceValues(bytes)
  let out = ''
  for (let idx = 0; idx < data.length; idx += 3) {
    const a = data[idx] ?? 0
    const b = data[idx + 1] ?? 0
    const c = data[idx + 2] ?? 0
    const triple = (a << 16) | (b << 8) | c
    out += base64Alphabet[(triple >> 18) & 0x3f]
    out += base64Alphabet[(triple >> 12) & 0x3f]
    out += idx + 1 < data.length ? base64Alphabet[(triple >> 6) & 0x3f] : '='
    out += idx + 2 < data.length ? base64Alphabet[triple & 0x3f] : '='
  }
  return out
}

function base64Decode(value: string): $.Slice<number> {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  const bytes: number[] = []
  for (let idx = 0; idx < padded.length; idx += 4) {
    const chars = padded.slice(idx, idx + 4)
    const a = base64Alphabet.indexOf(chars[0])
    const b = base64Alphabet.indexOf(chars[1])
    const c = chars[2] === '=' ? 0 : base64Alphabet.indexOf(chars[2])
    const d = chars[3] === '=' ? 0 : base64Alphabet.indexOf(chars[3])
    const triple = (a << 18) | (b << 12) | (c << 6) | d
    bytes.push((triple >> 16) & 0xff)
    if (chars[2] !== '=') {
      bytes.push((triple >> 8) & 0xff)
    }
    if (chars[3] !== '=') {
      bytes.push(triple & 0xff)
    }
  }
  return $.arrayToSlice(bytes)
}

import * as $ from '../../../../builtin/index.js'

export interface FieldMask {
  GetPaths(): $.Slice<string>
}

export interface Marshaler {
  MarshalProtoJSON(s: MarshalState | null): void
}

export interface Unmarshaler {
  UnmarshalProtoJSON(s: UnmarshalState | null): void
}

export class JsonStream {
  private chunks: string[] = []
  private err: $.GoError = null

  constructor(_writer?: unknown) {}

  public Error(): $.GoError {
    return this.err
  }

  public Write(p: $.Slice<number>): [number, $.GoError] {
    this.chunks.push(String.fromCharCode(...Array.from(p ?? [])))
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
  public EnumsAsInts = false
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
    m?.MarshalProtoJSON(state)
    if (state.Err() != null) {
      return [null, state.Err()]
    }
    return [$.arrayToSlice(Array.from(new TextEncoder().encode(stream.String()))), null]
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

  public Unmarshal(_data: $.Slice<number>, m: Unmarshaler | null): $.GoError {
    const state = new UnmarshalState({ config: this })
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
    return this.err
  }

  public HasField(field: string): boolean {
    return this.fields.has(field)
  }

  public SetError(err: $.GoError): void {
    this.err = err
  }

  public SetErrorf(format: string, ...args: unknown[]): void {
    this.err = $.newError(format.replace(/%[vqsd]/g, () => String(args.shift())))
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
    this.WriteString(String.fromCharCode(...Array.from(v ?? [])))
  }

  public WriteBytesArray(vs: $.Slice<$.Slice<number>>): void {
    this.writeArray(vs, (v) => this.WriteBytes(v))
  }

  public WriteDuration(x: number): void {
    this.WriteString(String(x))
  }

  public WriteEnum(x: number, ...valueMaps: Array<Map<number, string> | Record<number, string> | null>): void {
    if (this.configValue.EnumsAsInts) {
      this.WriteEnumNumber(x)
    } else {
      this.WriteEnumString(x, ...valueMaps)
    }
  }

  public WriteEnumNumber(x: number): void {
    this.WriteInt32(x)
  }

  public WriteEnumString(x: number, ...valueMaps: Array<Map<number, string> | Record<number, string> | null>): void {
    this.WriteString(GetEnumString(x, ...valueMaps))
  }

  public WriteFieldMask(x: FieldMask | null): void {
    this.WriteStringArray(x?.GetPaths() ?? null)
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
    this.WriteFloat64(v)
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
    } else if (typeof b !== 'boolean') {
      b.value = true
    }
  }

  public WriteNil(): void {
    this.stream.WriteNil()
  }

  public WriteObjectBoolField(field: boolean): void {
    this.WriteBool(field)
  }

  public WriteObjectEnd(): void {
    this.stream.WriteObjectEnd()
  }

  public WriteObjectField(field: string): void {
    this.stream.WriteObjectField(field)
  }

  public WriteObjectInt32Field(field: number): void {
    this.WriteInt32(field)
  }

  public WriteObjectInt64Field(field: number): void {
    this.WriteInt64(field)
  }

  public WriteObjectStart(): void {
    this.stream.WriteObjectStart()
  }

  public WriteObjectStringField(field: string): void {
    this.WriteString(field)
  }

  public WriteObjectUint32Field(field: number): void {
    this.WriteUint32(field)
  }

  public WriteObjectUint64Field(field: number): void {
    this.WriteUint64(field)
  }

  public WriteString(v: string): void {
    this.stream.WriteString(v)
  }

  public WriteStringArray(vs: $.Slice<string>): void {
    this.writeArray(vs, (v) => this.WriteString(v))
  }

  public WriteTime(x: unknown): void {
    this.WriteString(String(x))
  }

  public WriteUint32(v: number): void {
    this.stream.WriteUint32(v)
  }

  public WriteUint32Array(vs: $.Slice<number>): void {
    this.writeArray(vs, (v) => this.WriteUint32(v))
  }

  public WriteUint64(v: number): void {
    this.WriteFloat64(v)
  }

  public WriteUint64Array(vs: $.Slice<number>): void {
    this.writeArray(vs, (v) => this.WriteUint64(v))
  }

  private writeArray<T>(values: $.Slice<T>, writeValue: (value: T) => void): void {
    this.WriteArrayStart()
    let wrote = false
    for (const value of Array.from((values ?? []) as unknown as Iterable<T>)) {
      this.WriteMoreIf($.varRef(wrote))
      wrote = true
      writeValue(value)
    }
    this.WriteArrayEnd()
  }
}

export class UnmarshalState {
  private configValue: UnmarshalerConfig
  private err: $.GoError = null

  constructor(init?: Partial<{ config: UnmarshalerConfig }>) {
    this.configValue = init?.config?.clone() ?? DefaultUnmarshalerConfig.clone()
  }

  public AddField(_field: string): void {}

  public AnyTypeResolver(): unknown {
    return this.configValue.AnyTypeResolver
  }

  public Config(): UnmarshalerConfig {
    return this.configValue.clone()
  }

  public Err(): $.GoError {
    return this.err
  }

  public FieldMask(): FieldMask | null {
    return null
  }

  public ReadArray(_cb: (() => void) | null): void {}
  public ReadBool(): boolean { return false }
  public ReadBoolArray(): $.Slice<boolean> { return null }
  public ReadBoolMap(_cb: ((key: boolean) => void) | null): void {}
  public ReadBytes(): $.Slice<number> { return null }
  public ReadBytesArray(): $.Slice<$.Slice<number>> { return null }
  public ReadDuration(): $.VarRef<number> | null { return null }
  public ReadEnum(_valueMaps?: Map<string, number> | Record<string, number> | null): number { return 0 }
  public ReadFieldMask(): FieldMask | null { return null }
  public ReadFloat32(): number { return 0 }
  public ReadFloat32Array(): $.Slice<number> { return null }
  public ReadFloat64(): number { return 0 }
  public ReadFloat64Array(): $.Slice<number> { return null }
  public ReadInt32(): number { return 0 }
  public ReadInt32Array(): $.Slice<number> { return null }
  public ReadInt32Map(_cb: ((key: number) => void) | null): void {}
  public ReadInt64(): number { return 0 }
  public ReadInt64Array(): $.Slice<number> { return null }
  public ReadInt64Map(_cb: ((key: number) => void) | null): void {}
  public ReadNil(): boolean { return true }
  public ReadObject(_cb: ((key: string) => void) | null): void {}
  public ReadObjectField(): string { return '' }
  public ReadString(): string { return '' }
  public ReadStringArray(): $.Slice<string> { return null }
  public ReadStringMap(_cb: ((key: string) => void) | null): void {}
  public ReadTime(): $.VarRef<unknown> | null { return null }
  public ReadUint32(): number { return 0 }
  public ReadUint32Array(): $.Slice<number> { return null }
  public ReadUint32Map(_cb: ((key: number) => void) | null): void {}
  public ReadUint64(): number { return 0 }
  public ReadUint64Array(): $.Slice<number> { return null }
  public ReadUint64Map(_cb: ((key: number) => void) | null): void {}
  public ReadWrappedBool(): boolean { return false }
  public ReadWrappedBytes(): $.Slice<number> { return null }
  public ReadWrappedFloat32(): number { return 0 }
  public ReadWrappedFloat64(): number { return 0 }
  public ReadWrappedInt32(): number { return 0 }
  public ReadWrappedInt64(): number { return 0 }
  public ReadWrappedString(): string { return '' }
  public ReadWrappedUint32(): number { return 0 }
  public ReadWrappedUint64(): number { return 0 }

  public SetError(err: $.GoError): void {
    this.err = err
  }

  public SetErrorf(format: string, ...args: unknown[]): void {
    this.err = $.newError(format.replace(/%[vqsd]/g, () => String(args.shift())))
  }

  public Skip(): void {}

  public SkipAndAppendBytes(p: $.Slice<number>): $.Slice<number> {
    return p
  }

  public SkipAndReturnBytes(): $.Slice<number> {
    return null
  }

  public Sub(_data: $.Slice<number>): UnmarshalState | null {
    return new UnmarshalState({ config: this.configValue })
  }

  public WhatIsNext(): number {
    return 0
  }

  public WithField(_field: string, _mask: boolean = true): UnmarshalState | null {
    return new UnmarshalState({ config: this.configValue })
  }
}

export function NewJsonStream(wr: unknown): JsonStream | null {
  return new JsonStream(wr)
}

export function NewMarshalState(config: MarshalerConfig, stream: JsonStream | null): MarshalState | null {
  return new MarshalState({ config, stream: stream ?? new JsonStream() })
}

export function NewUnmarshalState(_data: $.Slice<number>, config: UnmarshalerConfig): UnmarshalState | null {
  return new UnmarshalState({ config })
}

export function Marshal(c: MarshalerConfig, m: Marshaler | null): [$.Slice<number>, $.GoError] {
  return c.Marshal(m)
}

export function MarshalMap<M extends Map<string, Marshaler> | Record<string, Marshaler>>(
  _typeArgs: $.GenericTypeArgs | undefined,
  c: MarshalerConfig,
  _mm: M,
): [$.Slice<number>, $.GoError] {
  return c.Marshal(null)
}

export function MarshalSlice<S extends $.Slice<Marshaler>>(
  _typeArgs: $.GenericTypeArgs | undefined,
  c: MarshalerConfig,
  _ms: S,
): [$.Slice<number>, $.GoError] {
  return c.Marshal(null)
}

export function GetEnumString(x: number, ...valueMaps: Array<Map<number, string> | Record<number, string> | null>): string {
  for (const valueMap of valueMaps) {
    if (valueMap == null) {
      continue
    }
    const value = valueMap instanceof Map ? valueMap.get(x) : valueMap[x]
    if (value !== undefined) {
      return value
    }
  }
  return String(x)
}

export function ParseEnumString(v: string, ...valueMaps: Array<Map<string, number> | Record<string, number> | null>): [number, $.GoError] {
  for (const valueMap of valueMaps) {
    if (valueMap == null) {
      continue
    }
    const value = valueMap instanceof Map ? valueMap.get(v) : valueMap[v]
    if (value !== undefined) {
      return [value, null]
    }
  }
  const parsed = Number(v)
  return Number.isFinite(parsed) ? [parsed, null] : [0, $.newError(`invalid enum ${v}`)]
}

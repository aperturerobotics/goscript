import * as $ from '@goscript/builtin/index.js'

export type Type = number

export const TypeUndefined: Type = 0
export const TypeNull: Type = 1
export const TypeBoolean: Type = 2
export const TypeNumber: Type = 3
export const TypeString: Type = 4
export const TypeSymbol: Type = 5
export const TypeObject: Type = 6
export const TypeFunction: Type = 7

export class Value {
  public _raw: unknown

  constructor(init?: Partial<{ raw: unknown }> | unknown) {
    if (isRawInit(init)) {
      this._raw = init.raw
      return
    }
    this._raw = init
  }

  public clone(): Value {
    return new Value({ raw: this._raw })
  }

  public Equal(w: Value): boolean {
    return this._raw === w._raw && !Number.isNaN(this._raw)
  }

  public IsUndefined(): boolean {
    return this._raw === undefined
  }

  public IsNull(): boolean {
    return this._raw === null
  }

  public IsNaN(): boolean {
    return typeof this._raw === 'number' && Number.isNaN(this._raw)
  }

  public Type(): Type {
    if (this._raw === undefined) {
      return TypeUndefined
    }
    if (this._raw === null) {
      return TypeNull
    }
    switch (typeof this._raw) {
      case 'boolean':
        return TypeBoolean
      case 'number':
        return TypeNumber
      case 'string':
        return TypeString
      case 'symbol':
        return TypeSymbol
      case 'function':
        return TypeFunction
      case 'object':
        return TypeObject
      default:
        $.panic('bad type')
    }
  }

  public Get(p: string): Value {
    this.requireObject('Value.Get')
    return new Value({ raw: Reflect.get(this._raw as object, p) })
  }

  public Set(p: string, x: unknown): void {
    this.requireObject('Value.Set')
    Reflect.set(this._raw as object, p, ValueOf(x)._raw)
  }

  public Delete(p: string): void {
    this.requireObject('Value.Delete')
    Reflect.deleteProperty(this._raw as object, p)
  }

  public Index(i: number): Value {
    this.requireObject('Value.Index')
    return new Value({ raw: Reflect.get(this._raw as object, i) })
  }

  public SetIndex(i: number, x: unknown): void {
    this.requireObject('Value.SetIndex')
    Reflect.set(this._raw as object, i, ValueOf(x)._raw)
  }

  public Length(): number {
    this.requireObject('Value.SetIndex')
    return Number(Reflect.get(this._raw as object, 'length') ?? 0)
  }

  public Call(m: string, ...args: unknown[]): Value {
    this.requireObject('Value.Call')
    const fn = Reflect.get(this._raw as object, m)
    if (typeof fn !== 'function') {
      $.panic(
        `syscall/js: Value.Call: property ${m} is not a function, got ${Type_String(ValueOf(fn).Type())}`,
      )
    }
    return new Value({
      raw: fn.apply(
        this._raw,
        args.map((arg) => ValueOf(arg)._raw),
      ),
    })
  }

  public Invoke(...args: unknown[]): Value {
    if (typeof this._raw !== 'function') {
      $.panic(new ValueError({ Method: 'Value.Invoke', Type: this.Type() }))
    }
    return new Value({
      raw: this._raw(...args.map((arg) => ValueOf(arg)._raw)),
    })
  }

  public New(...args: unknown[]): Value {
    if (typeof this._raw !== 'function') {
      $.panic(new ValueError({ Method: 'Value.Invoke', Type: this.Type() }))
    }
    return new Value({
      raw: Reflect.construct(
        this._raw,
        args.map((arg) => ValueOf(arg)._raw),
      ),
    })
  }

  public InstanceOf(t: Value): boolean {
    if (typeof t._raw !== 'function') {
      return false
    }
    return this._raw instanceof t._raw
  }

  public Float(): number {
    return this.number('Value.Float')
  }

  public Int(): number {
    return Math.trunc(this.number('Value.Int'))
  }

  public Bool(): boolean {
    if (typeof this._raw !== 'boolean') {
      $.panic(new ValueError({ Method: 'Value.Bool', Type: this.Type() }))
    }
    return this._raw
  }

  public Truthy(): boolean {
    return !!this._raw
  }

  public String(): string {
    switch (this.Type()) {
      case TypeString:
        return this._raw as string
      case TypeUndefined:
        return '<undefined>'
      case TypeNull:
        return '<null>'
      case TypeBoolean:
      case TypeNumber:
        return `<${Type_String(this.Type())}: ${String(this._raw)}>`
      case TypeSymbol:
        return '<symbol>'
      case TypeObject:
        return '<object>'
      case TypeFunction:
        return '<function>'
      default:
        $.panic('bad type')
    }
  }

  private requireObject(method: string): void {
    if (!Type_isObject(this.Type())) {
      $.panic(new ValueError({ Method: method, Type: this.Type() }))
    }
  }

  private number(method: string): number {
    if (typeof this._raw !== 'number') {
      $.panic(new ValueError({ Method: method, Type: this.Type() }))
    }
    return this._raw
  }
}

export class Error {
  public Value: Value

  constructor(init?: Partial<Error>) {
    this.Value = init?.Value?.clone() ?? Undefined()
  }

  public clone(): Error {
    return new Error({ Value: this.Value })
  }

  public Error(): string {
    return `JavaScript error: ${this.Value.Get('message').String()}`
  }
}

export class ValueError {
  public Method: string
  public Type: Type

  constructor(init?: Partial<ValueError>) {
    this.Method = init?.Method ?? ''
    this.Type = init?.Type ?? TypeUndefined
  }

  public clone(): ValueError {
    return new ValueError({ Method: this.Method, Type: this.Type })
  }

  public Error(): string {
    return `syscall/js: call of ${this.Method} on ${Type_String(this.Type)}`
  }
}

export class Func {
  public Value: Value
  private _released = false

  constructor(
    init?: Partial<Func> & {
      fn?: (this$: Value, args: $.Slice<Value>) => unknown
    },
  ) {
    const fn = init?.fn
    this.Value =
      init?.Value?.clone() ??
      new Value({
        raw: function (this: unknown, ...args: unknown[]) {
          if (fn === undefined) {
            return undefined
          }
          return ValueOf(
            fn(
              new Value({ raw: this }),
              args.map((arg) => new Value({ raw: arg })) as $.Slice<Value>,
            ),
          )._raw
        },
      })
  }

  public clone(): Func {
    return new Func({ Value: this.Value })
  }

  public Release(): void {
    this._released = true
  }

  public Equal(w: Value): boolean {
    return this.Value.Equal(w)
  }

  public IsUndefined(): boolean {
    return this.Value.IsUndefined()
  }

  public IsNull(): boolean {
    return this.Value.IsNull()
  }

  public IsNaN(): boolean {
    return this.Value.IsNaN()
  }

  public Type(): Type {
    return this.Value.Type()
  }

  public Get(p: string): Value {
    return this.Value.Get(p)
  }

  public Set(p: string, x: unknown): void {
    this.Value.Set(p, x)
  }

  public Delete(p: string): void {
    this.Value.Delete(p)
  }

  public Index(i: number): Value {
    return this.Value.Index(i)
  }

  public SetIndex(i: number, x: unknown): void {
    this.Value.SetIndex(i, x)
  }

  public Length(): number {
    return this.Value.Length()
  }

  public Call(m: string, ...args: unknown[]): Value {
    return this.Value.Call(m, ...args)
  }

  public Invoke(...args: unknown[]): Value {
    return this.Value.Invoke(...args)
  }

  public New(...args: unknown[]): Value {
    return this.Value.New(...args)
  }

  public InstanceOf(t: Value): boolean {
    return this.Value.InstanceOf(t)
  }

  public Float(): number {
    return this.Value.Float()
  }

  public Int(): number {
    return this.Value.Int()
  }

  public Bool(): boolean {
    return this.Value.Bool()
  }

  public Truthy(): boolean {
    return this.Value.Truthy()
  }

  public String(): string {
    return this.Value.String()
  }
}

export function Undefined(): Value {
  return new Value({ raw: undefined })
}

export function Null(): Value {
  return new Value({ raw: null })
}

export function Global(): Value {
  return new Value({ raw: globalThis })
}

export function ValueOf(x: unknown): Value {
  if (x instanceof Value) {
    return x.clone()
  }
  if (x instanceof Func) {
    return x.Value.clone()
  }
  if (isGoInterfaceValue(x)) {
    return ValueOf(x.__goValue)
  }
  if (x === null || x === undefined) {
    return Null()
  }
  if (
    typeof x === 'boolean' ||
    typeof x === 'number' ||
    typeof x === 'string'
  ) {
    return new Value({ raw: x })
  }
  if (typeof x === 'bigint') {
    return new Value({ raw: Number(x) })
  }
  if (x instanceof Uint8Array) {
    return new Value({ raw: x })
  }
  if (Array.isArray(x)) {
    return new Value({ raw: x.map((item) => ValueOf(item)._raw) })
  }
  if (x instanceof Map) {
    const out: Record<string, unknown> = {}
    for (const [key, value] of x.entries()) {
      out[String(key)] = ValueOf(value)._raw
    }
    return new Value({ raw: out })
  }
  return new Value({ raw: x })
}

function isGoInterfaceValue(value: unknown): value is { __goValue: unknown } {
  return (
    value !== null &&
    typeof value === 'object' &&
    '__goValue' in value &&
    typeof (value as { __goType?: unknown }).__goType === 'string'
  )
}

export function FuncOf(
  fn: (this$: Value, args: $.Slice<Value>) => unknown,
): Func {
  return new Func({ fn })
}

export function Type_String(t: Type): string {
  switch (t) {
    case TypeUndefined:
      return 'undefined'
    case TypeNull:
      return 'null'
    case TypeBoolean:
      return 'boolean'
    case TypeNumber:
      return 'number'
    case TypeString:
      return 'string'
    case TypeSymbol:
      return 'symbol'
    case TypeObject:
      return 'object'
    case TypeFunction:
      return 'function'
    default:
      $.panic('bad type')
  }
}

export function Type_isObject(t: Type): boolean {
  return t === TypeObject || t === TypeFunction
}

export function CopyBytesToGo(dst: $.Bytes | null, src: Value): number {
  const bytes = sourceBytes(src)
  const n = Math.min($.len(dst), bytes.length)
  if (dst instanceof Uint8Array) {
    dst.set(bytes.subarray(0, n), 0)
    return n
  }
  const arr = $.asArray(dst)
  for (let i = 0; i < n; i++) {
    arr[i] = bytes[i]
  }
  return n
}

export function CopyBytesToJS(dst: Value, src: $.Bytes | null): number {
  const target = dstRawBytes(dst)
  const bytes =
    src instanceof Uint8Array ? src : Uint8Array.from($.asArray(src))
  const n = Math.min(target.length, bytes.length)
  target.set(bytes.subarray(0, n), 0)
  return n
}

function sourceBytes(src: Value): Uint8Array {
  const raw = srcRaw(src)
  if (raw instanceof Uint8Array || raw instanceof Uint8ClampedArray) {
    return raw instanceof Uint8Array ? raw : (
        new Uint8Array(raw.buffer, raw.byteOffset, raw.byteLength)
      )
  }
  $.panic(
    'syscall/js: CopyBytesToGo: expected src to be a Uint8Array or Uint8ClampedArray',
  )
}

function dstRawBytes(dst: Value): Uint8Array | Uint8ClampedArray {
  const raw = srcRaw(dst)
  if (raw instanceof Uint8Array || raw instanceof Uint8ClampedArray) {
    return raw
  }
  $.panic(
    'syscall/js: CopyBytesToJS: expected dst to be a Uint8Array or Uint8ClampedArray',
  )
}

function srcRaw(value: Value): unknown {
  return (value as unknown as { _raw: unknown })._raw
}

function isRawInit(value: unknown): value is { raw: unknown } {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.prototype.hasOwnProperty.call(value, 'raw')
  )
}

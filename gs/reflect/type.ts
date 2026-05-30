import {
  Method,
  ReflectValue,
  StructField,
  StructTag,
  ValueError,
} from './types.js'
export { StructField }
import { MapIter } from './map.js'
import {
  getTypeByName as builtinGetTypeByName,
  isStructTypeInfo,
  isInterfaceTypeInfo,
  structFieldRuntimeKey,
} from '../builtin/type.js'
import { Zero } from './value.js'
import { DeepEqual } from './deepequal.js'
import * as $ from '../builtin/index.js'

// rtype is the common implementation of most values
export class rtype {
  constructor(public kind: Kind) {}

  Kind(): Kind {
    return this.kind
  }

  String(): string {
    return Kind_String(this.kind)
  }

  Pointers(): boolean {
    const k = this.kind
    return k === Ptr || k === Map || k === Slice || k === Interface
  }
}

// funcType represents a function type
export class funcType extends rtype {
  constructor(
    kind: Kind,
    public inCount: number = 0,
    public outCount: number = 0,
  ) {
    super(kind)
  }
}

// flag type for internal use
export class flag {
  constructor(private _value: number | Kind) {
    if (typeof _value === 'number') {
      this._value = _value
    } else {
      this._value = _value
    }
  }

  valueOf(): number {
    return typeof this._value === 'number' ? this._value : this._value
  }

  static from(value: number | Kind): flag {
    return new flag(value)
  }
}

// bitVector class for tracking pointers
export class bitVector {
  private bits: number[] = []

  Set(index: number): void {
    const wordIndex = Math.floor(index / 32)
    const bitIndex = index % 32
    while (this.bits.length <= wordIndex) {
      this.bits.push(0)
    }
    this.bits[wordIndex] |= 1 << bitIndex
  }

  Get(index: number): boolean {
    const wordIndex = Math.floor(index / 32)
    const bitIndex = index % 32
    if (wordIndex >= this.bits.length) {
      return false
    }
    return (this.bits[wordIndex] & (1 << bitIndex)) !== 0
  }
}

// Kind represents the specific kind of type that a Type represents.
export type Kind = number

// Kind_String returns the string representation of a Kind (wrapper function naming)
export function Kind_String(k: Kind): string {
  const kindNames = [
    'invalid',
    'bool',
    'int',
    'int8',
    'int16',
    'int32',
    'int64',
    'uint',
    'uint8',
    'uint16',
    'uint32',
    'uint64',
    'uintptr',
    'float32',
    'float64',
    'complex64',
    'complex128',
    'array',
    'chan',
    'func',
    'interface',
    'map',
    'ptr',
    'slice',
    'string',
    'struct',
    'unsafe.Pointer',
  ]
  if (k >= 0 && k < kindNames.length) {
    return kindNames[k]
  }
  return 'invalid'
}

// Channel direction constants and type
export type ChanDir = number

export const RecvDir: ChanDir = 1
export const SendDir: ChanDir = 2
export const BothDir: ChanDir = 3

export function ChanDir_String(d: ChanDir): string {
  switch (d) {
    case RecvDir:
      return 'RecvDir'
    case SendDir:
      return 'SendDir'
    case BothDir:
      return 'BothDir'
    default:
      return 'ChanDir(' + d + ')'
  }
}

// Kind constants
export const Invalid: Kind = 0
export const Bool: Kind = 1
export const Int: Kind = 2
export const Int8: Kind = 3
export const Int16: Kind = 4
export const Int32: Kind = 5
export const Int64: Kind = 6
export const Uint: Kind = 7
export const Uint8: Kind = 8
export const Uint16: Kind = 9
export const Uint32: Kind = 10
export const Uint64: Kind = 11
export const Uintptr: Kind = 12
export const Float32: Kind = 13
export const Float64: Kind = 14
export const Complex64: Kind = 15
export const Complex128: Kind = 16
export const Array: Kind = 17
export const Chan: Kind = 18
export const Func: Kind = 19
export const Interface: Kind = 20
export const Map: Kind = 21
export const Ptr: Kind = 22
export const Pointer: Kind = Ptr
export const Slice: Kind = 23
export const String: Kind = 24
export const Struct: Kind = 25
export const UnsafePointer: Kind = 26

const pointerAddressStride = 0x100000000
const pointerAddresses = new WeakMap<object, number>()
const fieldPointerAddresses = new WeakMap<
  object,
  globalThis.Map<string, number>
>()
let nextPointerAddress = 1
const canonicalTypes = new globalThis.Map<string, Type>()

function pointerAddress(value: object): number {
  let address = pointerAddresses.get(value)
  if (address === undefined) {
    address = nextPointerAddress * pointerAddressStride
    nextPointerAddress++
    pointerAddresses.set(value, address)
  }
  return address
}

function fieldPointerAddress(target: object, key: string): number {
  let addresses = fieldPointerAddresses.get(target)
  if (addresses === undefined) {
    addresses = new globalThis.Map<string, number>()
    fieldPointerAddresses.set(target, addresses)
  }
  let address = addresses.get(key)
  if (address === undefined) {
    address = nextPointerAddress * pointerAddressStride
    nextPointerAddress++
    addresses.set(key, address)
  }
  return address
}

function internType(t: Type): Type {
  const key = typeIdentityKey(t)
  const existing = canonicalTypes.get(key)
  if (existing) {
    return existing
  }
  canonicalTypes.set(key, t)
  return t
}

function typeIdentityKey(t: Type, seen = new Set<Type>()): string {
  if (seen.has(t)) {
    return `${t.Kind()}:${t.PkgPath()}:${t.Name()}:${t.String()}`
  }
  seen.add(t)
  if (t instanceof StructType) {
    return t.identityKey(seen)
  }
  switch (t.Kind()) {
    case Array:
      return `${t.Kind()}:${t.Len()}:${typeIdentityKey(t.Elem(), seen)}`
    case Chan:
    case Ptr:
    case Slice:
      return `${t.Kind()}:${t.String()}:${typeIdentityKey(t.Elem(), seen)}`
    case Map:
      return `${t.Kind()}:${typeIdentityKey(t.Key(), seen)}:${typeIdentityKey(t.Elem(), seen)}`
    case Func: {
      const params = globalThis.Array.from(
        { length: t.NumIn() },
        (_unused, idx) => typeIdentityKey(t.In(idx), seen),
      )
      const results = globalThis.Array.from(
        { length: t.NumOut() },
        (_unused, idx) => typeIdentityKey(t.Out(idx), seen),
      )
      return `${t.Kind()}:${t.PkgPath()}:${t.Name()}:${t.String()}:${t.IsVariadic()}:${params.join(',')}:${results.join(',')}`
    }
    default:
      return `${t.Kind()}:${t.PkgPath()}:${t.Name()}:${t.String()}`
  }
}

// Type is the representation of a Go type.
export interface Type {
  // String returns a string representation of the type.
  String(): string

  // Kind returns the specific kind of this type.
  Kind(): Kind

  // Size returns the number of bytes needed to store a value of the given type.
  Size(): number

  // Elem returns a type's element type.
  // Panics if the type's Kind is not Array, Chan, Map, Pointer, or Slice.
  Elem(): Type

  // NumField returns a struct type's field count.
  NumField(): number

  // NumIn returns a function type's input count.
  // Panics if the type's Kind is not Func.
  NumIn(): number

  // In returns a function type's i'th input type.
  // Panics if the type's Kind is not Func or i is out of range.
  In(i: number): Type

  // NumOut returns a function type's output count.
  // Panics if the type's Kind is not Func.
  NumOut(): number

  // Out returns a function type's i'th output type.
  // Panics if the type's Kind is not Func or i is out of range.
  Out(i: number): Type

  // IsVariadic reports whether a function type's final input is variadic.
  // Panics if the type's Kind is not Func.
  IsVariadic(): boolean

  // PkgPath returns the package path for named types, empty for unnamed types.
  PkgPath(): string

  // Field returns a struct type's i'th field.
  // Panics if the type's Kind is not Struct or i is out of range.
  Field(i: number): StructField

  // FieldByName returns the struct field with the given name.
  FieldByName(name: string): [StructField, boolean]

  // FieldByNameFunc returns the first struct field whose name satisfies match.
  FieldByNameFunc(match: (name: string) => boolean): [StructField, boolean]

  // Key returns a map type's key type.
  // Panics if the type's Kind is not Map.
  Key(): Type

  // Name returns the type's name within its package.
  Name(): string

  // Implements reports whether the type implements the interface type u.
  Implements(u: Type | null): boolean

  // AssignableTo reports whether a value of this type is assignable to u.
  AssignableTo(u: Type | null): boolean

  // common returns the common type implementation.
  common?(): rtype

  // OverflowInt reports whether the int64 x cannot be represented by the type
  // Panics if the type's Kind is not Int, Int8, Int16, Int32, or Int64.
  OverflowInt(x: number): boolean

  // OverflowUint reports whether the uint64 x cannot be represented by the type
  // Panics if the type's Kind is not Uint, Uint8, Uint16, Uint32, Uint64, or Uintptr.
  OverflowUint(x: number): boolean

  // OverflowFloat reports whether the float64 x cannot be represented by the type
  // Panics if the type's Kind is not Float32 or Float64.
  OverflowFloat(x: number): boolean

  // NumMethod returns the number of methods in the type's method set
  NumMethod(): number

  // MethodByName returns the method with that name in the type's method set.
  MethodByName(name: string): [Method, boolean]

  // Len returns an array type's length.
  // Panics if the type's Kind is not Array.
  Len(): number

  // Bits returns the size of the type in bits
  // Panics if the type's Kind is not a sized type.
  Bits(): number

  // Comparable reports whether values of this type are comparable.
  Comparable(): boolean
}

function nonFunctionTypePanic(method: string, t: Type): never {
  throw new Error(`reflect: ${method} of non-func type ${t.String()}`)
}

// InvalidTypeInstance is a singleton type for invalid/zero reflect.Value
class InvalidTypeClass implements Type {
  Kind(): Kind {
    return Invalid
  }
  Comparable(): boolean {
    return false
  }
  String(): string {
    return '<invalid reflect.Value>'
  }
  Name(): string {
    return ''
  }
  PkgPath(): string {
    return ''
  }
  Size(): number {
    return 0
  }
  Elem(): Type {
    throw new Error('reflect: Elem of invalid type')
  }
  Key(): Type {
    throw new Error('reflect: Key of invalid type')
  }
  NumField(): number {
    return 0
  }
  NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }
  In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }
  NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }
  Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }
  IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }
  Field(_i: number): StructField {
    throw new Error('reflect: Field of invalid type')
  }
  FieldByName(_name: string): [StructField, boolean] {
    return [new StructField(), false]
  }
  FieldByNameFunc(_match: (name: string) => boolean): [StructField, boolean] {
    return [new StructField(), false]
  }
  Implements(_u: Type | null): boolean {
    return false
  }
  AssignableTo(_u: Type | null): boolean {
    return false
  }
  OverflowInt(_x: number): boolean {
    throw new Error('reflect: OverflowInt of invalid type')
  }
  OverflowUint(_x: number): boolean {
    throw new Error('reflect: OverflowUint of invalid type')
  }
  OverflowFloat(_x: number): boolean {
    throw new Error('reflect: OverflowFloat of invalid type')
  }
  NumMethod(): number {
    return 0
  }
  MethodByName(_name: string): [Method, boolean] {
    return [zeroMethod(), false]
  }
  Len(): number {
    throw new Error('reflect: Len of invalid type')
  }
  Bits(): number {
    throw new Error('reflect: Bits of invalid type')
  }
}
const invalidTypeInstance = new InvalidTypeClass()

// Value is the reflection interface to a Go value - consolidated from all implementations
export class Value {
  private _value: ReflectValue
  private _type: Type
  // _parentVarRef tracks the VarRef this value was dereferenced from (for Set support)
  private _parentVarRef?: $.VarRef<ReflectValue>
  // _parentStruct and _fieldName track the parent struct and field name for struct field Set() support
  private _parentStruct?: Record<string, any>
  private _fieldName?: string

  constructor(
    value?: ReflectValue | Record<string, never>,
    type?: Type | null,
    parentVarRef?: $.VarRef<ReflectValue>,
    parentStruct?: Record<string, any>,
    fieldName?: string,
  ) {
    // Handle zero-value initialization: new Value({}) or new Value()
    // This corresponds to reflect.Value{} in Go which is an invalid/zero value
    if (
      type === undefined ||
      type === null ||
      (typeof value === 'object' &&
        value !== null &&
        Object.keys(value).length === 0 &&
        !(value instanceof globalThis.Array) &&
        !(value instanceof globalThis.Map))
    ) {
      this._value = null
      this._type = invalidTypeInstance
    } else {
      this._value = value as ReflectValue
      this._type = type
    }
    this._parentVarRef = parentVarRef
    this._parentStruct = parentStruct
    this._fieldName = fieldName
  }

  public clone(): Value {
    const cloned = new Value(
      this._value,
      this._type,
      this._parentVarRef,
      this._parentStruct,
      this._fieldName,
    )
    return cloned
  }

  // Methods required by godoc.txt and used throughout the codebase
  public Int(): number {
    const value = this.numericValue()
    if (value !== null && Number.isInteger(value)) {
      return value
    }
    throw new Error(
      'reflect: call of reflect.Value.Int on ' +
        Kind_String(this._type.Kind()) +
        ' Value',
    )
  }

  public Uint(): number {
    const value = this.numericValue()
    if (value !== null && value >= 0) {
      return value
    }
    throw new Error(
      'reflect: call of reflect.Value.Uint on ' +
        Kind_String(this._type.Kind()) +
        ' Value',
    )
  }

  public Float(): number {
    const value = this.numericValue()
    if (value !== null) {
      return value
    }
    throw new Error(
      'reflect: call of reflect.Value.Float on ' +
        Kind_String(this._type.Kind()) +
        ' Value',
    )
  }

  public Bool(): boolean {
    if (typeof this._value === 'boolean') {
      return this._value
    }
    throw new Error(
      'reflect: call of reflect.Value.Bool on ' +
        Kind_String(this._type.Kind()) +
        ' Value',
    )
  }

  private numericValue(): number | null {
    if (typeof this._value === 'number') {
      return this._value
    }
    if (
      this._value !== null &&
      typeof this._value === 'object' &&
      typeof (this._value as { valueOf?: unknown }).valueOf === 'function'
    ) {
      const value = (this._value as { valueOf(): unknown }).valueOf()
      if (typeof value === 'number') {
        return value
      }
    }
    return null
  }

  public String(): string {
    if (typeof this._value === 'string') {
      return this._value
    }
    // Special case for bool values - display as <bool Value>
    if (this._type.Kind() === Bool) {
      return '<bool Value>'
    }
    return this._type.String()
  }

  public Len(): number {
    if (this.Kind() === Slice || this.Kind() === Array) {
      return $.len(this._value as any)
    }

    // Check for slice objects created by $.arrayToSlice
    if (
      this._value &&
      typeof this._value === 'object' &&
      '__meta__' in this._value
    ) {
      const meta = (this._value as { __meta__?: { length?: number } }).__meta__
      if (meta && typeof meta.length === 'number') {
        return meta.length
      }
    }

    // Check for typed arrays
    if (
      this._value instanceof Uint8Array ||
      this._value instanceof Int8Array ||
      this._value instanceof Uint16Array ||
      this._value instanceof Int16Array ||
      this._value instanceof Uint32Array ||
      this._value instanceof Int32Array ||
      this._value instanceof Float32Array ||
      this._value instanceof Float64Array
    ) {
      return this._value.length
    }

    // Check for regular arrays
    if (globalThis.Array.isArray(this._value)) {
      return this._value.length
    }

    // Check for strings
    if (typeof this._value === 'string') {
      return this._value.length
    }

    throw new Error(
      'reflect: call of reflect.Value.Len on ' +
        Kind_String(this._type.Kind()) +
        ' Value',
    )
  }

  public Kind(): Kind {
    return this._type.Kind()
  }

  public Type(): Type {
    return this._type
  }

  public IsValid(): boolean {
    // In Go, a Value is valid if it was properly constructed (not the zero Value{}).
    // A valid Value can have a nil underlying value (e.g., nil map, nil pointer).
    // We check if the type is valid (not the invalid type sentinel).
    return this._type !== invalidTypeInstance
  }

  public IsNil(): boolean {
    return this._value === null || this._value === undefined
  }

  public Index(i: number): Value {
    if (this.Kind() === Slice || this.Kind() === Array) {
      const ref = $.indexRef(this._value as any, i) as $.VarRef<ReflectValue>
      return new Value(ref.value, this._type.Elem(), ref)
    }
    throw new Error(
      'reflect: call of reflect.Value.Index on ' +
        Kind_String(this._type.Kind()) +
        ' Value',
    )
  }

  public Slice(i: number, j: number): Value {
    const length = this.Len()
    if (i < 0 || j < i || j > length) {
      throw new Error(
        `reflect.Value.Slice: slice index out of bounds [${i}:${j}] with length ${length}`,
      )
    }
    if (
      this._value &&
      typeof this._value === 'object' &&
      '__meta__' in this._value
    ) {
      return new Value(
        $.goSlice(this._value as $.Slice<unknown>, i, j),
        this._type,
      )
    }
    if (globalThis.Array.isArray(this._value)) {
      return new Value(this._value.slice(i, j), this._type)
    }
    if (this._value instanceof Uint8Array) {
      return new Value(this._value.slice(i, j), this._type)
    }
    if (typeof this._value === 'string') {
      return new Value(this._value.slice(i, j), this._type)
    }
    throw new ValueError({ Kind: this.Kind(), Method: 'Slice' })
  }

  public Bytes(): Uint8Array {
    if (this._value instanceof Uint8Array) {
      return this._value
    }
    throw new Error(
      'reflect: call of reflect.Value.Bytes on ' +
        Kind_String(this._type.Kind()) +
        ' Value',
    )
  }

  public Elem(): Value {
    // For pointers, unwrap the VarRef and return the element, tracking the parent
    if (this._type.Kind() === Ptr && $.isVarRef(this._value)) {
      const varRef = this._value as $.VarRef<ReflectValue>
      const elemType = this._type.Elem()
      return new Value(varRef.value, elemType, varRef)
    }
    if (
      this._type.Kind() === Ptr &&
      this._value &&
      typeof this._value === 'object' &&
      '__goValue' in this._value &&
      $.isVarRef((this._value as { __goValue: unknown }).__goValue)
    ) {
      const varRef = (this._value as { __goValue: $.VarRef<ReflectValue> })
        .__goValue
      return new Value(varRef.value, this._type.Elem(), varRef)
    }
    // For interfaces, return the underlying value
    return new Value(this._value, this._type, this._parentVarRef)
  }

  public NumField(): number {
    return this._type.NumField()
  }

  public Field(i: number): Value {
    if (this.Kind() !== Struct) {
      throw new ValueError({ Kind: this.Kind(), Method: 'Field' })
    }

    const field = this.Type().Field(i)
    const fieldKey = structFieldStorageKey(this.Type(), i)
    if (!field) {
      throw new Error('reflect: struct field index out of range')
    }

    const parentObj = this._value as Record<string, any>
    let fieldVal = parentObj[fieldKey]
    if (fieldVal === undefined) {
      fieldVal = null
    }
    // Pass parent struct and field name so Set() can update the struct
    return new Value(fieldVal, field.Type, undefined, parentObj, fieldKey)
  }

  public FieldByIndex(index: $.Slice<number>): Value {
    let current: Value = this
    for (const fieldIndex of $.asArray(index)) {
      current = current.Field(fieldIndex)
    }
    return current
  }

  public FieldByName(name: string): Value {
    const [field, ok] = this.Type().FieldByName(name)
    if (!ok) {
      return new Value(null, invalidTypeInstance)
    }
    return this.FieldByIndex(field.Index)
  }

  // Additional methods needed by various parts of the codebase
  public UnsafePointer(): unknown {
    return this._value
  }

  public Pointer(): number {
    const kind = this.Kind()
    if (
      kind !== Chan &&
      kind !== Func &&
      kind !== Map &&
      kind !== Ptr &&
      kind !== Slice &&
      kind !== UnsafePointer
    ) {
      throw new ValueError({ Kind: kind, Method: 'Pointer' })
    }
    if (this._value === null || this._value === undefined) {
      return 0
    }
    if ($.isOwnedPointerHandle(this._value)) {
      return $.ownedPointerAddress(this._value)
    }
    if ($.isVarRef(this._value)) {
      const address = this._value.__goAddress?.()
      if (address !== undefined) {
        return address
      }
      return pointerAddress(this._value)
    }
    if (kind === Slice) {
      const slice = this._value as $.Slice<unknown> | Uint8Array
      try {
        if ($.len(slice) === 0) {
          return 0
        }
        return $.indexAddress(slice, 0)
      } catch {
        return 0
      }
    }
    if (typeof this._value === 'object' || typeof this._value === 'function') {
      return pointerAddress(this._value)
    }
    return 0
  }

  public UnsafeAddr(): number | $.OwnedPointerHandle<ReflectValue> {
    if (!this.CanAddr()) {
      throw new ValueError({ Kind: this.Kind(), Method: 'UnsafeAddr' })
    }
    if (this._parentStruct && this._fieldName) {
      const target = this._parentStruct
      const key = this._fieldName
      const ref = $.fieldRef(
        target,
        key as keyof typeof target,
      ) as $.VarRef<ReflectValue>
      return {
        __goOwnedPointer: true,
        __goAddress: () => fieldPointerAddress(target, key),
        __goRef: () => ref,
      }
    }
    if (this._parentVarRef?.__goPointer) {
      return this._parentVarRef
        .__goPointer as $.OwnedPointerHandle<ReflectValue>
    }
    return this.Pointer()
  }

  public pointer(): unknown {
    return this._value
  }

  public get ptr(): unknown {
    return this._value
  }

  // Internal method to access the underlying value
  public get value(): ReflectValue {
    return this._value
  }

  // Convert method needed by iter.ts
  public Convert(t: Type): Value {
    // Simple conversion - in a real implementation this would do type conversion
    return new Value(this._value, t)
  }

  public CanAddr(): boolean {
    return this.Kind() !== Ptr && this._value !== null // Simplified
  }

  public Addr(): Value {
    if (!this.CanAddr()) {
      throw new Error('reflect: call of reflect.Value.Addr on invalid Value')
    }
    const ptrType = PointerTo(this.Type())
    if (this._parentStruct && this._fieldName) {
      return new Value($.fieldRef(this._parentStruct, this._fieldName), ptrType)
    }
    if (this._parentVarRef) {
      return new Value(this._parentVarRef, ptrType)
    }
    return new Value($.varRef(this._value), ptrType)
  }

  public CanSet(): boolean {
    // Simplified: all valid values are settable in GoScript since we handle
    // pointer semantics through VarRef. This enables JSON unmarshaling to work.
    return this.IsValid()
  }

  public Set(x: Value): void {
    if (!this.CanSet()) {
      throw new Error('reflect: assign to invalid value')
    }
    const thisType = this.Type()
    const xType = x.Type()
    if (!xType.AssignableTo(thisType)) {
      throw new Error('reflect: assign to wrong type')
    }
    this._value = x.value
    // Also update the parent VarRef if we were dereferenced from one
    if (this._parentVarRef) {
      this._parentVarRef.value = x.value
    }
    // Also update the parent struct field if this is a struct field
    if (this._parentStruct && this._fieldName) {
      this._parentStruct[this._fieldName] = x.value
    }
  }

  // Additional methods from deleted reflect.gs.ts
  public Interface(): any {
    return this._value
  }

  public MethodByName(name: string): Value {
    if (!this.IsValid()) {
      return new Value()
    }
    const receiver = $.isVarRef(this._value) ? this._value.value : this._value
    if (
      receiver === null ||
      receiver === undefined ||
      (typeof receiver !== 'object' && typeof receiver !== 'function')
    ) {
      return new Value()
    }
    const method = (receiver as Record<string, unknown>)[name]
    if (typeof method !== 'function') {
      return new Value()
    }
    const [signature] = methodSignatureByName(this.Type(), name)
    const methodType =
      signature ?
        methodTypeFromSignature(signature, this.Type(), false)
      : new FunctionType('func')
    return new Value(method.bind(receiver), methodType)
  }

  public async Call(inArgs: $.Slice<Value>): Promise<$.Slice<Value>> {
    if (this.Kind() !== Func || typeof this._value !== 'function') {
      throw new ValueError({ Kind: this.Kind(), Method: 'Call' })
    }
    return await callReflectFunction(
      this._value as (...args: unknown[]) => unknown,
      this._type,
      inArgs,
      'Call',
    )
  }

  public async CallSlice(inArgs: $.Slice<Value>): Promise<$.Slice<Value>> {
    if (this.Kind() !== Func || typeof this._value !== 'function') {
      throw new ValueError({ Kind: this.Kind(), Method: 'CallSlice' })
    }
    return await callReflectFunction(
      this._value as (...args: unknown[]) => unknown,
      this._type,
      inArgs,
      'CallSlice',
    )
  }

  public IsZero(): boolean {
    const zeroVal = Zero(this.Type()).value
    return DeepEqual(this._value, zeroVal)
  }

  public typ(): rtype | null {
    return new rtype(this._type.Kind())
  }

  public get flag(): number {
    return 0
  }

  public MapRange(): MapIter<unknown, unknown> | null {
    if (this.Kind() !== Map) {
      throw new ValueError({ Kind: this.Kind(), Method: 'MapRange' })
    }
    if (this._value === null || this._value === undefined) {
      return new MapIter(new globalThis.Map())
    }
    if (!(this._value instanceof globalThis.Map)) {
      throw new ValueError({ Kind: this.Kind(), Method: 'MapRange' })
    }
    return new MapIter(this._value)
  }

  public MapIndex(key: Value): Value {
    if (this.Kind() !== Map) {
      throw new ValueError({ Kind: this.Kind(), Method: 'MapIndex' })
    }
    if (!(this._value instanceof globalThis.Map)) {
      return new Value(null, new BasicType(Invalid, 'invalid'))
    }
    const rawKey = key.Interface()
    if (!this._value.has(rawKey)) {
      return new Value(null, new BasicType(Invalid, 'invalid'))
    }
    return new Value(
      this._value.get(rawKey) as ReflectValue,
      this.Type().Elem(),
    )
  }

  public MapKeys(): $.Slice<Value> {
    if (this.Kind() !== Map) {
      throw new ValueError({ Kind: this.Kind(), Method: 'MapKeys' })
    }
    if (this._value === null || this._value === undefined) {
      return $.makeSlice<Value>(0)
    }
    if (!(this._value instanceof globalThis.Map)) {
      throw new ValueError({ Kind: this.Kind(), Method: 'MapKeys' })
    }
    const keyType = this.Type().Key()
    const keys: Value[] = []
    for (const key of this._value.keys()) {
      keys.push(new Value(key as ReflectValue, keyType))
    }
    return $.arrayToSlice(keys)
  }

  public Complex(): number | $.Complex | null {
    const k = this.Kind()
    if (k !== Complex64 && k !== Complex128) {
      throw new Error(
        'reflect: call of reflect.Value.Complex on ' +
          Kind_String(k) +
          ' Value',
      )
    }
    const value = this._parentVarRef ? this._parentVarRef.value : this._value
    return value as number | $.Complex | null
  }

  // Send sends a value to a channel
  public Send(x: Value): void {
    if (this._type.Kind() !== Chan) {
      throw new Error('reflect: send on non-chan type')
    }

    // Get the underlying channel
    const channel = this._value
    if (!channel || typeof channel !== 'object') {
      throw new Error('reflect: send on invalid channel')
    }

    // Extract the value to send
    const valueToSend = (x as unknown as { value: ReflectValue }).value

    // For synchronous operation, we'll use a simplified send
    // In the real implementation, this would need proper async handling
    const channelObj = channel as any
    if (typeof channelObj.send === 'function') {
      // For now, just store the value in a queue or buffer
      // This is a simplified implementation for testing
      if (!channelObj._sendQueue) {
        channelObj._sendQueue = []
      }
      channelObj._sendQueue.push(valueToSend)
    }
  }

  // SetString sets v's underlying value to x
  public SetString(x: string): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetString on unaddressable value',
      )
    }
    if (this.Kind() !== String) {
      throw new Error(
        'reflect: call of reflect.Value.SetString on ' + this.Kind() + ' Value',
      )
    }
    this._value = x
    if (this._parentVarRef) {
      this._parentVarRef.value = x
    }
    if (this._parentStruct && this._fieldName) {
      this._parentStruct[this._fieldName] = x
    }
  }

  // SetInt sets v's underlying value to x
  public SetInt(x: number): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetInt on unaddressable value',
      )
    }
    const k = this.Kind()
    if (k !== Int && k !== Int8 && k !== Int16 && k !== Int32 && k !== Int64) {
      throw new Error(
        'reflect: call of reflect.Value.SetInt on ' + k + ' Value',
      )
    }
    this._value = x
    if (this._parentVarRef) {
      this._parentVarRef.value = x
    }
    if (this._parentStruct && this._fieldName) {
      this._parentStruct[this._fieldName] = x
    }
  }

  // SetUint sets v's underlying value to x
  public SetUint(x: number): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetUint on unaddressable value',
      )
    }
    const k = this.Kind()
    if (
      k !== Uint &&
      k !== Uint8 &&
      k !== Uint16 &&
      k !== Uint32 &&
      k !== Uint64 &&
      k !== Uintptr
    ) {
      throw new Error(
        'reflect: call of reflect.Value.SetUint on ' + k + ' Value',
      )
    }
    this._value = x
    if (this._parentVarRef) {
      this._parentVarRef.value = x
    }
    if (this._parentStruct && this._fieldName) {
      this._parentStruct[this._fieldName] = x
    }
  }

  // SetBool sets v's underlying value to x
  public SetBool(x: boolean): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetBool on unaddressable value',
      )
    }
    if (this.Kind() !== Bool) {
      throw new Error(
        'reflect: call of reflect.Value.SetBool on ' + this.Kind() + ' Value',
      )
    }
    this._value = x
    if (this._parentVarRef) {
      this._parentVarRef.value = x
    }
    if (this._parentStruct && this._fieldName) {
      this._parentStruct[this._fieldName] = x
    }
  }

  // SetFloat sets v's underlying value to x
  public SetFloat(x: number): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetFloat on unaddressable value',
      )
    }
    const k = this.Kind()
    if (k !== Float32 && k !== Float64) {
      throw new Error(
        'reflect: call of reflect.Value.SetFloat on ' + k + ' Value',
      )
    }
    this._value = x
    if (this._parentVarRef) {
      this._parentVarRef.value = x
    }
    if (this._parentStruct && this._fieldName) {
      this._parentStruct[this._fieldName] = x
    }
  }

  // SetComplex sets v's underlying value to x
  public SetComplex(x: number | $.Complex): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetComplex on unaddressable value',
      )
    }
    const k = this.Kind()
    if (k !== Complex64 && k !== Complex128) {
      throw new Error(
        'reflect: call of reflect.Value.SetComplex on ' + k + ' Value',
      )
    }
    this._value = x
    if (this._parentVarRef) {
      this._parentVarRef.value = x
    }
    if (this._parentStruct && this._fieldName) {
      this._parentStruct[this._fieldName] = x
    }
  }

  // SetBytes sets v's underlying value to x
  public SetBytes(x: $.Slice<number>): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetBytes on unaddressable value',
      )
    }
    if (this.Kind() !== Slice) {
      throw new Error(
        'reflect: call of reflect.Value.SetBytes on ' + this.Kind() + ' Value',
      )
    }
    // Convert Uint8Array or slice to array
    if (x instanceof Uint8Array) {
      this._value = globalThis.Array.from(x)
    } else if (globalThis.Array.isArray(x)) {
      this._value = x
    } else {
      this._value = x
    }
  }

  // SetZero sets v to be the zero value of v's type
  public SetZero(): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetZero on unaddressable value',
      )
    }
    const zeroVal = Zero(this.Type())
    this._value = (zeroVal as unknown as { value: ReflectValue }).value
  }

  // SetLen sets v's length to n
  public SetLen(n: number): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetLen on unaddressable value',
      )
    }
    if (this.Kind() !== Slice) {
      throw new Error(
        'reflect: call of reflect.Value.SetLen on ' + this.Kind() + ' Value',
      )
    }
    if (globalThis.Array.isArray(this._value)) {
      this._value.length = n
    }
  }

  // SetMapIndex sets the element associated with key in the map v to elem
  public SetMapIndex(key: Value, elem: Value): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetMapIndex on unaddressable value',
      )
    }
    if (this.Kind() !== Map) {
      throw new Error(
        'reflect: call of reflect.Value.SetMapIndex on ' +
          this.Kind() +
          ' Value',
      )
    }
    const mapObj = this._value as globalThis.Map<unknown, unknown>
    const keyVal = (key as unknown as { value: ReflectValue }).value
    const elemVal = (elem as unknown as { value: ReflectValue }).value
    mapObj.set(keyVal, elemVal)
  }

  // Grow increases the slice's capacity, if necessary
  public Grow(n: number): void {
    if (this.Kind() !== Slice) {
      throw new Error(
        'reflect: call of reflect.Value.Grow on ' + this.Kind() + ' Value',
      )
    }
    if (!globalThis.Array.isArray(this._value)) {
      return
    }
    // JavaScript arrays grow automatically, but we ensure capacity
    const currentLen = this._value.length
    const targetCap = currentLen + n
    if (this._value.length < targetCap) {
      this._value.length = targetCap
      this._value.length = currentLen // Reset to original length
    }
  }

  // Cap returns v's capacity
  public Cap(): number {
    const k = this.Kind()
    if (k === Slice || k === Array) {
      return $.cap(this._value as any)
    }
    if (k === Chan) {
      return 0 // Simplified
    }
    throw new Error('reflect: call of reflect.Value.Cap on ' + k + ' Value')
  }

  // NumMethod returns the number of methods in the value's method set
  public NumMethod(): number {
    return 0 // Simplified - methods not fully implemented
  }

  // Equal reports whether v is equal to u
  public Equal(u: Value): boolean {
    return DeepEqual(
      this._value,
      (u as unknown as { value: ReflectValue }).value,
    )
  }

  // CanInterface reports whether Interface can be used without panicking
  public CanInterface(): boolean {
    return this.IsValid()
  }

  // OverflowInt reports whether the int64 x cannot be represented by v's type
  public OverflowInt(x: number): boolean {
    const k = this.Kind()
    switch (k) {
      case Int8:
        return x < -128 || x > 127
      case Int16:
        return x < -32768 || x > 32767
      case Int32:
        return x < -2147483648 || x > 2147483647
      case Int:
      case Int64:
        return x < Number.MIN_SAFE_INTEGER || x > Number.MAX_SAFE_INTEGER
      default:
        throw new Error(
          'reflect: call of reflect.Value.OverflowInt on ' + k + ' Value',
        )
    }
  }

  // OverflowUint reports whether the uint64 x cannot be represented by v's type
  public OverflowUint(x: number): boolean {
    const k = this.Kind()
    switch (k) {
      case Uint8:
        return x < 0 || x > 255
      case Uint16:
        return x < 0 || x > 65535
      case Uint32:
        return x < 0 || x > 4294967295
      case Uint:
      case Uint64:
      case Uintptr:
        return x < 0 || x > Number.MAX_SAFE_INTEGER
      default:
        throw new Error(
          'reflect: call of reflect.Value.OverflowUint on ' + k + ' Value',
        )
    }
  }

  // OverflowFloat reports whether the float64 x cannot be represented by v's type
  public OverflowFloat(x: number): boolean {
    const k = this.Kind()
    if (k === Float32) {
      const f32max = 3.4028234663852886e38
      return Math.abs(x) > f32max && !isNaN(x) && !!isFinite(x)
    }
    if (k === Float64) {
      return false // float64 can represent any JavaScript number
    }
    throw new Error(
      'reflect: call of reflect.Value.OverflowFloat on ' + k + ' Value',
    )
  }
}

// Basic type implementation - exported for compatibility
export class BasicType implements Type {
  constructor(
    private _kind: Kind,
    private _name: string,
    private _size: number = 8,
    private _typeName: string = '',
  ) {}

  public String(): string {
    return this._typeName || this._name
  }

  public Kind(): Kind {
    return this._kind
  }

  public Comparable(): boolean {
    return this._kind !== Func && this._kind !== Map && this._kind !== Slice
  }

  public Size(): number {
    return this._size
  }

  public Elem(): Type {
    throw new Error(`reflect: Elem of invalid type ${this._name}`)
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public PkgPath(): string {
    if (this._typeName) {
      const dotIndex = this._typeName.lastIndexOf('.')
      if (dotIndex > 0) {
        return this._typeName.substring(0, dotIndex)
      }
    }
    return ''
  }

  public Name(): string {
    if (this._typeName) {
      const dotIndex = this._typeName.lastIndexOf('.')
      if (dotIndex >= 0) {
        return this._typeName.substring(dotIndex + 1)
      }
      return this._typeName
    }
    // Basic types have names like 'int', 'string', etc.
    return this._name
  }

  public Field(_i: number): StructField {
    throw new Error(`reflect: Field of non-struct type ${this._name}`)
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error(`reflect: Key of non-map type ${this._name}`)
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this._kind)
  }

  public OverflowInt(x: number): boolean {
    const k = this._kind
    switch (k) {
      case Int8:
        return x < -128 || x > 127
      case Int16:
        return x < -32768 || x > 32767
      case Int32:
        return x < -2147483648 || x > 2147483647
      case Int:
      case Int64:
        return x < Number.MIN_SAFE_INTEGER || x > Number.MAX_SAFE_INTEGER
      default:
        throw new Error(
          'reflect: call of reflect.Type.OverflowInt on ' +
            Kind_String(k) +
            ' Type',
        )
    }
  }

  public OverflowUint(x: number): boolean {
    const k = this._kind
    switch (k) {
      case Uint8:
        return x < 0 || x > 255
      case Uint16:
        return x < 0 || x > 65535
      case Uint32:
        return x < 0 || x > 4294967295
      case Uint:
      case Uint64:
      case Uintptr:
        return x < 0 || x > Number.MAX_SAFE_INTEGER
      default:
        throw new Error(
          'reflect: call of reflect.Type.OverflowUint on ' +
            Kind_String(k) +
            ' Type',
        )
    }
  }

  public OverflowFloat(x: number): boolean {
    const k = this._kind
    if (k === Float32) {
      const f32max = 3.4028234663852886e38
      return Math.abs(x) > f32max && !isNaN(x) && !!isFinite(x)
    }
    if (k === Float64) {
      return false
    }
    throw new Error(
      'reflect: call of reflect.Type.OverflowFloat on ' +
        Kind_String(k) +
        ' Type',
    )
  }

  public NumMethod(): number {
    return 0
  }
  public MethodByName(_name: string): [Method, boolean] {
    return [zeroMethod(), false]
  }

  public Len(): number {
    throw new Error(
      'reflect: call of reflect.Type.Len on ' +
        Kind_String(this._kind) +
        ' Type',
    )
  }

  public Bits(): number {
    const k = this._kind
    switch (k) {
      case Bool:
        return 1
      case Int8:
      case Uint8:
        return 8
      case Int16:
      case Uint16:
        return 16
      case Int32:
      case Uint32:
      case Float32:
        return 32
      case Int64:
      case Uint64:
      case Float64:
        return 64
      case Complex64:
        return 64
      case Complex128:
        return 128
      case Int:
      case Uint:
      case Uintptr:
        return 64 // Assuming 64-bit architecture
      default:
        throw new Error(
          'reflect: call of reflect.Type.Bits on ' + Kind_String(k) + ' Type',
        )
    }
  }
}

// Slice type implementation
class SliceType implements Type {
  constructor(private _elemType: Type) {}

  public String(): string {
    return '[]' + this._elemType.String()
  }

  public Kind(): Kind {
    return Slice
  }

  public Comparable(): boolean {
    return false
  }

  public Size(): number {
    return 24 // slice header size
  }

  public Elem(): Type {
    return this._elemType
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public PkgPath(): string {
    return ''
  }

  public Name(): string {
    // Slice types are unnamed composite types
    return ''
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type')
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error('reflect: Key of non-map type')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public OverflowInt(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowInt on slice Type')
  }

  public OverflowUint(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowUint on slice Type')
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowFloat on slice Type')
  }

  public NumMethod(): number {
    return 0
  }
  public MethodByName(_name: string): [Method, boolean] {
    return [zeroMethod(), false]
  }

  public Len(): number {
    throw new Error('reflect: call of reflect.Type.Len on slice Type')
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on slice Type')
  }
}

// Array type implementation
class ArrayType implements Type {
  constructor(
    private _elemType: Type,
    private _len: number,
  ) {}

  public String(): string {
    return `[${this._len}]${this._elemType.String()}`
  }

  public Kind(): Kind {
    return Array
  }

  public Comparable(): boolean {
    return this._elemType.Comparable()
  }

  public Size(): number {
    return this._elemType.Size() * this._len
  }

  public Elem(): Type {
    return this._elemType
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public Len(): number {
    return this._len
  }

  public PkgPath(): string {
    return ''
  }

  public Name(): string {
    // Array types are unnamed composite types
    return ''
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type')
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error('reflect: Key of non-map type')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this.Kind())
  }

  public OverflowInt(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowInt on array Type')
  }

  public OverflowUint(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowUint on array Type')
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowFloat on array Type')
  }

  public NumMethod(): number {
    return 0
  }
  public MethodByName(_name: string): [Method, boolean] {
    return [zeroMethod(), false]
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on array Type')
  }
}

// Pointer type implementation
class PointerType implements Type {
  constructor(private _elemType: Type) {}

  public String(): string {
    return '*' + this._elemType.String()
  }

  public Kind(): Kind {
    return Ptr
  }

  public Comparable(): boolean {
    return true
  }

  public Size(): number {
    return 8 // pointer size
  }

  public Elem(): Type {
    return this._elemType
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public PkgPath(): string {
    return ''
  }

  public Name(): string {
    // Pointer types are unnamed composite types
    return ''
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type')
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error('reflect: Key of non-map type')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this.Kind())
  }

  public OverflowInt(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowInt on pointer Type')
  }

  public OverflowUint(_x: number): boolean {
    throw new Error(
      'reflect: call of reflect.Type.OverflowUint on pointer Type',
    )
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error(
      'reflect: call of reflect.Type.OverflowFloat on pointer Type',
    )
  }

  public NumMethod(): number {
    return 0
  }
  public MethodByName(name: string): [Method, boolean] {
    return typeMethodByName(this, name)
  }

  public Len(): number {
    throw new Error('reflect: call of reflect.Type.Len on pointer Type')
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on pointer Type')
  }
}

// Function type implementation
interface FunctionTypeDescriptor {
  name?: string
  signature?: string
  params?: Type[]
  results?: Type[]
  variadic?: boolean
}

class FunctionType implements Type {
  private _name: string
  private _signature: string
  private _params: Type[]
  private _results: Type[]
  private _variadic: boolean

  constructor(signatureOrDescriptor: string | FunctionTypeDescriptor) {
    if (typeof signatureOrDescriptor === 'string') {
      this._name = ''
      this._signature = signatureOrDescriptor
      this._params = []
      this._results = []
      this._variadic = false
      return
    }

    this._name = signatureOrDescriptor.name ?? ''
    this._params = signatureOrDescriptor.params ?? []
    this._results = signatureOrDescriptor.results ?? []
    this._variadic = signatureOrDescriptor.variadic ?? false
    this._signature =
      signatureOrDescriptor.signature ??
      formatFunctionSignature(this._params, this._results, this._variadic)
  }

  public String(): string {
    if (this._name !== '') {
      return this._name
    }
    return this._signature
  }

  public Kind(): Kind {
    return Func
  }

  public Comparable(): boolean {
    return false
  }

  public Size(): number {
    return 8 // function pointer size
  }

  public Elem(): Type {
    throw new Error('reflect: Elem of invalid type')
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return this._params.length
  }

  public In(i: number): Type {
    if (i < 0 || i >= this._params.length) {
      throw new Error(
        `reflect: In index out of range [${i}] with length ${this._params.length}`,
      )
    }
    return this._params[i]
  }

  public NumOut(): number {
    return this._results.length
  }

  public Out(i: number): Type {
    if (i < 0 || i >= this._results.length) {
      throw new Error(
        `reflect: Out index out of range [${i}] with length ${this._results.length}`,
      )
    }
    return this._results[i]
  }

  public IsVariadic(): boolean {
    return this._variadic
  }

  public PkgPath(): string {
    if (this._name !== '') {
      const dotIndex = this._name.lastIndexOf('.')
      if (dotIndex > 0) {
        return this._name.substring(0, dotIndex)
      }
    }
    return ''
  }

  public Name(): string {
    if (this._name !== '') {
      const dotIndex = this._name.lastIndexOf('.')
      if (dotIndex >= 0) {
        return this._name.substring(dotIndex + 1)
      }
      return this._name
    }
    return ''
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type')
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error('reflect: Key of non-map type')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this.Kind())
  }

  public OverflowInt(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowInt on func Type')
  }

  public OverflowUint(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowUint on func Type')
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowFloat on func Type')
  }

  public NumMethod(): number {
    return 0
  }
  public MethodByName(_name: string): [Method, boolean] {
    return [zeroMethod(), false]
  }

  public Len(): number {
    throw new Error('reflect: call of reflect.Type.Len on func Type')
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on func Type')
  }
}

function formatFunctionSignature(
  params: Type[],
  results: Type[],
  variadic: boolean,
): string {
  const paramStrings = params.map((param, index) => {
    const typeName = param.String()
    if (!variadic || index !== params.length - 1) {
      return typeName
    }
    if (typeName.startsWith('[]')) {
      return '...' + typeName.slice(2)
    }
    return '...' + typeName
  })
  let signature = `func(${paramStrings.join(', ')})`
  if (results.length === 1) {
    signature += ` ${results[0].String()}`
  } else if (results.length > 1) {
    signature += ` (${results.map((result) => result.String()).join(', ')})`
  }
  return signature
}

async function callReflectFunction(
  fn: (...args: unknown[]) => unknown | Promise<unknown>,
  fnType: Type,
  inArgs: $.Slice<Value>,
  op: ReflectCallOp,
): Promise<$.Slice<Value>> {
  const args = $.asArray(inArgs)
  const rawArgs = reflectCallRawArgs(fnType, args, op)
  const result = await fn(...rawArgs)
  return normalizeReflectCallResults(fnType, result)
}

type ReflectCallOp = 'Call' | 'CallSlice'

function reflectCallRawArgs(
  fnType: Type,
  args: Value[],
  op: ReflectCallOp,
): unknown[] {
  if (op === 'CallSlice') {
    return reflectCallSliceRawArgs(fnType, args)
  }
  if (!fnType.IsVariadic()) {
    validateReflectCallInputCount(fnType, args.length)
    return args.map((arg, index) =>
      reflectCallValueInterface(op, arg, fnType.In(index), index),
    )
  }
  const fixedCount = fnType.NumIn() - 1
  if (args.length < fixedCount) {
    throw new Error('reflect: Call with too few input arguments')
  }
  const rawArgs: unknown[] = []
  for (let i = 0; i < fixedCount; i++) {
    rawArgs.push(reflectCallValueInterface(op, args[i], fnType.In(i), i))
  }
  const variadicElemType = fnType.In(fixedCount).Elem()
  const variadicValues = args.slice(fixedCount)
  for (let i = 0; i < variadicValues.length; i++) {
    const value = variadicValues[i]
    if (!value.IsValid()) {
      throw new Error(`reflect: ${op} using zero Value argument`)
    }
    if (!value.Type().AssignableTo(variadicElemType)) {
      throw new Error(
        `reflect: cannot use ${value.Type().String()} as type ${variadicElemType.String()} in ${op}`,
      )
    }
  }
  rawArgs.push($.arrayToSlice(variadicValues.map((value) => value.Interface())))
  return rawArgs
}

function reflectCallSliceRawArgs(fnType: Type, args: Value[]): unknown[] {
  if (!fnType.IsVariadic()) {
    throw new Error('reflect: CallSlice of non-variadic function')
  }
  const expected = fnType.NumIn()
  if (args.length < expected) {
    throw new Error('reflect: CallSlice with too few input arguments')
  }
  if (args.length > expected) {
    throw new Error('reflect: CallSlice with too many input arguments')
  }
  return args.map((arg, index) =>
    reflectCallValueInterface('CallSlice', arg, fnType.In(index), index),
  )
}

function reflectCallValueInterface(
  op: ReflectCallOp,
  value: Value,
  target: Type,
  _index: number,
): unknown {
  if (!value.IsValid()) {
    throw new Error(`reflect: ${op} using zero Value argument`)
  }
  if (!value.Type().AssignableTo(target)) {
    throw new Error(
      `reflect: ${op} using ${value.Type().String()} as type ${target.String()}`,
    )
  }
  return value.Interface()
}

function validateReflectCallInputCount(fnType: Type, actual: number): void {
  const expected = fnType.NumIn()
  if (actual !== expected) {
    throw new Error(
      `reflect: Call with ${actual} input arguments for function with ${expected} inputs`,
    )
  }
}

function normalizeReflectCallResults(
  fnType: Type,
  result: unknown,
): $.Slice<Value> {
  const expected = fnType.NumOut()
  if (expected === 0) {
    if (result !== undefined) {
      throw new Error(
        'reflect: Call returned 1 results for function with 0 outputs',
      )
    }
    return $.makeSlice<Value>(0)
  }
  if (expected === 1) {
    return $.arrayToSlice([ValueOf(result as ReflectValue)])
  }
  if (!globalThis.Array.isArray(result)) {
    throw new Error(
      `reflect: Call returned 1 results for function with ${expected} outputs`,
    )
  }
  if (result.length !== expected) {
    throw new Error(
      `reflect: Call returned ${result.length} results for function with ${expected} outputs`,
    )
  }
  return $.arrayToSlice(result.map((value) => ValueOf(value as ReflectValue)))
}

export function MakeFunc(
  typ: Type | null,
  fn:
    | ((args: $.Slice<Value>) => $.Slice<Value> | Promise<$.Slice<Value>>)
    | null,
): Value {
  if (!typ || typ.Kind() !== Func) {
    throw new Error('reflect: call of MakeFunc with non-Func type')
  }
  if (typeof fn !== 'function') {
    throw new Error('reflect.MakeFunc: nil implementation')
  }
  const typeInfo = functionTypeInfoFromType(typ)
  const wrapper = $.functionValue(async (...rawArgs: unknown[]) => {
    const args = makeFuncArgs(typ, rawArgs)
    const resultValues = $.asArray(await fn($.arrayToSlice(args)))
    validateMakeFuncResults(typ, resultValues)
    if (typ.NumOut() === 0) {
      return undefined
    }
    if (typ.NumOut() === 1) {
      return makeFuncReturnInterface(resultValues[0], typ.Out(0))
    }
    return resultValues.map((value, index) =>
      makeFuncReturnInterface(value, typ.Out(index)),
    )
  }, typeInfo)
  return new Value(wrapper, typ)
}

function makeFuncArgs(typ: Type, rawArgs: unknown[]): Value[] {
  validateReflectCallInputCount(typ, rawArgs.length)
  return rawArgs.map((arg, index) => {
    const value = ValueOf(arg as ReflectValue)
    const target = typ.In(index)
    if (!value.Type().AssignableTo(target)) {
      throw new Error(
        `reflect.MakeFunc: cannot use ${value.Type().String()} as type ${target.String()} in argument ${index}`,
      )
    }
    return value
  })
}

function validateMakeFuncResults(typ: Type, resultValues: Value[]): void {
  const expected = typ.NumOut()
  if (resultValues.length !== expected) {
    throw new Error(
      `reflect.MakeFunc: returned ${resultValues.length} results for function with ${expected} outputs`,
    )
  }
  for (let i = 0; i < resultValues.length; i++) {
    const result = resultValues[i]
    if (!result.IsValid()) {
      throw new Error(`reflect.MakeFunc: returned zero Value for result ${i}`)
    }
    const target = typ.Out(i)
    if (!result.Type().AssignableTo(target)) {
      throw new Error(
        `reflect.MakeFunc: cannot use ${result.Type().String()} as type ${target.String()} in result ${i}`,
      )
    }
  }
}

function makeFuncReturnInterface(value: Value, target: Type): unknown {
  const raw = value.Interface()
  if (target.Kind() === Interface) {
    return raw
  }
  return unwrapGoInterfaceBox(raw)
}

function unwrapGoInterfaceBox(value: unknown): unknown {
  if (
    value !== null &&
    value !== undefined &&
    typeof value === 'object' &&
    '__goValue' in value
  ) {
    return (value as { __goValue: unknown }).__goValue
  }
  return value
}

// Map type implementation
class MapType implements Type {
  constructor(
    private _keyType: Type,
    private _elemType: Type,
  ) {}

  public String(): string {
    return `map[${this._keyType.String()}]${this._elemType.String()}`
  }

  public Kind(): Kind {
    return Map
  }

  public Comparable(): boolean {
    return false
  }

  public Size(): number {
    return 8 // map header size
  }

  public Elem(): Type {
    return this._elemType
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public Key(): Type {
    return this._keyType
  }

  public PkgPath(): string {
    return ''
  }

  public Name(): string {
    // Map types are unnamed composite types
    return ''
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type')
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this.Kind())
  }

  public OverflowInt(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowInt on map Type')
  }

  public OverflowUint(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowUint on map Type')
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowFloat on map Type')
  }

  public NumMethod(): number {
    return 0
  }
  public MethodByName(_name: string): [Method, boolean] {
    return [zeroMethod(), false]
  }

  public Len(): number {
    throw new Error('reflect: call of reflect.Type.Len on map Type')
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on map Type')
  }
}

// Struct type implementation
function typeImplementsInterface(t: Type, interfaceType: Type): boolean {
  if (interfaceType.Kind() !== Interface) {
    throw new Error('reflect: non-interface type passed to Type.Implements')
  }
  const requiredMethods = typeMethods(interfaceType)
  if (requiredMethods.length === 0) {
    return true
  }
  const methods = typeMethods(t)
  return requiredMethods.every((requiredMethod) => {
    const method = methods.find(
      (candidate) => candidate.name === requiredMethod.name,
    )
    return (
      method !== undefined && methodSignatureIdentical(method, requiredMethod)
    )
  })
}

function methodSignatureIdentical(
  actual: $.MethodSignature,
  required: $.MethodSignature,
): boolean {
  return (
    methodArgListIdentical(actual.args, required.args) &&
    methodArgListIdentical(actual.returns, required.returns)
  )
}

function methodArgListIdentical(
  actual: $.MethodArg[],
  required: $.MethodArg[],
): boolean {
  if (actual.length !== required.length) {
    return false
  }
  return actual.every(
    (arg, index) =>
      methodArgIdentityKey(arg) === methodArgIdentityKey(required[index]),
  )
}

function methodArgIdentityKey(arg: $.MethodArg): string {
  return typeInfoIdentityKey(arg.type, new Set())
}

function methodSignatureIdentityKey(method: $.MethodSignature): string {
  const args = method.args.map(methodArgIdentityKey).join(',')
  const returns = method.returns.map(methodArgIdentityKey).join(',')
  return `${method.name}(${args})(${returns})`
}

function typeInfoIdentityKey(
  info: $.TypeInfo | string,
  seen: Set<string>,
): string {
  if (typeof info === 'string') {
    const registered = builtinGetTypeByName(info)
    if (!registered) {
      return `named:${info}`
    }
    const registeredName = registered.name ?? info
    if (registeredName !== '') {
      return `named:${registeredName}`
    }
    if (seen.has(info)) {
      return `named:${info}`
    }
    seen.add(info)
    const key = typeInfoIdentityKey(registered, seen)
    seen.delete(info)
    return key
  }
  switch (info.kind) {
    case $.TypeKind.Basic:
      if (info.typeName) {
        return `named:${info.typeName}`
      }
      return `basic:${info.name ?? 'unknown'}`
    case $.TypeKind.Interface:
      if (info.name) {
        return `named:${info.name}`
      }
      return `interface:${(info.methods ?? [])
        .map(methodSignatureIdentityKey)
        .join('|')}`
    case $.TypeKind.Struct:
      if (info.name) {
        return `named:${info.name}`
      }
      return `struct:${(info.fields ?? [])
        .map(
          (field) =>
            `${field.name}:${field.pkgPath ?? ''}:${typeInfoIdentityKey(field.type, seen)}`,
        )
        .join('|')}`
    case $.TypeKind.Pointer:
      return `ptr:${typeInfoIdentityKey(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Slice:
      return `slice:${typeInfoIdentityKey(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Array:
      return `array:${info.length}:${typeInfoIdentityKey(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Map:
      return `map:${typeInfoIdentityKey(
        info.keyType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}:${typeInfoIdentityKey(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Function:
      return `func:${info.isVariadic === true}:${(info.params ?? [])
        .map((param) => typeInfoIdentityKey(param, seen))
        .join(',')}:${(info.results ?? [])
        .map((result) => typeInfoIdentityKey(result, seen))
        .join(',')}`
    case $.TypeKind.Channel:
      return `chan:${info.direction ?? 'both'}:${typeInfoIdentityKey(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    default:
      return 'unknown'
  }
}

function typeFieldByName(t: Type, name: string): [StructField, boolean] {
  return typeFieldByNameFunc(t, (fieldName) => fieldName === name)
}

function typeFieldByNameFunc(
  t: Type,
  match: (name: string) => boolean,
): [StructField, boolean] {
  if (t.Kind() !== Struct) {
    throw new Error('reflect: FieldByName of non-struct type')
  }
  for (const field of visibleStructFields(t)) {
    if (match(field.Name)) {
      return [field, true]
    }
  }
  return [new StructField(), false]
}

export function visibleStructFields(t: Type): StructField[] {
  const fields: StructField[] = []
  const byName = new globalThis.Map<string, number>()
  const visiting = new Set<Type>()
  const index: number[] = []

  const walk = (typ: Type): void => {
    if (visiting.has(typ)) {
      return
    }
    visiting.add(typ)
    for (let i = 0; i < typ.NumField(); i++) {
      const field = typ.Field(i).clone()
      index.push(i)

      let add = true
      const oldIndex = byName.get(field.Name)
      if (oldIndex !== undefined) {
        const old = fields[oldIndex]
        if (index.length === old.Index.length) {
          old.Name = ''
          add = false
        } else if (index.length < old.Index.length) {
          old.Name = ''
        } else {
          add = false
        }
      }
      if (add) {
        field.Index = [...index]
        byName.set(field.Name, fields.length)
        fields.push(field)
      }

      if (field.Anonymous) {
        let fieldType = field.Type
        if (fieldType.Kind() === Ptr) {
          fieldType = fieldType.Elem()
        }
        if (fieldType.Kind() === Struct) {
          walk(fieldType)
        }
      }

      index.pop()
    }
    visiting.delete(typ)
  }

  walk(t)
  return fields.filter((field) => field.Name !== '')
}

function zeroMethod(): Method {
  return {
    Name: '',
    Type: new BasicType(Invalid, '<invalid>'),
    Func: () => undefined,
    Index: 0,
  }
}

function methodFromSignature(
  signature: $.MethodSignature,
  index: number,
  receiver: Type,
): Method {
  return {
    Name: signature.name,
    Type: methodTypeFromSignature(
      signature,
      receiver,
      receiver.Kind() !== Interface,
    ),
    Func: () => undefined,
    Index: index,
  }
}

function methodTypeFromSignature(
  signature: $.MethodSignature,
  receiver: Type,
  includeReceiver: boolean,
): Type {
  const params = signature.args.map(methodArgType)
  if (includeReceiver) {
    params.unshift(receiver)
  }
  return new FunctionType({
    params,
    results: signature.returns.map(methodArgType),
  })
}

function methodArgType(arg: $.MethodArg): Type {
  return typeFromTypeInfoWithSeen(arg.type, new Set())
}

function typeMethods(t: Type): $.MethodSignature[] {
  let typeInfo = builtinGetTypeByName(t.String())
  if (!typeInfo && t.Kind() === Ptr) {
    typeInfo = builtinGetTypeByName(t.Elem().String())
  }
  if (!typeInfo && t instanceof InterfaceType) {
    const registeredName = t.registeredName()
    if (registeredName) {
      typeInfo = builtinGetTypeByName(registeredName)
    }
  }
  if (!typeInfo && t instanceof InterfaceType) {
    return t.methodSignatures()
  }
  if (!typeInfo) {
    return []
  }
  if (isStructTypeInfo(typeInfo) || isInterfaceTypeInfo(typeInfo)) {
    return typeInfo.methods || []
  }
  return []
}

function methodSignatureByName(
  t: Type,
  name: string,
): [$.MethodSignature | undefined, number] {
  const methods = typeMethods(t)
  const index = methods.findIndex((method) => method.name === name)
  if (index === -1) {
    return [undefined, -1]
  }
  return [methods[index], index]
}

function typeMethodByName(t: Type, name: string): [Method, boolean] {
  const [signature, index] = methodSignatureByName(t, name)
  if (!signature) {
    return [zeroMethod(), false]
  }
  return [methodFromSignature(signature, index, t), true]
}

function typeAssignableTo(t: Type, u: Type | null): boolean {
  if (u === null) {
    return false
  }
  if (typeIdentityKey(t) === typeIdentityKey(u)) {
    return true
  }
  if (u.Kind() !== Interface) {
    return false
  }
  return t.Implements(u)
}

export function structFieldStorageKey(t: Type, i: number): string {
  if (t instanceof StructType) {
    return t.fieldKey(i)
  }
  return t.Field(i).Name
}

interface StructFieldDescriptor {
  name: string
  key: string
  type: Type
  tag?: string
  pkgPath: string
  anonymous: boolean
  index: number[]
  offset: number
  exported: boolean
}

function typeAlignment(typ: Type): number {
  switch (typ.Kind()) {
    case Bool:
    case Int8:
    case Uint8:
      return 1
    case Int16:
    case Uint16:
      return 2
    case Int32:
    case Uint32:
    case Float32:
    case Complex64:
      return 4
    case Array:
      return typeAlignment(typ.Elem())
    case Struct: {
      let align = 1
      for (let i = 0; i < typ.NumField(); i++) {
        align = Math.max(align, typeAlignment(typ.Field(i).Type))
      }
      return align
    }
    default:
      return 8
  }
}

function alignOffset(offset: number, alignment: number): number {
  if (alignment <= 1) {
    return offset
  }
  return Math.ceil(offset / alignment) * alignment
}

function structDescriptorSize(fields: StructFieldDescriptor[]): number {
  let size = 0
  let alignment = 1
  for (const field of fields) {
    alignment = Math.max(alignment, typeAlignment(field.type))
    size = Math.max(size, field.offset + field.type.Size())
  }
  return alignOffset(size, alignment)
}

class StructType implements Type {
  constructor(
    private _name: string,
    private _fields: StructFieldDescriptor[] = [],
    private _pkgPath = '',
    private _string = _name,
  ) {}

  public String(): string {
    return this._string
  }

  public Kind(): Kind {
    return Struct
  }

  public Comparable(): boolean {
    return this._fields.every((field) => field.type.Comparable())
  }

  public Size(): number {
    return structDescriptorSize(this._fields)
  }

  public Elem(): Type {
    throw new Error('reflect: Elem of invalid type')
  }

  public NumField(): number {
    return this._fields.length
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public PkgPath(): string {
    if (this._pkgPath !== '') {
      return this._pkgPath
    }
    if (this._name === '') {
      return ''
    }
    // Extract package path from full type name (e.g., "main.Person" -> "main")
    const dotIndex = this._name.lastIndexOf('.')
    if (dotIndex > 0) {
      return this._name.substring(0, dotIndex)
    }
    return ''
  }

  public Name(): string {
    if (this._name === '') {
      return ''
    }
    // Extract type name from full type name (e.g., "main.Person" -> "Person")
    const dotIndex = this._name.lastIndexOf('.')
    if (dotIndex >= 0) {
      return this._name.substring(dotIndex + 1)
    }
    return this._name
  }

  public Field(i: number): StructField {
    if (i < 0 || i >= this.NumField()) {
      throw new Error(
        `reflect: Field index out of range [${i}] with length ${this.NumField()}`,
      )
    }
    const f = this._fields[i]
    return new StructField({
      Name: f.name,
      PkgPath: f.pkgPath,
      Type: f.type,
      Tag: f.tag ? new StructTag(f.tag) : undefined,
      Offset: f.offset,
      Index: [...f.index],
      Anonymous: f.anonymous,
    })
  }

  public fieldKey(i: number): string {
    if (i < 0 || i >= this.NumField()) {
      throw new Error(
        `reflect: Field index out of range [${i}] with length ${this.NumField()}`,
      )
    }
    return this._fields[i].key
  }

  public descriptors(): StructFieldDescriptor[] {
    return this._fields.map((field) => ({
      ...field,
      index: [...field.index],
    }))
  }

  public identityKey(seen: Set<Type>): string {
    const fields = this._fields
      .map((field) =>
        [
          field.name,
          field.pkgPath,
          field.tag ?? '',
          field.anonymous ? 'anonymous' : 'named',
          typeIdentityKey(field.type, seen),
        ].join('\u0000'),
      )
      .join('\u0001')
    return `struct:${this._pkgPath}:${this._name}:${fields}`
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error('reflect: Key of non-map type')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this.Kind())
  }

  public OverflowInt(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowInt on struct Type')
  }

  public OverflowUint(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowUint on struct Type')
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error(
      'reflect: call of reflect.Type.OverflowFloat on struct Type',
    )
  }

  public NumMethod(): number {
    return typeMethods(this).length
  }

  public MethodByName(name: string): [Method, boolean] {
    return typeMethodByName(this, name)
  }

  public Len(): number {
    throw new Error('reflect: call of reflect.Type.Len on struct Type')
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on struct Type')
  }

  static createTypeFromFieldInfo(ti: any): Type {
    if (typeof ti === 'string') {
      return basicTypeFromName(ti === 'number' ? 'int' : ti)
    } else if (ti && ti.kind) {
      // Handle TypeInfo objects from the builtin type system
      const name = ti.name || 'unknown'
      const typeName = ti.typeName || ''
      switch (ti.kind) {
        case 'basic':
          return basicTypeFromName(name === 'number' ? 'int' : name, typeName)
        case 'slice':
          if (ti.elemType) {
            return new SliceType(
              StructType.createTypeFromFieldInfo(ti.elemType),
            )
          }
          return new SliceType(new BasicType(Invalid, 'unknown', 8))
        case 'pointer':
          if (ti.elemType) {
            return new PointerType(
              StructType.createTypeFromFieldInfo(ti.elemType),
            )
          }
          return new PointerType(new BasicType(Invalid, 'unknown', 8))
        case 'interface':
          return interfaceTypeFromInfo(ti)
        case 'struct':
          return new StructType(name, structFieldsFromTypeInfo(ti))
        default:
          return new BasicType(Invalid, name, 8)
      }
    }
    return new BasicType(Invalid, 'unknown', 8)
  }
}

function basicTypeFromName(name: string, typeName = ''): BasicType {
  switch (name) {
    case 'string':
      return new BasicType(String, 'string', 16, typeName)
    case 'bool':
    case 'boolean':
      return new BasicType(Bool, 'bool', 1, typeName)
    case 'int':
      return new BasicType(Int, 'int', 8, typeName)
    case 'int8':
      return new BasicType(Int8, 'int8', 1, typeName)
    case 'int16':
      return new BasicType(Int16, 'int16', 2, typeName)
    case 'int32':
      return new BasicType(Int32, 'int32', 4, typeName)
    case 'int64':
      return new BasicType(Int64, 'int64', 8, typeName)
    case 'uint':
      return new BasicType(Uint, 'uint', 8, typeName)
    case 'uint8':
    case 'byte':
      return new BasicType(Uint8, name, 1, typeName)
    case 'uint16':
      return new BasicType(Uint16, 'uint16', 2, typeName)
    case 'uint32':
      return new BasicType(Uint32, 'uint32', 4, typeName)
    case 'uint64':
      return new BasicType(Uint64, 'uint64', 8, typeName)
    case 'uintptr':
      return new BasicType(Uintptr, 'uintptr', 8, typeName)
    case 'float32':
      return new BasicType(Float32, 'float32', 4, typeName)
    case 'float64':
      return new BasicType(Float64, 'float64', 8, typeName)
    case 'complex64':
      return new BasicType(Complex64, 'complex64', 8, typeName)
    case 'complex128':
      return new BasicType(Complex128, 'complex128', 16, typeName)
    default:
      return new BasicType(Invalid, name, 8, typeName)
  }
}

function structFieldsFromTypeInfo(
  ti: $.StructTypeInfo,
): StructFieldDescriptor[] {
  return (ti.fields || []).map((fieldInfo, index) => {
    return {
      name: fieldInfo.name,
      key: structFieldRuntimeKey(fieldInfo),
      type: typeFromTypeInfo(fieldInfo.type),
      tag: fieldInfo.tag,
      pkgPath: fieldInfo.pkgPath ?? '',
      anonymous: fieldInfo.anonymous ?? false,
      index: fieldInfo.index ? [...fieldInfo.index] : [index],
      offset: fieldInfo.offset ?? index * 8,
      exported: fieldInfo.exported ?? (fieldInfo.pkgPath ?? '') === '',
    }
  })
}

class ChannelType implements Type {
  constructor(
    private _elemType: Type,
    private _dir: ChanDir,
  ) {}

  public String(): string {
    // Format: chan T, <-chan T, or chan<- T
    const elem = this._elemType.String()
    switch (this._dir) {
      case RecvDir:
        return `<-chan ${elem}`
      case SendDir:
        return `chan<- ${elem}`
      case BothDir:
      default:
        return `chan ${elem}`
    }
  }

  public Kind(): Kind {
    return Chan
  }

  public Comparable(): boolean {
    return true
  }

  public Size(): number {
    // Channels are represented as pointers, so pointer size
    return 8
  }

  public Elem(): Type {
    return this._elemType
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public PkgPath(): string {
    return ''
  }

  public Name(): string {
    // Channel types are unnamed composite types
    return ''
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type')
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error('reflect: Key of non-map type')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this.Kind())
  }

  public ChanDir(): ChanDir {
    return this._dir
  }

  public OverflowInt(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowInt on chan Type')
  }

  public OverflowUint(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowUint on chan Type')
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowFloat on chan Type')
  }

  public NumMethod(): number {
    return 0
  }
  public MethodByName(_name: string): [Method, boolean] {
    return [zeroMethod(), false]
  }

  public Len(): number {
    throw new Error('reflect: call of reflect.Type.Len on chan Type')
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on chan Type')
  }
}

// Interface type implementation
class InterfaceType implements Type {
  constructor(
    private _name: string = 'interface{}',
    private _registeredName?: string,
    private _methods: $.MethodSignature[] = [],
  ) {}

  public String(): string {
    return this._name
  }

  public Kind(): Kind {
    return Interface
  }

  public Comparable(): boolean {
    return true
  }

  public Size(): number {
    return 16
  }

  public Elem(): Type {
    throw new Error('reflect: Elem of invalid type')
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public PkgPath(): string {
    if (this._name === 'interface{}' || this._name.startsWith('interface {')) {
      return ''
    }
    const dotIndex = this._name.lastIndexOf('.')
    if (dotIndex > 0) {
      return this._name.substring(0, dotIndex)
    }
    return ''
  }

  public Name(): string {
    if (this._name === 'interface{}' || this._name.startsWith('interface {')) {
      return this._name
    }
    const dotIndex = this._name.lastIndexOf('.')
    if (dotIndex >= 0) {
      return this._name.substring(dotIndex + 1)
    }
    return this._name
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type')
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error('reflect: Key of non-map type')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this.Kind())
  }

  public OverflowInt(_x: number): boolean {
    throw new Error(
      'reflect: call of reflect.Type.OverflowInt on interface Type',
    )
  }

  public OverflowUint(_x: number): boolean {
    throw new Error(
      'reflect: call of reflect.Type.OverflowUint on interface Type',
    )
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error(
      'reflect: call of reflect.Type.OverflowFloat on interface Type',
    )
  }

  public NumMethod(): number {
    return typeMethods(this).length
  }

  public MethodByName(name: string): [Method, boolean] {
    return typeMethodByName(this, name)
  }

  public Len(): number {
    throw new Error('reflect: call of reflect.Type.Len on interface Type')
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on interface Type')
  }

  public registeredName(): string | undefined {
    return this._registeredName
  }

  public methodSignatures(): $.MethodSignature[] {
    return this._methods
  }
}

function getTypeOf(value: ReflectValue): Type {
  // Check for typed nil before checking for plain null
  // Typed nils are created by $.typedNil() and have __goType and __isTypedNil properties
  if (value && typeof value === 'object' && (value as any).__isTypedNil) {
    const typeName = (value as any).__goType
    if (typeName && typeof typeName === 'string') {
      // Parse the type name to construct the appropriate Type
      // For pointer types like "*main.Stringer", extract the element type
      if (typeName.startsWith('*')) {
        const elemTypeName = typeName.slice(1) // Remove the '*' prefix
        // Create an InterfaceType for the element (works for interfaces and other types)
        const elemType = new InterfaceType(elemTypeName)
        return new PointerType(elemType)
      }
    }
  }

  if (value === null || value === undefined) {
    return new BasicType(Interface, 'interface{}', 16)
  }

  switch (typeof value) {
    case 'boolean':
      return new BasicType(Bool, 'bool', 1)
    case 'number':
      if (Number.isInteger(value)) {
        return new BasicType(Int, 'int', 8)
      }
      return new BasicType(Float64, 'float64', 8)
    case 'bigint':
      return new BasicType(Int64, 'int64', 8)
    case 'string':
      return new BasicType(String, 'string', 16)
    case 'function': {
      // Check if this function has GoScript type information attached
      const funcWithMeta = value as any

      // First check for __typeInfo which contains the function signature
      if (funcWithMeta.__typeInfo) {
        const typeInfo = funcWithMeta.__typeInfo
        if (
          (typeInfo.kind === 'function' || typeInfo.kind === 'Function') &&
          typeInfo.params &&
          typeInfo.results
        ) {
          if (funcWithMeta.__goTypeName && !typeInfo.name) {
            return functionTypeFromInfo({
              ...typeInfo,
              name: funcWithMeta.__goTypeName,
            })
          }
          return functionTypeFromInfo(typeInfo)
        }
      }

      // Then check for __goTypeName which indicates a typed function
      if (funcWithMeta.__goTypeName) {
        const typeName = funcWithMeta.__goTypeName
        return new FunctionType({ name: typeName })
      }

      // For untyped functions, try to parse the signature
      const funcStr = value.toString()
      let signature = 'func'

      // Simple pattern matching for basic function signatures
      const match = funcStr.match(/function\s*\([^)]*\)/)
      if (match) {
        const params = match[0].replace('function', '').trim()
        // This is a simplified version - real implementation would need more sophisticated parsing
        if (params === '()') {
          signature = 'func()'
        } else if (params.includes(',')) {
          const paramCount = params.split(',').length
          signature = `func(${globalThis.Array(paramCount).fill('any').join(', ')})`
        } else if (params !== '()') {
          signature = 'func(any)'
        }
      }

      // Check if it looks like it returns something
      if (funcStr.includes('return ')) {
        signature += ' any'
      }

      return new FunctionType(signature)
    }
    case 'object': {
      if (value === null) {
        return new BasicType(Interface, 'interface{}', 16)
      }

      // Check for VarRef (pointer type in GoScript)
      if ($.isVarRef(value)) {
        const elemType = getTypeOf(value.value as ReflectValue)
        return new PointerType(elemType)
      }

      if (
        '__goTypeInfo' in value &&
        (value as { __goTypeInfo?: $.TypeInfo | string }).__goTypeInfo
      ) {
        return typeFromTypeInfo(
          (value as { __goTypeInfo: $.TypeInfo | string }).__goTypeInfo,
        )
      }

      if (
        'real' in value &&
        'imag' in value &&
        typeof (value as $.Complex).real === 'number' &&
        typeof (value as $.Complex).imag === 'number'
      ) {
        return new BasicType(Complex128, 'complex128', 16)
      }

      // Check for arrays
      if (globalThis.Array.isArray(value)) {
        if (value.length === 0) {
          // Empty array, assume []interface{}
          return new SliceType(new BasicType(Interface, 'interface{}', 16))
        }
        // Determine element type from first element
        const elemType = getTypeOf(value[0])
        return new SliceType(elemType)
      }

      // Check for typed arrays
      if (value instanceof Uint8Array)
        return new SliceType(new BasicType(Uint8, 'uint8', 1))
      if (value instanceof Int8Array)
        return new SliceType(new BasicType(Int8, 'int8', 1))
      if (value instanceof Uint16Array)
        return new SliceType(new BasicType(Uint16, 'uint16', 2))
      if (value instanceof Int16Array)
        return new SliceType(new BasicType(Int16, 'int16', 2))
      if (value instanceof Uint32Array)
        return new SliceType(new BasicType(Uint32, 'uint32', 4))
      if (value instanceof Int32Array)
        return new SliceType(new BasicType(Int32, 'int32', 4))
      if (value instanceof Float32Array)
        return new SliceType(new BasicType(Float32, 'float32', 4))
      if (value instanceof Float64Array)
        return new SliceType(new BasicType(Float64, 'float64', 8))

      // Check for Maps
      if (value instanceof globalThis.Map) {
        if (value.size === 0) {
          // Empty map, assume map[interface{}]interface{}
          const anyType = new BasicType(Interface, 'interface{}', 16)
          return new MapType(anyType, anyType)
        }
        // Get types from first entry
        const firstEntry = value.entries().next().value
        if (firstEntry) {
          const keyType = getTypeOf(firstEntry[0] as ReflectValue)
          const valueType = getTypeOf(firstEntry[1] as ReflectValue)
          return new MapType(keyType, valueType)
        }
      }

      // Check for GoScript slice objects with proper __meta__ structure
      if (value && typeof value === 'object' && '__meta__' in value) {
        const meta = (
          value as {
            __meta__?: {
              backing?: unknown[]
              length?: number
              capacity?: number
              offset?: number
            }
          }
        ).__meta__
        if (
          meta &&
          typeof meta === 'object' &&
          'backing' in meta &&
          'length' in meta &&
          globalThis.Array.isArray(meta.backing)
        ) {
          // This is a GoScript slice - determine element type from backing array
          if (meta.backing.length === 0) {
            // Empty slice, assume []interface{}
            return new SliceType(new BasicType(Interface, 'interface{}', 16))
          }
          // Get element type from first element in backing array
          const elemType = getTypeOf(meta.backing[0] as ReflectValue)
          return new SliceType(elemType)
        }
      }

      // Check if it has a constructor with __typeInfo for proper struct names
      if (
        value &&
        typeof value === 'object' &&
        value.constructor &&
        '__reflectType' in value.constructor
      ) {
        const reflectType = (value.constructor as { __reflectType?: Type })
          .__reflectType
        if (reflectType) {
          return reflectType
        }
      }

      if (
        value &&
        typeof value === 'object' &&
        value.constructor &&
        '__typeInfo' in value.constructor
      ) {
        const typeInfo = (
          value.constructor as { __typeInfo?: $.StructTypeInfo }
        ).__typeInfo
        if (typeInfo && isStructTypeInfo(typeInfo)) {
          const name = typeInfo.name ?? ''
          if (name === '') {
            return new StructType('', structFieldsFromTypeInfo(typeInfo))
          }
          const typeName = name.includes('.') ? name : `main.${name}`
          const regTypeInfo = builtinGetTypeByName(typeName)
          const fields =
            regTypeInfo && isStructTypeInfo(regTypeInfo) ?
              structFieldsFromTypeInfo(regTypeInfo)
            : structFieldsFromTypeInfo(typeInfo)
          return new StructType(typeName, fields)
        }
      }

      // Check if it has a constructor name we can use (fallback)
      const constructorName = (value as object).constructor?.name
      if (constructorName && constructorName !== 'Object') {
        return new StructType(constructorName, [])
      }

      // Default to struct type for plain objects
      return new StructType('struct', [])
    }
    default:
      return new BasicType(Interface, 'interface{}', 16)
  }
}

// Exported functions as required by godoc.txt
export function TypeOf(i: ReflectValue): Type {
  return internType(getTypeOf(i))
}

export function ValueOf(i: ReflectValue): Value {
  return new Value(i, getTypeOf(i))
}

export function TypeAssert(
  typeArgs: $.GenericTypeArgs | undefined,
  v: Value,
): [any, boolean] {
  const descriptor = typeArgs?.T
  if (!descriptor?.type) {
    return [v.Interface(), true]
  }
  return $.typeAssertTuple<any>(v.Interface(), descriptor.type)
}

export function ArrayOf(length: number, elem: Type): Type {
  return internType(new ArrayType(elem, length))
}

export function SliceOf(t: Type): Type {
  return internType(new SliceType(t))
}

export function PointerTo(t: Type | null): Type | null {
  if (t === null) return null
  return internType(new PointerType(t))
}

export function PtrTo(t: Type | null): Type | null {
  return PointerTo(t) // PtrTo is an alias for PointerTo
}

export function MapOf(key: Type, elem: Type): Type {
  return internType(new MapType(key, elem))
}

export function ChanOf(dir: ChanDir, t: Type): Type {
  return internType(new ChannelType(t, dir))
}

export function StructOf(fields: $.Slice<StructField>): Type {
  const inputFields = $.asArray(fields)
  const descriptors: StructFieldDescriptor[] = []
  const names = new Set<string>()
  let pkgPath = ''
  let offset = 0
  for (const [idx, field] of inputFields.entries()) {
    validateStructOfField(field, idx)
    if (field.PkgPath !== '') {
      if (pkgPath === '') {
        pkgPath = field.PkgPath
      } else if (pkgPath !== field.PkgPath) {
        throw new Error(
          `reflect.Struct: fields with different PkgPath ${pkgPath} and ${field.PkgPath}`,
        )
      }
    }
    if (names.has(field.Name) && field.Name !== '_') {
      throw new Error(`reflect.StructOf: duplicate field ${field.Name}`)
    }
    names.add(field.Name)

    const fieldOffset = alignOffset(offset, typeAlignment(field.Type))
    const tag = field.Tag?.toString()
    const descriptor: StructFieldDescriptor = {
      name: field.Name,
      key: field.Name === '_' ? `_${idx}` : field.Name,
      type: field.Type,
      ...(tag ? { tag } : {}),
      pkgPath: field.PkgPath,
      anonymous: field.Anonymous,
      index: [idx],
      offset: fieldOffset,
      exported: field.IsExported(),
    }
    descriptors.push(descriptor)
    offset = fieldOffset + field.Type.Size()
  }
  return internType(
    new StructType('', descriptors, '', structTypeString(descriptors)),
  )
}

function validateStructOfField(field: StructField, idx: number): void {
  if (field.Name === '') {
    throw new Error(`reflect.StructOf: field ${idx} has no name`)
  }
  if (!isValidStructFieldName(field.Name)) {
    throw new Error(`reflect.StructOf: field ${idx} has invalid name`)
  }
  if (!field.Type) {
    throw new Error(`reflect.StructOf: field ${idx} has no type`)
  }
  if (field.Anonymous && field.PkgPath !== '') {
    throw new Error(
      `reflect.StructOf: field "${field.Name}" is anonymous but has PkgPath set`,
    )
  }
  if (field.IsExported() && isUnexportedStructFieldName(field.Name)) {
    throw new Error(
      `reflect.StructOf: field "${field.Name}" is unexported but missing PkgPath`,
    )
  }
  validateAnonymousStructOfField(field)
}

function isValidStructFieldName(name: string): boolean {
  return /^[\p{L}_][\p{L}\p{N}_]*$/u.test(name)
}

function isUnexportedStructFieldName(name: string): boolean {
  const first = name.charCodeAt(0)
  return name[0] === '_' || (first >= 97 && first <= 122)
}

function validateAnonymousStructOfField(field: StructField): void {
  if (!field.Anonymous) {
    return
  }
  const typ = field.Type
  if (typ.Kind() === Ptr) {
    const elem = typ.Elem()
    if (elem.Kind() === Ptr || elem.Kind() === Interface) {
      throw new Error(
        `reflect.StructOf: illegal embedded field type ${typ.String()}`,
      )
    }
    if (embeddedMethodCount(typ) > 0) {
      throw new Error('reflect: embedded type with methods not implemented')
    }
    return
  }
  if (embeddedMethodCount(typ) > 0) {
    throw new Error('reflect: embedded type with methods not implemented')
  }
}

function embeddedMethodCount(typ: Type): number {
  if (typ.Kind() === Ptr) {
    return Math.max(typ.NumMethod(), typ.Elem().NumMethod())
  }
  return typ.NumMethod()
}

function structTypeString(fields: StructFieldDescriptor[]): string {
  if (fields.length === 0) {
    return 'struct {}'
  }
  return `struct { ${fields.map(structFieldString).join('; ')} }`
}

function structFieldString(field: StructFieldDescriptor): string {
  const tag = field.tag ? ` ${JSON.stringify(field.tag)}` : ''
  const prefix = field.anonymous ? '' : `${field.name} `
  return `${prefix}${field.type.String()}${tag}`
}

export function FuncOf(
  inTypes: $.Slice<Type | null>,
  outTypes: $.Slice<Type | null>,
  variadic: boolean,
): Type {
  const params = $.asArray(inTypes).map(funcOfType)
  const results = $.asArray(outTypes).map(funcOfType)
  if (
    variadic &&
    (params.length === 0 || params[params.length - 1].Kind() !== Slice)
  ) {
    throw new Error('reflect.FuncOf: last arg of variadic func must be slice')
  }
  if (params.length + results.length > 128) {
    throw new Error('reflect.FuncOf: too many arguments')
  }
  return internType(new FunctionType({ params, results, variadic }))
}

function funcOfType(typ: Type | null | undefined): Type {
  if (!typ) {
    throw new Error('reflect.FuncOf: nil Type')
  }
  return typ
}

export function TypeFor(typeArgs?: $.GenericTypeArgs): Type {
  const descriptor = typeArgs?.T
  if (descriptor?.type) {
    return internType(typeFromTypeInfo(descriptor.type))
  }
  if (descriptor?.methods) {
    const methods = Object.keys(descriptor.methods)
    if (methods.length !== 0) {
      const methodSignatures = methods.map((method) => ({
        name: method,
        args: [],
        returns: [],
      }))
      return internType(
        new InterfaceType(
          interfaceTypeString(methodSignatures),
          undefined,
          methodSignatures,
        ),
      )
    }
  }
  if (descriptor?.zero) {
    return internType(getTypeOf(descriptor.zero()))
  }
  return internType(new InterfaceType('interface{}'))
}

function typeFromTypeInfo(info: $.TypeInfo | string): Type {
  return typeFromTypeInfoWithSeen(info, new Set())
}

function typeFromTypeInfoWithSeen(
  info: $.TypeInfo | string,
  seen: Set<string>,
): Type {
  if (typeof info === 'string') {
    const registered = builtinGetTypeByName(info)
    if (registered) {
      const registeredName = registered.name ?? info
      if (seen.has(registeredName)) {
        return internType(
          shallowTypeFromRegisteredInfo(registeredName, registered),
        )
      }
      seen.add(registeredName)
      const typ = typeFromTypeInfoWithSeen(registered, seen)
      seen.delete(registeredName)
      return internType(typ)
    }
    return internType(StructType.createTypeFromFieldInfo(info))
  }
  switch (info.kind) {
    case $.TypeKind.Array:
      return internType(
        new ArrayType(
          typeFromTypeInfoWithSeen(
            info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
            seen,
          ),
          info.length,
        ),
      )
    case $.TypeKind.Basic:
      return internType(StructType.createTypeFromFieldInfo(info))
    case $.TypeKind.Channel:
      return internType(
        new ChannelType(
          typeFromTypeInfoWithSeen(
            info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
            seen,
          ),
          chanDirFromTypeInfo(info.direction),
        ),
      )
    case $.TypeKind.Function:
      return internType(functionTypeFromInfo(info, seen))
    case $.TypeKind.Interface:
      return internType(interfaceTypeFromInfo(info, seen))
    case $.TypeKind.Map:
      return internType(
        new MapType(
          typeFromTypeInfoWithSeen(
            info.keyType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
            seen,
          ),
          typeFromTypeInfoWithSeen(
            info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
            seen,
          ),
        ),
      )
    case $.TypeKind.Slice:
      return internType(
        new SliceType(
          typeFromTypeInfoWithSeen(
            info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
            seen,
          ),
        ),
      )
    case $.TypeKind.Struct:
      return internType(StructType.createTypeFromFieldInfo(info))
    case $.TypeKind.Pointer:
      return internType(
        new PointerType(
          typeFromTypeInfoWithSeen(
            info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
            seen,
          ),
        ),
      )
    default:
      return internType(StructType.createTypeFromFieldInfo(info))
  }
}

function shallowTypeFromRegisteredInfo(name: string, info: $.TypeInfo): Type {
  switch (info.kind) {
    case $.TypeKind.Interface:
      return new InterfaceType(name, name, info.methods ?? [])
    case $.TypeKind.Struct:
      return new StructType(name, [])
    case $.TypeKind.Function:
      return new FunctionType({ name })
    case $.TypeKind.Basic:
      return StructType.createTypeFromFieldInfo({
        kind: $.TypeKind.Basic,
        name: info.name ?? 'unknown',
        typeName: info.typeName ?? name,
      })
    default:
      return StructType.createTypeFromFieldInfo(name)
  }
}

function functionTypeFromInfo(
  info: $.FunctionTypeInfo,
  seen = new Set<string>(),
): Type {
  const params = (info.params ?? []).map((param) =>
    typeFromTypeInfoWithSeen(param, seen),
  )
  const results = (info.results ?? []).map((result) =>
    typeFromTypeInfoWithSeen(result, seen),
  )
  return new FunctionType({
    name: info.name,
    params,
    results,
    variadic: info.isVariadic ?? false,
  })
}

function functionTypeInfoFromType(typ: Type): $.FunctionTypeInfo {
  const params: (string | $.TypeInfo)[] = []
  for (let i = 0; i < typ.NumIn(); i++) {
    params.push(typeInfoFromReflectType(typ.In(i)))
  }
  const results: (string | $.TypeInfo)[] = []
  for (let i = 0; i < typ.NumOut(); i++) {
    results.push(typeInfoFromReflectType(typ.Out(i)))
  }
  const info: $.FunctionTypeInfo = {
    kind: $.TypeKind.Function,
    params,
    results,
  }
  if (typ.Name() !== '') {
    info.name = typ.String()
  }
  if (typ.IsVariadic()) {
    info.isVariadic = true
  }
  return info
}

export function typeInfoFromReflectType(typ: Type): string | $.TypeInfo {
  if (typ.PkgPath() !== '' && typ.Name() !== '') {
    return typ.String()
  }
  switch (typ.Kind()) {
    case Bool:
    case Int:
    case Int8:
    case Int16:
    case Int32:
    case Int64:
    case Uint:
    case Uint8:
    case Uint16:
    case Uint32:
    case Uint64:
    case Uintptr:
    case Float32:
    case Float64:
    case Complex64:
    case Complex128:
    case String:
    case UnsafePointer:
      return { kind: $.TypeKind.Basic, name: typ.String() }
    case Interface:
      return {
        kind: $.TypeKind.Interface,
        methods: typeMethods(typ).map((method) => ({
          name: method.name,
          args: method.args,
          returns: method.returns,
        })),
      }
    case Slice:
      return {
        kind: $.TypeKind.Slice,
        elemType: typeInfoFromReflectType(typ.Elem()),
      }
    case Array:
      return {
        kind: $.TypeKind.Array,
        elemType: typeInfoFromReflectType(typ.Elem()),
        length: typ.Len(),
      }
    case Ptr:
      return {
        kind: $.TypeKind.Pointer,
        elemType: typeInfoFromReflectType(typ.Elem()),
      }
    case Map:
      return {
        kind: $.TypeKind.Map,
        keyType: typeInfoFromReflectType(typ.Key()),
        elemType: typeInfoFromReflectType(typ.Elem()),
      }
    case Chan:
      return {
        kind: $.TypeKind.Channel,
        elemType: typeInfoFromReflectType(typ.Elem()),
        direction: channelDirectionFromString(typ.String()),
      }
    case Func:
      return functionTypeInfoFromType(typ)
    case Struct: {
      const fields =
        typ instanceof StructType ?
          typ.descriptors()
        : globalThis.Array.from({ length: typ.NumField() }, (_unused, idx) => {
            const field = typ.Field(idx)
            return {
              name: field.Name,
              key: structFieldStorageKey(typ, idx),
              type: field.Type,
              tag: field.Tag?.toString(),
              pkgPath: field.PkgPath,
              anonymous: field.Anonymous,
              index: [...field.Index],
              offset: field.Offset,
              exported: field.IsExported(),
            }
          })
      return {
        kind: $.TypeKind.Struct,
        name: typ.Name() === '' ? '' : typ.String(),
        methods: [],
        fields: fields.map((field) => ({
          name: field.name,
          key: field.key,
          type: typeInfoFromReflectType(field.type),
          ...(field.tag ? { tag: field.tag } : {}),
          ...(field.pkgPath ? { pkgPath: field.pkgPath } : {}),
          ...(field.anonymous ? { anonymous: true } : {}),
          index: [...field.index],
          offset: field.offset,
          exported: field.exported,
        })),
      }
    }
    default:
      return typ.String()
  }
}

function channelDirectionFromString(
  typeName: string,
): 'send' | 'receive' | 'both' {
  if (typeName.startsWith('<-chan ')) {
    return 'receive'
  }
  if (typeName.startsWith('chan<- ')) {
    return 'send'
  }
  return 'both'
}

function interfaceTypeFromInfo(
  info: $.InterfaceTypeInfo,
  seen = new Set<string>(),
): Type {
  const methods = info.methods ?? []
  if (methods.length === 0) {
    return new InterfaceType('interface{}', info.name, methods)
  }
  return new InterfaceType(
    interfaceTypeString(methods, seen),
    info.name,
    methods,
  )
}

function interfaceTypeString(
  methods: $.MethodSignature[],
  seen = new Set<string>(),
): string {
  return `interface { ${methods
    .map((method) => interfaceMethodString(method, seen))
    .join('; ')} }`
}

function interfaceMethodString(
  method: $.MethodSignature,
  seen: Set<string>,
): string {
  const args = method.args.map((arg) => methodArgString(arg, seen)).join(', ')
  const returns = method.returns.map((arg) => methodArgString(arg, seen))
  if (returns.length === 0) {
    return `${method.name}(${args})`
  }
  if (returns.length === 1) {
    return `${method.name}(${args}) ${returns[0]}`
  }
  return `${method.name}(${args}) (${returns.join(', ')})`
}

function methodArgString(arg: $.MethodArg, seen: Set<string>): string {
  return typeInfoString(arg.type, seen)
}

function typeInfoString(info: $.TypeInfo | string, seen: Set<string>): string {
  if (typeof info === 'string') {
    return info
  }
  switch (info.kind) {
    case $.TypeKind.Basic:
      return info.typeName ?? info.name ?? 'unknown'
    case $.TypeKind.Interface: {
      const name = info.name ?? ''
      if (name !== '' && seen.has(name)) {
        return name
      }
      if (info.methods.length === 0) {
        return 'interface{}'
      }
      if (name !== '') {
        seen.add(name)
      }
      const text = interfaceTypeString(info.methods, seen)
      if (name !== '') {
        seen.delete(name)
      }
      return text
    }
    case $.TypeKind.Struct:
      return info.name ?? 'struct'
    case $.TypeKind.Pointer:
      return `*${typeInfoString(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Slice:
      return `[]${typeInfoString(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Array:
      return `[${info.length}]${typeInfoString(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Map:
      return `map[${typeInfoString(
        info.keyType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}]${typeInfoString(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Function: {
      const params = (info.params ?? [])
        .map((param) => typeInfoString(param, seen))
        .join(', ')
      const results = (info.results ?? []).map((result) =>
        typeInfoString(result, seen),
      )
      if (results.length === 0) {
        return `func(${params})`
      }
      if (results.length === 1) {
        return `func(${params}) ${results[0]}`
      }
      return `func(${params}) (${results.join(', ')})`
    }
    case $.TypeKind.Channel:
      return `chan ${typeInfoString(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    default:
      return 'unknown'
  }
}

function chanDirFromTypeInfo(direction?: 'send' | 'receive' | 'both'): ChanDir {
  switch (direction) {
    case 'send':
      return SendDir
    case 'receive':
      return RecvDir
    default:
      return BothDir
  }
}

/**
 * getInterfaceTypeByName looks up a registered interface type by name
 * and returns a Type for it. Returns an interface{} type if not found.
 */
export function getInterfaceTypeByName(name: string): Type {
  const typeInfo = builtinGetTypeByName(name)
  if (typeInfo && isInterfaceTypeInfo(typeInfo)) {
    return new InterfaceType(name, name, typeInfo.methods ?? [])
  }
  return new InterfaceType('interface{}')
}

export function getInterfaceLiteralTypeByName(name: string): Type {
  const typeInfo = builtinGetTypeByName(name)
  if (typeInfo && isInterfaceTypeInfo(typeInfo)) {
    return interfaceTypeFromInfo(typeInfo)
  }
  return new InterfaceType('interface{}')
}

// Additional functions from merged files
export function canRangeFunc(t: Type): boolean {
  const kind = t.Kind()
  return kind === Slice || kind === Array || kind === String
}

export function canRangeFunc2(t: Type): boolean {
  const kind = t.Kind()
  return kind === Map
}

export function funcLayout(
  _t: Type,
  _rcvr: Type | null,
): { Type: Type | null; InCount: number; OutCount: number } {
  return {
    Type: null,
    InCount: 0,
    OutCount: 0,
  }
}

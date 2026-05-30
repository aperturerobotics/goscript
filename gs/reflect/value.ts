import * as $ from '@goscript/builtin/index.js'
import {
  Array,
  Bool,
  Float32,
  Float64,
  Int,
  Int16,
  Int32,
  Int64,
  Int8,
  Map,
  PointerTo,
  Ptr,
  Slice,
  SliceOf,
  Struct,
  String,
  Type,
  Uint,
  Uint16,
  Uint32,
  Uint64,
  Uint8,
  Uintptr,
  Value,
  Chan,
  BasicType,
  Invalid,
  structFieldStorageKey,
  typeInfoFromReflectType,
} from './type.js'
import {
  Pointer,
  ReflectValue,
  SelectCase,
  SelectRecv,
  SelectDefault,
} from './types.js'

interface ChannelObject {
  _sendQueue?: unknown[]
  send?: (value: unknown) => void
}

// Zero returns a Value representing the zero value for the specified type.
export function Zero(typ: Type | null): Value {
  if (typ === null) {
    return new Value() // Return invalid value for null type
  }
  return new Value(zeroReflectValue(typ), typ)
}

function zeroReflectValue(typ: Type): ReflectValue {
  switch (typ.Kind()) {
    case Bool:
      return false
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
      return 0
    case String:
      return ''
    case Slice:
    case Array:
      return []
    case Struct:
      return newStructValue(typ)
    default:
      return null
  }
}

function newStructValue(typ: Type): ReflectValue {
  const StructValue = class {
    public _fields: Record<string, $.VarRef<unknown>> = {}

    public clone(): unknown {
      const cloned = new StructValue()
      for (const key of Object.keys(this._fields)) {
        cloned._fields[key].value = this._fields[key].value
      }
      return cloned
    }
  }
  Object.defineProperty(StructValue, '__reflectType', { value: typ })
  Object.defineProperty(StructValue, '__typeInfo', {
    value: typeInfoFromReflectType(typ),
  })

  const value = new StructValue() as unknown as {
    _fields: Record<string, $.VarRef<ReflectValue>>
  } & Record<string, unknown>
  for (let i = 0; i < typ.NumField(); i++) {
    const field = typ.Field(i)
    const key = structFieldStorageKey(typ, i)
    const ref = $.varRef<ReflectValue>(zeroReflectValue(field.Type))
    value._fields[key] = ref
    Object.defineProperty(value, key, {
      enumerable: true,
      configurable: true,
      get: () => ref.value,
      set: (next: unknown) => {
        ref.value = next as ReflectValue
      },
    })
  }
  return value
}

// Copy copies the contents of src to dst until either dst has been filled
// or src has been exhausted. It returns the number of elements copied.
export function Copy(dst: Value, src: Value): number {
  // Extract the underlying arrays from the Value objects
  const dstArray = getArrayFromValue(dst)
  const srcArray = getArrayFromValue(src)

  if (!dstArray || !srcArray) {
    return 0
  }

  const count = Math.min(dstArray.length, srcArray.length)
  for (let i = 0; i < count; i++) {
    dstArray[i] = srcArray[i]
  }
  return count
}

// Helper function to extract the underlying array from a Value
function getArrayFromValue(value: Value): unknown[] | null {
  const val = (value as unknown as { value: ReflectValue }).value

  // Check for GoScript slice objects created by $.arrayToSlice
  if (val && typeof val === 'object' && '__meta__' in val) {
    const meta = (val as { __meta__?: { backing?: unknown[] } }).__meta__
    if (meta && meta.backing && globalThis.Array.isArray(meta.backing)) {
      return meta.backing
    }
  }

  // Check for regular JavaScript arrays
  if (globalThis.Array.isArray(val)) {
    return val
  }

  return null
}

// Indirect returns the value that v points to.
export function Indirect(v: Value): Value {
  // Check if this is a pointer type
  const type = v.Type()
  if (type.Kind() === Ptr) {
    // Ptr kind
    const elemType = type.Elem()
    if (elemType) {
      // Return a new Value with the same underlying value but the element type
      return new Value(
        (v as unknown as { value: ReflectValue }).value,
        elemType,
      )
    }
  }
  // For non-pointer types, just return the value as-is
  return v
}

// New returns a Value representing a pointer to a new zero value for the specified type.
export function New(typ: Type | null): Value {
  if (typ === null) {
    return new Value() // Return invalid value for null type
  }
  const ptrType = PointerTo(typ)
  return new Value($.varRef(zeroReflectValue(typ)), ptrType)
}

// NewAt returns a Value representing a pointer to the value at p.
export function NewAt(typ: Type | null, p: Pointer | unknown): Value {
  if (typ === null) {
    return new Value()
  }
  const ptrType = PointerTo(typ)
  const pointer = ownedPointerHandleFromPointerArg(p)
  if (pointer !== undefined) {
    return new Value($.ownedPointerRef(pointer) as $.VarRef<ReflectValue>, ptrType)
  }
  if (
    p &&
    typeof p === 'object' &&
    'value' in p &&
    (p as { value?: unknown }).value instanceof Value
  ) {
    const target = (p as { value: Value }).value
    const ref: $.VarRef<ReflectValue> = {
      get value(): ReflectValue {
        return target.Interface() as ReflectValue
      },
      set value(value: ReflectValue) {
        target.Set(new Value(value, typ))
      },
      __isVarRef: true,
    }
    return new Value(ref, ptrType)
  }
  throw new Error('reflect.NewAt requires a GoScript-owned pointer')
}

export function SliceAt(typ: Type | null, p: Pointer | unknown, n: number): Value {
  if (typ === null) {
    return new Value()
  }
  if (n < 0) {
    throw new Error('reflect.SliceAt: negative length')
  }
  if (p === null && n === 0) {
    return new Value(null, SliceOf(typ))
  }
  const pointer = ownedPointerHandleFromPointerArg(p)
  if (pointer === undefined) {
    throw new Error('reflect.SliceAt requires a GoScript-owned pointer')
  }
  const slice = $.sliceFromOwnedPointer(pointer, n)
  return new Value(slice as ReflectValue, SliceOf(typ))
}

function ownedPointerHandleFromPointerArg(
  p: unknown,
): $.OwnedPointerHandle<ReflectValue> | undefined {
  if ($.isOwnedPointerHandle(p)) {
    return p as $.OwnedPointerHandle<ReflectValue>
  }
  if ($.isVarRef(p)) {
    return $.ownedPointerFromRef(
      p as $.VarRef<ReflectValue>,
    ) as $.OwnedPointerHandle<ReflectValue> | undefined
  }
  return undefined
}

// MakeSlice returns a Value representing a new slice with the specified type, length, and capacity.
export function MakeSlice(typ: Type | null, len: number, _cap: number): Value {
  if (typ === null || typ.Kind() !== Slice) {
    throw new Error('reflect.MakeSlice of non-slice type')
  }

  // Create a slice with the specified length, filled with zero values
  const elemType = typ.Elem()
  if (!elemType) {
    throw new Error('slice type missing element type')
  }

  const zeroValue = Zero(elemType)
  const zeroVal = (zeroValue as unknown as { value: ReflectValue }).value
  const array = new globalThis.Array(len).fill(zeroVal)

  return new Value(array, typ)
}

// MakeMap returns a Value representing a new map with the specified type.
export function MakeMap(typ: Type | null): Value {
  if (typ === null || typ.Kind() !== Map) {
    throw new Error('reflect.MakeMap of non-map type')
  }

  const map = new globalThis.Map()
  return new Value(map, typ)
}

export function MakeMapWithSize(typ: Type | null, _n: number): Value {
  return MakeMap(typ)
}

// Append appends the values x to a slice and returns the resulting slice.
export function Append(s: Value, x: Value): Value {
  if (s.Kind() !== Slice) {
    throw new Error('reflect.Append of non-slice')
  }

  const array = getArrayFromValue(s)
  if (!array) {
    throw new Error('cannot get array from slice value')
  }

  const newValue = (x as unknown as { value: ReflectValue }).value
  const newArray = [...array, newValue]

  return new Value(newArray, s.Type())
}

export function AppendSlice(s: Value, t: Value): Value {
  if (s.Kind() !== Slice || t.Kind() !== Slice) {
    throw new Error('reflect.AppendSlice of non-slice')
  }
  const left = getArrayFromValue(s)
  const right = getArrayFromValue(t)
  if (!left || !right) {
    throw new Error('cannot get array from slice value')
  }
  return new Value([...left, ...right], s.Type())
}

// MakeChan returns a Value representing a new channel with the specified type.
export function MakeChan(typ: Type, buffer: number): Value {
  if (typ.Kind() !== Chan) {
    throw new Error('reflect.MakeChan of non-chan type')
  }

  const elemType = typ.Elem()
  if (!elemType) {
    throw new Error('channel type missing element type')
  }

  // Get the zero value for the channel element type
  const zeroValue = Zero(elemType)
  const zeroVal = (zeroValue as unknown as { value: ReflectValue }).value

  // Create a channel using the builtin makeChannel function
  const channel = $.makeChannel(buffer, zeroVal)
  return new Value(channel, typ)
}

// Select executes a select operation on the provided cases.
// It returns the index of the chosen case, the received value (if applicable), and whether the receive was successful.
export function Select(cases: $.Slice<SelectCase>): [number, Value, boolean] {
  // Extract the backing array from the GoScript slice
  let selectCases: SelectCase[] = []

  if (cases && typeof cases === 'object') {
    if ('__meta__' in cases) {
      // This is a GoScript SliceProxy, extract the backing array
      const meta = (
        cases as {
          __meta__?: {
            backing?: SelectCase[]
            offset?: number
            length?: number
          }
        }
      ).__meta__
      if (meta && meta.backing) {
        const offset = meta.offset ?? 0
        const length = meta.length ?? meta.backing.length
        selectCases = meta.backing.slice(offset, offset + length)
      }
    } else if (globalThis.Array.isArray(cases)) {
      // This is a plain array (optimized case where offset=0 and length=capacity)
      selectCases = cases as SelectCase[]
    }
  }

  // Check for ready channels (channels with queued values)
  for (let i = 0; i < selectCases.length; i++) {
    const selectCase = selectCases[i]
    if (selectCase.Dir.valueOf() === SelectRecv.valueOf() && selectCase.Chan) {
      const channelValue = selectCase.Chan
      const channelObj = (channelValue as unknown as { value: unknown })
        .value as ChannelObject

      // Check if there are queued values to receive
      if (
        channelObj &&
        channelObj._sendQueue &&
        channelObj._sendQueue.length > 0
      ) {
        const receivedValue = channelObj._sendQueue.shift() as ReflectValue // Remove from queue
        const elemType = channelValue.Type().Elem()
        if (elemType) {
          const recvVal = new Value(receivedValue, elemType)
          return [i, recvVal, true]
        }
      }
    }
  }

  // Look for default case if no channels are ready
  for (let i = 0; i < selectCases.length; i++) {
    const selectCase = selectCases[i]
    if (selectCase.Dir.valueOf() === SelectDefault.valueOf()) {
      // Default case is immediately available
      return [i, new Value(null, new BasicType(Invalid, 'invalid')), false]
    }
  }

  // If no channels are ready and no default case, return first case as fallback
  if (selectCases.length > 0) {
    const firstCase = selectCases[0]
    if (firstCase.Dir.valueOf() === SelectRecv.valueOf() && firstCase.Chan) {
      // Simulate receiving a zero value
      const elemType = firstCase.Chan.Type().Elem()
      if (elemType) {
        const zeroVal = Zero(elemType)
        return [0, zeroVal, true]
      }
    }
    return [0, new Value(null, new BasicType(Invalid, 'invalid')), false]
  }

  // Fallback
  return [0, new Value(null, new BasicType(Invalid, 'invalid')), false]
}

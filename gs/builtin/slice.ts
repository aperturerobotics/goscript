import { varRef, type VarRef } from './varRef.js'

export class GoBinaryString extends String {
  readonly bytes: Uint8Array

  constructor(bytes: Uint8Array) {
    super(bytesToBinaryString(bytes))
    this.bytes = bytes.slice()
  }

  toString(): string {
    return bytesToBinaryString(this.bytes)
  }

  valueOf(): string {
    return this.toString()
  }

  [Symbol.toPrimitive](): string {
    return this.toString()
  }
}

type GoStringValue = string | GoBinaryString
type GoStringBytes = GoStringValue | Slice<number> | Uint8Array

function isGoStringValue(value: unknown): value is GoStringValue {
  return typeof value === 'string' || value instanceof GoBinaryString
}

function goStringBytes(str: GoStringValue): Uint8Array {
  if (str instanceof GoBinaryString) {
    return str.bytes.slice()
  }
  return new TextEncoder().encode(str)
}

function goStringComparableBytes(value: GoStringBytes): Uint8Array {
  if (isGoStringValue(value)) {
    return goStringBytes(value)
  }
  if (value instanceof Uint8Array) {
    return value
  }
  if (value === null || value === undefined) {
    return new Uint8Array(0)
  }
  return Uint8Array.from(asArray(value))
}

function goStringFromBytes(bytes: Uint8Array): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return new GoBinaryString(bytes) as unknown as string
  }
}

/**
 * GoSliceObject contains metadata for complex slice views
 */
interface GoSliceObject<T> {
  backing: T[] // The backing array
  offset: number // Offset into the backing array
  length: number // Length of the slice
  capacity: number // Capacity of the slice
  target?: T[] // Materialized proxy target for JS array operations
}

const addressStride = 0x100000000
let nextAddressBase = 1
const addressBases = new WeakMap<object, number>()

/**
 * SliceProxy is a proxy object for complex slices
 */
export type SliceProxy<T> = T[] & {
  __meta__: GoSliceObject<T>
}

type ByteSlice = Uint8Array & {
  __meta__?: GoSliceObject<number>
}

function sliceIndexProperty(prop: string | symbol): number {
  if (typeof prop !== 'string' || prop.length === 0) {
    return -1
  }
  let index = 0
  for (let i = 0; i < prop.length; i++) {
    const digit = prop.charCodeAt(i) - 48
    if (digit < 0 || digit > 9) {
      return -1
    }
    index = index * 10 + digit
  }
  return index
}

/**
 * Slice<T> is a union type that is either a plain array or a proxy
 * null represents the nil state.
 *
 * Slice<number> can be represented as Uint8Array.
 */
export type Slice<T> =
  | T[]
  | SliceProxy<T>
  | null
  | (T extends number ? Uint8Array : never)

/**
 * wrapSliceProxy wraps a SliceProxy in a Proxy to intercept index access
 * and route it through the backing array.
 */
function wrapSliceProxy<T>(proxy: SliceProxy<T>): SliceProxy<T> {
  const meta = proxy.__meta__
  meta.target = proxy
  const handler = {
    get(target: any, prop: string | symbol): any {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index < meta.length) {
          return meta.backing[meta.offset + index]
        }
        throw new Error(
          `Slice index out of range: ${index} >= ${meta.length}`,
        )
      }

      if (prop === 'length') {
        return meta.length
      }

      if (prop === '__meta__') {
        return meta
      }

      return Reflect.get(target, prop)
    },

    set(target: any, prop: string | symbol, value: any): boolean {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index < meta.length) {
          meta.backing[meta.offset + index] = value
          target[index] = value // Also update the proxy target for consistency
          return true
        }
        throw new Error(
          `Slice index out of range: ${index} >= ${meta.length}`,
        )
      }

      if (prop === 'length' || prop === '__meta__') {
        return false
      }

      return Reflect.set(target, prop, value)
    },
  }

  return new Proxy(proxy, handler) as SliceProxy<T>
}

function sliceProxyFromBacking<T>(
  backing: T[],
  offset: number,
  length: number,
  capacity: number,
  target?: T[],
): SliceProxy<T> {
  const proxyTargetArray = (target ?? new Array<T>(length)) as SliceProxy<T>
  proxyTargetArray.length = length
  if (target === undefined) {
    for (let i = 0; i < length; i++) {
      proxyTargetArray[i] = backing[offset + i]
    }
  }
  proxyTargetArray.__meta__ = { backing, offset, length, capacity }
  return wrapSliceProxy(proxyTargetArray)
}

// asArray converts a slice to a JavaScript array.
export function asArray<T>(slice: Slice<T>): T[] {
  if (slice === null || slice === undefined) {
    return []
  }

  if (slice instanceof Uint8Array) {
    return Array.from(slice) as T[]
  }

  if (isComplexSlice(slice)) {
    const result: T[] = []
    for (let i = 0; i < slice.__meta__.length; i++) {
      result.push(slice.__meta__.backing[slice.__meta__.offset + i])
    }
    return result
  }

  if (Array.isArray(slice)) {
    return slice
  }

  return []
}

export function sliceToArray<T>(
  slice: Slice<T> | Uint8Array,
  length: number,
  typeHint?: string,
): T[] | Uint8Array {
  if (len(slice) < length) {
    throw new Error(
      `runtime error: cannot convert slice with length ${len(slice)} to array with length ${length}`,
    )
  }
  if (typeHint === 'byte') {
    return new Uint8Array(
      asArray(slice as Slice<T>).slice(0, length) as number[],
    )
  }
  return asArray(slice as Slice<T>).slice(0, length)
}

export function sliceToArrayPointer<T>(
  slice: Slice<T> | Uint8Array,
  length: number,
  typeHint?: string,
): VarRef<T[] | Uint8Array> {
  if (len(slice) < length) {
    throw new Error(
      `runtime error: cannot convert slice with length ${len(slice)} to array pointer with length ${length}`,
    )
  }
  if (typeHint === 'byte') {
    if (slice instanceof Uint8Array) {
      return varRef(goSlice(slice, 0, length) as unknown as Uint8Array)
    }
    return varRef(
      goSlice(slice as Slice<T>, 0, length) as unknown as Uint8Array,
    )
  }
  if (slice instanceof Uint8Array) {
    return varRef(goSlice(slice, 0, length) as unknown as T[])
  }
  return varRef(goSlice(slice, 0, length) as T[])
}

/**
 * isComplexSlice checks if a slice is a complex slice (has __meta__ property)
 */
function isComplexSlice<T>(slice: Slice<T>): slice is SliceProxy<T> {
  return (
    slice !== null &&
    slice !== undefined &&
    typeof slice === 'object' &&
    '__meta__' in slice &&
    slice.__meta__ !== undefined
  )
}

function normalizeSliceIndex(value: number | undefined): number | undefined {
  if (value === undefined) {
    return undefined
  }
  return Number(value)
}

function byteSliceMeta(slice: Uint8Array): GoSliceObject<number> | undefined {
  return (slice as ByteSlice).__meta__
}

function byteSliceView(
  backing: Uint8Array,
  offset: number,
  length: number,
  capacity: number,
): Uint8Array {
  const view = backing.subarray(offset, offset + length) as ByteSlice
  if (capacity !== length) {
    view.__meta__ = {
      backing: backing as unknown as number[],
      offset,
      length,
      capacity,
    }
  }
  return view
}

/**
 * isSliceProxy checks if a slice is a SliceProxy (has __meta__ property)
 * This is an alias for isComplexSlice for better type hinting
 */
export function isSliceProxy<T>(slice: Slice<T>): slice is SliceProxy<T> {
  return isComplexSlice(slice)
}

/**
 * Creates a new slice with the specified length and capacity.
 * @param length The length of the slice.
 * @param capacity The capacity of the slice (optional).
 * @returns A new slice.
 */
export const makeSlice = <T>(
  length: number,
  capacity?: number,
  typeHint?: string,
  zeroFactory?: () => T,
): Slice<T> => {
  if (typeHint === 'byte') {
    const actualCapacity = capacity === undefined ? length : capacity
    if (length < 0 || actualCapacity < 0 || length > actualCapacity) {
      throw new Error(
        `Invalid slice length (${length}) or capacity (${actualCapacity})`,
      )
    }

    // If capacity equals length, use Uint8Array directly for efficiency
    if (actualCapacity === length) {
      return new Uint8Array(length) as Slice<T>
    }

    return byteSliceView(new Uint8Array(actualCapacity), 0, length, actualCapacity) as Slice<T>
  }

  const actualCapacity = capacity === undefined ? length : capacity
  if (length < 0 || actualCapacity < 0 || length > actualCapacity) {
    throw new Error(
      `Invalid slice length (${length}) or capacity (${actualCapacity})`,
    )
  }

  const zeroValue = (): T => {
    if (zeroFactory !== undefined) {
      return zeroFactory()
    }
    switch (typeHint) {
      case 'number':
        return 0 as T
      case 'boolean':
        return false as T
      case 'string':
        return '' as T
      default:
        return null as T // Default for objects, complex types, or unspecified
    }
  }

  const backingArr = new Array<T>(actualCapacity)
  // Go zero-initializes the whole backing array. Elements beyond len become
  // observable when a slice is resliced up to cap.
  for (let i = 0; i < actualCapacity; i++) {
    backingArr[i] = zeroValue()
  }

  // OPTIMIZATION: If length equals capacity, return backing array directly
  if (length === actualCapacity) {
    return backingArr as Slice<T>
  }

  // The proxyTargetArray serves as the shell for the proxy.
  // Its elements up to 'length' should reflect the initialized part of the slice.
  const proxyTargetArray = new Array<T>(length)
  for (let i = 0; i < length; i++) {
    proxyTargetArray[i] = backingArr[i]
  }

  const proxy = proxyTargetArray as SliceProxy<T>
  proxy.__meta__ = {
    backing: backingArr,
    offset: 0,
    length: length,
    capacity: actualCapacity,
  }

  // Create a proper Proxy with the handler for SliceProxy behavior
  const handler = {
    get(target: any, prop: string | symbol): any {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index < target.__meta__.length) {
          return target.__meta__.backing[target.__meta__.offset + index]
        }
        throw new Error(
          `Slice index out of range: ${index} >= ${target.__meta__.length}`,
        )
      }

      if (prop === 'length') {
        return target.__meta__.length
      }

      if (prop === '__meta__') {
        return target.__meta__
      }

      return Reflect.get(target, prop)
    },

    set(target: any, prop: string | symbol, value: any): boolean {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index < target.__meta__.length) {
          target.__meta__.backing[target.__meta__.offset + index] = value
          target[index] = value // Also update the proxy target for consistency
          return true
        }
        throw new Error(
          `Slice index out of range: ${index} >= ${target.__meta__.length}`,
        )
      }

      if (prop === 'length' || prop === '__meta__') {
        return false
      }

      return Reflect.set(target, prop, value)
    },
  }

  return new Proxy(proxy, handler) as unknown as SliceProxy<T>
}

/**
 * goSlice creates a slice from s[low:high:max]
 * Arguments mirror Go semantics; omitted indices are undefined.
 *
 * @param s The original slice
 * @param low Starting index (defaults to 0)
 * @param high Ending index (defaults to s.length)
 * @param max Capacity limit (defaults to original capacity)
 */
// Overload for Uint8Array - returns Slice<number> (which includes Uint8Array)
export function goSlice(
  s: Uint8Array,
  low?: number,
  high?: number,
  max?: number,
): Slice<number>
// Generic overload for other slice types
export function goSlice<T>(
  s: Slice<T>,
  low?: number,
  high?: number,
  max?: number,
): Slice<T>
export function goSlice<T>( // T can be number for Uint8Array case
  s: Slice<T> | Uint8Array,
  low?: number,
  high?: number,
  max?: number,
): Slice<T> {
  low = normalizeSliceIndex(low)
  high = normalizeSliceIndex(high)
  max = normalizeSliceIndex(max)

  const handler = {
    get(target: any, prop: string | symbol): any {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index < target.__meta__.length) {
          return target.__meta__.backing[target.__meta__.offset + index]
        }
        throw new Error(
          `Slice index out of range: ${index} >= ${target.__meta__.length}`,
        )
      }

      if (prop === 'length') {
        return target.__meta__.length
      }

      if (prop === '__meta__') {
        return target.__meta__
      }

      if (
        prop === 'slice' ||
        prop === 'map' ||
        prop === 'filter' ||
        prop === 'reduce' ||
        prop === 'forEach' ||
        prop === Symbol.iterator
      ) {
        const backingSlice = target.__meta__.backing.slice(
          target.__meta__.offset,
          target.__meta__.offset + target.__meta__.length,
        )
        return backingSlice[prop].bind(backingSlice)
      }

      return Reflect.get(target, prop)
    },

    set(target: any, prop: string | symbol, value: any): boolean {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index < target.__meta__.length) {
          target.__meta__.backing[target.__meta__.offset + index] = value
          target[index] = value
          return true
        }
        if (
          index === target.__meta__.length &&
          target.__meta__.length < target.__meta__.capacity
        ) {
          target.__meta__.backing[target.__meta__.offset + index] = value
          target[index] = value
          target.__meta__.length++
          return true
        }
        throw new Error(
          `Slice index out of range: ${index} >= ${target.__meta__.length}`,
        )
      }

      if (prop === 'length' || prop === '__meta__') {
        return false
      }

      return Reflect.set(target, prop, value)
    },
  }

  if (s instanceof Uint8Array) {
    const meta = byteSliceMeta(s)
    const metaBacking = meta?.backing as unknown
    const backing =
      metaBacking instanceof Uint8Array ? metaBacking : s
    const baseOffset = meta?.offset ?? 0
    const baseCapacity = meta?.capacity ?? s.length
    const actualLow = low ?? 0
    const actualHigh = high ?? s.length

    if (
      actualLow < 0 ||
      actualHigh < actualLow ||
      actualLow > baseCapacity ||
      actualHigh > baseCapacity
    ) {
      throw new Error(
        `Invalid slice indices: low ${actualLow}, high ${actualHigh} for Uint8Array with capacity ${baseCapacity}`,
      )
    }

    const newLength = actualHigh - actualLow

    if (max !== undefined) {
      if (max < actualHigh || max > baseCapacity) {
        // max is relative to the original s.length (capacity)
        throw new Error(
          `Invalid max index: ${max}. Constraints: low ${actualLow} <= high ${actualHigh} <= max <= capacity ${baseCapacity}`,
        )
      }

      const newCap = max - actualLow // Capacity of the new slice view
      return byteSliceView(
        backing,
        baseOffset + actualLow,
        newLength,
        newCap,
      ) as Slice<T>
    }

    return byteSliceView(
      backing,
      baseOffset + actualLow,
      newLength,
      baseCapacity - actualLow,
    ) as Slice<T>
  }

  // Handle nil slices - in Go, slicing a nil slice with valid bounds returns nil
  if (s === null || s === undefined) {
    low = low ?? 0
    high = high ?? 0

    if (low < 0 || high < low) {
      throw new Error(`Invalid slice indices: ${low}:${high}`)
    }

    if (low !== 0 || high !== 0) {
      throw new Error(
        `runtime error: slice bounds out of range [:${high}] with capacity 0`,
      )
    }

    if (max !== undefined && max !== 0) {
      throw new Error(
        `runtime error: slice bounds out of range [::${max}] with capacity 0`,
      )
    }

    return null as Slice<T>
  }

  const slen = len(s)
  low = low ?? 0
  high = high ?? slen

  if (low < 0 || high < low) {
    throw new Error(`Invalid slice indices: ${low}:${high}`)
  }

  // In Go, high can be up to capacity, not just length
  const scap = cap(s)
  if (high > scap) {
    throw new Error(`Slice index out of range: ${high} > ${scap}`)
  }

  if (
    Array.isArray(s) &&
    !isComplexSlice(s) &&
    low === 0 &&
    high === s.length &&
    max === undefined
  ) {
    return s
  }

  let backing: T[]
  let oldOffset = 0
  let oldCap = scap

  // Get the backing array and offset
  if (isComplexSlice(s)) {
    backing = s.__meta__.backing
    oldOffset = s.__meta__.offset
    oldCap = s.__meta__.capacity
  } else {
    backing = s as T[]
  }

  let newCap
  if (max !== undefined) {
    if (max < high) {
      throw new Error(`Invalid slice indices: ${low}:${high}:${max}`)
    }
    if (isComplexSlice(s) && max > oldOffset + oldCap) {
      throw new Error(
        `Slice index out of range: ${max} > ${oldOffset + oldCap}`,
      )
    }
    if (!isComplexSlice(s) && max > s.length) {
      throw new Error(`Slice index out of range: ${max} > ${s.length}`)
    }
    newCap = max - low
  } else {
    // For slices of slices, capacity should be the capacity of the original slice minus the low index
    if (isComplexSlice(s)) {
      newCap = oldCap - low
    } else {
      newCap = s.length - low
    }
  }

  const newLength = high - low
  const newOffset = oldOffset + low

  // OPTIMIZATION: If the result would have offset=0 and length=capacity, return backing directly
  if (newOffset === 0 && newLength === newCap && backing.length === newLength) {
    return backing as Slice<T>
  }

  // Create an array-like target with the correct length
  const proxyTargetArray = new Array<T>(newLength)
  // Note: We don't need to initialize the values here since the proxy handler
  // will fetch them from the backing array when accessed

  const proxy = proxyTargetArray as SliceProxy<T>
  proxy.__meta__ = {
    backing: backing,
    offset: newOffset,
    length: newLength,
    capacity: newCap,
  }

  // const handler = { ... } // Handler is now defined at the top

  return new Proxy(proxy, handler) as unknown as SliceProxy<T>
}

/**
 * Converts a JavaScript array to a Go slice.
 * For multi-dimensional arrays, recursively converts nested arrays to slices.
 * @param arr The JavaScript array to convert
 * @param depth How many levels of nesting to convert (default: 1, use Infinity for all levels)
 * @returns A Go slice containing the same elements
 */
export const arrayToSlice = <T>(
  arr: T[] | null | undefined,
  depth: number = 1,
): Slice<T> => {
  if (arr == null) return [] as T[]

  if (arr.length === 0) return arr

  // OPTIMIZATION: For arrays where offset=0 and length=capacity, return the array directly
  // if we're not doing deep conversion
  if (depth === 1) {
    return arr
  }

  const target = {
    __meta__: {
      backing: arr,
      offset: 0,
      length: arr.length,
      capacity: arr.length,
    },
  }

  const handler = {
    get(target: any, prop: string | symbol): any {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index < target.__meta__.length) {
          return target.__meta__.backing[target.__meta__.offset + index]
        }
        throw new Error(
          `Slice index out of range: ${index} >= ${target.__meta__.length}`,
        )
      }

      if (prop === 'length') {
        return target.__meta__.length
      }

      if (prop === '__meta__') {
        return target.__meta__
      }

      if (
        prop === 'slice' ||
        prop === 'map' ||
        prop === 'filter' ||
        prop === 'reduce' ||
        prop === 'forEach' ||
        prop === Symbol.iterator
      ) {
        const backingSlice = target.__meta__.backing.slice(
          target.__meta__.offset,
          target.__meta__.offset + target.__meta__.length,
        )
        return backingSlice[prop].bind(backingSlice)
      }

      return Reflect.get(target, prop)
    },

    set(target: any, prop: string | symbol, value: any): boolean {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index < target.__meta__.length) {
          target.__meta__.backing[target.__meta__.offset + index] = value
          return true
        }
        if (
          index === target.__meta__.length &&
          target.__meta__.length < target.__meta__.capacity
        ) {
          target.__meta__.backing[target.__meta__.offset + index] = value
          target.__meta__.length++
          return true
        }
        throw new Error(
          `Slice index out of range: ${index} >= ${target.__meta__.length}`,
        )
      }

      if (prop === 'length' || prop === '__meta__') {
        return false
      }

      return Reflect.set(target, prop, value)
    },
  }

  // Recursively convert nested arrays if depth > 1
  if (depth > 1 && arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (!isComplexSlice(item as any) && Array.isArray(item)) {
        arr[i] = arrayToSlice(item as any[], depth - 1) as any
      }
    }
  }

  return new Proxy(target, handler) as unknown as SliceProxy<T>
}

/**
 * Returns the length of a collection (string, array, slice, map, or set).
 * @param obj The collection to get the length of.
 * @returns The length of the collection.
 */
export const len = <T = unknown, V = unknown>(
  obj:
    | GoStringValue
    | Array<T>
    | Slice<T>
    | Map<T, V>
    | Set<T>
    | Uint8Array
    | { len(): number }
    | null
    | undefined,
): number => {
  if (obj === null || obj === undefined) {
    return 0
  }

  if (typeof obj === 'string') {
    return stringLen(obj)
  }

  if (obj instanceof Uint8Array) {
    return obj.length
  }

  if (Array.isArray(obj)) {
    const meta = (obj as unknown as SliceProxy<T>).__meta__
    if (meta !== undefined) {
      return meta.length
    }
    return obj.length
  }

  if (obj instanceof Map || obj instanceof Set) {
    return obj.size
  }

  if (obj instanceof GoBinaryString) {
    return stringLen(obj)
  }

  if (isComplexSlice(obj as any)) {
    return (obj as unknown as SliceProxy<T>).__meta__.length
  }

  if (typeof (obj as any).len === 'function') {
    return (obj as { len(): number }).len()
  }

  throw new Error('cannot determine len of this type')
}

/**
 * Returns the capacity of a slice.
 * @param obj The slice.
 * @returns The capacity of the slice.
 */
export const cap = <T>(
  obj: Slice<T> | Uint8Array | { cap(): number } | null | undefined,
): number => {
  if (obj === null || obj === undefined) {
    return 0
  }

  if (isComplexSlice(obj as any)) {
    return (obj as SliceProxy<T>).__meta__.capacity
  }

  if (obj instanceof Uint8Array) {
    return obj.length // Uint8Array capacity is its length
  }

  if (Array.isArray(obj)) {
    return obj.length
  }

  if (typeof (obj as any).cap === 'function') {
    return (obj as { cap(): number }).cap()
  }

  return 0
}

/**
 * Appends elements to a slice.
 * Note: In Go, append can return a new slice if the underlying array is reallocated.
 * This helper emulates that by returning the modified or new slice.
 * @param slice The slice to append to.
 * @param elements The elements to append.
 * @returns The modified or new slice.
 */
export function append(slice: Uint8Array, ...elements: any[]): Uint8Array
// Overload for null slice with number elements - returns number slice (Bytes compatible)
export function append(slice: null, ...elements: number[]): Slice<number>
export function append<T>(slice: null, ...elements: T[]): Slice<T>
export function append<T>(slice: Slice<T>, ...elements: any[]): Slice<T>
export function append<T>(
  slice: Slice<T> | Uint8Array | null,
  ...elements: any[]
): Slice<T> {
  // 1. Flatten all elements from the varargs `...elements` into `varargsElements`.
  // Determine if the result should be a Uint8Array.
  const inputIsUint8Array = slice instanceof Uint8Array
  const produceUint8Array = inputIsUint8Array

  // If producing Uint8Array, all elements must be numbers and potentially flattened from other Uint8Arrays/number slices.
  if (produceUint8Array) {
    return appendByteSlice(slice as Uint8Array, elements) as any
  }

  // Handle generic Slice<T> (non-Uint8Array result).
  // In this case, `elements` are treated as individual items to append,
  // as the Go transpiler is responsible for spreading (`...`) if needed.
  const numAdded = elements.length

  if (numAdded === 0) {
    return slice as any
  }

  let originalElements: T[] | undefined
  let oldLength = 0
  let oldCapacity: number
  let isOriginalComplex = false
  let originalBacking: T[] | undefined = undefined
  let originalTarget: T[] | undefined = undefined
  let originalOffset = 0

  if (slice === null || slice === undefined) {
    oldCapacity = 0
  } else if (isComplexSlice(slice)) {
    const meta = slice.__meta__
    oldLength = meta.length
    oldCapacity = meta.capacity
    isOriginalComplex = true
    originalBacking = meta.backing
    originalTarget = meta.target
    originalOffset = meta.offset
  } else {
    // Simple T[] array
    originalElements = (slice as T[]).slice()
    oldLength = originalElements.length
    oldCapacity = oldLength
  }
  const newLength = oldLength + numAdded

  // Case 1: Modify in-place if original was SliceProxy and has enough capacity.
  if (isOriginalComplex && newLength <= oldCapacity && originalBacking) {
    for (let i = 0; i < numAdded; i++) {
      originalBacking[originalOffset + oldLength + i] = elements[i] as T
    }
    const target = originalTarget
    if (target !== undefined) {
      for (let i = 0; i < numAdded; i++) {
        target[oldLength + i] = elements[i] as T
      }
    }
    return sliceProxyFromBacking(
      originalBacking,
      originalOffset,
      newLength,
      oldCapacity,
      target,
    ) as any
  }

  // Case 2: Reallocation is needed.
  let newCapacity = oldCapacity
  if (newCapacity === 0) {
    newCapacity = newLength
  } else if (oldLength < 1024) {
    newCapacity = Math.max(oldCapacity * 2, newLength)
  } else {
    newCapacity = Math.max(oldCapacity + Math.floor(oldCapacity / 4), newLength)
  }
  if (newCapacity < newLength) {
    newCapacity = newLength
  }

  const newBacking = new Array<T>(newCapacity)
  if (isOriginalComplex && originalBacking) {
    for (let i = 0; i < oldLength; i++) {
      newBacking[i] = originalBacking[originalOffset + i]
    }
  } else if (originalElements !== undefined) {
    for (let i = 0; i < oldLength; i++) {
      newBacking[i] = originalElements[i]
    }
  }
  for (let i = 0; i < numAdded; i++) {
    newBacking[oldLength + i] = elements[i] as T
  }

  return sliceProxyFromBacking(newBacking, 0, newLength, newCapacity) as any
}

function appendByteSlice(slice: Uint8Array, elements: any[]): Uint8Array {
  const meta = byteSliceMeta(slice)
  const metaBacking = meta?.backing as unknown
  const backing =
    metaBacking instanceof Uint8Array ? metaBacking : slice
  const offset = meta?.offset ?? 0
  const oldLength = slice.length
  const oldCapacity = meta?.capacity ?? oldLength
  let added = 0
  for (const item of elements) {
    added += byteElementLength(item)
  }
  const newLength = oldLength + added
  if (newLength <= oldCapacity) {
    const view = byteSliceView(backing, offset, newLength, oldCapacity)
    writeByteElements(view, oldLength, elements)
    return view
  }
  const next = new Uint8Array(newLength)
  next.set(slice)
  writeByteElements(next, oldLength, elements)
  return next
}

function byteElementLength(item: any): number {
  if (item instanceof Uint8Array) {
    return item.length
  }
  if (isComplexSlice(item) || Array.isArray(item)) {
    return len(item as Slice<any>)
  }
  if (typeof item !== 'number') {
    throw new Error('Cannot produce Uint8Array: appended elements contain non-numbers.')
  }
  return 1
}

function writeByteElements(dst: Uint8Array, offset: number, elements: any[]): void {
  let cursor = offset
  for (const item of elements) {
    if (item instanceof Uint8Array) {
      dst.set(item, cursor)
      cursor += item.length
      continue
    }
    if (isComplexSlice(item) || Array.isArray(item)) {
      const itemLen = len(item as Slice<any>)
      for (let i = 0; i < itemLen; i++) {
        const value = (item as any)[i]
        if (typeof value !== 'number') {
          throw new Error(
            'Cannot produce Uint8Array: appended elements contain non-numbers.',
          )
        }
        dst[cursor] = value
        cursor++
      }
      continue
    }
    if (typeof item !== 'number') {
      throw new Error('Cannot produce Uint8Array: appended elements contain non-numbers.')
    }
    dst[cursor] = item
    cursor++
  }
}

/**
 * Copies elements from src to dst.
 * @param dst The destination slice.
 * @param src The source slice or string.
 * @returns The number of elements copied.
 */
export function copy(dst: Uint8Array, src: Uint8Array | string): number
export function copy(dst: Uint8Array, src: Slice<number>): number
export function copy<T>(dst: Slice<T>, src: Slice<T>): number
export function copy<T>(dst: Slice<T>, src: string): number
export function copy<T>(
  dst: Slice<T> | Uint8Array,
  src: Slice<T> | Uint8Array | GoStringValue,
): number {
  if (dst === null) {
    return 0
  }

  // Handle string source first
  if (isGoStringValue(src)) {
    return copyFromString(dst, src)
  }

  if (src === null) {
    return 0
  }

  // Now we know src is Slice<T> | Uint8Array
  const dstLen = dst instanceof Uint8Array ? dst.length : len(dst)
  const srcLen = src instanceof Uint8Array ? src.length : len(src)
  const count = Math.min(dstLen, srcLen)

  if (count === 0) {
    return 0
  }

  // Handle all combinations of dst and src types
  if (dst instanceof Uint8Array && src instanceof Uint8Array) {
    // Uint8Array to Uint8Array
    dst.set(src.subarray(0, count))
    return count
  }

  if (dst instanceof Uint8Array) {
    // Uint8Array destination, Slice<number> source
    return copyToUint8Array(dst, src as Slice<number>, count)
  }

  if (src instanceof Uint8Array) {
    // Slice<T> destination, Uint8Array source
    return copyFromUint8Array(dst as Slice<T>, src, count)
  }

  // Both are Slice<T>
  return copyBetweenSlices(dst as Slice<T>, src as Slice<T>, count)
}

/**
 * Helper: Copy from string to any destination type
 */
function copyFromString<T>(
  dst: Slice<T> | Uint8Array,
  src: GoStringValue,
): number {
  const dstLen = dst instanceof Uint8Array ? dst.length : len(dst)
  const bytes = goStringBytes(src)
  const count = Math.min(dstLen, bytes.length)

  if (count === 0) {
    return 0
  }

  if (dst instanceof Uint8Array) {
    for (let i = 0; i < count; i++) {
      dst[i] = bytes[i]
    }
  } else if (isComplexSlice(dst)) {
    const dstMeta = dst.__meta__
    for (let i = 0; i < count; i++) {
      const byteVal = bytes[i]
      dstMeta.backing[dstMeta.offset + i] = byteVal as unknown as T
      ;(dst as any)[i] = byteVal
    }
  } else if (Array.isArray(dst)) {
    for (let i = 0; i < count; i++) {
      dst[i] = bytes[i] as unknown as T
    }
  }

  return count
}

/**
 * Helper: Copy from Slice<number> to Uint8Array
 */
function copyToUint8Array(
  dst: Uint8Array,
  src: Slice<number>,
  count: number,
): number {
  const values = copySliceValues(src, count)
  for (let i = 0; i < count; i++) {
    dst[i] = values[i]
  }
  return count
}

/**
 * Helper: Copy from Uint8Array to Slice<T>
 */
function copyFromUint8Array<T>(
  dst: Slice<T>,
  src: Uint8Array,
  count: number,
): number {
  const values = Array.from(src.subarray(0, count))
  if (isComplexSlice(dst)) {
    const dstMeta = dst.__meta__
    for (let i = 0; i < count; i++) {
      dstMeta.backing[dstMeta.offset + i] = values[i] as unknown as T
      ;(dst as any)[i] = values[i]
    }
  } else if (Array.isArray(dst)) {
    for (let i = 0; i < count; i++) {
      dst[i] = values[i] as unknown as T
    }
  }
  return count
}

/**
 * Helper: Copy between two Slice<T> instances
 */
function copyBetweenSlices<T>(
  dst: Slice<T>,
  src: Slice<T>,
  count: number,
): number {
  const values = copySliceValues(src, count)
  if (isComplexSlice(dst)) {
    const dstMeta = dst.__meta__
    for (let i = 0; i < count; i++) {
      dstMeta.backing[dstMeta.offset + i] = values[i]
      ;(dst as any)[i] = values[i]
    }
  } else if (Array.isArray(dst)) {
    for (let i = 0; i < count; i++) {
      dst[i] = values[i]
    }
  }
  return count
}

function copySliceValues<T>(src: Slice<T>, count: number): T[] {
  const values = new Array<T>(count)
  if (isComplexSlice(src)) {
    const srcMeta = src.__meta__
    for (let i = 0; i < count; i++) {
      values[i] = srcMeta.backing[srcMeta.offset + i]
    }
  } else if (Array.isArray(src)) {
    for (let i = 0; i < count; i++) {
      values[i] = src[i]
    }
  }
  return values
}

/**
 * Accesses an element at a specific index for various Go-like types (string, slice, array).
 * Mimics Go's indexing behavior: `myCollection[index]`
 * For strings, it returns the byte value at the specified byte index.
 * For slices/arrays, it returns the element at the specified index.
 * This is used when dealing with types like "string | []byte"
 * @param collection The string, Slice, or Array to access.
 * @param index The index.
 * @returns The element or byte value at the specified index.
 * @throws Error if index is out of bounds or type is unsupported.
 */
export function index<T>(
  collection: GoStringValue | Slice<T> | T[],
  index: number,
): T | number {
  if (collection === null || collection === undefined) {
    throw new Error('runtime error: index on nil or undefined collection')
  }

  if (isGoStringValue(collection)) {
    return indexString(collection, index) // Use the existing indexString for byte access
  } else if (collection instanceof Uint8Array) {
    if (index < 0 || index >= collection.length) {
      throw new Error(
        `runtime error: index out of range [${index}] with length ${collection.length}`,
      )
    }
    return collection[index]
  } else if (isComplexSlice(collection)) {
    if (index < 0 || index >= collection.__meta__.length) {
      throw new Error(
        `runtime error: index out of range [${index}] with length ${collection.__meta__.length}`,
      )
    }
    return collection.__meta__.backing[collection.__meta__.offset + index]
  } else if (Array.isArray(collection)) {
    if (index < 0 || index >= collection.length) {
      throw new Error(
        `runtime error: index out of range [${index}] with length ${collection.length}`,
      )
    }
    return collection[index]
  }
  throw new Error('runtime error: index on unsupported type')
}

/**
 * indexRef returns an addressable reference to a slice or array element.
 */
export function indexRef<T>(
  collection: Slice<T> | T[] | Uint8Array,
  index: number,
): VarRef<T> {
  if (collection === null || collection === undefined) {
    throw new Error('runtime error: index on nil or undefined collection')
  }
  if (collection instanceof Uint8Array) {
    if (index < 0 || index >= collection.length) {
      throw new Error(
        `runtime error: index out of range [${index}] with length ${collection.length}`,
      )
    }
    return {
      get value() {
        return collection[index] as T
      },
      set value(value: T) {
        collection[index] = value as number
      },
      __isVarRef: true,
      __goAddress: () => indexAddress(collection, index),
      __goCollection: collection,
      __goIndex: index,
    }
  }
  if (isComplexSlice(collection)) {
    if (index < 0 || index >= collection.__meta__.length) {
      throw new Error(
        `runtime error: index out of range [${index}] with length ${collection.__meta__.length}`,
      )
    }
    const backingIndex = collection.__meta__.offset + index
    return {
      get value() {
        return collection.__meta__.backing[backingIndex]
      },
      set value(value: T) {
        collection[index] = value
      },
      __isVarRef: true,
      __goAddress: () => indexAddress(collection, index),
      __goCollection: collection,
      __goIndex: index,
    }
  }
  if (Array.isArray(collection)) {
    if (index < 0 || index >= collection.length) {
      throw new Error(
        `runtime error: index out of range [${index}] with length ${collection.length}`,
      )
    }
    return {
      get value() {
        return collection[index]
      },
      set value(value: T) {
        collection[index] = value
      },
      __isVarRef: true,
      __goAddress: () => indexAddress(collection, index),
      __goCollection: collection,
      __goIndex: index,
    }
  }
  throw new Error('runtime error: index on unsupported type')
}

/**
 * arrayPointerFromIndexRef turns &slice[i] into a pointer to an N-element array
 * view. This models unsafe conversions such as (*[64]byte)(unsafe.Pointer(&b[0]))
 * for packages that immediately slice or index the resulting array pointer.
 */
export function arrayPointerFromIndexRef<T>(
  ref: VarRef<T>,
  length: number,
): VarRef<Slice<T> | T[] | Uint8Array> {
  const collection = ref.__goCollection as
    | Slice<T>
    | T[]
    | Uint8Array
    | undefined
  if (collection === undefined) {
    throw new Error(
      'unsafe array pointer requires an indexed collection reference',
    )
  }
  const index = ref.__goIndex ?? 0
  return varRef(
    goSlice(collection as any, index, index + length) as
      | Slice<T>
      | T[]
      | Uint8Array,
  )
}

/**
 * indexAddress returns a stable synthetic address for an addressable slice or
 * array element.
 */
export function indexAddress<T>(
  collection: Slice<T> | T[] | Uint8Array,
  index: number,
): number {
  if (collection === null || collection === undefined) {
    throw new Error('runtime error: index on nil or undefined collection')
  }

  let backing: object
  let backingIndex: number
  let length: number
  if (collection instanceof Uint8Array) {
    backing = collection.buffer
    backingIndex = collection.byteOffset + index
    length = collection.length
  } else if (isComplexSlice(collection)) {
    backing = collection.__meta__.backing
    backingIndex = collection.__meta__.offset + index
    length = collection.__meta__.length
  } else if (Array.isArray(collection)) {
    backing = collection
    backingIndex = index
    length = collection.length
  } else {
    throw new Error('runtime error: index on unsupported type')
  }

  if (index < 0 || index >= length) {
    throw new Error(
      `runtime error: index out of range [${index}] with length ${length}`,
    )
  }

  let base = addressBases.get(backing)
  if (base === undefined) {
    base = nextAddressBase * addressStride
    nextAddressBase++
    addressBases.set(backing, base)
  }
  return base + backingIndex
}

/**
 * Converts a string to an array of Unicode code points (runes).
 * @param str The input string.
 * @returns An array of numbers representing the Unicode code points.
 */
export const stringToRunes = (str: string): number[] => {
  return Array.from(str).map((c) => c.codePointAt(0) || 0)
}

/**
 * Returns Go range pairs for a string: UTF-8 byte offset and rune value.
 * @param str The input string.
 * @returns Index/rune pairs matching Go's `for i, r := range str`.
 */
export const rangeString = (str: string): Array<[number, number]> => {
  const encoder = new TextEncoder()
  const pairs: Array<[number, number]> = []
  let offset = 0
  for (const char of str) {
    pairs.push([offset, char.codePointAt(0) || 0])
    offset += encoder.encode(char).length
  }
  return pairs
}

/**
 * Converts a single-character string to its Unicode code point (rune).
 * Used for readable rune constants like $.stringToRune('/') instead of 47.
 * @param str A single-character string.
 * @returns The Unicode code point as a number.
 */
export const stringToRune = (str: string): number => {
  if (str.length === 0) {
    return 0
  }
  return str.codePointAt(0) || 0
}

/**
 * Converts an array of Unicode code points (runes) to a string.
 * @param runes The input array of numbers representing Unicode code points.
 * @returns The resulting string.
 */
export const runesToString = (runes: Slice<number>): string => {
  return runes?.length ? String.fromCharCode(...runes) : ''
}

/**
 * Converts a number to a byte (uint8) by truncating to the range 0-255.
 * Equivalent to Go's byte() conversion.
 * @param n The number to convert to a byte.
 * @returns The byte value (0-255).
 */
export const byte = (n: number): number => {
  return n & 0xff // Bitwise AND with 255 ensures we get a value in the range 0-255
}

/**
 * Accesses the byte value at a specific index of a UTF-8 encoded string.
 * Mimics Go's string indexing behavior: `myString[index]`
 * @param str The string to access.
 * @param index The byte index.
 * @returns The byte value (0-255) at the specified index.
 * @throws Error if index is out of bounds.
 */
export const indexString = (
  str: GoStringValue | import('./builtin.js').Bytes,
  index: number,
): number => {
  if (!isGoStringValue(str)) {
    // Bytes - access directly
    if (str instanceof Uint8Array) {
      if (index < 0 || index >= str.length) {
        throw new Error(
          `runtime error: index out of range [${index}] with length ${str.length}`,
        )
      }
      return str[index]
    }
    // Array or null
    if (str === null || str === undefined) {
      throw new Error(
        `runtime error: index out of range [${index}] with length 0`,
      )
    }
    if (index < 0 || index >= str.length) {
      throw new Error(
        `runtime error: index out of range [${index}] with length ${str.length}`,
      )
    }
    return str[index]
  }
  const bytes = goStringBytes(str)
  if (index < 0 || index >= bytes.length) {
    throw new Error(
      `runtime error: index out of range [${index}] with length ${bytes.length}`,
    )
  }
  return bytes[index]
}

/**
 * Returns the byte length of a string.
 * Mimics Go's `len(string)` behavior.
 * @param str The string.
 * @returns The number of bytes in the UTF-8 representation of the string.
 */
export const stringLen = (str: GoStringValue): number => {
  return goStringBytes(str).length
}

/**
 * Slices a string based on byte indices.
 * Mimics Go's string slicing behavior: `myString[low:high]` for valid UTF-8 slices only.
 * @param str The string to slice.
 * @param low The starting byte index (inclusive). Defaults to 0.
 * @param high The ending byte index (exclusive). Defaults to string byte length.
 * @returns The sliced string.
 * @throws Error if the slice would create invalid UTF-8.
 */
export const sliceString = (
  str: GoStringValue,
  low?: number,
  high?: number,
): string => {
  const bytes = goStringBytes(str)
  const actualLow = low === undefined ? 0 : low
  const actualHigh = high === undefined ? bytes.length : high

  if (actualLow < 0 || actualHigh < actualLow || actualHigh > bytes.length) {
    // Go's behavior for out-of-bounds slice on string is a panic.
    // For simple slices like s[len(s):len(s)], it should produce an empty string.
    // For s[len(s)+1:], it panics.
    // Let's ensure high <= bytes.length and low <= high.
    // If low == high, it's an empty string.
    if (
      actualLow === actualHigh &&
      actualLow >= 0 &&
      actualLow <= bytes.length
    ) {
      return ''
    }
    throw new Error(
      `runtime error: slice bounds out of range [${actualLow}:${actualHigh}] with length ${bytes.length}`,
    )
  }

  return goStringFromBytes(bytes.subarray(actualLow, actualHigh))
}

/**
 * Converts a Slice<number> (byte array) to a string using TextDecoder.
 * @param bytes The Slice<number> to convert.
 * @returns The resulting string.
 */
export const bytesToString = (
  bytes: Slice<number> | Uint8Array | string,
): string => {
  if (bytes === null) return ''
  // If it's already a string, just return it
  if (typeof bytes === 'string') return bytes
  if (bytes instanceof Uint8Array) return goStringFromBytes(bytes)
  // Ensure we get a plain number[] for Uint8Array.from
  let byteArray: number[]
  if (isComplexSlice(bytes)) {
    // For complex slices, extract the relevant part of the backing array
    byteArray = bytes.__meta__.backing.slice(
      bytes.__meta__.offset,
      bytes.__meta__.offset + bytes.__meta__.length,
    )
  } else {
    // For simple T[] slices
    byteArray = bytes
  }
  return goStringFromBytes(Uint8Array.from(byteArray)) as string
}

export function stringEqual(
  left: GoStringBytes,
  right: GoStringBytes,
): boolean {
  const leftBytes = goStringComparableBytes(left)
  const rightBytes = goStringComparableBytes(right)
  if (leftBytes.length !== rightBytes.length) {
    return false
  }
  for (let i = 0; i < leftBytes.length; i++) {
    if (leftBytes[i] !== rightBytes[i]) {
      return false
    }
  }
  return true
}

export function stringCompare(
  left: GoStringBytes,
  right: GoStringBytes,
): number {
  if (!isGoStringValue(left) && !isGoStringValue(right)) {
    const leftBytes = byteStringView(left)
    const rightBytes = byteStringView(right)
    const leftLen = leftBytes.length
    const rightLen = rightBytes.length
    const sharedLen = Math.min(leftLen, rightLen)
    for (let i = 0; i < sharedLen; i++) {
      const diff =
        (leftBytes.backing[leftBytes.offset + i] ?? 0) -
        (rightBytes.backing[rightBytes.offset + i] ?? 0)
      if (diff !== 0) {
        return diff
      }
    }
    return leftLen - rightLen
  }

  const leftBytes = goStringComparableBytes(left)
  const rightBytes = goStringComparableBytes(right)
  const sharedLen = Math.min(leftBytes.length, rightBytes.length)
  for (let i = 0; i < sharedLen; i++) {
    const diff = leftBytes[i] - rightBytes[i]
    if (diff !== 0) {
      return diff
    }
  }
  return leftBytes.length - rightBytes.length
}

type ByteStringView = {
  backing: ArrayLike<number>
  offset: number
  length: number
}

function byteStringView(value: GoStringBytes): ByteStringView {
  if (value === null || value === undefined) {
    return { backing: [], offset: 0, length: 0 }
  }
  if (value instanceof Uint8Array) {
    return { backing: value, offset: 0, length: value.length }
  }
  if (Array.isArray(value)) {
    const meta = (value as unknown as SliceProxy<number>).__meta__
    if (meta !== undefined) {
      return {
        backing: meta.backing,
        offset: meta.offset,
        length: meta.length,
      }
    }
    return { backing: value, offset: 0, length: value.length }
  }
  const meta = (value as unknown as SliceProxy<number>).__meta__
  return {
    backing: meta.backing,
    offset: meta.offset,
    length: meta.length,
  }
}

function bytesToBinaryString(bytes: Uint8Array): string {
  const chunkSize = 0x8000
  let out = ''
  for (let i = 0; i < bytes.length; i += chunkSize) {
    out += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return out
}

/**
 * Converts a string to a Uint8Array (byte slice).
 * @param s The input string.
 * @returns A Uint8Array representing the UTF-8 bytes of the string.
 */
export function stringToBytes(
  s: GoStringValue | import('./builtin.js').Bytes,
): Uint8Array {
  if (isGoStringValue(s)) {
    return goStringBytes(s)
  }
  // Already bytes - normalize to Uint8Array
  if (s instanceof Uint8Array) {
    return s
  }
  if (s === null || s === undefined) {
    return new Uint8Array(0)
  }
  // Handle array or slice types
  return new Uint8Array(Array.isArray(s) ? s : [])
}

type StringHeaderData = {
  kind: 'string'
  value: string
}

export function stringHeaderRef(s: VarRef<string>): VarRef<{
  Data: StringHeaderData
  Len: number
}> {
  return varRef({
    get Data(): StringHeaderData {
      return { kind: 'string', value: s.value }
    },
    set Data(_value: StringHeaderData) {},
    get Len(): number {
      return stringToBytes(s.value).length
    },
    set Len(_value: number) {},
  })
}

export function sliceHeaderRef(b: VarRef<Slice<number>>): VarRef<{
  Data: StringHeaderData | null
  Len: number
  Cap: number
}> {
  let data: StringHeaderData | null = null
  let length = 0
  let capacity = 0
  const refresh = () => {
    if (data === null) {
      return
    }
    const bytes = stringToBytes(data.value)
    const out = makeSlice<number>(length, Math.max(capacity, length), 'byte')
    if (out !== null) {
      copy(out, goSlice(bytes, 0, Math.min(length, bytes.length)))
    }
    b.value = out
  }
  return varRef({
    get Data(): StringHeaderData | null {
      return data
    },
    set Data(value: StringHeaderData | null) {
      data = value
      refresh()
    },
    get Len(): number {
      return length
    },
    set Len(value: number) {
      length = value
      refresh()
    },
    get Cap(): number {
      return capacity
    },
    set Cap(value: number) {
      capacity = value
      refresh()
    },
  })
}

/**
 * Handles string() conversion for values that could be either string or []byte.
 * Used for generic type parameters with constraint []byte|string.
 * @param value Value that is either a string or Uint8Array
 * @returns The string representation
 */
export function genericBytesOrStringToString(
  value: string | import('./builtin.js').Bytes | null | undefined,
): string {
  if (value === null || value === undefined) {
    return ''
  }
  if (isGoStringValue(value)) {
    return value as string
  }
  return bytesToString(value)
}

/**
 * Indexes into a value that could be either a string or bytes.
 * Used for generic type parameters with constraint string | []byte.
 * Both cases return a byte value (number).
 * @param value Value that is either a string or bytes (Uint8Array or Slice<number>)
 * @param index The index to access
 * @returns The byte value at the specified index
 */
export function indexStringOrBytes(
  value: GoStringValue | import('./builtin.js').Bytes,
  index: number,
): number {
  if (isGoStringValue(value)) {
    return indexString(value, index)
  } else if (value instanceof Uint8Array) {
    // For Uint8Array, direct access returns the byte value
    if (index < 0 || index >= value.length) {
      throw new Error(
        `runtime error: index out of range [${index}] with length ${value.length}`,
      )
    }
    return value[index]
  } else if (value === null) {
    throw new Error(
      `runtime error: index out of range [${index}] with length 0`,
    )
  } else {
    // For Slice<number> (including SliceProxy)
    const length = len(value)
    if (index < 0 || index >= length) {
      throw new Error(
        `runtime error: index out of range [${index}] with length ${length}`,
      )
    }
    return (value as any)[index] as number
  }
}

/**
 * Slices a value that could be either a string or bytes.
 * Used for generic type parameters with constraint string | []byte.
 * @param value Value that is either a string or bytes (Uint8Array or Slice<number>)
 * @param low Starting index (inclusive). Defaults to 0.
 * @param high Ending index (exclusive). Defaults to length.
 * @param max Capacity limit (only used for bytes, ignored for strings)
 * @returns The sliced value of the same type as input
 */
export function sliceStringOrBytes<
  T extends GoStringValue | import('./builtin.js').Bytes,
>(value: T, low?: number, high?: number, max?: number): T {
  if (isGoStringValue(value)) {
    // For strings, use sliceString and ignore max parameter
    return sliceString(value, low, high) as T
  } else {
    // For bytes (Uint8Array or Slice<number>), use goSlice
    return goSlice(value as Slice<number>, low, high, max) as T
  }
}

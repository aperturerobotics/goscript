export interface OwnedPointerHandle<T = unknown> {
  readonly __goOwnedPointer: true
  __goAddress: () => number
  __goRef: () => VarRef<T>
  __goSlice?: (length: number) => unknown
}

/**
 * VarRef represents a Go variable which can be referred to by other variables.
 *
 * For example:
 *   var myVariable int // variable referenced
 *   myOtherVar := &myVariable
 */
export type VarRef<T> = {
  value: T
  __isVarRef?: true
  __goType?: string
  __goAddress?: () => number
  __goCollection?: unknown
  __goIndex?: number
  __goPointer?: OwnedPointerHandle<T>
}

const pointerAddressStride = 0x100000000
const pointerAddresses = new WeakMap<object, number>()
const fieldPointerAddresses = new WeakMap<
  object,
  globalThis.Map<PropertyKey, number>
>()
let nextPointerAddress = 1

function pointerAddress(value: object): number {
  let address = pointerAddresses.get(value)
  if (address === undefined) {
    address = nextPointerAddress * pointerAddressStride
    nextPointerAddress++
    pointerAddresses.set(value, address)
  }
  return address
}

function fieldPointerAddress(target: object, key: PropertyKey): number {
  let addresses = fieldPointerAddresses.get(target)
  if (addresses === undefined) {
    addresses = new globalThis.Map<PropertyKey, number>()
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

function refPointer<T>(
  ref: VarRef<T>,
  address: () => number,
): OwnedPointerHandle<T> {
  return {
    __goOwnedPointer: true,
    __goAddress: address,
    __goRef: () => ref,
  }
}

/** Wrap a non-null T in a variable reference. */
export function varRef<T>(v: T): VarRef<T> {
  // We create a new object wrapper for every varRef call to ensure
  // distinct pointer identity, crucial for pointer comparisons (p1 == p2).
  // The __isVarRef marker allows the reflect system to identify this as a pointer type.
  const ref: VarRef<T> = { value: v, __isVarRef: true }
  ref.__goAddress = () => pointerAddress(ref)
  ref.__goPointer = refPointer(ref, ref.__goAddress)
  return ref
}

/** Create a variable reference to an object field. */
export function fieldRef<T extends object, K extends keyof T>(
  target: T,
  key: K,
): VarRef<T[K]> {
  const address = () => fieldPointerAddress(target, key)
  const ref: VarRef<T[K]> = {
    get value(): T[K] {
      return target[key]
    },
    set value(value: T[K]) {
      target[key] = value
    },
    __isVarRef: true,
    __goAddress: address,
  }
  ref.__goPointer = refPointer(ref, address)
  return ref
}

/** Check if a value is a VarRef (pointer) */
export function isVarRef(v: unknown): v is VarRef<unknown> {
  return v !== null && typeof v === 'object' && (v as any).__isVarRef === true
}

export function isOwnedPointerHandle(
  value: unknown,
): value is OwnedPointerHandle {
  return (
    value !== null &&
    typeof value === 'object' &&
    (value as { __goOwnedPointer?: unknown }).__goOwnedPointer === true
  )
}

export function ownedPointerFromRef<T>(
  ref: VarRef<T>,
): OwnedPointerHandle<T> | undefined {
  return ref.__goPointer
}

export function ownedPointerAddress(pointer: OwnedPointerHandle): number {
  return pointer.__goAddress()
}

export function ownedPointerRef<T>(pointer: OwnedPointerHandle<T>): VarRef<T> {
  return pointer.__goRef()
}

/** Dereference a variable reference, throws on null → simulates Go panic. */
export function unref<T>(b: VarRef<T>): T {
  if (b === null) {
    throw new Error(
      'runtime error: invalid memory address or nil pointer dereference',
    )
  }
  return b.value
}

export function unsupportedPointerRef<T>(_value: unknown): VarRef<T> {
  return {
    get value(): T {
      throw new Error(
        'unsafe pointer dereference is not supported in JavaScript/TypeScript',
      )
    },
    set value(_value: T) {
      throw new Error(
        'unsafe pointer dereference is not supported in JavaScript/TypeScript',
      )
    },
    __isVarRef: true,
  }
}

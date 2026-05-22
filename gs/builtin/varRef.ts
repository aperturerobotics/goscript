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
}

/** Wrap a non-null T in a variable reference. */
export function varRef<T>(v: T): VarRef<T> {
  // We create a new object wrapper for every varRef call to ensure
  // distinct pointer identity, crucial for pointer comparisons (p1 == p2).
  // The __isVarRef marker allows the reflect system to identify this as a pointer type.
  return { value: v, __isVarRef: true }
}

/** Create a variable reference to an object field. */
export function fieldRef<T extends object, K extends keyof T>(
  target: T,
  key: K,
): VarRef<T[K]> {
  return {
    get value(): T[K] {
      return target[key]
    },
    set value(value: T[K]) {
      target[key] = value
    },
    __isVarRef: true,
  }
}

/** Check if a value is a VarRef (pointer) */
export function isVarRef(v: unknown): v is VarRef<unknown> {
  return v !== null && typeof v === 'object' && (v as any).__isVarRef === true
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

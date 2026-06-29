// Minimal stub for cmp package
// This provides the Ordered type and comparison functions needed by slices

// Ordered represents types that can be ordered (comparable)
export type Ordered = number | string | boolean | bigint

// Compare compares two values and returns:
// -1 if a < b
//  0 if a == b
//  1 if a > b
// Floating-point NaN orders below every non-NaN value and equals itself, as in
// Go's cmp.Compare; raw JS < / > would report two incomparable NaNs as equal.
export function Compare<T extends Ordered>(a: T, b: T): number {
  const aNaN = Number.isNaN(a as number)
  const bNaN = Number.isNaN(b as number)
  if (aNaN && bNaN) return 0
  if (aNaN || a < b) return -1
  if (bNaN || a > b) return 1
  return 0
}

// Less reports whether a < b, treating NaN as less than any non-NaN value to
// match Go's cmp.Less.
export function Less<T extends Ordered>(a: T, b: T): boolean {
  return (
    (Number.isNaN(a as number) &&
      !Number.isNaN(b as number)) ||
    a < b
  )
}

// Or returns the first non-zero result from the comparison functions,
// isZeroValue reports whether v equals the zero value for its comparable kind,
// matching Go's `val != zero` test in cmp.Or. Scalars compare against their
// typed zero; pointers, interfaces, maps, slices, channels, and funcs are zero
// only when nil.
function isZeroValue(v: unknown): boolean {
  switch (typeof v) {
    case 'number':
      return v === 0
    case 'bigint':
      return v === 0n
    case 'string':
      return v === ''
    case 'boolean':
      return v === false
    case 'undefined':
      return true
    default:
      return v === null
  }
}

// Or returns the first of its arguments that is not equal to that comparable
// type's zero value, or the zero value if every argument is zero, as in Go's
// cmp.Or. The earlier number-only implementation treated the empty string,
// false, and 0n as non-zero.
export function Or<T>(...vals: T[]): T {
  for (const v of vals) {
    if (!isZeroValue(v)) {
      return v
    }
  }
  return vals.length > 0 ? vals[vals.length - 1] : (undefined as T)
}

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
  const aNaN = Number.isNaN(a as unknown as number)
  const bNaN = Number.isNaN(b as unknown as number)
  if (aNaN && bNaN) return 0
  if (aNaN || a < b) return -1
  if (bNaN || a > b) return 1
  return 0
}

// Less reports whether a < b, treating NaN as less than any non-NaN value to
// match Go's cmp.Less.
export function Less<T extends Ordered>(a: T, b: T): boolean {
  return (
    (Number.isNaN(a as unknown as number) &&
      !Number.isNaN(b as unknown as number)) ||
    a < b
  )
}

// Or returns the first non-zero result from the comparison functions,
// or zero if all comparisons return zero
export function Or(...comparisons: number[]): number {
  for (const cmp of comparisons) {
    if (cmp !== 0) return cmp
  }
  return 0
}

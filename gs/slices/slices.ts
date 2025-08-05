// TypeScript implementation of Go's slices package
import * as $ from '@goscript/builtin/index.js'

/**
 * All returns an iterator over index-value pairs in the slice.
 * This is equivalent to Go's slices.All function.
 * @param s The slice to iterate over
 * @returns An iterator function that yields index-value pairs
 */
export function All<T>(
  s: $.Slice<T>,
): (yieldFunc: (index: number, value: T) => boolean) => void {
  return function (_yield: (index: number, value: T) => boolean): void {
    const length = $.len(s)
    for (let i = 0; i < length; i++) {
      const value = (s as any)[i] as T // Use proper indexing to avoid type issues
      if (!_yield(i, value)) {
        break
      }
    }
  }
}

/**
 * Sort sorts a slice in ascending order.
 * This is equivalent to Go's slices.Sort function.
 * @param s The slice to sort in place
 */
export function Sort<T extends string | number>(s: $.Slice<T>): void {
  $.sortSlice(s)
}

/**
 * SortFunc sorts the slice s using the provided comparison function.
 * The comparison function should return:
 *   - negative value if a < b
 *   - zero if a == b
 *   - positive value if a > b
 * This is equivalent to Go's slices.SortFunc function.
 * @param s The slice to sort in place
 * @param cmp The comparison function
 */
export function SortFunc<T>(
  s: $.Slice<T>,
  cmp: (a: T, b: T) => number
): void {
  // Convert slice to array if needed for sorting
  const arr = Array.isArray(s) ? s : Array.from(s as any)
  
  // Sort using the comparison function
  arr.sort(cmp)
  
  // Copy sorted values back to original slice
  const length = $.len(s)
  for (let i = 0; i < length; i++) {
    (s as any)[i] = arr[i]
  }
}

/**
 * Delete removes the elements s[i:j] from s, returning the modified slice.
 * This is equivalent to Go's slices.Delete function.
 * @param s The slice to delete from
 * @param i The start index (inclusive)
 * @param j The end index (exclusive)
 * @returns The modified slice
 */
export function Delete<T>(
  s: $.Slice<T>,
  i: number,
  j: number
): $.Slice<T> {
  const length = $.len(s)
  
  // Validate indices
  if (i < 0 || j > length || i > j) {
    throw new Error(`slice bounds out of range [${i}:${j}] with length ${length}`)
  }
  
  // If nothing to delete, return the slice as-is
  if (i === j) {
    return s
  }
  
  // Create a new slice with the elements removed
  const result: T[] = []
  
  // Copy elements before the deletion range
  for (let k = 0; k < i; k++) {
    result.push((s as any)[k])
  }
  
  // Copy elements after the deletion range
  for (let k = j; k < length; k++) {
    result.push((s as any)[k])
  }
  
  return result as $.Slice<T>
}

/**
 * BinarySearchFunc uses binary search to find and return the smallest index i
 * in [0, len(s)) such that cmp(s[i], target) >= 0. If there is no such index i,
 * BinarySearchFunc returns i = len(s).
 * The slice must be sorted in increasing order according to the comparison function.
 * This is equivalent to Go's slices.BinarySearchFunc function.
 * @param s The sorted slice to search
 * @param target The target value to search for
 * @param cmp The comparison function
 * @returns A tuple [index, found] where index is the position and found indicates if exact match was found
 */
export function BinarySearchFunc<S, T>(
  s: $.Slice<S>,
  target: T,
  cmp: (a: S, b: T) => number
): [number, boolean] {
  const length = $.len(s)
  let left = 0
  let right = length
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    const cmpResult = cmp((s as any)[mid], target)
    
    if (cmpResult < 0) {
      left = mid + 1
    } else {
      right = mid
    }
  }
  
  // Check if we found an exact match
  const found = left < length && cmp((s as any)[left], target) === 0
  
  return [left, found]
}

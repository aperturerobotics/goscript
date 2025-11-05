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
 * Delete removes the elements s[i:j] from s, returning the modified slice.
 * Delete panics if j > len(s) or s[i:j] is not a valid slice of s.
 * This is equivalent to Go's slices.Delete function.
 * @param s The slice to delete from
 * @param i The start index (inclusive)
 * @param j The end index (exclusive)
 * @returns The modified slice
 */
export function Delete<T>(s: $.Slice<T>, i: number, j: number): $.Slice<T> {
  const length = $.len(s)
  if (j > length || i < 0 || j < i) {
    throw new Error(
      `slice bounds out of range [${i}:${j}] with length ${length}`,
    )
  }
  if (i === j) {
    return s
  }
  // Shift elements after j to position i
  const deleteCount = j - i
  for (let k = j; k < length; k++) {
    ;(s as any)[k - deleteCount] = (s as any)[k]
  }
  // Zero out the elements at the end
  for (let k = length - deleteCount; k < length; k++) {
    ;(s as any)[k] = null
  }
  // Update the slice length
  return $.goSlice(s, 0, length - deleteCount) as $.Slice<T>
}

/**
 * Grow increases the slice's capacity, if necessary, to guarantee space for
 * another n elements. After Grow(n), at least n elements can be appended
 * to the slice without another allocation. If n is negative or too large to
 * allocate the memory, Grow panics.
 * This is equivalent to Go's slices.Grow function.
 * @param s The slice to grow
 * @param n The number of additional elements to guarantee space for
 * @returns The slice with increased capacity
 */
export function Grow<T>(s: $.Slice<T>, n: number): $.Slice<T> {
  if (n < 0) {
    throw new Error(`slices.Grow: negative n: ${n}`)
  }
  const currentLen = $.len(s)
  const currentCap = $.cap(s)
  const neededCap = currentLen + n

  if (neededCap <= currentCap) {
    return s
  }

  // Create new slice with increased capacity
  // Go's growth strategy typically doubles capacity when needed
  let newCap = currentCap * 2
  if (newCap < neededCap) {
    newCap = neededCap
  }

  const newSlice = $.makeSlice<T>(currentLen, newCap)
  for (let i = 0; i < currentLen; i++) {
    ;(newSlice as any)[i] = (s as any)[i]
  }

  return newSlice
}

/**
 * BinarySearchFunc works like BinarySearch, but uses a custom comparison function.
 * The slice must be sorted in increasing order, where "increasing" is defined by cmp.
 * cmp should return 0 if the slice element matches the target, a negative number if
 * the slice element precedes the target, or a positive number if the slice element
 * follows the target.
 * This is equivalent to Go's slices.BinarySearchFunc function.
 * @param x The sorted slice to search
 * @param target The target value to search for
 * @param cmp Comparison function
 * @returns A tuple of [index, found] where index is the position and found indicates if target was found
 */
export function BinarySearchFunc<E, T>(
  x: $.Slice<E>,
  target: T,
  cmp: (a: E, b: T) => number,
): [number, boolean] {
  let left = 0
  let right = $.len(x)

  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    const result = cmp((x as any)[mid] as E, target)

    if (result < 0) {
      left = mid + 1
    } else if (result > 0) {
      right = mid
    } else {
      return [mid, true]
    }
  }

  return [left, false]
}

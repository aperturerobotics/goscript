// TypeScript implementation of Go's slices package
import * as $ from '@goscript/builtin/index.js'
import * as cmp from '../cmp/index.js'
import * as iter from '../iter/index.js'

/**
 * Compare compares the elements of s1 and s2 using cmp.Compare.
 * The elements are compared sequentially, starting at index 0,
 * until one element is not equal to the other.
 * The result of comparing the first non-matching elements is returned.
 * If both slices are equal until one of them ends, the shorter slice is
 * considered less than the longer one.
 * The result is 0 if s1 == s2, -1 if s1 < s2, and +1 if s1 > s2.
 * @param s1 First slice
 * @param s2 Second slice
 * @returns -1, 0, or 1
 */
export function Compare<T extends string | number>(
  s1: $.Slice<T>,
  s2: $.Slice<T>,
): number {
  const len1 = $.len(s1)
  const len2 = $.len(s2)
  const minLen = len1 < len2 ? len1 : len2

  for (let i = 0; i < minLen; i++) {
    const v1 = (s1 as any)[i] as T
    const v2 = (s2 as any)[i] as T
    const result = cmp.Compare(v1, v2)
    if (result !== 0) {
      return result
    }
  }

  // All elements are equal up to minLen, compare lengths
  if (len1 < len2) {
    return -1
  }
  if (len1 > len2) {
    return 1
  }
  return 0
}

/**
 * Clone returns a shallow copy of s while preserving nilness.
 * @param s The slice to clone
 * @returns A new slice with the same elements, or null for a nil slice
 */
export function Clone<T>(s: $.Slice<T>): $.Slice<T> {
  if (s == null) {
    return null
  }
  const out = $.makeSlice<T>($.len(s))
  for (let i = 0; i < $.len(s); i++) {
    ;(out as any)[i] = (s as any)[i] as T
  }
  return out
}

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

export function Backward<T>(
  s: $.Slice<T>,
): (
  _yield: (index: number, value: T) => boolean | globalThis.Promise<boolean>
) => void | globalThis.Promise<void> {
  return function (
    _yield: (index: number, value: T) => boolean | globalThis.Promise<boolean>,
  ): void | globalThis.Promise<void> {
    const walk = (i: number): void | globalThis.Promise<void> => {
      for (; i >= 0; i--) {
        const keepGoing = _yield(i, (s as any)[i] as T)
        if (keepGoing instanceof Promise) {
          return keepGoing.then((next) => {
            if (next) {
              return walk(i - 1)
            }
          })
        }
        if (!keepGoing) {
          break
        }
      }
    }
    const length = $.len(s)
    if (length === 0) {
      return
    }
    return walk(length - 1)
  }
}

export function Sort<T extends string | number>(s: $.Slice<T>): void {
  $.sortSlice(s)
}

export function IsSorted<T extends string | number>(x: $.Slice<T>): boolean {
  for (let i = $.len(x) - 1; i > 0; i--) {
    if (cmp.Compare((x as any)[i] as T, (x as any)[i - 1] as T) < 0) {
      return false
    }
  }
  return true
}

export function Max<T extends cmp.Ordered>(x: $.Slice<T>): T {
  if ($.len(x) === 0) {
    throw new Error('slices.Max: empty list')
  }
  let max = (x as any)[0] as T
  for (let i = 1; i < $.len(x); i++) {
    const value = (x as any)[i] as T
    if (cmp.Compare(max, value) < 0) {
      max = value
    }
  }
  return max
}

export function Collect<T>(seq: iter.Seq<T>): $.Slice<T> {
  const out: T[] = []
  seq((value) => {
    out.push(value)
    return true
  })
  return out.length === 0 ? null : out
}

export function Sorted<T extends string | number>(seq: iter.Seq<T>): $.Slice<T> {
  const out = Collect(seq)
  Sort(out)
  return out
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

export function DeleteFunc<T>(
  s: $.Slice<T>,
  del: (value: T) => boolean,
): $.Slice<T> {
  if (s === null || s === undefined) {
    return s
  }
  let w = 0
  for (let i = 0; i < s.length; i++) {
    const value = s[i] as T
    if (!del(value)) {
      ;(s as any)[w] = value
      w++
    }
  }
  for (let i = w; i < s.length; i++) {
    ;(s as any)[i] = clearValue(s)
  }
  return $.goSlice(s, 0, w) as $.Slice<T>
}

export function Equal<T>(s1: $.Slice<T>, s2: $.Slice<T>): boolean {
  const len1 = $.len(s1)
  if (len1 !== $.len(s2)) {
    return false
  }
  for (let i = 0; i < len1; i++) {
    if ((s1 as any)[i] !== (s2 as any)[i]) {
      return false
    }
  }
  return true
}

export function EqualFunc<T, U>(
  s1: $.Slice<T>,
  s2: $.Slice<U>,
  eq: (v1: T, v2: U) => boolean,
): boolean {
  const len1 = $.len(s1)
  if (len1 !== $.len(s2)) {
    return false
  }
  for (let i = 0; i < len1; i++) {
    if (!eq((s1 as any)[i] as T, (s2 as any)[i] as U)) {
      return false
    }
  }
  return true
}

export function Index<T>(s: $.Slice<T>, v: T): number {
  for (let i = 0; i < $.len(s); i++) {
    if ((s as any)[i] === v) {
      return i
    }
  }
  return -1
}

export function IndexFunc<T>(s: $.Slice<T>, f: (v: T) => boolean): number {
  for (let i = 0; i < $.len(s); i++) {
    if (f((s as any)[i] as T)) {
      return i
    }
  }
  return -1
}

export function Contains<T>(s: $.Slice<T>, v: T): boolean {
  return Index(s, v) >= 0
}

export function ContainsFunc<T>(s: $.Slice<T>, f: (v: T) => boolean): boolean {
  return IndexFunc(s, f) >= 0
}

export function Insert<T>(s: $.Slice<T>, i: number, ...v: T[]): $.Slice<T> {
  const length = $.len(s)
  if (i < 0 || i > length) {
    throw new Error(`slice bounds out of range [${i}:${i}] with length ${length}`)
  }
  if (v.length === 0) {
    return s
  }
  const out = $.makeSlice<T>(length + v.length)
  for (let idx = 0; idx < i; idx++) {
    ;(out as any)[idx] = (s as any)[idx]
  }
  for (let idx = 0; idx < v.length; idx++) {
    ;(out as any)[i + idx] = v[idx]
  }
  for (let idx = i; idx < length; idx++) {
    ;(out as any)[idx + v.length] = (s as any)[idx]
  }
  return out
}

export function Reverse<T>(s: $.Slice<T>): void {
  for (let i = 0, j = $.len(s) - 1; i < j; i++, j--) {
    const tmp = (s as any)[i]
    ;(s as any)[i] = (s as any)[j]
    ;(s as any)[j] = tmp
  }
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
 * SortFunc sorts the slice using the provided comparison function.
 * The comparison function should return a negative number if a < b, zero if a == b, or a positive number if a > b.
 * This is equivalent to Go's slices.SortFunc function.
 * @param s The slice to sort in place
 * @param cmp Comparison function
 */
export function SortFunc<T>(s: $.Slice<T>, cmp: (a: T, b: T) => number): void {
  if (s === null || s === undefined) {
    return
  }
  const arr = s as any as T[]
  arr.sort(cmp)
}

export function IsSortedFunc<T>(
  x: $.Slice<T>,
  cmp: (a: T, b: T) => number,
): boolean {
  for (let i = $.len(x) - 1; i > 0; i--) {
    if (cmp((x as any)[i] as T, (x as any)[i - 1] as T) < 0) {
      return false
    }
  }
  return true
}

export function SortStableFunc<T>(
  s: $.Slice<T>,
  cmp: (a: T, b: T) => number,
): void {
  if (s === null || s === undefined) {
    return
  }
  const sorted = (s as any as T[])
    .map((value, index) => ({ value, index }))
    .sort((a, b) => {
      const result = cmp(a.value, b.value)
      if (result !== 0) {
        return result
      }
      return a.index - b.index
    })
  for (let i = 0; i < sorted.length; i++) {
    ;(s as any)[i] = sorted[i].value
  }
}

function clearValue<T>(s: $.Slice<T>): T | null {
  if (s instanceof Uint8Array) {
    return 0 as T
  }
  for (const value of s ?? []) {
    if (value !== null && value !== undefined) {
      switch (typeof value) {
        case 'number':
          return 0 as T
        case 'string':
          return '' as T
        case 'boolean':
          return false as T
      }
      break
    }
  }
  return null
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

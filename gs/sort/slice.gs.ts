import * as $ from "@goscript/builtin/index.js";

// Helper type for slice metadata
interface SliceMetadata<T> {
  backing: T[]
  offset: number
  length: number
  capacity: number
}

type LessFunc = (
  i: number,
  j: number,
) => boolean | globalThis.Promise<boolean>

function setInSlice<T>(slice: $.Slice<T>, i: number, value: T): void {
  if (!slice) return

  if (Array.isArray(slice) || slice instanceof Uint8Array) {
    ;(slice as any)[i] = value
  } else if (typeof slice === 'object' && '__meta__' in slice) {
    const meta = (slice as any).__meta__ as SliceMetadata<T>
    meta.backing[meta.offset + i] = value
  }
}

async function sortedIndices(n: number, less: LessFunc): Promise<number[]> {
  const indices = Array.from({ length: n }, (_, i) => i)
  await sortIndexRange(indices, 0, indices.length, less)
  return indices
}

async function sortIndexRange(
  indices: number[],
  lo: number,
  hi: number,
  less: LessFunc,
): Promise<void> {
  if (hi - lo <= 16) {
    for (let i = lo + 1; i < hi; i++) {
      const value = indices[i]
      let j = i
      while (j > lo && (await less(value, indices[j - 1]))) {
        indices[j] = indices[j - 1]
        j--
      }
      indices[j] = value
    }
    return
  }

  const mid = lo + Math.floor((hi - lo) / 2)
  await sortIndexRange(indices, lo, mid, less)
  await sortIndexRange(indices, mid, hi, less)

  const merged: number[] = []
  let left = lo
  let right = mid
  while (left < mid && right < hi) {
    if (await less(indices[right], indices[left])) {
      merged.push(indices[right])
      right++
    } else {
      merged.push(indices[left])
      left++
    }
  }
  while (left < mid) {
    merged.push(indices[left])
    left++
  }
  while (right < hi) {
    merged.push(indices[right])
    right++
  }
  for (let i = 0; i < merged.length; i++) {
    indices[lo + i] = merged[i]
  }
}

// Slice sorts the slice x given the provided less function
export async function Slice(
  x: $.Slice<any>,
  less: LessFunc,
): globalThis.Promise<void> {
  if (!x) return

  const n = $.len(x)
  const indices = await sortedIndices(n, less)
  const sorted = indices.map((index) => $.index(x, index))
  for (let i = 0; i < sorted.length; i++) {
    setInSlice(x, i, sorted[i])
  }
}

// SliceIsSorted reports whether the slice x is sorted according to the provided less function
export async function SliceIsSorted(
  x: $.Slice<any>,
  less: LessFunc,
): globalThis.Promise<boolean> {
  if (!x) return true

  const n = $.len(x)
  for (let i = n - 1; i > 0; i--) {
    if (await less(i, i - 1)) {
      return false
    }
  }
  return true
}

// SliceStable sorts the slice x while keeping the original order of equal elements
export async function SliceStable(
  x: $.Slice<any>,
  less: LessFunc,
): globalThis.Promise<void> {
  await Slice(x, less)
}

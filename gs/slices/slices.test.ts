import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  All,
  AppendSeq,
  Backward,
  BinarySearch,
  Clip,
  Compact,
  CompactFunc,
  CompareFunc,
  Concat,
  DeleteFunc,
  Equal,
  EqualFunc,
  Index,
  IndexFunc,
  IsSorted,
  IsSortedFunc,
  Max,
  MaxFunc,
  Min,
  MinFunc,
  Replace,
  Sorted,
  SortFunc,
  SortStableFunc,
} from './slices.js'

describe('slices Go comparable equality and lower-bound search', () => {
  // Go compares comparable elements (arrays/structs) by value with ==, and
  // BinarySearch returns the earliest index for duplicate targets.
  it('Compact removes adjacent equal-by-value array elements', () => {
    expect(Array.from(Compact($.arrayToSlice([[1], [1], [2]])) ?? [])).toEqual([
      [1],
      [2],
    ])
  })

  it('Equal compares array elements by value', () => {
    expect(Equal($.arrayToSlice([[1, 2]]), $.arrayToSlice([[1, 2]]))).toBe(true)
    expect(Equal($.arrayToSlice([[1, 2]]), $.arrayToSlice([[1, 3]]))).toBe(
      false,
    )
  })

  it('Index finds an equal-by-value array element', () => {
    expect(Index($.arrayToSlice([[1], [2], [3]]), [2])).toBe(1)
    expect(Index($.arrayToSlice([[1], [2]]), [9])).toBe(-1)
  })

  it('BinarySearch returns the first index of a duplicate target', () => {
    expect(BinarySearch($.arrayToSlice([1, 2, 2, 2, 3]), 2)).toEqual([1, true])
    expect(BinarySearch($.arrayToSlice([1, 2, 2, 2, 3]), 4)).toEqual([5, false])
    expect(BinarySearch($.arrayToSlice([1, 3, 5]), 0)).toEqual([0, false])
  })
})

describe('slices.SortFunc', () => {
  it('awaits async comparison callbacks', async () => {
    const values = $.arrayToSlice([3, 1, 2])

    await SortFunc(values, async (a, b) => a - b)

    expect(Array.from(values ?? [])).toEqual([1, 2, 3])
  })
})

describe('slices.SortStableFunc', () => {
  it('preserves original order for equal elements', () => {
    const values = $.arrayToSlice([
      { group: 2, label: 'a' },
      { group: 1, label: 'b' },
      { group: 2, label: 'c' },
      { group: 1, label: 'd' },
    ])

    SortStableFunc(values, (a, b) => a.group - b.group)

    expect(values?.map((value) => value.label)).toEqual(['b', 'd', 'a', 'c'])
  })

  it('sorts stable sparse proxy-backed slices without dropping elements', () => {
    const values = $.appendSlice(null, [
      { group: 2, label: 'a' },
      { group: 1, label: 'b' },
      { group: 2, label: 'c' },
      { group: 1, label: 'd' },
    ])

    SortStableFunc(values, (a, b) => a.group - b.group)

    expect(Array.from(values ?? []).map((value) => value.label)).toEqual([
      'b',
      'd',
      'a',
      'c',
    ])
  })
})

describe('slices compatibility helpers', () => {
  it('implements comparison, min/max, compact, replace, clip, and search helpers', () => {
    expect(
      CompareFunc(
        $.arrayToSlice(['a', 'c']),
        $.arrayToSlice(['a', 'b']),
        (a, b) => a.localeCompare(b),
      ),
    ).toBeGreaterThan(0)
    expect(Min($.arrayToSlice([3, 1, 2]))).toBe(1)
    expect(
      MaxFunc($.arrayToSlice([{ v: 1 }, { v: 4 }]), (a, b) => a.v - b.v).v,
    ).toBe(4)
    expect(
      MinFunc($.arrayToSlice([{ v: 3 }, { v: 2 }]), (a, b) => a.v - b.v).v,
    ).toBe(2)
    expect(Array.from(Compact($.arrayToSlice([1, 1, 2, 2, 3])) ?? [])).toEqual([
      1, 2, 3,
    ])
    expect(
      Array.from(
        CompactFunc(
          $.arrayToSlice(['a', 'A', 'b']),
          (a, b) => a.toLowerCase() === b.toLowerCase(),
        ) ?? [],
      ),
    ).toEqual(['a', 'b'])
    expect(
      Array.from(Replace($.arrayToSlice([1, 2, 3, 4]), 1, 3, 9, 8)) ?? [],
    ).toEqual([1, 9, 8, 4])
    expect(Array.from(Clip($.arrayToSlice([1, 2])) ?? [])).toEqual([1, 2])
    expect(BinarySearch($.arrayToSlice([1, 3, 5]), 3)).toEqual([1, true])
  })

  it('concatenates slices and preserves empty concat nilness', () => {
    expect(Concat()).toBeNull()
    expect(Concat($.arrayToSlice<number>([]))).toBeNull()
    expect(
      Array.from(
        Concat($.arrayToSlice([1]), null, $.arrayToSlice([2, 3])) ?? [],
      ),
    ).toEqual([1, 2, 3])
    expect(
      Array.from(Concat(new Uint8Array([1, 2]), new Uint8Array([3])) ?? []),
    ).toEqual([1, 2, 3])
  })

  it('accepts generated possibly-async callback types for sync helpers', () => {
    const compare: (a: number, b: number) => number | Promise<number> = (
      a,
      b,
    ) => a - b
    const keepOdd: (v: number) => boolean | Promise<boolean> = (v) =>
      v % 2 === 0
    const equal: (a: string, b: string) => boolean | Promise<boolean> = (
      a,
      b,
    ) => a === b

    expect(
      CompareFunc($.arrayToSlice([1]), $.arrayToSlice([2]), compare),
    ).toBeLessThan(0)
    expect(
      Array.from(DeleteFunc($.arrayToSlice([1, 2, 3]), keepOdd) ?? []),
    ).toEqual([1, 3])
    expect(EqualFunc($.arrayToSlice(['a']), $.arrayToSlice(['a']), equal)).toBe(
      true,
    )
    expect(IndexFunc($.arrayToSlice([1, 2, 3]), keepOdd)).toBe(1)
    expect(IsSortedFunc($.arrayToSlice([1, 2, 3]), compare)).toBe(true)
    expect(BinarySearch($.arrayToSlice([1, 2, 3]), 2)).toEqual([1, true])
  })

  it('rejects actual async callback results in sync helpers', () => {
    expect(() =>
      CompareFunc(
        $.arrayToSlice([1]),
        $.arrayToSlice([2]),
        async (a, b) => a - b,
      ),
    ).toThrow('slices: asynchronous callback result is not supported')
  })
})

describe('slices.Sorted', () => {
  it('collects and sorts iterator values', () => {
    const values = Sorted<string>((yieldValue) => {
      yieldValue('c')
      yieldValue('a')
      yieldValue('b')
    })

    expect(Array.from(values ?? [])).toEqual(['a', 'b', 'c'])
  })
})

describe('slices.AppendSeq', () => {
  it('appends iterator values to an existing slice', () => {
    const values = AppendSeq($.arrayToSlice([1]), (yieldValue) => {
      yieldValue(2)
      yieldValue(3)
    })

    expect(Array.from(values ?? [])).toEqual([1, 2, 3])
  })

  it('collects into a nil slice and preserves nilness for empty sequences', () => {
    const values = AppendSeq<number>(null, (yieldValue) => {
      yieldValue(4)
      yieldValue(5)
    })
    const empty = AppendSeq<number>(null, () => {})

    expect(Array.from(values ?? [])).toEqual([4, 5])
    expect(empty).toBeNull()
  })
})

describe('slices.Backward', () => {
  it('yields index-value pairs from the end', () => {
    const visited: Array<[number, string]> = []
    Backward($.arrayToSlice(['a', 'b', 'c']))((index, value) => {
      visited.push([index, value])
      return true
    })

    expect(visited).toEqual([
      [2, 'c'],
      [1, 'b'],
      [0, 'a'],
    ])
  })

  it('accepts async yield callbacks', async () => {
    const visited: Array<[number, string]> = []
    await Backward($.arrayToSlice(['a', 'b', 'c']))(async (index, value) => {
      visited.push([index, value])
      return index > 1
    })

    expect(visited).toEqual([
      [2, 'c'],
      [1, 'b'],
    ])
  })
})

describe('slices.All', () => {
  it('accepts async yield callbacks', async () => {
    const visited: Array<[number, string]> = []
    await All($.arrayToSlice(['a', 'b', 'c']))(async (index, value) => {
      visited.push([index, value])
      return index < 1
    })

    expect(visited).toEqual([
      [0, 'a'],
      [1, 'b'],
    ])
  })
})

describe('slices.IsSorted', () => {
  it('reports ordered and unordered slices', () => {
    expect(IsSorted($.arrayToSlice([1, 2, 3]))).toBe(true)
    expect(IsSorted($.arrayToSlice([1, 3, 2]))).toBe(false)
    expect(
      IsSortedFunc($.arrayToSlice(['aa', 'b']), (a, b) => a.length - b.length),
    ).toBe(false)
    expect(
      IsSortedFunc($.arrayToSlice(['b', 'aa']), (a, b) => a.length - b.length),
    ).toBe(true)
  })
})

describe('slices.Max', () => {
  it('returns the greatest ordered value', () => {
    expect(Max($.arrayToSlice([3, 1, 4, 2]))).toBe(4)
    expect(Max($.arrayToSlice(['beta', 'alpha', 'gamma']))).toBe('gamma')
  })

  it('panics for empty slices', () => {
    expect(() => Max($.arrayToSlice<number>([]))).toThrow(
      'slices.Max: empty list',
    )
  })
})

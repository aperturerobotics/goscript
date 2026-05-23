import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  All,
  Backward,
  IsSorted,
  IsSortedFunc,
  Max,
  Sorted,
  SortStableFunc,
} from './slices.js'

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
})

describe('slices.Sorted', () => {
  it('collects and sorts iterator values', () => {
    const values = Sorted<string>((yieldValue) => {
      yieldValue('c')
      yieldValue('a')
      yieldValue('b')
    })

    expect(values).toEqual(['a', 'b', 'c'])
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

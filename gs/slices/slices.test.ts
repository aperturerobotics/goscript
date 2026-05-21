import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { Sorted, SortStableFunc } from './slices.js'

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

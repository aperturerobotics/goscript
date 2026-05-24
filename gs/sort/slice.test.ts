import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'

import { Slice, SliceIsSorted, SliceStable } from './slice.gs.js'

describe('sort.Slice override', () => {
  it('sorts slices with logarithmic comparator growth', async () => {
    const values = $.arrayToSlice<number>(
      Array.from({ length: 128 }, (_, i) => 128 - i),
    )
    let calls = 0

    await Slice(values, (i, j) => {
      calls++
      return values![i] < values![j]
    })

    expect(values).toEqual(Array.from({ length: 128 }, (_, i) => i + 1))
    expect(calls).toBeLessThan(1200)
  })

  it('keeps equal values stable for SliceStable', async () => {
    const values = $.arrayToSlice([
      { group: 1, name: 'a' },
      { group: 0, name: 'b' },
      { group: 1, name: 'c' },
      { group: 0, name: 'd' },
    ])

    await SliceStable(values, (i, j) => values![i].group < values![j].group)

    expect(values?.map((value) => value.name)).toEqual(['b', 'd', 'a', 'c'])
    expect(
      await SliceIsSorted(
        values,
        (i, j) => values![i].group < values![j].group,
      ),
    ).toBe(true)
  })
})

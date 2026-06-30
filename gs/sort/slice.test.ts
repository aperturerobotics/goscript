import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'

import { Slice, SliceIsSorted, SliceStable } from './slice.gs.js'
import {
  Float64Slice,
  Float64s,
  Float64sAreSorted,
  StringSlice,
  Strings,
  StringsAreSorted,
} from './sort.gs.js'

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

  it('orders NaN before other float64 values', () => {
    const values = $.arrayToSlice([1, Number.NaN])

    Float64s(values)

    expect(Number.isNaN(values![0])).toBe(true)
    expect(values![1]).toBe(1)
    expect(Float64sAreSorted(values)).toBe(true)
    expect(new Float64Slice($.arrayToSlice([Number.NaN, 1])).Less(0, 1)).toBe(
      true,
    )
  })

  it('orders strings by Go UTF-8 byte order', () => {
    const astral = '\u{10000}'
    const privateUse = '\uE000'
    const values = $.arrayToSlice([astral, privateUse])

    Strings(values)

    expect(values).toEqual([privateUse, astral])
    expect(StringsAreSorted(values)).toBe(true)
    expect(new StringSlice(values).Less(0, 1)).toBe(true)
  })
})

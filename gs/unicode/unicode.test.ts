import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { CategoryAliases, Cn, Is, Range16, Range32, RangeTable } from './unicode.js'

describe('unicode overrides', () => {
  it('accepts generated struct-literal constructor shapes', () => {
    const table = new RangeTable({
      R16: $.arrayToSlice<Range16>([new Range16({ Lo: 0x41, Hi: 0x5a, Stride: 1 })]),
      R32: $.arrayToSlice<Range32>([new Range32({ Lo: 0x10000, Hi: 0x10002, Stride: 1 })]),
      LatinOffset: 1,
    })

    expect(table.LatinOffset).toBe(1)
    expect(Is(table, 0x41)).toBe(true)
    expect(Is(table, 0x10001)).toBe(true)
    expect(Is(table, 0x61)).toBe(false)
  })

  it('exports category aliases used by regexp/syntax', () => {
    expect(CategoryAliases.get('digit')).toBe('Nd')
    expect(Cn).toBeInstanceOf(RangeTable)
  })
})

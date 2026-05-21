import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { FullRune } from './utf8.js'

describe('unicode/utf8 overrides', () => {
  it('accepts GoScript byte slices in FullRune', () => {
    expect(FullRune($.arrayToSlice<number>([0x61]))).toBe(true)
    expect(FullRune($.goSlice([0xe2, 0x82, 0xac], 0, 2))).toBe(false)
    expect(FullRune($.goSlice([0xe2, 0x82, 0xac], 0, 3))).toBe(true)
  })
})

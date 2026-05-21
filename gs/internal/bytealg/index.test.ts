import { describe, expect, test } from 'vitest'

import { IndexByteString, LastIndexByteString } from './index.js'

describe('internal/bytealg string byte indexes', () => {
  test('finds first and last byte positions in strings', () => {
    expect(IndexByteString('hello', 'l'.charCodeAt(0))).toBe(2)
    expect(LastIndexByteString('hello', 'l'.charCodeAt(0))).toBe(3)
    expect(LastIndexByteString('hello', 'x'.charCodeAt(0))).toBe(-1)
    expect(LastIndexByteString('', 'x'.charCodeAt(0))).toBe(-1)
  })
})

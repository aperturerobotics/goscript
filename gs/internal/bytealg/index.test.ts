import { describe, expect, test } from 'vitest'

import { CountString, IndexByteString, LastIndexByteString } from './index.js'

describe('internal/bytealg string byte indexes', () => {
  test('finds first and last byte positions in strings', () => {
    expect(IndexByteString('hello', 'l'.charCodeAt(0))).toBe(2)
    expect(LastIndexByteString('hello', 'l'.charCodeAt(0))).toBe(3)
    expect(LastIndexByteString('hello', 'x'.charCodeAt(0))).toBe(-1)
    expect(LastIndexByteString('', 'x'.charCodeAt(0))).toBe(-1)
  })

  test('counts byte positions in strings', () => {
    expect(CountString('hello', 'l'.charCodeAt(0))).toBe(2)
    expect(CountString('hello', 'x'.charCodeAt(0))).toBe(0)
    expect(CountString('', 'x'.charCodeAt(0))).toBe(0)
  })
})

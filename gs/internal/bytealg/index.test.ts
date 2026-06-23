import { describe, expect, test } from 'vitest'

import {
  CountString,
  IndexByteString,
  IndexString,
  LastIndexByteString,
} from './index.js'

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

  test('indexes UTF-8 bytes, not UTF-16 code units (Go semantics)', () => {
    // '你' encodes to UTF-8 bytes E4 BD A0. A 0xA0 byte lives at byte index 2,
    // and the trailing 'A' at byte index 3; UTF-16 search would mislocate both.
    const s = '你A'
    expect(IndexByteString(s, 0xe4)).toBe(0)
    expect(IndexByteString(s, 0xa0)).toBe(2)
    expect(IndexByteString(s, 'A'.charCodeAt(0))).toBe(3)
    expect(LastIndexByteString(s, 0xbd)).toBe(1)
    expect(CountString('日本語', 0xe6)).toBe(2)
  })

  test('IndexString returns the byte offset of a multibyte substring', () => {
    // 'A你B': 'B' is at byte index 4 (1 + 3 UTF-8 bytes for 你).
    expect(IndexString('A你B', 'B')).toBe(4)
    expect(IndexString('A你B', '你')).toBe(1)
    expect(IndexString('hello', '')).toBe(0)
    expect(IndexString('hi', 'hello')).toBe(-1)
    expect(IndexString('hello', 'xyz')).toBe(-1)
  })
})

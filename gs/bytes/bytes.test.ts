import * as $ from '@goscript/builtin/index.js'
import { IndexFunc, Replace } from './index.js'
import { describe, expect, test } from 'vitest'

const rep = (s: string, old: string, n: string, count: number): string =>
  $.bytesToString(
    Replace(
      $.stringToBytes(s),
      $.stringToBytes(old),
      $.stringToBytes(n),
      count,
    ),
  )

describe('bytes', () => {
  test('Replace with empty old appends the untouched remainder', () => {
    // Go: bytes.Replace([]byte("abc"), []byte(""), []byte("-"), 2) => "-a-bc".
    expect(rep('abc', '', '-', 2)).toBe('-a-bc')
    expect(rep('abc', '', '-', -1)).toBe('-a-b-c-')
    expect(rep('aaa', 'a', 'b', -1)).toBe('bbb')
  })

  test('IndexFunc accepts generated async-shaped callbacks', () => {
    const predicate: (r: number) => boolean | Promise<boolean> = (r) =>
      r === 0x62

    expect(IndexFunc($.stringToBytes('abc'), predicate)).toBe(1)
  })

  test('IndexFunc rejects actual async callback results', () => {
    expect(() =>
      IndexFunc($.stringToBytes('abc'), async (r) => r === 0x62),
    ).toThrow('bytes: asynchronous callback result is not supported')
  })
})

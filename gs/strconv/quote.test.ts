import { describe, expect, it } from 'vitest'

import {
  Quote,
  QuoteRune,
  QuoteToASCII,
} from './quote.gs.js'

// Expected outputs are the literal strings Go's strconv produces (go1.26.4).
describe('strconv.Quote (Go escape semantics)', () => {
  it('passes printable ASCII and Unicode through unchanged', () => {
    expect(Quote('hello')).toBe('"hello"')
    // CJK is printable; Go leaves graphic Unicode in place.
    expect(Quote('背景')).toBe('"背景"')
    // U+1F600 is graphic; not truncated and not escaped.
    expect(Quote('😀')).toBe('"😀"')
  })

  it('escapes the quote and backslash', () => {
    expect(Quote('a"b\\c')).toBe('"a\\"b\\\\c"')
  })

  it('uses Go named escapes including \\a and \\v that JSON lacks', () => {
    expect(Quote('a\tb\n')).toBe('"a\\tb\\n"')
    expect(Quote('\x07\x0b')).toBe('"\\a\\v"')
  })

  it('uses \\xNN for control bytes and DEL, not \\uNNNN', () => {
    expect(Quote('\x00\x1f')).toBe('"\\x00\\x1f"')
    expect(Quote('\x7f')).toBe('"\\x7f"')
  })
})

describe('strconv.QuoteToASCII', () => {
  it('escapes non-ASCII as \\u and astral as \\U', () => {
    expect(QuoteToASCII('背景')).toBe('"\\u80cc\\u666f"')
    expect(QuoteToASCII('😀')).toBe('"\\U0001f600"')
    expect(QuoteToASCII('hi')).toBe('"hi"')
  })
})

describe('strconv.QuoteRune', () => {
  it('quotes printable, control, and astral runes like Go', () => {
    expect(QuoteRune('a'.charCodeAt(0))).toBe("'a'")
    expect(QuoteRune(0x09)).toBe("'\\t'")
    expect(QuoteRune(0x1f600)).toBe("'😀'")
    expect(QuoteRune(0x27)).toBe("'\\''")
    expect(QuoteRune(0x00)).toBe("'\\x00'")
  })

  it('folds an invalid rune to the U+FFFD escape', () => {
    expect(QuoteRune(0x110000)).toBe("'\\ufffd'")
  })
})

import { describe, expect, it } from 'vitest'

import {
  CanBackquote,
  Quote,
  QuoteRune,
  QuoteToASCII,
  Unquote,
  UnquoteChar,
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

// Ground truth captured from go1.26.4 strconv.Unquote / CanBackquote /
// UnquoteChar over the same inputs.
describe('strconv.Unquote (Go escape decoding)', () => {
  it('decodes \\x, octal, \\u, and \\U escapes', () => {
    expect(Unquote('"\\x41"')).toEqual(['A', null])
    expect(Unquote('"\\101"')).toEqual(['A', null]) // octal 101 = 'A'
    expect(Unquote('"\\u0041"')).toEqual(['A', null])
    expect(Unquote('"\\U0001F600"')).toEqual(['😀', null])
  })

  it('decodes named escapes and passes printable Unicode through', () => {
    expect(Unquote('"a\\tb"')).toEqual(['a\tb', null])
    expect(Unquote('"é"')).toEqual(['é', null])
  })

  it('handles backquoted strings without processing escapes', () => {
    expect(Unquote('`raw\\tno-escape`')).toEqual(['raw\\tno-escape', null])
    expect(Unquote('`with`back`')[1]).not.toBeNull() // embedded backtick fails
  })

  it('requires single-quoted literals to hold exactly one rune', () => {
    expect(Unquote("'a'")).toEqual(['a', null])
    expect(Unquote("'\\x41'")).toEqual(['A', null])
    expect(Unquote("'ab'")[1]).not.toBeNull()
  })

  it('rejects malformed input', () => {
    expect(Unquote('"')[1]).not.toBeNull()
    expect(Unquote('"\\x4"')[1]).not.toBeNull() // short hex
    expect(Unquote('"a')[1]).not.toBeNull() // unterminated
  })
})

describe('strconv.CanBackquote (Go control rules)', () => {
  it('allows tab but rejects other control bytes, backtick, DEL, and BOM', () => {
    expect(CanBackquote('a\tb')).toBe(true)
    expect(CanBackquote('plain text')).toBe(true)
    expect(CanBackquote('a\nb')).toBe(false)
    expect(CanBackquote('a`b')).toBe(false)
    expect(CanBackquote('a\x7fb')).toBe(false)
    expect(CanBackquote('\uFEFF')).toBe(false)
  })
})

describe('strconv.UnquoteChar (tail + multibyte)', () => {
  it('decodes one escape and returns the remaining tail', () => {
    expect(UnquoteChar('\\x41rest', 0x22)).toEqual([0x41, false, 'rest', null])
  })

  it('flags multibyte runes from \\u escapes', () => {
    expect(UnquoteChar('\\u00e9z', 0x22)).toEqual([0xe9, true, 'z', null])
  })
})

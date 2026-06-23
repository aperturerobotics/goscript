import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { AppendBool } from './atob.gs.js'
import { AppendFloat } from './ftoa.gs.js'
import { AppendInt, AppendUint, FormatUint } from './itoa.gs.js'
import {
  AppendQuote,
  AppendQuoteRune,
  AppendQuoteRuneToASCII,
  AppendQuoteRuneToGraphic,
  AppendQuoteToASCII,
  AppendQuoteToGraphic,
  IsGraphic,
  IsPrint,
  QuoteRuneToASCII,
  QuoteRuneToGraphic,
  QuotedPrefix,
  QuoteToGraphic,
} from './quote.gs.js'

// Expected outputs are the literal results Go's strconv produces (go1.26.4).
function appended(dst: $.Bytes): string {
  return $.bytesToString(dst)
}

function prefix(s: string): $.Bytes {
  return $.stringToBytes(s)
}

describe('strconv append/format coverage (Go semantics)', () => {
  it('FormatUint renders in the requested base', () => {
    expect(FormatUint(255, 16)).toBe('ff')
    expect(FormatUint(10, 2)).toBe('1010')
  })

  it('AppendInt/AppendUint extend the destination buffer', () => {
    expect(appended(AppendInt(prefix('x='), -42, 10))).toBe('x=-42')
    expect(appended(AppendUint(prefix('x='), 255, 16))).toBe('x=ff')
  })

  it('AppendBool appends true/false', () => {
    expect(appended(AppendBool(prefix('b='), true))).toBe('b=true')
    expect(appended(AppendBool(prefix('b='), false))).toBe('b=false')
  })

  it('AppendFloat formats with the given verb and precision', () => {
    expect(appended(AppendFloat(prefix('f='), 3.14159, 0x66, 2, 64))).toBe(
      'f=3.14',
    )
  })

  it('AppendQuote escapes like Quote', () => {
    expect(appended(AppendQuote(prefix('q='), 'a\tb'))).toBe('q="a\\tb"')
  })

  it('AppendQuoteToASCII escapes non-ASCII to \\u', () => {
    expect(appended(AppendQuoteToASCII(prefix(''), 'héllo'))).toBe(
      '"h\\u00e9llo"',
    )
  })

  it('AppendQuoteToGraphic keeps graphic Unicode in place', () => {
    expect(appended(AppendQuoteToGraphic(prefix(''), '背'))).toBe('"背"')
  })

  it('AppendQuoteRune* quote a single rune', () => {
    expect(appended(AppendQuoteRune(prefix(''), 0x41))).toBe("'A'")
    expect(appended(AppendQuoteRuneToASCII(prefix(''), 0x4e16))).toBe(
      "'\\u4e16'",
    )
    expect(appended(AppendQuoteRuneToGraphic(prefix(''), 0x4e16))).toBe("'世'")
  })

  it('QuoteToGraphic and QuoteRune variants match Go', () => {
    expect(QuoteToGraphic('背\t')).toBe('"背\\t"')
    expect(QuoteRuneToASCII(0x4e16)).toBe("'\\u4e16'")
    expect(QuoteRuneToGraphic(0x4e16)).toBe("'世'")
  })

  it('IsPrint and IsGraphic match Go predicates', () => {
    expect(IsPrint(0x41)).toBe(true)
    expect(IsPrint(0x09)).toBe(false)
    expect(IsPrint(0x07)).toBe(false)
    expect(IsGraphic(0x41)).toBe(true)
    expect(IsGraphic(0x20)).toBe(true)
    expect(IsGraphic(0x09)).toBe(false)
  })

  it('QuotedPrefix returns the leading quoted literal or a syntax error', () => {
    const [p, err] = QuotedPrefix('"abc" tail')
    expect(p).toBe('"abc"')
    expect(err).toBeNull()
    const [p2, err2] = QuotedPrefix('nope')
    expect(p2).toBe('')
    expect(err2).not.toBeNull()
  })
})

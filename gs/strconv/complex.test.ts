import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { FormatComplex, ParseComplex } from './complex.gs.js'

describe('strconv complex helpers', () => {
  it('formats complex values with Go-style parentheses', () => {
    expect(FormatComplex($.complex(1.5, -2), 'f'.charCodeAt(0), -1, 128)).toBe(
      '(1.5-2i)',
    )
  })

  it('parses signed complex values', () => {
    const [value, err] = ParseComplex('(1.5-2i)', 128)

    expect(err).toBeNull()
    expect($.real(value)).toBe(1.5)
    expect($.imag(value)).toBe(-2)
  })

  it('parses real, imaginary, parenthesized, and signed imaginary forms', () => {
    const cases = [
      ['1', 1, 0],
      ['(1)', 1, 0],
      ['1i', 0, 1],
      ['+1i', 0, 1],
      ['-1i', 0, -1],
      ['(1i)', 0, 1],
      ['1+2i', 1, 2],
      ['1+-2i', 1, -2],
      ['1e+2-3i', 100, -3],
      ['1e-2+3i', 0.01, 3],
      ['0x1p+2+0x1.8p+1i', 4, 3],
      ['0x1p-1-0x1p+1i', 0.5, -2],
      ['0x1.8p+2i', 0, 6],
      ['0x_3p3i', 0, 24],
      ['0x_10.3p-8+0x3p3i', 16.1875 / 256, 24],
    ] as const

    for (const [input, real, imag] of cases) {
      const [value, err] = ParseComplex(input, 128)

      expect(err, input).toBeNull()
      expect($.real(value)).toBe(real)
      expect($.imag(value)).toBe(imag)
    }
  })

  it('rejects whitespace and malformed imaginary forms', () => {
    for (const input of [
      ' 1+2i',
      '1+2i ',
      '1 +2i',
      'i',
      '+i',
      '-i',
      '1++2i',
      '1-+2i',
      '0xp1',
    ]) {
      const [, err] = ParseComplex(input, 128)

      expect(err?.Error(), input).toBe(
        `strconv.ParseComplex: parsing "${input}": invalid syntax`,
      )
    }
  })

  it('reports hexadecimal range errors', () => {
    const [value, err] = ParseComplex('0x1p1025', 128)

    expect($.real(value)).toBe(Infinity)
    expect($.imag(value)).toBe(0)
    expect(err?.Error()).toBe(
      'strconv.ParseComplex: parsing "0x1p1025": value out of range',
    )
  })
})

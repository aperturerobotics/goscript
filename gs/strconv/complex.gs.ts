import * as $ from '@goscript/builtin/index.js'
import { FormatFloat } from './ftoa.gs.js'
import { ParseFloat } from './atof.gs.js'
import { ErrRange, ErrSyntax, NumError } from './atoi.gs.js'

export function FormatComplex(
  c: $.Complex,
  fmt: number,
  prec: number,
  bitSize: number,
): string {
  const real = FormatFloat($.real(c), fmt, prec, bitSize / 2)
  const imag = $.imag(c)
  const imagText = FormatFloat(Math.abs(imag), fmt, prec, bitSize / 2)
  const sign = imag < 0 || Object.is(imag, -0) ? '-' : '+'
  return `(${real}${sign}${imagText}i)`
}

export function ParseComplex(
  s: string,
  bitSize: number,
): [$.Complex, $.GoError] {
  if (/\s/.test(s)) {
    return [$.complex(0, 0), complexSyntaxError(s)]
  }
  const text = s
  if (text.startsWith('(') !== text.endsWith(')')) {
    return [$.complex(0, 0), complexSyntaxError(s)]
  }
  const inner =
    text.startsWith('(') && text.endsWith(')') ? text.slice(1, -1) : text
  if (inner === '') {
    return [$.complex(0, 0), complexSyntaxError(s)]
  }
  if (!inner.endsWith('i')) {
    const [real, err] = parseComplexFloat(inner, bitSize)
    if (err !== null) {
      return [$.complex(isRangeError(err) ? real : 0, 0), complexError(s, err)]
    }
    return [$.complex(real, 0), null]
  }

  const body = inner.slice(0, -1)
  if (body === '' || body === '+' || body === '-') {
    return [$.complex(0, 0), complexSyntaxError(s)]
  }
  const [pureImag, pureImagErr] = parseComplexFloat(body, bitSize)
  if (pureImagErr === null) {
    return [$.complex(0, pureImag), null]
  }
  if (isRangeError(pureImagErr)) {
    return [$.complex(0, pureImag), complexRangeError(s)]
  }

  const split = splitComplexParts(body, bitSize)
  if (split === null) {
    return [$.complex(0, 0), complexSyntaxError(s)]
  }
  const [realText, imagText] = split
  const [real, realErr] = parseComplexFloat(realText, bitSize)
  if (realErr !== null) {
    return [$.complex(isRangeError(realErr) ? real : 0, 0), complexError(s, realErr)]
  }
  const [imag, imagErr] = parseComplexFloat(imagText, bitSize)
  if (imagErr !== null) {
    return [$.complex(real, isRangeError(imagErr) ? imag : 0), complexError(s, imagErr)]
  }
  return [$.complex(real, imag), null]
}

function splitComplexParts(body: string, bitSize: number): [string, string] | null {
  for (let i = body.length - 1; i > 0; i--) {
    const char = body[i]
    if (
      (char === '+' || char === '-') &&
      body[i - 1] !== 'e' &&
      body[i - 1] !== 'E' &&
      body[i - 1] !== 'p' &&
      body[i - 1] !== 'P'
    ) {
      const realText = body.slice(0, i)
      const imagText = body.slice(i)
      if (complexPartsParse(realText, imagText, bitSize)) {
        return [realText, imagText]
      }
      if (char === '+' && body[i + 1] === '-' && complexPartsParse(realText, body.slice(i + 1), bitSize)) {
        return [realText, body.slice(i + 1)]
      }
    }
  }
  return null
}

function complexPartsParse(realText: string, imagText: string, bitSize: number): boolean {
  const [, realErr] = parseComplexFloat(realText, bitSize)
  if (realErr !== null) {
    return false
  }
  const [, imagErr] = parseComplexFloat(imagText, bitSize)
  return imagErr === null
}

function parseComplexFloat(s: string, bitSize: number): [number, $.GoError] {
  if (!isComplexFloatLiteral(s)) {
    return [0, complexSyntaxError(s)]
  }
  if (isHexFloatLiteral(s)) {
    return parseHexFloat(s, bitSize / 2)
  }
  const [value, err] = ParseFloat(s, bitSize / 2)
  if (err !== null) {
    return [value, err]
  }
  if (!Number.isFinite(value) && !/^[+-]?(?:inf(?:inity)?|nan)$/i.test(s)) {
    return [value, new NumError({ Func: 'ParseFloat', Num: s, Err: ErrRange })]
  }
  return [value, null]
}

function isComplexFloatLiteral(s: string): boolean {
  return (
    /^[+-]?(?:(?:inf(?:inity)?)|nan|(?:(?:(?:\d(?:_?\d)*)(?:\.(?:\d(?:_?\d)*)?)?)|(?:\.(?:\d(?:_?\d)*)))(?:[eE][+-]?\d(?:_?\d)*)?)$/i.test(s) ||
    isHexFloatLiteral(s)
  )
}

function isHexFloatLiteral(s: string): boolean {
  if (!/^[+-]?0[xX]_?(?:(?:[0-9A-Fa-f](?:_?[0-9A-Fa-f])*(?:\.(?:[0-9A-Fa-f](?:_?[0-9A-Fa-f])*)?)?)|(?:\.(?:[0-9A-Fa-f](?:_?[0-9A-Fa-f])*)))[pP][+-]?\d(?:_?\d)*$/.test(s)) {
    return false
  }
  const unsigned = s[0] === '+' || s[0] === '-' ? s.slice(1) : s
  const marker = unsigned.toLowerCase().indexOf('p')
  const digits = unsigned.slice(2, marker).replace('.', '').replace(/_/g, '')
  return /^[0-9A-Fa-f]+$/.test(digits)
}

function parseHexFloat(s: string, bitSize: number): [number, $.GoError] {
  const sign = s.startsWith('-') ? -1 : 1
  const unsigned = s[0] === '+' || s[0] === '-' ? s.slice(1) : s
  const clean = unsigned.replace(/_/g, '').toLowerCase()
  const marker = clean.indexOf('p')
  const mantissa = clean.slice(2, marker)
  const exponent = Number.parseInt(clean.slice(marker + 1), 10)
  const [whole, frac = ''] = mantissa.split('.')
  let value = whole === '' ? 0 : Number.parseInt(whole, 16)
  for (let i = 0; i < frac.length; i++) {
    value += Number.parseInt(frac[i], 16) / 16 ** (i + 1)
  }
  const parsed = sign * value * 2 ** exponent
  if (!Number.isFinite(parsed)) {
    return [parsed, new NumError({ Func: 'ParseFloat', Num: s, Err: ErrRange })]
  }
  const maxFloat32 = 3.4028234663852886e38
  if (bitSize === 32 && Math.abs(parsed) > maxFloat32) {
    return [parsed > 0 ? Infinity : -Infinity, new NumError({ Func: 'ParseFloat', Num: s, Err: ErrRange })]
  }
  return [parsed, null]
}

function complexSyntaxError(s: string): $.GoError {
  return new NumError({ Func: 'ParseComplex', Num: s, Err: ErrSyntax })
}

function complexRangeError(s: string): $.GoError {
  return new NumError({ Func: 'ParseComplex', Num: s, Err: ErrRange })
}

function complexError(s: string, err: $.GoError): $.GoError {
  return isRangeError(err) ? complexRangeError(s) : complexSyntaxError(s)
}

function isRangeError(err: $.GoError): boolean {
  return err !== null && err.Error().includes('value out of range')
}

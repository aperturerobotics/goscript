import * as $ from '@goscript/builtin/index.js'

export function Select(v: number, x: number, y: number): number {
  v = boolToUint8(v !== 0)
  return (~(v - 1) & x) | ((v - 1) & y)
}

export function ByteEq(x: number, y: number): number {
  return $.int(boolToUint8($.uint(x, 8) === $.uint(y, 8)))
}

export function Eq(x: number, y: number): number {
  return $.int(boolToUint8($.int(x, 32) === $.int(y, 32)))
}

export function LessOrEq(x: number, y: number): number {
  return $.int(boolToUint8(x <= y))
}

function boolToUint8(b: boolean): number {
  return b ? 1 : 0
}

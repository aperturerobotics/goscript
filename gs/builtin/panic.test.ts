import { describe, expect, it } from 'vitest'

import { int64Div, pointerValue } from './builtin.js'
import {
  GoPanic,
  RuntimeError,
  panic,
  panicValue,
  runtimePanic,
} from './panic.js'
import { goSlice, index, makeSlice } from './slice.js'

// captureThrow returns whatever value the callback throws, or undefined if it
// did not throw. Go panics surface as a thrown GoPanic in the transpiled
// runtime, so tests assert on the caught value's shape.
function captureThrow(fn: () => unknown): unknown {
  try {
    fn()
  } catch (e) {
    return e
  }
  return undefined
}

describe('runtime panics route through GoPanic', () => {
  it('runtimePanic throws a GoPanic carrying a RuntimeError', () => {
    const caught = captureThrow(() => runtimePanic('runtime error: boom'))

    expect(caught).toBeInstanceOf(GoPanic)
    const value = (caught as GoPanic).value
    expect(value).toBeInstanceOf(RuntimeError)
    // The recovered value implements the Go error interface.
    expect((value as RuntimeError).Error()).toBe('runtime error: boom')
    // The unrecovered crash text matches Go's "panic: <value>" shape.
    expect((caught as GoPanic).message).toBe('panic: runtime error: boom')
  })

  it('integer divide by zero panics with the Go message', () => {
    const caught = captureThrow(() => int64Div(1n, 0n))

    expect(caught).toBeInstanceOf(GoPanic)
    expect(((caught as GoPanic).value as RuntimeError).Error()).toBe(
      'runtime error: integer divide by zero',
    )
  })

  it('nil pointer dereference panics with the Go message', () => {
    const caught = captureThrow(() => pointerValue(null))

    expect(caught).toBeInstanceOf(GoPanic)
    expect(((caught as GoPanic).value as RuntimeError).Error()).toBe(
      'runtime error: invalid memory address or nil pointer dereference',
    )
  })

  it('index out of range panics with the Go message', () => {
    const caught = captureThrow(() => index(new Uint8Array([1, 2, 3]), 5))

    expect(caught).toBeInstanceOf(GoPanic)
    expect(((caught as GoPanic).value as RuntimeError).Error()).toBe(
      'runtime error: index out of range [5] with length 3',
    )
  })

  it('slice bounds out of range panics with the Go message', () => {
    const caught = captureThrow(() => goSlice([1, 2, 3], 2, 1))

    expect(caught).toBeInstanceOf(GoPanic)
    expect(((caught as GoPanic).value as RuntimeError).Error()).toBe(
      'runtime error: slice bounds out of range [2:1]',
    )
  })

  it('makeslice with negative capacity panics with the Go message', () => {
    const caught = captureThrow(() => makeSlice<number>(1, -1))

    expect(caught).toBeInstanceOf(GoPanic)
    expect(((caught as GoPanic).value as RuntimeError).Error()).toBe(
      'runtime error: makeslice: cap out of range',
    )
  })

  it('panic carries an arbitrary value that panicValue unwraps', () => {
    const caught = captureThrow(() => panic('boom'))

    expect(caught).toBeInstanceOf(GoPanic)
    expect(panicValue(caught)).toBe('boom')
    // panicValue passes non-panic values through unchanged.
    expect(panicValue('plain')).toBe('plain')
  })
})

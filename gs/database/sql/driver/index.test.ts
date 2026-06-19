import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as time from '@goscript/time/index.js'

import {
  Bool,
  DefaultParameterConverter,
  ErrBadConn,
  ErrSkip,
  Int32,
  IsScanValue,
  IsValue,
  RowsAffected_LastInsertId,
  RowsAffected_RowsAffected,
  String,
} from './index.js'

function expectGoErrorThrow(fn: () => unknown, message: string): void {
  try {
    fn()
  } catch (err) {
    expect((err as $.GoError)?.Error()).toBe(message)
    return
  }
  throw new Error('expected Go error throw')
}

describe('database/sql/driver override', () => {
  it('recognizes reflect-free Value-compatible inputs', () => {
    expect(IsValue(null)).toBe(true)
    expect(IsValue(new Uint8Array([1, 2]))).toBe(true)
    expect(IsValue('query')).toBe(true)
    expect(IsValue(true)).toBe(true)
    expect(IsValue($.int(7, 64))).toBe(true)
    expect(IsValue($.uint(8, 64))).toBe(true)
    expect(IsValue(1.5)).toBe(true)
    expect(IsValue(9n)).toBe(true)
    expect(IsValue(new time.Time())).toBe(true)
    expect(IsScanValue('scan')).toBe(true)
    expect(IsValue({ unsupported: true })).toBe(false)
  })

  it('converts supported Bool, String, and Int32 inputs', () => {
    expect(Bool.ConvertValue(true)).toEqual([true, null])
    expect(Bool.ConvertValue('true')).toEqual([true, null])
    expect(Bool.ConvertValue(new Uint8Array([0x30]))).toEqual([false, null])
    expect(String.ConvertValue('already')).toEqual(['already', null])
    expect(Int32.ConvertValue(123)).toEqual([123, null])
  })

  it('guards reflect-dependent named and pointer converter arms', () => {
    const namedBool = $.namedValueInterfaceValue<unknown>(
      true,
      'main.NamedBool',
      {},
    )

    expectGoErrorThrow(
      () => Bool.ConvertValue(namedBool),
      'database/sql/driver: Bool.ConvertValue of named type is not supported in the GoScript browser build',
    )
    expectGoErrorThrow(
      () => Int32.ConvertValue($.varRef(1)),
      'database/sql/driver: Int32.ConvertValue of pointer is not supported in the GoScript browser build',
    )
    expectGoErrorThrow(
      () => DefaultParameterConverter.ConvertValue($.varRef(1)),
      'database/sql/driver: DefaultParameterConverter.ConvertValue of pointer is not supported in the GoScript browser build',
    )
  })

  it('round trips RowsAffected result methods', () => {
    expect(RowsAffected_RowsAffected(42)).toEqual([42, null])
    const [id, err] = RowsAffected_LastInsertId(42)
    expect(id).toBe(0)
    expect(err?.Error()).toBe('LastInsertId is not supported by this driver')
  })

  it('keeps sentinel error identity stable', () => {
    const skip = ErrSkip
    const bad = ErrBadConn

    expect(ErrSkip).toBe(skip)
    expect(ErrBadConn).toBe(bad)
    expect(ErrSkip).not.toBe(ErrBadConn)
  })
})

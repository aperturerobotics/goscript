import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  ArrayOf,
  New,
  NewAt,
  StructField,
  StructOf,
  TypeOf,
  Value,
  ValueOf,
} from './index.js'
import { SliceAt } from './value.js'

describe('reflect owned pointer handles', () => {
  it('keeps reflected slice elements addressable through owned pointers', () => {
    const values = [1, 2, 3]
    const element = ValueOf(values).Index(1)

    element.SetInt(8)
    expect(values).toEqual([1, 8, 3])

    const address = element.UnsafeAddr()
    expect($.isOwnedPointerHandle(address)).toBe(true)

    const pointer = NewAt(element.Type(), address as any)
    pointer.Elem().SetInt(11)
    expect(values).toEqual([1, 11, 3])

    const refPointer = NewAt(element.Type(), $.indexRef(values, 1) as any)
    refPointer.Elem().SetInt(14)
    expect(values).toEqual([1, 14, 3])
  })

  it('keeps reflected byte slice elements addressable through owned pointers', () => {
    const bytes = new Uint8Array([4, 5, 6])
    const element = ValueOf(bytes).Index(1)

    element.SetUint(9)
    expect(Array.from(bytes)).toEqual([4, 9, 6])

    const address = element.UnsafeAddr()
    expect($.isOwnedPointerHandle(address)).toBe(true)

    const pointer = NewAt(element.Type(), address as any)
    pointer.Elem().SetUint(12)
    expect(Array.from(bytes)).toEqual([4, 12, 6])
  })

  it('keeps reflected array elements addressable through owned pointers', () => {
    const values = [1, 2]
    const arrayValue = new Value(values, ArrayOf(2, TypeOf(0)))
    const element = arrayValue.Index(0)

    element.SetInt(7)
    expect(values).toEqual([7, 2])

    const address = element.UnsafeAddr()
    expect($.isOwnedPointerHandle(address)).toBe(true)

    const pointer = NewAt(element.Type(), address as any)
    pointer.Elem().SetInt(13)
    expect(values).toEqual([13, 2])
  })

  it('lets NewAt write through owned variable and field refs', () => {
    const intType = TypeOf(0)
    const local = $.varRef(1)

    NewAt(intType, local as any)
      .Elem()
      .SetInt(4)
    expect(local.value).toBe(4)

    const target = { count: 2 }
    NewAt(intType, $.fieldRef(target, 'count') as any)
      .Elem()
      .SetInt(5)
    expect(target.count).toBe(5)

    expect(() => SliceAt(intType, local as any, 1)).toThrow(
      /GoScript-owned pointer/,
    )
  })

  it('rejects raw and foreign pointers for NewAt', () => {
    const intType = TypeOf(0)

    expect(() => NewAt(intType, 123 as any)).toThrow(/GoScript-owned pointer/)
    expect(() => NewAt(intType, { value: 1 } as any)).toThrow(
      /GoScript-owned pointer/,
    )
    expect(() =>
      NewAt(intType, { value: new Value(1, intType) } as any),
    ).toThrow(/GoScript-owned pointer/)
  })

  it('builds pointer-backed slices from owned array element handles', () => {
    const values = [10, 20, 30, 40]
    const address = ValueOf(values).Index(1).UnsafeAddr()

    const slice = SliceAt(TypeOf(0), address as any, 2)

    expect(slice.Len()).toBe(2)
    expect(slice.Cap()).toBe(2)
    expect(slice.Pointer()).toBe($.indexAddress(values, 1))

    slice.Index(0).SetInt(21)
    slice.Index(1).SetInt(31)
    expect(values).toEqual([10, 21, 31, 40])
  })

  it('builds pointer-backed byte slices from compiler-style VarRef pointers', () => {
    const bytes = new Uint8Array([1, 2, 3, 4])
    const byteType = ValueOf(bytes).Type().Elem()
    const ref = $.indexRef<number>(bytes, 1)

    const slice = SliceAt(byteType, ref as any, 2)

    expect(slice.Len()).toBe(2)
    expect(slice.Cap()).toBe(2)
    expect(slice.Pointer()).toBe($.indexAddress(bytes, 1))

    slice.Index(0).SetUint(7)
    slice.Index(1).SetUint(8)
    expect(Array.from(bytes)).toEqual([1, 7, 8, 4])
  })

  it('keeps nil zero-length SliceAt slices nil', () => {
    const slice = SliceAt(TypeOf(0), null, 0)

    expect(slice.IsNil()).toBe(true)
    expect(slice.Len()).toBe(0)
    expect(slice.Cap()).toBe(0)
  })

  it('rejects raw, negative, and non-sliceable SliceAt pointers', () => {
    const intType = TypeOf(0)
    const structType = StructOf(
      $.arrayToSlice([new StructField({ Name: 'Count', Type: intType })]),
    )
    const fieldAddress = New(structType).Elem().Field(0).UnsafeAddr()

    expect(() => SliceAt(intType, 123 as any, 1)).toThrow(
      /GoScript-owned pointer/,
    )
    expect(() => SliceAt(intType, fieldAddress as any, 1)).toThrow(
      /GoScript-owned pointer/,
    )
    expect(() =>
      SliceAt(intType, ValueOf([1]).Index(0).UnsafeAddr() as any, -1),
    ).toThrow(/negative length/)
  })
})

import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import { Marshal } from '@goscript/encoding/json/index.js'

import { New, Zero } from './value.js'
import { MapOf, PointerTo, StructOf, TypeFor, TypeOf } from './type.js'
import { StructField, StructTag } from './types.js'
import { VisibleFields } from './visiblefields.js'

class EmbeddedWithMethod {
  public String(): string {
    return 'embedded'
  }
}

describe('StructOf', () => {
  it('creates descriptor-backed dynamic struct values', () => {
    const typ = StructOf(
      $.arrayToSlice([
        new StructField({
          Name: 'Name',
          Type: TypeOf(''),
          Tag: new StructTag('json:"name"'),
        }),
        new StructField({
          Name: 'Count',
          Type: TypeOf(0),
          Tag: new StructTag('json:"count"'),
        }),
      ]),
    )

    expect(typ.Name()).toBe('')
    expect(typ.PkgPath()).toBe('')
    expect(typ.NumField()).toBe(2)
    expect(typ.Field(0).Name).toBe('Name')
    expect(typ.Field(0).Index).toEqual([0])
    expect(typ.Field(1).Offset).toBeGreaterThan(0)
    expect(TypeOf(Zero(typ).Interface()).String()).toBe(typ.String())

    const value = New(typ).Elem()
    value.Field(0).SetString('Ada')
    value.FieldByName('Count').SetInt(3)

    const [data, err] = Marshal(value.Interface())
    expect(err).toBeNull()
    expect($.bytesToString(data)).toBe('{"name":"Ada","count":3}')

    const clone = $.cloneStructValue(value.Interface()) as any
    expect(TypeOf(clone).String()).toBe(typ.String())
    expect(clone.Name).toBe('Ada')
    expect(clone.Count).toBe(3)
    value.FieldByName('Count').SetInt(4)
    expect(clone.Count).toBe(3)
  })

  it('rejects invalid field descriptors before creating a type', () => {
    const intType = TypeOf(0)

    expect(() =>
      StructOf($.arrayToSlice([new StructField({ Name: '', Type: intType })])),
    ).toThrow(/field 0 has no name/)
    expect(() =>
      StructOf(
        $.arrayToSlice([new StructField({ Name: '1Name', Type: intType })]),
      ),
    ).toThrow(/field 0 has invalid name/)
    expect(() =>
      StructOf(
        $.arrayToSlice([
          new StructField({ Name: 'Missing', Type: null as any }),
        ]),
      ),
    ).toThrow(/field 0 has no type/)
    expect(() =>
      StructOf(
        $.arrayToSlice([
          new StructField({ Name: 'Name', Type: intType }),
          new StructField({ Name: 'Name', Type: intType }),
        ]),
      ),
    ).toThrow(/duplicate field Name/)
  })

  it('enforces package-path and unexported field rules', () => {
    const intType = TypeOf(0)

    expect(() =>
      StructOf(
        $.arrayToSlice([new StructField({ Name: 'secret', Type: intType })]),
      ),
    ).toThrow(/field "secret" is unexported but missing PkgPath/)
    expect(() =>
      StructOf($.arrayToSlice([new StructField({ Name: '_', Type: intType })])),
    ).toThrow(/field "_" is unexported but missing PkgPath/)
    expect(() =>
      StructOf(
        $.arrayToSlice([
          new StructField({
            Name: 'Embedded',
            Type: intType,
            PkgPath: 'main',
            Anonymous: true,
          }),
        ]),
      ),
    ).toThrow(/anonymous but has PkgPath set/)
    expect(() =>
      StructOf(
        $.arrayToSlice([
          new StructField({
            Name: 'left',
            Type: intType,
            PkgPath: 'main',
          }),
          new StructField({
            Name: 'right',
            Type: intType,
            PkgPath: 'other',
          }),
        ]),
      ),
    ).toThrow(/fields with different PkgPath main and other/)

    const typ = StructOf(
      $.arrayToSlice([
        new StructField({ Name: '_', Type: intType, PkgPath: 'main' }),
        new StructField({ Name: '_', Type: intType, PkgPath: 'main' }),
        new StructField({ Name: 'secret', Type: intType, PkgPath: 'main' }),
      ]),
    )
    expect(typ.NumField()).toBe(3)
    expect(typ.Field(2).IsExported()).toBe(false)
  })

  it('rejects illegal anonymous fields and embedded method cases', () => {
    const intType = TypeOf(0)
    const embeddedInfo = $.registerStructType(
      'main.EmbeddedWithMethod',
      new EmbeddedWithMethod(),
      [
        {
          name: 'String',
          args: [],
          returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
        },
      ],
      EmbeddedWithMethod,
      [],
    )
    ;(EmbeddedWithMethod as any).__typeInfo = embeddedInfo
    const embeddedType = TypeOf(new EmbeddedWithMethod())
    const embeddedPointer = PointerTo(embeddedType)!

    expect(() =>
      StructOf(
        $.arrayToSlice([
          new StructField({
            Name: 'EmbeddedWithMethod',
            Type: embeddedPointer,
            Anonymous: true,
          }),
        ]),
      ),
    ).toThrow(/embedded type with methods/)
    expect(() =>
      StructOf(
        $.arrayToSlice([
          new StructField({
            Name: 'EmbeddedWithMethod',
            Type: embeddedType,
            Anonymous: true,
          }),
        ]),
      ),
    ).toThrow(/embedded type with methods/)
    expect(() =>
      StructOf(
        $.arrayToSlice([
          new StructField({
            Name: 'IntPtr',
            Type: PointerTo(PointerTo(intType)!)!,
            Anonymous: true,
          }),
        ]),
      ),
    ).toThrow(/illegal embedded field type/)
    expect(() =>
      StructOf(
        $.arrayToSlice([
          new StructField({
            Name: 'EmbeddedWithMethod',
            Type: embeddedPointer,
            Anonymous: true,
          }),
          new StructField({ Name: 'Count', Type: intType }),
        ]),
      ),
    ).toThrow(/embedded type with methods/)
    expect(() =>
      StructOf(
        $.arrayToSlice([
          new StructField({ Name: 'Count', Type: intType }),
          new StructField({
            Name: 'EmbeddedWithMethod',
            Type: embeddedPointer,
            Anonymous: true,
          }),
        ]),
      ),
    ).toThrow(/embedded type with methods/)
    expect(() =>
      StructOf(
        $.arrayToSlice([
          new StructField({
            Name: 'EmbeddedWithMethod',
            Type: embeddedType,
            Anonymous: true,
          }),
          new StructField({ Name: 'Count', Type: intType }),
        ]),
      ),
    ).toThrow(/embedded type with methods/)
  })

  it('computes dynamic layout, identity, and comparability from descriptors', () => {
    const byteType = TypeFor({
      T: { type: { kind: $.TypeKind.Basic, name: 'uint8' } },
    } as any)
    const intType = TypeOf(0)
    const layout = StructOf(
      $.arrayToSlice([
        new StructField({
          Name: 'A',
          Type: byteType,
          Offset: 99,
          Index: [9],
        }),
        new StructField({ Name: 'B', Type: intType }),
      ]),
    )

    expect(layout.Name()).toBe('')
    expect(layout.PkgPath()).toBe('')
    expect(layout.String()).toBe('struct { A uint8; B int }')
    expect(layout.Field(0).Offset).toBe(0)
    expect(layout.Field(0).Index).toEqual([0])
    expect(layout.Field(1).Offset).toBe(8)
    expect(layout.Size()).toBe(16)
    expect(
      StructOf(
        $.arrayToSlice([
          new StructField({ Name: 'A', Type: byteType }),
          new StructField({ Name: 'B', Type: intType }),
        ]),
      ),
    ).toBe(layout)

    const pkgA = StructOf(
      $.arrayToSlice([
        new StructField({ Name: 'x', Type: intType, PkgPath: 'a' }),
      ]),
    )
    const pkgB = StructOf(
      $.arrayToSlice([
        new StructField({ Name: 'x', Type: intType, PkgPath: 'b' }),
      ]),
    )
    expect(pkgA.String()).toBe(pkgB.String())
    expect(pkgA).not.toBe(pkgB)
    expect(pkgA.AssignableTo(pkgB)).toBe(false)
    expect(pkgB.AssignableTo(pkgA)).toBe(false)

    expect(
      StructOf(
        $.arrayToSlice([new StructField({ Name: 'Name', Type: TypeOf('') })]),
      ).Comparable(),
    ).toBe(true)
    expect(
      StructOf(
        $.arrayToSlice([
          new StructField({
            Name: 'Values',
            Type: MapOf(TypeOf(''), intType),
          }),
        ]),
      ).Comparable(),
    ).toBe(false)
  })

  it('walks embedded dynamic fields in visible-field order', () => {
    const intType = TypeOf(0)
    const stringType = TypeOf('')
    const inner = StructOf(
      $.arrayToSlice([
        new StructField({ Name: 'ID', Type: intType }),
        new StructField({ Name: 'Label', Type: stringType }),
      ]),
    )
    const outer = StructOf(
      $.arrayToSlice([
        new StructField({ Name: 'Inner', Type: inner, Anonymous: true }),
        new StructField({ Name: 'Count', Type: intType }),
      ]),
    )

    expect(
      $.asArray(VisibleFields(outer)).map((field) => [field.Name, field.Index]),
    ).toEqual([
      ['Inner', [0]],
      ['ID', [0, 0]],
      ['Label', [0, 1]],
      ['Count', [1]],
    ])

    const value = New(outer).Elem()
    value.FieldByIndex($.arrayToSlice([0, 0])).SetInt(7)
    value.FieldByName('Label').SetString('seven')
    expect(value.FieldByName('ID').Int()).toBe(7)
    expect(value.FieldByIndex($.arrayToSlice([0, 1])).String()).toBe('seven')
  })

  it('hides deeper embedded fields and cancels duplicate same-depth names', () => {
    const intType = TypeOf(0)
    const stringType = TypeOf('')
    const inner = StructOf(
      $.arrayToSlice([
        new StructField({ Name: 'Name', Type: stringType }),
        new StructField({ Name: 'Depth', Type: intType }),
      ]),
    )
    const hidden = StructOf(
      $.arrayToSlice([
        new StructField({ Name: 'Inner', Type: inner, Anonymous: true }),
        new StructField({ Name: 'Name', Type: intType }),
      ]),
    )
    expect(
      $.asArray(VisibleFields(hidden)).map((field) => [
        field.Name,
        field.Index,
      ]),
    ).toEqual([
      ['Inner', [0]],
      ['Depth', [0, 1]],
      ['Name', [1]],
    ])
    expect(hidden.FieldByName('Name')[0].Index).toEqual([1])

    const left = StructOf(
      $.arrayToSlice([new StructField({ Name: 'X', Type: intType })]),
    )
    const right = StructOf(
      $.arrayToSlice([new StructField({ Name: 'X', Type: intType })]),
    )
    const canceled = StructOf(
      $.arrayToSlice([
        new StructField({ Name: 'Left', Type: left, Anonymous: true }),
        new StructField({ Name: 'Right', Type: right, Anonymous: true }),
      ]),
    )
    expect(
      $.asArray(VisibleFields(canceled)).map((field) => field.Name),
    ).toEqual(['Left', 'Right'])
    expect(canceled.FieldByName('X')[1]).toBe(false)
  })
})

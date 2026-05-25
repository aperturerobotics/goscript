import { describe, it, expect } from 'vitest'
import {
  makeMap,
  mapGet,
  mapSet,
  TypeKind,
  registerInterfaceType,
  registerStructType,
} from '../builtin/index.js'
import { StructField } from './types.js'
import { Int, Struct, TypeFor } from './type.js'

describe('TypeFor', () => {
  it('exposes StructField PkgPath and exported semantics', () => {
    const exported = new StructField({ Name: 'Field' })
    const unexported = new StructField({
      Name: 'field',
      PkgPath: 'example.test/pkg',
    })

    expect(exported.PkgPath).toBe('')
    expect(exported.IsExported()).toBe(true)
    expect(unexported.IsExported()).toBe(false)
    expect(unexported.clone().PkgPath).toBe('example.test/pkg')
  })

  it('uses generic runtime type descriptors', () => {
    const intType = TypeFor({
      T: {
        type: { kind: TypeKind.Basic, name: 'int' },
        zero: () => 0,
      },
    })

    expect(intType.String()).toBe('int')
    expect(intType.Kind()).toBe(Int)
    expect(intType.PkgPath()).toBe('')

    const namedIntType = TypeFor({
      T: {
        type: { kind: TypeKind.Basic, name: 'int', typeName: 'gob.typeId' },
        zero: () => 0,
      },
    })
    expect(namedIntType.String()).toBe('gob.typeId')
    expect(namedIntType.Name()).toBe('typeId')
    expect(namedIntType.PkgPath()).toBe('gob')
    expect(namedIntType.Kind()).toBe(Int)
  })

  it('formats literal interface methods from type metadata', () => {
    const ifaceType = TypeFor({
      T: {
        type: {
          kind: TypeKind.Interface,
          methods: [{ name: 'SomeMethod', args: [], returns: [] }],
        },
        zero: () => null,
      },
    })

    expect(ifaceType.String()).toBe('interface { SomeMethod() }')
  })

  it('formats unnamed function signatures from type metadata', () => {
    const fnType = TypeFor({
      T: {
        type: {
          kind: TypeKind.Function,
          params: [{ kind: TypeKind.Basic, name: 'int' }],
          results: [{ kind: TypeKind.Basic, name: 'string' }],
        },
        zero: () => null,
      },
    })

    expect(fnType.String()).toBe('func(int) string')
  })

  it('resolves registered type names from descriptors', () => {
    class RegisteredStruct {}
    class RegisteredWithFields {}
    registerStructType(
      'main.RegisteredStruct',
      new RegisteredStruct(),
      [],
      RegisteredStruct,
      {},
    )
    registerStructType(
      'main.RegisteredWithFields',
      new RegisteredWithFields(),
      [],
      RegisteredWithFields,
      {
        Name: { kind: TypeKind.Basic, name: 'string' },
        Count: {
          name: 'Total',
          type: { kind: TypeKind.Basic, name: 'int' },
          tag: 'json:"total"',
        },
        Items: {
          kind: TypeKind.Slice,
          elemType: 'main.RegisteredStruct',
        },
      },
    )
    registerInterfaceType('main.RegisteredInterface', null, [
      { name: 'SomeMethod', args: [], returns: [] },
    ])

    const structType = TypeFor({
      T: { type: 'main.RegisteredStruct', zero: () => new RegisteredStruct() },
    })
    const ifaceType = TypeFor({
      T: { type: 'main.RegisteredInterface', zero: () => null },
    })

    expect(structType.String()).toBe('main.RegisteredStruct')
    expect(structType.Kind()).toBe(Struct)
    expect(ifaceType.String()).toBe('interface { SomeMethod() }')

    const fieldsType = TypeFor({
      T: {
        type: 'main.RegisteredWithFields',
        zero: () => new RegisteredWithFields(),
      },
    })
    expect(fieldsType.NumField()).toBe(3)
    expect(fieldsType.Field(0).Name).toBe('Name')
    expect(fieldsType.Field(0).Type.String()).toBe('string')
    expect(fieldsType.Field(1).Name).toBe('Total')
    expect(fieldsType.Field(1).Tag.Get('json')).toBe('total')
    expect(fieldsType.Field(2).Type.String()).toBe('[]main.RegisteredStruct')
    expect(fieldsType.Field(2).Type.Elem().String()).toBe('main.RegisteredStruct')
  })

  it('interns runtime type descriptors for reflect.Type map keys', () => {
    const first = TypeFor({
      T: { type: 'gob.wireType', zero: () => ({}) },
    })
    const second = TypeFor({
      T: { type: 'gob.wireType', zero: () => ({}) },
    })
    const arrayType = TypeFor({
      T: {
        type: {
          kind: TypeKind.Array,
          elemType: { kind: TypeKind.Basic, name: 'uint8' },
          length: 16,
        },
        zero: () => new Uint8Array(16),
      },
    })

    expect(second).toBe(first)
    expect(arrayType).toBe(
      TypeFor({
        T: {
          type: {
            kind: TypeKind.Array,
            elemType: { kind: TypeKind.Basic, name: 'uint8' },
            length: 16,
          },
          zero: () => new Uint8Array(16),
        },
      }),
    )

    const m = makeMap<typeof first, string>()
    mapSet(m, first, 'wire')

    expect(mapGet(m, second, '')).toEqual(['wire', true])
  })
})

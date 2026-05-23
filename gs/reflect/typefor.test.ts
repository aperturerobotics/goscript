import { describe, it, expect } from 'vitest'
import {
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
    registerStructType(
      'main.RegisteredStruct',
      new RegisteredStruct(),
      [],
      RegisteredStruct,
      {},
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
  })
})

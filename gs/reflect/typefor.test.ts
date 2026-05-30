import { describe, it, expect } from 'vitest'
import {
  makeMap,
  mapGet,
  mapSet,
  markAsStructValue,
  namedValueInterfaceValue,
  TypeKind,
  registerInterfaceType,
  registerStructType,
  varRef,
} from '../builtin/index.js'
import { StructField } from './types.js'
import { Int, Ptr, Struct, TypeFor, TypeOf, Uint64, ValueOf } from './type.js'
import { Indirect, New, Zero } from './value.js'

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

  it('preserves generic method signatures for named basic types', () => {
    const stringResult = { kind: TypeKind.Basic, name: 'string' } as const
    const namedIntDescriptor = {
      kind: TypeKind.Basic,
      name: 'int',
      typeName: 'main.MyInt',
    } as const
    const methodSignatures = [
      {
        name: 'String',
        args: [],
        returns: [{ type: stringResult }],
      },
    ]
    const preexisting = TypeFor({
      T: {
        type: namedIntDescriptor,
        zero: () => 0,
      },
    })

    const namedIntType = TypeFor({
      T: {
        type: namedIntDescriptor,
        zero: () => 0,
        methods: { String: (receiver: number) => String(receiver) },
        methodSignatures,
      },
    })
    const stringerType = TypeFor({
      T: {
        type: {
          kind: TypeKind.Interface,
          methods: methodSignatures,
        },
        zero: () => null,
      },
    })

    expect(namedIntType).toBe(preexisting)
    expect(namedIntType.NumMethod()).toBe(1)
    const [method, ok] = namedIntType.MethodByName('String')
    expect(ok).toBe(true)
    expect(method.Type.NumIn()).toBe(1)
    expect(method.Type.NumOut()).toBe(1)
    expect(method.Type.Out(0).String()).toBe('string')
    expect(namedIntType.Implements(stringerType)).toBe(true)
  })

  it('preserves generic method signatures for pointers to named basic types', () => {
    const stringResult = { kind: TypeKind.Basic, name: 'string' } as const
    const methodSignatures = [
      {
        name: 'String',
        args: [],
        returns: [{ type: stringResult }],
      },
    ]
    const pointerType = TypeFor({
      T: {
        type: {
          kind: TypeKind.Pointer,
          elemType: {
            kind: TypeKind.Basic,
            name: 'bool',
            typeName: 'main.MyBool',
          },
        },
        zero: () => null,
        methods: { String: () => 'true' },
        methodSignatures,
      },
    })
    const stringerType = TypeFor({
      T: {
        type: {
          kind: TypeKind.Interface,
          methods: methodSignatures,
        },
        zero: () => null,
      },
    })

    expect(pointerType.Kind()).toBe(Ptr)
    expect(pointerType.String()).toBe('*main.MyBool')
    expect(pointerType.NumMethod()).toBe(1)
    const [method, ok] = pointerType.MethodByName('String')
    expect(ok).toBe(true)
    expect(method.Type.NumIn()).toBe(1)
    expect(method.Type.In(0)).toBe(pointerType)
    expect(method.Type.NumOut()).toBe(1)
    expect(method.Type.Out(0).String()).toBe('string')
    expect(pointerType.Implements(stringerType)).toBe(true)
  })

  it('preserves named pointer type metadata on interface boxes', () => {
    const target = varRef(0)
    const boxed = namedValueInterfaceValue(
      target,
      '*chunker.Pol',
      {},
      {
        kind: TypeKind.Pointer,
        elemType: {
          kind: TypeKind.Basic,
          name: 'uint64',
          typeName: 'chunker.Pol',
        },
      },
    )

    const typ = TypeOf(boxed)
    expect(typ.String()).toBe('*chunker.Pol')
    expect(typ.Kind()).toBe(Ptr)
    expect(typ.Elem().Kind()).toBe(Uint64)
    expect(typ.Elem().Name()).toBe('Pol')

    const elem = ValueOf(boxed).Elem()
    expect(elem.Kind()).toBe(Uint64)
    elem.SetUint(15)
    expect(target.value).toBe(15)
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

  it('handles recursive interface method metadata', () => {
    const recursiveMethod = {
      name: 'Visit',
      args: [{ name: 'next', type: 'main.RecursiveInterface' }],
      returns: [{ name: '_r0', type: 'main.RecursiveInterface' }],
    }
    registerInterfaceType('main.RecursiveInterface', null, [recursiveMethod])

    class RecursiveImpl {
      public Visit(next: unknown): unknown {
        return next
      }
    }

    const typeInfo = registerStructType(
      'main.RecursiveImpl',
      new RecursiveImpl(),
      [recursiveMethod],
      RecursiveImpl,
      [],
    )
    ;(RecursiveImpl as any).__typeInfo = typeInfo

    const ifaceType = TypeFor({
      T: { type: 'main.RecursiveInterface', zero: () => null },
    })

    expect(ifaceType.String()).toBe(
      'interface { Visit(main.RecursiveInterface) main.RecursiveInterface }',
    )
    expect(ifaceType.AssignableTo(ifaceType)).toBe(true)
    expect(TypeOf(new RecursiveImpl()).AssignableTo(ifaceType)).toBe(true)
  })

  it('handles recursive struct field metadata', () => {
    class RecursiveNode {
      public Next: RecursiveNode | null = null
    }

    const typeInfo = registerStructType(
      'main.RecursiveNode',
      new RecursiveNode(),
      [],
      RecursiveNode,
      [
        {
          name: 'Next',
          key: 'Next',
          type: {
            kind: TypeKind.Pointer,
            elemType: 'main.RecursiveNode',
          },
        },
      ],
    )
    Object.assign(RecursiveNode, { __typeInfo: typeInfo })

    const nodeType = TypeFor({
      T: { type: 'main.RecursiveNode', zero: () => new RecursiveNode() },
    })

    expect(nodeType.Kind()).toBe(Struct)
    expect(nodeType.Field(0).Name).toBe('Next')
    expect(nodeType.Field(0).Type.String()).toBe('*main.RecursiveNode')
    expect(nodeType.Field(0).Type.Elem().NumField()).toBe(1)
    expect(nodeType.Field(0).Type.Elem().Field(0).Type.String()).toBe(
      '*main.RecursiveNode',
    )
    expect(TypeOf(new RecursiveNode()).Field(0).Type.String()).toBe(
      '*main.RecursiveNode',
    )
    expect(TypeOf(new RecursiveNode()).Field(0).Type.Elem().NumField()).toBe(1)
  })

  it('keeps mutually recursive registered struct identity canonical', () => {
    class RecursiveA {
      public B: RecursiveB | null = null
    }
    class RecursiveB {
      public A: RecursiveA | null = null
    }

    const aInfo = registerStructType(
      'main.RecursiveA',
      new RecursiveA(),
      [],
      RecursiveA,
      [
        {
          name: 'B',
          key: 'B',
          type: { kind: TypeKind.Pointer, elemType: 'main.RecursiveB' },
        },
      ],
    )
    const bInfo = registerStructType(
      'main.RecursiveB',
      new RecursiveB(),
      [],
      RecursiveB,
      [
        {
          name: 'A',
          key: 'A',
          type: { kind: TypeKind.Pointer, elemType: 'main.RecursiveA' },
        },
      ],
    )
    Object.assign(RecursiveA, { __typeInfo: aInfo })
    Object.assign(RecursiveB, { __typeInfo: bInfo })

    const aType = TypeFor({
      T: { type: 'main.RecursiveA', zero: () => new RecursiveA() },
    })
    const bType = TypeFor({
      T: { type: 'main.RecursiveB', zero: () => new RecursiveB() },
    })
    const bFromA = aType.Field(0).Type.Elem()

    expect(bFromA.NumField()).toBe(1)
    expect(bFromA).toBe(bType)
    expect(bType.Field(0).Type.Elem()).toBe(aType)
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
    expect(fnType.NumIn()).toBe(1)
    expect(fnType.In(0).String()).toBe('int')
    expect(fnType.NumOut()).toBe(1)
    expect(fnType.Out(0).String()).toBe('string')
    expect(fnType.IsVariadic()).toBe(false)
  })

  it('preserves named and variadic function descriptors', () => {
    const namedFnType = TypeFor({
      T: {
        type: {
          kind: TypeKind.Function,
          name: 'example.test.Callback',
          params: [{ kind: TypeKind.Basic, name: 'int' }],
          results: [{ kind: TypeKind.Basic, name: 'string' }],
        },
        zero: () => null,
      },
    })

    expect(namedFnType.String()).toBe('example.test.Callback')
    expect(namedFnType.PkgPath()).toBe('example.test')
    expect(namedFnType.Name()).toBe('Callback')
    expect(namedFnType.NumIn()).toBe(1)
    expect(namedFnType.In(0).String()).toBe('int')
    expect(namedFnType.NumOut()).toBe(1)
    expect(namedFnType.Out(0).String()).toBe('string')

    const variadicFnType = TypeFor({
      T: {
        type: {
          kind: TypeKind.Function,
          params: [
            {
              kind: TypeKind.Slice,
              elemType: { kind: TypeKind.Basic, name: 'string' },
            },
          ],
          results: [{ kind: TypeKind.Basic, name: 'int' }],
          isVariadic: true,
        },
        zero: () => null,
      },
    })

    expect(variadicFnType.String()).toBe('func(...string) int')
    expect(variadicFnType.NumIn()).toBe(1)
    expect(variadicFnType.In(0).String()).toBe('[]string')
    expect(variadicFnType.NumOut()).toBe(1)
    expect(variadicFnType.Out(0).String()).toBe('int')
    expect(variadicFnType.IsVariadic()).toBe(true)
  })

  it('resolves registered type names from descriptors', () => {
    class RegisteredStruct {}
    class RegisteredWithFields {}
    registerStructType(
      'main.RegisteredStruct',
      new RegisteredStruct(),
      [],
      RegisteredStruct,
      [],
    )
    registerStructType(
      'main.RegisteredWithFields',
      new RegisteredWithFields(),
      [],
      RegisteredWithFields,
      [
        {
          name: 'Name',
          key: 'Name',
          type: { kind: TypeKind.Basic, name: 'string' },
        },
        {
          key: 'Count',
          name: 'Total',
          type: { kind: TypeKind.Basic, name: 'int' },
          tag: 'json:"total"',
          pkgPath: 'main',
          anonymous: true,
          index: [3],
          offset: 24,
          exported: false,
        },
        {
          name: 'Items',
          key: 'Items',
          type: {
            kind: TypeKind.Slice,
            elemType: 'main.RegisteredStruct',
          },
        },
      ],
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
    expect(fieldsType.Field(1).PkgPath).toBe('main')
    expect(fieldsType.Field(1).IsExported()).toBe(false)
    expect(fieldsType.Field(1).Anonymous).toBe(true)
    expect(fieldsType.Field(1).Index).toEqual([3])
    expect(fieldsType.Field(1).Offset).toBe(24)
    expect(fieldsType.Field(1).Tag.Get('json')).toBe('total')
    expect(fieldsType.Field(2).Type.String()).toBe('[]main.RegisteredStruct')
    expect(fieldsType.Field(2).Type.Elem().String()).toBe(
      'main.RegisteredStruct',
    )
  })

  it('allocates registered struct zero values through the named constructor', () => {
    class RegisteredZero {
      public get Name(): string {
        return this._fields.Name.value
      }
      public set Name(value: string) {
        this._fields.Name.value = value
      }

      public _fields: {
        Name: ReturnType<typeof varRef<string>>
      }

      constructor(init?: Partial<{ Name?: string }>) {
        this._fields = {
          Name: varRef(init?.Name ?? ''),
        }
      }

      public clone(): RegisteredZero {
        return markAsStructValue(new RegisteredZero({ Name: this.Name }))
      }
    }

    const typeInfo = registerStructType(
      'main.RegisteredZero',
      () => new RegisteredZero(),
      [],
      RegisteredZero,
      [
        {
          name: 'Name',
          key: 'Name',
          type: { kind: TypeKind.Basic, name: 'string' },
          index: [0],
          offset: 0,
          exported: true,
        },
      ],
    )
    ;(RegisteredZero as any).__typeInfo = typeInfo

    const typ = TypeOf(new RegisteredZero())
    expect(Zero(typ).Interface()).toBeInstanceOf(RegisteredZero)
    expect(TypeOf(Zero(typ).Interface()).String()).toBe('main.RegisteredZero')

    const ptr = New(typ)
    expect(ptr.Elem().Interface()).toBeInstanceOf(RegisteredZero)
    ptr.Elem().FieldByName('Name').SetString('Ada')
    expect((ptr.Elem().Interface() as RegisteredZero).Name).toBe('Ada')
  })

  it('unwraps New pointers through Indirect', () => {
    const pointer = New(TypeOf(0))
    const value = Indirect(pointer)

    expect(value.Int()).toBe(0)
    value.SetInt(7)
    expect(pointer.Elem().Int()).toBe(7)
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

import { describe, it, expect } from 'vitest'
import {
  arrayToSlice,
  asArray,
  functionValue,
  typeAssertTuple,
  TypeKind,
} from '../builtin/index.js'
import {
  FuncOf,
  Kind_String,
  MakeFunc,
  SliceOf,
  TypeOf,
  ValueOf,
} from './type.js'

describe('Function Type Detection', () => {
  it('should detect regular function types', () => {
    const regularFunc = function (x: number, y: number) {
      return x + y
    }
    const type = TypeOf(regularFunc)
    expect(type.String()).toMatch(/^func/)
    expect(Kind_String(type.Kind())).toBe('func')
  })

  it('should detect GoScript typed functions with __goTypeName', () => {
    const greetFunc = function (name: string) {
      return 'Hello, ' + name
    }
    Object.assign(greetFunc, { __goTypeName: 'Greeter' })
    const greetType = TypeOf(greetFunc)
    expect(greetType.String()).toBe('Greeter')
    expect(greetType.Name()).toBe('Greeter')
    expect(greetType.NumIn()).toBe(0)
    expect(Kind_String(greetType.Kind())).toBe('func')

    const addFunc = function (a: number, b: number) {
      return a + b
    }
    Object.assign(addFunc, { __goTypeName: 'Adder' })
    const addType = TypeOf(addFunc)
    expect(addType.String()).toBe('Adder')
    expect(addType.Name()).toBe('Adder')
    expect(addType.NumIn()).toBe(0)
    expect(Kind_String(addType.Kind())).toBe('func')
  })

  it('should detect functions with full __typeInfo metadata', () => {
    const complexFunc = function (x: number, y: number) {
      return x + y
    }
    Object.assign(complexFunc, {
      __goTypeName: 'example.test.MyFunc',
      __typeInfo: {
        kind: TypeKind.Function,
        params: [
          { kind: TypeKind.Basic, name: 'int' },
          { kind: TypeKind.Basic, name: 'int' },
        ],
        results: [{ kind: TypeKind.Basic, name: 'int' }],
      },
    })

    const type = TypeOf(complexFunc)
    expect(type.String()).toBe('example.test.MyFunc')
    expect(type.PkgPath()).toBe('example.test')
    expect(type.Name()).toBe('MyFunc')
    expect(type.NumIn()).toBe(2)
    expect(type.In(0).String()).toBe('int')
    expect(type.In(1).String()).toBe('int')
    expect(type.NumOut()).toBe(1)
    expect(type.Out(0).String()).toBe('int')
    expect(type.IsVariadic()).toBe(false)
    expect(Kind_String(type.Kind())).toBe('func')
  })

  it('should handle functions with multiple return types', () => {
    const multiReturnFunc = function () {
      return [1, 'test']
    }
    Object.assign(multiReturnFunc, {
      __goTypeName: 'MultiReturn',
      __typeInfo: {
        kind: TypeKind.Function,
        params: [],
        results: [
          { kind: TypeKind.Basic, name: 'int' },
          { kind: TypeKind.Basic, name: 'string' },
        ],
      },
    })

    const type = TypeOf(multiReturnFunc)
    expect(type.String()).toBe('MultiReturn')
    expect(type.NumOut()).toBe(2)
    expect(type.Out(0).String()).toBe('int')
    expect(type.Out(1).String()).toBe('string')
    expect(Kind_String(type.Kind())).toBe('func')
  })

  it('should handle functions with no parameters', () => {
    const noParamFunc = function () {
      return 42
    }
    Object.assign(noParamFunc, {
      __goTypeName: 'NoParam',
      __typeInfo: {
        kind: TypeKind.Function,
        params: [],
        results: [{ kind: TypeKind.Basic, name: 'int' }],
      },
    })

    const type = TypeOf(noParamFunc)
    expect(type.String()).toBe('NoParam')
    expect(type.NumIn()).toBe(0)
    expect(type.NumOut()).toBe(1)
    expect(type.Out(0).String()).toBe('int')
    expect(Kind_String(type.Kind())).toBe('func')
  })

  it('should handle functions with no return type', () => {
    const voidFunc = function (x: number) {
      console.log(x)
    }
    Object.assign(voidFunc, {
      __goTypeName: 'VoidFunc',
      __typeInfo: {
        kind: TypeKind.Function,
        params: [{ kind: TypeKind.Basic, name: 'int' }],
        results: [],
      },
    })

    const type = TypeOf(voidFunc)
    expect(type.String()).toBe('VoidFunc')
    expect(type.NumIn()).toBe(1)
    expect(type.In(0).String()).toBe('int')
    expect(type.NumOut()).toBe(0)
    expect(Kind_String(type.Kind())).toBe('func')
  })

  it('should fallback to generic func for unknown typed functions', () => {
    const unknownFunc = function (x: any) {
      return x
    }
    Object.assign(unknownFunc, { __goTypeName: 'UnknownType' })

    const type = TypeOf(unknownFunc)
    expect(type.String()).toBe('UnknownType')
    expect(type.Name()).toBe('UnknownType')
    expect(type.NumIn()).toBe(0)
    expect(Kind_String(type.Kind())).toBe('func')
  })

  it('should format unnamed function metadata and variadic parameters', () => {
    const variadicFunc = function (...values: string[]) {
      return values.length
    }
    Object.assign(variadicFunc, {
      __typeInfo: {
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
    })

    const type = TypeOf(variadicFunc)
    expect(type.String()).toBe('func(...string) int')
    expect(type.NumIn()).toBe(1)
    expect(type.In(0).String()).toBe('[]string')
    expect(type.NumOut()).toBe(1)
    expect(type.Out(0).String()).toBe('int')
    expect(type.IsVariadic()).toBe(true)
  })

  it('should panic on function introspection for non-function types', () => {
    const type = TypeOf(1)

    expect(() => type.NumIn()).toThrow(/reflect: NumIn of non-func type int/)
    expect(() => type.In(0)).toThrow(/reflect: In of non-func type int/)
    expect(() => type.NumOut()).toThrow(/reflect: NumOut of non-func type int/)
    expect(() => type.Out(0)).toThrow(/reflect: Out of non-func type int/)
    expect(() => type.IsVariadic()).toThrow(
      /reflect: IsVariadic of non-func type int/,
    )
  })

  it('should construct dynamic function types with FuncOf', () => {
    const intType = TypeOf(1)
    const stringType = TypeOf('')

    const fnType = FuncOf([intType], [stringType], false)
    expect(fnType.String()).toBe('func(int) string')
    expect(fnType.NumIn()).toBe(1)
    expect(fnType.In(0)).toBe(intType)
    expect(fnType.NumOut()).toBe(1)
    expect(fnType.Out(0)).toBe(stringType)
    expect(fnType.IsVariadic()).toBe(false)
    expect(FuncOf([intType], [stringType], false)).toBe(fnType)

    const variadicType = FuncOf([SliceOf(stringType)], [intType], true)
    expect(variadicType.String()).toBe('func(...string) int')
    expect(variadicType.NumIn()).toBe(1)
    expect(variadicType.In(0).String()).toBe('[]string')
    expect(variadicType.NumOut()).toBe(1)
    expect(variadicType.Out(0)).toBe(intType)
    expect(variadicType.IsVariadic()).toBe(true)

    expect(() => FuncOf([stringType], [], true)).toThrow(
      /reflect.FuncOf: last arg of variadic func must be slice/,
    )
    expect(() => FuncOf([], [], true)).toThrow(
      /reflect.FuncOf: last arg of variadic func must be slice/,
    )
    expect(() =>
      FuncOf(globalThis.Array(129).fill(intType), [], false),
    ).toThrow(/reflect.FuncOf: too many arguments/)
  })

  it('should validate Value.Call counts and normalize results by descriptor', async () => {
    const scalarFunc = functionValue((value: number) => String(value), {
      kind: TypeKind.Function,
      params: [{ kind: TypeKind.Basic, name: 'int' }],
      results: [{ kind: TypeKind.Basic, name: 'string' }],
    })
    const scalarResult = asArray(
      await ValueOf(scalarFunc).Call(arrayToSlice([ValueOf(7)])),
    )
    expect(scalarResult).toHaveLength(1)
    expect(scalarResult[0].String()).toBe('7')
    await expect(ValueOf(scalarFunc).Call(arrayToSlice([]))).rejects.toThrow(
      /reflect: Call with 0 input arguments for function with 1 inputs/,
    )

    const tupleFunc = functionValue(() => [1, 'ok'], {
      kind: TypeKind.Function,
      params: [],
      results: [
        { kind: TypeKind.Basic, name: 'int' },
        { kind: TypeKind.Basic, name: 'string' },
      ],
    })
    const tupleResult = asArray(await ValueOf(tupleFunc).Call(arrayToSlice([])))
    expect(tupleResult).toHaveLength(2)
    expect(tupleResult[0].Int()).toBe(1)
    expect(tupleResult[1].String()).toBe('ok')

    const sliceFunc = functionValue(() => [1, 2], {
      kind: TypeKind.Function,
      params: [],
      results: [
        {
          kind: TypeKind.Slice,
          elemType: { kind: TypeKind.Basic, name: 'int' },
        },
      ],
    })
    const sliceResult = asArray(await ValueOf(sliceFunc).Call(arrayToSlice([])))
    expect(sliceResult).toHaveLength(1)
    expect(sliceResult[0].Len()).toBe(2)

    const badTupleFunc = functionValue(() => [1], {
      kind: TypeKind.Function,
      params: [],
      results: [
        { kind: TypeKind.Basic, name: 'int' },
        { kind: TypeKind.Basic, name: 'string' },
      ],
    })
    await expect(ValueOf(badTupleFunc).Call(arrayToSlice([]))).rejects.toThrow(
      /reflect: Call returned 1 results for function with 2 outputs/,
    )
  })

  it('should construct typed functions with MakeFunc', async () => {
    const intType = TypeOf(0)
    const stringType = TypeOf('')
    const boolType = TypeOf(false)
    const unaryType = FuncOf(
      arrayToSlice([intType]),
      arrayToSlice([stringType]),
      false,
    )
    const unaryValue = MakeFunc(unaryType, (args) =>
      arrayToSlice([ValueOf(String(asArray(args)[0].Int()))]),
    )
    const [unary, ok] = typeAssertTuple<
      ((value: number) => string | Promise<string>) | null
    >(unaryValue.Interface(), {
      kind: TypeKind.Function,
      params: [{ kind: TypeKind.Basic, name: 'int' }],
      results: [{ kind: TypeKind.Basic, name: 'string' }],
    })
    expect(ok).toBe(true)
    expect(await unary!(7)).toBe('7')
    const reflectedUnary = asArray(
      await unaryValue.Call(arrayToSlice([ValueOf(8)])),
    )
    expect(reflectedUnary).toHaveLength(1)
    expect(reflectedUnary[0].String()).toBe('8')

    const asyncValue = MakeFunc(unaryType, async (args) =>
      arrayToSlice([ValueOf(`async-${asArray(args)[0].Int()}`)]),
    )
    expect(
      await (asyncValue.Interface() as (value: number) => Promise<string>)(9),
    ).toBe('async-9')
    const reflectedAsync = asArray(
      await asyncValue.Call(arrayToSlice([ValueOf(10)])),
    )
    expect(reflectedAsync[0].String()).toBe('async-10')

    const [, wrongOk] = typeAssertTuple<
      ((value: string) => string | Promise<string>) | null
    >(unaryValue.Interface(), {
      kind: TypeKind.Function,
      params: [{ kind: TypeKind.Basic, name: 'string' }],
      results: [{ kind: TypeKind.Basic, name: 'string' }],
    })
    expect(wrongOk).toBe(false)

    const tupleType = FuncOf(
      arrayToSlice([]),
      arrayToSlice([intType, boolType]),
      false,
    )
    const tupleValue = MakeFunc(tupleType, () =>
      arrayToSlice([ValueOf(3), ValueOf(true)]),
    )
    const tuple = await (
      tupleValue.Interface() as () => Promise<[number, boolean]>
    )()
    expect(tuple).toEqual([3, true])
    const reflectedTuple = asArray(await tupleValue.Call(arrayToSlice([])))
    expect(reflectedTuple[0].Int()).toBe(3)
    expect(reflectedTuple[1].Bool()).toBe(true)

    const zeroType = FuncOf(arrayToSlice([]), arrayToSlice([]), false)
    let called = false
    const zeroValue = MakeFunc(zeroType, () => {
      called = true
      return arrayToSlice([])
    })
    expect(
      await (zeroValue.Interface() as () => Promise<void>)(),
    ).toBeUndefined()
    expect(called).toBe(true)

    const variadicType = FuncOf(
      arrayToSlice([intType, SliceOf(stringType)]),
      arrayToSlice([intType]),
      true,
    )
    const variadicValue = MakeFunc(variadicType, (args) => {
      const values = asArray(args)
      expect(values).toHaveLength(2)
      return arrayToSlice([ValueOf(values[0].Int() + values[1].Len())])
    })
    const variadic = variadicValue.Interface() as (
      prefix: number,
      values: unknown,
    ) => Promise<number>
    expect(await variadic(1, arrayToSlice(['a', 'b']))).toBe(3)
    const reflectedVariadic = asArray(
      await variadicValue.Call(
        arrayToSlice([ValueOf(10), ValueOf('a'), ValueOf('b')]),
      ),
    )
    expect(reflectedVariadic[0].Int()).toBe(12)
    const reflectedSliceCall = asArray(
      await variadicValue.CallSlice(
        arrayToSlice([ValueOf(10), ValueOf(arrayToSlice(['a', 'b', 'c']))]),
      ),
    )
    expect(reflectedSliceCall[0].Int()).toBe(13)

    const badResult = MakeFunc(unaryType, () => arrayToSlice([]))
    await expect(
      (badResult.Interface() as (value: number) => Promise<string>)(1),
    ).rejects.toThrow(
      /reflect.MakeFunc: returned 0 results for function with 1 outputs/,
    )
    await expect(
      variadicValue.CallSlice(arrayToSlice([ValueOf(1), ValueOf('bad')])),
    ).rejects.toThrow(/reflect: CallSlice using string as type \[\]string/)
  })

  it('should handle arrow functions', () => {
    const arrowFunc = (x: number) => x * 2
    const type = TypeOf(arrowFunc)
    expect(type.String()).toMatch(/^func/)
    expect(Kind_String(type.Kind())).toBe('func')
  })

  it('should detect functions that return values vs void functions', () => {
    // Function with return
    const returningFunc = function (x: number) {
      return x * 2
    }
    const returnType = TypeOf(returningFunc)
    expect(returnType.String()).toMatch(/func.*any$/)

    // Function without return (void)
    const voidFunc = function (x: number) {
      console.log(x)
    }
    const voidType = TypeOf(voidFunc)
    // Should not have return type suffix
    expect(voidType.String()).not.toMatch(/func.*any$/)
  })
})

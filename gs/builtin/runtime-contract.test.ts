import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  byte,
  callGenericMethod,
  chanRecvWithOk,
  functionValue,
  genericZero,
  int,
  interfaceValue,
  makeChannel,
  makeMap,
  mapGet,
  mapSet,
  markAsStructValue,
  namedFunction,
  newError,
  pointerValue,
  print,
  println,
  registerInterfaceType,
  registerStructType,
  resetHostRuntimeForTests,
  TypeKind,
  typeAssert,
  typedNil,
  unref,
  varRef,
} from './index.js'

const originalDeno = (globalThis as any).Deno
const originalProcess = (globalThis as any).process

afterEach(() => {
  vi.restoreAllMocks()

  if (originalDeno === undefined) {
    delete (globalThis as any).Deno
  } else {
    ;(globalThis as any).Deno = originalDeno
  }

  if (originalProcess === undefined) {
    delete (globalThis as any).process
  } else {
    ;(globalThis as any).process = originalProcess
  }

  resetHostRuntimeForTests()
})

describe('builtin runtime contract helpers', () => {
  it('writes print and println through the host runtime owner', () => {
    const writes: Array<{ fd: number; text: string }> = []
    const writeSync = vi.fn(
      (
        fd: number,
        buffer: Uint8Array,
        _offset?: number,
        length?: number,
        _position?: number | null,
      ) => {
        writes.push({
          fd,
          text: new TextDecoder().decode(
            buffer.subarray(0, length ?? buffer.length),
          ),
        })
        return length ?? buffer.length
      },
    )

    delete (globalThis as any).Deno
    ;(globalThis as any).process = {
      getBuiltinModule: vi.fn(() => ({
        readSync: vi.fn(),
        writeSync,
      })),
    }
    resetHostRuntimeForTests()

    print('value:', 3)
    println('done')

    expect(writes).toEqual([
      { fd: 1, text: 'value: 3' },
      { fd: 1, text: 'done\n' },
    ])
  })

  it('exposes numeric, varref, map, and error helpers', () => {
    expect(int(1.9)).toBe(1)
    expect(byte(257)).toBe(1)

    const value = varRef(4)
    value.value = 8
    expect(unref(value)).toBe(8)
    expect(pointerValue(value)).toBe(8)
    expect(pointerValue({ ok: true })).toEqual({ ok: true })
    expect(() => pointerValue(null)).toThrow('nil pointer dereference')

    const m = makeMap<string, number>()
    mapSet(m, 'answer', 42)
    expect(mapGet(m, 'answer', 0)).toEqual([42, true])
    expect(mapGet(m, 'missing', 0)).toEqual([0, false])

    expect(newError('bad')?.Error()).toBe('bad')
  })

  it('exposes value and type descriptor helpers', () => {
    class Runner {
      public Run(): string {
        return 'ok'
      }
    }

    const runnerType = registerStructType(
      'phase5.Runner',
      markAsStructValue(new Runner()),
      [{ name: 'Run', args: [], returns: [{ type: 'string' }] }],
      Runner,
    )
    const runnerInterface = registerInterfaceType(
      'phase5.RunnerInterface',
      null,
      [{ name: 'Run', args: [], returns: [{ type: 'string' }] }],
    )

    const value = new Runner()
    expect(markAsStructValue(value)).toBe(value)
    expect(typeAssert<Runner>(value, runnerType)).toEqual({
      ok: true,
      value,
    })
    expect(typeAssert<Runner>(new Runner(), runnerInterface).ok).toBe(true)
    expect(typeAssert<Runner>(null, runnerInterface).ok).toBe(false)

    const nil = typedNil('*main.Example')
    expect(nil.__isTypedNil).toBe(true)
    expect(nil.__goType).toBe('*main.Example')
    expect(
      typeAssert<Runner | null>(typedNil('*phase5.Runner'), {
        kind: TypeKind.Pointer,
        elemType: 'phase5.Runner',
      }),
    ).toEqual({ value: null, ok: true })
    expect(TypeKind.Pointer).toBe('pointer')

    class TypedDog {
      public Name(this: TypedDog | null): string {
        if (this === null) {
          return 'unknown dog'
        }
        return 'dog'
      }
    }

    registerStructType(
      'phase5.TypedDog',
      new TypedDog(),
      [{ name: 'Name', args: [], returns: [{ type: 'string' }] }],
      TypedDog,
    )
    const dogInterface = registerInterfaceType(
      'phase5.DogInterface',
      null,
      [{ name: 'Name', args: [], returns: [{ type: 'string' }] }],
    )
    const nilDog = interfaceValue<{ Name(): string } | null>(
      null,
      '*phase5.TypedDog',
    )
    expect(nilDog).not.toBeNull()
    expect(nilDog!.Name()).toBe('unknown dog')
    expect(typeAssert<{ Name(): string }>(nilDog, dogInterface).ok).toBe(true)
    expect(
      typeAssert<TypedDog | null>(nilDog, {
        kind: TypeKind.Pointer,
        elemType: 'phase5.TypedDog',
      }),
    ).toEqual({ value: null, ok: true })

    const greet = namedFunction((name: string) => `hello ${name}`, 'phase5.Greet')
    expect(typeAssert<typeof greet>(greet, {
      kind: TypeKind.Function,
      name: 'phase5.Greet',
    }).ok).toBe(true)
    expect(
      typeAssert<{ Name: string }>(
        { Name: 'Alice' },
        {
          kind: TypeKind.Struct,
          methods: [],
          fields: {
            Name: {
              type: { kind: TypeKind.Basic, name: 'string' },
              tag: 'json:"name"',
            },
          },
        },
      ).ok,
    ).toBe(true)
    const literal = functionValue((value: number) => String(value), {
      kind: TypeKind.Function,
      params: [{ kind: TypeKind.Basic, name: 'int' }],
      results: [{ kind: TypeKind.Basic, name: 'string' }],
    })
    expect(literal(7)).toBe('7')
    expect(literal).toHaveProperty('__typeInfo')

    const genericArgs = {
      T: {
        zero: () => 0,
        methods: {
          String: (value: number) => String(value),
        },
      },
    }
    expect(genericZero(genericArgs, 'T', null)).toBe(0)
    expect(callGenericMethod(genericArgs, 'T', 'String', 12)).toBe('12')
  })

  it('exposes channel helpers used by future lowering', async () => {
    const channel = makeChannel<number>(1, 0, 'both')
    await channel.send(7)
    expect(await chanRecvWithOk(channel)).toEqual({ value: 7, ok: true })
    channel.close()
    expect(await chanRecvWithOk(channel)).toEqual({ value: 0, ok: false })
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  append,
  bytesToUint8Array,
  type Bytes,
  byte,
  cap,
  cloneArrayValue,
  cloneStructValue,
  callGenericMethod,
  chanRecvWithOk,
  functionValue,
  genericZero,
  goSlice,
  int,
  arrayPointerFromIndexRef,
  indexAddress,
  indexRef,
  interfaceValue,
  len,
  makeSlice,
  makeChannel,
  makeMap,
  mapGet,
  mapSet,
  markAsStructValue,
  namedFunction,
  namedValueInterfaceValue,
  newError,
  pointerValue,
  print,
  println,
  rangeString,
  registerInterfaceType,
  registerStructType,
  resetHostRuntimeForTests,
  selectStatement,
  sliceToArray,
  sliceHeaderRef,
  stringHeaderRef,
  TypeKind,
  typeAssert,
  typeAssertTuple,
  typedNil,
  uint,
  uint64Add,
  uint64And,
  uint64Div,
  uint64Mod,
  uint64Mul,
  uint64Or,
  uint64Shl,
  uint64Shr,
  uint64Sub,
  uint64Xor,
  uintShr,
  unref,
  unsupportedPointerRef,
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
    expect(int(3n)).toBe(3)
    expect(uint(257, 8)).toBe(1)
    expect(uint(-1.9, 8)).toBe(255)
    expect(uint(0x1_0000_0005, 32)).toBe(5)
    expect(uint(42, 64)).toBe(42)
    expect(uint(-1n, 8)).toBe(255)
    expect(byte(257)).toBe(1)
    expect(uint(uint64Shl(1n, 63), 32)).toBe(0)
    expect(uint(uint64Shr(uint64Shl(1n, 63), 60), 32)).toBe(8)
    expect(uint(uint64Mul(0xffffffffffffffffn, 3), 32)).toBe(0xfffffffd)
    expect(uint64Div(0xffffffffffffffffn, 4114)).toBe(4483895010624587)
    expect(uint64Mod(0xffffffffffffffffn, 4114)).toBe(697)
    expect(uint(uint64Add(0xffffffffffffffffn, 2), 32)).toBe(1)
    expect(uint(uint64Sub(1n, 2), 32)).toBe(0xffffffff)
    expect(uint(uint64And(0xf0n, 0x3cn), 32)).toBe(0x30)
    expect(uint(uint64Or(0xf0n, 0x0fn), 32)).toBe(0xff)
    expect(uint(uint64Xor(0xf0n, 0xffn), 32)).toBe(0x0f)
    expect(uintShr(0x80000000, 31, 32)).toBe(1)
    expect(uintShr(0x80000000, 32, 32)).toBe(0)
    expect(uintShr(0xff, 4, 8)).toBe(15)

    const value = varRef(4)
    value.value = 8
    expect(unref(value)).toBe(8)
    expect(pointerValue(value)).toBe(8)
    const pointerAssert = typeAssert<typeof value>(value, {
      kind: TypeKind.Pointer,
      elemType: { kind: TypeKind.Basic, name: 'int' },
    })
    expect(pointerAssert).toEqual({ value, ok: true })
    const nilNamedSlice = varRef(null)
    const nilNamedSliceIface = interfaceValue(
      nilNamedSlice,
      '*main.ObjectIdentifier',
    )
    expect(
      typeAssert<typeof nilNamedSlice>(nilNamedSliceIface, {
        kind: TypeKind.Pointer,
        elemType: 'main.ObjectIdentifier',
      }),
    ).toEqual({ value: nilNamedSlice, ok: true })
    expect(pointerValue({ ok: true })).toEqual({ ok: true })
    const namedPointerBox = namedValueInterfaceValue(
      varRef(new Uint8Array([1, 2])),
      '*main.Bytes',
      {},
    )
    expect(pointerValue(namedPointerBox)).toEqual(new Uint8Array([1, 2]))
    const namedPointerMethodBox = namedValueInterfaceValue(
      varRef(new Uint8Array([1, 2, 3])),
      '*main.Bytes',
      { Len: (receiver: any) => len(receiver.value) },
    )
    expect(pointerValue(namedPointerMethodBox)).toBe(namedPointerMethodBox)
    expect(pointerValue(namedPointerMethodBox).Len()).toBe(3)
    expect(len(pointerValue(namedPointerMethodBox))).toBe(3)
    expect(bytesToUint8Array(pointerValue(namedPointerMethodBox))).toEqual(
      new Uint8Array([1, 2, 3]),
    )
    expect(bytesToUint8Array(goSlice(pointerValue(namedPointerMethodBox), 1))).toEqual(
      new Uint8Array([2, 3]),
    )
    const namedStringBox = namedValueInterfaceValue('id', 'main.Name', {
      String: (receiver: string) => `name:${receiver}`,
    })
    expect(pointerValue(namedStringBox)).toBe(namedStringBox)
    expect(pointerValue(namedStringBox).String()).toBe('name:id')
    expect(cloneStructValue({ clone: () => ({ ok: true }) })).toEqual({
      ok: true,
    })
    expect(
      cloneStructValue({ __goscriptClone: () => ({ internal: true }) }),
    ).toEqual({ internal: true })
    const fixedBytes = new Uint8Array([1, 2, 3])
    const clonedBytes = cloneArrayValue(fixedBytes)
    expect(clonedBytes).toEqual(fixedBytes)
    expect(clonedBytes).not.toBe(fixedBytes)
    const fixedWords = [
      [1, 2],
      [3, 4],
    ]
    const clonedWords = cloneArrayValue(fixedWords)
    expect(clonedWords).toEqual(fixedWords)
    expect(clonedWords).not.toBe(fixedWords)
    expect(clonedWords[0]).not.toBe(fixedWords[0])
    expect(() => pointerValue(null)).toThrow('nil pointer dereference')
    const unsupported = unsupportedPointerRef<number>(0)
    expect(() => unsupported.value).toThrow('unsafe pointer dereference')
    expect(() => {
      unsupported.value = 1
    }).toThrow('unsafe pointer dereference')

    const m = makeMap<string, number>()
    mapSet(m, 'answer', 42)
    expect(mapGet(m, 'answer', 0)).toEqual([42, true])
    expect(mapGet(m, 'missing', 0)).toEqual([0, false])

    expect(newError('bad')?.Error()).toBe('bad')
    expect(rangeString('a¢€')).toEqual([
      [0, 97],
      [1, 162],
      [3, 8364],
    ])
  })

  it('matches struct map keys by Go comparable value', () => {
    class Key {
      public _fields: {
        name: ReturnType<typeof varRef<string>>
        id: ReturnType<typeof varRef<number>>
      }

      constructor(name: string, id: number) {
        this._fields = {
          name: varRef(name),
          id: varRef(id),
        }
      }
    }

    const m = makeMap<Key, string>()
    mapSet(m, markAsStructValue(new Key('so-1', 7)), 'pending')
    mapSet(m, markAsStructValue(new Key('so-1', 7)), 'accepted')

    expect(m.size).toBe(1)
    expect(mapGet(m, markAsStructValue(new Key('so-1', 7)), '')).toEqual([
      'accepted',
      true,
    ])
    expect(mapGet(m, markAsStructValue(new Key('so-2', 7)), '')).toEqual([
      '',
      false,
    ])
  })

  it('does not compare runtime internals as generated struct values', () => {
    class RuntimeType {
      constructor(
        private readonly name: string,
        public readonly _fields: unknown[],
      ) {}

      String(): string {
        return this.name
      }
    }

    const m = makeMap<RuntimeType, string>()
    mapSet(m, new RuntimeType('gob.wireType', []), 'wire')

    expect(mapGet(m, new RuntimeType('gob.arrayType', []), '')).toEqual([
      '',
      false,
    ])
  })

  it('tries duplicate runtime type registrations for colliding package names', () => {
    class HashInterfaceImpl {
      Write(_p: Bytes): [number, null] {
        return [0, null]
      }
    }
    class HashMessage {}

    registerInterfaceType('collision.Hash', null, [
      {
        name: 'Write',
        args: [
          {
            name: 'p',
            type: {
              kind: TypeKind.Slice,
              elemType: { kind: TypeKind.Basic, name: 'uint8' },
            },
          },
        ],
        returns: [],
      },
    ])
    registerStructType(
      'collision.Hash',
      new HashMessage(),
      [],
      HashMessage,
      {},
    )

    expect(typeAssertTuple(new HashInterfaceImpl(), 'collision.Hash')[1]).toBe(
      true,
    )
    expect(
      typeAssertTuple(markAsStructValue(new HashMessage()), 'collision.Hash')[1],
    ).toBe(true)
  })

  it('asserts interface-boxed named primitive values by declared type', () => {
    const boxed = namedValueInterfaceValue(13, 'main.MyInt', {
      Double: (receiver: number) => receiver * 2,
    })

    expect(
      typeAssertTuple<number>(boxed, {
        kind: TypeKind.Basic,
        name: 'int',
        typeName: 'main.MyInt',
      }),
    ).toEqual([13, true])
  })

  it('exposes addressable slice and array index references', () => {
    const values = [1, 2, 3]
    const second = indexRef(values, 1)
    second.value = 8
    expect(values).toEqual([1, 8, 3])
    expect(pointerValue(second)).toBe(8)

    const view = goSlice(values, 1, 3)
    const firstInView = indexRef(view, 0)
    firstInView.value = 11
    expect(values).toEqual([1, 11, 3])
    expect(Object.getOwnPropertyDescriptor(view, '0')?.value).toBe(11)

    const bytes = new Uint8Array([4, 5])
    const firstByte = indexRef<number>(bytes, 0)
    firstByte.value = 9
    expect(Array.from(bytes)).toEqual([9, 5])

    const byteBacking = makeSlice<number>(8, undefined, 'byte')
    const shortBytes = goSlice(byteBacking as Uint8Array, 0, 2)
    expect(len(shortBytes)).toBe(2)
    expect(cap(shortBytes)).toBe(8)
    const fullBytes = goSlice(shortBytes, 0, 8)
    fullBytes![7] = 12
    expect((byteBacking as Uint8Array)[7]).toBe(12)

    const arrayPointer = arrayPointerFromIndexRef(indexRef(byteBacking, 1), 3)
    const arrayView = pointerValue(arrayPointer) as Uint8Array
    expect(len(arrayView)).toBe(3)
    arrayView[2] = 19
    expect((byteBacking as Uint8Array)[3]).toBe(19)

    shortBytes![0] = 14
    expect(bytesToUint8Array(shortBytes)).toEqual(new Uint8Array([14, 0]))

    class Entry {
      value = ''
    }
    const entries = makeSlice<Entry>(1, 3, undefined, () => new Entry())
    const expanded = goSlice(entries, 0, 3)
    const extra = indexRef(expanded, 2)
    extra.value.value = 'zero-backed'
    expect(pointerValue(extra).value).toBe('zero-backed')

    const base = makeSlice<number>(1, 4, 'number')
    base![0] = 7
    const beforeAppend = goSlice(base, 0, 1)
    const afterAppend = append(beforeAppend, 8, 9)
    expect(len(beforeAppend)).toBe(1)
    expect(len(afterAppend)).toBe(3)
    expect([...afterAppend!]).toEqual([7, 8, 9])
    expect(beforeAppend![0]).toBe(7)

    const splitLeft = goSlice(afterAppend, 0, 1, 1)
    expect(len(splitLeft)).toBe(1)
    expect(cap(splitLeft)).toBe(1)
    expect([...splitLeft!]).toEqual([7])

    const text = varRef('abc')
    const headerBytes = varRef(makeSlice<number>(0, 0, 'byte'))
    const strh = pointerValue(stringHeaderRef(text))
    const sh = pointerValue(sliceHeaderRef(headerBytes))
    sh.Data = strh.Data
    sh.Len = strh.Len
    sh.Cap = strh.Len
    expect(bytesToUint8Array(headerBytes.value)).toEqual(new Uint8Array([97, 98, 99]))
  })

  it('exposes stable synthetic slice index addresses', () => {
    const values = [1, 2, 3, 4]
    const left = goSlice(values, 1, 3)
    const right = goSlice(values, 2, 4)
    const other = [8, 9]

    expect(indexAddress(left, 0)).toBe(indexAddress(values, 1))
    expect(indexAddress(left, 1)).toBe(indexAddress(right, 0))
    expect(indexAddress(left, 1)).toBeGreaterThan(indexAddress(left, 0))
    expect(indexAddress(other, 0)).not.toBe(indexAddress(left, 0))
  })

  it('copies slices into fixed arrays with Go length checks', () => {
    const source = goSlice([1, 2, 3], 1, 3)
    const array = sliceToArray<number>(source, 2)
    array[0] = 9

    expect(array).toEqual([9, 3])
    expect(source![0]).toBe(2)
    expect(() => sliceToArray<number>(source, 3)).toThrow(
      'cannot convert slice with length 2 to array with length 3',
    )

    expect(sliceToArray<number>(new Uint8Array([4, 5, 6]), 2, 'byte')).toEqual(
      new Uint8Array([4, 5]),
    )
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

    const emptyInterface = registerInterfaceType('phase5.EmptyInterface', null, [])
    const fn = functionValue(() => 'ok', {
      kind: TypeKind.Function,
      params: [],
      results: [{ kind: TypeKind.Basic, name: 'string' }],
    })
    expect(typeAssert<typeof fn>(fn, emptyInterface)).toEqual({
      ok: true,
      value: fn,
    })
    expect(typeAssert<number>(3, emptyInterface)).toEqual({
      ok: true,
      value: 3,
    })

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
    const dogInterface = registerInterfaceType('phase5.DogInterface', null, [
      { name: 'Name', args: [], returns: [{ type: 'string' }] },
    ])
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

    const dogRef = interfaceValue<{ Name(): string } | null>(
      { value: markAsStructValue(new TypedDog()), __isVarRef: true },
      '*phase5.TypedDog',
    )
    expect(typeAssert<{ Name(): string }>(dogRef, dogInterface).ok).toBe(true)

    const greet = namedFunction(
      (name: string) => `hello ${name}`,
      'phase5.Greet',
    )
    expect(
      typeAssert<typeof greet>(greet, {
        kind: TypeKind.Function,
        name: 'phase5.Greet',
      }).ok,
    ).toBe(true)
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
    expect(cap(channel)).toBe(1)
    await channel.send(7)
    expect(len(channel)).toBe(1)
    expect(cap(channel)).toBe(1)
    expect(await chanRecvWithOk(channel)).toEqual({ value: 7, ok: true })
    expect(len(channel)).toBe(0)
    channel.close()
    expect(await chanRecvWithOk(channel)).toEqual({ value: 0, ok: false })
  })

  it('does not resume an unbuffered sender before the waiting receiver accepts the value', async () => {
    const channel = makeChannel<number>(0, 0, 'both')
    let received = 0

    const receiver = (async () => {
      received = await channel.receive()
    })()

    await channel.send(7)
    expect(received).toBe(7)
    await receiver
  })

  it('resumes closed-channel receivers after queued goroutine work', async () => {
    const channel = makeChannel<number>(0, 0, 'both')
    const events: string[] = []

    const receive = channel.receive().then(() => {
      events.push('receiver')
    })
    channel.close()
    queueMicrotask(() => events.push('queued'))

    await receive
    expect(events).toEqual(['queued', 'receiver'])
  })

  it('cancels losing select receive cases', async () => {
    const signal = makeChannel<string>(1, '', 'both')
    const timeout = makeChannel<string>(0, '', 'both')
    queueMicrotask(() => timeout.close())

    await selectStatement(
      [
        {
          id: 0,
          isSend: false,
          channel: signal,
          onSelected: async () => 'signal',
        },
        {
          id: 1,
          isSend: false,
          channel: timeout,
          onSelected: async () => 'timeout',
        },
      ],
      false,
    )

    await signal.send('value')
    const received = await Promise.race([
      signal.receive(),
      new Promise<string>((resolve) => setTimeout(() => resolve('timeout'), 20)),
    ])
    expect(received).toBe('value')
  })
})

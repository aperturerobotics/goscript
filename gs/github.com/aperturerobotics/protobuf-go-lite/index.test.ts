import { describe, expect, it } from 'vitest'

import * as $ from '../../../builtin/index.js'
import {
  AppendVarint,
  CloneBytes,
  CloneBytesMap,
  CloneBytesSlice,
  CloneMap,
  type CloneMessage,
  ClonePtr,
  CloneSlice,
  type CloneVT,
  CloneVTMap,
  CloneVTSlice,
  CloneVTValue,
  CompareEqualVT,
  ConsumeVarint,
  DecodeFixed32,
  DecodeFixed64,
  DecodeVarint,
  DecodeVarintInt32,
  DecodeVarintInt64,
  DecodeVarintUint32,
  EncodeVarint,
  ErrIntOverflow,
  ErrInvalidLength,
  ErrUnexpectedEndOfGroup,
  EqualBytes,
  EqualBytesMap,
  EqualBytesPresent,
  EqualBytesSlice,
  EqualMap,
  EqualPtr,
  EqualSlice,
  EqualVTImplicit,
  EqualVTMapImplicit,
  EqualVTSliceImplicit,
  type EqualVT,
  IsEqualVTSlice,
  MarshalBoundMessageVT,
  MarshalBoundMessageToSizedBufferVT,
  SizeBoolNonZero,
  SizeBoolPacked,
  SizeBoolPtr,
  SizeBoolSlice,
  SizeBoolValue,
  SizeBytesNonEmpty,
  SizeBytesPresent,
  SizeBytesSlice,
  SizeBytesValue,
  SizeFixed32NonZero,
  SizeFixed32Packed,
  SizeFixed32Ptr,
  SizeFixed32Slice,
  SizeFixed32Value,
  SizeFixed64NonZero,
  SizeFixed64Packed,
  SizeFixed64Ptr,
  SizeFixed64Slice,
  SizeFixed64Value,
  SizeGroup,
  SizeMessage,
  SizeOfVarint,
  SizeOfZigzag,
  SizeStringNonEmpty,
  SizeStringPtr,
  SizeStringSlice,
  SizeStringValue,
  SizeVarintNonZero,
  SizeVarintPacked,
  SizeVarintPtr,
  SizeVarintSlice,
  SizeVarintValue,
  SizeZigzagNonZero,
  SizeZigzagPacked,
  SizeZigzagPtr,
  SizeZigzagSlice,
  SizeZigzagValue,
  Skip,
  UnmarshalBoundMessageVT,
} from './index.js'

class TestValue {
  constructor(private readonly value: string) {}

  EqualVT(other: TestValue): boolean {
    return this.value == other.value
  }
}

class TestCloneValue
  implements CloneVT<TestCloneValue>, EqualVT<TestCloneValue>
{
  constructor(private readonly cloneValue: string) {}

  SizeVT(): number {
    return 0
  }

  MarshalToSizedBufferVT(): [number, $.GoError] {
    return [0, null]
  }

  MarshalVT(): [$.Slice<number>, $.GoError] {
    return [null, null]
  }

  UnmarshalVT(): $.GoError {
    return null
  }

  Reset(): void {}

  CloneMessageVT(): CloneMessage | null {
    return this.CloneVT()
  }

  CloneVT(): TestCloneValue {
    return new TestCloneValue(this.cloneValue)
  }

  EqualVT(other: TestCloneValue): boolean {
    return this.cloneValue === other.cloneValue
  }
}

class TestCloneMessage implements CloneMessage {
  SizeVT(): number {
    return 0
  }

  MarshalToSizedBufferVT(): [$.Slice<number>, $.GoError] {
    return [null, null]
  }

  MarshalVT(): [$.Slice<number>, $.GoError] {
    return [null, null]
  }

  UnmarshalVT(): $.GoError {
    return null
  }

  Reset(): void {}

  CloneMessageVT(): CloneMessage | null {
    return new TestCloneMessage()
  }
}

class BrokenBoundMessage {}

;(BrokenBoundMessage as any).__protobufTypeScriptMessage = {
  typeName: 'test.BrokenBoundMessage',
  fields: { list: () => [] },
  fromBinary: () => ({}),
  toBinary: () => {
    throw new Error('invalid uint 32: undefined')
  },
}

class BytesBoundMessage {
  Config: $.Slice<number>

  constructor(config: $.Slice<number>) {
    this.Config = config
  }
}

;(BytesBoundMessage as any).__protobufTypeScriptMessage = {
  typeName: 'test.BytesBoundMessage',
  fields: {
    list: () => [{ localName: 'config', kind: 'scalar', T: 12 }],
  },
  fromBinary: () => ({}),
  toBinary: (value: { config?: Uint8Array }) => {
    expect(value.config).toBeInstanceOf(Uint8Array)
    expect(Array.from(value.config ?? [])).toEqual([1, 2, 3])
    return new Uint8Array([9])
  },
}

class TimestampBoundMessage {
  public get Seconds(): number {
    return this._fields.Seconds.value
  }
  public set Seconds(value: number) {
    this._fields.Seconds.value = value
  }

  public get Nanos(): number {
    return this._fields.Nanos.value
  }
  public set Nanos(value: number) {
    this._fields.Nanos.value = value
  }

  public _fields: {
    Seconds: $.VarRef<number>
    Nanos: $.VarRef<number>
  }

  constructor(init?: Partial<{ Seconds?: number; Nanos?: number }>) {
    this._fields = {
      Seconds: $.varRef(init?.Seconds ?? 0),
      Nanos: $.varRef(init?.Nanos ?? 0),
    }
  }
}

const timestampMessageType = {
  typeName: 'google.protobuf.Timestamp',
  fields: {
    list: () => [
      { localName: 'seconds', kind: 'scalar' },
      { localName: 'nanos', kind: 'scalar' },
    ],
  },
}

class TimestampParentBoundMessage {
  public get Timestamp(): TimestampBoundMessage | null {
    return this._fields.Timestamp.value
  }
  public set Timestamp(value: TimestampBoundMessage | null) {
    this._fields.Timestamp.value = value
  }

  public _fields: {
    Timestamp: $.VarRef<TimestampBoundMessage | null>
  }

  constructor(init?: Partial<{ Timestamp?: TimestampBoundMessage | null }>) {
    this._fields = {
      Timestamp: $.varRef(init?.Timestamp ?? null),
    }
  }
}

;(TimestampParentBoundMessage as any).__protobufTypeScriptMessage = {
  typeName: 'test.TimestampParentBoundMessage',
  fields: {
    list: () => [
      {
        localName: 'timestamp',
        kind: 'message',
        T: timestampMessageType,
      },
    ],
  },
  fromBinary: () => ({
    timestamp: new Date(Date.UTC(2026, 4, 31, 12, 34, 56, 789)),
  }),
  toBinary: () => new Uint8Array(),
}
;(TimestampParentBoundMessage as any).__protobufTypeScriptFields = {
  timestamp: TimestampBoundMessage,
}

const oneofLeafMessageType = {
  typeName: 'test.OneofLeafBoundMessage',
  fields: {
    list: () => [{ localName: 'label', kind: 'scalar' }],
  },
}

class OneofLeafBoundMessage {
  public get Label(): string {
    return this._fields.Label.value
  }
  public set Label(value: string) {
    this._fields.Label.value = value
  }

  public _fields: {
    Label: $.VarRef<string>
  }

  constructor(init?: Partial<{ Label?: string }>) {
    this._fields = {
      Label: $.varRef(init?.Label ?? ''),
    }
  }
}

;(OneofLeafBoundMessage as any).__protobufTypeScriptMessage =
  oneofLeafMessageType
;(OneofLeafBoundMessage as any).__protobufTypeScriptFields = {}

class OneofBoundMessage_TabSet {
  public get TabSet(): OneofLeafBoundMessage | null {
    return this._fields.TabSet.value
  }
  public set TabSet(value: OneofLeafBoundMessage | null) {
    this._fields.TabSet.value = value
  }

  public _fields: {
    TabSet: $.VarRef<OneofLeafBoundMessage | null>
  }

  constructor(init?: Partial<{ TabSet?: OneofLeafBoundMessage | null }>) {
    this._fields = {
      TabSet: $.varRef(init?.TabSet ?? null),
    }
  }
}

class OneofBoundMessage {
  public get Node(): OneofBoundMessage_TabSet | null {
    return this._fields.Node.value
  }
  public set Node(value: OneofBoundMessage_TabSet | null) {
    this._fields.Node.value = value
  }

  public _fields: {
    Node: $.VarRef<OneofBoundMessage_TabSet | null>
  }

  constructor(init?: Partial<{ Node?: OneofBoundMessage_TabSet | null }>) {
    this._fields = {
      Node: $.varRef(init?.Node ?? null),
    }
  }
}

;(OneofBoundMessage as any).__protobufTypeScriptMessage = {
  typeName: 'test.OneofBoundMessage',
  fields: {
    list: () => [
      {
        localName: 'tabSet',
        kind: 'message',
        T: oneofLeafMessageType,
        oneof: { localName: 'node' },
      },
    ],
  },
  fromBinary: () => ({
    node: { case: 'tabSet', value: { label: 'files' } },
  }),
  toBinary: (value: {
    node?: { case: string; value?: { label?: string } }
  }) => {
    expect(value.node?.case).toBe('tabSet')
    expect(value.node?.value?.label).toBe('files')
    return new Uint8Array([7])
  },
}
;(OneofBoundMessage as any).__protobufTypeScriptFields = {
  tabSet: OneofLeafBoundMessage,
}
;(OneofBoundMessage as any).__protobufTypeScriptOneofFields = {
  node: { tabSet: OneofBoundMessage_TabSet },
}

describe('protobuf-go-lite EqualVT helpers', () => {
  it('accepts compiler-emitted runtime type arguments', () => {
    const equal = CompareEqualVT<TestValue>({
      T: { zero: () => null },
    })

    expect(equal(new TestValue('a'), new TestValue('a'))).toBe(true)
    expect(equal(new TestValue('a'), new TestValue('b'))).toBe(false)
    expect(equal(null, null)).toBe(true)
  })

  it('accepts nullable generated message slices', () => {
    const left: $.Slice<TestValue | $.VarRef<TestValue> | null> = [
      $.varRef(new TestValue('x')),
      null,
    ]
    const right: $.Slice<TestValue | $.VarRef<TestValue> | null> = [
      new TestValue('x'),
      null,
    ]

    expect(IsEqualVTSlice(left, right)).toBe(true)
  })
})

describe('protobuf-go-lite static helper overrides', () => {
  it('clones pointer, slice, map, bytes, and VT values', () => {
    const ptr = $.varRef(7)
    const clonedPtr = ClonePtr(ptr)
    expect(clonedPtr).not.toBe(ptr)
    expect(clonedPtr?.value).toBe(7)

    const bytes = new Uint8Array([1, 2])
    const clonedBytes = CloneBytes(bytes)
    expect(clonedBytes).not.toBe(bytes)
    expect(Array.from(clonedBytes ?? [])).toEqual([1, 2])

    expect(CloneSlice([1, 2])).toEqual([1, 2])
    expect(CloneMap(new Map([['a', 1]]))?.get('a')).toBe(1)

    const bytesSlice = CloneBytesSlice([new Uint8Array([3])])
    expect(bytesSlice?.[0]).not.toBe(bytes)
    expect(Array.from(bytesSlice?.[0] ?? [])).toEqual([3])

    const bytesMap = CloneBytesMap(new Map([['a', new Uint8Array([4])]]))
    expect(Array.from(bytesMap?.get('a') ?? [])).toEqual([4])

    const msg = new TestCloneValue('x')
    expect(CloneVTValue(msg)).not.toBe(msg)
    expect(CloneVTSlice([msg])?.[0]).not.toBe(msg)
    expect(CloneVTMap(new Map([['a', msg]]))?.get('a')).not.toBe(msg)
  })

  it('compares pointer, slice, map, bytes, and implicit VT values', () => {
    expect(EqualPtr($.varRef(1), $.varRef(1))).toBe(true)
    expect(EqualPtr($.varRef(1), $.varRef(2))).toBe(false)
    expect(EqualBytes(new Uint8Array([1]), [1])).toBe(true)
    expect(EqualBytesPresent(null, new Uint8Array())).toBe(false)
    expect(EqualSlice([1, 2], [1, 2])).toBe(true)
    expect(EqualMap(new Map([['a', 1]]), new Map([['a', 1]]))).toBe(true)
    expect(EqualBytesSlice([new Uint8Array([1])], [[1]])).toBe(true)
    expect(
      EqualBytesMap(
        new Map([['a', new Uint8Array([1])]]),
        new Map([['a', [1]]]),
      ),
    ).toBe(true)

    const empty = () => new TestCloneValue('')
    expect(EqualVTImplicit(null, new TestCloneValue(''), empty)).toBe(true)
    expect(
      EqualVTSliceImplicit(
        [null, new TestCloneValue('x')],
        [new TestCloneValue(''), new TestCloneValue('x')],
        empty,
      ),
    ).toBe(true)
    expect(
      EqualVTMapImplicit(
        new Map([['a', null]]),
        new Map([['a', new TestCloneValue('')]]),
        empty,
      ),
    ).toBe(true)
  })
})

describe('protobuf-go-lite runtime interfaces', () => {
  it('registers CloneMessage metadata for Go type assertions', () => {
    const [value, ok] = $.typeAssertTuple<CloneMessage | null>(
      new TestCloneMessage(),
      'protobuf_go_lite.CloneMessage',
    )

    expect(ok).toBe(true)
    expect(value?.CloneMessageVT()).toBeInstanceOf(TestCloneMessage)
  })
})

describe('protobuf-go-lite TypeScript binding helpers', () => {
  it('adds message type context to binary marshal errors', () => {
    const [, err] = MarshalBoundMessageVT(
      BrokenBoundMessage as any,
      new BrokenBoundMessage(),
    )

    expect(err?.Error()).toBe(
      'marshal test.BrokenBoundMessage: invalid uint 32: undefined',
    )
  })

  it('normalizes Go byte slices before binary marshal', () => {
    const [bytes, err] = MarshalBoundMessageVT(
      BytesBoundMessage as any,
      new BytesBoundMessage([1, 2, 3]),
    )

    expect(err).toBeNull()
    expect(Array.from(bytes ?? [])).toEqual([9])
  })

  it('returns bytes written after marshaling into a sized buffer', () => {
    const target = new Uint8Array([0, 0, 0])
    const [n, err] = MarshalBoundMessageToSizedBufferVT(
      BytesBoundMessage as any,
      new BytesBoundMessage([1, 2, 3]),
      target,
    )

    expect(err).toBeNull()
    expect(n).toBe(1)
    expect(Array.from(target)).toEqual([0, 0, 9])
  })

  it('hydrates protobuf-es-lite timestamp Date fields into Go timestamp structs', () => {
    const target = new TimestampParentBoundMessage()

    const err = UnmarshalBoundMessageVT(
      TimestampParentBoundMessage as any,
      target,
      new Uint8Array(),
    )

    expect(err).toBeNull()
    expect(target.Timestamp?.Seconds).toBe(1780230896)
    expect(target.Timestamp?.Nanos).toBe(789000000)
  })

  it('preserves protobuf oneof branches in bound binary helpers', () => {
    const source = new OneofBoundMessage({
      Node: new OneofBoundMessage_TabSet({
        TabSet: new OneofLeafBoundMessage({ Label: 'files' }),
      }),
    })

    const [bytes, marshalErr] = MarshalBoundMessageVT(
      OneofBoundMessage as any,
      source,
    )

    expect(marshalErr).toBeNull()
    expect(Array.from(bytes ?? [])).toEqual([7])

    const target = new OneofBoundMessage()
    const unmarshalErr = UnmarshalBoundMessageVT(
      OneofBoundMessage as any,
      target,
      new Uint8Array([7]),
    )

    expect(unmarshalErr).toBeNull()
    expect(target.Node).toBeInstanceOf(OneofBoundMessage_TabSet)
    expect(target.Node?.TabSet).toBeInstanceOf(OneofLeafBoundMessage)
    expect(target.Node?.TabSet?.Label).toBe('files')
  })
})

describe('protobuf-go-lite wire helpers', () => {
  it('encodes and decodes varints', () => {
    const buf = new Uint8Array(4)

    const offset = EncodeVarint(buf, 4, 300)

    expect(offset).toBe(2)
    expect(Array.from(buf.slice(offset))).toEqual([0xac, 0x02])
    expect(SizeOfVarint(300)).toBe(2)
    expect(DecodeVarint(buf, offset)).toEqual([300, 4, null])
    expect(DecodeVarintInt32(buf, offset)).toEqual([300, 4, null])
    expect(DecodeVarintInt64(buf, offset)).toEqual([300, 4, null])
    expect(DecodeVarintUint32(buf, offset)).toEqual([300, 4, null])
    expect(Array.from(AppendVarint([], 300) as number[])).toEqual([0xac, 0x02])
    expect(SizeOfVarint(0xffffffffffffffffn)).toBe(10)
    expect(SizeOfZigzag(-1)).toBe(1)
    expect(SizeOfZigzag(1)).toBe(1)
    expect(SizeOfZigzag(-64)).toBe(1)
    expect(SizeOfZigzag(-65)).toBe(2)
    expect(
      Array.from(AppendVarint([], 0xffffffffffffffffn) as number[]),
    ).toEqual([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01])
    expect(ConsumeVarint(AppendVarint([], 0xffffffffffffffffn))).toEqual([
      0xffffffffffffffffn,
      10,
    ])
  })

  it('decodes fixed64 values', () => {
    expect(DecodeFixed32(new Uint8Array([0x44, 0x33, 0x22, 0x11]), 0)).toEqual([
      0x11223344,
      4,
      null,
    ])

    expect(
      DecodeFixed64(
        new Uint8Array([0x88, 0x77, 0x66, 0x55, 0x44, 0x33, 0x22, 0x11]),
        0,
      ),
    ).toEqual([0x1122334455667800, 8, null])

    const [, , err] = DecodeFixed64(new Uint8Array([1, 2, 3]), 0)
    expect(err?.Error()).toBe('unexpected EOF')
  })

  it('skips protobuf records', () => {
    expect(Skip(new Uint8Array([0x08, 0x96, 0x01]))).toEqual([3, null])
    expect(Skip(new Uint8Array([0x12, 0x03, 0x61, 0x62, 0x63]))).toEqual([
      5,
      null,
    ])
    expect(Skip(new Uint8Array([0x0c]))).toEqual([0, ErrUnexpectedEndOfGroup])
  })

  it('reports protobuf wire errors as Go errors', () => {
    expect(ErrInvalidLength?.Error()).toContain('negative length')
    expect(ErrIntOverflow?.Error()).toContain('integer overflow')
    const [, eof] = Skip(new Uint8Array([0x08, 0x80]))
    expect(eof?.Error()).toBe('unexpected EOF')
  })

  it('reports helper-backed protobuf sizes', () => {
    expect(SizeVarintValue(1, 300)).toBe(3)
    expect(SizeVarintNonZero(1, 0)).toBe(0)
    expect(SizeVarintNonZero(1, 300)).toBe(3)
    expect(SizeVarintPtr(1, null)).toBe(0)
    expect(SizeVarintPtr(1, $.varRef(300))).toBe(3)
    expect(SizeVarintSlice(1, [1, 300])).toBe(5)
    expect(SizeVarintPacked(1, [1, 300])).toBe(5)

    expect(SizeZigzagValue(1, -65)).toBe(3)
    expect(SizeZigzagNonZero(1, 0)).toBe(0)
    expect(SizeZigzagPtr(1, $.varRef(-1))).toBe(2)
    expect(SizeZigzagSlice(1, [-1, -65])).toBe(5)
    expect(SizeZigzagPacked(1, [-1, -65])).toBe(5)

    expect(SizeFixed32Value(1)).toBe(5)
    expect(SizeFixed32NonZero(1, 0)).toBe(0)
    expect(SizeFixed32Ptr(1, $.varRef(1))).toBe(5)
    expect(SizeFixed32Slice(1, [1, 2])).toBe(10)
    expect(SizeFixed32Packed(1, [1, 2])).toBe(10)

    expect(SizeFixed64Value(1)).toBe(9)
    expect(SizeFixed64NonZero(1, 0)).toBe(0)
    expect(SizeFixed64Ptr(1, $.varRef(1))).toBe(9)
    expect(SizeFixed64Slice(1, [1, 2])).toBe(18)
    expect(SizeFixed64Packed(1, [1, 2])).toBe(18)

    expect(SizeBoolValue(1)).toBe(2)
    expect(SizeBoolNonZero(1, false)).toBe(0)
    expect(SizeBoolPtr(1, $.varRef(false))).toBe(2)
    expect(SizeBoolSlice(1, [true, false])).toBe(4)
    expect(SizeBoolPacked(1, [true, false])).toBe(4)

    expect(SizeStringValue(1, 'abc')).toBe(5)
    expect(SizeStringNonEmpty(1, '')).toBe(0)
    expect(SizeStringPtr(1, $.varRef('abc'))).toBe(5)
    expect(SizeStringSlice(1, ['a', 'bc'])).toBe(7)

    expect(SizeBytesValue(1, 3)).toBe(5)
    expect(SizeBytesNonEmpty(1, new Uint8Array())).toBe(0)
    expect(SizeBytesPresent(1, new Uint8Array())).toBe(2)
    expect(
      SizeBytesSlice(1, [new Uint8Array([1]), new Uint8Array([2, 3])]),
    ).toBe(7)

    expect(SizeMessage(1, 3)).toBe(5)
    expect(SizeGroup(1, 3)).toBe(5)
  })
})

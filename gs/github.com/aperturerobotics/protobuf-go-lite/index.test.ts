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

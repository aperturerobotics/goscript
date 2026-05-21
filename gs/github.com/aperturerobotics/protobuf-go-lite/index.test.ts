import { describe, expect, it } from 'vitest'

import {
  AppendVarint,
  CompareEqualVT,
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
  SizeOfVarint,
  Skip,
} from './index.js'

class TestValue {
  constructor(private readonly value: string) {}

  EqualVT(other: TestValue): boolean {
    return this.value == other.value
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
    expect(Array.from(AppendVarint([], 300) as number[])).toEqual([
      0xac,
      0x02,
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
    expect(Skip(new Uint8Array([0x0c]))).toEqual([
      0,
      ErrUnexpectedEndOfGroup,
    ])
  })

  it('reports protobuf wire errors as Go errors', () => {
    expect(ErrInvalidLength?.Error()).toContain('negative length')
    expect(ErrIntOverflow?.Error()).toContain('integer overflow')
    const [, eof] = Skip(new Uint8Array([0x08, 0x80]))
    expect(eof?.Error()).toBe('unexpected EOF')
  })
})

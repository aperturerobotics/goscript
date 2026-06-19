import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import * as asn1 from './asn1/index.js'
import {
  BuildError,
  NewBuilder,
  NewFixedBuilder,
  String_CopyBytes,
  String_Empty,
  String_ReadASN1,
  String_ReadASN1Boolean,
  String_ReadASN1Integer,
  String_ReadBytes,
  String_ReadOptionalASN1,
  String_ReadOptionalASN1Integer,
  String_ReadUint16,
  String_ReadUint24,
  String_ReadUint32,
  String_ReadUint48,
  String_ReadUint64,
  String_ReadUint8,
  type String,
} from './index.js'

class FakeBigInt {
  public value: bigint

  constructor(value = 0n) {
    this.value = value
  }

  public SetBytes(bytes: $.Bytes): FakeBigInt {
    let value = 0n
    for (const b of Array.from($.bytesToUint8Array(bytes))) {
      value = (value << 8n) | BigInt(b)
    }
    this.value = value
    return this
  }

  public Bytes(): $.Bytes {
    if (this.value === 0n) {
      return new Uint8Array(0)
    }
    let value = this.value < 0n ? -this.value : this.value
    const out: number[] = []
    while (value > 0n) {
      out.unshift(Number(value & 0xffn))
      value >>= 8n
    }
    return new Uint8Array(out)
  }

  public Sign(): number {
    if (this.value < 0n) {
      return -1
    }
    if (this.value > 0n) {
      return 1
    }
    return 0
  }

  public Neg(value: FakeBigInt): FakeBigInt {
    this.value = -value.value
    return this
  }

  public String(): string {
    return this.value.toString()
  }
}

function bytes(value: $.Bytes): number[] {
  return Array.from($.bytesToUint8Array(value))
}

function typedRef<T>(value: T, typeName: string): $.VarRef<T> {
  const ref = $.varRef(value) as $.VarRef<T> & { __goType?: string }
  ref.__goType = typeName
  return ref
}

describe('cryptobyte override Builder', () => {
  it('writes fixed-width integers and raw bytes', () => {
    const b = NewBuilder()
    b.AddUint8(0x01)
    b.AddUint16(0x0203)
    b.AddUint24(0x040506)
    b.AddUint32(0x0708090a)
    b.AddUint48(0x0b0c0d0e0f10)
    b.AddUint64($.uint(0x1112131415161718n, 64))
    b.AddBytes(new Uint8Array([0x19, 0x1a]))

    const [out, err] = b.Bytes()
    expect(err).toBeNull()
    expect(bytes(out)).toEqual([
      0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16,
      0x17, 0x18, 0x19, 0x1a,
    ])
  })

  it('writes ASN.1 length prefixes and reports fixed builder errors', () => {
    const b = NewBuilder()
    b.AddASN1(asn1.SEQUENCE, (child) => {
      child!.AddASN1Int64(1)
      child!.AddASN1Uint64(300)
    })

    const [out, err] = b.Bytes()
    expect(err).toBeNull()
    expect(bytes(out)).toEqual([
      0x30, 0x07, 0x02, 0x01, 0x01, 0x02, 0x02, 0x01, 0x2c,
    ])

    const fixed = NewFixedBuilder($.makeSlice<number>(0, 2, 'byte'))
    fixed.AddBytes(new Uint8Array([1, 2, 3]))
    const [, fixedErr] = fixed.Bytes()
    expect(fixedErr?.Error()).toContain('fixed-size buffer')

    const panicBuilder = NewBuilder()
    panicBuilder.SetError($.newError('boom'))
    expect(() => panicBuilder.BytesOrPanic()).toThrow()
    try {
      panicBuilder.BytesOrPanic()
    } catch (err) {
      expect($.panicValue(err)).toBeInstanceOf(BuildError)
    }
  })
})

describe('cryptobyte override String', () => {
  it('reads fixed-width integers and bytes', () => {
    const input = $.varRef<String>(
      new Uint8Array([
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
        0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0xaa, 0xbb,
      ]),
    )
    const u8 = $.varRef(0)
    const u16 = $.varRef(0)
    const u24 = $.varRef(0)
    const u32 = $.varRef(0)
    const u48 = $.varRef(0)
    const u64 = $.varRef(0)
    const tail = $.varRef<$.Bytes>(new Uint8Array(0))

    expect(String_ReadUint8(input, u8)).toBe(true)
    expect(String_ReadUint16(input, u16)).toBe(true)
    expect(String_ReadUint24(input, u24)).toBe(true)
    expect(String_ReadUint32(input, u32)).toBe(true)
    expect(String_ReadUint48(input, u48)).toBe(true)
    expect(String_ReadBytes(input, tail, 2)).toBe(true)

    expect(u8.value).toBe(0x01)
    expect(u16.value).toBe(0x0203)
    expect(u24.value).toBe(0x040506)
    expect(u32.value).toBe(0x0708090a)
    expect(u48.value).toBe(0x0b0c0d0e0f10)
    expect(bytes(tail.value)).toEqual([0xaa, 0xbb])

    const wide = $.varRef<String>(
      new Uint8Array([0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18]),
    )
    expect(String_ReadUint64(wide, u64)).toBe(true)
    expect(u64.value).toBe($.uint(0x1112131415161718n, 64))
  })

  it('reads ASN.1 integers, booleans, optional values, and round trips sequences', () => {
    const b = NewBuilder()
    b.AddASN1(asn1.SEQUENCE, (seq) => {
      seq!.AddASN1Int64(42)
      seq!.AddASN1Uint64(65537)
      seq!.AddASN1Boolean(true)
    })
    const [encoded] = b.Bytes()
    const input = $.varRef<String>(encoded)
    const seq = $.varRef<String>(new Uint8Array(0))

    expect(String_ReadASN1(input, seq, asn1.SEQUENCE)).toBe(true)
    const signed = typedRef(0, '*int64')
    const unsigned = typedRef(0, '*uint64')
    const flag = $.varRef(false)

    expect(String_ReadASN1Integer(seq, signed)).toBe(true)
    expect(String_ReadASN1Integer(seq, unsigned)).toBe(true)
    expect(String_ReadASN1Boolean(seq, flag)).toBe(true)
    expect(signed.value).toBe(42)
    expect(unsigned.value).toBe(65537)
    expect(flag.value).toBe(true)
    expect(String_Empty(seq.value)).toBe(true)

    const absent = $.varRef<String>(new Uint8Array(0))
    const optional = $.varRef<String>(new Uint8Array([0]))
    expect(
      String_ReadOptionalASN1(absent, optional, asn1.OCTET_STRING, new Uint8Array([9])),
    ).toBe(true)
    expect(bytes(optional.value)).toEqual([9])

    const defaultBig = typedRef(new FakeBigInt(), '*big.Int')
    expect(
      String_ReadOptionalASN1Integer(
        $.varRef<String>(new Uint8Array(0)),
        defaultBig,
        asn1.INTEGER,
        new FakeBigInt(99n),
      ),
    ).toBe(true)
    expect(defaultBig.value.value).toBe(99n)
  })

  it('round trips ECDSA-style integer pairs and big.Int values', () => {
    const r = new FakeBigInt(0x0102030405060708n)
    const s = new FakeBigInt(0x80n)
    const b = NewBuilder()
    b.AddASN1(asn1.SEQUENCE, (seq) => {
      seq!.AddASN1BigInt(r)
      seq!.AddASN1BigInt(s)
    })
    const [encoded, err] = b.Bytes()
    expect(err).toBeNull()

    const input = $.varRef<String>(encoded)
    const seq = $.varRef<String>(new Uint8Array(0))
    const rOut = typedRef(new FakeBigInt(), '*big.Int')
    const sOut = typedRef(new FakeBigInt(), '*big.Int')

    expect(String_ReadASN1(input, seq, asn1.SEQUENCE)).toBe(true)
    expect(String_ReadASN1Integer(seq, rOut)).toBe(true)
    expect(String_ReadASN1Integer(seq, sOut)).toBe(true)
    expect(rOut.value.value).toBe(r.value)
    expect(sOut.value.value).toBe(s.value)
  })

  it('marshals and unmarshals a fixed 32-byte string payload', () => {
    const payload = new Uint8Array(Array.from({ length: 32 }, (_, i) => i + 1))
    const b = NewBuilder()
    b.AddBytes(payload)
    const [encoded, err] = b.Bytes()
    expect(err).toBeNull()

    const input = $.varRef<String>(encoded)
    const out = $.varRef<$.Bytes>(new Uint8Array(0))
    const copied = new Uint8Array(32)

    expect(String_ReadBytes(input, out, 32)).toBe(true)
    expect(bytes(out.value)).toEqual(bytes(payload))
    input.value = encoded
    expect(String_CopyBytes(input, copied)).toBe(true)
    expect(bytes(copied)).toEqual(bytes(payload))
  })
})

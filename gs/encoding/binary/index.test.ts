import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'
import * as io from '@goscript/io/index.js'

import {
  Append,
  AppendUvarint,
  AppendVarint,
  BigEndian,
  Decode,
  Encode,
  LittleEndian,
  MaxVarintLen64,
  PutUvarint,
  PutVarint,
  Read,
  ReadUvarint,
  ReadVarint,
  Size,
  Uvarint,
  Varint,
  Write,
  type AppendByteOrder,
  type ByteOrder,
} from './index.js'

describe('encoding/binary override', () => {
  it('encodes and decodes big and little endian integers', () => {
    const buf = $.makeSlice<number>(8, undefined, 'byte')

    BigEndian.PutUint16(buf, 0x1234)
    expect(Array.from($.bytesToUint8Array($.goSlice(buf, 0, 2)))).toEqual([
      0x12, 0x34,
    ])
    expect(BigEndian.Uint16(buf)).toBe(0x1234)

    LittleEndian.PutUint32(buf, 0x12345678)
    expect(Array.from($.bytesToUint8Array($.goSlice(buf, 0, 4)))).toEqual([
      0x78, 0x56, 0x34, 0x12,
    ])
    expect(LittleEndian.Uint32(buf)).toBe(0x12345678)

    BigEndian.PutUint64(buf, 0x0102030405060708n)
    expect(Array.from($.bytesToUint8Array(buf))).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ])
    expect(BigEndian.Uint64(buf)).toBe(0x0102030405060708n)
    expect(LittleEndian.String()).toBe('LittleEndian')
    expect(BigEndian.GoString()).toBe('binary.BigEndian')
  })

  it('returns endian uint64 as bigint for small and above-safe values', () => {
    const cases = [
      { name: 'small', value: 5n },
      { name: 'above-safe', value: 1n << 53n },
      { name: 'wide', value: 1n << 60n },
    ]

    for (const order of [LittleEndian, BigEndian]) {
      for (const { name, value } of cases) {
        const buf = $.makeSlice<number>(8, undefined, 'byte')
        order.PutUint64(buf, value)

        const decoded = order.Uint64(buf)
        expect(typeof decoded, `${order.String()} ${name}`).toBe('bigint')
        expect(decoded, `${order.String()} ${name}`).toBe(value)
      }
    }

    const small = $.makeSlice<number>(8, undefined, 'byte')
    LittleEndian.PutUint64(small, 5n)
    const wide = $.makeSlice<number>(8, undefined, 'byte')
    LittleEndian.PutUint64(wide, 1n << 60n)
    const a = LittleEndian.Uint64(small)
    const b = LittleEndian.Uint64(wide)
    // The raw relational operator GoScript emits for uint64 must not throw.
    expect(a < b).toBe(true)
  })

  it('decodes fixed int64 and uint64 refs as bigint at boundary values', () => {
    const scalarCases = [
      { name: 'small int64', typeName: '*int64', encoded: 5n, expected: 5n },
      {
        name: 'above-safe int64',
        typeName: '*int64',
        encoded: 1n << 53n,
        expected: 1n << 53n,
      },
      {
        name: 'negative int64',
        typeName: '*int64',
        encoded: 0xffffffffffffffffn,
        expected: -1n,
      },
      { name: 'small uint64', typeName: '*uint64', encoded: 5n, expected: 5n },
      {
        name: 'above-safe uint64',
        typeName: '*uint64',
        encoded: 1n << 63n,
        expected: 1n << 63n,
      },
    ]

    for (const { name, typeName, encoded, expected } of scalarCases) {
      const buf = $.makeSlice<number>(8, undefined, 'byte')
      BigEndian.PutUint64(buf, encoded)
      const ref = $.varRef(0)
      const target = $.namedValueInterfaceValue<unknown>(ref, typeName, {})

      expect(Decode(buf, BigEndian, target), name).toEqual([8, null])
      expect(typeof ref.value, name).toBe('bigint')
      expect(ref.value, name).toBe(expected)
    }

    const namedCases = [
      {
        name: 'named small int64',
        typeName: '*main.SignedID',
        typeInfo: {
          kind: $.TypeKind.Pointer,
          elemType: {
            kind: $.TypeKind.Basic,
            name: 'int64',
            typeName: 'main.SignedID',
          },
        },
        encoded: 5n,
        expected: 5n,
      },
      {
        name: 'named above-safe uint64',
        typeName: '*chunker.Pol',
        typeInfo: {
          kind: $.TypeKind.Pointer,
          elemType: {
            kind: $.TypeKind.Basic,
            name: 'uint64',
            typeName: 'chunker.Pol',
          },
        },
        encoded: 1n << 63n,
        expected: 1n << 63n,
      },
    ]

    for (const { name, typeName, typeInfo, encoded, expected } of namedCases) {
      const buf = $.makeSlice<number>(8, undefined, 'byte')
      LittleEndian.PutUint64(buf, encoded)
      const ref = $.varRef(0)
      const target = $.namedValueInterfaceValue<unknown>(
        ref,
        typeName,
        {},
        typeInfo,
      )

      expect(Decode(buf, LittleEndian, target), name).toEqual([8, null])
      expect(typeof ref.value, name).toBe('bigint')
      expect(ref.value, name).toBe(expected)
    }
  })

  it('appends endian integers', () => {
    let out = BigEndian.AppendUint16(null, 0x1234)
    out = LittleEndian.AppendUint32(out, 0x01020304)
    out = BigEndian.AppendUint64(out, 0x05060708090a0b0cn)

    expect(Array.from($.bytesToUint8Array(out))).toEqual([
      0x12, 0x34, 0x04, 0x03, 0x02, 0x01, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a,
      0x0b, 0x0c,
    ])
  })

  it('registers ByteOrder and AppendByteOrder interfaces', () => {
    const [, byteOrderOK] = $.typeAssertTuple<ByteOrder>(
      BigEndian,
      'binary.ByteOrder',
    )
    const [, appendOrderOK] = $.typeAssertTuple<AppendByteOrder>(
      LittleEndian,
      'binary.AppendByteOrder',
    )

    expect(byteOrderOK).toBe(true)
    expect(appendOrderOK).toBe(true)
  })

  it('matches Go varint semantics', async () => {
    const buf = $.makeSlice<number>(MaxVarintLen64, undefined, 'byte')
    const n = PutUvarint(buf, 300)

    expect(n).toBe(2)
    expect(Array.from($.bytesToUint8Array($.goSlice(buf, 0, n)))).toEqual([
      0xac, 0x02,
    ])
    expect(Uvarint($.goSlice(buf, 0, n))).toEqual([300n, 2])

    const signed = $.makeSlice<number>(MaxVarintLen64, undefined, 'byte')
    const signedN = PutVarint(signed, -150)
    expect(Varint($.goSlice(signed, 0, signedN))).toEqual([-150n, signedN])

    expect(Array.from($.bytesToUint8Array(AppendUvarint(null, 300)))).toEqual([
      0xac, 0x02,
    ])
    expect(Varint(AppendVarint(null, -150))[0]).toBe(-150n)

    const reader = bytes.NewReader($.goSlice(buf, 0, n))!
    expect(await ReadUvarint(reader)).toEqual([300n, null])

    const signedReader = bytes.NewReader($.goSlice(signed, 0, signedN))!
    expect(await ReadVarint(signedReader)).toEqual([-150n, null])
  })

  it('reports varint short buffers and overflows', async () => {
    expect(Uvarint($.stringToBytes('\x80'))).toEqual([0n, 0])

    const overflow = $.makeSlice<number>(11, undefined, 'byte')
    for (let i = 0; i < $.len(overflow); i++) {
      overflow[i] = 0x80
    }
    expect(Uvarint(overflow)).toEqual([0n, -11])

    const shortReader = bytes.NewReader($.stringToBytes('\x80'))!
    const [, shortErr] = await ReadUvarint(shortReader)
    expect(shortErr).toBe(io.ErrUnexpectedEOF)
  })

  it('encodes, decodes, reads, and writes byte slices', async () => {
    const source = $.stringToBytes('abc')
    const target = $.makeSlice<number>(3, undefined, 'byte')

    expect(Decode(source, BigEndian, target)).toEqual([3, null])
    expect($.bytesToString(target)).toBe('abc')
    expect(Encode(target, BigEndian, $.stringToBytes('xyz'))).toEqual([3, null])
    expect($.bytesToString(target)).toBe('xyz')
    expect(
      Append($.stringToBytes('go'), BigEndian, $.stringToBytes('ts')),
    ).toEqual([$.stringToBytes('gots'), null])
    expect(Size($.stringToBytes('data'))).toBe(4)

    const readTarget = $.makeSlice<number>(3, undefined, 'byte')
    expect(
      await Read(
        bytes.NewReader($.stringToBytes('bin'))!,
        BigEndian,
        readTarget,
      ),
    ).toBeNull()
    expect($.bytesToString(readTarget)).toBe('bin')

    const written: $.Bytes[] = []
    const writer = {
      Write(p: $.Bytes): [number, $.GoError] {
        written.push($.bytesToUint8Array(p).slice())
        return [$.len(p), null]
      },
    }
    expect(await Write(writer, BigEndian, $.stringToBytes('out'))).toBeNull()
    expect($.bytesToString(written[0])).toBe('out')
  })

  it('handles boxed fixed-width primitive fast paths', async () => {
    const value = $.namedValueInterfaceValue<unknown>(0x1234, 'uint16', {})
    const [encoded, encErr] = Append(null, BigEndian, value)
    expect(encErr).toBeNull()
    expect(Array.from($.bytesToUint8Array(encoded))).toEqual([0x12, 0x34])

    const target = $.namedValueInterfaceValue<unknown>(
      $.varRef(0),
      '*uint16',
      {},
    )
    expect(Decode(encoded, BigEndian, target)).toEqual([2, null])
    expect($.pointerValue(target as any)).toBe(0x1234)
    expect(Size(value)).toBe(2)

    const polType: $.TypeInfo = {
      kind: $.TypeKind.Basic,
      name: 'uint64',
      typeName: 'chunker.Pol',
    }
    const polValue = $.namedValueInterfaceValue<unknown>(
      0x010203040506,
      'chunker.Pol',
      {},
      polType,
    )
    const [polEncoded, polEncErr] = Append(null, LittleEndian, polValue)
    expect(polEncErr).toBeNull()
    expect(Array.from($.bytesToUint8Array(polEncoded))).toEqual([
      0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x00, 0x00,
    ])
    expect(Size(polValue)).toBe(8)

    const polRef = $.varRef(0)
    const polTarget = $.namedValueInterfaceValue<unknown>(
      polRef,
      '*chunker.Pol',
      {},
      { kind: $.TypeKind.Pointer, elemType: polType },
    )
    expect(Decode(polEncoded, LittleEndian, polTarget)).toEqual([8, null])
    expect(polRef.value).toBe(0x010203040506n)

    polRef.value = 0
    expect(
      await Read(bytes.NewReader(polEncoded)!, LittleEndian, polTarget),
    ).toBeNull()
    expect(polRef.value).toBe(0x010203040506n)

    const written: $.Bytes[] = []
    const writer = {
      Write(p: $.Bytes): [number, $.GoError] {
        written.push($.bytesToUint8Array(p).slice())
        return [$.len(p), null]
      },
    }
    expect(await Write(writer, LittleEndian, polValue)).toBeNull()
    expect(Array.from(written[0])).toEqual([
      0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x00, 0x00,
    ])
  })

  it('fails unsupported reflect-shaped cases closed', () => {
    class StructLike {
      public _fields = {
        Value: $.varRef(1),
      }
    }

    const [, encodeErr] = Encode(
      $.makeSlice<number>(8, undefined, 'byte'),
      BigEndian,
      new StructLike(),
    )
    expect(encodeErr?.Error()).toBe(
      'encoding/binary: Encode of object is not supported in the GoScript browser build',
    )

    expect(Size(new StructLike())).toBe(-1)
  })

  it('panics on short endian buffers with Go-style bounds text', () => {
    expect(() =>
      BigEndian.PutUint32($.makeSlice<number>(1, undefined, 'byte'), 1),
    ).toThrow('runtime error: index out of range [3] with length 1')
  })

  it('sizes, appends, and decodes complex64 and complex128', () => {
    const c128 = $.namedValueInterfaceValue<unknown>(
      { real: 1.5, imag: 2.5 },
      'complex128',
      {},
      { kind: $.TypeKind.Basic, name: 'complex128' },
    )
    expect(Size(c128)).toBe(16)
    const [enc128, err128] = Append(null, BigEndian, c128)
    expect(err128).toBeNull()
    expect(Array.from($.bytesToUint8Array(enc128))).toEqual([
      0x3f, 0xf8, 0, 0, 0, 0, 0, 0, 0x40, 0x04, 0, 0, 0, 0, 0, 0,
    ])

    const ref128 = $.varRef<unknown>({ real: 0, imag: 0 })
    const target128 = $.namedValueInterfaceValue<unknown>(
      ref128,
      '*complex128',
      {},
      {
        kind: $.TypeKind.Pointer,
        elemType: { kind: $.TypeKind.Basic, name: 'complex128' },
      },
    )
    expect(Decode(enc128, BigEndian, target128)).toEqual([16, null])
    expect(ref128.value).toEqual({ real: 1.5, imag: 2.5 })

    const c64 = $.namedValueInterfaceValue<unknown>(
      { real: 1, imag: -1 },
      'complex64',
      {},
      { kind: $.TypeKind.Basic, name: 'complex64' },
    )
    expect(Size(c64)).toBe(8)
  })

  it('sizes, appends, and decodes fixed-size structs field by field', () => {
    const structInfo: $.TypeInfo = {
      kind: $.TypeKind.Struct,
      name: 'Sample',
      methods: [],
      fields: [
        {
          name: 'A',
          key: 'A',
          type: { kind: $.TypeKind.Basic, name: 'int32' },
        },
        {
          name: 'B',
          key: 'B',
          type: { kind: $.TypeKind.Basic, name: 'uint16' },
        },
        {
          name: 'C',
          key: 'C',
          type: {
            kind: $.TypeKind.Array,
            length: 2,
            elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
          },
        },
      ],
    }

    const instance = {
      _fields: {
        A: $.varRef(0x01020304),
        B: $.varRef(0x0506),
        C: $.varRef([0xaa, 0xbb]),
      },
    }
    const value = $.namedValueInterfaceValue<unknown>(
      instance,
      'Sample',
      {},
      structInfo,
    )

    expect(Size(value)).toBe(8)
    const [encoded, err] = Append(null, BigEndian, value)
    expect(err).toBeNull()
    expect(Array.from($.bytesToUint8Array(encoded))).toEqual([
      0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0xaa, 0xbb,
    ])

    const decodedInstance = {
      _fields: {
        A: $.varRef(0),
        B: $.varRef(0),
        C: $.varRef([0, 0]),
      },
    }
    const target = $.namedValueInterfaceValue<unknown>(
      $.varRef(decodedInstance),
      '*Sample',
      {},
      { kind: $.TypeKind.Pointer, elemType: structInfo },
    )
    expect(Decode(encoded, BigEndian, target)).toEqual([8, null])
    expect(decodedInstance._fields.A.value).toBe(0x01020304)
    expect(decodedInstance._fields.B.value).toBe(0x0506)
    expect(decodedInstance._fields.C.value).toEqual([0xaa, 0xbb])
  })
})

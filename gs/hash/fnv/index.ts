import * as $ from '@goscript/builtin/index.js'

const offset32 = 0x811c9dc5
const offset64 = 0xcbf29ce484222325n
const offset128Lower = 0x62b821756295c58dn
const offset128Higher = 0x6c62272e07bb0142n
const offset128 = (offset128Higher << 64n) | offset128Lower
const prime32 = 0x01000193
const prime64 = 0x00000100000001b3n
const prime128 = (1n << 88n) | 0x13bn
const uint64Mask = 0xffffffffffffffffn
const uint128Mask = 0xffffffffffffffffffffffffffffffffn

const magic32 = bytes('fnv\x01')
const magic32a = bytes('fnv\x02')
const magic64 = bytes('fnv\x03')
const magic64a = bytes('fnv\x04')
const magic128 = bytes('fnv\x05')
const magic128a = bytes('fnv\x06')

class FNV32 {
  private hash = offset32

  constructor(
    private readonly alternate: boolean,
    private readonly magic: Uint8Array,
  ) {}

  Write(data: $.Bytes): [number, $.GoError] {
    const bytes = $.bytesToUint8Array(data)
    let hash = this.hash >>> 0
    if (this.alternate) {
      for (const c of bytes) {
        hash ^= c
        hash = Math.imul(hash, prime32) >>> 0
      }
    } else {
      for (const c of bytes) {
        hash = Math.imul(hash, prime32) >>> 0
        hash ^= c
      }
    }
    this.hash = hash >>> 0
    return [bytes.length, null]
  }

  async Sum(prefix: $.Bytes | null): Promise<$.Bytes> {
    return appendBytes($.bytesToUint8Array(prefix), be32(this.hash))
  }

  Sum32(): number {
    return this.hash >>> 0
  }

  Reset(): void {
    this.hash = offset32
  }

  Size(): number {
    return 4
  }

  BlockSize(): number {
    return 1
  }

  AppendBinary(prefix: $.Bytes | null): [$.Bytes, $.GoError] {
    return [appendBytes($.bytesToUint8Array(prefix), this.magic, be32(this.hash)), null]
  }

  MarshalBinary(): [$.Bytes, $.GoError] {
    return this.AppendBinary(null)
  }

  UnmarshalBinary(data: $.Bytes): $.GoError {
    const state = $.bytesToUint8Array(data)
    const err = validateState(state, this.magic, 8)
    if (err != null) {
      return err
    }
    this.hash = readBE32(state, 4)
    return null
  }

  Clone(): [FNV32, $.GoError] {
    const clone = new FNV32(this.alternate, this.magic)
    clone.hash = this.hash
    return [clone, null]
  }
}

class FNV64 {
  private hash = offset64

  constructor(
    private readonly alternate: boolean,
    private readonly magic: Uint8Array,
  ) {}

  Write(data: $.Bytes): [number, $.GoError] {
    const bytes = $.bytesToUint8Array(data)
    let hash = this.hash
    if (this.alternate) {
      for (const c of bytes) {
        hash ^= BigInt(c)
        hash = (hash * prime64) & uint64Mask
      }
    } else {
      for (const c of bytes) {
        hash = (hash * prime64) & uint64Mask
        hash ^= BigInt(c)
      }
    }
    this.hash = hash
    return [bytes.length, null]
  }

  async Sum(prefix: $.Bytes | null): Promise<$.Bytes> {
    return appendBytes($.bytesToUint8Array(prefix), be64(this.hash))
  }

  Sum64(): bigint {
    return this.hash
  }

  Reset(): void {
    this.hash = offset64
  }

  Size(): number {
    return 8
  }

  BlockSize(): number {
    return 1
  }

  AppendBinary(prefix: $.Bytes | null): [$.Bytes, $.GoError] {
    return [appendBytes($.bytesToUint8Array(prefix), this.magic, be64(this.hash)), null]
  }

  MarshalBinary(): [$.Bytes, $.GoError] {
    return this.AppendBinary(null)
  }

  UnmarshalBinary(data: $.Bytes): $.GoError {
    const state = $.bytesToUint8Array(data)
    const err = validateState(state, this.magic, 12)
    if (err != null) {
      return err
    }
    this.hash = readBE64(state, 4)
    return null
  }

  Clone(): [FNV64, $.GoError] {
    const clone = new FNV64(this.alternate, this.magic)
    clone.hash = this.hash
    return [clone, null]
  }
}

class FNV128 {
  private hash = offset128

  constructor(
    private readonly alternate: boolean,
    private readonly magic: Uint8Array,
  ) {}

  Write(data: $.Bytes): [number, $.GoError] {
    const bytes = $.bytesToUint8Array(data)
    let hash = this.hash
    for (const c of bytes) {
      if (this.alternate) {
        hash ^= BigInt(c)
      }
      hash = (hash * prime128) & uint128Mask
      if (!this.alternate) {
        hash ^= BigInt(c)
      }
    }
    this.hash = hash
    return [bytes.length, null]
  }

  async Sum(prefix: $.Bytes | null): Promise<$.Bytes> {
    return appendBytes($.bytesToUint8Array(prefix), be64(this.high()), be64(this.low()))
  }

  Reset(): void {
    this.hash = offset128
  }

  Size(): number {
    return 16
  }

  BlockSize(): number {
    return 1
  }

  AppendBinary(prefix: $.Bytes | null): [$.Bytes, $.GoError] {
    return [
      appendBytes($.bytesToUint8Array(prefix), this.magic, be64(this.high()), be64(this.low())),
      null,
    ]
  }

  MarshalBinary(): [$.Bytes, $.GoError] {
    return this.AppendBinary(null)
  }

  UnmarshalBinary(data: $.Bytes): $.GoError {
    const state = $.bytesToUint8Array(data)
    const err = validateState(state, this.magic, 20)
    if (err != null) {
      return err
    }
    this.hash = ((readBE64(state, 4) << 64n) | readBE64(state, 12)) & uint128Mask
    return null
  }

  Clone(): [FNV128, $.GoError] {
    const clone = new FNV128(this.alternate, this.magic)
    clone.hash = this.hash
    return [clone, null]
  }

  private high(): bigint {
    return (this.hash >> 64n) & uint64Mask
  }

  private low(): bigint {
    return this.hash & uint64Mask
  }
}

export function New32(): FNV32 {
  return $.interfaceValue<FNV32>(new FNV32(false, magic32), '*fnv.sum32')
}

export function New32a(): FNV32 {
  return $.interfaceValue<FNV32>(new FNV32(true, magic32a), '*fnv.sum32a')
}

export function New64(): FNV64 {
  return $.interfaceValue<FNV64>(new FNV64(false, magic64), '*fnv.sum64')
}

export function New64a(): FNV64 {
  return $.interfaceValue<FNV64>(new FNV64(true, magic64a), '*fnv.sum64a')
}

export function New128(): FNV128 {
  return $.interfaceValue<FNV128>(new FNV128(false, magic128), '*fnv.sum128')
}

export function New128a(): FNV128 {
  return $.interfaceValue<FNV128>(new FNV128(true, magic128a), '*fnv.sum128a')
}

function bytes(value: string): Uint8Array {
  return $.stringToBytes(value)
}

function appendBytes(prefix: Uint8Array, ...chunks: Uint8Array[]): Uint8Array {
  let size = prefix.length
  for (const chunk of chunks) {
    size += chunk.length
  }
  const out = new Uint8Array(size)
  out.set(prefix)
  let offset = prefix.length
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.length
  }
  return out
}

function be32(value: number): Uint8Array {
  return new Uint8Array([
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ])
}

function be64(value: bigint): Uint8Array {
  const word = value & uint64Mask
  return new Uint8Array([
    Number((word >> 56n) & 0xffn),
    Number((word >> 48n) & 0xffn),
    Number((word >> 40n) & 0xffn),
    Number((word >> 32n) & 0xffn),
    Number((word >> 24n) & 0xffn),
    Number((word >> 16n) & 0xffn),
    Number((word >> 8n) & 0xffn),
    Number(word & 0xffn),
  ])
}

function readBE32(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] << 24) >>> 0) |
    (bytes[offset + 1] << 16) |
    (bytes[offset + 2] << 8) |
    bytes[offset + 3]
  ) >>> 0
}

function readBE64(bytes: Uint8Array, offset: number): bigint {
  return (
    (BigInt(bytes[offset]) << 56n) |
    (BigInt(bytes[offset + 1]) << 48n) |
    (BigInt(bytes[offset + 2]) << 40n) |
    (BigInt(bytes[offset + 3]) << 32n) |
    (BigInt(bytes[offset + 4]) << 24n) |
    (BigInt(bytes[offset + 5]) << 16n) |
    (BigInt(bytes[offset + 6]) << 8n) |
    BigInt(bytes[offset + 7])
  )
}

function validateState(
  state: Uint8Array,
  magic: Uint8Array,
  size: number,
): $.GoError {
  if (!startsWith(state, magic)) {
    return $.newError('hash/fnv: invalid hash state identifier')
  }
  if (state.length !== size) {
    return $.newError('hash/fnv: invalid hash state size')
  }
  return null
}

function startsWith(value: Uint8Array, prefix: Uint8Array): boolean {
  if (value.length < prefix.length) {
    return false
  }
  for (let i = 0; i < prefix.length; i++) {
    if (value[i] !== prefix[i]) {
      return false
    }
  }
  return true
}

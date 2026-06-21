import * as $ from '@goscript/builtin/index.js'
import * as asn1 from '@goscript/golang.org/x/crypto/cryptobyte/asn1/index.js'
import * as time from '@goscript/time/index.js'

export type String = $.Bytes

export type BuilderContinuation = ((child: Builder | null) => void) | null

export type MarshalingValue = {
  Marshal(builder: Builder | $.VarRef<Builder> | null): $.GoError
}

const maxUint64 = (1n << 64n) - 1n
const maxInt64 = (1n << 63n) - 1n
const minInt64 = -(1n << 63n)

function byte(value: number | bigint): number {
  if (typeof value === 'bigint') {
    return Number(BigInt.asUintN(8, value))
  }
  return Number(value) & 0xff
}

function bytesArray(bytes: $.Bytes | string | null | undefined): number[] {
  if (bytes == null) {
    return []
  }
  if (typeof bytes === 'string') {
    return Array.from(bytes, (ch) => ch.charCodeAt(0) & 0xff)
  }
  return Array.from($.bytesToUint8Array(bytes))
}

function bytesFromArray(bytes: number[]): $.Bytes {
  return new Uint8Array(bytes.map(byte))
}

function bytesFromString(value: string): $.Bytes {
  return new Uint8Array(Array.from(value, (ch) => ch.charCodeAt(0) & 0xff))
}

function bytesToAscii(bytes: $.Bytes): string {
  return globalThis.String.fromCharCode(...bytesArray(bytes))
}

function cloneBytes(bytes: $.Bytes | null | undefined): $.Bytes {
  return bytesFromArray(bytesArray(bytes))
}

function stringValue(s: $.VarRef<String> | null): String {
  if (s == null) {
    throw new Error(
      'runtime error: invalid memory address or nil pointer dereference',
    )
  }
  return s.value
}

function read(s: $.VarRef<String> | null, n: number): $.Bytes | null {
  const data = stringValue(s)
  if ($.len(data) < n) {
    return null
  }
  const out = $.goSlice(data, 0, n)
  s!.value = $.goSlice(data, n)
  return out
}

function readUint(bytes: $.Bytes): number {
  let out = 0
  for (const b of bytesArray(bytes)) {
    out = out * 256 + b
  }
  return out
}

function readUint64Value(bytes: $.Bytes): number {
  let out = 0n
  for (const b of bytesArray(bytes)) {
    out = (out << 8n) | BigInt(b)
  }
  return $.uint(out, 64)
}

function writeRef<T>(out: $.VarRef<T> | null, value: T): void {
  if (out == null) {
    throw new Error(
      'runtime error: invalid memory address or nil pointer dereference',
    )
  }
  out.value = value
}

export function String_Skip(s: $.VarRef<String> | null, n: number): boolean {
  return read(s, n) !== null
}

export function String_ReadUint8(
  s: $.VarRef<String> | null,
  out: $.VarRef<number> | null,
): boolean {
  const v = read(s, 1)
  if (v == null) {
    return false
  }
  writeRef(out, bytesArray(v)[0])
  return true
}

export function String_ReadUint16(
  s: $.VarRef<String> | null,
  out: $.VarRef<number> | null,
): boolean {
  const v = read(s, 2)
  if (v == null) {
    return false
  }
  writeRef(out, readUint(v))
  return true
}

export function String_ReadUint24(
  s: $.VarRef<String> | null,
  out: $.VarRef<number> | null,
): boolean {
  const v = read(s, 3)
  if (v == null) {
    return false
  }
  writeRef(out, readUint(v))
  return true
}

export function String_ReadUint32(
  s: $.VarRef<String> | null,
  out: $.VarRef<number> | null,
): boolean {
  const v = read(s, 4)
  if (v == null) {
    return false
  }
  writeRef(out, $.uint(readUint(v), 32))
  return true
}

export function String_ReadUint48(
  s: $.VarRef<String> | null,
  out: $.VarRef<number> | null,
): boolean {
  const v = read(s, 6)
  if (v == null) {
    return false
  }
  writeRef(out, readUint(v))
  return true
}

export function String_ReadUint64(
  s: $.VarRef<String> | null,
  out: $.VarRef<number> | null,
): boolean {
  const v = read(s, 8)
  if (v == null) {
    return false
  }
  writeRef(out, readUint64Value(v))
  return true
}

function readLengthPrefixed(
  s: $.VarRef<String> | null,
  lenLen: number,
  out: $.VarRef<String> | null,
): boolean {
  const data = stringValue(s)
  if ($.len(data) < lenLen) {
    return false
  }
  const length = readUint($.goSlice(data, 0, lenLen))
  if ($.len(data) < lenLen + length) {
    return false
  }
  writeRef(out, $.goSlice(data, lenLen, lenLen + length))
  s!.value = $.goSlice(data, lenLen + length)
  return true
}

export function String_ReadUint8LengthPrefixed(
  s: $.VarRef<String> | null,
  out: $.VarRef<String> | null,
): boolean {
  return readLengthPrefixed(s, 1, out)
}

export function String_ReadUint16LengthPrefixed(
  s: $.VarRef<String> | null,
  out: $.VarRef<String> | null,
): boolean {
  return readLengthPrefixed(s, 2, out)
}

export function String_ReadUint24LengthPrefixed(
  s: $.VarRef<String> | null,
  out: $.VarRef<String> | null,
): boolean {
  return readLengthPrefixed(s, 3, out)
}

export function String_ReadBytes(
  s: $.VarRef<String> | null,
  out: $.VarRef<$.Bytes> | null,
  n: number,
): boolean {
  const v = read(s, n)
  if (v == null) {
    return false
  }
  writeRef(out, v)
  return true
}

export function String_CopyBytes(
  s: $.VarRef<String> | null,
  out: $.Bytes,
): boolean {
  if ($.len(out) > $.len(stringValue(s))) {
    return false
  }
  const v = read(s, $.len(out))
  if (v == null) {
    return false
  }
  $.copy(out, v)
  return true
}

export function String_Empty(s: String): boolean {
  return $.len(s) === 0
}

export class BuildError {
  public Err: $.GoError

  constructor(init?: Partial<{ Err: $.GoError }>) {
    this.Err = init?.Err ?? null
  }

  public Error(): string {
    return this.Err == null ? '' : this.Err.Error()
  }
}

export class Builder {
  private err: $.GoError
  private result: number[]
  private fixedSize: boolean
  private capacityLimit: number
  private child: Builder | null
  private offset: number
  private pendingLenLen: number
  private pendingIsASN1: boolean

  constructor(
    init?: Partial<{
      err: $.GoError
      result: $.Bytes
      resultArray: number[]
      fixedSize: boolean
      capacityLimit: number
    }>,
  ) {
    this.err = init?.err ?? null
    this.result = init?.resultArray ?? bytesArray(init?.result)
    this.fixedSize = init?.fixedSize ?? false
    this.capacityLimit =
      init?.capacityLimit ?? (init?.result == null ? this.result.length : $.cap(init.result))
    this.child = null
    this.offset = 0
    this.pendingLenLen = 0
    this.pendingIsASN1 = false
  }

  public SetError(err: $.GoError): void {
    if (this.err == null) {
      this.err = err
    }
  }

  public Bytes(): [$.Bytes, $.GoError] {
    this.flushChild()
    if (this.err != null) {
      return [null as unknown as $.Bytes, this.err]
    }
    if (this.fixedSize && this.result.length !== this.capacityLimit) {
      return [null as unknown as $.Bytes, $.newError('cryptobyte: Builder is not full')]
    }
    return [bytesFromArray(this.result), null]
  }

  public BytesOrPanic(): $.Bytes {
    const [bytes, err] = this.Bytes()
    if (err != null) {
      $.panic(new BuildError({ Err: err }))
    }
    return bytes
  }

  public AddUint8(v: number): void {
    this.add(byte(v))
  }

  public AddUint16(v: number): void {
    this.add(byte(v >> 8), byte(v))
  }

  public AddUint24(v: number): void {
    this.add(byte(v >> 16), byte(v >> 8), byte(v))
  }

  public AddUint32(v: number): void {
    this.add(byte(v / 0x1000000), byte(v >> 16), byte(v >> 8), byte(v))
  }

  public AddUint48(v: number): void {
    this.add(
      byte(Math.floor(v / 0x10000000000)),
      byte(Math.floor(v / 0x100000000)),
      byte(v >> 24),
      byte(v >> 16),
      byte(v >> 8),
      byte(v),
    )
  }

  public AddUint64(v: number): void {
    let value = toUint64BigInt(v)
    const out = new Array<number>(8)
    for (let i = 7; i >= 0; i--) {
      out[i] = byte(value)
      value >>= 8n
    }
    this.add(...out)
  }

  public AddBytes(v: $.Bytes): void {
    this.add(...bytesArray(v))
  }

  public AddUint8LengthPrefixed(f: BuilderContinuation): void {
    this.addLengthPrefixed(1, false, f)
  }

  public AddUint16LengthPrefixed(f: BuilderContinuation): void {
    this.addLengthPrefixed(2, false, f)
  }

  public AddUint24LengthPrefixed(f: BuilderContinuation): void {
    this.addLengthPrefixed(3, false, f)
  }

  public AddUint32LengthPrefixed(f: BuilderContinuation): void {
    this.addLengthPrefixed(4, false, f)
  }

  public AddValue(v: MarshalingValue | null): void {
    if (v == null) {
      this.SetError($.newError('cryptobyte: nil MarshalingValue'))
      return
    }
    this.SetError(v.Marshal(this))
  }

  public Unwrite(n: number): void {
    this.flushChild()
    if (this.err != null) {
      return
    }
    if (n < 0 || n > this.result.length) {
      this.SetError($.newError('cryptobyte: invalid Unwrite'))
      return
    }
    this.result.length -= n
  }

  public AddASN1Int64(v: number): void {
    this.AddASN1Int64WithTag(v, asn1.INTEGER)
  }

  public AddASN1Int64WithTag(v: number, tag: asn1.Tag): void {
    this.addASN1Signed(BigInt(Math.trunc(v)), tag)
  }

  public AddASN1Enum(v: number): void {
    this.addASN1Signed(BigInt(Math.trunc(v)), asn1.ENUM)
  }

  public AddASN1Uint64(v: number): void {
    this.AddASN1(asn1.INTEGER, (child) => {
      child!.add(...encodeASN1Unsigned(toUint64BigInt(v)))
    })
  }

  public AddASN1BigInt(n: unknown): void {
    const value = bigIntValue(n)
    this.AddASN1(asn1.INTEGER, (child) => {
      child!.add(...encodeASN1Signed(value))
    })
  }

  public AddASN1OctetString(bytes: $.Bytes): void {
    this.AddASN1(asn1.OCTET_STRING, (child) => {
      child!.AddBytes(bytes)
    })
  }

  public AddASN1GeneralizedTime(t: time.Time | $.VarRef<time.Time> | null): void {
    const value = $.pointerValue(t)
    this.AddASN1(asn1.GeneralizedTime, (child) => {
      child!.AddBytes(bytesFromString(value.Format('20060102150405Z0700')))
    })
  }

  public AddASN1UTCTime(t: time.Time | $.VarRef<time.Time> | null): void {
    const value = $.pointerValue(t)
    this.AddASN1(asn1.UTCTime, (child) => {
      child!.AddBytes(bytesFromString(value.Format('060102150405Z0700')))
    })
  }

  public AddASN1BitString(bitString: unknown): void {
    const value = pointerValueOrBox(bitString) as {
      Bytes?: $.Bytes
      BitLength?: number
    } | null
    if (value == null) {
      this.SetError($.newError('cryptobyte: nil BitString'))
      return
    }
    const bytes = value.Bytes ?? null
    const bitLength = Math.trunc(value.BitLength ?? 0)
    const paddingBits = (8 - (bitLength % 8)) % 8
    if (
      (bytes == null && bitLength !== 0) ||
      $.len(bytes) * 8 - paddingBits !== bitLength
    ) {
      this.SetError($.newError('cryptobyte: invalid BitString'))
      return
    }
    this.AddASN1(asn1.BIT_STRING, (child) => {
      child!.AddUint8(paddingBits)
      child!.AddBytes(bytes ?? new Uint8Array(0))
    })
  }

  public AddASN1ObjectIdentifier(oid: $.Slice<number> | null): void {
    if (oid == null || $.len(oid) < 2) {
      this.SetError($.newError('cryptobyte: invalid OID'))
      return
    }
    const first = Number((oid as any)[0])
    const second = Number((oid as any)[1])
    if (first > 2 || second >= 40 && first < 2) {
      this.SetError($.newError('cryptobyte: invalid OID'))
      return
    }
    this.AddASN1(asn1.OBJECT_IDENTIFIER, (child) => {
      child!.addBase128Int(first * 40 + second)
      for (let i = 2; i < $.len(oid); i++) {
        child!.addBase128Int(Number((oid as any)[i]))
      }
    })
  }

  public AddASN1Boolean(v: boolean): void {
    this.AddASN1(asn1.BOOLEAN, (child) => {
      child!.AddUint8(v ? 0xff : 0)
    })
  }

  public AddASN1NULL(): void {
    this.add(asn1.NULL, 0)
  }

  public MarshalASN1(_v: unknown): void {
    this.SetError(
      $.newError('cryptobyte: MarshalASN1 is not supported in the js build'),
    )
  }

  public AddASN1(tag: asn1.Tag, f: BuilderContinuation): void {
    this.add(byte(tag))
    this.addLengthPrefixed(1, true, f)
  }

  private addASN1Signed(v: bigint, tag: asn1.Tag): void {
    this.AddASN1(tag, (child) => {
      child!.add(...encodeASN1Signed(v))
    })
  }

  private addBase128Int(v: number): void {
    if (v < 0) {
      this.SetError($.newError('cryptobyte: negative OID component'))
      return
    }
    const out = [byte(v)]
    v = Math.floor(v / 128)
    while (v > 0) {
      out.unshift(byte(v) | 0x80)
      v = Math.floor(v / 128)
    }
    this.add(...out)
  }

  private addLengthPrefixed(
    lenLen: number,
    isASN1: boolean,
    f: BuilderContinuation,
  ): void {
    this.flushChild()
    if (this.err != null) {
      return
    }
    this.offset = this.result.length
    this.pendingLenLen = lenLen
    this.pendingIsASN1 = isASN1
    this.add(...new Array<number>(lenLen).fill(0))
    const child = new Builder({
      err: this.err,
      resultArray: this.result,
      fixedSize: this.fixedSize,
      capacityLimit: this.capacityLimit,
    })
    this.child = child
    try {
      f?.(child)
    } catch (err) {
      const value = $.panicValue(err)
      if (value instanceof BuildError) {
        this.SetError(value.Err)
      } else {
        throw err
      }
    }
    if (this.child === child) {
      this.flushChild()
    }
  }

  private flushChild(): void {
    if (this.child == null) {
      return
    }
    if (this.err == null && this.child.err != null) {
      this.err = this.child.err
    }
    const offset = this.offset
    const lenLen = this.pendingLenLen
    const childStart = offset + lenLen
    const length = this.result.length - childStart
    if (this.err == null) {
      if (this.pendingIsASN1) {
        this.flushASN1Length(offset, length)
      } else {
        const max = 1n << BigInt(lenLen * 8)
        if (BigInt(length) >= max) {
          this.SetError($.newError('cryptobyte: length prefix overflow'))
        } else {
          for (let i = lenLen - 1, value = length; i >= 0; i--) {
            this.result[offset + i] = byte(value)
            value = Math.floor(value / 256)
          }
        }
      }
    }
    this.child = null
  }

  private flushASN1Length(offset: number, length: number): void {
    if (length <= 127) {
      this.result[offset] = length
      return
    }
    const encoded = encodeASN1Length(length)
    const extra = encoded.length - 1
    this.result.push(...new Array<number>(extra).fill(0))
    for (let i = this.result.length - extra - 1; i > offset; i--) {
      this.result[i + extra] = this.result[i]
    }
    for (let i = 0; i < encoded.length; i++) {
      this.result[offset + i] = encoded[i]
    }
  }

  private add(...bytes: number[]): void {
    this.flushChild()
    if (this.err != null) {
      return
    }
    if (this.fixedSize && this.result.length + bytes.length > this.capacityLimit) {
      this.SetError($.newError('cryptobyte: Builder is exceeding its fixed-size buffer'))
      return
    }
    this.result.push(...bytes.map(byte))
  }
}

export function NewBuilder(buffer?: $.Bytes | null): Builder {
  return new Builder({ result: buffer ?? new Uint8Array(0), fixedSize: false })
}

export function NewFixedBuilder(buffer: $.Bytes): Builder {
  return new Builder({
    result: new Uint8Array(0),
    fixedSize: true,
    capacityLimit: $.cap(buffer),
  })
}

function encodeASN1Length(length: number): number[] {
  if (length <= 127) {
    return [length]
  }
  const out: number[] = []
  let value = length
  while (value > 0) {
    out.unshift(byte(value))
    value = Math.floor(value / 256)
  }
  return [0x80 | out.length, ...out]
}

function encodeASN1Unsigned(value: bigint): number[] {
  if (value < 0n || value > maxUint64) {
    return []
  }
  const out = unsignedBytes(value)
  if (out.length === 0) {
    return [0]
  }
  if ((out[0] & 0x80) !== 0) {
    out.unshift(0)
  }
  return out
}

function encodeASN1Signed(value: bigint): number[] {
  if (value >= 0n) {
    const out = unsignedBytes(value)
    if (out.length === 0) {
      return [0]
    }
    if ((out[0] & 0x80) !== 0) {
      out.unshift(0)
    }
    return out
  }
  let byteLen = 1
  while (value < -(1n << BigInt(byteLen * 8 - 1))) {
    byteLen++
  }
  const mod = 1n << BigInt(byteLen * 8)
  return fixedUnsignedBytes(mod + value, byteLen)
}

function unsignedBytes(value: bigint): number[] {
  if (value === 0n) {
    return []
  }
  const out: number[] = []
  while (value > 0n) {
    out.unshift(byte(value))
    value >>= 8n
  }
  return out
}

function fixedUnsignedBytes(value: bigint, byteLen: number): number[] {
  const out = new Array<number>(byteLen)
  for (let i = byteLen - 1; i >= 0; i--) {
    out[i] = byte(value)
    value >>= 8n
  }
  return out
}

function toUint64BigInt(value: number | bigint): bigint {
  if (typeof value === 'bigint') {
    return BigInt.asUintN(64, value)
  }
  if (Number.isSafeInteger(value) && value >= 0) {
    return BigInt(value)
  }
  return BigInt.asUintN(64, BigInt(Math.trunc(value)))
}

function signedBigInt(bytes: $.Bytes): bigint {
  const arr = bytesArray(bytes)
  let value = 0n
  for (const b of arr) {
    value = (value << 8n) | BigInt(b)
  }
  if (arr.length > 0 && (arr[0] & 0x80) !== 0) {
    value -= 1n << BigInt(arr.length * 8)
  }
  return value
}

function unsignedBigInt(bytes: $.Bytes): bigint {
  let value = 0n
  for (const b of bytesArray(bytes)) {
    value = (value << 8n) | BigInt(b)
  }
  return value
}

function checkASN1Integer(bytes: $.Bytes): boolean {
  const arr = bytesArray(bytes)
  if (arr.length === 0) {
    return false
  }
  if (arr.length === 1) {
    return true
  }
  if (arr[0] === 0 && (arr[1] & 0x80) === 0) {
    return false
  }
  if (arr[0] === 0xff && (arr[1] & 0x80) === 0x80) {
    return false
  }
  return true
}

type WriteTarget = {
  typeName: string
  ref: $.VarRef<unknown> | null
  value: unknown
}

function boxedTypeName(value: unknown): string {
  if (value !== null && typeof value === 'object' && '__goType' in value) {
    return globalThis.String((value as { __goType?: unknown }).__goType ?? '')
  }
  return ''
}

function boxedValue(value: unknown): unknown {
  if (value !== null && typeof value === 'object' && '__goValue' in value) {
    return (value as { __goValue: unknown }).__goValue
  }
  return value
}

function writeTarget(out: unknown): WriteTarget {
  const typeName = boxedTypeName(out)
  const value = boxedValue(out)
  if ($.isVarRef(value)) {
    return { typeName, ref: value as $.VarRef<unknown>, value: value.value }
  }
  if ($.isVarRef(out)) {
    return { typeName, ref: out as $.VarRef<unknown>, value: out.value }
  }
  return { typeName, ref: null, value }
}

function pointerValueOrBox(value: unknown): unknown {
  const raw = boxedValue(value)
  if ($.isVarRef(raw)) {
    return raw.value
  }
  return raw
}

function isBigIntType(target: WriteTarget): boolean {
  const typeName = target.typeName.replace(/^\*/, '')
  const value = pointerValueOrBox(target.value)
  return (
    typeName === 'big.Int' ||
    typeName === 'math/big.Int' ||
    (value !== null &&
      typeof value === 'object' &&
      typeof (value as { SetBytes?: unknown }).SetBytes === 'function' &&
      typeof (value as { Sign?: unknown }).Sign === 'function')
  )
}

function integerKind(typeName: string): string {
  return typeName.replace(/^\*/, '')
}

function writeInteger(target: WriteTarget, value: bigint): void {
  const kind = integerKind(target.typeName)
  if (isBigIntType(target)) {
    setBigIntObject(pointerValueOrBox(target.value), value)
    return
  }
  if (target.ref == null) {
    $.panic('out does not point to an integer type')
  }
  switch (kind) {
    case '':
    case 'int':
    case 'int64':
      if (value < minInt64 || value > maxInt64) {
        throw $.newError('cryptobyte: integer overflow')
      }
      target.ref!.value = $.int(value, 64)
      return
    case 'int8':
      if (value < -128n || value > 127n) {
        throw $.newError('cryptobyte: integer overflow')
      }
      target.ref!.value = $.int(value, 8)
      return
    case 'int16':
      if (value < -32768n || value > 32767n) {
        throw $.newError('cryptobyte: integer overflow')
      }
      target.ref!.value = $.int(value, 16)
      return
    case 'int32':
      if (value < -2147483648n || value > 2147483647n) {
        throw $.newError('cryptobyte: integer overflow')
      }
      target.ref!.value = $.int(value, 32)
      return
    case 'uint':
    case 'uint64':
    case 'uintptr':
      if (value < 0n || value > maxUint64) {
        throw $.newError('cryptobyte: integer overflow')
      }
      target.ref!.value = $.uint(value, 64)
      return
    case 'uint8':
    case 'byte':
      if (value < 0n || value > 255n) {
        throw $.newError('cryptobyte: integer overflow')
      }
      target.ref!.value = $.uint(value, 8)
      return
    case 'uint16':
      if (value < 0n || value > 65535n) {
        throw $.newError('cryptobyte: integer overflow')
      }
      target.ref!.value = $.uint(value, 16)
      return
    case 'uint32':
      if (value < 0n || value > 4294967295n) {
        throw $.newError('cryptobyte: integer overflow')
      }
      target.ref!.value = $.uint(value, 32)
      return
    default:
      throw $.newError(
        'cryptobyte: ReadASN1Integer of a named integer type is not supported in the js build',
      )
  }
}

function integerDefaultValue(defaultValue: unknown): bigint {
  const raw = boxedValue(defaultValue)
  if (typeof raw === 'bigint') {
    return raw
  }
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return BigInt(Math.trunc(raw))
  }
  if (raw !== null && typeof raw === 'object') {
    return bigIntValue(raw)
  }
  throw $.newError(
    'cryptobyte: ReadOptionalASN1Integer default of a named integer type is not supported in the js build',
  )
}

function setBigIntObject(target: unknown, value: bigint): void {
  if (target == null || typeof target !== 'object') {
    $.panic('out does not point to an integer type')
  }
  const big = target as {
    SetBytes?: (bytes: $.Bytes) => unknown
    SetInt64?: (value: number) => unknown
    Neg?: (value: unknown) => unknown
    value?: bigint
  }
  if ('value' in big) {
    big.value = value
    return
  }
  const magnitude = bytesFromArray(unsignedBytes(value < 0n ? -value : value))
  if (typeof big.SetBytes === 'function') {
    big.SetBytes(magnitude)
    if (value < 0n) {
      if (typeof big.Neg !== 'function') {
        throw $.newError(
          'cryptobyte: big.Int negative assignment is not supported in the js build',
        )
      }
      big.Neg(big)
    }
    return
  }
  if (typeof big.SetInt64 === 'function') {
    big.SetInt64(Number(value))
    return
  }
  throw $.newError('cryptobyte: unsupported big.Int representation')
}

function bigIntValue(value: unknown): bigint {
  const raw = pointerValueOrBox(value)
  if (typeof raw === 'bigint') {
    return raw
  }
  if (typeof raw === 'number') {
    return BigInt(Math.trunc(raw))
  }
  if (raw !== null && typeof raw === 'object') {
    const big = raw as {
      value?: bigint | number
      Sign?: () => number
      Bytes?: () => $.Bytes
      String?: () => string
    }
    if (typeof big.value === 'bigint') {
      return big.value
    }
    if (typeof big.value === 'number') {
      return BigInt(Math.trunc(big.value))
    }
    if (typeof big.Sign === 'function' && typeof big.Bytes === 'function') {
      const sign = big.Sign()
      const mag = unsignedBigInt(big.Bytes())
      return sign < 0 ? -mag : mag
    }
    if (typeof big.String === 'function') {
      return BigInt(big.String())
    }
  }
  throw $.newError('cryptobyte: unsupported big.Int representation')
}

function readASN1Bytes(
  s: $.VarRef<String> | null,
  tag: asn1.Tag,
): $.Bytes | null {
  const bytes = $.varRef<String>(new Uint8Array(0))
  if (!String_ReadASN1(s, bytes, tag)) {
    return null
  }
  return bytes.value
}

function readASN1SignedInteger(
  s: $.VarRef<String> | null,
  tag: asn1.Tag,
): bigint | null {
  const bytes = readASN1Bytes(s, tag)
  if (bytes == null || !checkASN1Integer(bytes)) {
    return null
  }
  return signedBigInt(bytes)
}

function readASN1UnsignedInteger(
  s: $.VarRef<String> | null,
  tag: asn1.Tag,
): bigint | null {
  const bytes = readASN1Bytes(s, tag)
  if (
    bytes == null ||
    !checkASN1Integer(bytes) ||
    ($.len(bytes) > 0 && (bytesArray(bytes)[0] & 0x80) !== 0)
  ) {
    return null
  }
  return unsignedBigInt(bytes)
}

export function String_ReadASN1Boolean(
  s: $.VarRef<String> | null,
  out: $.VarRef<boolean> | null,
): boolean {
  const bytes = readASN1Bytes(s, asn1.BOOLEAN)
  const arr = bytesArray(bytes)
  if (bytes == null || arr.length !== 1 || (arr[0] !== 0 && arr[0] !== 0xff)) {
    return false
  }
  writeRef(out, arr[0] === 0xff)
  return true
}

export function String_ReadASN1Integer(
  s: $.VarRef<String> | null,
  out: unknown,
): boolean {
  const target = writeTarget(out)
  const bytes = readASN1Bytes(s, asn1.INTEGER)
  if (bytes == null || !checkASN1Integer(bytes)) {
    return false
  }
  const value = signedBigInt(bytes)
  writeInteger(target, value)
  return true
}

export function String_ReadASN1Int64WithTag(
  s: $.VarRef<String> | null,
  out: $.VarRef<number> | null,
  tag: asn1.Tag,
): boolean {
  const value = readASN1SignedInteger(s, tag)
  if (value == null || value < minInt64 || value > maxInt64) {
    return false
  }
  writeRef(out, $.int(value, 64))
  return true
}

export function String_ReadASN1Enum(
  s: $.VarRef<String> | null,
  out: $.VarRef<number> | null,
): boolean {
  const value = readASN1SignedInteger(s, asn1.ENUM)
  if (value == null || value < minInt64 || value > maxInt64) {
    return false
  }
  writeRef(out, $.int(value, 64))
  return true
}

export function String_ReadASN1ObjectIdentifier(
  s: $.VarRef<String> | null,
  out: $.VarRef<$.Slice<number> | null> | null,
): boolean {
  const bytes = readASN1Bytes(s, asn1.OBJECT_IDENTIFIER)
  const arr = bytesArray(bytes)
  if (bytes == null || arr.length === 0) {
    return false
  }
  const oid: number[] = []
  let offset = 0
  const firstRead = readBase128Int(arr, offset)
  if (firstRead == null) {
    return false
  }
  offset = firstRead.next
  if (firstRead.value < 80) {
    oid.push(Math.floor(firstRead.value / 40), firstRead.value % 40)
  } else {
    oid.push(2, firstRead.value - 80)
  }
  while (offset < arr.length) {
    const part = readBase128Int(arr, offset)
    if (part == null) {
      return false
    }
    offset = part.next
    oid.push(part.value)
  }
  writeRef(out, $.arrayToSlice(oid))
  return true
}

export function String_ReadASN1GeneralizedTime(
  s: $.VarRef<String> | null,
  out: $.VarRef<time.Time> | null,
): boolean {
  const bytes = readASN1Bytes(s, asn1.GeneralizedTime)
  if (bytes == null) {
    return false
  }
  const parsed = parseGeneralizedTime(bytesToAscii(bytes))
  if (parsed == null) {
    return false
  }
  writeRef(out, parsed)
  return true
}

export function String_ReadASN1UTCTime(
  s: $.VarRef<String> | null,
  out: $.VarRef<time.Time> | null,
): boolean {
  const bytes = readASN1Bytes(s, asn1.UTCTime)
  if (bytes == null) {
    return false
  }
  const parsed = parseUTCTime(bytesToAscii(bytes))
  if (parsed == null) {
    return false
  }
  writeRef(out, parsed)
  return true
}

export function String_ReadASN1BitString(
  s: $.VarRef<String> | null,
  out: unknown,
): boolean {
  const bytes = readASN1Bytes(s, asn1.BIT_STRING)
  const parsed = parseBitString(bytes)
  if (parsed == null) {
    return false
  }
  const target = pointerValueOrBox(out) as {
    Bytes?: $.Bytes
    BitLength?: number
  } | null
  if (target == null) {
    throw new Error(
      'runtime error: invalid memory address or nil pointer dereference',
    )
  }
  target.Bytes = parsed.bytes
  target.BitLength = parsed.bitLength
  return true
}

export function String_ReadASN1BitStringAsBytes(
  s: $.VarRef<String> | null,
  out: $.VarRef<$.Bytes> | null,
  paddingBits: $.VarRef<number> | null,
): boolean {
  const bytes = readASN1Bytes(s, asn1.BIT_STRING)
  const parsed = parseBitString(bytes)
  if (parsed == null) {
    return false
  }
  writeRef(out, parsed.bytes)
  writeRef(paddingBits, parsed.paddingBits)
  return true
}

export function String_ReadASN1Bytes(
  s: $.VarRef<String> | null,
  out: $.VarRef<$.Bytes> | null,
  tag: asn1.Tag,
): boolean {
  return String_ReadASN1(s, out as $.VarRef<String> | null, tag)
}

export function String_ReadASN1(
  s: $.VarRef<String> | null,
  out: $.VarRef<String> | null,
  tag: asn1.Tag,
): boolean {
  return readASN1(s, out, null, tag, true)
}

export function String_ReadASN1Element(
  s: $.VarRef<String> | null,
  out: $.VarRef<String> | null,
  tag: asn1.Tag,
): boolean {
  return readASN1(s, out, null, tag, false)
}

export function String_ReadAnyASN1(
  s: $.VarRef<String> | null,
  out: $.VarRef<String> | null,
  outTag: $.VarRef<asn1.Tag> | null,
): boolean {
  return readASN1(s, out, outTag, null, true)
}

export function String_ReadAnyASN1Element(
  s: $.VarRef<String> | null,
  out: $.VarRef<String> | null,
  outTag: $.VarRef<asn1.Tag> | null,
): boolean {
  return readASN1(s, out, outTag, null, false)
}

export function String_PeekASN1Tag(s: String, tag: asn1.Tag): boolean {
  const parsed = parseASN1(s)
  return parsed !== null && parsed.tag === tag
}

export function String_SkipASN1(
  s: $.VarRef<String> | null,
  tag: asn1.Tag,
): boolean {
  const out = $.varRef<String>(new Uint8Array(0))
  return String_ReadASN1Element(s, out, tag)
}

export function String_ReadOptionalASN1(
  s: $.VarRef<String> | null,
  out: $.VarRef<String> | null,
  tag: asn1.Tag,
  defaultValue: String,
): boolean {
  if (!String_PeekASN1Tag(stringValue(s), tag)) {
    writeRef(out, defaultValue)
    return true
  }
  return String_ReadASN1(s, out, tag)
}

export function String_SkipOptionalASN1(
  s: $.VarRef<String> | null,
  tag: asn1.Tag,
): boolean {
  if (!String_PeekASN1Tag(stringValue(s), tag)) {
    return true
  }
  return String_SkipASN1(s, tag)
}

export function String_ReadOptionalASN1Integer(
  s: $.VarRef<String> | null,
  out: unknown,
  tag: asn1.Tag,
  defaultValue: unknown,
): boolean {
  if (!String_PeekASN1Tag(stringValue(s), tag)) {
    writeInteger(writeTarget(out), integerDefaultValue(defaultValue))
    return true
  }
  return String_ReadASN1Integer(s, out)
}

export function String_ReadOptionalASN1OctetString(
  s: $.VarRef<String> | null,
  out: $.VarRef<$.Bytes> | null,
  tag: asn1.Tag,
  defaultValue: $.Bytes,
): boolean {
  if (!String_PeekASN1Tag(stringValue(s), tag)) {
    writeRef(out, defaultValue)
    return true
  }
  return String_ReadASN1Bytes(s, out, tag)
}

export function String_ReadOptionalASN1Boolean(
  s: $.VarRef<String> | null,
  out: $.VarRef<boolean> | null,
  tag: asn1.Tag,
  defaultValue: boolean,
): boolean {
  if (!String_PeekASN1Tag(stringValue(s), tag)) {
    writeRef(out, defaultValue)
    return true
  }
  return String_ReadASN1Boolean(s, out)
}

type ParsedASN1 = {
  tag: asn1.Tag
  headerLen: number
  length: number
  totalLen: number
}

function parseASN1(data: $.Bytes): ParsedASN1 | null {
  const arr = bytesArray(data)
  if (arr.length < 2 || (arr[0] & 0x1f) === 0x1f) {
    return null
  }
  const tag = arr[0]
  let headerLen = 2
  let length = arr[1]
  if ((length & 0x80) !== 0) {
    const lenLen = length & 0x7f
    if (lenLen === 0 || lenLen > 4 || arr.length < 2 + lenLen) {
      return null
    }
    if (arr[2] === 0) {
      return null
    }
    length = 0
    for (let i = 0; i < lenLen; i++) {
      length = length * 256 + arr[2 + i]
    }
    if (length < 128) {
      return null
    }
    headerLen += lenLen
  }
  const totalLen = headerLen + length
  if (arr.length < totalLen) {
    return null
  }
  return { tag, headerLen, length, totalLen }
}

function readASN1(
  s: $.VarRef<String> | null,
  out: $.VarRef<String> | null,
  outTag: $.VarRef<asn1.Tag> | null,
  expectedTag: asn1.Tag | null,
  skipHeader: boolean,
): boolean {
  const data = stringValue(s)
  const parsed = parseASN1(data)
  if (parsed == null || (expectedTag !== null && parsed.tag !== expectedTag)) {
    return false
  }
  if (outTag != null) {
    outTag.value = parsed.tag
  }
  if (out != null) {
    out.value = skipHeader
      ? $.goSlice(data, parsed.headerLen, parsed.totalLen)
      : $.goSlice(data, 0, parsed.totalLen)
  }
  s!.value = $.goSlice(data, parsed.totalLen)
  return true
}

function parseBitString(bytes: $.Bytes | null): {
  bytes: $.Bytes
  paddingBits: number
  bitLength: number
} | null {
  const arr = bytesArray(bytes)
  if (bytes == null || arr.length === 0) {
    return null
  }
  const paddingBits = arr[0]
  if (paddingBits > 7 || (arr.length === 1 && paddingBits !== 0)) {
    return null
  }
  if (
    arr.length > 1 &&
    paddingBits > 0 &&
    (arr[arr.length - 1] & ((1 << paddingBits) - 1)) !== 0
  ) {
    return null
  }
  const content = bytesFromArray(arr.slice(1))
  return {
    bytes: content,
    paddingBits,
    bitLength: $.len(content) * 8 - paddingBits,
  }
}

function readBase128Int(
  bytes: number[],
  offset: number,
): { value: number; next: number } | null {
  let ret = 0
  for (let i = offset; i < bytes.length; i++) {
    const b = bytes[i]
    if (ret === 0 && b === 0x80) {
      return null
    }
    ret = ret * 128 + (b & 0x7f)
    if (ret > Number.MAX_SAFE_INTEGER) {
      return null
    }
    if ((b & 0x80) === 0) {
      return { value: ret, next: i + 1 }
    }
  }
  return null
}

function parseFixedDigits(value: string, offset: number, width: number): number | null {
  const text = value.slice(offset, offset + width)
  if (!new RegExp(`^[0-9]{${width}}$`).test(text)) {
    return null
  }
  return Number(text)
}

function parseZone(value: string, offset: number): { offsetMinutes: number } | null {
  if (value[offset] === 'Z' && offset + 1 === value.length) {
    return { offsetMinutes: 0 }
  }
  const sign = value[offset]
  if ((sign !== '+' && sign !== '-') || offset + 5 !== value.length) {
    return null
  }
  const hour = parseFixedDigits(value, offset + 1, 2)
  const minute = parseFixedDigits(value, offset + 3, 2)
  if (hour == null || minute == null || hour > 23 || minute > 59) {
    return null
  }
  const offsetMinutes = hour * 60 + minute
  return { offsetMinutes: sign === '+' ? offsetMinutes : -offsetMinutes }
}

function makeTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  offsetMinutes: number,
): time.Time {
  const millis =
    globalThis.Date.UTC(year, month - 1, day, hour, minute, second) -
    offsetMinutes * 60 * 1000
  return time.Unix(Math.floor(millis / 1000), 0)
}

function parseGeneralizedTime(value: string): time.Time | null {
  if (value.length < 15) {
    return null
  }
  const year = parseFixedDigits(value, 0, 4)
  const month = parseFixedDigits(value, 4, 2)
  const day = parseFixedDigits(value, 6, 2)
  const hour = parseFixedDigits(value, 8, 2)
  const minute = parseFixedDigits(value, 10, 2)
  const second = parseFixedDigits(value, 12, 2)
  const zone = parseZone(value, 14)
  if (
    year == null ||
    month == null ||
    day == null ||
    hour == null ||
    minute == null ||
    second == null ||
    zone == null
  ) {
    return null
  }
  return makeTime(year, month, day, hour, minute, second, zone.offsetMinutes)
}

function parseUTCTime(value: string): time.Time | null {
  if (value.length !== 11 && value.length !== 13 && value.length !== 15 && value.length !== 17) {
    return null
  }
  const yearPart = parseFixedDigits(value, 0, 2)
  const month = parseFixedDigits(value, 2, 2)
  const day = parseFixedDigits(value, 4, 2)
  const hour = parseFixedDigits(value, 6, 2)
  const minute = parseFixedDigits(value, 8, 2)
  let second = 0
  let zoneOffset = 10
  if (value.length === 13 || value.length === 17) {
    const parsedSecond = parseFixedDigits(value, 10, 2)
    if (parsedSecond == null) {
      return null
    }
    second = parsedSecond
    zoneOffset = 12
  }
  const zone = parseZone(value, zoneOffset)
  if (
    yearPart == null ||
    month == null ||
    day == null ||
    hour == null ||
    minute == null ||
    zone == null
  ) {
    return null
  }
  const year = yearPart >= 50 ? 1900 + yearPart : 2000 + yearPart
  return makeTime(year, month, day, hour, minute, second, zone.offsetMinutes)
}

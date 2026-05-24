import * as $ from '@goscript/builtin/index.js'
import * as io from '@goscript/io/index.js'

const base32alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const maxGetRandomValuesBytes = 65536

class RandError {
  constructor(private readonly message: string) {}

  Error(): string {
    return this.message
  }
}

class WebCryptoReader implements io.Reader {
  Read(p: $.Bytes): [number, $.GoError] {
    const err = fillSecureBytes(p)
    if (err != null) {
      return [0, err]
    }
    return [$.len(p), null]
  }
}

export let Reader: io.Reader = new WebCryptoReader()

export function Read(b: $.Bytes): [number, $.GoError] {
  const [n, err] = Reader.Read(b)
  if (err != null) {
    return [n, err]
  }
  if (n !== $.len(b)) {
    return [n, io.ErrUnexpectedEOF]
  }
  return [n, null]
}

export function Int(rand: io.Reader | null, max: any): [any, $.GoError] {
  if (max == null || typeof max.Sign !== 'function' || max.Sign() <= 0) {
    return [null, new RandError('crypto/rand: argument to Int is <= 0')]
  }

  const bitLen = max.BitLen()
  const byteLen = Math.ceil(bitLen / 8)
  const excessBits = byteLen * 8 - bitLen
  const reader = rand ?? Reader

  while (true) {
    const bytes = new Uint8Array(byteLen)
    const [n, err] = reader.Read(bytes)
    if (err != null) {
      return [null, err]
    }
    if (n !== byteLen) {
      return [null, io.ErrUnexpectedEOF]
    }
    if (excessBits > 0) {
      bytes[0] &= 0xff >>> excessBits
    }

    const candidate = new max.constructor()
    candidate.SetBytes(bytes)
    if (candidate.Cmp(max) < 0) {
      return [candidate, null]
    }
  }
}

export async function Prime(
  rand: io.Reader | null,
  bits: number,
): Promise<[any, $.GoError]> {
  if (bits < 2) {
    return [null, new RandError('crypto/rand: prime size must be at least 2-bit')]
  }

  const bitOffset = bits % 8
  const topBits = bitOffset === 0 ? 8 : bitOffset
  const bytes = new Uint8Array(Math.ceil(bits / 8))
  const reader = rand ?? Reader

  while (true) {
    const err = readFull(reader, bytes)
    if (err != null) {
      return [null, err]
    }

    bytes[0] &= (1 << topBits) - 1
    if (topBits >= 2) {
      bytes[0] |= 3 << (topBits - 2)
    } else {
      bytes[0] |= 1
      if (bytes.length > 1) {
        bytes[1] |= 0x80
      }
    }
    bytes[bytes.length - 1] |= 1

    const candidate = newBigInt()
    candidate.SetBytes(bytes)
    if (await candidate.ProbablyPrime(20)) {
      return [candidate, null]
    }
  }
}

export function Text(): string {
  const src = new Uint8Array(26)
  const [, err] = Read(src)
  if (err != null) {
    throw new Error(err.Error())
  }

  let out = ''
  for (const b of src) {
    out += base32alphabet[b % 32]
  }
  return out
}

function newBigInt(): any {
  const info = $.getTypeByName('big.Int') as
    | { zeroValue?: unknown; ctor?: new () => unknown }
    | undefined
  if (info?.zeroValue !== undefined) {
    return typeof info.zeroValue === 'function'
      ? (info.zeroValue as () => unknown)()
      : info.zeroValue
  }
  if (info?.ctor != null) {
    return new info.ctor()
  }
  throw new Error('crypto/rand: math/big.Int type is not registered')
}

function readFull(reader: io.Reader, dst: Uint8Array): $.GoError {
  let offset = 0
  while (offset < dst.length) {
    const chunk = dst.subarray(offset)
    const [n, err] = reader.Read(chunk)
    if (err != null) {
      return err
    }
    if (n <= 0) {
      return io.ErrUnexpectedEOF
    }
    offset += n
  }
  return null
}

function fillSecureBytes(dst: $.Bytes): $.GoError {
  const length = $.len(dst)
  if (length === 0) {
    return null
  }

  const crypto = secureCrypto()
  if (crypto == null) {
    return new RandError(
      'crypto/rand: Web Crypto getRandomValues is unavailable',
    )
  }

  if (dst instanceof Uint8Array) {
    fillUint8Array(crypto, dst)
    return null
  }

  const tmp = new Uint8Array(length)
  fillUint8Array(crypto, tmp)
  $.copy(dst, tmp)
  return null
}

function fillUint8Array(crypto: Crypto, dst: Uint8Array): void {
  for (let offset = 0; offset < dst.length; offset += maxGetRandomValuesBytes) {
    const chunk = dst.subarray(
      offset,
      Math.min(offset + maxGetRandomValuesBytes, dst.length),
    ) as Uint8Array<ArrayBuffer>
    crypto.getRandomValues(chunk)
  }
}

function secureCrypto(): Crypto | null {
  const crypto = globalThis.crypto
  if (crypto && typeof crypto.getRandomValues === 'function') {
    return crypto
  }
  return null
}

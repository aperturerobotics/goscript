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

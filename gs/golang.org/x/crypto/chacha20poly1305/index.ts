import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import {
  chacha20poly1305 as nobleChaCha20Poly1305,
  xchacha20poly1305 as nobleXChaCha20Poly1305,
} from '@noble/ciphers/chacha.js'

export const KeySize = 32
export const NonceSize = 12
export const NonceSizeX = 24
export const Overhead = 16

const maxIETFPlaintext = 2 ** 38 - 64
const maxIETFCiphertext = 2 ** 38 - 48

type NobleAEAD = typeof nobleChaCha20Poly1305 | typeof nobleXChaCha20Poly1305

export let errOpen: $.GoError = errors.New(
  'chacha20poly1305: message authentication failed',
)

export function __goscript_set_errOpen(value: $.GoError): void {
  errOpen = value
}

export interface AEAD {
  NonceSize(): number
  Overhead(): number
  Seal(
    dst: $.Slice<number>,
    nonce: $.Slice<number>,
    plaintext: $.Slice<number>,
    additionalData: $.Slice<number>,
  ): $.Slice<number>
  Open(
    dst: $.Slice<number>,
    nonce: $.Slice<number>,
    ciphertext: $.Slice<number>,
    additionalData: $.Slice<number>,
  ): [$.Slice<number>, $.GoError]
}

export class chacha20poly1305 implements AEAD {
  readonly key: Uint8Array

  constructor(key: Uint8Array) {
    this.key = key.slice()
  }

  NonceSize(): number {
    return NonceSize
  }

  Overhead(): number {
    return Overhead
  }

  Seal(
    dst: $.Slice<number>,
    nonce: $.Slice<number>,
    plaintext: $.Slice<number>,
    additionalData: $.Slice<number>,
  ): $.Slice<number> {
    return seal(
      dst,
      nobleChaCha20Poly1305,
      this.key,
      nonce,
      NonceSize,
      plaintext,
      additionalData,
    )
  }

  Open(
    dst: $.Slice<number>,
    nonce: $.Slice<number>,
    ciphertext: $.Slice<number>,
    additionalData: $.Slice<number>,
  ): [$.Slice<number>, $.GoError] {
    return open(
      dst,
      nobleChaCha20Poly1305,
      this.key,
      nonce,
      NonceSize,
      ciphertext,
      additionalData,
    )
  }
}

export class xchacha20poly1305 implements AEAD {
  readonly key: Uint8Array

  constructor(key: Uint8Array) {
    this.key = key.slice()
  }

  NonceSize(): number {
    return NonceSizeX
  }

  Overhead(): number {
    return Overhead
  }

  Seal(
    dst: $.Slice<number>,
    nonce: $.Slice<number>,
    plaintext: $.Slice<number>,
    additionalData: $.Slice<number>,
  ): $.Slice<number> {
    return seal(
      dst,
      nobleXChaCha20Poly1305,
      this.key,
      nonce,
      NonceSizeX,
      plaintext,
      additionalData,
    )
  }

  Open(
    dst: $.Slice<number>,
    nonce: $.Slice<number>,
    ciphertext: $.Slice<number>,
    additionalData: $.Slice<number>,
  ): [$.Slice<number>, $.GoError] {
    return open(
      dst,
      nobleXChaCha20Poly1305,
      this.key,
      nonce,
      NonceSizeX,
      ciphertext,
      additionalData,
    )
  }
}

export function New(key: $.Slice<number>): [AEAD | null, $.GoError] {
  const keyBytes = bytes(key)
  if (keyBytes.length !== KeySize) {
    return [null, errors.New('chacha20poly1305: bad key length')]
  }
  return [
    $.interfaceValue<AEAD | null>(
      new chacha20poly1305(keyBytes),
      '*chacha20poly1305.chacha20poly1305',
    ),
    null,
  ]
}

export function NewX(key: $.Slice<number>): [AEAD | null, $.GoError] {
  const keyBytes = bytes(key)
  if (keyBytes.length !== KeySize) {
    return [null, errors.New('chacha20poly1305: bad key length')]
  }
  return [
    $.interfaceValue<AEAD | null>(
      new xchacha20poly1305(keyBytes),
      '*chacha20poly1305.xchacha20poly1305',
    ),
    null,
  ]
}

function seal(
  dst: $.Slice<number>,
  cipher: NobleAEAD,
  key: Uint8Array,
  nonce: $.Slice<number>,
  expectedNonceSize: number,
  plaintext: $.Slice<number>,
  additionalData: $.Slice<number>,
): $.Slice<number> {
  const nonceBytes = bytes(nonce)
  if (nonceBytes.length !== expectedNonceSize) {
    $.panic('chacha20poly1305: bad nonce length passed to Seal')
  }
  const plaintextBytes = bytes(plaintext)
  if (plaintextBytes.length > maxIETFPlaintext) {
    $.panic('chacha20poly1305: plaintext too large')
  }

  const sealed = cipher(key, nonceBytes, bytes(additionalData)).encrypt(
    plaintextBytes,
  )
  return appendBytes(dst, sealed)
}

function open(
  dst: $.Slice<number>,
  cipher: NobleAEAD,
  key: Uint8Array,
  nonce: $.Slice<number>,
  expectedNonceSize: number,
  ciphertext: $.Slice<number>,
  additionalData: $.Slice<number>,
): [$.Slice<number>, $.GoError] {
  const nonceBytes = bytes(nonce)
  if (nonceBytes.length !== expectedNonceSize) {
    $.panic('chacha20poly1305: bad nonce length passed to Open')
  }
  const ciphertextBytes = bytes(ciphertext)
  if (ciphertextBytes.length < Overhead) {
    return [null, errOpen]
  }
  if (ciphertextBytes.length > maxIETFCiphertext) {
    $.panic('chacha20poly1305: ciphertext too large')
  }

  try {
    return [
      appendBytes(
        dst,
        cipher(key, nonceBytes, bytes(additionalData)).decrypt(ciphertextBytes),
      ),
      null,
    ]
  } catch {
    return [null, errOpen]
  }
}

function bytes(value: $.Slice<number>): Uint8Array {
  return $.bytesToUint8Array(value).slice()
}

function appendBytes(
  dst: $.Slice<number>,
  suffix: Uint8Array,
): $.Slice<number> {
  const prefix = $.bytesToUint8Array(dst)
  if (prefix.length === 0) {
    return suffix.slice()
  }
  const out = new Uint8Array(prefix.length + suffix.length)
  out.set(prefix)
  out.set(suffix, prefix.length)
  return out
}

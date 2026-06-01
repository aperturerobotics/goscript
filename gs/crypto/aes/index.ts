import * as $ from '@goscript/builtin/index.js'
import type * as cipher from '@goscript/crypto/cipher/index.js'
import { ecb } from '@noble/ciphers/aes.js'

export const BlockSize = 16

export type KeySizeError = number

export class AESBlock implements cipher.Block {
  private keyPromise: Promise<CryptoKey> | null = null

  constructor(private readonly key: Uint8Array) {}

  BlockSize(): number {
    return BlockSize
  }

  Encrypt(dst: $.Bytes, src: $.Bytes): void {
    const srcBytes = $.bytesToUint8Array(src)
    if (srcBytes.length < BlockSize) {
      $.panic('crypto/aes: input not full block')
    }
    if ($.len(dst) < BlockSize) {
      $.panic('crypto/aes: output not full block')
    }
    const out = ecb(this.key, { disablePadding: true }).encrypt(
      srcBytes.subarray(0, BlockSize),
    )
    $.copy(dst as Uint8Array, out)
  }

  Decrypt(dst: $.Bytes, src: $.Bytes): void {
    const srcBytes = $.bytesToUint8Array(src)
    if (srcBytes.length < BlockSize) {
      $.panic('crypto/aes: input not full block')
    }
    if ($.len(dst) < BlockSize) {
      $.panic('crypto/aes: output not full block')
    }
    const out = ecb(this.key, { disablePadding: true }).decrypt(
      srcBytes.subarray(0, BlockSize),
    )
    $.copy(dst as Uint8Array, out)
  }

  async webCryptoKey(): Promise<CryptoKey> {
    this.keyPromise ??= subtleCrypto().importKey(
      'raw',
      this.key as unknown as BufferSource,
      'AES-GCM',
      false,
      ['encrypt', 'decrypt'],
    )
    return this.keyPromise
  }
}

export function KeySizeError_Error(k: KeySizeError): string {
  return `crypto/aes: invalid key size ${k}`
}

export function NewCipher(key: $.Bytes): [cipher.Block | null, $.GoError] {
  const k = $.len(key)
  if (k !== 16 && k !== 24 && k !== 32) {
    return [null, $.newError(KeySizeError_Error(k))]
  }
  return [new AESBlock($.bytesToUint8Array(key).slice()), null]
}

function subtleCrypto(): SubtleCrypto {
  const subtle = globalThis.crypto?.subtle
  if (subtle == null) {
    throw new Error('crypto/aes: WebCrypto AES-GCM is unavailable')
  }
  return subtle
}

import { describe, expect, test } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as cipher from '@goscript/crypto/cipher/index.js'

import { BlockSize, KeySizeError_Error, NewCipher } from './index.js'

describe('crypto/aes WebCrypto override', () => {
  test.each([
    [
      'AES-128',
      '000102030405060708090a0b0c0d0e0f',
      '00112233445566778899aabbccddeeff',
      '69c4e0d86a7b0430d8cdb78070b4c55a',
    ],
    [
      'AES-192',
      '000102030405060708090a0b0c0d0e0f1011121314151617',
      '00112233445566778899aabbccddeeff',
      'dda97ca4864cdfe06eaf70a0ec0d7191',
    ],
    [
      'AES-256',
      '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f',
      '00112233445566778899aabbccddeeff',
      '8ea2b7ca516745bfeafc49904b496089',
    ],
  ])(
    'encrypts and decrypts a raw %s block',
    (_name, key, plaintext, ciphertext) => {
      const [block, err] = NewCipher(hex(key))
      expect(err).toBeNull()

      const encrypted = new Uint8Array(BlockSize)
      block!.Encrypt(encrypted, hex(plaintext))
      expect(toHex(encrypted)).toBe(ciphertext)

      const decrypted = new Uint8Array(BlockSize)
      block!.Decrypt(decrypted, encrypted)
      expect(toHex(decrypted)).toBe(plaintext)
    },
  )

  test('seals and opens the NIST AES-256-GCM vector', async () => {
    const [block, blockErr] = NewCipher(
      hex('0000000000000000000000000000000000000000000000000000000000000000'),
    )
    expect(blockErr).toBeNull()
    expect(block?.BlockSize()).toBe(BlockSize)

    const [aead, aeadErr] = cipher.NewGCM(block)
    expect(aeadErr).toBeNull()
    expect(aead?.NonceSize()).toBe(12)
    expect(aead?.Overhead()).toBe(16)

    const sealed = await aead!.Seal(
      null,
      hex('000000000000000000000000'),
      hex('00000000000000000000000000000000'),
      null,
    )
    expect(toHex(sealed)).toBe(
      'cea7403d4d606b6e074ec5d3baf39d18d0d1c8a799996bf0265b98b5d48ab919',
    )

    const [opened, openErr] = await aead!.Open(
      $.stringToBytes('prefix:'),
      hex('000000000000000000000000'),
      sealed,
      null,
    )
    expect(openErr).toBeNull()
    expect(toHex(opened)).toBe(
      toHex($.stringToBytes('prefix:')) + '00000000000000000000000000000000',
    )
  })

  test('rejects tampered ciphertext', async () => {
    const [block] = NewCipher(
      hex('0000000000000000000000000000000000000000000000000000000000000000'),
    )
    const [aead] = cipher.NewGCM(block)
    const sealed = await aead!.Seal(
      null,
      hex('000000000000000000000000'),
      $.stringToBytes('hello'),
      $.stringToBytes('aad'),
    )
    sealed![0] ^= 1

    const [opened, openErr] = await aead!.Open(
      null,
      hex('000000000000000000000000'),
      sealed,
      $.stringToBytes('aad'),
    )
    expect(opened).toBeNull()
    expect(openErr?.Error()).toBe('cipher: message authentication failed')
  })

  test('rejects invalid key lengths', () => {
    const [block, err] = NewCipher(new Uint8Array(31))
    expect(block).toBeNull()
    expect(err?.Error()).toBe(KeySizeError_Error(31))
  })
})

function hex(input: string): Uint8Array {
  const out = new Uint8Array(input.length / 2)
  for (let idx = 0; idx < out.length; idx++) {
    out[idx] = Number.parseInt(input.slice(idx * 2, idx * 2 + 2), 16)
  }
  return out
}

function toHex(input: Uint8Array | number[] | null): string {
  return Array.from(input ?? [])
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
}

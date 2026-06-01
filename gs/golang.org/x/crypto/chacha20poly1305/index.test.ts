import { describe, expect, test } from 'vitest'

import { New, NewX, NonceSize, NonceSizeX, Overhead } from './index.js'

describe('chacha20poly1305 override', () => {
  test('matches the RFC 8439 ChaCha20-Poly1305 AEAD vector', () => {
    const [aead, err] = New(
      hex('808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9f'),
    )
    expect(err).toBeNull()
    expect(aead?.NonceSize()).toBe(NonceSize)
    expect(aead?.Overhead()).toBe(Overhead)

    const nonce = hex('070000004041424344454647')
    const aad = hex('50515253c0c1c2c3c4c5c6c7')
    const plaintext = hex(
      '4c616469657320616e642047656e746c656d656e206f662074686520636c617373206f66202739393a204966204920636f756c64206f6666657220796f75206f6e6c79206f6e652074697020666f7220746865206675747572652c2073756e73637265656e20776f756c642062652069742e',
    )
    const sealed = aead!.Seal(null, nonce, plaintext, aad)
    expect(toHex(sealed)).toBe(
      'd31a8d34648e60db7b86afbc53ef7ec2a4aded51296e08fea9e2b5a736ee62d63dbea45e8ca9671282fafb69da92728b1a71de0a9e060b2905d6a5b67ecd3b3692ddbd7f2d778b8c9803aee328091b58fab324e4fad675945585808b4831d7bc3ff4def08e4b7a9de576d26586cec64b61161ae10b594f09e26a7e902ecbd0600691',
    )

    const [opened, openErr] = aead!.Open(null, nonce, sealed, aad)
    expect(openErr).toBeNull()
    expect(toHex(opened)).toBe(toHex(plaintext))
  })

  test('rejects tampered ciphertexts', () => {
    const [aead, err] = New(
      hex('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f'),
    )
    expect(err).toBeNull()
    const sealed = aead!.Seal(
      null,
      hex('000000000000000000000002'),
      hex('68656c6c6f'),
      null,
    )
    sealed![0] ^= 1

    const [opened, openErr] = aead!.Open(
      null,
      hex('000000000000000000000002'),
      sealed,
      null,
    )
    expect(opened).toBeNull()
    expect(openErr?.Error()).toBe(
      'chacha20poly1305: message authentication failed',
    )
  })

  test('round trips XChaCha20-Poly1305', () => {
    const [aead, err] = NewX(
      hex('1c9240a5eb55d38af333888604f6b5f0473917c1402b80099dca5cbc207075c0'),
    )
    expect(err).toBeNull()
    expect(aead?.NonceSize()).toBe(NonceSizeX)
    expect(aead?.Overhead()).toBe(Overhead)

    const nonce = hex('000000000102030405060708090a0b0c0d0e0f1011121314')
    const aad = hex('f33388860000000000004e91')
    const plaintext = hex('496e7465726f70657261626c6520584368614368613230')
    const sealed = aead!.Seal(null, nonce, plaintext, aad)

    const [opened, openErr] = aead!.Open(null, nonce, sealed, aad)
    expect(openErr).toBeNull()
    expect(toHex(opened)).toBe(toHex(plaintext))
  })

  test('rejects invalid key length', () => {
    const [aead, err] = New(new Uint8Array(31))
    expect(aead).toBeNull()
    expect(err?.Error()).toBe('chacha20poly1305: bad key length')
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

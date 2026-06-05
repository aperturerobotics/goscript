import { describe, expect, it } from 'vitest'

import { X25519 } from './index.js'

describe('crypto/ecdh override', () => {
  it('matches the RFC 7748 X25519 test vector', () => {
    const curve = X25519()
    const [alice, aliceErr] = curve.NewPrivateKey(
      hex('77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a'),
    )
    const [bobPub, bobPubErr] = curve.NewPublicKey(
      hex('de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f'),
    )

    expect(aliceErr).toBeNull()
    expect(bobPubErr).toBeNull()
    expect(toHex(alice!.PublicKey().Bytes())).toBe(
      '8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a',
    )

    const [shared, sharedErr] = alice!.ECDH(bobPub)
    expect(sharedErr).toBeNull()
    expect(toHex(shared)).toBe(
      '4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742',
    )
  })

  it('rejects low-order remote points', () => {
    const [priv] = X25519().NewPrivateKey(new Uint8Array(32).fill(7))
    const [zero] = X25519().NewPublicKey(new Uint8Array(32))
    const [, err] = priv!.ECDH(zero)

    expect(err?.Error()).toContain('low order point')
  })
})

function hex(value: string): Uint8Array {
  return new Uint8Array(
    value.match(/../g)!.map((byte) => Number.parseInt(byte, 16)),
  )
}

function toHex(value: Uint8Array | null): string {
  return Array.from(value ?? [], (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}

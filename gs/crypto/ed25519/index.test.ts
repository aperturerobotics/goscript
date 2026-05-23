import { describe, expect, test } from 'vitest'
import * as $ from '@goscript/builtin/index.js'

import {
  GenerateKey,
  PrivateKeySize,
  PrivateKey_Public,
  PublicKeySize,
  SignatureSize,
  Sign,
  Verify,
} from './index.js'

describe('crypto/ed25519 override', () => {
  test('generates keys and verifies signatures', async () => {
    const [pub, priv, err] = await GenerateKey(null)
    expect(err).toBeNull()
    expect($.len(pub)).toBe(PublicKeySize)
    expect($.len(priv)).toBe(PrivateKeySize)

    const message = $.stringToBytes('goscript')
    const sig = await Sign(priv, message)
    expect($.len(sig)).toBe(SignatureSize)
    expect(await Verify(pub, message, sig)).toBe(true)
    expect(await Verify(pub, $.stringToBytes('wrong'), sig)).toBe(false)
  })

  test('boxes public keys as crypto public keys', async () => {
    const [pub, priv, err] = await GenerateKey(null)
    expect(err).toBeNull()

    const boxed = PrivateKey_Public(priv)
    const [unboxed, ok] = $.typeAssertTuple<Uint8Array>(
      boxed,
      'ed25519.PublicKey',
    )
    expect(ok).toBe(true)
    expect(Array.from(unboxed)).toEqual(Array.from(pub))
    expect((boxed as any).Equal(boxed)).toBe(true)
  })
})

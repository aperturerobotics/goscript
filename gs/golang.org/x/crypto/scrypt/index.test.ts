import { describe, expect, test } from 'vitest'
import * as $ from '@goscript/builtin/index.js'

import { Key } from './index.js'

describe('scrypt override', () => {
  test('matches Go scrypt vectors', async () => {
    const vectors = [
      {
        password: 'password',
        salt: 'salt',
        N: 2,
        r: 10,
        p: 10,
        output:
          '482c858e229055e62f41e0ec819a5ee18bdb87251a534f75acd95ac5e50aa15f',
      },
      {
        password: 'p',
        salt: 's',
        N: 2,
        r: 1,
        p: 1,
        output: '48b0d2a8a3272611984c50ebd630af52',
      },
      {
        password: '',
        salt: '',
        N: 16,
        r: 1,
        p: 1,
        output:
          '77d6576238657b203b19ca42c18a0497f16b4844e3074ae8dfdffa3fede21442fcd0069ded0948f8326a753a0fc81f17e8d3e0fb2e0d3628cf35e20c38d18906',
      },
    ]

    for (const vector of vectors) {
      const [key, err] = await Key(
        $.stringToBytes(vector.password),
        $.stringToBytes(vector.salt),
        vector.N,
        vector.r,
        vector.p,
        vector.output.length / 2,
      )
      expect(err).toBeNull()
      expect(toHex(key)).toBe(vector.output)
    }
  })

  test('validates invalid parameters like Go', async () => {
    const invalid = [
      [0, 1, 1, 'scrypt: N must be > 1 and a power of 2'],
      [1, 1, 1, 'scrypt: N must be > 1 and a power of 2'],
      [7, 8, 1, 'scrypt: N must be > 1 and a power of 2'],
      [2, 0, 1, 'scrypt: parameters must be > 0'],
      [2, 1, 0, 'scrypt: parameters must be > 0'],
      [2, -1, 1, 'scrypt: parameters must be > 0'],
      [2, 1, -1, 'scrypt: parameters must be > 0'],
    ] as const

    for (const [N, r, p, message] of invalid) {
      const [key, err] = await Key(
        $.stringToBytes('p'),
        $.stringToBytes('s'),
        N,
        r,
        p,
        32,
      )
      expect(key).toBeNull()
      expect(err?.Error()).toBe(message)
    }
  })
})

function toHex(input: Uint8Array | number[] | null): string {
  return Array.from(input ?? [])
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
}

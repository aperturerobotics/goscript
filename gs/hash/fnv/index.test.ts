import { describe, expect, it } from 'vitest'

import * as $ from '../../builtin/index.js'
import {
  New128,
  New128a,
  New32,
  New32a,
  New64,
  New64a,
} from './index.js'

describe('hash/fnv override', () => {
  it('matches Go FNV sums for hello', async () => {
    const h32 = New32()
    h32.Write($.stringToBytes('hello'))
    expect(h32.Sum32()).toBe(0xb6fa7167)
    expect(hex(await h32.Sum($.stringToBytes('prefix')))).toBe(
      '707265666978b6fa7167',
    )
    expect(h32.Size()).toBe(4)

    const h32a = New32a()
    h32a.Write($.stringToBytes('hello'))
    expect(h32a.Sum32()).toBe(0x4f9f2cab)
    expect(hex(await h32a.Sum(null))).toBe('4f9f2cab')

    const h64 = New64()
    h64.Write($.stringToBytes('hello'))
    expect(h64.Sum64()).toBe(0x7b495389bdbdd4c7n)
    expect(hex(await h64.Sum(null))).toBe('7b495389bdbdd4c7')

    const h64a = New64a()
    h64a.Write($.stringToBytes('hello'))
    expect(h64a.Sum64()).toBe(0xa430d84680aabd0bn)
    expect(hex(await h64a.Sum(null))).toBe('a430d84680aabd0b')

    const h128 = New128()
    h128.Write($.stringToBytes('hello'))
    expect(hex(await h128.Sum(null))).toBe('f14b58486483d94f708038798c29697f')

    const h128a = New128a()
    h128a.Write($.stringToBytes('hello'))
    expect(hex(await h128a.Sum(null))).toBe('e3e1efd54283d94f7081314b599d31b3')
  })

  it('marshals and restores state', async () => {
    const hash = New128a()
    hash.Write($.stringToBytes('hello'))
    const [state, marshalErr] = hash.MarshalBinary()
    expect(marshalErr).toBeNull()

    const restored = New128a()
    expect(restored.UnmarshalBinary(state)).toBeNull()
    restored.Write($.stringToBytes(' world'))

    const expected = New128a()
    expected.Write($.stringToBytes('hello world'))
    expect(hex(await restored.Sum(null))).toBe(hex(await expected.Sum(null)))
  })
})

function hex(bytes: $.Bytes): string {
  return Array.from($.bytesToUint8Array(bytes), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('')
}

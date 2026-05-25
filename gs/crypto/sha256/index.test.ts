import { describe, expect, test } from 'vitest'
import * as $ from '@goscript/builtin/index.js'

import { New, New224, Size, Size224, Sum224, Sum256 } from './index.js'

describe('crypto/sha256 override', () => {
  test('sums with WebCrypto', async () => {
    const sum = await Sum256($.stringToBytes('abc'))
    expect(Array.from(sum)).toEqual([
      186, 120, 22, 191, 143, 1, 207, 234, 65, 65, 64, 222, 93, 174, 34, 35,
      176, 3, 97, 163, 150, 23, 122, 156, 180, 16, 255, 97, 242, 0, 21, 173,
    ])
  })

  test('streaming digest appends to prefix', async () => {
    const digest = New()
    expect(digest.Write($.stringToBytes('a'))).toEqual([1, null])
    expect(digest.Write($.stringToBytes('bc'))).toEqual([2, null])

    const out = await digest.Sum(new Uint8Array([1, 2]))
    expect(Array.from(out).slice(0, 2)).toEqual([1, 2])
    expect(out.length).toBe(Size + 2)
    expect(Array.from(out).slice(2)).toEqual(
      Array.from(await Sum256($.stringToBytes('abc'))),
    )
  })

  test('sums SHA-224 with host crypto', async () => {
    const sum = await Sum224($.stringToBytes('abc'))
    expect(Array.from(sum)).toEqual([
      35, 9, 125, 34, 52, 5, 216, 34, 134, 66, 164, 119, 189, 162, 85, 179,
      42, 173, 188, 228, 189, 160, 179, 247, 227, 108, 157, 167,
    ])
  })

  test('streaming SHA-224 digest appends to prefix', async () => {
    const digest = New224()
    expect(digest.Write($.stringToBytes('a'))).toEqual([1, null])
    expect(digest.Write($.stringToBytes('bc'))).toEqual([2, null])

    const out = await digest.Sum(new Uint8Array([1, 2]))
    expect(Array.from(out).slice(0, 2)).toEqual([1, 2])
    expect(out.length).toBe(Size224 + 2)
    expect(Array.from(out).slice(2)).toEqual(
      Array.from(await Sum224($.stringToBytes('abc'))),
    )
  })

  test('streaming Sum does not finalize the digest', async () => {
    const digest = New()
    expect(digest.Write($.stringToBytes('abc'))).toEqual([3, null])

    const first = await digest.Sum(null)
    expect(Array.from(first)).toEqual(
      Array.from(await Sum256($.stringToBytes('abc'))),
    )

    expect(digest.Write($.stringToBytes('d'))).toEqual([1, null])
    const second = await digest.Sum(null)
    expect(Array.from(second)).toEqual(
      Array.from(await Sum256($.stringToBytes('abcd'))),
    )
  })

  test('streaming digest handles many small writes', async () => {
    const digest = New()
    let data = ''
    for (let i = 0; i < 4096; i++) {
      const part = `key-${i};`
      data += part
      expect(digest.Write($.stringToBytes(part))).toEqual([part.length, null])
    }

    expect(Array.from(await digest.Sum(null))).toEqual(
      Array.from(await Sum256($.stringToBytes(data))),
    )
  })
})

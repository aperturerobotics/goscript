import { describe, expect, test } from 'vitest'
import * as $ from '@goscript/builtin/index.js'

import { New, Size, Sum256 } from './index.js'

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
})

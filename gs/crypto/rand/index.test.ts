import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { Read, Reader, Text } from './index.js'

describe('crypto/rand override', () => {
  it('fills byte slices from Web Crypto', () => {
    const buf = new Uint8Array(32)
    const [n, err] = Read(buf)

    expect(err).toBeNull()
    expect(n).toBe(32)
    expect(buf.some((b) => b !== 0)).toBe(true)
  })

  it('exposes Reader as an io.Reader-compatible source', () => {
    const buf = $.makeSlice<number>(12, 12, 'byte')
    const [n, err] = Reader.Read(buf)

    expect(err).toBeNull()
    expect(n).toBe(12)
    expect(Array.from(buf ?? []).some((b) => b !== 0)).toBe(true)
  })

  it('generates base32 text tokens', () => {
    const token = Text()

    expect(token).toHaveLength(26)
    expect(token).toMatch(/^[A-Z2-7]+$/)
  })
})

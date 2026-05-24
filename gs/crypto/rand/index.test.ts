import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { Int, Prime, Read, Reader, Text } from './index.js'

class TestInt {
  private value = 0

  constructor(value = 0) {
    this.value = value
  }

  Sign(): number {
    return Math.sign(this.value)
  }

  BitLen(): number {
    return this.value.toString(2).length
  }

  SetBytes(bytes: Uint8Array): TestInt {
    this.value = 0
    for (const b of bytes) {
      this.value = this.value * 256 + b
    }
    return this
  }

  Cmp(other: TestInt): number {
    return Math.sign(this.value - other.value)
  }

  Value(): number {
    return this.value
  }

  ProbablyPrime(): boolean {
    if (this.value < 2) {
      return false
    }
    for (let i = 2; i * i <= this.value; i++) {
      if (this.value % i === 0) {
        return false
      }
    }
    return true
  }
}

TestInt.__typeInfo = $.registerStructType(
  'big.Int',
  () => new TestInt(),
  [],
  TestInt,
)

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

  it('generates integers below max from an io.Reader', () => {
    const reader = {
      Read(dst: Uint8Array): [number, $.GoError] {
        dst[0] = 42
        return [dst.length, null]
      },
    }

    const [n, err] = Int(reader, new TestInt(100))

    expect(err).toBeNull()
    expect(n.Value()).toBe(42)
  })

  it('generates probable primes with the requested bit length', async () => {
    const reader = {
      Read(dst: Uint8Array): [number, $.GoError] {
        dst.fill(0)
        return [dst.length, null]
      },
    }

    const [prime, err] = await Prime(reader, 8)

    expect(err).toBeNull()
    expect(prime.Value()).toBe(193)
    expect(prime.BitLen()).toBe(8)
    expect(prime.ProbablyPrime()).toBe(true)
  })

  it('rejects prime sizes below two bits', async () => {
    const [prime, err] = await Prime(Reader, 1)

    expect(prime).toBeNull()
    expect(err?.Error()).toBe('crypto/rand: prime size must be at least 2-bit')
  })
})

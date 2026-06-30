import { describe, expect, it } from 'vitest'

import { Make } from './index.js'

describe('unique.Make override', () => {
  it('canonicalizes exact bigint values without JSON stringify failures', () => {
    const a = Make(0x8000000000000000n)
    const b = Make(0x8000000000000000n)
    const c = Make(0x8000000000000001n)

    expect(a).toBe(b)
    expect(a).not.toBe(c)
    expect(a.Value()).toBe(0x8000000000000000n)
  })

  it('keeps non-reflexive and signed infinite float keys distinct', () => {
    expect(Make(Number.POSITIVE_INFINITY)).not.toBe(
      Make(Number.NEGATIVE_INFINITY),
    )
    expect(Make(Number.NaN)).not.toBe(Make(Number.NaN))
  })
})

import { describe, expect, it } from 'vitest'

import * as $ from '../builtin/index.js'

import './index.js'

class FakeHash {
  Write(p: $.Bytes): [number, $.GoError] {
    return [$.len(p), null]
  }

  Sum(b: $.Bytes): $.Bytes {
    return b
  }

  Reset(): void {}

  Size(): number {
    return 20
  }

  BlockSize(): number {
    return 64
  }
}

describe('hash runtime contracts', () => {
  it('registers Hash for runtime type assertions', () => {
    const [value, ok] = $.typeAssertTuple<FakeHash>(
      new FakeHash(),
      'hash.Hash',
    )

    expect(ok).toBe(true)
    expect(value).toBeInstanceOf(FakeHash)
  })
})

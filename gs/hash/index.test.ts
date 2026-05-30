import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import type { XOF } from './index.js'

describe('hash override', () => {
  it('exports the XOF interface shape', () => {
    const xof: XOF = {
      Write(p: $.Bytes): [number, $.GoError] {
        return [$.len(p), null]
      },
      Read(p: $.Bytes): [number, $.GoError] {
        return [$.len(p), null]
      },
      Reset(): void {},
      BlockSize(): number {
        return 1
      },
    }

    expect(xof.BlockSize()).toBe(1)
  })
})

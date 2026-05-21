import { describe, expect, test } from 'vitest'

import {
  Escape,
  EscapeNonString,
  EscapeToResultNonString,
  NoEscape,
} from './index.js'

describe('internal/abi escape intrinsics', () => {
  test('return identity values in the JavaScript target', () => {
    const value = { id: 1 }
    expect(Escape(value)).toBe(value)
    expect(NoEscape(value)).toBe(value)
    expect(EscapeToResultNonString(value)).toBe(value)
    expect(EscapeNonString(value)).toBeUndefined()
  })
})

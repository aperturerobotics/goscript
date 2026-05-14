import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { Position, Position_IsValid, Position_String } from './index.js'

describe('go/token override', () => {
  it('models Position values', () => {
    const pos = $.markAsStructValue(
      new Position({
        Filename: 'test.go',
        Line: 3,
        Column: 9,
      }),
    )

    expect(Position_IsValid(pos)).toBe(true)
    expect(Position_String(pos)).toBe('test.go:3:9')
    expect(pos.clone().String()).toBe('test.go:3:9')
  })
})

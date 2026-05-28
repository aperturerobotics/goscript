import { describe, expect, test } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { ValueOf } from './index.js'

describe('syscall/js override', () => {
  test('ValueOf unwraps generated interface numeric boxes', () => {
    const value = ValueOf(
      $.namedValueInterfaceValue(41, 'int', {}, {
        kind: $.TypeKind.Basic,
        name: 'int',
      }),
    )

    expect(value.Int()).toBe(41)
  })
})

import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as token from '@goscript/go/token/index.js'

import {
  ErrorList_Add,
  ErrorList_Error,
  ErrorList_Len,
  ErrorList_RemoveMultiples,
  type ErrorList,
} from './index.js'

describe('go/scanner override', () => {
  it('adds and formats scanner errors', () => {
    const list: $.VarRef<ErrorList> = $.varRef(null)

    ErrorList_Add(
      list,
      $.markAsStructValue(
        new token.Position({
          Filename: 'test.go',
          Line: 1,
          Column: 1,
        }),
      ),
      'test error',
    )

    expect(ErrorList_Len(list.value)).toBe(1)
    expect(ErrorList_Error(list.value)).toBe('test.go:1:1: test error')
  })

  it('removes repeated line errors', () => {
    const list: $.VarRef<ErrorList> = $.varRef(null)
    const pos = $.markAsStructValue(
      new token.Position({
        Filename: 'test.go',
        Line: 1,
        Column: 1,
      }),
    )

    ErrorList_Add(list, pos, 'first')
    ErrorList_Add(list, pos, 'second')
    ErrorList_RemoveMultiples(list)

    expect(ErrorList_Len(list.value)).toBe(1)
  })
})

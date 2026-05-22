import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as token from '@goscript/go/token/index.js'

import {
  ErrorList_Add,
  ErrorList_Err,
  ErrorList_Error,
  ErrorList_Len,
  ErrorList_RemoveMultiples,
  Scanner,
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

  it('returns nil Err for an empty list and an error for non-empty lists', () => {
    const empty: ErrorList = null
    expect(ErrorList_Err(empty)).toBeNull()

    const list: $.VarRef<ErrorList> = $.varRef(null)
    ErrorList_Add(list, new token.Position({ Line: 1 }), 'first')
    expect(ErrorList_Err(list.value)?.Error()).toBe('1: first')
  })

  it('provides a Scanner surface for generated go/parser code', () => {
    const fset = token.NewFileSet()
    const file = fset.AddFile('test.go', -1, 0)
    const scanner = new Scanner()

    scanner.Init(file, null, null, 0)

    expect(scanner.Scan()).toEqual([file.Pos(0), token.EOF, ''])
    expect(scanner.Scan()).toEqual([file.Pos(0), token.EOF, ''])
  })
})

import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  ADD,
  COMMENT,
  FileSet,
  IDENT,
  IF,
  IsIdentifier,
  IsKeyword,
  Lookup,
  NewFileSet,
  Position,
  Position_IsValid,
  Position_String,
  Token_IsKeyword,
  Token_IsLiteral,
  Token_Precedence,
  Token_String,
} from './index.js'

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

  it('exports Go token constants and predicates', () => {
    expect(Token_String(ADD)).toBe('+')
    expect(Token_String(COMMENT)).toBe('COMMENT')
    expect(Token_Precedence(ADD)).toBe(4)
    expect(Token_IsLiteral(IDENT)).toBe(true)
    expect(Token_IsKeyword(IF)).toBe(true)
    expect(Lookup('if')).toBe(IF)
    expect(Lookup('value')).toBe(IDENT)
    expect(IsKeyword('func')).toBe(true)
    expect(IsIdentifier('value42')).toBe(true)
    expect(IsIdentifier('func')).toBe(false)
  })

  it('tracks files and source positions', () => {
    const fset = NewFileSet()
    expect(fset).toBeInstanceOf(FileSet)

    const file = fset.AddFile('test.go', -1, 12)
    file.SetLinesForContent($.stringToBytes('one\ntwo\nthree'))
    file.AddLineColumnInfo(4, 'other.go', 20, 3)

    const pos = file.Pos(5)
    expect(file.Offset(pos)).toBe(5)
    expect(file.Line(pos)).toBe(20)
    expect(Position_String(file.Position(pos))).toBe('other.go:20:4')
    expect(Position_String(fset.Position(pos))).toBe('other.go:20:4')
    expect(fset.File(pos)).toBe(file)
  })
})

import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as token from '@goscript/go/token/index.js'

import { Error as ScannerError, ErrorList_Err, PrintError } from './index.js'

describe('go/scanner override', () => {
  it('prints errors to an io.Writer', () => {
    const chunks: string[] = []
    const writer = {
      Write(p: $.Bytes): [number, $.GoError] {
        chunks.push($.bytesToString(p))
        return [$.len(p), null]
      },
    }

    PrintError(writer, $.newError('scan failed'))

    expect(chunks).toEqual(['scan failed\n'])
  })

  it('prints every ErrorList entry', () => {
    const chunks: string[] = []
    const writer = {
      Write(p: $.Bytes): [number, $.GoError] {
        chunks.push($.bytesToString(p))
        return [$.len(p), null]
      },
    }

    const errors = [
      new ScannerError({
        Pos: new token.Position({ Filename: 'a.go', Line: 1, Column: 2 }),
        Msg: 'first',
      }),
      new ScannerError({
        Pos: new token.Position({ Filename: 'a.go', Line: 3, Column: 4 }),
        Msg: 'second',
      }),
    ]

    PrintError(writer, errors as $.GoError)

    expect(chunks).toEqual(['a.go:1:2: first\n', 'a.go:3:4: second\n'])

    chunks.length = 0
    const err = ErrorList_Err(errors)
    expect(Array.isArray(err)).toBe(true)
    expect(err?.Error()).toBe('a.go:1:2: first (and 1 more errors)')
    PrintError(writer, err)

    expect(chunks).toEqual(['a.go:1:2: first\n', 'a.go:3:4: second\n'])
  })
})

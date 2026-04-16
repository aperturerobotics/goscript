import { describe, expect, it } from 'vitest'

import { formatPrintedArgs } from './print.js'

describe('builtin println formatting', () => {
  it('formats Uint8Array values with a stable inspect-style representation', () => {
    expect(
      formatPrintedArgs(['b2:', new Uint8Array([72, 101, 108, 108, 111])]),
    ).toBe('b2: Uint8Array(5) [ 72, 101, 108, 108, 111 ]')
  })

  it('quotes nested string array elements', () => {
    expect(formatPrintedArgs(['strings.Split:', ['a', 'b', 'c']])).toBe(
      'strings.Split: [ "a", "b", "c" ]',
    )
  })

  it('formats plain objects across multiple lines', () => {
    expect(
      formatPrintedArgs([
        'out:',
        {
          exampleField: new Uint8Array([104, 101, 108, 108, 111]),
          exampleText: 'world',
        },
      ]),
    ).toBe(`out: {
  exampleField: Uint8Array(5) [ 104, 101, 108, 108, 111 ],
  exampleText: "world",
}`)
  })

  it('formats goscript struct field bags using field values', () => {
    expect(
      formatPrintedArgs([
        {
          _fields: {
            Name: { value: 'hello' },
            Count: { value: 3 },
          },
        },
      ]),
    ).toBe(`{
  Name: "hello",
  Count: 3,
}`)
  })
})

import { describe, expect, it } from 'vitest'

import {
  AddExtensionType,
  BEncoding,
  ErrInvalidMediaParameter,
  ExtensionsByType,
  FormatMediaType,
  ParseMediaType,
  QEncoding,
  TypeByExtension,
  WordDecoder,
  WordEncoder_Encode,
} from './index.js'

describe('mime override', () => {
  it('parses, formats, and looks up media types', () => {
    const [mediaType, params, err] = ParseMediaType(
      'Text/Plain; Charset="utf-8"; format=flowed',
    )
    expect(err).toBeNull()
    expect(mediaType).toBe('text/plain')
    expect(params.get('charset')).toBe('utf-8')
    expect(params.get('format')).toBe('flowed')
    const [trailingMediaType, trailingParams, trailingErr] =
      ParseMediaType('text/plain;')
    expect(trailingErr).toBeNull()
    expect(trailingMediaType).toBe('text/plain')
    expect(trailingParams.size).toBe(0)

    expect(FormatMediaType('text/plain', new Map([['charset', 'utf-8']]))).toBe(
      'text/plain; charset=utf-8',
    )
    expect(
      FormatMediaType('Attachment', new Map([['FileName', 'hello.txt']])),
    ).toBe('attachment; filename=hello.txt')
    expect(
      FormatMediaType('attachment', new Map([['filename', 'foo bar.txt']])),
    ).toBe('attachment; filename="foo bar.txt"')
    expect(
      FormatMediaType(
        'text/plain',
        new Map([
          ['z', 'last'],
          ['a', 'first'],
        ]),
      ),
    ).toBe('text/plain; a=first; z=last')

    const encoded = FormatMediaType(
      'attachment',
      new Map([['filename', 'résumé.txt']]),
    )
    expect(encoded).toBe("attachment; filename*=utf-8''r%C3%A9sum%C3%A9.txt")
    const [, encodedParams, encodedErr] = ParseMediaType(encoded)
    expect(encodedErr).toBeNull()
    expect(encodedParams.get('filename')).toBe('résumé.txt')
    const [, pathParams, pathErr] = ParseMediaType(
      'form-data; filename="C:\\dev\\go.txt"; quoted="a\\"b"',
    )
    expect(pathErr).toBeNull()
    expect(pathParams.get('filename')).toBe('C:\\dev\\go.txt')
    expect(pathParams.get('quoted')).toBe('a"b')

    expect(TypeByExtension('.json')).toBe('application/json')
    expect(
      AddExtensionType('.goscript', 'text/plain; charset=utf-8'),
    ).toBeNull()
    const [extensions, extensionErr] = ExtensionsByType('text/plain')
    expect(extensionErr).toBeNull()
    expect(extensions).toContain('.goscript')
  })

  it('reports invalid media parameters', () => {
    const [, , err] = ParseMediaType('text/plain; broken')
    expect(err).toBe(ErrInvalidMediaParameter)
    expect(ParseMediaType('text/plain; filename=foo bar')[2]).toBe(
      ErrInvalidMediaParameter,
    )
    expect(ParseMediaType('text/plain; filename="unterminated')[2]).toBe(
      ErrInvalidMediaParameter,
    )
    expect(ParseMediaType('text/plain; x=1; x=2')[2]).toBe(
      ErrInvalidMediaParameter,
    )
    expect(ParseMediaType('text/plain; bad[]=x')[2]).toBe(
      ErrInvalidMediaParameter,
    )
    expect(ParseMediaType('text/plain; bad{}=x')[1].get('bad{}')).toBe('x')
  })

  it('encodes and decodes RFC 2047 words', () => {
    expect(WordEncoder_Encode(BEncoding, 'utf-8', 'hello')).toBe('hello')

    const bWord = WordEncoder_Encode(BEncoding, 'utf-8', 'héllo')
    expect(new WordDecoder().Decode(bWord)).toEqual(['héllo', null])

    const qWord = WordEncoder_Encode(QEncoding, 'utf-8', 'hello world')
    expect(qWord).toBe('hello world')

    const encodedQWord = WordEncoder_Encode(QEncoding, 'utf-8', 'héllo world')
    const [header, err] = new WordDecoder().DecodeHeader(
      `subject ${encodedQWord}`,
    )
    expect(err).toBeNull()
    expect(header).toBe('subject héllo world')
  })
})

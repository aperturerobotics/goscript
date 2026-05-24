import { describe, expect, test } from 'vitest'

import {
  Decode,
  DecodeAlphabet,
  Encode,
  EncodeAlphabet,
  FlickrAlphabet,
  NewAlphabet,
} from './index.js'

const roundTrips = [
  [0],
  [0, 0, 1, 2, 3],
  [255, 254, 253, 0, 1, 2, 3],
  Array.from({ length: 64 }, (_, i) => (i * 37) & 0xff),
]

describe('base58 override', () => {
  test('matches known bitcoin alphabet encodings', () => {
    expect(Encode(new Uint8Array([0]))).toBe('1')
    expect(Encode(new Uint8Array([0, 0, 1]))).toBe('112')
    expect(Encode(new Uint8Array([97, 98, 99]))).toBe('ZiCa')
    expect(
      Encode(new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])),
    ).toBe('jpXCZedGfVQ')
  })

  test('round trips bytes', () => {
    for (const input of roundTrips) {
      const encoded = Encode(new Uint8Array(input))
      const [decoded, err] = Decode(encoded)
      expect(err).toBeNull()
      expect(Array.from(decoded ?? [])).toEqual(input)
    }
  })

  test('supports custom alphabets', () => {
    const input = new Uint8Array([0, 1, 2, 3, 4, 5])
    const flickr = EncodeAlphabet(input, FlickrAlphabet)
    const [decoded, err] = DecodeAlphabet(flickr, FlickrAlphabet)
    expect(err).toBeNull()
    expect(Array.from(decoded ?? [])).toEqual(Array.from(input))

    const reversed = NewAlphabet(
      '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
        .split('')
        .reverse()
        .join(''),
    )
    const encoded = EncodeAlphabet(input, reversed)
    const [decodedReversed, reversedErr] = DecodeAlphabet(encoded, reversed)
    expect(reversedErr).toBeNull()
    expect(Array.from(decodedReversed ?? [])).toEqual(Array.from(input))
  })

  test('returns Go errors for invalid input', () => {
    const [empty, emptyErr] = Decode('')
    expect(empty).toBeNull()
    expect(emptyErr?.Error()).toBe('zero length string')

    const [invalid, invalidErr] = Decode('0')
    expect(invalid).toBeNull()
    expect(invalidErr?.Error()).toContain('Invalid base58 digit')

    const [highBit, highBitErr] = Decode('é')
    expect(highBit).toBeNull()
    expect(highBitErr?.Error()).toBe('High-bit set on invalid digit')
  })
})

import { ErrBadPattern, Match } from './index.js'
import { describe, expect, test } from 'vitest'

describe('path.Match', () => {
  test('star consumes the run up to but not including a slash', () => {
    // Go: path.Match("*/c", "a/c") => (true, nil). The star matches "a" and
    // the literal "/c" matches the remainder.
    expect(Match('*/c', 'a/c')).toEqual([true, null])
    // Go: a star still cannot cross a slash.
    expect(Match('*c', 'a/c')).toEqual([false, null])
    // Go: path.Match("a*b", "axxb") => (true, nil).
    expect(Match('a*b', 'axxb')).toEqual([true, null])
  })

  test('unterminated character class reports ErrBadPattern', () => {
    // Go: an escape that consumes the last rune of the class returns
    // ErrBadPattern rather than indexing past the end of the chunk.
    const [ok, err] = Match('[a', 'x')
    expect(ok).toBe(false)
    expect(err).toBe(ErrBadPattern)

    const [ok2, err2] = Match('[', 'a')
    expect(ok2).toBe(false)
    expect(err2).toBe(ErrBadPattern)
  })

  test('well-formed character class still matches', () => {
    // Go: path.Match("[a-c]", "b") => (true, nil).
    expect(Match('[a-c]', 'b')).toEqual([true, null])
    expect(Match('[^a-c]', 'b')).toEqual([false, null])
  })
})

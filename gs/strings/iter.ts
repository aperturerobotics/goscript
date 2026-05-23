import * as $ from '@goscript/builtin/index.js'
import { Index, IndexByte } from './strings.js'

import * as iter from '@goscript/iter/index.js'

import * as unicode from '@goscript/unicode/index.js'

import * as utf8 from '@goscript/unicode/utf8/index.js'

// ASCII space characters lookup map
const asciiSpace: { [key: number]: boolean } = {
  9: true, // \t
  10: true, // \n
  11: true, // \v
  12: true, // \f
  13: true, // \r
  32: true, // space
}

// Lines returns an iterator over the newline-terminated lines in the string s.
// The lines yielded by the iterator include their terminating newlines.
// If s is empty, the iterator yields no lines at all.
// If s does not end in a newline, the final yielded line will not end in a newline.
// It returns a single-use iterator.
export function Lines(s: string): iter.Seq<string> {
  return (
    _yield: ((p0: string) => iter.YieldResult) | null,
  ): void | globalThis.Promise<void> => {
    const walk = (): void | globalThis.Promise<void> => {
      for (; $.len(s) > 0; ) {
        let line: string
        {
          let i = IndexByte(s, 10)
          if (i >= 0) {
            ;[line, s] = [
              $.sliceString(s, undefined, i + 1),
              $.sliceString(s, i + 1, undefined),
            ]
          } else {
            ;[line, s] = [s, '']
          }
        }
        const keepGoing = _yield!(line)
        if (keepGoing instanceof Promise) {
          return keepGoing.then((next) => {
            if (next) {
              return walk()
            }
          })
        }
        if (!keepGoing) {
          return
        }
      }
    }
    return walk()
  }
}

// explodeSeq returns an iterator over the runes in s.
export function explodeSeq(s: string): iter.Seq<string> {
  return (
    _yield: ((p0: string) => iter.YieldResult) | null,
  ): void | globalThis.Promise<void> => {
    const walk = (): void | globalThis.Promise<void> => {
      for (; $.len(s) > 0; ) {
        let [, size] = utf8.DecodeRuneInString(s)
        const keepGoing = _yield!($.sliceString(s, undefined, size))
        if (keepGoing instanceof Promise) {
          return keepGoing.then((next) => {
            if (next) {
              s = $.sliceString(s, size, undefined)
              return walk()
            }
          })
        }
        if (!keepGoing) {
          return
        }
        s = $.sliceString(s, size, undefined)
      }
    }
    return walk()
  }
}

// splitSeq is SplitSeq or SplitAfterSeq, configured by how many
// bytes of sep to include in the results (none or all).
export function splitSeq(
  s: string,
  sep: string,
  sepSave: number,
): iter.Seq<string> {
  if ($.len(sep) == 0) {
    return explodeSeq(s)
  }
  return (
    _yield: ((p0: string) => iter.YieldResult) | null,
  ): void | globalThis.Promise<void> => {
    const walk = (): void | globalThis.Promise<void> => {
      for (;;) {
        let i = Index(s, sep)
        if (i < 0) {
          const keepGoing = _yield!(s)
          if (keepGoing instanceof Promise) {
            return keepGoing.then(() => {})
          }
          return
        }
        let frag = $.sliceString(s, undefined, i + sepSave)
        const keepGoing = _yield!(frag)
        if (keepGoing instanceof Promise) {
          return keepGoing.then((next) => {
            if (next) {
              s = $.sliceString(s, i + $.len(sep), undefined)
              return walk()
            }
          })
        }
        if (!keepGoing) {
          return
        }
        s = $.sliceString(s, i + $.len(sep), undefined)
      }
    }
    return walk()
  }
}

// SplitSeq returns an iterator over all substrings of s separated by sep.
// The iterator yields the same strings that would be returned by [Split](s, sep),
// but without constructing the slice.
// It returns a single-use iterator.
export function SplitSeq(s: string, sep: string): iter.Seq<string> {
  return splitSeq(s, sep, 0)
}

// SplitAfterSeq returns an iterator over substrings of s split after each instance of sep.
// The iterator yields the same strings that would be returned by [SplitAfter](s, sep),
// but without constructing the slice.
// It returns a single-use iterator.
export function SplitAfterSeq(s: string, sep: string): iter.Seq<string> {
  return splitSeq(s, sep, $.len(sep))
}

// FieldsSeq returns an iterator over substrings of s split around runs of
// whitespace characters, as defined by [unicode.IsSpace].
// The iterator yields the same strings that would be returned by [Fields](s),
// but without constructing the slice.
export function FieldsSeq(s: string): iter.Seq<string> {
  return (
    _yield: ((p0: string) => iter.YieldResult) | null,
  ): void | globalThis.Promise<void> => {
    let start = -1
    const walk = (i: number): void | globalThis.Promise<void> => {
      for (; i < $.len(s); ) {
        let size = 1
        let r = $.indexString(s, i) as number
        let isSpace = asciiSpace[$.indexString(s, i)] === true
        if (r >= utf8.RuneSelf) {
          ;[r, size] = utf8.DecodeRuneInString($.sliceString(s, i, undefined))
          isSpace = unicode.IsSpace(r)
        }
        if (isSpace) {
          if (start >= 0) {
            const keepGoing = _yield!($.sliceString(s, start, i))
            start = -1
            if (keepGoing instanceof Promise) {
              return keepGoing.then((next) => {
                if (next) {
                  return walk(i + size)
                }
              })
            }
            if (!keepGoing) {
              return
            }
          }
        } else if (start < 0) {
          start = i
        }
        i += size
      }
      if (start >= 0) {
        const keepGoing = _yield!($.sliceString(s, start, undefined))
        if (keepGoing instanceof Promise) {
          return keepGoing.then(() => {})
        }
      }
    }
    return walk(0)
  }
}

// FieldsFuncSeq returns an iterator over substrings of s split around runs of
// Unicode code points satisfying f(c).
// The iterator yields the same strings that would be returned by [FieldsFunc](s),
// but without constructing the slice.
export function FieldsFuncSeq(
  s: string,
  f: ((p0: number) => boolean) | null,
): iter.Seq<string> {
  return (
    _yield: ((p0: string) => iter.YieldResult) | null,
  ): void | globalThis.Promise<void> => {
    if (f === null) {
      return
    }
    let start = -1
    const walk = (i: number): void | globalThis.Promise<void> => {
      for (; i < $.len(s); ) {
        let size = 1
        let r = $.indexString(s, i) as number
        if (r >= utf8.RuneSelf) {
          ;[r, size] = utf8.DecodeRuneInString($.sliceString(s, i, undefined))
        }
        if (f(r)) {
          if (start >= 0) {
            const keepGoing = _yield!($.sliceString(s, start, i))
            start = -1
            if (keepGoing instanceof Promise) {
              return keepGoing.then((next) => {
                if (next) {
                  return walk(i + size)
                }
              })
            }
            if (!keepGoing) {
              return
            }
          }
        } else if (start < 0) {
          start = i
        }
        i += size
      }
      if (start >= 0) {
        const keepGoing = _yield!($.sliceString(s, start, undefined))
        if (keepGoing instanceof Promise) {
          return keepGoing.then(() => {})
        }
      }
    }
    return walk(0)
  }
}

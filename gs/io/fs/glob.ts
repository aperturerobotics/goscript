import * as $ from '@goscript/builtin/index.js'
import { Stat } from './stat.js'
import { ReadDir } from './readdir.js'
import { FS } from './fs.js'

import * as path from '@goscript/path/index.js'

export type GlobFS =
  | null
  | ({
      // Glob returns the names of all files matching pattern,
      // providing an implementation of the top-level
      // Glob function.
      Glob(pattern: string): [$.Slice<string>, $.GoError]
    } & FS)

$.registerInterfaceType(
  'GlobFS',
  null, // Zero value for interface is null
  [
    {
      name: 'Glob',
      args: [
        { name: 'pattern', type: { kind: $.TypeKind.Basic, name: 'string' } },
      ],
      returns: [
        {
          type: {
            kind: $.TypeKind.Slice,
            elemType: { kind: $.TypeKind.Basic, name: 'string' },
          },
        },
        {
          type: {
            kind: $.TypeKind.Interface,
            name: 'GoError',
            methods: [
              {
                name: 'Error',
                args: [],
                returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
              },
            ],
          },
        },
      ],
    },
  ],
)

// Glob returns the names of all files matching pattern or nil
// if there is no matching file. The syntax of patterns is the same
// as in [path.Match]. The pattern may describe hierarchical names such as
// usr/*/bin/ed.
//
// Glob ignores file system errors such as I/O errors reading directories.
// The only possible returned error is [path.ErrBadPattern], reporting that
// the pattern is malformed.
//
// If fs implements [GlobFS], Glob calls fs.Glob.
// Otherwise, Glob uses [ReadDir] to traverse the directory tree
// and look for matches for the pattern.
export function Glob(fsys: FS, pattern: string): [$.Slice<string>, $.GoError] {
  return globWithLimit(fsys, pattern, 0)
}

export function globWithLimit(
  fsys: FS,
  pattern: string,
  depth: number,
): [$.Slice<string>, $.GoError] {
  let matches: $.Slice<string> = null
  {
    // This limit is added to prevent stack exhaustion issues. See
    // CVE-2022-30630.
    let pathSeparatorsLimit: number = 10000
    if (depth > pathSeparatorsLimit) {
      return [null, path.ErrBadPattern]
    }
    {
      let { value: fsysTyped, ok: ok } = $.typeAssert<GlobFS>(fsys, 'GlobFS')
      if (ok) {
        return fsysTyped!.Glob(pattern)
      }
    }

    // Check pattern is well-formed.
    {
      const [, matchErr] = path.Match(pattern, '')
      if (matchErr != null) {
        return [null, matchErr]
      }
    }
    if (!hasMeta(pattern)) {
      {
        const [, statErr] = Stat(fsys, pattern)
        if (statErr != null) {
          return [null, null]
        }
      }
      return [$.arrayToSlice<string>([pattern]), null]
    }

    let [dir, file] = path.Split(pattern)
    dir = cleanGlobPath(dir)

    if (!hasMeta(dir)) {
      return glob(fsys, dir, file, null)
    }

    // Prevent infinite recursion. See issue 15879.
    if (dir == pattern) {
      return [null, path.ErrBadPattern]
    }

    const [dirs, dirErr] = globWithLimit(fsys, dir, depth + 1)
    if (dirErr != null) {
      return [null, dirErr]
    }
    for (let _i = 0; _i < $.len(dirs); _i++) {
      const d = dirs![_i]
      {
        const [nextMatches, globErr] = glob(fsys, d, file, matches)
        matches = nextMatches
        if (globErr != null) {
          return [matches, globErr]
        }
      }
    }
    return [matches, null]
  }
}

// cleanGlobPath prepares path for glob matching.
export function cleanGlobPath(path: string): string {
  // chop off trailing separator
  switch (path) {
    case '':
      return '.'
      break
    default:
      return $.sliceString(path, 0, $.len(path) - 1)
      break
  }
}

// glob searches for files matching pattern in the directory dir
// and appends them to matches, returning the updated slice.
// If the directory cannot be opened, glob returns the existing matches.
// New matches are added in lexicographical order.
export function glob(
  fs: FS,
  dir: string,
  pattern: string,
  matches: $.Slice<string>,
): [$.Slice<string>, $.GoError] {
  let m = matches
  {
    let [infos, err] = ReadDir(fs, dir)

    // ignore I/O error
    if (err != null) {
      return [m, null]
    }

    for (let _i = 0; _i < $.len(infos); _i++) {
      const info = infos![_i]
      {
        let n = info!.Name()
        let [matched, err] = path.Match(pattern, n)
        if (err != null) {
          return [m, err]
        }
        if (matched) {
          m = $.append(m, path.Join(dir, n))
        }
      }
    }
    return [m, null]
  }
}

// hasMeta reports whether path contains any of the magic characters
// recognized by path.Match.
export function hasMeta(path: string): boolean {
  for (let i = 0; i < $.len(path); i++) {
    switch ($.indexString(path, i)) {
      case 42:
      case 63:
      case 91:
      case 92:
        return true
        break
    }
  }
  return false
}

import * as $ from '@goscript/builtin/index.js'
import { getHostRuntime, type NodeFSModule } from '@goscript/builtin/hostio.js'

export const ErrBadPattern = $.newError('syntax error in pattern')

// Match reports whether name matches the shell file name pattern.
// The pattern syntax is:
//
//	pattern:
//		{ term }
//	term:
//		'*'         matches any sequence of non-Separator characters
//		'?'         matches any single non-Separator character
//		'[' [ '^' ] { character-range } ']'
//		            character class (must be non-empty)
//		c           matches character c (c != '*', '?', '\\', '[')
//		'\\' c      matches character c
//
//	character-range:
//		c           matches character c (c != '\\', '-', ']')
//		'\\' c      matches character c
//		lo '-' hi   matches character c for lo <= c <= hi
//
// Match requires pattern to match all of name, not just a substring.
// The only possible returned error is ErrBadPattern, when pattern
// is malformed.
export function Match(pattern: string, name: string): [boolean, $.GoError] {
  try {
    // Validate pattern first
    validatePattern(pattern)
    return [matchPattern(pattern, name), null]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return [false, ErrBadPattern]
  }
}

function validatePattern(pattern: string): void {
  let i = 0

  while (i < pattern.length) {
    const char = pattern[i]

    switch (char) {
      case '\\':
        // Must be followed by another character
        i++
        if (i >= pattern.length) {
          throw new Error('bad pattern')
        }
        i++
        break

      case '[': {
        // Must have a properly closed character class
        i++
        let foundContent = false
        let foundClose = false

        // Skip negation
        if (i < pattern.length && pattern[i] === '^') {
          i++
        }

        while (i < pattern.length) {
          if (pattern[i] === ']') {
            foundClose = true
            i++
            break
          }

          foundContent = true

          if (pattern[i] === '\\') {
            i++ // Skip escape character
            if (i >= pattern.length) {
              throw new Error('bad pattern')
            }
          }
          i++
        }

        if (!foundClose || !foundContent) {
          throw new Error('bad pattern')
        }
        break
      }

      default:
        i++
        break
    }
  }
}

function matchPattern(pattern: string, name: string): boolean {
  let patternIndex = 0
  let nameIndex = 0

  while (patternIndex < pattern.length && nameIndex < name.length) {
    const p = pattern[patternIndex]

    switch (p) {
      case '*':
        // Handle star - match any sequence of non-Separator characters.
        patternIndex++
        if (patternIndex >= pattern.length) {
          // Trailing * matches the rest of name unless it crosses a separator.
          return name.substring(nameIndex).indexOf('/') < 0
        }

        // Try to match the rest of the pattern with remaining name, but the
        // star cannot consume a separator (Go matches non-Separator runs only).
        for (let i = nameIndex; i <= name.length; i++) {
          if (
            matchPattern(pattern.substring(patternIndex), name.substring(i))
          ) {
            return true
          }
          if (i < name.length && name[i] === '/') {
            break
          }
        }
        return false

      case '?':
        // Match any single character except separator
        if (name[nameIndex] === '/') {
          return false
        }
        patternIndex++
        nameIndex++
        break

      case '[': {
        // Character class
        const [matched, newPatternIndex] = matchCharClass(
          pattern,
          patternIndex,
          name[nameIndex],
        )
        if (!matched) {
          return false
        }
        patternIndex = newPatternIndex
        nameIndex++
        break
      }

      case '\\':
        // Escaped character (pattern already validated)
        patternIndex++
        if (pattern[patternIndex] !== name[nameIndex]) {
          return false
        }
        patternIndex++
        nameIndex++
        break

      default:
        // Literal character
        if (p !== name[nameIndex]) {
          return false
        }
        patternIndex++
        nameIndex++
        break
    }
  }

  // Handle any remaining stars in pattern
  while (patternIndex < pattern.length && pattern[patternIndex] === '*') {
    patternIndex++
  }

  // Both pattern and name should be fully consumed
  return patternIndex >= pattern.length && nameIndex >= name.length
}

function matchCharClass(
  pattern: string,
  start: number,
  char: string,
): [boolean, number] {
  let index = start + 1
  let negated = false

  // Check for negation
  if (index < pattern.length && pattern[index] === '^') {
    negated = true
    index++
  }

  let matched = false

  while (index < pattern.length) {
    if (pattern[index] === ']') {
      index++
      break
    }

    if (pattern[index] === '\\') {
      // Escaped character
      index++
      if (pattern[index] === char) {
        matched = true
      }
      index++
    } else if (
      index + 2 < pattern.length &&
      pattern[index + 1] === '-' &&
      pattern[index + 2] !== ']'
    ) {
      // Character range
      const lo = pattern[index]
      const hi = pattern[index + 2]
      if (char >= lo && char <= hi) {
        matched = true
      }
      index += 3
    } else {
      // Single character
      if (pattern[index] === char) {
        matched = true
      }
      index++
    }
  }

  if (negated) {
    matched = !matched
  }

  return [matched, index]
}

// Glob returns the names of all files matching pattern or null
// if there is no matching file. The syntax of patterns is the same
// as in Match. The pattern may describe hierarchical names such as
// /usr/*/bin/ed (assuming the Separator is '/').
//
// Glob ignores file system errors such as I/O errors reading directories.
// The only possible returned error is ErrBadPattern, when pattern is malformed.
export function Glob(pattern: string): [string[], $.GoError] {
  try {
    validatePattern(pattern)
    return [globHost(pattern), null]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return [[], ErrBadPattern]
  }
}

function hasMeta(path: string): boolean {
  return /[*?[\\]/.test(path)
}

function splitPattern(pattern: string): {
  absolute: boolean
  segments: string[]
} {
  const absolute = pattern.startsWith('/')
  const segments = pattern.split('/').filter((segment, index) => {
    if (index === 0 && segment === '') {
      return false
    }
    return segment !== '' && segment !== '.'
  })
  return { absolute, segments }
}

function cleanMatch(path: string): string {
  const absolute = path.startsWith('/')
  const parts: string[] = []
  for (const part of path.split('/')) {
    if (part === '' || part === '.') {
      continue
    }
    if (part === '..') {
      if (parts.length > 0 && parts[parts.length - 1] !== '..') {
        parts.pop()
      } else if (!absolute) {
        parts.push(part)
      }
      continue
    }
    parts.push(part)
  }
  const out = parts.join('/')
  if (absolute) {
    return '/' + out
  }
  return out === '' ? '.' : out
}

function joinPath(dir: string, name: string): string {
  if (dir === '' || dir === '.') {
    return name
  }
  if (dir === '/') {
    return '/' + name
  }
  return dir.replace(/\/+$/, '') + '/' + name
}

type HostDirEntry = { name: string; isDir: boolean }

function readDir(path: string): HostDirEntry[] | null {
  const runtime = getHostRuntime()
  const denoObj = runtime.deno
  if (denoObj?.readDirSync) {
    try {
      const entries: HostDirEntry[] = []
      for (const entry of denoObj.readDirSync(path)) {
        entries.push({ name: entry.name, isDir: !!entry.isDirectory })
      }
      entries.sort((a, b) => a.name.localeCompare(b.name))
      return entries
    } catch {
      return null
    }
  }

  const nodeFS = runtime.nodeFS
  if (nodeFS?.readdirSync) {
    try {
      const entries = nodeFS
        .readdirSync(path, { withFileTypes: true })
        .map((entry: any) => ({
          name: String(entry.name),
          isDir:
            typeof entry.isDirectory === 'function' ?
              entry.isDirectory()
            : false,
        }))
      entries.sort((a, b) => a.name.localeCompare(b.name))
      return entries
    } catch {
      return null
    }
  }

  return null
}

function exists(path: string): boolean {
  const runtime = getHostRuntime()
  if (runtime.deno?.statSync) {
    try {
      runtime.deno.statSync(path)
      return true
    } catch {
      return false
    }
  }

  const nodeFS = runtime.nodeFS
  if (nodeFS?.statSync) {
    try {
      nodeFS.statSync(path)
      return true
    } catch {
      return false
    }
  }

  return false
}

function isDir(path: string, nodeFS?: NodeFSModule | null): boolean {
  const runtime = getHostRuntime()
  if (runtime.deno?.statSync) {
    try {
      return !!runtime.deno.statSync(path).isDirectory
    } catch {
      return false
    }
  }

  const fs = nodeFS ?? runtime.nodeFS
  if (fs?.statSync) {
    try {
      const stat = fs.statSync(path)
      return typeof stat.isDirectory === 'function' ? stat.isDirectory() : false
    } catch {
      return false
    }
  }

  return false
}

function globHost(pattern: string): string[] {
  const { absolute, segments } = splitPattern(pattern)
  if (!hasMeta(pattern)) {
    return exists(pattern) ? [cleanMatch(pattern)] : []
  }

  let prefixes = [absolute ? '/' : '.']
  for (const [index, segment] of segments.entries()) {
    const next: string[] = []
    const last = index === segments.length - 1
    const segmentHasMeta = hasMeta(segment)
    for (const prefix of prefixes) {
      if (!segmentHasMeta) {
        const candidate = joinPath(prefix, segment)
        if (last || isDir(candidate)) {
          next.push(candidate)
        }
        continue
      }

      const entries = readDir(prefix)
      if (entries === null) {
        continue
      }
      for (const entry of entries) {
        const [matched, err] = Match(segment, entry.name)
        if (err !== null || !matched) {
          continue
        }
        if (last || entry.isDir) {
          next.push(joinPath(prefix, entry.name))
        }
      }
    }
    prefixes = next
  }

  return prefixes.map(cleanMatch).sort()
}

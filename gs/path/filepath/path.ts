// Package filepath implements utility routines for manipulating filename paths
// in a way compatible with the target operating system-defined file paths.
import * as $ from '@goscript/builtin/index.js'
import {
  getCurrentWorkingDirectory,
  getHostRuntime,
} from '@goscript/builtin/hostio.js'
import type { DirEntry } from '@goscript/io/fs/fs.js'
import { ValidPath } from '@goscript/io/fs/fs.js'
import { FileInfoToDirEntry } from '@goscript/io/fs/readdir.js'

type JoinElement = string | $.Slice<string>

function normalizeJoinElements(elem: JoinElement[]): string[] {
  if (elem.length === 1 && typeof elem[0] !== 'string') {
    const slice = elem[0]
    const parts: string[] = []
    for (let i = 0; i < $.len(slice); i++) {
      parts.push(slice![i])
    }
    return parts
  }
  return elem as string[]
}

// Path separator constants
export const Separator = $.stringToRune('/')
export const ListSeparator = $.stringToRune(':')

// Error constants
export const SkipDir = $.newError('skip this directory')
export const SkipAll = $.newError('skip everything and stop the walk')

// Base returns the last element of path.
// Trailing path separators are removed before extracting the last element.
// If the path is empty, Base returns ".".
// If the path consists entirely of separators, Base returns a single separator.
export function Base(path: string): string {
  if (path === '') {
    return '.'
  }

  // Strip trailing slashes
  path = path.replace(/\/+$/, '')

  if (path === '') {
    return '/'
  }

  // Find the last slash
  const i = path.lastIndexOf('/')
  if (i >= 0) {
    return path.substring(i + 1)
  }

  return path
}

// Dir returns all but the last element of path, typically the path's directory.
// After dropping the final element, Dir calls Clean on the path and trailing
// slashes are removed. If the path is empty, Dir returns ".".
// If the path consists entirely of separators, Dir returns a single separator.
export function Dir(path: string): string {
  if (path === '') {
    return '.'
  }

  // Strip trailing slashes
  path = path.replace(/\/+$/, '')

  if (path === '') {
    return '/'
  }

  // Find the last slash
  const i = path.lastIndexOf('/')
  if (i >= 0) {
    const dir = path.substring(0, i)
    return Clean(dir === '' ? '/' : dir)
  }

  return '.'
}

// Ext returns the file name extension used by path.
// The extension is the suffix beginning at the final dot
// in the final element of path; it is empty if there is no dot.
export function Ext(path: string): string {
  const base = Base(path)

  // Handle special case: if the base starts with a dot and has no other dots,
  // it's a hidden file with no extension
  if (base.startsWith('.') && base.indexOf('.', 1) === -1) {
    return ''
  }

  const i = base.lastIndexOf('.')
  if (i >= 0) {
    return base.substring(i)
  }
  return ''
}

// Clean returns the shortest path name equivalent to path
// by purely lexical processing.
export function Clean(path: string): string {
  if (path === '') {
    return '.'
  }

  const isAbs = path.startsWith('/')
  const segments = path
    .split('/')
    .filter((segment) => segment !== '' && segment !== '.')
  const result: string[] = []

  for (const segment of segments) {
    if (segment === '..') {
      if (result.length > 0 && result[result.length - 1] !== '..') {
        result.pop()
      } else if (!isAbs) {
        result.push('..')
      }
    } else {
      result.push(segment)
    }
  }

  let cleaned = result.join('/')
  if (isAbs) {
    cleaned = '/' + cleaned
  }

  return (
    cleaned === '' ?
      isAbs ? '/'
      : '.'
    : cleaned
  )
}

// Join joins any number of path elements into a single path,
// separating them with an OS specific Separator. Empty elements
// are ignored. The result is Cleaned. However, if the argument
// list is empty or all its elements are empty, Join returns
// an empty string.
export function Join(...elem: JoinElement[]): string {
  const partsArg = normalizeJoinElements(elem)
  // Join all elements from the first non-empty one onward, then Clean. A later
  // absolute element does not discard earlier elements (Go joins the suffix and
  // lets Clean collapse the resulting double separators).
  for (let i = 0; i < partsArg.length; i++) {
    if (partsArg[i] !== '') {
      return Clean(partsArg.slice(i).join('/'))
    }
  }
  return ''
}

// Split splits path immediately following the final Separator,
// separating it into a directory and file name component.
// If there is no Separator in path, Split returns an empty dir
// and file set to path. The returned values have the property
// that path = dir+file.
export function Split(path: string): [string, string] {
  const i = path.lastIndexOf('/')
  if (i < 0) {
    return ['', path]
  }
  return [path.substring(0, i + 1), path.substring(i + 1)]
}

// IsAbs reports whether the path is absolute.
export function IsAbs(path: string): boolean {
  return path.startsWith('/')
}

// ToSlash returns the result of replacing each separator character
// in path with a slash ('/') character. Multiple separators are
// replaced by multiple slashes.
export function ToSlash(path: string): string {
  // On Unix-like systems (including our JS environment), the separator is already '/'
  // so backslashes are just regular characters and should not be converted
  // This matches Go's behavior on Unix systems
  return path
}

// FromSlash returns the result of replacing each slash ('/') character
// in path with a separator character. Multiple slashes are replaced
// by multiple separators.
export function FromSlash(path: string): string {
  // On Unix-like systems (including our JS environment), separator is '/'
  // so no conversion needed
  return path
}

// VolumeName returns leading volume name.
// Given "C:\foo\bar" it returns "C:" on Windows.
// Given "\\host\share\foo" it returns "\\host\share".
// On other systems, it returns "".
export function VolumeName(_path: string): string {
  // In our JS environment, we don't have volume names
  return ''
}

// IsLocal reports whether path, using lexical analysis only,
// has all of these properties:
//   - is within the subtree rooted at the directory in which path is evaluated
//   - is not an absolute path
//   - is not empty
//   - on Windows, is not a reserved name such as "NUL"
export function IsLocal(path: string): boolean {
  if (path === '' || IsAbs(path)) {
    return false
  }

  // Check for .. components that would escape
  const segments = path.split('/')
  let depth = 0

  for (const segment of segments) {
    if (segment === '..') {
      depth--
      if (depth < 0) {
        return false
      }
    } else if (segment !== '.' && segment !== '') {
      depth++
    }
  }

  return true
}

// SplitList splits a list of paths joined by the OS-specific ListSeparator,
// usually found in PATH or GOPATH environment variables.
// Unlike strings.Split, SplitList returns an empty slice when passed an empty string.
export function SplitList(path: string): string[] {
  if (path === '') {
    return []
  }
  return path.split(String.fromCharCode(ListSeparator))
}

// HasPrefix tests whether the path p begins with prefix.
export function HasPrefix(p: string, prefix: string): boolean {
  if (prefix === '') {
    return true
  }

  // Normalize both paths
  const normalP = Clean(p)
  const normalPrefix = Clean(prefix)

  if (normalP === normalPrefix) {
    return true
  }

  // Check if p starts with prefix followed by a separator
  if (normalP.startsWith(normalPrefix)) {
    const remaining = normalP.substring(normalPrefix.length)
    return remaining.startsWith('/')
  }

  return false
}

// Abs returns an absolute representation of path. If the path is not absolute
// it is joined with the current working directory to turn it into an absolute
// path, then Cleaned. This mirrors Go's filepath.Abs, which calls os.Getwd for
// relative inputs rather than fabricating a root.
export function Abs(path: string): [string, $.GoError] {
  if (IsAbs(path)) {
    return [Clean(path), null]
  }
  const wd = getCurrentWorkingDirectory()
  if (wd === null) {
    return ['', $.newError('filepath: cannot determine working directory')]
  }
  return [Join(wd, path), null]
}

export function Rel(basepath: string, targpath: string): [string, $.GoError] {
  const base = Clean(basepath)
  const targ = Clean(targpath)
  if (targ === base) {
    return ['.', null]
  }

  const b = base === '.' ? '' : base
  const t = targ === '.' ? '' : targ
  const baseSlashed = b.length > 0 && b[0] === '/'
  const targSlashed = t.length > 0 && t[0] === '/'
  if (baseSlashed !== targSlashed) {
    return [
      '',
      $.newError(`Rel: can't make ${targpath} relative to ${basepath}`),
    ]
  }

  // Walk both paths element by element until they first differ.
  const bl = b.length
  const tl = t.length
  let b0 = 0
  let bi = 0
  let t0 = 0
  let ti = 0
  for (;;) {
    while (bi < bl && b[bi] !== '/') {
      bi++
    }
    while (ti < tl && t[ti] !== '/') {
      ti++
    }
    if (t.slice(t0, ti) !== b.slice(b0, bi)) {
      break
    }
    if (bi < bl) {
      bi++
    }
    if (ti < tl) {
      ti++
    }
    b0 = bi
    t0 = ti
  }
  if (b.slice(b0, bi) === '..') {
    return [
      '',
      $.newError(`Rel: can't make ${targpath} relative to ${basepath}`),
    ]
  }

  if (b0 !== bl) {
    // Base elements remain; emit one ".." per leftover base element, then the
    // remaining target tail.
    let seps = 0
    for (let i = b0; i < bl; i++) {
      if (b[i] === '/') {
        seps++
      }
    }
    let out = '..'
    for (let i = 0; i < seps; i++) {
      out += '/..'
    }
    if (t0 !== tl) {
      out += '/' + t.slice(t0)
    }
    return [out, null]
  }
  return [t.slice(t0), null]
}

// EvalSymlinks returns the path name after the evaluation of any symbolic
// links. This is a lexical port of Go's path/filepath walkSymlinks: it resolves
// each component with Lstat and follows symlinks with Readlink, preserving the
// relative-vs-absolute shape of the input. It deliberately does not use a host
// realpath, which would always force an absolute result and would not surface
// Go's per-component ENOTDIR and link-cycle errors. volLen is 0 for a relative
// input and 1 for an absolute root.
export function EvalSymlinks(path: string): [string, $.GoError] {
  let p = path
  const volLen = p.length > 0 && p[0] === '/' ? 1 : 0
  const vol = p.slice(0, volLen)
  let dest = vol
  let linksWalked = 0
  for (let start = volLen; start < p.length; ) {
    while (start < p.length && p[start] === '/') {
      start++
    }
    let end = start
    while (end < p.length && p[end] !== '/') {
      end++
    }

    const component = p.slice(start, end)
    if (end === start) {
      break
    } else if (component === '.') {
      start = end
      continue
    } else if (component === '..') {
      // Back up to the previous component unless it is itself a kept "..".
      let r = dest.length - 1
      for (; r >= volLen; r--) {
        if (dest[r] === '/') {
          break
        }
      }
      if (r < volLen || dest.slice(r + 1) === '..') {
        if (dest.length > volLen) {
          dest += '/'
        }
        dest += '..'
      } else {
        dest = dest.slice(0, r)
      }
      start = end
      continue
    }

    if (dest.length > volLen && dest[dest.length - 1] !== '/') {
      dest += '/'
    }
    dest += component

    const [stat, statErr] = lstatPath(dest)
    if (statErr !== null) {
      return ['', statErr]
    }
    if (!statIsSymlink(stat!)) {
      if (!statIsDir(stat!) && end < p.length) {
        return ['', $.newError('not a directory')]
      }
      start = end
      continue
    }

    linksWalked++
    if (linksWalked > 255) {
      return ['', $.newError('EvalSymlinks: too many links')]
    }
    const [link, linkErr] = readlinkPath(dest)
    if (linkErr !== null) {
      return ['', linkErr]
    }
    p = link! + p.slice(end)
    if (link!.length > 0 && link![0] === '/') {
      // Absolute symlink target: restart from the root.
      dest = '/'
    } else {
      // Relative symlink target: replace the last component of dest.
      let r = dest.length - 1
      for (; r >= volLen; r--) {
        if (dest[r] === '/') {
          break
        }
      }
      dest = r < volLen ? vol : dest.slice(0, r)
    }
    start = 0
  }
  return [Clean(dest), null]
}

export function Glob(_pattern: string): [string[], $.GoError] {
  // No filesystem support, return empty array
  return [[], null]
}

// WalkFunc is the type of the function called for each file or directory
// visited by Walk. The path argument contains the argument to Walk as a
// prefix; that is, if Walk is called with "dir" and finds a file "a"
// in that directory, the walk function will be called with argument
// "dir/a". The info argument is the fs.FileInfo for the named path.
export type WalkFunc = (
  path: string,
  info: any,
  err: $.GoError,
) => $.GoError | Promise<$.GoError>

export async function Walk(root: string, walkFn: WalkFunc): Promise<$.GoError> {
  return await walkHost(root, walkFn)
}

export type WalkDirFunc = (
  path: string,
  d: DirEntry,
  err: $.GoError,
) => $.GoError | Promise<$.GoError>

export async function WalkDir(
  root: string,
  walkFn: WalkDirFunc,
): Promise<$.GoError> {
  return await walkDirHost(root, walkFn)
}

// Localize converts a slash-separated path into an operating system path.
// The input must be a valid path as reported by io/fs.ValidPath. On a
// Unix-like target the only further restriction is the absence of a NUL byte.
export function Localize(path: string): [string, $.GoError] {
  if (!ValidPath(path) || path.indexOf('\x00') >= 0) {
    return ['', $.newError('invalid path')]
  }
  return [path, null]
}

type HostStat = {
  isDirectory?: boolean | (() => boolean)
  mode?: number
  mtimeMs?: number
  size?: number
}

type HostEntry = {
  name: string
  isDir: boolean
}

function hostError(err: unknown): $.GoError {
  const message =
    err instanceof Error ? err.message
    : typeof err === 'string' ? err
    : String(err)
  return { Error: () => message }
}

function statIsDir(stat: HostStat): boolean {
  if (typeof stat.isDirectory === 'function') {
    return stat.isDirectory()
  }
  return !!stat.isDirectory
}

function statIsSymlink(stat: any): boolean {
  if (typeof stat?.isSymbolicLink === 'function') {
    return stat.isSymbolicLink()
  }
  return !!stat?.isSymlink
}

function fileInfo(path: string, stat: HostStat): any {
  return {
    IsDir: () => statIsDir(stat),
    ModTime: () => null,
    Mode: () => (stat.mode ?? 0) + (statIsDir(stat) ? 2147483648 : 0),
    Name: () => Base(path),
    Size: () => stat.size ?? 0,
    Sys: () => stat,
  }
}

function dirEntry(path: string, stat: HostStat): DirEntry {
  return FileInfoToDirEntry(fileInfo(path, stat))
}

// lstatPath stats a path without following a terminal symlink, matching Go's
// Walk/WalkDir, which Lstat every entry so a symlinked directory is reported as
// a symlink and is never descended into. Falls back to stat only when the host
// exposes no lstat.
function lstatPath(path: string): [HostStat | null, $.GoError] {
  const runtime = getHostRuntime()
  const deno = runtime.deno
  const denoStat = deno?.lstatSync ?? deno?.statSync
  if (denoStat) {
    try {
      return [denoStat.call(deno, path), null]
    } catch (err) {
      return [null, hostError(err)]
    }
  }

  const nodeFS = runtime.nodeFS
  const nodeStat = nodeFS?.lstatSync ?? nodeFS?.statSync
  if (nodeStat) {
    try {
      return [nodeStat.call(nodeFS, path), null]
    } catch (err) {
      return [null, hostError(err)]
    }
  }

  return [null, $.newError('filesystem not supported')]
}

function readlinkPath(path: string): [string | null, $.GoError] {
  const runtime = getHostRuntime()
  const deno = runtime.deno
  if (deno?.readLinkSync) {
    try {
      return [deno.readLinkSync(path), null]
    } catch (err) {
      return [null, hostError(err)]
    }
  }

  const nodeFS = runtime.nodeFS
  if (nodeFS?.readlinkSync) {
    try {
      return [String(nodeFS.readlinkSync(path)), null]
    } catch (err) {
      return [null, hostError(err)]
    }
  }

  return [null, $.newError('filesystem not supported')]
}

function readDir(path: string): [HostEntry[] | null, $.GoError] {
  const runtime = getHostRuntime()
  if (runtime.deno?.readDirSync) {
    try {
      const entries: HostEntry[] = []
      for (const entry of runtime.deno.readDirSync(path)) {
        entries.push({ name: entry.name, isDir: !!entry.isDirectory })
      }
      entries.sort((a, b) => a.name.localeCompare(b.name))
      return [entries, null]
    } catch (err) {
      return [null, hostError(err)]
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
      return [entries, null]
    } catch (err) {
      return [null, hostError(err)]
    }
  }

  return [null, $.newError('filesystem not supported')]
}

async function walkHost(path: string, walkFn: WalkFunc): Promise<$.GoError> {
  const [stat, statErr] = lstatPath(path)
  if (statErr !== null) {
    return await walkFn(path, null, statErr)
  }

  const visitErr = await walkFn(path, fileInfo(path, stat!), null)
  if (visitErr === SkipAll) {
    return null
  }
  if (visitErr !== null) {
    if (visitErr === SkipDir && statIsDir(stat!)) {
      return null
    }
    return visitErr
  }
  if (!statIsDir(stat!)) {
    return null
  }

  const [entries, readErr] = readDir(path)
  if (readErr !== null) {
    return await walkFn(path, fileInfo(path, stat!), readErr)
  }
  for (const entry of entries!) {
    const err = await walkHost(Join(path, entry.name), walkFn)
    if (err === SkipDir) {
      if (entry.isDir) {
        continue
      }
      return err
    }
    if (err === SkipAll) {
      return null
    }
    if (err !== null) {
      return err
    }
  }
  return null
}

function normalizeWalkDirErr(d: DirEntry, err: $.GoError): $.GoError {
  if (err === SkipAll) {
    return null
  }
  if (err === SkipDir && d?.IsDir?.()) {
    return null
  }
  return err
}

function normalizeRootWalkDirErr(err: $.GoError): $.GoError {
  if (err === SkipAll || err === SkipDir) {
    return null
  }
  return err
}

async function walkDirHost(
  path: string,
  walkFn: WalkDirFunc,
): Promise<$.GoError> {
  const [stat, statErr] = lstatPath(path)
  if (statErr !== null) {
    return normalizeRootWalkDirErr(await walkFn(path, null, statErr))
  }

  const d = dirEntry(path, stat!)
  const visitErr = await walkFn(path, d, null)
  if (visitErr === SkipAll) {
    return null
  }
  if (visitErr === SkipDir && statIsDir(stat!)) {
    return null
  }
  if (visitErr !== null || !statIsDir(stat!)) {
    return visitErr
  }

  const [entries, readErr] = readDir(path)
  if (readErr !== null) {
    return normalizeWalkDirErr(d, await walkFn(path, d, readErr))
  }

  for (const entry of entries!) {
    const err = await walkDirHost(Join(path, entry.name), walkFn)
    if (err === SkipDir) {
      if (entry.isDir) {
        continue
      }
      return err
    }
    if (err === SkipAll) {
      return null
    }
    if (err !== null) {
      return err
    }
  }
  return null
}

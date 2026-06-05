import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import type * as io from '@goscript/io/index.js'

export type WordEncoder = number

export const BEncoding: WordEncoder = 'b'.charCodeAt(0)
export const QEncoding: WordEncoder = 'q'.charCodeAt(0)

export const ErrInvalidMediaParameter = errors.New(
  'mime: invalid media parameter',
)

const extensionTypes = new Map<string, string>([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.htm', 'text/html; charset=utf-8'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.wasm', 'application/wasm'],
  ['.xml', 'text/xml; charset=utf-8'],
])

type nodeBufferConstructor = {
  from(data: Uint8Array): { toString(encoding: string): string }
  from(data: string, encoding: string): Uint8Array
}

type nodeProcess = {
  getBuiltinModule?: (
    name: string,
  ) => { Buffer?: nodeBufferConstructor } | undefined
}

export function FormatMediaType(
  t: string,
  param: Map<string, string> | Record<string, string> | null,
): string {
  const mediaType = formatMediaTypeDisposition(t)
  if (mediaType === '') {
    return ''
  }
  let out = mediaType
  const entries =
    param instanceof Map ?
      Array.from(param.entries())
    : Object.entries(param ?? {})
  entries.sort(([a], [b]) =>
    a < b ? -1
    : a > b ? 1
    : 0,
  )
  for (const [key, value] of entries) {
    if (!isToken(key)) {
      return ''
    }
    out += formatParam(key.toLowerCase(), String(value))
  }
  return out
}

export function ParseMediaType(
  v: string,
): [string, Map<string, string>, $.GoError] {
  const parts = splitMediaType(v)
  const mediatype = formatMediaTypeDisposition(parts.shift()?.trim() ?? '')
  if (mediatype === '') {
    return ['', new Map(), ErrInvalidMediaParameter]
  }
  const params = new Map<string, string>()
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (part.trim() === '' && i === parts.length - 1) {
      break
    }
    const eq = part.indexOf('=')
    if (eq < 0) {
      return [mediatype, params, ErrInvalidMediaParameter]
    }
    const key = part.slice(0, eq).trim().toLowerCase()
    const rawValue = part.slice(eq + 1).trim()
    const value = parseParamValue(rawValue)
    if (!isToken(key)) {
      return [mediatype, params, ErrInvalidMediaParameter]
    }
    if (value === null) {
      return [mediatype, params, ErrInvalidMediaParameter]
    }
    if (key.endsWith('*')) {
      const decoded = decode2231Value(value)
      if (decoded !== null) {
        if (
          params.has(key.slice(0, -1)) &&
          params.get(key.slice(0, -1)) !== decoded
        ) {
          return ['', new Map(), ErrInvalidMediaParameter]
        }
        params.set(key.slice(0, -1), decoded)
      }
      continue
    }
    if (params.has(key) && params.get(key) !== value) {
      return ['', new Map(), ErrInvalidMediaParameter]
    }
    params.set(key, value)
  }
  return [mediatype, params, null]
}

export function AddExtensionType(ext: string, typ: string): $.GoError {
  if (!ext.startsWith('.')) {
    return ErrInvalidMediaParameter
  }
  const [, , err] = ParseMediaType(typ)
  if (err !== null) {
    return err
  }
  extensionTypes.set(ext.toLowerCase(), typ)
  return null
}

export function ExtensionsByType(typ: string): [$.Slice<string>, $.GoError] {
  const [mediaType, , err] = ParseMediaType(typ)
  if (err !== null) {
    return [null, err]
  }
  const out: string[] = []
  for (const [ext, extType] of extensionTypes) {
    const [known] = ParseMediaType(extType)
    if (known === mediaType) {
      out.push(ext)
    }
  }
  out.sort()
  return [$.arrayToSlice(out), null]
}

export function TypeByExtension(ext: string): string {
  return extensionTypes.get(ext.toLowerCase()) ?? ''
}

export class WordDecoder {
  public CharsetReader:
    | ((charset: string, input: io.Reader) => [io.Reader | null, $.GoError])
    | null = null

  public Decode(word: string): [string, $.GoError] {
    const decoded = decodeWord(word)
    if (decoded === null) {
      return ['', ErrInvalidMediaParameter]
    }
    return [decoded, null]
  }

  public DecodeHeader(header: string): [string, $.GoError] {
    return [
      header.replace(/=\?[^?\s]+\?[bBqQ]\?[^?\s]*\?=/g, (word) => {
        return decodeWord(word) ?? word
      }),
      null,
    ]
  }
}

export function WordEncoder_Encode(
  e: WordEncoder,
  charset: string,
  s: string,
): string {
  if (s === '') {
    return ''
  }
  if (!needsWordEncoding(s)) {
    return s
  }
  const encoding = String.fromCharCode(e).toLowerCase() === 'q' ? 'Q' : 'B'
  const body =
    encoding === 'Q' ? qEncode(s) : base64Encode(new TextEncoder().encode(s))
  return `=?${charset}?${encoding}?${body}?=`
}

function needsWordEncoding(value: string): boolean {
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0
    if ((code < 0x20 || code > 0x7e) && char !== '\t') {
      return true
    }
  }
  return false
}

function formatParam(key: string, value: string): string {
  if (needsWordEncoding(value)) {
    return `; ${key}*=utf-8''${percentEncode(value)}`
  }
  if (isToken(value)) {
    return `; ${key}=${value}`
  }
  return `; ${key}="${value.replace(/(["\\])/g, '\\$1')}"`
}

function isToken(value: string): boolean {
  return /^[!#$%&'*+\-.^_`{}|~0-9A-Za-z]+$/.test(value)
}

function parseParamValue(value: string): string | null {
  if (value.startsWith('"')) {
    return parseQuotedParamValue(value)
  }
  return isToken(value) ? value : null
}

function parseQuotedParamValue(value: string): string | null {
  let out = ''
  for (let i = 1; i < value.length; i++) {
    const char = value[i]
    if (char === '"') {
      return i === value.length - 1 ? out : null
    }
    if (char === '\\' && i + 1 < value.length && isTSpecial(value[i + 1])) {
      out += value[i + 1]
      i++
      continue
    }
    if (char === '\r' || char === '\n') {
      return null
    }
    out += char
  }
  return null
}

function isTSpecial(value: string): boolean {
  return '()<>@,;:\\"/[]?='.includes(value)
}

function formatMediaTypeDisposition(value: string): string {
  const slash = value.indexOf('/')
  if (slash < 0) {
    return isToken(value) ? value.toLowerCase() : ''
  }
  if (slash === 0 || slash === value.length - 1) {
    return ''
  }
  const major = value.slice(0, slash)
  const sub = value.slice(slash + 1)
  if (!isToken(major) || !isToken(sub)) {
    return ''
  }
  return `${major.toLowerCase()}/${sub.toLowerCase()}`
}

function percentEncode(value: string): string {
  let out = ''
  for (const byte of new TextEncoder().encode(value)) {
    if (
      (byte >= 0x30 && byte <= 0x39) ||
      (byte >= 0x41 && byte <= 0x5a) ||
      (byte >= 0x61 && byte <= 0x7a) ||
      byte === 0x21 ||
      byte === 0x23 ||
      byte === 0x24 ||
      byte === 0x26 ||
      byte === 0x2b ||
      byte === 0x2d ||
      byte === 0x2e ||
      byte === 0x5e ||
      byte === 0x5f ||
      byte === 0x60 ||
      byte === 0x7c ||
      byte === 0x7e
    ) {
      out += String.fromCharCode(byte)
      continue
    }
    out += `%${byte.toString(16).toUpperCase().padStart(2, '0')}`
  }
  return out
}

function decode2231Value(value: string): string | null {
  const first = value.indexOf("'")
  if (first < 0) {
    return null
  }
  const second = value.indexOf("'", first + 1)
  if (second < 0) {
    return null
  }
  const charset = value.slice(0, first).toLowerCase()
  if (charset !== 'utf-8' && charset !== 'us-ascii') {
    return null
  }
  const bytes = percentDecode(value.slice(second + 1))
  if (bytes === null) {
    return null
  }
  if (charset === 'us-ascii' && bytes.some((byte) => byte > 0x7f)) {
    return null
  }
  return new TextDecoder('utf-8').decode(bytes)
}

function percentDecode(value: string): Uint8Array | null {
  const bytes: number[] = []
  for (let i = 0; i < value.length; i++) {
    if (value[i] !== '%') {
      bytes.push(value.charCodeAt(i))
      continue
    }
    if (i + 2 >= value.length || !isHex(value[i + 1]) || !isHex(value[i + 2])) {
      return null
    }
    bytes.push(Number.parseInt(value.slice(i + 1, i + 3), 16))
    i += 2
  }
  return new Uint8Array(bytes)
}

function isHex(char: string): boolean {
  return /^[0-9A-Fa-f]$/.test(char)
}

function splitMediaType(value: string): string[] {
  const parts: string[] = []
  let current = ''
  let quoted = false
  for (let i = 0; i < value.length; i++) {
    const char = value[i]
    if (char === '"' && value[i - 1] !== '\\') {
      quoted = !quoted
    }
    if (char === ';' && !quoted) {
      parts.push(current)
      current = ''
      continue
    }
    current += char
  }
  parts.push(current)
  return parts
}

function base64Encode(bytes: Uint8Array): string {
  const chars = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
  if (typeof btoa === 'function') {
    return btoa(chars)
  }
  const buffer = nodeBuffer()
  if (buffer != null) {
    return buffer.from(bytes).toString('base64')
  }
  throw new Error('mime: base64 encoder unavailable')
}

function base64Decode(text: string): Uint8Array {
  if (typeof atob === 'function') {
    return new Uint8Array(Array.from(atob(text), (char) => char.charCodeAt(0)))
  }
  const buffer = nodeBuffer()
  if (buffer != null) {
    return new Uint8Array(buffer.from(text, 'base64'))
  }
  throw new Error('mime: base64 decoder unavailable')
}

function nodeBuffer(): nodeBufferConstructor | null {
  const processObj = (globalThis as { process?: nodeProcess }).process
  return processObj?.getBuiltinModule?.('buffer')?.Buffer ?? null
}

function qEncode(value: string): string {
  let out = ''
  for (const byte of new TextEncoder().encode(value)) {
    if (byte === 0x20) {
      out += '_'
      continue
    }
    if (
      (byte >= 0x30 && byte <= 0x39) ||
      (byte >= 0x41 && byte <= 0x5a) ||
      (byte >= 0x61 && byte <= 0x7a)
    ) {
      out += String.fromCharCode(byte)
      continue
    }
    out += `=${byte.toString(16).toUpperCase().padStart(2, '0')}`
  }
  return out
}

function qDecode(value: string): string {
  const bytes: number[] = []
  for (let i = 0; i < value.length; i++) {
    const char = value[i]
    if (char === '_') {
      bytes.push(0x20)
      continue
    }
    if (char === '=' && i + 2 < value.length) {
      bytes.push(Number.parseInt(value.slice(i + 1, i + 3), 16))
      i += 2
      continue
    }
    bytes.push(char.charCodeAt(0))
  }
  return new TextDecoder().decode(new Uint8Array(bytes))
}

function decodeWord(word: string): string | null {
  const match = /^=\?([^?]+)\?([bBqQ])\?([^?]*)\?=$/.exec(word)
  if (match === null) {
    return null
  }
  const [, charset, encoding, body] = match
  if (!/^utf-?8$|^us-ascii$/i.test(charset)) {
    return null
  }
  if (encoding.toLowerCase() === 'b') {
    return new TextDecoder().decode(base64Decode(body))
  }
  return qDecode(body)
}

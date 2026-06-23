// Handwritten TypeScript implementation of Go's fmt package
// Optimized for JavaScript runtime and simplified for common use cases

import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import { writeHostStdoutText } from '@goscript/builtin/hostio.js'

// Basic interfaces
export interface Stringer {
  String(): string
}

export interface GoStringer {
  GoString(): string
}

export interface Formatter {
  Format(f: State, verb: number): void
}

export interface State {
  Flag(c: number): boolean
  Precision(): [number, boolean]
  Width(): [number, boolean]
  Write(b: $.Bytes): [number, $.GoError | null]
}

// Simple printf-style formatting implementation
function formatValue(value: any, verb: string): string {
  if (value === null || value === undefined) {
    return '<nil>'
  }

  switch (verb) {
    case 'v': // default format
      return defaultFormat(value)
    case 'w': // wrapped error
      return defaultFormat(value)
    case 'd': // decimal integer
      return String(Math.trunc(Number(value)))
    case 'f': // decimal point, no exponent
      return Number(value).toString()
    case 's': // string
      if (typeof value === 'string') return value
      if (value instanceof Uint8Array) return $.bytesToString(value)
      return defaultFormat(value)
    case 't': // boolean
      return value ? 'true' : 'false'
    case 'T': // type (approximate Go names for primitives we need)
      if (hasGoTypeName(value)) return value.__goType
      if (typeof value === 'number') {
        return Number.isInteger(value) ? 'int' : 'float64'
      }
      if (typeof value === 'boolean') return 'bool'
      if (typeof value === 'string') return 'string'
      return typeof value
    case 'c': // character (Unicode code point)
      // Go's %c encodes the rune as a Unicode character; fromCharCode truncates
      // any code point above U+FFFF and mangles surrogates. runeToString owns
      // the Go string(rune) rule (astral intact, invalid -> U+FFFD, no throw).
      return $.runeToString(Number(value))
    case 'x': // hexadecimal lowercase
      return Number(value).toString(16)
    case 'X': // hexadecimal uppercase
      return Number(value).toString(16).toUpperCase()
    case 'o': // octal
      return Number(value).toString(8)
    case 'b': // binary
      return Number(value).toString(2)
    case 'e': // scientific notation lowercase
      return Number(value).toExponential()
    case 'E': // scientific notation uppercase
      return Number(value).toExponential().toUpperCase()
    case 'g': // %e for large exponents, %f otherwise
      return Number(value).toPrecision()
    case 'G': // %E for large exponents, %F otherwise
      return Number(value).toPrecision().toUpperCase()
    case 'q': // quoted string / rune
      if (typeof value === 'number' && Number.isInteger(value)) {
        // emulate quoted rune; runeToString avoids fromCodePoint throwing on
        // invalid code points and maps them to U+FFFD as Go's %q does.
        return JSON.stringify($.runeToString(value))
      }
      return JSON.stringify(String(value))
    case 'p': {
      // pointer (address)
      const addr = (value as any)?.__address
      if (typeof addr === 'number') return '0x' + addr.toString(16)
      return '0x0'
    }
    default:
      return String(value)
  }
}

function hasGoTypeName(value: unknown): value is { __goType: string } {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as { __goType?: unknown }).__goType === 'string'
  )
}

type MaybeString = string | PromiseLike<string>

function isPromiseLike<T = unknown>(value: unknown): value is PromiseLike<T> {
  return (
    value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof (value as { then?: unknown }).then === 'function'
  )
}

function toMaybeString(value: unknown): MaybeString {
  if (isPromiseLike(value)) {
    return value.then((resolved) => String(resolved))
  }
  return String(value)
}

function joinMaybe(
  parts: MaybeString[],
  separator: string,
  prefix = '',
  suffix = '',
): MaybeString {
  if (parts.some(isPromiseLike)) {
    return Promise.all(parts.map((part) => Promise.resolve(part))).then(
      (resolved) => `${prefix}${resolved.join(separator)}${suffix}`,
    )
  }
  return `${prefix}${(parts as string[]).join(separator)}${suffix}`
}

function defaultFormat(value: any): string {
  const formatted = defaultFormatMaybe(value)
  if (isPromiseLike(formatted)) {
    return String(formatted)
  }
  return formatted
}

function defaultFormatMaybe(value: any): MaybeString {
  if (value === null || value === undefined) return '<nil>'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'string') return value
  if (Array.isArray(value))
    return joinMaybe(value.map(defaultFormatMaybe), ' ', '[', ']')
  if (typeof value === 'object') {
    // Prefer GoStringer if present
    if (
      (value as any).GoString &&
      typeof (value as any).GoString === 'function'
    ) {
      try {
        return toMaybeString((value as any).GoString())
      } catch {
        // Ignore error by continuing to next case.
      }
    }
    // Prefer error interface if present
    if ((value as any).Error && typeof (value as any).Error === 'function') {
      try {
        return toMaybeString((value as any).Error())
      } catch {
        // Ignore error by continuing to next case.
      }
    }
    // Check for Stringer interface
    if ((value as any).String && typeof (value as any).String === 'function') {
      try {
        return toMaybeString((value as any).String())
      } catch {
        // Ignore error by continuing to next case.
      }
    }
    if ('__goValue' in value) {
      return defaultFormatMaybe((value as { __goValue: unknown }).__goValue)
    }
    // Basic Map/Set rendering
    if (value instanceof Map) {
      const parts: MaybeString[] = []
      for (const [k, v] of (value as Map<any, any>).entries()) {
        const key = defaultFormatMaybe(k)
        const elem = defaultFormatMaybe(v)
        if (isPromiseLike(key) || isPromiseLike(elem)) {
          parts.push(
            Promise.all([Promise.resolve(key), Promise.resolve(elem)]).then(
              ([resolvedKey, resolvedElem]) => `${resolvedKey}:${resolvedElem}`,
            ),
          )
        } else {
          parts.push(`${key}:${elem}`)
        }
      }
      return joinMaybe(parts, ' ', '{', '}')
    }
    if (value instanceof Set) {
      const parts: MaybeString[] = []
      for (const v of (value as Set<any>).values()) {
        parts.push(defaultFormatMaybe(v))
      }
      return joinMaybe(parts, ' ', '[', ']')
    }
    // Default object representation
    if (
      (value as any).constructor?.name &&
      (value as any).constructor.name !== 'Object'
    ) {
      const parts = Object.entries(value as Record<string, any>).map(
        ([k, v]) => {
          const formatted = defaultFormatMaybe(v)
          if (isPromiseLike(formatted)) {
            return formatted.then((resolved) => `${k}:${resolved}`)
          }
          return `${k}:${formatted}`
        },
      )
      return joinMaybe(parts, ' ', '{', '}')
    }
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

function parseFormat(format: string, args: any[]): string {
  const formatted = parseFormatMaybe(format, args, false)
  if (isPromiseLike(formatted)) {
    return String(formatted)
  }
  return formatted
}

function formatValueMaybe(value: any, verb: string): MaybeString {
  switch (verb) {
    case 'v':
    case 'w':
    case 's':
      if (verb === 's') {
        if (typeof value === 'string') return value
        if (value instanceof Uint8Array) return $.bytesToString(value)
      }
      return defaultFormatMaybe(value)
    default:
      return formatValue(value, verb)
  }
}

function applyFormatOptions(
  formatted: MaybeString,
  arg: any,
  verb: string,
  flags: string,
  width: string,
  precision: string,
): MaybeString {
  const apply = (text: string): string => {
    let result = text
    if (width && !precision) {
      const w = parseInt(width)
      if (flags.includes('-')) {
        result = result.padEnd(w)
      } else {
        result = result.padStart(w, flags.includes('0') ? '0' : ' ')
      }
    } else if (precision && (verb === 'f' || verb === 'e' || verb === 'g')) {
      const p = parseInt(precision)
      const num = Number(arg)
      if (verb === 'f') {
        result = num.toFixed(p)
      } else if (verb === 'e') {
        result = num.toExponential(p)
      } else if (verb === 'g') {
        result = num.toPrecision(p)
      }

      if (width) {
        const w = parseInt(width)
        if (flags.includes('-')) {
          result = result.padEnd(w)
        } else {
          result = result.padStart(w)
        }
      }
    }
    return result
  }
  if (isPromiseLike(formatted)) {
    return formatted.then(apply)
  }
  return apply(formatted)
}

function parseFormatMaybe(
  format: string,
  args: any[],
  allowAsync = true,
): MaybeString {
  const parts: MaybeString[] = []
  let argIndex = 0

  for (let i = 0; i < format.length; i++) {
    if (format[i] === '%') {
      if (i + 1 < format.length) {
        const nextChar = format[i + 1]
        if (nextChar === '%') {
          parts.push('%')
          i++ // skip the next %
          continue
        }

        // Parse format specifier
        let j = i + 1
        let width = ''
        let precision = ''
        let flags = ''

        // Parse flags (-, +, #, 0, space)
        while (j < format.length && '+-# 0'.includes(format[j])) {
          flags += format[j]
          j++
        }

        // Parse width
        while (j < format.length && format[j] >= '0' && format[j] <= '9') {
          width += format[j]
          j++
        }

        // Parse precision
        if (j < format.length && format[j] === '.') {
          j++
          while (j < format.length && format[j] >= '0' && format[j] <= '9') {
            precision += format[j]
            j++
          }
        }

        // Get the verb
        if (j < format.length) {
          const verb = format[j]

          if (argIndex < args.length) {
            const arg = args[argIndex]
            let formatted: MaybeString | null =
              allowAsync ?
                formatWithStateMaybe(arg, verb, flags, width, precision)
              : formatWithState(arg, verb, flags, width, precision)
            if (formatted === null) {
              formatted =
                allowAsync ?
                  formatValueMaybe(arg, verb)
                : formatValue(arg, verb)
            }

            parts.push(
              applyFormatOptions(formatted, arg, verb, flags, width, precision),
            )
            argIndex++
          } else {
            parts.push(`%!${verb}(MISSING)`)
          }

          i = j
        } else {
          parts.push(format[i])
        }
      } else {
        parts.push(format[i])
      }
    } else {
      parts.push(format[i])
    }
  }

  return joinMaybe(parts, '')
}

function formatWithState(
  value: any,
  verb: string,
  flags: string,
  width: string,
  precision: string,
): string | null {
  if (!value || typeof value.Format !== 'function' || value.Format.length < 2) {
    return null
  }

  let out = ''
  const state: State = {
    Flag(c: number): boolean {
      return flags.includes(String.fromCharCode(c))
    },
    Precision(): [number, boolean] {
      return precision === '' ? [0, false] : [parseInt(precision), true]
    },
    Width(): [number, boolean] {
      return width === '' ? [0, false] : [parseInt(width), true]
    },
    Write(b: $.Bytes): [number, $.GoError | null] {
      const text = $.bytesToString(b)
      out += text
      return [text.length, null]
    },
  }

  value.Format(state, verb.codePointAt(0) ?? 0)
  return out
}

function formatWithStateMaybe(
  value: any,
  verb: string,
  flags: string,
  width: string,
  precision: string,
): MaybeString | null {
  if (!value || typeof value.Format !== 'function' || value.Format.length < 2) {
    return null
  }

  let out = ''
  const state: State = {
    Flag(c: number): boolean {
      return flags.includes(String.fromCharCode(c))
    },
    Precision(): [number, boolean] {
      return precision === '' ? [0, false] : [parseInt(precision), true]
    },
    Width(): [number, boolean] {
      return width === '' ? [0, false] : [parseInt(width), true]
    },
    Write(b: $.Bytes): [number, $.GoError | null] {
      const text = $.bytesToString(b)
      out += text
      return [text.length, null]
    },
  }

  const result = value.Format(state, verb.codePointAt(0) ?? 0)
  if (isPromiseLike(result)) {
    return result.then(() => out)
  }
  return out
}

// Global stdout simulation for Print functions
let stdout = {
  write: (data: string) => {
    writeHostStdoutText(data)
  },
}

// Print functions
export function Print(...a: any[]): [number, $.GoError | null] {
  // Go rule: add spaces between operands only when neither is a string
  let out = ''
  for (let i = 0; i < a.length; i++) {
    if (i > 0) {
      const prevIsString = typeof a[i - 1] === 'string'
      const currIsString = typeof a[i] === 'string'
      if (!prevIsString && !currIsString) out += ' '
    }
    out += defaultFormat(a[i])
  }
  stdout.write(out)
  return [out.length, null]
}

export function Printf(
  format: string,
  ...a: any[]
): [number, $.GoError | null] {
  const result = parseFormat(format, a)
  stdout.write(result)
  return [result.length, null]
}

export function Println(...a: any[]): [number, $.GoError | null] {
  // Go Println: always space-separate operands, then newline
  const body = a.map(defaultFormat).join(' ')
  const result = body + '\n'
  stdout.write(result)
  return [result.length, null]
}

// Sprint functions (return strings)
export function Sprint(...a: any[]): string {
  // Go rule: add spaces between operands only when neither is a string
  let out = ''
  for (let i = 0; i < a.length; i++) {
    if (i > 0) {
      const prevIsString = typeof a[i - 1] === 'string'
      const currIsString = typeof a[i] === 'string'
      if (!prevIsString && !currIsString) out += ' '
    }
    out += defaultFormat(a[i])
  }
  return out
}

export function Sprintf(format: string, ...a: any[]): string {
  return parseFormatMaybe(format, a) as string
}

export function Sprintln(...a: any[]): string {
  return a.map(defaultFormat).join(' ') + '\n'
}

async function writeToWriter(
  w: any,
  out: string,
): Promise<[number, $.GoError | null]> {
  if (w && w.Write) {
    return await w.Write(new TextEncoder().encode(out))
  }
  return [0, $.newError('Writer does not implement Write method')]
}

// Fprint functions (write to Writer) - simplified implementation
export async function Fprint(
  w: any,
  ...a: any[]
): Promise<[number, $.GoError | null]> {
  // Same spacing as Print
  let out = ''
  for (let i = 0; i < a.length; i++) {
    if (i > 0) {
      const prevIsString = typeof a[i - 1] === 'string'
      const currIsString = typeof a[i] === 'string'
      if (!prevIsString && !currIsString) out += ' '
    }
    out += defaultFormat(a[i])
  }
  return await writeToWriter(w, out)
}

export async function Fprintf(
  w: any,
  format: string,
  ...a: any[]
): Promise<[number, $.GoError | null]> {
  const result = parseFormat(format, a)
  return await writeToWriter(w, result)
}

export async function Fprintln(
  w: any,
  ...a: any[]
): Promise<[number, $.GoError | null]> {
  // Same behavior as Println
  const body = a.map(defaultFormat).join(' ')
  const result = body + '\n'
  return await writeToWriter(w, result)
}

// Append functions (append to byte slice)
export function Append(b: $.Bytes, ...a: any[]): $.Bytes {
  const result = a.map(defaultFormat).join(' ')
  const encoded = new TextEncoder().encode(result)
  const base = $.bytesToUint8Array(b)
  const newArray = new Uint8Array(base.length + encoded.length)
  newArray.set(base)
  newArray.set(encoded, base.length)
  return newArray
}

export function Appendf(b: $.Bytes, format: string, ...a: any[]): $.Bytes {
  const result = parseFormat(format, a)
  const encoded = new TextEncoder().encode(result)
  const base = $.bytesToUint8Array(b)
  const newArray = new Uint8Array(base.length + encoded.length)
  newArray.set(base)
  newArray.set(encoded, base.length)
  return newArray
}

export function Appendln(b: $.Bytes, ...a: any[]): $.Bytes {
  const result = a.map(defaultFormat).join(' ') + '\n'
  const encoded = new TextEncoder().encode(result)
  const base = $.bytesToUint8Array(b)
  const newArray = new Uint8Array(base.length + encoded.length)
  newArray.set(base)
  newArray.set(encoded, base.length)
  return newArray
}

// Error creation
export function Errorf(format: string, ...a: any[]): any {
  const message = parseFormat(format, a)
  const err = errors.New(message)
  // %w operands are wrapped: the result must Unwrap to them so errors.Is/As can
  // walk the chain. One %w unwraps to a single error; multiple %w (Go 1.20+)
  // unwrap to an []error, matching the depth-first traversal in errors.Is.
  const wrapped = errorfWrappedArgs(format, a)
  if (wrapped.length === 1) {
    ;(err as any).Unwrap = (): $.GoError => wrapped[0]
  } else if (wrapped.length > 1) {
    ;(err as any).Unwrap = (): $.GoError[] => wrapped
  }
  return err
}

// errorfWrappedArgs returns the error operands consumed by %w verbs, in order.
// It walks the format string with the same flag/width/precision/verb skip and
// the same positional arg consumption as parseFormat, so the operand a %w binds
// to here is exactly the one it formatted in the message.
function errorfWrappedArgs(format: string, args: any[]): $.GoError[] {
  const wrapped: $.GoError[] = []
  let argIndex = 0
  for (let i = 0; i < format.length; i++) {
    if (format[i] !== '%' || i + 1 >= format.length) {
      continue
    }
    if (format[i + 1] === '%') {
      i++
      continue
    }
    let j = i + 1
    while (j < format.length && '+-# 0'.includes(format[j])) j++
    while (j < format.length && format[j] >= '0' && format[j] <= '9') j++
    if (j < format.length && format[j] === '.') {
      j++
      while (j < format.length && format[j] >= '0' && format[j] <= '9') j++
    }
    if (j < format.length) {
      if (argIndex < args.length) {
        if (format[j] === 'w') {
          wrapped.push(args[argIndex] as $.GoError)
        }
        argIndex++
      }
      i = j
    }
  }
  return wrapped
}

// FormatString - simplified implementation
export function FormatString(state: State, verb: number): string {
  let result = '%'

  // Add flags
  if (state.Flag(32)) result += ' ' // space
  if (state.Flag(43)) result += '+' // plus
  if (state.Flag(45)) result += '-' // minus
  if (state.Flag(35)) result += '#' // hash
  if (state.Flag(48)) result += '0' // zero

  // Add width
  const [width, hasWidth] = state.Width()
  if (hasWidth) {
    result += width.toString()
  }

  // Add precision
  const [precision, hasPrecision] = state.Precision()
  if (hasPrecision) {
    result += '.' + precision.toString()
  }

  // Add verb
  result += String.fromCharCode(verb)

  return result
}

// Scanning functions - stubbed for now
export function Scan(..._a: any[]): [number, $.GoError | null] {
  // TODO: Implement scanning from stdin
  return [0, $.newError('Scan not implemented')]
}

export function Scanf(
  _format: string,
  ..._a: any[]
): [number, $.GoError | null] {
  // TODO: Implement formatted scanning from stdin
  return [0, $.newError('Scanf not implemented')]
}

export function Scanln(..._a: any[]): [number, $.GoError | null] {
  // TODO: Implement line scanning from stdin
  return [0, $.newError('Scanln not implemented')]
}

export function Sscan(_str: string, ..._a: any[]): [number, $.GoError | null] {
  // TODO: Implement scanning from string
  return [0, $.newError('Sscan not implemented')]
}

export function Sscanf(
  str: string,
  format: string,
  ...a: any[]
): [number, $.GoError | null] {
  const parts = buildScanPattern(format)
  if (parts == null) {
    return [0, $.newError(`unsupported Sscanf format: ${format}`)]
  }
  const match = parts.pattern.exec(str)
  if (match == null) {
    return [0, $.newError('input does not match format')]
  }

  let assigned = 0
  for (let i = 0; i < parts.verbs.length && i < a.length; i++) {
    const raw = match[i + 1]
    const value = parts.verbs[i] === 'd' ? Number.parseInt(raw, 10) : raw
    if (!assignScanValue(a[i], value)) {
      return [assigned, $.newError('scan destination is not assignable')]
    }
    assigned++
  }
  return [assigned, null]
}

function buildScanPattern(
  format: string,
): { pattern: RegExp; verbs: string[] } | null {
  let source = '^'
  const verbs: string[] = []
  for (let i = 0; i < format.length; i++) {
    const ch = format[i]
    if (ch !== '%') {
      source += /\s/.test(ch) ? '\\s+' : escapeRegExp(ch)
      continue
    }
    const verb = format[++i]
    if (verb === '%') {
      source += '%'
      continue
    }
    if (verb === 'd') {
      source += '([+-]?\\d+)'
      verbs.push(verb)
      continue
    }
    if (verb === 's') {
      source += '(\\S+)'
      verbs.push(verb)
      continue
    }
    return null
  }
  source += '$'
  return { pattern: new RegExp(source), verbs }
}

function assignScanValue(target: any, value: string | number): boolean {
  const ref =
    $.isVarRef(target) ? target
    : (
      target != null &&
      typeof target === 'object' &&
      $.isVarRef(target.__goValue)
    ) ?
      target.__goValue
    : null
  if (ref == null) {
    return false
  }
  ref.value = value
  return true
}

function escapeRegExp(ch: string): string {
  return ch.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
}

export function Sscanln(
  _str: string,
  ..._a: any[]
): [number, $.GoError | null] {
  // TODO: Implement line scanning from string
  return [0, $.newError('Sscanln not implemented')]
}

export function Fscan(_r: any, ..._a: any[]): [number, $.GoError | null] {
  // TODO: Implement scanning from Reader
  return [0, $.newError('Fscan not implemented')]
}

export function Fscanf(
  _r: any,
  _format: string,
  ..._a: any[]
): [number, $.GoError | null] {
  // TODO: Implement formatted scanning from Reader
  return [0, $.newError('Fscanf not implemented')]
}

export function Fscanln(_r: any, ..._a: any[]): [number, $.GoError | null] {
  // TODO: Implement line scanning from Reader
  return [0, $.newError('Fscanln not implemented')]
}

// Scanner and ScanState interfaces - stubbed
export interface Scanner {
  Scan(state: ScanState, verb: number): $.GoError | null
}

export interface ScanState {
  ReadRune(): [number, number, $.GoError | null]
  UnreadRune(): $.GoError | null
  SkipSpace(): void
  Token(
    skipSpace: boolean,
    f: (r: number) => boolean,
  ): [Uint8Array, $.GoError | null]
  Width(): [number, boolean]
  Read(buf: $.Bytes): [number, $.GoError | null]
}

import { asArray, isSliceProxy, type Slice } from './slice.js'

/**
 * formatPrintedArgs formats builtin println arguments deterministically.
 */
export function formatPrintedArgs(args: readonly any[]): string {
  return args.map((arg) => formatPrintedValue(arg)).join(' ')
}

/**
 * formatPrintedValue formats a single builtin println argument deterministically.
 */
export function formatPrintedValue(value: any): string {
  return formatValue(value, 0, false, new WeakSet<object>())
}

function formatValue(
  value: any,
  depth: number,
  nested: boolean,
  seen: WeakSet<object>,
): string {
  if (value === null) {
    return 'null'
  }

  if (value === undefined) {
    return '<nil>'
  }

  if (typeof value === 'string') {
    return nested ? JSON.stringify(value) : value
  }

  if (typeof value === 'boolean' || typeof value === 'number') {
    return String(value)
  }

  if (typeof value === 'bigint') {
    return value.toString()
  }

  if (value instanceof Uint8Array) {
    return formatUint8Array(value)
  }

  if (Array.isArray(value)) {
    return formatArray(value, depth, seen)
  }

  if (isSliceProxy(value as Slice<unknown>)) {
    return formatArray(asArray(value as Slice<unknown>), depth, seen)
  }

  if (typeof value === 'function') {
    return value.name ? `[Function: ${value.name}]` : '[Function]'
  }

  if (typeof value !== 'object') {
    return String(value)
  }

  if (seen.has(value)) {
    return '[Circular]'
  }
  seen.add(value)

  try {
    if (value instanceof Map) {
      return formatArray(
        Array.from(value.entries()).map(([k, v]) => `${formatValue(k, depth + 1, true, seen)} => ${formatValue(v, depth + 1, true, seen)}`),
        depth,
        seen,
      )
    }

    if (value instanceof Set) {
      return formatArray(Array.from(value.values()), depth, seen)
    }

    if (value instanceof Error) {
      return value.message || value.toString()
    }

    if (typeof value.GoString === 'function') {
      return value.GoString()
    }

    if (typeof value.Error === 'function') {
      return value.Error()
    }

    if (typeof value.String === 'function') {
      return value.String()
    }

    const entries = getObjectEntries(value)
    if (entries.length === 0) {
      return '{}'
    }

    return formatObject(entries, depth, seen)
  } finally {
    seen.delete(value)
  }
}

function formatUint8Array(value: Uint8Array): string {
  if (value.length === 0) {
    return 'Uint8Array(0) []'
  }

  return `Uint8Array(${value.length}) [ ${Array.from(value).join(', ')} ]`
}

function formatArray(value: readonly any[], depth: number, seen: WeakSet<object>): string {
  if (value.length === 0) {
    return '[]'
  }

  return `[ ${value.map((item) => formatValue(item, depth + 1, true, seen)).join(', ')} ]`
}

function formatObject(
  entries: readonly [string, any][],
  depth: number,
  seen: WeakSet<object>,
): string {
  const pad = '  '.repeat(depth + 1)
  const closePad = '  '.repeat(depth)
  const body = entries
    .map(
      ([key, value]) =>
        `${pad}${key}: ${formatValue(value, depth + 1, true, seen)},`,
    )
    .join('\n')

  return `{\n${body}\n${closePad}}`
}

function getObjectEntries(value: Record<string, any>): [string, any][] {
  const fields = value._fields
  if (fields && typeof fields === 'object' && !Array.isArray(fields)) {
    return Object.keys(fields).map((key) => {
      const field = fields[key]
      if (field && typeof field === 'object' && 'value' in field) {
        return [key, field.value]
      }
      return [key, field]
    })
  }

  return Object.entries(value).filter(([, entry]) => typeof entry !== 'function')
}

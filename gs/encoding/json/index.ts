import * as $ from '@goscript/builtin/index.js'

export function Marshal(v: unknown): [$.Slice<number>, $.GoError] {
  try {
    return [$.stringToBytes(JSON.stringify(marshalValue(v))), null]
  } catch (err) {
    return [null, goError(err)]
  }
}

export function MarshalIndent(
  v: unknown,
  prefix: string,
  indent: string,
): [$.Slice<number>, $.GoError] {
  try {
    const text = JSON.stringify(marshalValue(v), null, indent)
    if (prefix === '') {
      return [$.stringToBytes(text), null]
    }
    return [
      $.stringToBytes(
        text
          .split('\n')
          .map((line, idx) => (idx === 0 ? line : prefix + line))
          .join('\n'),
      ),
      null,
    ]
  } catch (err) {
    return [null, goError(err)]
  }
}

export function Unmarshal(data: $.Slice<number>, v: unknown): $.GoError {
  try {
    assignDecodedValue(v, JSON.parse($.bytesToString(data)))
    return null
  } catch (err) {
    return goError(err)
  }
}

function marshalValue(v: unknown): unknown {
  if ($.isVarRef(v)) {
    return marshalValue(v.value)
  }
  if (v === null || v === undefined) {
    return null
  }
  if (typeof v !== 'object') {
    return v
  }
  if (v instanceof Uint8Array) {
    return Array.from(v).map(marshalValue)
  }
  if (Array.isArray(v)) {
    return v.map(marshalValue)
  }
  if (v instanceof Map) {
    const out: Record<string, unknown> = {}
    for (const [key, value] of v.entries()) {
      out[String(key)] = marshalValue(value)
    }
    return out
  }
  if (!isStructValue(v)) {
    return v
  }

  const out: Record<string, unknown> = {}
  const typeFields = structFieldMetadata(v)
  for (const [fieldName, ref] of Object.entries(v._fields)) {
    const jsonName = jsonFieldName(fieldName, typeFields[fieldName]?.tag)
    if (jsonName === '') {
      continue
    }
    out[jsonName] = marshalValue(ref.value)
  }
  return out
}

function assignDecodedValue(target: unknown, decoded: unknown): void {
  if ($.isVarRef(target)) {
    if (isStructValue(target.value) && isPlainObject(decoded)) {
      assignStructFields(target.value, decoded)
      return
    }
    if (isPlainObject(decoded)) {
      target.value = objectToMap(decoded)
      return
    }
    target.value = decoded
    return
  }
  if (isStructValue(target) && isPlainObject(decoded)) {
    assignStructFields(target, decoded)
  }
}

function assignStructFields(
  target: { _fields: Record<string, $.VarRef<unknown>> },
  decoded: Record<string, unknown>,
): void {
  const typeFields = structFieldMetadata(target)
  for (const [fieldName, ref] of Object.entries(target._fields)) {
    const jsonName = jsonFieldName(fieldName, typeFields[fieldName]?.tag)
    if (
      jsonName !== '' &&
      Object.prototype.hasOwnProperty.call(decoded, jsonName)
    ) {
      ref.value = decoded[jsonName]
    }
  }
}

function objectToMap(decoded: Record<string, unknown>): Map<string, unknown> {
  const out = new Map<string, unknown>()
  for (const [key, value] of Object.entries(decoded)) {
    out.set(key, isPlainObject(value) ? objectToMap(value) : value)
  }
  return out
}

function isStructValue(
  value: unknown,
): value is { _fields: Record<string, $.VarRef<unknown>> } {
  if (value === null || typeof value !== 'object') {
    return false
  }
  const fields = Reflect.get(value, '_fields')
  return (
    fields !== null &&
    fields !== undefined &&
    typeof fields === 'object' &&
    !Array.isArray(fields)
  )
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !(value instanceof Uint8Array) &&
    !(value instanceof Map)
  )
}

function structFieldMetadata(value: unknown): Record<string, { tag?: string }> {
  if (value === null || typeof value !== 'object') {
    return {}
  }
  const ctor = Reflect.get(value, 'constructor')
  if (
    ctor === null ||
    ctor === undefined ||
    (typeof ctor !== 'object' && typeof ctor !== 'function')
  ) {
    return {}
  }
  const typeInfo = Reflect.get(ctor, '__typeInfo')
  if (
    typeInfo === null ||
    typeInfo === undefined ||
    typeof typeInfo !== 'object'
  ) {
    return {}
  }
  const fields = Reflect.get(typeInfo, 'fields')
  if (isPlainObject(fields)) {
    const out: Record<string, { tag?: string }> = {}
    for (const [name, field] of Object.entries(fields)) {
      if (!isPlainObject(field)) {
        continue
      }
      const tag = field.tag
      out[name] = typeof tag === 'string' ? { tag } : {}
    }
    return out
  }
  return {}
}

function goError(err: unknown): $.GoError {
  if (err instanceof Error) {
    return $.toGoError(err)
  }
  return $.newError(String(err))
}

function jsonFieldName(fieldName: string, tag: string | undefined): string {
  if (tag === undefined || !tag.startsWith('json:"')) {
    return fieldName
  }
  const end = tag.indexOf('"', 'json:"'.length)
  if (end < 0) {
    return fieldName
  }
  const name = tag.slice('json:"'.length, end).split(',')[0]
  if (name === '-') {
    return ''
  }
  if (name === '') {
    return fieldName
  }
  return name
}

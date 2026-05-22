import * as $ from '@goscript/builtin/index.js'

const handles = new Map<string, Handle<any>>()

export class Handle<T = any> {
  private readonly value: T | undefined

  constructor(init?: Partial<{ value?: T }> | T) {
    if (init && typeof init === 'object' && 'value' in init) {
      this.value = init.value
    } else {
      this.value = init as T | undefined
    }
  }

  public Value(): T {
    return this.value as T
  }

  public clone(): Handle<T> {
    return this
  }

  static __typeInfo = $.registerStructType(
    'unique.Handle',
    new Handle(),
    [{ name: 'Value', args: [], returns: [] }],
    Handle,
    { value: { kind: $.TypeKind.Interface, methods: [] } },
  )
}

export function Make<T = any>(
  typeArgsOrValue: $.GenericTypeArgs | T | undefined,
  maybeValue?: T,
): Handle<T> {
  const value = arguments.length === 1 ? (typeArgsOrValue as T) : maybeValue
  const key = stableKey(value)
  const existing = handles.get(key)
  if (existing) {
    return existing as Handle<T>
  }
  const handle = new Handle<T>({ value })
  handles.set(key, handle)
  return handle
}

function stableKey(value: unknown): string {
  const seen = new WeakMap<object, number>()
  let nextID = 0
  return JSON.stringify(normalize(value, seen, () => nextID++))
}

function normalize(
  value: unknown,
  seen: WeakMap<object, number>,
  nextID: () => number,
): unknown {
  if (value == null || typeof value !== 'object') {
    return value
  }
  const cached = seen.get(value)
  if (cached !== undefined) {
    return { $ref: cached }
  }
  seen.set(value, nextID())
  if ($.isVarRef(value)) {
    return { $varRef: normalize(value.value, seen, nextID) }
  }
  if (Array.isArray(value)) {
    return value.map((entry) => normalize(entry, seen, nextID))
  }
  if (value instanceof Map) {
    return {
      $map: [...value.entries()]
        .map(([key, entry]) => [
          normalize(key, seen, nextID),
          normalize(entry, seen, nextID),
        ])
        .sort(([a], [b]) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
    }
  }
  if (
    '_fields' in value &&
    value._fields &&
    typeof value._fields === 'object'
  ) {
    return {
      $type: value.constructor.name,
      $fields: normalize(value._fields, seen, nextID),
    }
  }
  const entries = Object.entries(value)
    .filter(([, entry]) => typeof entry !== 'function')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, entry]) => [key, normalize(entry, seen, nextID)])
  return { $object: entries }
}

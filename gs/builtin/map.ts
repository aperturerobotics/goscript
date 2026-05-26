import { comparableEqual } from './builtin.js'
import { GoBinaryString, stringEqual } from './slice.js'

/**
 * Creates a new map (TypeScript Map).
 * @returns A new TypeScript Map.
 */
export const makeMap = <K, V>(): Map<K, V> => {
  return new Map<K, V>()
}

/**
 * Gets a value from a map, returning a tuple [value, exists].
 * @param map The map to get from.
 * @param key The key to get.
 * @param defaultValue The default value to return if the key doesn't exist.
 * @returns A tuple [value, exists] where value is the map value or defaultValue, and exists is whether the key was found.
 */
export function mapGet<K, V, D>(
  map: Map<K, V> | null,
  key: K,
  defaultValue: D,
): [V, true] | [D, false] {
  const entry = findMapEntry(map, key)
  if (entry.found) {
    return [entry.value, true]
  } else {
    return [defaultValue, false]
  }
}

/**
 * Sets a value in a map.
 * @param map The map to set in.
 * @param key The key to set.
 * @param value The value to set.
 */
export const mapSet = <K, V>(map: Map<K, V> | null, key: K, value: V): void => {
  if (!map) {
    throw new Error('assign to nil map')
  }
  const entry = findMapEntry(map, key)
  map.set(entry.found ? entry.key : key, value)
}

/**
 * Deletes a key from a map.
 * @param map The map to delete from.
 * @param key The key to delete.
 */
export const deleteMapEntry = <K, V>(map: Map<K, V> | null, key: K): void => {
  const entry = findMapEntry(map, key)
  if (entry.found) {
    map!.delete(entry.key)
  }
}

/**
 * Checks if a key exists in a map.
 * @param map The map to check in.
 * @param key The key to check.
 * @returns True if the key exists, false otherwise.
 */
export const mapHas = <K, V>(map: Map<K, V> | null, key: K): boolean => {
  return findMapEntry(map, key).found
}

function findMapEntry<K, V>(
  map: Map<K, V> | null,
  key: K,
): { found: false } | { found: true; key: K; value: V } {
  if (!map) {
    return { found: false }
  }
  if (map.has(key)) {
    return { found: true, key, value: map.get(key)! }
  }
  if (isGoStringKey(key)) {
    for (const [candidate, value] of map.entries()) {
      if (isGoStringKey(candidate) && stringEqual(candidate as string, key as string)) {
        return { found: true, key: candidate, value }
      }
    }
    return { found: false }
  }
  if (key === null || (typeof key !== 'object' && typeof key !== 'function')) {
    return { found: false }
  }
  for (const [candidate, value] of map.entries()) {
    if (candidate !== key && comparableEqual(candidate, key)) {
      return { found: true, key: candidate, value }
    }
  }
  return { found: false }
}

function isGoStringKey(value: unknown): value is string | GoBinaryString {
  return typeof value === 'string' || value instanceof GoBinaryString
}

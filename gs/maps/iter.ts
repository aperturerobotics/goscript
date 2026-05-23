import * as $ from '@goscript/builtin/index.js'

import * as iter from '@goscript/iter/index.js'

// All returns an iterator over key-value pairs from m.
// The iteration order is not specified and is not guaranteed
// to be the same from one call to the next.
export function All<K extends $.Comparable, V>(
  m: Map<K, V> | null,
): iter.Seq2<K, V> {
  return (_yield: ((p0: K, p1: V) => iter.YieldResult) | null):
    | void
    | globalThis.Promise<void> => iteratePairs(m?.entries() ?? [], _yield)
}

// Keys returns an iterator over keys in m.
// The iteration order is not specified and is not guaranteed
// to be the same from one call to the next.
export function Keys<K extends $.Comparable, V>(
  m: Map<K, V> | null,
): iter.Seq<K> {
  return (_yield: ((p0: K) => iter.YieldResult) | null):
    | void
    | globalThis.Promise<void> => iterateValues(mapKeys(m), _yield)
}

// Values returns an iterator over values in m.
// The iteration order is not specified and is not guaranteed
// to be the same from one call to the next.
export function Values<K extends $.Comparable, V>(
  m: Map<K, V> | null,
): iter.Seq<V> {
  return (_yield: ((p0: V) => iter.YieldResult) | null):
    | void
    | globalThis.Promise<void> => iterateValues(mapValues(m), _yield)
}

// Insert adds the key-value pairs from seq to m.
// If a key in seq already exists in m, its value will be overwritten.
export function Insert<K extends $.Comparable, V>(
  m: Map<K, V>,
  seq: iter.Seq2<K, V>,
): void {
  ;(() => {
    let shouldContinue = true
    seq!((k, v) => {
      $.mapSet(m, k, v)
      return shouldContinue
    })
  })()
}

// Collect collects key-value pairs from seq into a new map
// and returns it.
export function Collect<K extends $.Comparable, V>(
  seq: iter.Seq2<K, V>,
): Map<K, V> {
  let m = $.makeMap<K, V>()
  Insert(m, seq)
  return m
}

function mapKeys<K extends $.Comparable, V>(m: Map<K, V> | null): K[] {
  return Array.from(m?.keys() ?? [])
}

function mapValues<K extends $.Comparable, V>(m: Map<K, V> | null): V[] {
  return Array.from(m?.values() ?? [])
}

function iterateValues<T>(
  values: Iterable<T>,
  yieldValue: ((value: T) => iter.YieldResult) | null,
): void | globalThis.Promise<void> {
  const items = Array.from(values)
  const walk = (idx: number): void | globalThis.Promise<void> => {
    for (; idx < items.length; idx++) {
      const keepGoing = yieldValue!(items[idx])
      if (keepGoing instanceof Promise) {
        return keepGoing.then((next) => {
          if (next) {
            return walk(idx + 1)
          }
        })
      }
      if (!keepGoing) {
        return
      }
    }
  }
  return walk(0)
}

function iteratePairs<K, V>(
  entries: Iterable<[K, V]>,
  yieldValue: ((key: K, value: V) => iter.YieldResult) | null,
): void | globalThis.Promise<void> {
  const items = Array.from(entries)
  const walk = (idx: number): void | globalThis.Promise<void> => {
    for (; idx < items.length; idx++) {
      const [key, value] = items[idx]
      const keepGoing = yieldValue!(key, value)
      if (keepGoing instanceof Promise) {
        return keepGoing.then((next) => {
          if (next) {
            return walk(idx + 1)
          }
        })
      }
      if (!keepGoing) {
        return
      }
    }
  }
  return walk(0)
}

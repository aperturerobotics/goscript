import { describe, it, expect } from 'vitest'
import { MapIter } from './map.js'

describe('MapIter', () => {
  it('should iterate over map entries with proper typing', () => {
    const map = new Map<string, number>()
    map.set('one', 1)
    map.set('two', 2)
    map.set('three', 3)

    const iter = new MapIter<string, number>(map)

    expect(iter.current?.done === false).toBe(true)
    // Key() and Value() return reflect.Value objects now
    expect(iter.Key().Interface()).toBe('one')
    expect(iter.Value().Interface()).toBe(1)

    expect(iter.Next()).toBe(true)
    expect(iter.current?.done === false).toBe(true)
    expect(iter.Key().Kind()).toBe(24) // String kind
    expect(iter.Value().Kind()).toBe(2) // Int kind

    const newMap = new Map<string, number>()
    newMap.set('reset', 100)
    iter.Reset(newMap)

    expect(iter.current?.done === false).toBe(true)
    expect(iter.Key().Interface()).toBe('reset')
    expect(iter.Value().Interface()).toBe(100)
  })
})

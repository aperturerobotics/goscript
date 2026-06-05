import { describe, it, expect } from 'vitest'
import {
  AppendSlice,
  MakeMapWithSize,
  MapIter,
  MapOf,
  TypeOf,
  Value,
  ValueOf,
} from './index.js'

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

describe('Value.MapKeys', () => {
  it('reports map length', () => {
    const map = new Map<string, number>()
    map.set('alpha', 1)
    map.set('beta', 2)

    expect(ValueOf(map).Len()).toBe(2)
  })

  it('sets and mutates map fields through the same addressable value', () => {
    const typ = MapOf(TypeOf(''), TypeOf(0))
    const holder: { Items: Map<string, number> | null } = { Items: null }
    const field = new Value(holder.Items, typ, undefined, holder, 'Items')

    field.Set(MakeMapWithSize(typ, 0))
    field.SetMapIndex(ValueOf('alpha'), ValueOf(1))

    expect(holder.Items?.get('alpha')).toBe(1)
    expect(field.Len()).toBe(1)
    expect(field.MapIndex(ValueOf('alpha')).Interface()).toBe(1)
  })

  it('deletes map entries when SetMapIndex receives a zero value', () => {
    const typ = MapOf(TypeOf(''), TypeOf(0))
    const mapValue = MakeMapWithSize(typ, 0)

    mapValue.SetMapIndex(ValueOf('alpha'), ValueOf(1))
    mapValue.SetMapIndex(ValueOf('alpha'), new Value())

    const raw = mapValue.Interface()
    expect(raw).toBeInstanceOf(Map)
    expect(mapValue.Len()).toBe(0)
    expect(raw.has('alpha')).toBe(false)
  })

  it('rejects nil map insertion and invalid map backing values', () => {
    const typ = MapOf(TypeOf(''), TypeOf(0))
    const nilMap = new Value(null, typ)
    const badMap = new Value({ bad: true }, typ)

    expect(() => nilMap.SetMapIndex(ValueOf('alpha'), ValueOf(1))).toThrow(
      'reflect: assignment to entry in nil map',
    )
    expect(() => badMap.Len()).toThrow(
      'reflect: call of reflect.Value.Len on map Value',
    )
  })

  it('returns map keys as reflect values', () => {
    const map = new Map<string, number>()
    map.set('alpha', 1)
    map.set('beta', 2)

    const keys = ValueOf(map).MapKeys()

    expect(keys?.map((key) => key.String()).sort()).toEqual(['alpha', 'beta'])
  })

  it('returns an empty slice for empty maps', () => {
    const emptyMap = new Map<string, number>()

    expect(ValueOf(emptyMap).MapKeys()).toEqual([])
  })
})

describe('reflect compatibility surface', () => {
  it('constructs maps, ranges entries, and looks up values', () => {
    const typ = MapOf(TypeOf(''), TypeOf(0))
    const mapValue = MakeMapWithSize(typ, 4)
    const raw = mapValue.Interface() as Map<string, number>
    raw.set('alpha', 1)

    const iter = mapValue.MapRange()

    expect(iter?.Key().Interface()).toBe('alpha')
    expect(mapValue.MapIndex(ValueOf('alpha')).Interface()).toBe(1)
    expect(mapValue.Type().Comparable()).toBe(false)
    expect(TypeOf('alpha').Comparable()).toBe(true)
  })

  it('slices and appends slice values', () => {
    const sliced = ValueOf([1, 2, 3, 4]).Slice(1, 3)
    const appended = AppendSlice(sliced, ValueOf([5, 6]))

    expect(appended.Interface()).toEqual([2, 3, 5, 6])
  })
})

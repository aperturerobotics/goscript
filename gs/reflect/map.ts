import {
  Type,
  Kind,
  Value,
  Map as MapKind,
  StructField,
  TypeOf,
} from './type.js'

// Simple MapOf implementation using JavaScript Map
export function MapOf(key: Type, elem: Type): Type {
  return new MapType(key, elem)
}

// Simple map type implementation
class MapType implements Type {
  constructor(
    private _keyType: Type,
    private _elemType: Type,
  ) {}

  public String(): string {
    return `map[${this._keyType.String()}]${this._elemType.String()}`
  }

  public Kind(): Kind {
    return MapKind // Map kind
  }

  public Name(): string {
    return '' // Map types are unnamed composite types
  }

  public Size(): number {
    return 8 // pointer size
  }

  public Elem(): Type {
    return this._elemType
  }

  public Key(): Type {
    return this._keyType
  }

  public NumField(): number {
    return 0
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type map')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== 20) {
      // Interface kind
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return false
  }

  public OverflowInt(_x: number): boolean {
    throw new Error('reflect: OverflowInt of non-integer type map')
  }

  public OverflowUint(_x: number): boolean {
    throw new Error('reflect: OverflowUint of non-integer type map')
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error('reflect: OverflowFloat of non-float type map')
  }

  public NumMethod(): number {
    return 0
  }

  public Bits(): number {
    throw new Error('reflect: Bits of non-sized type map')
  }
}

/**
 * MapIter provides an iterator interface for Go maps.
 * It wraps a JavaScript Map iterator and provides methods to iterate over key-value pairs.
 * Returns reflect.Value for Key() and Value() to match Go's reflect.MapIter.
 * @template K - The type of keys in the map
 * @template V - The type of values in the map
 */
export class MapIter<K = unknown, V = unknown> {
  public iterator: Iterator<[K, V]>
  public current: IteratorResult<[K, V]> | null = null

  constructor(public map: Map<K, V>) {
    this.iterator = map.entries()
    this.Next()
  }

  public Next(): boolean {
    this.current = this.iterator.next()
    return !this.current.done
  }

  public Key(): Value {
    const rawKey = this.current?.value?.[0] ?? null
    return new Value(rawKey, TypeOf(rawKey))
  }

  public Value(): Value {
    const rawVal = this.current?.value?.[1] ?? null
    return new Value(rawVal, TypeOf(rawVal))
  }

  public Reset(m: Map<K, V>): void {
    this.map = m
    this.iterator = m.entries()
    this.current = null
    this.Next()
  }
}

// Helper functions for map operations
export function MakeMap(typ: Type): Value {
  const map = new Map()
  return new Value(map, typ)
}

export function MakeMapWithSize(typ: Type, _n: number): Value {
  // JavaScript Map doesn't have initial size, so we ignore n
  return MakeMap(typ)
}

export interface EqualVT<T> {
  EqualVT(other: T): boolean
}

export function IsEqualVT<T extends EqualVT<T>>(t1: T | null, t2: T | null): boolean {
  if (t1 == null || t2 == null) {
    return t1 == t2
  }
  return t1.EqualVT(t2)
}

export function CompareEqualVT<T extends EqualVT<T>>(): (t1: T | null, t2: T | null) => boolean {
  return (t1, t2) => IsEqualVT(t1, t2)
}

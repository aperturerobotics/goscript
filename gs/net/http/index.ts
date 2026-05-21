import * as $ from '@goscript/builtin/index.js'

export class Header extends Map<string, $.Slice<string>> {
  public Add(key: string, value: string): void {
    const values = Array.from(this.get(key) ?? [])
    values.push(value)
    this.set(key, $.arrayToSlice(values))
  }

  public Del(key: string): void {
    this.delete(key)
  }

  public Get(key: string): string {
    const values = this.get(key)
    return values == null || values.length === 0 ? '' : String(values[0])
  }

  public Set(key: string, value: string): void {
    this.set(key, $.arrayToSlice([value]))
  }
}

export function Header_Add(h: Header, key: string, value: string): void {
  h.Add(key, value)
}

export function Header_Del(h: Header, key: string): void {
  h.Del(key)
}

export function Header_Get(h: Header, key: string): string {
  return h.Get(key)
}

export function Header_Set(h: Header, key: string, value: string): void {
  h.Set(key, value)
}

export interface ResponseWriter {
  Header(): Header
  Write(p: $.Slice<number>): [number, $.GoError]
  WriteHeader(statusCode: number): void
}

import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import * as io from '@goscript/io/index.js'

export const StatusOK = 200
export const StatusNotFound = 404
export const StatusPartialContent = 206

export const MethodGet = 'GET'
export const MethodPost = 'POST'

export function StatusText(code: number): string {
  switch (code) {
    case StatusOK:
      return 'OK'
    case StatusNotFound:
      return 'Not Found'
    case StatusPartialContent:
      return 'Partial Content'
    default:
      return ''
  }
}

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

export class Request {
  public Method: string
  public URL: string
  public Body: io.Reader | null
  public Header: Header

  constructor(init?: Partial<Request>) {
    this.Method = init?.Method ?? ''
    this.URL = init?.URL ?? ''
    this.Body = init?.Body ?? null
    this.Header = init?.Header ?? new Header()
  }
}

export class Response {
  public StatusCode: number
  public Body: io.ReadCloser | null
  public Header: Header

  constructor(init?: Partial<Response>) {
    this.StatusCode = init?.StatusCode ?? 0
    this.Body = init?.Body ?? null
    this.Header = init?.Header ?? new Header()
  }

  public clone(): Response {
    return new Response({
      Body: this.Body,
      Header: this.Header,
      StatusCode: this.StatusCode,
    })
  }
}

export class Client {
  public Do(
    _req: Request | $.VarRef<Request> | null,
  ): [Response | null, $.GoError] {
    return [null, errors.New('net/http: Client.Do is not implemented in GoScript')]
  }
}

export const DefaultClient = new Client()

export function NewRequest(
  method: string,
  url: string,
  body: io.Reader | null,
): [Request | null, $.GoError] {
  return NewRequestWithContext(null, method, url, body)
}

export function NewRequestWithContext(
  _ctx: unknown,
  method: string,
  url: string,
  body: io.Reader | null,
): [Request | null, $.GoError] {
  if (method === '') {
    method = MethodGet
  }
  return [new Request({ Method: method, URL: url, Body: body }), null]
}

export function Get(_url: string): [Response | null, $.GoError] {
  return [null, errors.New('net/http: Get is not implemented in GoScript')]
}

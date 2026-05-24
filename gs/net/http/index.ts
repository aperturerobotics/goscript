import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import * as io from '@goscript/io/index.js'

export const StatusOK = 200
export const StatusNotFound = 404
export const StatusPartialContent = 206
export const StatusRequestedRangeNotSatisfiable = 416

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
    case StatusRequestedRangeNotSatisfiable:
      return 'Requested Range Not Satisfiable'
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
  public URL: any
  public Body: io.Reader | null
  public Header: Header

  constructor(init?: Partial<Request>) {
    this.Method = init?.Method ?? ''
    this.URL = init?.URL ?? null
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

export interface Handler {
  ServeHTTP(w: ResponseWriter | null, r: Request | $.VarRef<Request> | null): void | Promise<void>
}

export type HandlerFunc = (
  w: ResponseWriter | null,
  r: Request | $.VarRef<Request> | null,
) => void | Promise<void>

export function HandlerFunc_ServeHTTP(
  h: HandlerFunc,
  w: ResponseWriter | null,
  r: Request | $.VarRef<Request> | null,
): void | Promise<void> {
  return h(w, r)
}

export class Server {
  public Handler: Handler | null

  constructor(init?: Partial<Server>) {
    this.Handler = init?.Handler ?? null
  }

  public ListenAndServe(): $.GoError {
    return errors.New('net/http: Server.ListenAndServe is not implemented in GoScript')
  }

  public Close(): $.GoError {
    return null
  }
}

export function Error(w: ResponseWriter | null, error: string, code: number): void {
  w?.WriteHeader(code)
  w?.Write($.stringToBytes(error + '\n'))
}

export function NotFound(w: ResponseWriter | null, _r: Request | $.VarRef<Request> | null): void {
  Error(w, '404 page not found', StatusNotFound)
}

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
  let path = ''
  try {
    path = new URL(url).pathname
  } catch {
    path = ''
  }
  return [new Request({ Method: method, URL: { Path: path }, Body: body }), null]
}

export function Get(_url: string): [Response | null, $.GoError] {
  return [null, errors.New('net/http: Get is not implemented in GoScript')]
}

import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'
import * as context from '@goscript/context/index.js'
import * as errors from '@goscript/errors/index.js'
import * as fs from '@goscript/io/fs/fs.js'
import * as io from '@goscript/io/index.js'
import * as time from '@goscript/time/index.js'

export const StatusOK = 200
export const StatusCreated = 201
export const StatusPartialContent = 206
export const StatusMovedPermanently = 301
export const StatusBadRequest = 400
export const StatusUnauthorized = 401
export const StatusRequestTimeout = 408
export const StatusConflict = 409
export const StatusNotFound = 404
export const StatusTooManyRequests = 429
export const StatusRequestedRangeNotSatisfiable = 416
export const StatusInternalServerError = 500
export const StatusServiceUnavailable = 503

export const MethodGet = 'GET'
export const MethodPost = 'POST'
export const MethodDelete = 'DELETE'

export const ErrNotSupported = errors.New('feature not supported')
export const ServerContextKey = Symbol('net/http ServerContextKey')

export function StatusText(code: number): string {
  switch (code) {
    case StatusOK:
      return 'OK'
    case StatusMovedPermanently:
      return 'Moved Permanently'
    case StatusUnauthorized:
      return 'Unauthorized'
    case StatusBadRequest:
      return 'Bad Request'
    case StatusRequestTimeout:
      return 'Request Timeout'
    case StatusConflict:
      return 'Conflict'
    case StatusNotFound:
      return 'Not Found'
    case StatusTooManyRequests:
      return 'Too Many Requests'
    case StatusPartialContent:
      return 'Partial Content'
    case StatusRequestedRangeNotSatisfiable:
      return 'Requested Range Not Satisfiable'
    case StatusInternalServerError:
      return 'Internal Server Error'
    case StatusServiceUnavailable:
      return 'Service Unavailable'
    default:
      return ''
  }
}

export type Header = Map<string, $.Slice<string>>

export const Header = Map as {
  new(entries?: Iterable<readonly [string, $.Slice<string>]> | null): Header
}

export function Header_Add(h: Header, key: string, value: string): void {
  const values = Array.from(h.get(key) ?? [])
  values.push(value)
  h.set(key, $.arrayToSlice(values))
}

export function Header_Del(h: Header, key: string): void {
  h.delete(key)
}

export function Header_Get(h: Header, key: string): string {
  const values = h.get(key)
  return values == null || values.length === 0 ? '' : String(values[0])
}

export function Header_Set(h: Header, key: string, value: string): void {
  h.set(key, $.arrayToSlice([value]))
}

class QueryValues extends Map<string, $.Slice<string>> {
  public Add(key: string, value: string): void {
    const values = Array.from(this.get(key) ?? [])
    values.push(value)
    this.set(key, $.arrayToSlice(values))
  }

  public Get(key: string): string {
    const values = this.get(key)
    return values == null || values.length === 0 ? '' : String(values[0])
  }

  public Encode(): string {
    const params = new URLSearchParams()
    for (const [key, values] of this.entries()) {
      for (const value of Array.from(values ?? [])) {
        params.append(key, String(value))
      }
    }
    return params.toString()
  }
}

class RequestURL {
  public Scheme: string
  public Host: string
  public Path: string
  public RawQuery: string

  constructor(path: string, rawQuery: string, scheme = '', host = '') {
    this.Scheme = scheme
    this.Host = host
    this.Path = path
    this.RawQuery = rawQuery
  }

  public Query(): QueryValues {
    const values = new QueryValues()
    const params = new URLSearchParams(this.RawQuery)
    params.forEach((value, key) => values.Add(key, value))
    return values
  }

  public clone(): RequestURL {
    return new RequestURL(this.Path, this.RawQuery, this.Scheme, this.Host)
  }

  public String(): string {
    const query = this.RawQuery === '' ? '' : `?${this.RawQuery}`
    const path = this.Path === '' ? '/' : this.Path
    if (this.Scheme === '' || this.Host === '') {
      return `${path}${query}`
    }
    return `${this.Scheme}://${this.Host}${path}${query}`
  }
}

function parseRequestURL(rawURL: string): RequestURL {
  try {
    const parsed = new URL(rawURL, 'http://goscript.invalid')
    const hasHost = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(rawURL)
    return new RequestURL(
      parsed.pathname,
      parsed.search.startsWith('?') ? parsed.search.slice(1) : parsed.search,
      hasHost ? parsed.protocol.replace(/:$/, '') : '',
      hasHost ? parsed.host : '',
    )
  } catch {
    return new RequestURL('', '')
  }
}

class responseBody implements io.ReadCloser {
  private reader: bytes.Reader

  constructor(data: $.Bytes) {
    this.reader = bytes.NewReader(Uint8Array.from(data ?? []))
  }

  public Read(p: $.Bytes): [number, $.GoError] {
    return this.reader.Read(p)
  }

  public Close(): $.GoError {
    return null
  }
}

class memoryResponseWriter implements ResponseWriter {
  public Code = StatusOK
  public Body = new bytes.Buffer()
  private headerMap = new Header()
  private wroteHeader = false

  public Header(): Header {
    return this.headerMap
  }

  public Write(p: $.Slice<number>): [number, $.GoError] {
    if (!this.wroteHeader) {
      this.WriteHeader(StatusOK)
    }
    return this.Body.Write(p)
  }

  public WriteHeader(statusCode: number): void {
    if (this.wroteHeader) {
      return
    }
    this.wroteHeader = true
    this.Code = statusCode
  }

  public Result(): Response {
    return new Response({
      Body: new responseBody(this.Body.Bytes()),
      Header: this.headerMap,
      StatusCode: this.Code,
    })
  }
}

const inProcessServers = new Map<string, Handler>()
let nextInProcessServerID = 1

export function RegisterInProcessServer(handler: Handler | null): string {
  const host = `goscript-httptest-${nextInProcessServerID++}.invalid`
  inProcessServers.set(host, handler ?? { ServeHTTP: NotFound })
  return `http://${host}`
}

export function UnregisterInProcessServer(rawURL: string): void {
  const parsed = parseRequestURL(rawURL)
  if (parsed.Host !== '') {
    inProcessServers.delete(parsed.Host)
  }
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
  public ContentLength: number
  public RequestURI: string
  public RemoteAddr: string
  private ctx: context.Context

  constructor(init?: Partial<Request> & { ctx?: context.Context }) {
    this.Method = init?.Method ?? ''
    this.URL = init?.URL ?? null
    this.Body = init?.Body ?? null
    this.Header = init?.Header ?? new Header()
    this.ContentLength = init?.ContentLength ?? 0
    this.RequestURI = init?.RequestURI ?? ''
    this.RemoteAddr = init?.RemoteAddr ?? ''
    this.ctx = (init as { ctx?: context.Context } | undefined)?.ctx ?? context.Background()
  }

  public Context(): context.Context {
    return this.ctx
  }

  public WithContext(ctx: context.Context): Request {
    return this.Clone(ctx)
  }

  public Clone(ctx: context.Context): Request {
    return new Request({
      Method: this.Method,
      URL: this.URL?.clone != null ? this.URL.clone() : this.URL == null ? null : { ...this.URL },
      Body: this.Body,
      Header: this.Header,
      ContentLength: this.ContentLength,
      RequestURI: this.RequestURI,
      RemoteAddr: this.RemoteAddr,
      ctx,
    })
  }

  public UserAgent(): string {
    return Header_Get(this.Header, 'User-Agent')
  }

  public FormValue(key: string): string {
    const query = this.URL?.Query
    return typeof query === 'function' ? query.call(this.URL).Get(key) : ''
  }
}

export class Response {
  public Status: string
  public StatusCode: number
  public Body: io.ReadCloser | null
  public Header: Header

  constructor(init?: Partial<Response>) {
    this.Status = init?.Status ?? ''
    this.StatusCode = init?.StatusCode ?? 0
    this.Body = init?.Body ?? null
    this.Header = init?.Header ?? new Header()
    if (this.Status === '' && this.StatusCode !== 0) {
      const text = StatusText(this.StatusCode)
      this.Status = text === '' ? String(this.StatusCode) : `${this.StatusCode} ${text}`
    }
  }

  public clone(): Response {
    return new Response({
      Body: this.Body,
      Header: this.Header,
      Status: this.Status,
      StatusCode: this.StatusCode,
    })
  }
}

export class Client {
  public Transport: RoundTripper | null

  constructor(init?: Partial<Client>) {
    this.Transport = init?.Transport ?? null
  }

  public async Do(
    _req: Request | $.VarRef<Request> | null,
  ): Promise<[Response | null, $.GoError]> {
    return await (this.Transport ?? DefaultTransport).RoundTrip(_req)
  }
}

export const DefaultClient = new Client()

export interface RoundTripper {
  RoundTrip(req: Request | $.VarRef<Request> | null): [Response | null, $.GoError] | Promise<[Response | null, $.GoError]>
}

class defaultTransport implements RoundTripper {
  public async RoundTrip(req: Request | $.VarRef<Request> | null): Promise<[Response | null, $.GoError]> {
    const request = $.pointerValue<Request | null>(req)
    if (request == null) {
      return [null, errors.New('net/http: nil Request')]
    }
    const host = request.URL?.Host ?? ''
    const handler = host === '' ? null : inProcessServers.get(host)
    if (handler == null) {
      return [null, errors.New('net/http: Client.Do is not implemented in GoScript')]
    }
    const recorder = new memoryResponseWriter()
    const served = handler.ServeHTTP(recorder, request)
    if (served instanceof Promise) {
      await served
    }
    return [recorder.Result(), null]
  }
}

export const DefaultTransport: RoundTripper = new defaultTransport()

export interface FileSystem {
  Open(name: string): [File | null, $.GoError]
}

export interface File extends io.Closer, io.Reader, io.Seeker {
  Readdir(count: number): [$.Slice<fs.FileInfo>, $.GoError]
  Stat(): [fs.FileInfo, $.GoError]
}

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
  public Addr: string
  public BaseContext: ((listener: any) => context.Context) | null
  public Handler: Handler | null
  public ReadHeaderTimeout: number
  public WriteTimeout: number

  constructor(init?: Partial<Server>) {
    this.Addr = init?.Addr ?? ''
    this.BaseContext = init?.BaseContext ?? null
    this.Handler = init?.Handler ?? null
    this.ReadHeaderTimeout = init?.ReadHeaderTimeout ?? 0
    this.WriteTimeout = init?.WriteTimeout ?? 0
  }

  public ListenAndServe(): $.GoError {
    return errors.New('net/http: Server.ListenAndServe is not implemented in GoScript')
  }

  public ListenAndServeTLS(_certFile: string, _keyFile: string): $.GoError {
    return errors.New('net/http: Server.ListenAndServeTLS is not implemented in GoScript')
  }

  public Close(): $.GoError {
    return null
  }

  public Shutdown(_ctx: context.Context): $.GoError {
    return null
  }
}

export class PushOptions {
  public Header: Header

  constructor(init?: Partial<PushOptions>) {
    this.Header = init?.Header ?? new Header()
  }
}

export interface Flusher {
  Flush(): void
}

export interface Hijacker {
  Hijack(): [any, any, $.GoError]
}

export interface Pusher {
  Push(target: string, opts: PushOptions | $.VarRef<PushOptions> | null): $.GoError
}

export class ResponseController {
  public rw: ResponseWriter | null

  constructor(rw: ResponseWriter | null) {
    this.rw = rw
  }

  public Flush(): $.GoError {
    const flusher = this.rw as (Flusher & ResponseWriter) | null
    flusher?.Flush?.()
    return null
  }
}

export function NewResponseController(rw: ResponseWriter | null): ResponseController {
  return new ResponseController(rw)
}

export class ServeMux implements Handler {
  private handlers = new Map<string, Handler>()

  public Handle(pattern: string, handler: Handler | null): void {
    if (handler != null) {
      this.handlers.set(pattern, handler)
    }
  }

  public HandleFunc(pattern: string, handler: HandlerFunc): void {
    this.Handle(pattern, { ServeHTTP: handler })
  }

  public Handler(r: Request | $.VarRef<Request> | null): [Handler | null, string] {
    const req = $.pointerValue<Request | null>(r)
    const path = req?.URL?.Path ?? ''
    const handler = this.handlers.get(path) ?? null
    return [handler, handler == null ? '' : path]
  }

  public ServeHTTP(w: ResponseWriter | null, r: Request | $.VarRef<Request> | null): void | Promise<void> {
    const [handler] = this.Handler(r)
    if (handler == null) {
      NotFound(w, r)
      return
    }
    return handler.ServeHTTP(w, r)
  }
}

const defaultServeMux = new ServeMux()

export function NewServeMux(): ServeMux {
  return new ServeMux()
}

export function HandleFunc(pattern: string, handler: HandlerFunc): void {
  defaultServeMux.HandleFunc(pattern, handler)
}

export function StripPrefix(prefix: string, handler: Handler | null): Handler {
  return {
    ServeHTTP(w, r) {
      const req = $.pointerValue<Request | null>(r)
      if (req?.URL != null && typeof req.URL.Path === 'string' && req.URL.Path.startsWith(prefix)) {
        req.URL = { ...req.URL, Path: req.URL.Path.slice(prefix.length) || '/' }
      }
      return handler?.ServeHTTP(w, req)
    },
  }
}

export function Error(w: ResponseWriter | null, error: string, code: number): void {
  w?.WriteHeader(code)
  w?.Write($.stringToBytes(error + '\n'))
}

export function NotFound(w: ResponseWriter | null, _r: Request | $.VarRef<Request> | null): void {
  Error(w, '404 page not found', StatusNotFound)
}

export function Redirect(
  w: ResponseWriter | null,
  _r: Request | $.VarRef<Request> | null,
  url: string,
  code: number,
): void {
  const header = w?.Header()
  if (header != null) {
    Header_Set(header, 'Location', url)
  }
  w?.WriteHeader(code)
}

export function ParseTime(text: string): [time.Time, $.GoError] {
  const date = new globalThis.Date(text)
  if (isNaN(date.getTime())) {
    return [new time.Time(), $.newError(`parsing time "${text}" as HTTP-date: cannot parse`)]
  }
  return [time.UnixMilli(date.getTime()), null]
}

export function NewRequest(
  method: string,
  url: string,
  body: io.Reader | null,
): [Request | null, $.GoError] {
  return NewRequestWithContext(null, method, url, body)
}

export function NewRequestWithContext(
  _ctx: context.Context,
  method: string,
  url: string,
  body: io.Reader | null,
): [Request | null, $.GoError] {
  if (method === '') {
    method = MethodGet
  }
  const parsedURL = parseRequestURL(url)
  return [new Request({ Method: method, URL: parsedURL, Body: body, RequestURI: parsedURL.Path, ctx: _ctx }), null]
}

export function Get(_url: string): [Response | null, $.GoError] {
  return [null, errors.New('net/http: Get is not implemented in GoScript')]
}

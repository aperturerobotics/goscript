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
export const StatusForbidden = 403
export const StatusMethodNotAllowed = 405
export const StatusRequestTimeout = 408
export const StatusConflict = 409
export const StatusNotFound = 404
export const StatusUnsupportedMediaType = 415
export const StatusTeapot = 418
export const StatusTooManyRequests = 429
export const StatusRequestedRangeNotSatisfiable = 416
export const StatusInternalServerError = 500
export const StatusBadGateway = 502
export const StatusServiceUnavailable = 503

export const MethodGet = 'GET'
export const MethodHead = 'HEAD'
export const MethodPost = 'POST'
export const MethodDelete = 'DELETE'

export const ErrNotSupported = errors.New('feature not supported')
export const ErrServerClosed = errors.New('http: Server closed')
export const ServerContextKey = Symbol('net/http ServerContextKey')

export const SameSiteDefaultMode = 1
export const SameSiteLaxMode = 2
export const SameSiteStrictMode = 3
export const SameSiteNoneMode = 4

export function StatusText(code: number): string {
  switch (code) {
    case StatusOK:
      return 'OK'
    case StatusMovedPermanently:
      return 'Moved Permanently'
    case StatusUnauthorized:
      return 'Unauthorized'
    case StatusForbidden:
      return 'Forbidden'
    case StatusMethodNotAllowed:
      return 'Method Not Allowed'
    case StatusBadRequest:
      return 'Bad Request'
    case StatusRequestTimeout:
      return 'Request Timeout'
    case StatusConflict:
      return 'Conflict'
    case StatusNotFound:
      return 'Not Found'
    case StatusUnsupportedMediaType:
      return 'Unsupported Media Type'
    case StatusTooManyRequests:
      return 'Too Many Requests'
    case StatusPartialContent:
      return 'Partial Content'
    case StatusRequestedRangeNotSatisfiable:
      return 'Requested Range Not Satisfiable'
    case StatusTeapot:
      return "I'm a teapot"
    case StatusInternalServerError:
      return 'Internal Server Error'
    case StatusBadGateway:
      return 'Bad Gateway'
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
  key = canonicalMIMEHeaderKey(key)
  const values = Array.from(h.get(key) ?? [])
  values.push(value)
  h.set(key, $.arrayToSlice(values))
}

export function Header_Del(h: Header, key: string): void {
  h.delete(canonicalMIMEHeaderKey(key))
}

export function Header_Get(h: Header, key: string): string {
  const values = h.get(canonicalMIMEHeaderKey(key))
  return values == null || values.length === 0 ? '' : String(values[0])
}

export function Header_Set(h: Header, key: string, value: string): void {
  h.set(canonicalMIMEHeaderKey(key), $.arrayToSlice([value]))
}

function canonicalMIMEHeaderKey(key: string): string {
  let upper = true
  let out = ''
  for (let i = 0; i < key.length; i++) {
    const ch = key[i]
    if (ch === '-') {
      upper = true
      out += ch
      continue
    }
    out += upper ? ch.toUpperCase() : ch.toLowerCase()
    upper = false
  }
  return out
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

export class Cookie {
  public Name: string
  public Value: string
  public Quoted: boolean
  public Path: string
  public Domain: string
  public Expires: time.Time
  public RawExpires: string
  public MaxAge: number
  public Secure: boolean
  public HttpOnly: boolean
  public SameSite: number
  public Partitioned: boolean
  public Raw: string
  public Unparsed: $.Slice<string>

  constructor(init?: Partial<Cookie>) {
    this.Name = init?.Name ?? ''
    this.Value = init?.Value ?? ''
    this.Quoted = init?.Quoted ?? false
    this.Path = init?.Path ?? ''
    this.Domain = init?.Domain ?? ''
    this.Expires = init?.Expires ?? new time.Time()
    this.RawExpires = init?.RawExpires ?? ''
    this.MaxAge = init?.MaxAge ?? 0
    this.Secure = init?.Secure ?? false
    this.HttpOnly = init?.HttpOnly ?? false
    this.SameSite = init?.SameSite ?? 0
    this.Partitioned = init?.Partitioned ?? false
    this.Raw = init?.Raw ?? ''
    this.Unparsed = init?.Unparsed ?? null
  }

  public String(): string {
    const parts = [`${this.Name}=${this.Quoted ? quoteCookieValue(this.Value) : this.Value}`]
    if (this.Path !== '') {
      parts.push(`Path=${this.Path}`)
    }
    if (this.Domain !== '') {
      parts.push(`Domain=${this.Domain}`)
    }
    if (this.MaxAge > 0) {
      parts.push(`Max-Age=${this.MaxAge}`)
    } else if (this.MaxAge < 0) {
      parts.push('Max-Age=0')
    }
    if (this.HttpOnly) {
      parts.push('HttpOnly')
    }
    if (this.Secure) {
      parts.push('Secure')
    }
    switch (this.SameSite) {
      case SameSiteLaxMode:
        parts.push('SameSite=Lax')
        break
      case SameSiteStrictMode:
        parts.push('SameSite=Strict')
        break
      case SameSiteNoneMode:
        parts.push('SameSite=None')
        break
    }
    if (this.Partitioned) {
      parts.push('Partitioned')
    }
    return parts.join('; ')
  }
}

function quoteCookieValue(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

export function SetCookie(w: ResponseWriter | null, cookie: Cookie | $.VarRef<Cookie> | null): void {
  const c = $.pointerValue<Cookie | null>(cookie)
  if (w == null || c == null) {
    return
  }
  Header_Add(w.Header(), 'Set-Cookie', c.String())
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
  public Body: io.ReadCloser | null
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
  public ContentLength: number
  public Request: Request | $.VarRef<Request> | null

  constructor(init?: Partial<Response>) {
    this.Status = init?.Status ?? ''
    this.StatusCode = init?.StatusCode ?? 0
    this.Body = init?.Body ?? null
    this.Header = init?.Header ?? new Header()
    this.ContentLength = init?.ContentLength ?? 0
    this.Request = init?.Request ?? null
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
      ContentLength: this.ContentLength,
      Request: this.Request,
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
      return await fetchRoundTrip(request)
    }
    const recorder = new memoryResponseWriter()
    let closeErr: $.GoError = null
    try {
      const served = handler.ServeHTTP(recorder, request)
      if (served instanceof Promise) {
        await served
      }
    } finally {
      closeErr = request.Body?.Close?.() ?? null
    }
    if (closeErr != null) {
      return [null, closeErr]
    }
    return [recorder.Result(), null]
  }
}

export const DefaultTransport: RoundTripper = new defaultTransport()

async function fetchRoundTrip(request: Request): Promise<[Response | null, $.GoError]> {
  const requestBody = request.Body
  const closeRequestBody = (): $.GoError => {
    if (requestBody == null) {
      return null
    }
    return requestBody.Close()
  }
  if (typeof globalThis.fetch !== 'function') {
    closeRequestBody()
    return [null, errors.New('net/http: Client.Do is not implemented in GoScript')]
  }
  const ctxErr = request.Context()?.Err?.()
  if (ctxErr != null) {
    closeRequestBody()
    return [null, ctxErr]
  }
  const headers = new globalThis.Headers()
  for (const [key, values] of request.Header.entries()) {
    for (const value of Array.from(values ?? [])) {
      headers.append(key, String(value))
    }
  }
  let body: Uint8Array | undefined
  if (requestBody != null && request.Method !== MethodGet && request.Method !== MethodHead) {
    const [data, err] = await io.ReadAll(requestBody)
    const closeErr = closeRequestBody()
    if (err != null) {
      return [null, err]
    }
    if (closeErr != null) {
      return [null, closeErr]
    }
    body = Uint8Array.from(data ?? [])
  } else {
    const closeErr = closeRequestBody()
    if (closeErr != null) {
      return [null, closeErr]
    }
  }
  try {
    const bodyInit = body == null ? undefined : Uint8Array.from(body).buffer
    const fetched = await globalThis.fetch(request.URL?.String?.() ?? '', {
      method: request.Method || MethodGet,
      headers,
      body: bodyInit,
    })
    const data = new Uint8Array(await fetched.arrayBuffer())
    const respHeader = new Header()
    fetched.headers.forEach((value, key) => Header_Add(respHeader, key, value))
    return [
      new Response({
        Status: `${fetched.status} ${fetched.statusText}`,
        StatusCode: fetched.status,
        Body: new responseBody(data),
        Header: respHeader,
        ContentLength: Number(fetched.headers.get('content-length') ?? -1),
        Request: request,
      }),
      null,
    ]
  } catch (err) {
    const message = typeof err === 'object' && err != null && 'message' in err
      ? String((err as { message: unknown }).message)
      : String(err)
    return [null, errors.New(message)]
  }
}

export interface FileSystem {
  Open(name: string): [File | null, $.GoError]
}

export interface File extends io.Closer, io.Reader, io.Seeker {
  Readdir(count: number): [$.Slice<fs.FileInfo>, $.GoError]
  Stat(): [fs.FileInfo, $.GoError]
}

export function FS(fsys: fs.FS): FileSystem {
  return {
    Open(name: string): [File | null, $.GoError] {
      const cleaned = cleanFileServerPath(name)
      const [file, err] = fsys?.Open(cleaned) ?? [null, fs.ErrInvalid]
      if (err != null || file == null) {
        return [null, err]
      }
      return [httpFileFromFSFile(file), null]
    },
  }
}

function httpFileFromFSFile(file: Exclude<fs.File, null>): File {
  const seek = (file as Partial<io.Seeker>).Seek
  const readdir = (file as { Readdir?: (count: number) => [$.Slice<fs.FileInfo>, $.GoError] }).Readdir
  return {
    Read: (p) => file.Read(p instanceof Uint8Array ? p : Uint8Array.from(p ?? [])),
    Close: () => file.Close(),
    Stat: () => file.Stat(),
    Seek: seek == null ? () => [0, errors.New('net/http: file does not support seek')] : seek.bind(file),
    Readdir: readdir == null ? () => [null, io.EOF] : readdir.bind(file),
  }
}

export function FileServer(root: FileSystem | null): Handler {
  return {
    async ServeHTTP(w, r): Promise<void> {
      const req = $.pointerValue<Request | null>(r)
      if (w == null || req == null) {
        return
      }
      if (req.Method !== MethodGet && req.Method !== MethodHead) {
        Error(w, 'method not allowed', StatusMethodNotAllowed)
        return
      }
      const [file, err] = root?.Open(cleanFileServerPath(req.URL?.Path ?? '')) ?? [null, fs.ErrInvalid]
      if (err != null || file == null) {
        NotFound(w, req)
        return
      }
      try {
        const [info, statErr] = file.Stat()
        if (statErr != null) {
          Error(w, statErr.Error(), StatusInternalServerError)
          return
        }
        if (info?.IsDir?.() === true) {
          NotFound(w, req)
          return
        }
        const [data, readErr] = await io.ReadAll(file)
        if (readErr != null) {
          Error(w, readErr.Error(), StatusInternalServerError)
          return
        }
        if (info?.Size != null) {
          Header_Set(w.Header(), 'Content-Length', String(info.Size()))
        }
        w.WriteHeader(StatusOK)
        if (req.Method !== MethodHead) {
          w.Write(data)
        }
      } finally {
        file.Close()
      }
    },
  }
}

function cleanFileServerPath(name: string): string {
  const parts: string[] = []
  for (const part of name.split('?')[0].split('/')) {
    if (part === '' || part === '.') {
      continue
    }
    if (part === '..') {
      parts.pop()
      continue
    }
    parts.push(part)
  }
  return parts.length === 0 ? '.' : parts.join('/')
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
  return [new Request({ Method: method, URL: parsedURL, Body: readCloserForBody(body), RequestURI: parsedURL.Path, ctx: _ctx }), null]
}

export async function Get(_url: string): Promise<[Response | null, $.GoError]> {
  const [req, err] = NewRequest(MethodGet, _url, null)
  if (err != null) {
    return [null, err]
  }
  return await DefaultClient.Do(req)
}

function readCloserForBody(body: io.Reader | null): io.ReadCloser | null {
  if (body == null) {
    return null
  }
  const closer = body as io.Reader & Partial<io.Closer>
  if (typeof closer.Close === 'function') {
    return closer as io.ReadCloser
  }
  return io.NopCloser(body)
}

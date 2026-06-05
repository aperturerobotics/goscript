import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'
import * as context from '@goscript/context/index.js'
import * as errors from '@goscript/errors/index.js'
import * as fs from '@goscript/io/fs/fs.js'
import * as io from '@goscript/io/index.js'
import * as strings from '@goscript/strings/index.js'
import * as time from '@goscript/time/index.js'

export const StatusContinue = 100
export const StatusSwitchingProtocols = 101
export const StatusProcessing = 102
export const StatusEarlyHints = 103
export const StatusOK = 200
export const StatusCreated = 201
export const StatusAccepted = 202
export const StatusNonAuthoritativeInfo = 203
export const StatusNoContent = 204
export const StatusResetContent = 205
export const StatusPartialContent = 206
export const StatusMultiStatus = 207
export const StatusAlreadyReported = 208
export const StatusIMUsed = 226
export const StatusMultipleChoices = 300
export const StatusMovedPermanently = 301
export const StatusFound = 302
export const StatusSeeOther = 303
export const StatusNotModified = 304
export const StatusUseProxy = 305
export const StatusTemporaryRedirect = 307
export const StatusPermanentRedirect = 308
export const StatusBadRequest = 400
export const StatusUnauthorized = 401
export const StatusPaymentRequired = 402
export const StatusForbidden = 403
export const StatusNotFound = 404
export const StatusMethodNotAllowed = 405
export const StatusNotAcceptable = 406
export const StatusProxyAuthRequired = 407
export const StatusRequestTimeout = 408
export const StatusConflict = 409
export const StatusGone = 410
export const StatusLengthRequired = 411
export const StatusPreconditionFailed = 412
export const StatusRequestEntityTooLarge = 413
export const StatusRequestURITooLong = 414
export const StatusUnsupportedMediaType = 415
export const StatusRequestedRangeNotSatisfiable = 416
export const StatusExpectationFailed = 417
export const StatusTeapot = 418
export const StatusMisdirectedRequest = 421
export const StatusUnprocessableEntity = 422
export const StatusLocked = 423
export const StatusFailedDependency = 424
export const StatusTooEarly = 425
export const StatusUpgradeRequired = 426
export const StatusPreconditionRequired = 428
export const StatusTooManyRequests = 429
export const StatusRequestHeaderFieldsTooLarge = 431
export const StatusUnavailableForLegalReasons = 451
export const StatusInternalServerError = 500
export const StatusNotImplemented = 501
export const StatusBadGateway = 502
export const StatusServiceUnavailable = 503
export const StatusGatewayTimeout = 504
export const StatusHTTPVersionNotSupported = 505
export const StatusVariantAlsoNegotiates = 506
export const StatusInsufficientStorage = 507
export const StatusLoopDetected = 508
export const StatusNotExtended = 510
export const StatusNetworkAuthenticationRequired = 511

export const MethodGet = 'GET'
export const MethodHead = 'HEAD'
export const MethodPost = 'POST'
export const MethodPut = 'PUT'
export const MethodPatch = 'PATCH'
export const MethodDelete = 'DELETE'
export const MethodConnect = 'CONNECT'
export const MethodOptions = 'OPTIONS'
export const MethodTrace = 'TRACE'

export const DefaultMaxHeaderBytes = 1 << 20
export const DefaultMaxIdleConnsPerHost = 2
export const TimeFormat = 'Mon, 02 Jan 2006 15:04:05 GMT'
export const TrailerPrefix = 'Trailer:'

export class ProtocolError {
  public ErrorString: string

  constructor(errorString: string) {
    this.ErrorString = errorString
  }

  public Error(): string {
    return this.ErrorString
  }
}

export class MaxBytesError {
  public Limit: number

  constructor(init?: Partial<MaxBytesError>) {
    this.Limit = init?.Limit ?? 0
  }

  public Error(): string {
    return 'http: request body too large'
  }
}

export const ErrNotSupported = new ProtocolError('feature not supported')
export const ErrUnexpectedTrailer = new ProtocolError(
  'trailer header without chunked transfer encoding',
)
export const ErrMissingBoundary = new ProtocolError(
  'no multipart boundary param in Content-Type',
)
export const ErrNotMultipart = new ProtocolError(
  "request Content-Type isn't multipart/form-data",
)
export const ErrHeaderTooLong = new ProtocolError('header too long')
export const ErrShortBody = new ProtocolError('entity body too short')
export const ErrMissingContentLength = new ProtocolError(
  'missing ContentLength in HEAD response',
)
export const ErrBodyNotAllowed = errors.New(
  'http: request method or response status code does not allow body',
)
export const ErrBodyReadAfterClose = errors.New(
  'http: invalid Read on closed Body',
)
export const ErrContentLength = errors.New(
  'http: wrote more than the declared Content-Length',
)
export const ErrHandlerTimeout = errors.New('http: Handler timeout')
export const ErrHijacked = errors.New('http: connection has been hijacked')
export const ErrLineTooLong = errors.New('header line too long')
export const ErrMissingFile = errors.New('http: no such file')
export const ErrNoCookie = errors.New('http: named cookie not present')
export const ErrNoLocation = errors.New('http: no Location header in response')
export const ErrSchemeMismatch = errors.New(
  'http: server gave HTTP response to HTTPS client',
)
export const ErrServerClosed = errors.New('http: Server closed')
export const ErrAbortHandler = errors.New('net/http: abort Handler')
export const ErrSkipAltProtocol = errors.New(
  'net/http: skip alternate protocol',
)
export const ErrUseLastResponse = errors.New('net/http: use last response')
export const ErrWriteAfterFlush = errors.New('unused')
const errBlankCookie = errors.New('http: blank cookie')
const errEqualNotFoundInCookie = errors.New("http: '=' not found in cookie")
const errInvalidCookieName = errors.New('http: invalid cookie name')
const errInvalidCookieValue = errors.New('http: invalid cookie value')
const errCookieNumLimitExceeded = errors.New(
  'http: number of cookies exceeded limit',
)
const errCrossOriginRequest = errors.New(
  'cross-origin request detected from Sec-Fetch-Site header',
)
const errCrossOriginRequestFromOldBrowser = errors.New(
  'cross-origin request detected, and/or browser is out of date: Sec-Fetch-Site is missing, and Origin does not match Host',
)
export const ServerContextKey = Symbol('net/http ServerContextKey')
export const LocalAddrContextKey = Symbol('net/http LocalAddrContextKey')

export type SameSite = number
export const SameSiteDefaultMode = 1
export const SameSiteLaxMode = 2
export const SameSiteStrictMode = 3
export const SameSiteNoneMode = 4

export type ConnState = number
export const StateNew = 0
export const StateActive = 1
export const StateIdle = 2
export const StateHijacked = 3
export const StateClosed = 4

const statusTexts = new Map<number, string>([
  [StatusContinue, 'Continue'],
  [StatusSwitchingProtocols, 'Switching Protocols'],
  [StatusProcessing, 'Processing'],
  [StatusEarlyHints, 'Early Hints'],
  [StatusOK, 'OK'],
  [StatusCreated, 'Created'],
  [StatusAccepted, 'Accepted'],
  [StatusNonAuthoritativeInfo, 'Non-Authoritative Information'],
  [StatusNoContent, 'No Content'],
  [StatusResetContent, 'Reset Content'],
  [StatusPartialContent, 'Partial Content'],
  [StatusMultiStatus, 'Multi-Status'],
  [StatusAlreadyReported, 'Already Reported'],
  [StatusIMUsed, 'IM Used'],
  [StatusMultipleChoices, 'Multiple Choices'],
  [StatusMovedPermanently, 'Moved Permanently'],
  [StatusFound, 'Found'],
  [StatusSeeOther, 'See Other'],
  [StatusNotModified, 'Not Modified'],
  [StatusUseProxy, 'Use Proxy'],
  [StatusTemporaryRedirect, 'Temporary Redirect'],
  [StatusPermanentRedirect, 'Permanent Redirect'],
  [StatusBadRequest, 'Bad Request'],
  [StatusUnauthorized, 'Unauthorized'],
  [StatusPaymentRequired, 'Payment Required'],
  [StatusForbidden, 'Forbidden'],
  [StatusNotFound, 'Not Found'],
  [StatusMethodNotAllowed, 'Method Not Allowed'],
  [StatusNotAcceptable, 'Not Acceptable'],
  [StatusProxyAuthRequired, 'Proxy Authentication Required'],
  [StatusRequestTimeout, 'Request Timeout'],
  [StatusConflict, 'Conflict'],
  [StatusGone, 'Gone'],
  [StatusLengthRequired, 'Length Required'],
  [StatusPreconditionFailed, 'Precondition Failed'],
  [StatusRequestEntityTooLarge, 'Request Entity Too Large'],
  [StatusRequestURITooLong, 'Request URI Too Long'],
  [StatusUnsupportedMediaType, 'Unsupported Media Type'],
  [StatusRequestedRangeNotSatisfiable, 'Requested Range Not Satisfiable'],
  [StatusExpectationFailed, 'Expectation Failed'],
  [StatusTeapot, "I'm a teapot"],
  [StatusMisdirectedRequest, 'Misdirected Request'],
  [StatusUnprocessableEntity, 'Unprocessable Entity'],
  [StatusLocked, 'Locked'],
  [StatusFailedDependency, 'Failed Dependency'],
  [StatusTooEarly, 'Too Early'],
  [StatusUpgradeRequired, 'Upgrade Required'],
  [StatusPreconditionRequired, 'Precondition Required'],
  [StatusTooManyRequests, 'Too Many Requests'],
  [StatusRequestHeaderFieldsTooLarge, 'Request Header Fields Too Large'],
  [StatusUnavailableForLegalReasons, 'Unavailable For Legal Reasons'],
  [StatusInternalServerError, 'Internal Server Error'],
  [StatusNotImplemented, 'Not Implemented'],
  [StatusBadGateway, 'Bad Gateway'],
  [StatusServiceUnavailable, 'Service Unavailable'],
  [StatusGatewayTimeout, 'Gateway Timeout'],
  [StatusHTTPVersionNotSupported, 'HTTP Version Not Supported'],
  [StatusVariantAlsoNegotiates, 'Variant Also Negotiates'],
  [StatusInsufficientStorage, 'Insufficient Storage'],
  [StatusLoopDetected, 'Loop Detected'],
  [StatusNotExtended, 'Not Extended'],
  [StatusNetworkAuthenticationRequired, 'Network Authentication Required'],
])

export function StatusText(code: number): string {
  return statusTexts.get(code) ?? ''
}

export type Header = Map<string, $.Slice<string>>

export const Header = Map as {
  new (entries?: Iterable<readonly [string, $.Slice<string>]> | null): Header
}

export function CanonicalHeaderKey(s: string): string {
  return canonicalMIMEHeaderKey(s)
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

export function Header_Values(h: Header, key: string): $.Slice<string> {
  return h.get(canonicalMIMEHeaderKey(key)) ?? null
}

export function Header_Clone(h: Header): Header {
  const cloned = new Header()
  for (const [key, values] of h.entries()) {
    cloned.set(key, $.arrayToSlice(Array.from(values ?? [])))
  }
  return cloned
}

export function Header_Write(h: Header, w: io.Writer): $.GoError {
  return Header_WriteSubset(h, w, null)
}

export function Header_WriteSubset(
  h: Header,
  w: io.Writer,
  exclude: Map<string, boolean> | null,
): $.GoError {
  for (const [key, values] of h.entries()) {
    if (exclude?.get(key) === true) {
      continue
    }
    for (const value of Array.from(values ?? [])) {
      const [, err] = w.Write($.stringToBytes(`${key}: ${value}\r\n`))
      if (err != null) {
        return err
      }
    }
  }
  return null
}

export type Dir = string

export interface CookieJar {
  SetCookies(u: any, cookies: $.Slice<Cookie | $.VarRef<Cookie> | null>): void
  Cookies(u: any): $.Slice<Cookie | $.VarRef<Cookie> | null>
}

export interface CloseNotifier {
  CloseNotify(): any
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

function parseRequestURL(rawURL: string): [RequestURL | null, $.GoError] {
  try {
    if (/%(?![0-9A-Fa-f]{2})/.test(rawURL)) {
      return [null, errors.New(`parse "${rawURL}": invalid URL escape`)]
    }
    const parsed = new URL(rawURL, 'http://goscript.invalid')
    const hasHost = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(rawURL)
    return [
      new RequestURL(
        parsed.pathname,
        parsed.search.startsWith('?') ? parsed.search.slice(1) : parsed.search,
        hasHost ? parsed.protocol.replace(/:$/, '') : '',
        hasHost ? parsed.host : '',
      ),
      null,
    ]
  } catch {
    return [null, errors.New(`parse "${rawURL}": invalid URL`)]
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

class noBody implements io.ReadCloser {
  public Read(_p: $.Bytes): [number, $.GoError] {
    return [0, io.EOF]
  }

  public Close(): $.GoError {
    return null
  }

  public clone(): noBody {
    return this
  }
}

export const NoBody: io.ReadCloser = new noBody()

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
    const parts = [
      `${this.Name}=${this.Quoted ? quoteCookieValue(this.Value) : this.Value}`,
    ]
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

function isToken(value: string): boolean {
  return /^[!#$%&'*+\-.^_`{}|~0-9A-Za-z]+$/.test(value)
}

function validCookieValueByte(code: number): boolean {
  return (
    code >= 0x20 &&
    code < 0x7f &&
    code !== 0x22 &&
    code !== 0x3b &&
    code !== 0x5c
  )
}

function parseCookieValue(
  raw: string,
  allowDoubleQuote: boolean,
): [string, boolean, boolean] {
  let value = raw
  let quoted = false
  if (
    allowDoubleQuote &&
    value.length > 1 &&
    value[0] === '"' &&
    value[value.length - 1] === '"'
  ) {
    value = value.slice(1, -1)
    quoted = true
  }
  for (let i = 0; i < value.length; i++) {
    if (!validCookieValueByte(value.charCodeAt(i))) {
      return ['', quoted, false]
    }
  }
  return [value, quoted, true]
}

function asciiLower(value: string): [string, boolean] {
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) > 0x7f) {
      return ['', false]
    }
  }
  return [value.toLowerCase(), true]
}

export function SetCookie(
  w: ResponseWriter | null,
  cookie: Cookie | $.VarRef<Cookie> | null,
): void {
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
  const [parsed] = parseRequestURL(rawURL)
  if (parsed != null && parsed.Host !== '') {
    inProcessServers.delete(parsed.Host)
  }
}

function inProcessServerRequest(request: Request): Request {
  const req = Object.assign(
    Object.create(Object.getPrototypeOf(request)),
    request,
  ) as Request
  const rawQuery = request.URL?.RawQuery ?? ''
  const query = rawQuery === '' ? '' : `?${rawQuery}`
  req.RequestURI = `${request.URL?.Path ?? '/'}${query}`
  req.Host = request.Host === '' ? (request.URL?.Host ?? '') : request.Host
  if (req.URL?.clone != null) {
    req.URL = req.URL.clone()
    req.URL.Scheme = ''
    req.URL.Host = ''
  }
  return req
}

export interface ResponseWriter {
  Header(): Header
  Write(p: $.Slice<number>): [number, $.GoError]
  WriteHeader(statusCode: number): void
}

export class Request {
  public Method: string
  public URL: any
  public Proto: string
  public ProtoMajor: number
  public ProtoMinor: number
  public Body: io.ReadCloser | null
  public Header: Header
  public ContentLength: number
  public TransferEncoding: $.Slice<string>
  public Close: boolean
  public Host: string
  public Form: any
  public PostForm: any
  public MultipartForm: any
  public Trailer: Header
  public RequestURI: string
  public RemoteAddr: string
  public TLS: any
  public Cancel: any
  public Response: Response | $.VarRef<Response> | null
  public Pattern: string
  private ctx: context.Context

  constructor(init?: Partial<Request> & { ctx?: context.Context }) {
    this.Method = init?.Method ?? ''
    this.URL = init?.URL ?? null
    this.Proto = init?.Proto ?? 'HTTP/1.1'
    this.ProtoMajor = init?.ProtoMajor ?? 1
    this.ProtoMinor = init?.ProtoMinor ?? 1
    this.Body = init?.Body ?? null
    this.Header = init?.Header ?? new Header()
    this.ContentLength = init?.ContentLength ?? 0
    this.TransferEncoding = init?.TransferEncoding ?? null
    this.Close = init?.Close ?? false
    this.Host = init?.Host ?? ''
    this.Form = init?.Form ?? null
    this.PostForm = init?.PostForm ?? null
    this.MultipartForm = init?.MultipartForm ?? null
    this.Trailer = init?.Trailer ?? new Header()
    this.RequestURI = init?.RequestURI ?? ''
    this.RemoteAddr = init?.RemoteAddr ?? ''
    this.TLS = init?.TLS ?? null
    this.Cancel = init?.Cancel ?? null
    this.Response = init?.Response ?? null
    this.Pattern = init?.Pattern ?? ''
    this.ctx =
      (init as { ctx?: context.Context } | undefined)?.ctx ??
      context.Background()
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
      URL:
        this.URL?.clone != null ? this.URL.clone()
        : this.URL == null ? null
        : { ...this.URL },
      Proto: this.Proto,
      ProtoMajor: this.ProtoMajor,
      ProtoMinor: this.ProtoMinor,
      Body: this.Body,
      Header: Header_Clone(this.Header),
      ContentLength: this.ContentLength,
      TransferEncoding: this.TransferEncoding,
      Close: this.Close,
      Host: this.Host,
      Form: this.Form,
      PostForm: this.PostForm,
      MultipartForm: this.MultipartForm,
      Trailer: Header_Clone(this.Trailer),
      RequestURI: this.RequestURI,
      RemoteAddr: this.RemoteAddr,
      TLS: this.TLS,
      Cancel: this.Cancel,
      Response: this.Response,
      Pattern: this.Pattern,
      ctx,
    })
  }

  public UserAgent(): string {
    return Header_Get(this.Header, 'User-Agent')
  }

  public Referer(): string {
    return Header_Get(this.Header, 'Referer')
  }

  public ProtoAtLeast(major: number, minor: number): boolean {
    return (
      this.ProtoMajor > major ||
      (this.ProtoMajor === major && this.ProtoMinor >= minor)
    )
  }

  public Cookie(name: string): [Cookie | null, $.GoError] {
    for (const cookie of Array.from(this.Cookies() ?? [])) {
      if (cookie?.Name === name) {
        return [cookie, null]
      }
    }
    return [null, ErrNoCookie]
  }

  public Cookies(): $.Slice<Cookie | null> {
    const raw = Header_Get(this.Header, 'Cookie')
    if (raw === '') {
      return null
    }
    const [cookies] = ParseCookie(raw)
    return cookies
  }

  public AddCookie(cookie: Cookie | $.VarRef<Cookie> | null): void {
    const c = $.pointerValue<Cookie | null>(cookie)
    if (c != null) {
      Header_Add(this.Header, 'Cookie', c.String())
    }
  }

  public SetBasicAuth(username: string, password: string): void {
    const encoded = globalThis.btoa(`${username}:${password}`)
    Header_Set(this.Header, 'Authorization', `Basic ${encoded}`)
  }

  public BasicAuth(): [string, string, boolean] {
    const value = Header_Get(this.Header, 'Authorization')
    if (!value.startsWith('Basic ')) {
      return ['', '', false]
    }
    const decoded = globalThis.atob(value.slice('Basic '.length))
    const idx = decoded.indexOf(':')
    if (idx < 0) {
      return ['', '', false]
    }
    return [decoded.slice(0, idx), decoded.slice(idx + 1), true]
  }

  public FormValue(key: string): string {
    const query = this.URL?.Query
    return typeof query === 'function' ? query.call(this.URL).Get(key) : ''
  }
}

export class Response {
  public Status: string
  public StatusCode: number
  public Proto: string
  public ProtoMajor: number
  public ProtoMinor: number
  public Body: io.ReadCloser | null
  public Header: Header
  public ContentLength: number
  public TransferEncoding: $.Slice<string>
  public Close: boolean
  public Uncompressed: boolean
  public Trailer: Header
  public Request: Request | $.VarRef<Request> | null
  public TLS: any

  constructor(init?: Partial<Response>) {
    this.Status = init?.Status ?? ''
    this.StatusCode = init?.StatusCode ?? 0
    this.Proto = init?.Proto ?? 'HTTP/1.1'
    this.ProtoMajor = init?.ProtoMajor ?? 1
    this.ProtoMinor = init?.ProtoMinor ?? 1
    this.Body = init?.Body ?? null
    this.Header = init?.Header ?? new Header()
    this.ContentLength = init?.ContentLength ?? 0
    this.TransferEncoding = init?.TransferEncoding ?? null
    this.Close = init?.Close ?? false
    this.Uncompressed = init?.Uncompressed ?? false
    this.Trailer = init?.Trailer ?? new Header()
    this.Request = init?.Request ?? null
    this.TLS = init?.TLS ?? null
    if (this.Status === '' && this.StatusCode !== 0) {
      const text = StatusText(this.StatusCode)
      this.Status =
        text === '' ? String(this.StatusCode) : `${this.StatusCode} ${text}`
    }
  }

  public clone(): Response {
    return new Response({
      Body: this.Body,
      Header: this.Header,
      Status: this.Status,
      StatusCode: this.StatusCode,
      Proto: this.Proto,
      ProtoMajor: this.ProtoMajor,
      ProtoMinor: this.ProtoMinor,
      ContentLength: this.ContentLength,
      TransferEncoding: this.TransferEncoding,
      Close: this.Close,
      Uncompressed: this.Uncompressed,
      Trailer: this.Trailer,
      Request: this.Request,
      TLS: this.TLS,
    })
  }

  public Cookies(): $.Slice<Cookie | null> {
    const values = Header_Values(this.Header, 'Set-Cookie')
    if (values == null) {
      return null
    }
    const cookies: Array<Cookie | null> = []
    for (const value of Array.from(values)) {
      const [cookie] = ParseSetCookie(String(value))
      if (cookie != null) {
        cookies.push(cookie)
      }
    }
    return $.arrayToSlice(cookies)
  }

  public Location(): [any, $.GoError] {
    const location = Header_Get(this.Header, 'Location')
    if (location === '') {
      return [null, ErrNoLocation]
    }
    try {
      return [new URL(location), null]
    } catch (err) {
      return [null, errors.New(String(err))]
    }
  }

  public ProtoAtLeast(major: number, minor: number): boolean {
    return (
      this.ProtoMajor > major ||
      (this.ProtoMajor === major && this.ProtoMinor >= minor)
    )
  }

  public Write(w: io.Writer): $.GoError {
    const write = (data: $.Bytes): $.GoError => {
      const [n, err] = w.Write(data)
      if (err != null) {
        return err
      }
      return n === $.len(data) ? null : io.ErrShortWrite
    }
    let err = write($.stringToBytes(`${this.Proto} ${this.Status}\r\n`))
    if (err != null) {
      return err
    }
    err = Header_Write(this.Header, w)
    if (err != null) {
      return err
    }
    err = write($.stringToBytes('\r\n'))
    if (err != null) {
      return err
    }
    if (this.Body == null) {
      return null
    }
    const buf = $.makeSlice<number>(32 * 1024, undefined, 'byte')
    while (true) {
      const [n, readErr] = this.Body.Read(buf)
      if (n > 0) {
        err = write($.goSlice(buf, 0, n))
        if (err != null) {
          return err
        }
      }
      if (readErr === io.EOF) {
        return null
      }
      if (readErr != null) {
        return readErr
      }
    }
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

  public async Get(url: string): Promise<[Response | null, $.GoError]> {
    const [req, err] = NewRequest(MethodGet, url, null)
    if (err != null) {
      return [null, err]
    }
    return await this.Do(req)
  }

  public async Head(url: string): Promise<[Response | null, $.GoError]> {
    const [req, err] = NewRequest(MethodHead, url, null)
    if (err != null) {
      return [null, err]
    }
    return await this.Do(req)
  }

  public async Post(
    url: string,
    contentType: string,
    body: io.Reader | null,
  ): Promise<[Response | null, $.GoError]> {
    const [req, err] = NewRequest(MethodPost, url, body)
    if (err != null || req == null) {
      return [null, err]
    }
    Header_Set(req.Header, 'Content-Type', contentType)
    return await this.Do(req)
  }

  public async PostForm(
    url: string,
    data: any,
  ): Promise<[Response | null, $.GoError]> {
    return await this.Post(
      url,
      'application/x-www-form-urlencoded',
      bytes.NewReader($.stringToBytes(encodeFormData(data))),
    )
  }

  public CloseIdleConnections(): void {
    const closer = this.Transport as {
      CloseIdleConnections?: () => void
    } | null
    closer?.CloseIdleConnections?.()
  }
}

export const DefaultClient = new Client()

export class ClientConn {}

function encodeFormData(data: any): string {
  if (data == null) {
    return ''
  }
  if (typeof data.Encode === 'function') {
    return String(data.Encode())
  }
  if (data instanceof URLSearchParams) {
    return data.toString()
  }
  const entries =
    data instanceof Map ? Array.from(data.entries())
    : typeof data === 'object' ? Object.entries(data)
    : []
  entries.sort(([a], [b]) => String(a).localeCompare(String(b)))
  const params = new URLSearchParams()
  for (const [key, value] of entries) {
    appendFormValue(params, String(key), value)
  }
  return params.toString()
}

function appendFormValue(
  params: URLSearchParams,
  key: string,
  value: unknown,
): void {
  const unwrapped = unwrapFormValue(value)
  if (unwrapped == null) {
    return
  }
  if (Array.isArray(unwrapped)) {
    for (const item of unwrapped) {
      appendFormValue(params, key, item)
    }
    return
  }
  params.append(key, String(unwrapped))
}

function unwrapFormValue(value: unknown): unknown {
  if ($.isVarRef(value)) {
    return value.value
  }
  if (typeof value === 'object' && value !== null && '__goValue' in value) {
    return (value as { __goValue: unknown }).__goValue
  }
  return value
}

export interface RoundTripper {
  RoundTrip(
    req: Request | $.VarRef<Request> | null,
  ): [Response | null, $.GoError] | Promise<[Response | null, $.GoError]>
}

export class Protocols {
  private bits = 0

  public HTTP1(): boolean {
    return (this.bits & 1) !== 0
  }

  public SetHTTP1(ok: boolean): void {
    this.setBit(1, ok)
  }

  public HTTP2(): boolean {
    return (this.bits & 2) !== 0
  }

  public SetHTTP2(ok: boolean): void {
    this.setBit(2, ok)
  }

  public UnencryptedHTTP2(): boolean {
    return (this.bits & 4) !== 0
  }

  public SetUnencryptedHTTP2(ok: boolean): void {
    this.setBit(4, ok)
  }

  public String(): string {
    const names: string[] = []
    if (this.HTTP1()) {
      names.push('HTTP1')
    }
    if (this.HTTP2()) {
      names.push('HTTP2')
    }
    if (this.UnencryptedHTTP2()) {
      names.push('UnencryptedHTTP2')
    }
    return `{${names.join(',')}}`
  }

  private setBit(bit: number, ok: boolean): void {
    this.bits = ok ? this.bits | bit : this.bits & ~bit
  }
}

export class HTTP2Config {
  public MaxConcurrentStreams = 0
  public StrictMaxConcurrentRequests = false
  public MaxDecoderHeaderTableSize = 0
  public MaxEncoderHeaderTableSize = 0
  public MaxReadFrameSize = 0
  public MaxReceiveBufferPerConnection = 0
  public MaxReceiveBufferPerStream = 0
  public SendPingTimeout = 0
  public PingTimeout = 0
  public WriteByteTimeout = 0
  public PermitProhibitedCipherSuites = false
  public CountError: ((errType: string) => void) | null = null

  constructor(init?: Partial<HTTP2Config>) {
    Object.assign(this, init)
  }
}

export class Transport implements RoundTripper {
  public Proxy:
    | ((req: Request | $.VarRef<Request> | null) => [any, $.GoError])
    | null = null
  public OnProxyConnectResponse:
    | ((
        ctx: context.Context,
        proxyURL: any,
        connectReq: Request,
        connectRes: Response,
      ) => $.GoError)
    | null = null
  public DialContext: any = null
  public Dial: any = null
  public DialTLSContext: any = null
  public DialTLS: any = null
  public TLSClientConfig: any = null
  public TLSHandshakeTimeout = 0
  public DisableKeepAlives = false
  public DisableCompression = false
  public MaxIdleConns = 0
  public MaxIdleConnsPerHost = 0
  public MaxConnsPerHost = 0
  public IdleConnTimeout = 0
  public ResponseHeaderTimeout = 0
  public ExpectContinueTimeout = 0
  public TLSNextProto: Map<string, any> | null = null
  public ProxyConnectHeader = new Header()
  public GetProxyConnectHeader:
    | ((
        ctx: context.Context,
        proxyURL: any,
        target: string,
      ) => [Header | null, $.GoError])
    | null = null
  public MaxResponseHeaderBytes = 0
  public WriteBufferSize = 0
  public ReadBufferSize = 0
  public ForceAttemptHTTP2 = false
  public HTTP2: HTTP2Config | null = null
  public Protocols: Protocols | null = null

  constructor(init?: Partial<Transport>) {
    Object.assign(this, init)
  }

  public async RoundTrip(
    req: Request | $.VarRef<Request> | null,
  ): Promise<[Response | null, $.GoError]> {
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
    let closeErr: $.GoError | undefined
    try {
      const served = handler.ServeHTTP(
        recorder,
        inProcessServerRequest(request),
      )
      if (served instanceof Promise) {
        await served
      }
    } finally {
      closeErr = request.Body?.Close?.() ?? null
    }
    if (closeErr != null) {
      return [null, closeErr]
    }
    const response = recorder.Result()
    if (request.Method === MethodHead) {
      response.Body = NoBody
    }
    return [response, null]
  }

  public CloseIdleConnections(): void {}

  public CancelRequest(_req: Request | $.VarRef<Request> | null): void {}

  public RegisterProtocol(_scheme: string, _rt: RoundTripper): void {}

  public NewClientConn(
    _ctx: context.Context,
    _scheme: string,
    _address: string,
  ): [ClientConn | null, $.GoError] {
    return [null, ErrNotSupported]
  }

  public Clone(): Transport {
    return new Transport(this)
  }
}

export const DefaultTransport: RoundTripper = new Transport()

class fileTransport implements RoundTripper {
  constructor(private root: FileSystem | null) {}

  public async RoundTrip(
    req: Request | $.VarRef<Request> | null,
  ): Promise<[Response | null, $.GoError]> {
    const request = $.pointerValue<Request | null>(req)
    const recorder = new memoryResponseWriter()
    let closeErr: $.GoError | undefined
    try {
      await FileServer(this.root).ServeHTTP(recorder, request)
    } finally {
      closeErr = request?.Body?.Close?.() ?? null
    }
    if (closeErr != null) {
      return [null, closeErr]
    }
    return [recorder.Result(), null]
  }
}

export function NewFileTransport(root: FileSystem | null): RoundTripper {
  return new fileTransport(root)
}

export function NewFileTransportFS(fsys: fs.FS): RoundTripper {
  return NewFileTransport(FS(fsys))
}

async function fetchRoundTrip(
  request: Request,
): Promise<[Response | null, $.GoError]> {
  const requestBody = request.Body
  const closeRequestBody = (): $.GoError => {
    if (requestBody == null) {
      return null
    }
    return requestBody.Close()
  }
  if (typeof globalThis.fetch !== 'function') {
    closeRequestBody()
    return [
      null,
      errors.New('net/http: Client.Do is not implemented in GoScript'),
    ]
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
  if (
    requestBody != null &&
    request.Method !== MethodGet &&
    request.Method !== MethodHead
  ) {
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
    const message =
      typeof err === 'object' && err != null && 'message' in err ?
        String((err as { message: unknown }).message)
      : String(err)
    return [null, errors.New(message)]
  }
}

type maybePromise<T> = T | Promise<T>

export interface FileSystem {
  Open(name: string): [File | null, $.GoError]
}

export interface File extends io.Closer, io.Reader, io.Seeker {
  Readdir(count: number): [$.Slice<fs.FileInfo> | null, $.GoError]
  Stat(): [fs.FileInfo | null, $.GoError]
}

interface fileServerFileSystem {
  Open(name: string): maybePromise<[fileServerFile | null, $.GoError]>
}

interface fileServerFile {
  Close(): maybePromise<$.GoError>
  Read(p: $.Bytes): maybePromise<[number, $.GoError]>
  Seek(offset: number, whence: number): maybePromise<[number, $.GoError]>
  Readdir(count: number): maybePromise<[$.Slice<fs.FileInfo> | null, $.GoError]>
  Stat(): maybePromise<[fs.FileInfo | null, $.GoError]>
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
  const readdir = (
    file as { Readdir?: (count: number) => [$.Slice<fs.FileInfo>, $.GoError] }
  ).Readdir
  return {
    Read: (p) =>
      file.Read(p instanceof Uint8Array ? p : Uint8Array.from(p ?? [])),
    Close: () => file.Close(),
    Stat: () => file.Stat(),
    Seek:
      seek == null ?
        () => [0, errors.New('net/http: file does not support seek')]
      : seek.bind(file),
    Readdir: readdir == null ? () => [null, io.EOF] : readdir.bind(file),
  }
}

export function FileServer(root: fileServerFileSystem | null): Handler {
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
      const [file, err] = (await root?.Open(
        cleanFileServerPath(req.URL?.Path ?? ''),
      )) ?? [null, fs.ErrInvalid]
      if (err != null || file == null) {
        NotFound(w, req)
        return
      }
      try {
        const [info, statErr] = await file.Stat()
        if (statErr != null) {
          Error(w, statErr.Error(), StatusInternalServerError)
          return
        }
        if (info?.IsDir?.() === true) {
          NotFound(w, req)
          return
        }
        const [data, readErr] = await io.ReadAll(file as io.Reader)
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
        await file.Close()
      }
    },
  }
}

export function FileServerFS(fsys: fs.FS): Handler {
  return FileServer(FS(fsys))
}

export function ServeFile(
  w: ResponseWriter | null,
  r: Request | $.VarRef<Request> | null,
  _name: string,
): void {
  const req = $.pointerValue<Request | null>(r)
  if (w == null || req == null) {
    return
  }
  if (req.Method !== MethodGet && req.Method !== MethodHead) {
    Error(w, 'method not allowed', StatusMethodNotAllowed)
    return
  }
  NotFound(w, req)
}

export function ServeFileFS(
  w: ResponseWriter | null,
  r: Request | $.VarRef<Request> | null,
  _fsys: fs.FS,
  name: string,
): void {
  ServeFile(w, r, name)
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
  ServeHTTP(
    w: ResponseWriter | null,
    r: Request | $.VarRef<Request> | null,
  ): void | Promise<void>
}

$.registerInterfaceType('http.Handler', null, [
  {
    name: 'ServeHTTP',
    args: [
      { name: 'w', type: 'http.ResponseWriter' },
      {
        name: 'r',
        type: { kind: $.TypeKind.Pointer, elemType: 'http.Request' },
      },
    ],
    returns: [],
  },
])

export type HandlerFunc = (
  w: ResponseWriter | null,
  r: Request | $.VarRef<Request> | null,
) => void | Promise<void>

export function HandlerFunc_ServeHTTP(
  h: HandlerFunc | null,
  w: ResponseWriter | null,
  r: Request | $.VarRef<Request> | null,
): void | Promise<void> {
  if (!h) {
    throw new globalThis.Error('http: nil HandlerFunc')
  }
  return h(w, r)
}

export class CrossOriginProtection {
  private denyHandler: Handler | null = null
  private trustedOrigins = new Set<string>()
  private bypassPatterns: string[] = []

  public AddInsecureBypassPattern(pattern: string): void {
    this.bypassPatterns.push(pattern)
  }

  public AddTrustedOrigin(origin: string): $.GoError {
    if (!/^[A-Za-z][A-Za-z0-9+.-]*:\/\/[^/?#]+$/.test(origin)) {
      return $.newError(`invalid origin "${origin}"`)
    }
    try {
      const parsed = new URL(origin)
      if (parsed.protocol === '' || parsed.host === '') {
        return $.newError(`invalid origin "${origin}"`)
      }
    } catch (err) {
      return $.newError(`invalid origin "${origin}": ${String(err)}`)
    }
    this.trustedOrigins.add(origin)
    return null
  }

  public Check(r: Request | $.VarRef<Request> | null): $.GoError {
    const req = $.pointerValue<Request | null>(r)
    if (req == null) {
      return errCrossOriginRequest
    }
    switch (req.Method) {
      case MethodGet:
      case MethodHead:
      case MethodOptions:
        return null
    }

    switch (Header_Get(req.Header, 'Sec-Fetch-Site')) {
      case '':
        break
      case 'same-origin':
      case 'none':
        return null
      default:
        if (this.isRequestExempt(req)) {
          return null
        }
        return errCrossOriginRequest
    }

    const origin = Header_Get(req.Header, 'Origin')
    if (origin === '') {
      return null
    }
    if (originHost(origin) === req.Host) {
      return null
    }
    if (this.isRequestExempt(req)) {
      return null
    }
    return errCrossOriginRequestFromOldBrowser
  }

  public Handler(handler: Handler | null): Handler {
    return {
      ServeHTTP: (w, r) => {
        const err = this.Check(r)
        if (err != null) {
          const deny = this.denyHandler
          if (deny != null) {
            return deny.ServeHTTP(w, r)
          }
          Error(w, err.Error(), StatusForbidden)
          return
        }
        return handler?.ServeHTTP(w, r)
      },
    }
  }

  public SetDenyHandler(handler: Handler | null): void {
    this.denyHandler = handler
  }

  private isRequestExempt(req: Request): boolean {
    for (const pattern of this.bypassPatterns) {
      if (bypassPatternMatches(pattern, req)) {
        return true
      }
    }
    const origin = Header_Get(req.Header, 'Origin')
    return origin !== '' && this.trustedOrigins.has(origin)
  }
}

export function NewCrossOriginProtection(): CrossOriginProtection {
  return new CrossOriginProtection()
}

function originHost(origin: string): string {
  try {
    return new URL(origin).host
  } catch {
    return ''
  }
}

function bypassPatternMatches(pattern: string, req: Request): boolean {
  let method = ''
  let pathPattern = pattern
  const space = pattern.indexOf(' ')
  if (space > 0) {
    method = pattern.slice(0, space)
    pathPattern = pattern.slice(space + 1)
  }
  if (method !== '' && method !== req.Method) {
    return false
  }
  const path = req.URL?.Path ?? ''
  if (pathPattern.includes('{')) {
    return wildcardPatternMatches(pathPattern, path)
  }
  if (pathPattern.endsWith('/')) {
    return path === pathPattern || path.startsWith(pathPattern)
  }
  return path === pathPattern
}

function wildcardPatternMatches(pattern: string, path: string): boolean {
  const patternParts = pattern.split('/').filter((part) => part !== '')
  const pathParts = path.split('/').filter((part) => part !== '')
  if (patternParts.length !== pathParts.length) {
    return false
  }
  for (let i = 0; i < patternParts.length; i++) {
    if (/^\{[^}]+\}$/.test(patternParts[i])) {
      continue
    }
    if (patternParts[i] !== pathParts[i]) {
      return false
    }
  }
  return true
}

export class Server {
  public Addr: string
  public BaseContext: ((listener: any) => context.Context) | null
  public ConnContext:
    | ((ctx: context.Context, conn: any) => context.Context)
    | null
  public Handler: Handler | null
  public DisableGeneralOptionsHandler: boolean
  public TLSConfig: any
  public ReadTimeout: number
  public ReadTimeoutHandler: any
  public ReadHeaderTimeout: number
  public WriteTimeout: number
  public IdleTimeout: number
  public MaxHeaderBytes: number
  public TLSNextProto: Map<string, any> | null
  public ConnState: ((conn: any, state: ConnState) => void) | null
  public ErrorLog: any
  public HTTP2: HTTP2Config | null
  public Protocols: Protocols | null

  constructor(init?: Partial<Server>) {
    this.Addr = init?.Addr ?? ''
    this.BaseContext = init?.BaseContext ?? null
    this.ConnContext = init?.ConnContext ?? null
    this.Handler = init?.Handler ?? null
    this.DisableGeneralOptionsHandler =
      init?.DisableGeneralOptionsHandler ?? false
    this.TLSConfig = init?.TLSConfig ?? null
    this.ReadTimeout = init?.ReadTimeout ?? 0
    this.ReadTimeoutHandler = (init as any)?.ReadTimeoutHandler ?? null
    this.ReadHeaderTimeout = init?.ReadHeaderTimeout ?? 0
    this.WriteTimeout = init?.WriteTimeout ?? 0
    this.IdleTimeout = init?.IdleTimeout ?? 0
    this.MaxHeaderBytes = init?.MaxHeaderBytes ?? 0
    this.TLSNextProto = init?.TLSNextProto ?? null
    this.ConnState = init?.ConnState ?? null
    this.ErrorLog = init?.ErrorLog ?? null
    this.HTTP2 = init?.HTTP2 ?? null
    this.Protocols = init?.Protocols ?? null
  }

  public ListenAndServe(): $.GoError {
    return errors.New(
      'net/http: Server.ListenAndServe is not implemented in GoScript',
    )
  }

  public ListenAndServeTLS(_certFile: string, _keyFile: string): $.GoError {
    return errors.New(
      'net/http: Server.ListenAndServeTLS is not implemented in GoScript',
    )
  }

  public Close(): $.GoError {
    return null
  }

  public Shutdown(_ctx: context.Context): $.GoError {
    return null
  }

  public Serve(_listener: any): $.GoError {
    return ErrNotSupported
  }

  public ServeTLS(
    _listener: any,
    _certFile: string,
    _keyFile: string,
  ): $.GoError {
    return ErrNotSupported
  }

  public ServeHTTP(
    w: ResponseWriter | null,
    r: Request | $.VarRef<Request> | null,
  ): void | Promise<void> {
    return (this.Handler ?? DefaultServeMux).ServeHTTP(w, r)
  }

  public RegisterOnShutdown(_f: () => void): void {}

  public SetKeepAlivesEnabled(_v: boolean): void {}
}

export function ListenAndServe(
  _addr: string,
  _handler: Handler | null,
): $.GoError {
  return ErrNotSupported
}

export function ListenAndServeTLS(
  _addr: string,
  _certFile: string,
  _keyFile: string,
  _handler: Handler | null,
): $.GoError {
  return ErrNotSupported
}

export function Serve(_listener: any, _handler: Handler | null): $.GoError {
  return ErrNotSupported
}

export function ServeTLS(
  _listener: any,
  _handler: Handler | null,
  _certFile: string,
  _keyFile: string,
): $.GoError {
  return ErrNotSupported
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
  Push(
    target: string,
    opts: PushOptions | $.VarRef<PushOptions> | null,
  ): $.GoError
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

  public Hijack(): [any, any, $.GoError] {
    return [null, null, ErrNotSupported]
  }

  public SetReadDeadline(_deadline: time.Time): $.GoError {
    return ErrNotSupported
  }

  public SetWriteDeadline(_deadline: time.Time): $.GoError {
    return ErrNotSupported
  }

  public EnableFullDuplex(): $.GoError {
    return ErrNotSupported
  }
}

export function NewResponseController(
  rw: ResponseWriter | null,
): ResponseController {
  return new ResponseController(rw)
}

class maxBytesReader implements io.ReadCloser {
  private initialLimit: number
  private remaining: number
  private err: $.GoError = null

  constructor(
    private reader: io.ReadCloser,
    limit: number,
  ) {
    this.initialLimit = Math.max(0, limit)
    this.remaining = this.initialLimit
  }

  public Read(p: $.Bytes): [number, $.GoError] {
    if (this.err != null) {
      return [0, this.err]
    }
    if ($.len(p) === 0) {
      return [0, null]
    }
    const readLen =
      $.len(p) - 1 > this.remaining ? this.remaining + 1 : $.len(p)
    const target = $.goSlice(p, 0, readLen)
    const [n, err] = this.reader.Read(target)
    if (n <= this.remaining) {
      this.remaining -= n
      this.err = err
      return [n, err]
    }
    const accepted = this.remaining
    this.remaining = 0
    this.err = new MaxBytesError({ Limit: this.initialLimit })
    return [accepted, this.err]
  }

  public Close(): $.GoError {
    return this.reader.Close()
  }
}

export function MaxBytesReader(
  _w: ResponseWriter | null,
  r: io.ReadCloser | null,
  n: number,
): io.ReadCloser {
  return new maxBytesReader(r ?? NoBody, n)
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

  public Handler(
    r: Request | $.VarRef<Request> | null,
  ): [Handler | null, string] {
    const req = $.pointerValue<Request | null>(r)
    const path = req?.URL?.Path ?? ''
    const handler = this.handlers.get(path) ?? null
    return [handler, handler == null ? '' : path]
  }

  public ServeHTTP(
    w: ResponseWriter | null,
    r: Request | $.VarRef<Request> | null,
  ): void | Promise<void> {
    const [handler] = this.Handler(r)
    if (handler == null) {
      NotFound(w, r)
      return
    }
    return handler.ServeHTTP(w, r)
  }
}

export const DefaultServeMux = new ServeMux()

export function NewServeMux(): ServeMux {
  return new ServeMux()
}

export function Handle(pattern: string, handler: Handler | null): void {
  DefaultServeMux.Handle(pattern, handler)
}

export function HandleFunc(pattern: string, handler: HandlerFunc): void {
  DefaultServeMux.HandleFunc(pattern, handler)
}

export function StripPrefix(prefix: string, handler: Handler | null): Handler {
  return {
    ServeHTTP(w, r) {
      const req = $.pointerValue<Request | null>(r)
      if (
        req?.URL != null &&
        typeof req.URL.Path === 'string' &&
        req.URL.Path.startsWith(prefix)
      ) {
        req.URL = { ...req.URL, Path: req.URL.Path.slice(prefix.length) || '/' }
      }
      return handler?.ServeHTTP(w, req)
    },
  }
}

export function AllowQuerySemicolons(handler: Handler | null): Handler {
  return handler ?? NotFoundHandler()
}

export function MaxBytesHandler(handler: Handler | null, n: number): Handler {
  return {
    ServeHTTP(w, r) {
      const req = $.pointerValue<Request | null>(r)
      let wrappedReq = req
      if (req != null && req.Body != null) {
        const reqCopy = Object.assign(
          Object.create(Object.getPrototypeOf(req)),
          req,
        ) as Request
        reqCopy.Body = MaxBytesReader(w, req.Body, n)
        wrappedReq = reqCopy
      }
      return handler?.ServeHTTP(w, wrappedReq)
    },
  }
}

export function NotFoundHandler(): Handler {
  return { ServeHTTP: NotFound }
}

export function RedirectHandler(url: string, code: number): Handler {
  return {
    ServeHTTP(w, r) {
      Redirect(w, r, url, code)
    },
  }
}

export function TimeoutHandler(
  handler: Handler | null,
  _dt: number,
  msg: string,
): Handler {
  return {
    ServeHTTP(w, r) {
      if (handler == null) {
        Error(w, msg, StatusServiceUnavailable)
        return
      }
      return handler.ServeHTTP(w, r)
    },
  }
}

export function Error(
  w: ResponseWriter | null,
  error: string,
  code: number,
): void {
  w?.WriteHeader(code)
  w?.Write($.stringToBytes(error + '\n'))
}

export function NotFound(
  w: ResponseWriter | null,
  _r: Request | $.VarRef<Request> | null,
): void {
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
    return [
      new time.Time(),
      $.newError(`parsing time "${text}" as HTTP-date: cannot parse`),
    ]
  }
  return [time.UnixMilli(date.getTime()), null]
}

export function DetectContentType(data: $.Slice<number>): string {
  const bytes = Uint8Array.from(data ?? []).subarray(0, 512)
  const firstNonWS = firstNonWhitespace(bytes)
  const afterWS = bytes.subarray(firstNonWS)
  if (
    htmlSig(afterWS, '<!DOCTYPE HTML') ||
    htmlSig(afterWS, '<HTML') ||
    htmlSig(afterWS, '<HEAD') ||
    htmlSig(afterWS, '<SCRIPT') ||
    htmlSig(afterWS, '<IFRAME') ||
    htmlSig(afterWS, '<H1') ||
    htmlSig(afterWS, '<DIV') ||
    htmlSig(afterWS, '<FONT') ||
    htmlSig(afterWS, '<TABLE') ||
    htmlSig(afterWS, '<A') ||
    htmlSig(afterWS, '<STYLE') ||
    htmlSig(afterWS, '<TITLE') ||
    htmlSig(afterWS, '<B') ||
    htmlSig(afterWS, '<BODY') ||
    htmlSig(afterWS, '<BR') ||
    htmlSig(afterWS, '<P') ||
    startsWithASCII(afterWS, '<!--')
  ) {
    return 'text/html; charset=utf-8'
  }
  if (startsWithASCII(afterWS, '<?xml')) {
    return 'text/xml; charset=utf-8'
  }
  if (startsWithASCII(bytes, '%PDF-')) {
    return 'application/pdf'
  }
  if (startsWithASCII(bytes, '%!PS-Adobe-')) {
    return 'application/postscript'
  }
  if (startsWithBytes(bytes, new Uint8Array([0xfe, 0xff]))) {
    return 'text/plain; charset=utf-16be'
  }
  if (startsWithBytes(bytes, new Uint8Array([0xff, 0xfe]))) {
    return 'text/plain; charset=utf-16le'
  }
  if (startsWithBytes(bytes, new Uint8Array([0xef, 0xbb, 0xbf]))) {
    return 'text/plain; charset=utf-8'
  }
  if (
    startsWithBytes(bytes, new Uint8Array([0x00, 0x00, 0x01, 0x00])) ||
    startsWithBytes(bytes, new Uint8Array([0x00, 0x00, 0x02, 0x00]))
  ) {
    return 'image/x-icon'
  }
  if (startsWithASCII(bytes, 'BM')) {
    return 'image/bmp'
  }
  if (startsWithASCII(bytes, 'GIF87a') || startsWithASCII(bytes, 'GIF89a')) {
    return 'image/gif'
  }
  if (isRIFFSignature(bytes, 'WEBPVP')) {
    return 'image/webp'
  }
  if (
    startsWithBytes(
      bytes,
      new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    )
  ) {
    return 'image/png'
  }
  if (startsWithBytes(bytes, new Uint8Array([0xff, 0xd8, 0xff]))) {
    return 'image/jpeg'
  }
  if (isFORMSignature(bytes, 'AIFF')) {
    return 'audio/aiff'
  }
  if (startsWithASCII(bytes, 'ID3')) {
    return 'audio/mpeg'
  }
  if (startsWithBytes(bytes, new Uint8Array([0x4f, 0x67, 0x67, 0x53, 0x00]))) {
    return 'application/ogg'
  }
  if (
    startsWithBytes(
      bytes,
      new Uint8Array([0x4d, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06]),
    )
  ) {
    return 'audio/midi'
  }
  if (isRIFFSignature(bytes, 'AVI ')) {
    return 'video/avi'
  }
  if (isRIFFSignature(bytes, 'WAVE')) {
    return 'audio/wave'
  }
  if (isMP4Signature(bytes)) {
    return 'video/mp4'
  }
  if (startsWithBytes(bytes, new Uint8Array([0x1a, 0x45, 0xdf, 0xa3]))) {
    return 'video/webm'
  }
  if (isEOTSignature(bytes)) {
    return 'application/vnd.ms-fontobject'
  }
  if (startsWithBytes(bytes, new Uint8Array([0x00, 0x01, 0x00, 0x00]))) {
    return 'font/ttf'
  }
  if (startsWithASCII(bytes, 'OTTO')) {
    return 'font/otf'
  }
  if (startsWithASCII(bytes, 'ttcf')) {
    return 'font/collection'
  }
  if (startsWithASCII(bytes, 'wOFF')) {
    return 'font/woff'
  }
  if (startsWithASCII(bytes, 'wOF2')) {
    return 'font/woff2'
  }
  if (startsWithBytes(bytes, new Uint8Array([0x1f, 0x8b, 0x08]))) {
    return 'application/x-gzip'
  }
  if (startsWithBytes(bytes, new Uint8Array([0x50, 0x4b, 0x03, 0x04]))) {
    return 'application/zip'
  }
  if (
    startsWithBytes(
      bytes,
      new Uint8Array([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x00]),
    )
  ) {
    return 'application/x-rar-compressed'
  }
  if (
    startsWithBytes(
      bytes,
      new Uint8Array([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x01, 0x00]),
    )
  ) {
    return 'application/x-rar-compressed'
  }
  if (startsWithBytes(bytes, new Uint8Array([0x00, 0x61, 0x73, 0x6d]))) {
    return 'application/wasm'
  }
  for (const byte of afterWS) {
    if (
      byte <= 0x08 ||
      byte === 0x0b ||
      (byte >= 0x0e && byte <= 0x1a) ||
      (byte >= 0x1c && byte <= 0x1f)
    ) {
      return 'application/octet-stream'
    }
  }
  return 'text/plain; charset=utf-8'
}

function firstNonWhitespace(data: Uint8Array): number {
  for (let i = 0; i < data.length; i++) {
    const byte = data[i]
    if (
      byte !== 0x09 &&
      byte !== 0x0a &&
      byte !== 0x0c &&
      byte !== 0x0d &&
      byte !== 0x20
    ) {
      return i
    }
  }
  return data.length
}

function startsWithBytes(data: Uint8Array, prefix: Uint8Array): boolean {
  if (data.length < prefix.length) {
    return false
  }
  for (let i = 0; i < prefix.length; i++) {
    if (data[i] !== prefix[i]) {
      return false
    }
  }
  return true
}

function startsWithASCII(data: Uint8Array, prefix: string): boolean {
  return asciiMatchesAt(data, 0, prefix)
}

function asciiMatchesAt(
  data: Uint8Array,
  offset: number,
  text: string,
): boolean {
  if (data.length < offset + text.length) {
    return false
  }
  for (let i = 0; i < text.length; i++) {
    if (data[offset + i] !== text.charCodeAt(i)) {
      return false
    }
  }
  return true
}

function isRIFFSignature(data: Uint8Array, form: string): boolean {
  return asciiMatchesAt(data, 0, 'RIFF') && asciiMatchesAt(data, 8, form)
}

function isFORMSignature(data: Uint8Array, form: string): boolean {
  return asciiMatchesAt(data, 0, 'FORM') && asciiMatchesAt(data, 8, form)
}

function isMP4Signature(data: Uint8Array): boolean {
  if (data.length < 12 || !asciiMatchesAt(data, 4, 'ftyp')) {
    return false
  }
  const boxSize =
    data[0] * 0x1000000 + data[1] * 0x10000 + data[2] * 0x100 + data[3]
  if (boxSize < 12 || data.length < boxSize || boxSize % 4 !== 0) {
    return false
  }
  for (let offset = 8; offset + 3 <= boxSize; offset += 4) {
    if (offset === 12) {
      continue
    }
    if (asciiMatchesAt(data, offset, 'mp4')) {
      return true
    }
  }
  return false
}

function isEOTSignature(data: Uint8Array): boolean {
  return data.length >= 36 && data[34] === 0x4c && data[35] === 0x50
}

function htmlSig(data: Uint8Array, sig: string): boolean {
  if (data.length < sig.length + 1) {
    return false
  }
  for (let i = 0; i < sig.length; i++) {
    const got = data[i] >= 0x61 && data[i] <= 0x7a ? data[i] & 0xdf : data[i]
    if (got !== sig.charCodeAt(i)) {
      return false
    }
  }
  const term = data[sig.length]
  return term === 0x20 || term === 0x3e
}

export function ParseHTTPVersion(vers: string): [number, number, boolean] {
  const match = /^HTTP\/(\d+)\.(\d+)$/.exec(vers)
  if (match == null) {
    return [0, 0, false]
  }
  return [Number(match[1]), Number(match[2]), true]
}

export function ParseCookie(line: string): [$.Slice<Cookie | null>, $.GoError] {
  const parts = line.trim().split(';')
  if (parts.length > 3000) {
    return [null, errCookieNumLimitExceeded]
  }
  if (parts.length === 1 && parts[0] === '') {
    return [null, errBlankCookie]
  }
  const cookies: Array<Cookie | null> = []
  for (const raw of parts) {
    const part = raw.trim()
    const eq = part.indexOf('=')
    if (eq < 0) {
      return [null, errEqualNotFoundInCookie]
    }
    const name = part.slice(0, eq)
    if (!isToken(name)) {
      return [null, errInvalidCookieName]
    }
    const [value, quoted, ok] = parseCookieValue(part.slice(eq + 1), true)
    if (!ok) {
      return [null, errInvalidCookieValue]
    }
    cookies.push(new Cookie({ Name: name, Value: value, Quoted: quoted }))
  }
  return [$.arrayToSlice(cookies), null]
}

export function ParseSetCookie(line: string): [Cookie | null, $.GoError] {
  const parts = line.trim().split(';')
  if (parts.length === 1 && parts[0] === '') {
    return [null, errBlankCookie]
  }
  const first = parts[0].trim()
  const eq = first.indexOf('=')
  if (eq < 0) {
    return [null, errEqualNotFoundInCookie]
  }
  const name = first.slice(0, eq).trim()
  if (!isToken(name)) {
    return [null, errInvalidCookieName]
  }
  const [value, quoted, ok] = parseCookieValue(first.slice(eq + 1), true)
  if (!ok) {
    return [null, errInvalidCookieValue]
  }
  const cookie = new Cookie({
    Name: name,
    Value: value,
    Quoted: quoted,
    Raw: line,
  })
  const unparsed: string[] = []
  for (const raw of parts.slice(1)) {
    const part = raw.trim()
    if (part === '') {
      continue
    }
    const attrEq = part.indexOf('=')
    const attr = attrEq < 0 ? part : part.slice(0, attrEq)
    const rawValue = attrEq < 0 ? '' : part.slice(attrEq + 1)
    const [lowerAttr, ascii] = asciiLower(attr)
    if (!ascii) {
      continue
    }
    const [attrValue, , attrOK] = parseCookieValue(rawValue, false)
    if (!attrOK) {
      unparsed.push(part)
      continue
    }
    switch (lowerAttr) {
      case 'samesite': {
        const [lowerValue, valueASCII] = asciiLower(attrValue)
        if (!valueASCII) {
          cookie.SameSite = SameSiteDefaultMode
          continue
        }
        switch (lowerValue) {
          case 'lax':
            cookie.SameSite = SameSiteLaxMode
            break
          case 'strict':
            cookie.SameSite = SameSiteStrictMode
            break
          case 'none':
            cookie.SameSite = SameSiteNoneMode
            break
          default:
            cookie.SameSite = SameSiteDefaultMode
            break
        }
        continue
      }
      case 'secure':
        cookie.Secure = true
        continue
      case 'httponly':
        cookie.HttpOnly = true
        continue
      case 'domain':
        cookie.Domain = attrValue
        continue
      case 'max-age': {
        if (!/^[+-]?\d+$/.test(attrValue)) {
          break
        }
        let secs = Number.parseInt(attrValue, 10)
        if (
          (secs !== 0 && attrValue[0] === '0') ||
          !Number.isSafeInteger(secs)
        ) {
          break
        }
        if (secs <= 0) {
          secs = -1
        }
        cookie.MaxAge = secs
        continue
      }
      case 'expires': {
        cookie.RawExpires = attrValue
        const parsed = new globalThis.Date(attrValue)
        if (Number.isNaN(parsed.getTime())) {
          break
        }
        cookie.Expires = time.UnixMilli(parsed.getTime())
        continue
      }
      case 'path':
        cookie.Path = attrValue
        continue
      case 'partitioned':
        cookie.Partitioned = true
        continue
    }
    unparsed.push(part)
  }
  cookie.Unparsed = unparsed.length === 0 ? null : $.arrayToSlice(unparsed)
  return [cookie, null]
}

export function NewRequest(
  method: string,
  url: string,
  body: io.Reader | null,
): [Request | null, $.GoError] {
  return NewRequestWithContext(context.Background(), method, url, body)
}

export function NewRequestWithContext(
  ctx: context.Context,
  method: string,
  url: string,
  body: io.Reader | null,
): [Request | null, $.GoError] {
  if (method === '') {
    method = MethodGet
  }
  if (!isToken(method)) {
    return [
      null,
      errors.New(`net/http: invalid method ${JSON.stringify(method)}`),
    ]
  }
  if (ctx == null) {
    return [null, errors.New('net/http: nil Context')]
  }
  const [parsedURL, err] = parseRequestURL(url)
  if (err != null || parsedURL == null) {
    return [null, err]
  }
  const bodyInfo = requestBodyInfo(body, 0)
  return [
    new Request({
      Method: method,
      URL: parsedURL,
      Body: bodyInfo.Body,
      ContentLength: bodyInfo.ContentLength,
      Host: parsedURL.Host,
      ctx,
    }),
    null,
  ]
}

export async function Get(_url: string): Promise<[Response | null, $.GoError]> {
  const [req, err] = NewRequest(MethodGet, _url, null)
  if (err != null) {
    return [null, err]
  }
  return await DefaultClient.Do(req)
}

export async function Head(
  _url: string,
): Promise<[Response | null, $.GoError]> {
  const [req, err] = NewRequest(MethodHead, _url, null)
  if (err != null) {
    return [null, err]
  }
  return await DefaultClient.Do(req)
}

export async function Post(
  _url: string,
  contentType: string,
  body: io.Reader | null,
): Promise<[Response | null, $.GoError]> {
  const [req, err] = NewRequest(MethodPost, _url, body)
  if (err != null || req == null) {
    return [null, err]
  }
  Header_Set(req.Header, 'Content-Type', contentType)
  return await DefaultClient.Do(req)
}

export async function PostForm(
  _url: string,
  data: any,
): Promise<[Response | null, $.GoError]> {
  return await DefaultClient.PostForm(_url, data)
}

export function ProxyFromEnvironment(
  _req: Request | $.VarRef<Request> | null,
): [any, $.GoError] {
  return [null, null]
}

export function ProxyURL(
  fixedURL: any,
): (req: Request | $.VarRef<Request> | null) => [any, $.GoError] {
  return () => [fixedURL, null]
}

export function ReadRequest(_reader: any): [Request | null, $.GoError] {
  return [null, ErrNotSupported]
}

export function ReadResponse(
  _reader: any,
  _req: Request | $.VarRef<Request> | null,
): [Response | null, $.GoError] {
  return [null, ErrNotSupported]
}

export async function ServeContent(
  w: ResponseWriter | null,
  req: Request | $.VarRef<Request> | null,
  _name: string,
  _modtime: time.Time,
  content: io.Reader | null,
): Promise<void> {
  if (content == null) {
    NotFound(w, req)
    return
  }
  const [data, err] = await io.ReadAll(content)
  if (err != null) {
    Error(w, err.Error(), StatusInternalServerError)
    return
  }
  w?.WriteHeader(StatusOK)
  const request = $.pointerValueOrNil(req)
  if (request?.Method !== MethodHead) {
    w?.Write(data)
  }
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

function requestBodyInfo(
  body: io.Reader | null,
  unknownLength: number,
): { Body: io.ReadCloser | null; ContentLength: number } {
  if (body == null) {
    return { Body: null, ContentLength: 0 }
  }
  const value = $.pointerValueOrNil<any>(body as any)
  if (value === NoBody) {
    return { Body: NoBody, ContentLength: 0 }
  }
  if (
    value instanceof bytes.Buffer ||
    value instanceof bytes.Reader ||
    value instanceof strings.Reader
  ) {
    const length = value.Len()
    return {
      Body: length === 0 ? NoBody : readCloserForBody(body),
      ContentLength: length,
    }
  }
  return { Body: readCloserForBody(body), ContentLength: unknownLength }
}

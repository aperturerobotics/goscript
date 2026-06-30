import { afterEach, describe, expect, it } from 'vitest'

import { varRef } from '../../builtin/varRef.js'
import * as $ from '../../builtin/index.js'
import * as bytes from '../../bytes/index.js'
import * as context from '../../context/index.js'
import * as io from '../../io/index.js'
import * as strings from '../../strings/index.js'
import {
  AllowQuerySemicolons,
  CanonicalHeaderKey,
  Client,
  Cookie,
  DefaultClient,
  DefaultMaxHeaderBytes,
  DefaultMaxIdleConnsPerHost,
  DefaultServeMux,
  DefaultTransport,
  DetectContentType,
  ErrNotSupported,
  ErrServerClosed,
  File,
  FileServer,
  FileServerFS,
  FileSystem,
  FS,
  Get,
  Handle,
  HandleFunc,
  Head,
  Header,
  Header_Add,
  Header_Clone,
  Header_Del,
  Header_Get,
  Header_Set,
  Header_Values,
  Header_Write,
  HandlerFunc_ServeHTTP,
  ListenAndServe,
  ListenAndServeTLS,
  MaxBytesError,
  MaxBytesHandler,
  MaxBytesReader,
  NewFileTransport,
  NewFileTransportFS,
  MethodGet,
  MethodHead,
  MethodOptions,
  MethodPost,
  MethodDelete,
  MethodPatch,
  MethodPut,
  NewCrossOriginProtection,
  NewRequest,
  NewRequestWithContext,
  NewResponseController,
  NewServeMux,
  NoBody,
  NotFound,
  NotFoundHandler,
  ParseCookie,
  ParseHTTPVersion,
  ParseSetCookie,
  ParseTime,
  PostForm,
  Post,
  Protocols,
  ProxyFromEnvironment,
  ProxyURL,
  RegisterInProcessServer,
  ReadRequest,
  ReadResponse,
  Redirect,
  RedirectHandler,
  SameSiteStrictMode,
  SetCookie,
  StatusBadGateway,
  Request,
  Response,
  ResponseWriter,
  ServeContent,
  ServeFile,
  ServeFileFS,
  Serve,
  Server,
  ServeTLS,
  StatusCreated,
  StatusForbidden,
  StatusFound,
  StatusMethodNotAllowed,
  StatusNotFound,
  StatusOK,
  StatusPartialContent,
  StatusRequestedRangeNotSatisfiable,
  StatusServiceUnavailable,
  StatusTeapot,
  StatusText,
  StatusTooManyRequests,
  StatusUnauthorized,
  StatusUnsupportedMediaType,
  StatusNetworkAuthenticationRequired,
  TimeFormat,
  TimeoutHandler,
  TrailerPrefix,
  StripPrefix,
  Transport,
  UnregisterInProcessServer,
} from './index.js'

const originalFetch = globalThis.fetch

class testResponseWriter implements ResponseWriter {
  public Code = 0
  public Body = new bytes.Buffer()
  private headerMap = new Header()

  public Header(): Header {
    return this.headerMap
  }

  public Write(p: $.Slice<number>): [number, $.GoError] {
    return this.Body.Write(p)
  }

  public WriteHeader(statusCode: number): void {
    this.Code = statusCode
  }
}

describe('net/http override', () => {
  afterEach(() => {
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: originalFetch,
    })
  })

  it('exports response status helpers', () => {
    const resp = new Response({ StatusCode: StatusOK })

    expect(resp.StatusCode).toBe(200)
    expect(StatusText(resp.StatusCode)).toBe('OK')
    expect(StatusText(StatusNotFound)).toBe('Not Found')
    expect(StatusText(StatusUnauthorized)).toBe('Unauthorized')
    expect(StatusText(StatusForbidden)).toBe('Forbidden')
    expect(StatusText(StatusMethodNotAllowed)).toBe('Method Not Allowed')
    expect(StatusText(StatusUnsupportedMediaType)).toBe(
      'Unsupported Media Type',
    )
    expect(StatusText(StatusTeapot)).toBe("I'm a teapot")
    expect(StatusText(StatusTooManyRequests)).toBe('Too Many Requests')
    expect(StatusText(StatusBadGateway)).toBe('Bad Gateway')
    expect(StatusText(StatusServiceUnavailable)).toBe('Service Unavailable')
    expect(StatusText(StatusNetworkAuthenticationRequired)).toBe(
      'Network Authentication Required',
    )
    expect(StatusText(599)).toBe('')
    Header_Set(resp.Header, 'X-Test', 'ok')
    resp.Body = io.NopCloser(bytes.NewReader($.stringToBytes('body')))
    const written = new bytes.Buffer()
    expect(resp.Write(written)).toBeNull()
    expect(Buffer.from(written.Bytes()).toString('utf8')).toBe(
      'HTTP/1.1 200 OK\r\nX-Test: ok\r\n\r\nbody',
    )
    expect(MethodGet).toBe('GET')
    expect(MethodHead).toBe('HEAD')
    expect(MethodPost).toBe('POST')
    expect(MethodPut).toBe('PUT')
    expect(MethodPatch).toBe('PATCH')
    expect(MethodDelete).toBe('DELETE')
    expect(StatusCreated).toBe(201)
    expect(DefaultMaxHeaderBytes).toBe(1 << 20)
    expect(DefaultMaxIdleConnsPerHost).toBe(2)
    expect(TimeFormat).toBe('Mon, 02 Jan 2006 15:04:05 GMT')
    expect(TrailerPrefix).toBe('Trailer:')
    expect(ErrServerClosed.Error()).toBe('http: Server closed')
  })

  it('parses HTTP/1 request and response wire format like Go', async () => {
    const requestCases = [
      {
        wire:
          'GET /alpha?x=1 HTTP/1.1\r\n' +
          'Host: example.com\r\n' +
          'User-Agent: probe\r\n' +
          'X-Test: one\r\n' +
          'X-Test: two\r\n' +
          'Content-Length: 0\r\n' +
          '\r\n',
        want: {
          method: 'GET',
          requestURI: '/alpha?x=1',
          path: '/alpha',
          rawQuery: 'x=1',
          protoMajor: 1,
          protoMinor: 1,
          host: 'example.com',
          userAgent: 'probe',
          xTestValues: 2,
          contentLength: 0,
          close: false,
          transferEncoding: [],
          body: '',
        },
      },
      {
        wire:
          'POST /submit HTTP/1.0\r\n' +
          'Host: example.com\r\n' +
          'Content-Length: 4\r\n' +
          'Connection: close\r\n' +
          '\r\n' +
          'body',
        want: {
          method: 'POST',
          requestURI: '/submit',
          path: '/submit',
          rawQuery: '',
          protoMajor: 1,
          protoMinor: 0,
          host: 'example.com',
          userAgent: '',
          xTestValues: 0,
          contentLength: 4,
          close: true,
          transferEncoding: [],
          body: 'body',
        },
      },
      {
        wire:
          'POST /chunk HTTP/1.1\r\n' +
          'Host: example.com\r\n' +
          'Transfer-Encoding: chunked\r\n' +
          '\r\n' +
          '5\r\nhello\r\n0\r\n\r\n',
        want: {
          method: 'POST',
          requestURI: '/chunk',
          path: '/chunk',
          rawQuery: '',
          protoMajor: 1,
          protoMinor: 1,
          host: 'example.com',
          userAgent: '',
          xTestValues: 0,
          contentLength: -1,
          close: false,
          transferEncoding: ['chunked'],
          body: 'hello',
        },
      },
    ]

    for (const { wire, want } of requestCases) {
      const [req, err] = await ReadRequest(strings.NewReader(wire))
      const [body, bodyErr] = await io.ReadAll(req!.Body!)

      expect(err).toBeNull()
      expect(req!.Method).toBe(want.method)
      expect(req!.RequestURI).toBe(want.requestURI)
      expect(req!.URL.Path).toBe(want.path)
      expect(req!.URL.RawQuery).toBe(want.rawQuery)
      expect(req!.ProtoMajor).toBe(want.protoMajor)
      expect(req!.ProtoMinor).toBe(want.protoMinor)
      expect(req!.Host).toBe(want.host)
      expect(req!.UserAgent()).toBe(want.userAgent)
      expect(
        Array.from(Header_Values(req!.Header, 'X-Test') ?? []),
      ).toHaveLength(want.xTestValues)
      expect(req!.ContentLength).toBe(BigInt(want.contentLength))
      expect(req!.Close).toBe(want.close)
      expect(Array.from(req!.TransferEncoding ?? [])).toEqual(
        want.transferEncoding,
      )
      expect($.bytesToString(body)).toBe(want.body)
      expect(bodyErr).toBeNull()
    }

    const responseCases = [
      {
        wire:
          'HTTP/1.1 201 Created\r\n' +
          'Content-Type: text/plain\r\n' +
          'Content-Length: 5\r\n' +
          '\r\n' +
          'hello',
        want: {
          status: '201 Created',
          statusCode: 201,
          protoMajor: 1,
          protoMinor: 1,
          contentType: 'text/plain',
          contentLength: 5,
          close: false,
          transferEncoding: [],
          body: 'hello',
        },
      },
      {
        wire: 'HTTP/1.0 204 No Content\r\nConnection: close\r\n\r\n',
        want: {
          status: '204 No Content',
          statusCode: 204,
          protoMajor: 1,
          protoMinor: 0,
          contentType: '',
          contentLength: 0,
          close: true,
          transferEncoding: [],
          body: '',
        },
      },
      {
        wire:
          'HTTP/1.1 200 OK\r\n' +
          'Transfer-Encoding: chunked\r\n' +
          '\r\n' +
          '5\r\nhello\r\n0\r\n\r\n',
        want: {
          status: '200 OK',
          statusCode: 200,
          protoMajor: 1,
          protoMinor: 1,
          contentType: '',
          contentLength: -1,
          close: false,
          transferEncoding: ['chunked'],
          body: 'hello',
        },
      },
    ]

    for (const { wire, want } of responseCases) {
      const [resp, err] = await ReadResponse(strings.NewReader(wire), null)
      const [body, bodyErr] = await io.ReadAll(resp!.Body!)

      expect(err).toBeNull()
      expect(resp!.Status).toBe(want.status)
      expect(resp!.StatusCode).toBe(want.statusCode)
      expect(resp!.ProtoMajor).toBe(want.protoMajor)
      expect(resp!.ProtoMinor).toBe(want.protoMinor)
      expect(Header_Get(resp!.Header, 'Content-Type')).toBe(want.contentType)
      expect(resp!.ContentLength).toBe(BigInt(want.contentLength))
      expect(resp!.Close).toBe(want.close)
      expect(Array.from(resp!.TransferEncoding ?? [])).toEqual(
        want.transferEncoding,
      )
      expect($.bytesToString(body)).toBe(want.body)
      expect(bodyErr).toBeNull()
    }
  })

  it('exports common header and protocol utility surfaces', () => {
    const header = new Header()
    Header_Add(header, 'content-type', 'text/plain')
    Header_Add(header, 'Content-Type', 'charset=utf-8')
    const cloned = Header_Clone(header)
    Header_Add(cloned, 'Content-Type', 'copy')

    expect(CanonicalHeaderKey('content-type')).toBe('Content-Type')
    expect(Array.from(Header_Values(header, 'CONTENT-TYPE') ?? [])).toEqual([
      'text/plain',
      'charset=utf-8',
    ])
    expect(Array.from(Header_Values(cloned, 'Content-Type') ?? [])).toContain(
      'copy',
    )
    expect(
      Array.from(Header_Values(header, 'Content-Type') ?? []),
    ).not.toContain('copy')

    const written = new bytes.Buffer()
    expect(Header_Write(header, written)).toBeNull()
    expect(Buffer.from(written.Bytes()).toString('utf8')).toContain(
      'Content-Type: text/plain\r\n',
    )

    expect(ParseHTTPVersion('HTTP/2.0')).toEqual([2, 0, true])
    expect(ParseHTTPVersion('h2')).toEqual([0, 0, false])

    const protocols = new Protocols()
    protocols.SetHTTP1(true)
    protocols.SetUnencryptedHTTP2(true)
    expect(protocols.HTTP1()).toBe(true)
    expect(protocols.HTTP2()).toBe(false)
    expect(protocols.String()).toBe('{HTTP1,UnencryptedHTTP2}')
  })

  it('accepts pointer-wrapped headers from generated ResponseWriter methods', () => {
    const header = varRef(new Header())

    Header_Set(header, 'content-length', '12')
    Header_Add(header, 'content-type', 'text/plain')

    expect(Header_Get(header, 'Content-Length')).toBe('12')
    expect(Array.from(Header_Values(header, 'Content-Type') ?? [])).toEqual([
      'text/plain',
    ])

    const cloned = Header_Clone(header)
    Header_Del(header, 'Content-Type')

    expect(Header_Get(header, 'Content-Type')).toBe('')
    expect(Header_Get(cloned, 'Content-Type')).toBe('text/plain')
  })

  it('accepts interface-boxed named headers from generated interface calls', () => {
    const header = $.namedValueInterfaceValue(new Header(), 'http.Header', {})

    Header_Set(header, 'content-length', '12')
    Header_Add(header, 'content-type', 'text/plain')

    expect(Header_Get(header, 'Content-Length')).toBe('12')
    expect(Array.from(Header_Values(header, 'Content-Type') ?? [])).toEqual([
      'text/plain',
    ])
  })

  it('validates outgoing request construction', () => {
    const [req, reqErr] = NewRequestWithContext(
      context.Background(),
      '',
      'https://example.invalid/path?q=1',
      null,
    )
    expect(reqErr).toBeNull()
    expect(req?.Method).toBe(MethodGet)
    expect(req?.Host).toBe('example.invalid')
    expect(req?.URL?.Path).toBe('/path')
    expect(req?.URL?.RawQuery).toBe('q=1')

    expect(
      NewRequestWithContext(
        context.Background(),
        'bad method',
        'https://example.invalid/',
        null,
      )[1]?.Error(),
    ).toBe('net/http: invalid method "bad method"')
    expect(
      NewRequestWithContext(
        null,
        MethodGet,
        'https://example.invalid/',
        null,
      )[1]?.Error(),
    ).toBe('net/http: nil Context')
    expect(
      NewRequestWithContext(
        context.Background(),
        MethodGet,
        'http://[::1',
        null,
      )[1],
    ).not.toBeNull()
    expect(
      NewRequestWithContext(
        context.Background(),
        MethodGet,
        'http://x/%zz',
        null,
      )[1],
    ).not.toBeNull()

    const [bodyReq, bodyReqErr] = NewRequest(
      MethodPost,
      'https://example.invalid/upload',
      bytes.NewReader($.stringToBytes('abc')),
    )
    expect(bodyReqErr).toBeNull()
    expect(bodyReq?.ContentLength).toBe(3n)
    const [stringReq, stringReqErr] = NewRequest(
      MethodPost,
      'https://example.invalid/upload',
      strings.NewReader('abcd'),
    )
    expect(stringReqErr).toBeNull()
    expect(stringReq?.ContentLength).toBe(4n)
    const [noBodyReq, noBodyErr] = NewRequest(
      MethodPost,
      'https://example.invalid/upload',
      NoBody,
    )
    expect(noBodyErr).toBeNull()
    expect(noBodyReq?.ContentLength).toBe(0n)
    expect(noBodyReq?.Body).toBe(NoBody)
  })

  it('decodes escaped request paths like native net/http', () => {
    const [req, reqErr] = NewRequestWithContext(
      context.Background(),
      MethodGet,
      'https://example.invalid/files/what%20is%20this.mp4?inline=1',
      null,
    )

    expect(reqErr).toBeNull()
    expect(req?.URL?.Path).toBe('/files/what is this.mp4')
    expect(req?.URL?.RawQuery).toBe('inline=1')
  })

  it('applies cross-origin protection checks', () => {
    const protection = NewCrossOriginProtection()
    const [sameOrigin] = NewRequest(
      MethodPost,
      'https://example.invalid/update',
      null,
    )
    Header_Set(sameOrigin!.Header, 'Sec-Fetch-Site', 'same-origin')
    expect(protection.Check(sameOrigin)).toBeNull()

    const [noHeaders] = NewRequest(
      MethodPost,
      'https://example.invalid/update',
      null,
    )
    expect(protection.Check(noHeaders)).toBeNull()

    const [safe] = NewRequest(
      MethodOptions,
      'https://example.invalid/update',
      null,
    )
    Header_Set(safe!.Header, 'Sec-Fetch-Site', 'cross-site')
    expect(protection.Check(safe)).toBeNull()

    const [matchingOrigin] = NewRequest(
      MethodPost,
      'https://example.invalid/update',
      null,
    )
    Header_Set(matchingOrigin!.Header, 'Origin', 'https://example.invalid')
    expect(protection.Check(matchingOrigin)).toBeNull()

    const [crossSite] = NewRequest(
      MethodPost,
      'https://example.invalid/update',
      null,
    )
    Header_Set(crossSite!.Header, 'Sec-Fetch-Site', 'cross-site')
    expect(protection.Check(crossSite)?.Error()).toContain('Sec-Fetch-Site')

    const [oldBrowser] = NewRequest(
      MethodPost,
      'https://example.invalid/update',
      null,
    )
    Header_Set(oldBrowser!.Header, 'Origin', 'https://attacker.invalid')
    expect(protection.Check(oldBrowser)?.Error()).toContain(
      'Origin does not match Host',
    )

    expect(protection.AddTrustedOrigin('https://trusted.invalid')).toBeNull()
    expect(
      protection.AddTrustedOrigin('https://trusted.invalid/'),
    ).not.toBeNull()
    const [trusted] = NewRequest(
      MethodPost,
      'https://example.invalid/update',
      null,
    )
    Header_Set(trusted!.Header, 'Origin', 'https://trusted.invalid')
    Header_Set(trusted!.Header, 'Sec-Fetch-Site', 'cross-site')
    expect(protection.Check(trusted)).toBeNull()

    protection.AddInsecureBypassPattern('/bypass/')
    protection.AddInsecureBypassPattern('POST /post-only/')
    const [bypass] = NewRequest(
      MethodPost,
      'https://example.invalid/bypass/ok',
      null,
    )
    Header_Set(bypass!.Header, 'Origin', 'https://attacker.invalid')
    Header_Set(bypass!.Header, 'Sec-Fetch-Site', 'cross-site')
    expect(protection.Check(bypass)).toBeNull()

    const [methodBypass] = NewRequest(
      MethodPost,
      'https://example.invalid/post-only/',
      null,
    )
    Header_Set(methodBypass!.Header, 'Origin', 'https://attacker.invalid')
    expect(protection.Check(methodBypass)).toBeNull()
  })

  it('routes cross-origin protection handlers through deny and success paths', () => {
    const protection = NewCrossOriginProtection()
    let served = false
    const handler = protection.Handler({
      ServeHTTP(w) {
        served = true
        w?.WriteHeader(StatusOK)
      },
    })
    const [blocked] = NewRequest(
      MethodPost,
      'https://example.invalid/update',
      null,
    )
    Header_Set(blocked!.Header, 'Sec-Fetch-Site', 'cross-site')
    const blockedWriter = new testResponseWriter()

    handler.ServeHTTP(blockedWriter, blocked)

    expect(served).toBe(false)
    expect(blockedWriter.Code).toBe(StatusForbidden)

    protection.SetDenyHandler({
      ServeHTTP(w) {
        w?.WriteHeader(StatusTeapot)
      },
    })
    const deniedWriter = new testResponseWriter()
    handler.ServeHTTP(deniedWriter, blocked)
    expect(deniedWriter.Code).toBe(StatusTeapot)

    const [safe] = NewRequest(MethodGet, 'https://example.invalid/update', null)
    const allowedWriter = new testResponseWriter()
    handler.ServeHTTP(allowedWriter, safe)
    expect(served).toBe(true)
    expect(allowedWriter.Code).toBe(StatusOK)
  })

  it('parses cookies and reports syntax errors', () => {
    const [cookies, cookieErr] = ParseCookie('Cookie-1="v$1"; c2=v2')
    expect(cookieErr).toBeNull()
    expect(cookies?.[0]?.Name).toBe('Cookie-1')
    expect(cookies?.[0]?.Value).toBe('v$1')
    expect(cookies?.[0]?.Quoted).toBe(true)
    expect(cookies?.[1]?.Name).toBe('c2')
    expect(cookies?.[1]?.Value).toBe('v2')

    expect(ParseCookie('')[1]?.Error()).toBe('http: blank cookie')
    expect(ParseCookie('missing-equals')[1]?.Error()).toBe(
      "http: '=' not found in cookie",
    )
    expect(ParseCookie('=v1')[1]?.Error()).toBe('http: invalid cookie name')
    expect(ParseCookie('k1=\\')[1]?.Error()).toBe('http: invalid cookie value')

    const [setCookie, setErr] = ParseSetCookie(
      'sid=abc; Path=/app; Domain=example.invalid; HttpOnly; Secure; SameSite=Strict; Max-Age=60; Partitioned',
    )
    expect(setErr).toBeNull()
    expect(setCookie?.Name).toBe('sid')
    expect(setCookie?.Value).toBe('abc')
    expect(setCookie?.Path).toBe('/app')
    expect(setCookie?.Domain).toBe('example.invalid')
    expect(setCookie?.HttpOnly).toBe(true)
    expect(setCookie?.Secure).toBe(true)
    expect(setCookie?.SameSite).toBe(SameSiteStrictMode)
    expect(setCookie?.MaxAge).toBe(60)
    expect(setCookie?.Partitioned).toBe(true)
    expect(setCookie?.Raw).toContain('sid=abc')

    const [spaced, spacedErr] = ParseSetCookie('special-9 =","')
    expect(spacedErr).toBeNull()
    expect(spaced?.Name).toBe('special-9')
    expect(spaced?.Value).toBe(',')
    expect(spaced?.Quoted).toBe(true)

    expect(ParseSetCookie('')[1]?.Error()).toBe('http: blank cookie')
    expect(ParseSetCookie('missing-equals')[1]?.Error()).toBe(
      "http: '=' not found in cookie",
    )
    expect(ParseSetCookie('=v1')[1]?.Error()).toBe('http: invalid cookie name')
    expect(ParseSetCookie('k1=\\')[1]?.Error()).toBe(
      'http: invalid cookie value',
    )
  })

  it('exports no-body, limit-reader, and unsupported controller surfaces', async () => {
    const empty = new Uint8Array(1)
    const [n, err] = NoBody.Read(empty)
    expect(n).toBe(0)
    expect(err).toBe(io.EOF)
    expect(NoBody.Close()).toBeNull()

    const limited = MaxBytesReader(
      null,
      {
        Read: (p: Uint8Array) => {
          p[0] = 1
          if (p.length > 1) {
            p[1] = 2
          }
          return [1, null]
        },
        Close: () => null,
      },
      1,
    )
    const limitedBuf = new Uint8Array(2)
    expect(limited.Read(limitedBuf)).toEqual([1, null])
    expect(limitedBuf[0]).toBe(1)
    const [, limitErr] = limited.Read(new Uint8Array(1))
    expect(limitErr).toBeInstanceOf(MaxBytesError)

    const exactReader = MaxBytesReader(
      null,
      io.NopCloser(bytes.NewReader($.stringToBytes('ok'))),
      2,
    )
    const [exactData, exactErr] = await io.ReadAll(exactReader)
    expect(exactErr).toBeNull()
    expect(Buffer.from(exactData ?? []).toString('utf8')).toBe('ok')

    const tooLarge = MaxBytesReader(
      null,
      io.NopCloser(bytes.NewReader($.stringToBytes('toolarge'))),
      2,
    )
    const tooLargeBuf = new Uint8Array(8)
    const [tooLargeN, tooLargeErr] = tooLarge.Read(tooLargeBuf)
    expect(tooLargeN).toBe(2)
    expect(tooLargeErr).toBeInstanceOf(MaxBytesError)
    expect((tooLargeErr as MaxBytesError).Limit).toBe(2)
    expect(Buffer.from(tooLargeBuf.slice(0, tooLargeN)).toString('utf8')).toBe(
      'to',
    )

    const controller = NewResponseController(null)
    expect(controller.Hijack()[2]).toBe(ErrNotSupported)
    expect(controller.SetReadDeadline({} as any)).toBe(ErrNotSupported)
    expect(ListenAndServe(':0', null)).toBe(ErrNotSupported)
    expect(ListenAndServeTLS(':0', 'cert.pem', 'key.pem', null)).toBe(
      ErrNotSupported,
    )
    expect(Serve(null, null)).toBe(ErrNotSupported)
    expect(ServeTLS(null, null, 'cert.pem', 'key.pem')).toBe(ErrNotSupported)
    expect(new Transport().Clone()).toBeInstanceOf(Transport)
  })

  it('wraps a cloned request body in MaxBytesHandler', () => {
    const body = io.NopCloser(bytes.NewReader($.stringToBytes('ok')))
    const [req] = NewRequest(MethodPost, 'http://example.invalid/upload', body)
    let servedReq: any = null
    const handler = MaxBytesHandler(
      {
        ServeHTTP(_w, r) {
          servedReq = $.pointerValue(r)
          Header_Set(servedReq.Header, 'X-Shared', 'true')
        },
      },
      1,
    )

    handler.ServeHTTP(null, req)

    expect(servedReq).not.toBe(req)
    expect(servedReq.Body).not.toBe(body)
    expect(req!.Body).toBe(body)
    expect(Header_Get(req!.Header, 'X-Shared')).toBe('true')
  })

  it('routes Get through fetch-backed DefaultTransport', async () => {
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: async () =>
        new globalThis.Response('hello', {
          status: StatusOK,
          statusText: 'OK',
          headers: { 'Content-Length': '5', 'X-Test': 'ok' },
        }),
    })

    const [resp, err] = await Get('https://example.invalid')

    expect(err).toBeNull()
    expect(resp?.StatusCode).toBe(StatusOK)
    expect(Header_Get(resp!.Header, 'x-test')).toBe('ok')
  })

  it('accepts VarRef requests for client calls', async () => {
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: async () => {
        throw new Error('network down')
      },
    })
    const [req, reqErr] = NewRequest(
      MethodPost,
      'https://example.invalid',
      null,
    )
    expect(reqErr).toBeNull()
    expect((req!.URL as any).Path).toBe('/')
    expect(req!.Host).toBe('example.invalid')
    expect(req!.RequestURI).toBe('')

    const [resp, err] = await new Client().Do(varRef(req!))
    expect(resp).toBeNull()
    expect(err?.Error()).toContain('network down')
  })

  it('wraps request body readers and keeps response metadata', () => {
    const reader = {
      Read: (p: Uint8Array) => [p.length, null] as [number, null],
    }

    const [req, reqErr] = NewRequest(
      MethodPost,
      'https://example.invalid/upload',
      reader,
    )

    expect(reqErr).toBeNull()
    expect(req!.Body).not.toBeNull()
    expect(req!.Body!.Close()).toBeNull()

    const resp = new Response({
      StatusCode: StatusCreated,
      ContentLength: -1n,
      Request: varRef(req!),
    })
    expect(resp.ContentLength).toBe(-1n)
    expect($.pointerValue(resp.Request)).toBe(req)
  })

  it('exports fetch-backed default transport surface', async () => {
    let requestBodyClosed = false
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: async (input: RequestInfo | URL, init?: RequestInit) => {
        expect(String(input)).toBe('https://example.invalid/upload')
        expect(init?.method).toBe(MethodPost)
        const headers = init?.headers as Headers
        expect(headers.get('Range')).toBe('bytes=0-9')
        expect(headers.get('Authorization')).toBe('Bearer test')
        expect(
          Buffer.from((init?.body as Uint8Array) ?? []).toString('utf8'),
        ).toBe('payload')
        return new globalThis.Response('accepted', {
          status: StatusCreated,
          statusText: 'Created',
          headers: { 'Content-Length': '8', 'X-Reply': 'yes' },
        })
      },
    })
    const payload = bytes.NewReader($.stringToBytes('payload'))
    const requestBody = {
      Read: payload.Read.bind(payload),
      Close: () => {
        requestBodyClosed = true
        return null
      },
    }
    const [req] = NewRequest(
      MethodPost,
      'https://example.invalid/upload',
      requestBody,
    )
    Header_Set(req!.Header, 'Range', 'bytes=0-9')
    Header_Set(req!.Header, 'Authorization', 'Bearer test')

    const [resp, err] = await DefaultTransport.RoundTrip(req)

    expect(err).toBeNull()
    expect(resp?.StatusCode).toBe(StatusCreated)
    expect(resp?.ContentLength).toBe(8n)
    expect(Header_Get(resp!.Header, 'x-reply')).toBe('yes')
    expect(requestBodyClosed).toBe(true)
  })

  it('returns from fetch-backed RoundTrip after response headers', async () => {
    let arrayBufferCalled = false
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: async () => {
        const response = new globalThis.Response(null, {
          status: StatusOK,
          statusText: 'OK',
          headers: { 'Content-Length': '5' },
        })
        Object.defineProperty(response, 'arrayBuffer', {
          configurable: true,
          value: () => {
            arrayBufferCalled = true
            return new Promise<ArrayBuffer>(() => {})
          },
        })
        return response
      },
    })
    const [req] = NewRequest(MethodPost, 'https://example.invalid/upload', null)

    const [resp, err] = await Promise.race([
      DefaultTransport.RoundTrip(req),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('RoundTrip did not return')), 25),
      ),
    ])

    expect(err).toBeNull()
    expect(resp?.StatusCode).toBe(StatusOK)
    expect(resp?.ContentLength).toBe(5n)
    expect(arrayBufferCalled).toBe(false)
    expect(resp?.Body?.Close()).toBeNull()
  })

  it('reads fetch-backed response bodies after RoundTrip returns', async () => {
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: async () =>
        new globalThis.Response('accepted', {
          status: StatusCreated,
          statusText: 'Created',
          headers: { 'Content-Length': '8' },
        }),
    })
    const [req] = NewRequest(MethodPost, 'https://example.invalid/upload', null)

    const [resp, err] = await DefaultTransport.RoundTrip(req)
    const buf = new Uint8Array(16)
    const [n, readErr] = await (resp!.Body!.Read(buf) as any)

    expect(err).toBeNull()
    expect(readErr).toBeNull()
    expect(n).toBe(8)
    expect(Buffer.from(buf.subarray(0, n)).toString('utf8')).toBe('accepted')
    expect(resp?.Body?.Close()).toBeNull()
  })

  it('aborts pending fetches when the request context is canceled', async () => {
    let fetchSignal: AbortSignal | undefined
    let fetchStarted: (() => void) | null = null
    const fetchStartedPromise = new Promise<void>((resolve) => {
      fetchStarted = resolve
    })
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: async (_input: RequestInfo | URL, init?: RequestInit) => {
        fetchSignal = init?.signal ?? undefined
        fetchStarted?.()
        return new Promise<globalThis.Response>((_resolve, reject) => {
          fetchSignal?.addEventListener('abort', () => {
            reject(new Error('aborted'))
          })
        })
      },
    })
    const [ctx, cancel] = context.WithCancel(context.Background())
    const [req] = NewRequest(MethodPost, 'https://example.invalid/upload', null)

    const roundTrip = DefaultTransport.RoundTrip(req!.WithContext(ctx))
    await fetchStartedPromise
    cancel?.()
    const [resp, err] = await roundTrip

    expect(resp).toBeNull()
    expect(err).toBe(context.Canceled)
    expect(fetchSignal?.aborted).toBe(true)
  })

  it('aborts pending fetch body reads when the request context is canceled', async () => {
    let fetchSignal: AbortSignal | undefined
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: async (_input: RequestInfo | URL, init?: RequestInit) => {
        fetchSignal = init?.signal ?? undefined
        const response = new globalThis.Response(null, { status: StatusOK })
        Object.defineProperty(response, 'arrayBuffer', {
          configurable: true,
          value: () =>
            new Promise<ArrayBuffer>((_resolve, reject) => {
              fetchSignal?.addEventListener('abort', () => {
                reject(new Error('body aborted'))
              })
            }),
        })
        return response
      },
    })
    const [ctx, cancel] = context.WithCancel(context.Background())
    const [req] = NewRequest(MethodPost, 'https://example.invalid/upload', null)

    const [resp, roundTripErr] = await DefaultTransport.RoundTrip(
      req!.WithContext(ctx),
    )
    const read = resp!.Body!.Read(new Uint8Array(8)) as any
    cancel?.()
    const [n, readErr] = await read

    expect(roundTripErr).toBeNull()
    expect(n).toBe(0)
    expect(readErr).toBe(context.Canceled)
    expect(fetchSignal?.aborted).toBe(true)
  })

  it('closes request bodies when fetch body reads fail', async () => {
    let requestBodyClosed = false
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: async () => {
        throw new Error('fetch should not run')
      },
    })
    const readErr = $.newError('read failed')
    const [req] = NewRequest(MethodPost, 'https://example.invalid/upload', {
      Read: () => [0, readErr],
      Close: () => {
        requestBodyClosed = true
        return null
      },
    })

    const [resp, err] = await DefaultTransport.RoundTrip(req)

    expect(resp).toBeNull()
    expect(err).toBe(readErr)
    expect(requestBodyClosed).toBe(true)
  })

  it('closes request bodies before unsupported and canceled requests return', async () => {
    let unsupportedClosed = false
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: undefined,
    })
    const [unsupportedReq] = NewRequest(
      MethodPost,
      'https://example.invalid/upload',
      {
        Read: () => [0, null],
        Close: () => {
          unsupportedClosed = true
          return null
        },
      },
    )

    const [unsupportedResp, unsupportedErr] =
      await DefaultTransport.RoundTrip(unsupportedReq)

    expect(unsupportedResp).toBeNull()
    expect(unsupportedErr?.Error()).toContain('Client.Do is not implemented')
    expect(unsupportedClosed).toBe(true)

    let canceledClosed = false
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: async () => {
        throw new Error('fetch should not run')
      },
    })
    const [ctx, cancel] = context.WithCancel(context.Background())
    cancel?.()
    const [canceledReq] = NewRequest(
      MethodPost,
      'https://example.invalid/upload',
      {
        Read: () => [0, null],
        Close: () => {
          canceledClosed = true
          return null
        },
      },
    )

    const [canceledResp, canceledErr] = await DefaultTransport.RoundTrip(
      canceledReq!.WithContext(ctx),
    )

    expect(canceledResp).toBeNull()
    expect(canceledErr).toBe(context.Canceled)
    expect(canceledClosed).toBe(true)
  })

  it('closes request bodies for methods that do not send a fetch body', async () => {
    let requestBodyClosed = false
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: async (_input: RequestInfo | URL, init?: RequestInit) => {
        expect(init?.method).toBe(MethodGet)
        expect(init?.body).toBeUndefined()
        return new globalThis.Response('ok', { status: StatusOK })
      },
    })
    const [req] = NewRequest(MethodGet, 'https://example.invalid/read', {
      Read: () => {
        throw new Error('GET body should not be read')
      },
      Close: () => {
        requestBodyClosed = true
        return null
      },
    })

    const [resp, err] = await DefaultTransport.RoundTrip(req)

    expect(err).toBeNull()
    expect(resp?.StatusCode).toBe(StatusOK)
    expect(requestBodyClosed).toBe(true)
  })

  it('closes request bodies after in-process handlers return', async () => {
    let handlerSawBody = false
    let requestBodyClosed = false
    const url = RegisterInProcessServer({
      ServeHTTP: (w, r) => {
        const req = $.pointerValue(r)
        handlerSawBody = req?.Body != null
        expect(req?.RequestURI).toBe('/close?q=1')
        expect(req?.URL.Host).toBe('')
        expect(req?.URL.Scheme).toBe('')
        w?.WriteHeader(StatusOK)
      },
    })
    try {
      const [req] = NewRequest(MethodPost, url + '/close?q=1', {
        Read: () => [0, null],
        Close: () => {
          requestBodyClosed = true
          return null
        },
      })

      const [resp, err] = await DefaultTransport.RoundTrip(req)

      expect(err).toBeNull()
      expect(resp?.StatusCode).toBe(StatusOK)
      expect(handlerSawBody).toBe(true)
      expect(requestBodyClosed).toBe(true)
    } finally {
      UnregisterInProcessServer(url)
    }
  })

  it('suppresses in-process response bodies for HEAD requests', async () => {
    const url = RegisterInProcessServer({
      ServeHTTP(w) {
        w?.WriteHeader(StatusOK)
        w?.Write($.stringToBytes('hidden'))
      },
    })
    try {
      const [req] = NewRequest(MethodHead, url + '/head', null)

      const [resp, err] = await new Transport().RoundTrip(req)

      expect(err).toBeNull()
      const [n, readErr] = resp!.Body!.Read(new Uint8Array(8))
      expect(n).toBe(0)
      expect(readErr).toBe(io.EOF)
    } finally {
      UnregisterInProcessServer(url)
    }
  })

  it('delegates client calls through RoundTripper implementations', async () => {
    const [req] = NewRequest(MethodPost, 'https://example.invalid/path', null)
    Header_Set(req!.Header, 'User-Agent', 'goscript-test')
    req!.RemoteAddr = '127.0.0.1:1234'
    req!.ContentLength = 42n

    const client = new Client({
      Transport: {
        RoundTrip: (got) => {
          const request = $.pointerValue(got)
          expect(request.UserAgent()).toBe('goscript-test')
          expect(request.RemoteAddr).toBe('127.0.0.1:1234')
          expect(request.RequestURI).toBe('')
          expect(request.ContentLength).toBe(42n)
          return [new Response({ StatusCode: StatusOK }), null]
        },
      },
    })

    const [resp, err] = await client.Do(varRef(req!))
    expect(err).toBeNull()
    expect(resp?.StatusCode).toBe(StatusOK)
  })

  it('routes package Head and Post helpers through DefaultClient', async () => {
    const oldTransport = DefaultClient.Transport
    const seen: string[] = []
    DefaultClient.Transport = {
      async RoundTrip(
        got: Request | $.VarRef<Request> | null,
      ): Promise<[Response | null, $.GoError]> {
        const request = $.pointerValue<Request>(got)
        seen.push(request.Method)
        if (request.Method === MethodPost) {
          expect(Header_Get(request.Header, 'Content-Type')).toBe('text/plain')
          const [data, err] = await io.ReadAll(request.Body!)
          expect(err).toBeNull()
          expect($.bytesToString(data)).toBe('payload')
        }
        return [new Response({ StatusCode: StatusOK }), null]
      },
    }
    try {
      const [headResp, headErr] = await Head('https://example.invalid/head')
      const [postResp, postErr] = await Post(
        'https://example.invalid/post',
        'text/plain',
        strings.NewReader('payload'),
      )

      expect(headErr).toBeNull()
      expect(headResp?.StatusCode).toBe(StatusOK)
      expect(postErr).toBeNull()
      expect(postResp?.StatusCode).toBe(StatusOK)
      expect(seen).toEqual([MethodHead, MethodPost])
    } finally {
      DefaultClient.Transport = oldTransport
    }
  })

  it('posts URL-encoded forms through clients and package helper', async () => {
    const transport = {
      async RoundTrip(
        got: Request | $.VarRef<Request> | null,
      ): Promise<[Response | null, $.GoError]> {
        const request = $.pointerValue<Request>(got)
        expect(request.Method).toBe(MethodPost)
        expect(Header_Get(request.Header, 'Content-Type')).toBe(
          'application/x-www-form-urlencoded',
        )
        const [data, err] = await io.ReadAll(request.Body!)
        expect(err).toBeNull()
        expect($.bytesToString(data)).toBe('a=one&a=two&space=x+y')
        return [new Response({ StatusCode: StatusOK }), null]
      },
    }
    const form = new Map<string, $.Slice<string>>([
      ['space', $.arrayToSlice(['x y'])],
      ['a', $.arrayToSlice(['one', 'two'])],
    ])
    const client = new Client({ Transport: transport })

    const [clientResp, clientErr] = await client.PostForm(
      'https://example.invalid/form',
      form,
    )
    expect(clientErr).toBeNull()
    expect(clientResp?.StatusCode).toBe(StatusOK)

    const oldTransport = DefaultClient.Transport
    DefaultClient.Transport = transport
    try {
      const [resp, err] = await PostForm('https://example.invalid/form', form)
      expect(err).toBeNull()
      expect(resp?.StatusCode).toBe(StatusOK)
    } finally {
      DefaultClient.Transport = oldTransport
    }
  })

  it('canonicalizes header keys for case-insensitive lookup', () => {
    const header = new Header()

    Header_Set(header, 'Content-Type', 'application/json')

    expect(header.has('Content-Type')).toBe(true)
    expect(header.has('content-type')).toBe(false)
    expect(Header_Get(header, 'content-type')).toBe('application/json')

    Header_Add(header, 'x-pack-id', 'pack-1')
    Header_Add(header, 'X-Pack-Id', 'pack-2')
    expect(Array.from(header.get('X-Pack-Id') ?? [])).toEqual([
      'pack-1',
      'pack-2',
    ])

    Header_Del(header, 'x-pack-id')
    expect(Header_Get(header, 'X-Pack-ID')).toBe('')
  })

  it('accepts server context and shutdown surfaces', () => {
    const srv = new Server({
      Addr: ':0',
      BaseContext: () => ({}) as any,
      ReadHeaderTimeout: 10,
    })

    expect(srv.Addr).toBe(':0')
    expect(srv.BaseContext?.(null)).toEqual({})
    expect(srv.ReadHeaderTimeout).toBe(10)
    expect(srv.Shutdown({} as any)).toBeNull()
    expect(srv.ListenAndServeTLS('cert.pem', 'key.pem')?.Error()).toBe(
      'net/http: Server.ListenAndServeTLS is not implemented in GoScript',
    )
  })

  it('supports handler functions and not-found responses for typechecked server tests', () => {
    const writes: string[] = []
    const writer: ResponseWriter = {
      Header: () => new Header(),
      Write: (p) => {
        writes.push(Buffer.from(p ?? []).toString('utf8'))
        return [p?.length ?? 0, null]
      },
      WriteHeader: (code) => writes.push(`status:${code}`),
    }

    HandlerFunc_ServeHTTP((_w, _r) => undefined, writer, null)
    NotFound(writer, null)

    expect(writes).toEqual(['status:404', '404 page not found\n'])
  })

  it('accepts nullable handler function receivers for generated method calls', () => {
    const writer: ResponseWriter = {
      Header: () => new Header(),
      Write: (p) => [p?.length ?? 0, null],
      WriteHeader: () => undefined,
    }

    expect(typeof HandlerFunc_ServeHTTP).toBe('function')
    expect(writer.Header()).toBeInstanceOf(Header)
  })

  it('registers Handler for generic runtime assertions', () => {
    const handlerFunc = (_w: ResponseWriter | null, _r: Request | null) =>
      undefined
    const handler = $.namedValueInterfaceValue(
      $.namedFunction(
        $.functionValue(handlerFunc, {
          kind: $.TypeKind.Function,
          params: [
            'http.ResponseWriter',
            {
              kind: $.TypeKind.Pointer,
              elemType: 'http.Request',
            },
          ],
          results: [],
        }),
        'http.HandlerFunc',
        {
          kind: $.TypeKind.Function,
          name: 'http.HandlerFunc',
          params: [
            'http.ResponseWriter',
            {
              kind: $.TypeKind.Pointer,
              elemType: 'http.Request',
            },
          ],
          results: [],
        },
      ),
      'http.HandlerFunc',
      {
        ServeHTTP: (receiver, ...args) =>
          HandlerFunc_ServeHTTP(
            $.isVarRef(receiver) ? receiver.value : receiver,
            ...(args as [ResponseWriter | null, Request | null]),
          ),
      },
      {
        kind: $.TypeKind.Function,
        name: 'http.HandlerFunc',
        params: [
          'http.ResponseWriter',
          {
            kind: $.TypeKind.Pointer,
            elemType: 'http.Request',
          },
        ],
        results: [],
      },
    )

    const [asserted, ok] = $.typeAssertTuple<{
      ServeHTTP(w: ResponseWriter | null, r: Request | null): void
    }>(handler, 'http.Handler')

    expect(ok).toBe(true)
    expect(asserted).toBe(handler)
  })

  it('rejects named method wrappers with incompatible interface arity', () => {
    const handler = $.namedValueInterfaceValue(
      $.namedFunction(
        $.functionValue(() => undefined, {
          kind: $.TypeKind.Function,
          params: [],
          results: [],
        }),
        'http.HandlerFunc',
        {
          kind: $.TypeKind.Function,
          name: 'http.HandlerFunc',
          params: [],
          results: [],
        },
      ),
      'http.HandlerFunc',
      {
        ServeHTTP: (receiver, ...args) =>
          HandlerFunc_ServeHTTP(
            $.isVarRef(receiver) ? receiver.value : receiver,
            ...(args as [ResponseWriter | null, Request | null]),
          ),
      },
      {
        kind: $.TypeKind.Function,
        name: 'http.HandlerFunc',
        params: [],
        results: [],
      },
    )

    const [, ok] = $.typeAssertTuple<{
      ServeHTTP(w: ResponseWriter | null, r: Request | null): void
    }>(handler, 'http.Handler')

    expect(ok).toBe(false)
  })

  it('routes through default mux and handler helper exports', () => {
    const writes: string[] = []
    const writer: ResponseWriter = {
      Header: () => new Header(),
      Write: (p) => {
        writes.push(Buffer.from(p ?? []).toString('utf8'))
        return [p?.length ?? 0, null]
      },
      WriteHeader: (code) => writes.push(`status:${code}`),
    }
    const [req] = NewRequest(MethodGet, 'https://example.invalid/default', null)
    Handle('/default', {
      ServeHTTP(w) {
        w!.WriteHeader(StatusOK)
        w!.Write($.stringToBytes('default mux'))
      },
    })

    DefaultServeMux.ServeHTTP(writer, req)
    NotFoundHandler().ServeHTTP(writer, req)

    expect(writes).toEqual([
      'status:200',
      'default mux',
      'status:404',
      '404 page not found\n',
    ])
  })

  it('covers remaining handler, proxy, redirect, timeout, and FS helpers', async () => {
    const mux = NewServeMux()
    const muxWriter = new testResponseWriter()
    const [muxReq] = NewRequest(MethodGet, 'http://example.invalid/local', null)
    mux.HandleFunc('/local', (w) => {
      w?.WriteHeader(StatusOK)
      w?.Write($.stringToBytes('local mux'))
    })

    mux.ServeHTTP(muxWriter, muxReq)

    expect(muxWriter.Code).toBe(StatusOK)
    expect(muxWriter.Body.String()).toBe('local mux')

    const defaultWriter = new testResponseWriter()
    const [defaultReq] = NewRequest(
      MethodGet,
      'http://example.invalid/phase10-handlefunc',
      null,
    )
    HandleFunc('/phase10-handlefunc', (w) => {
      w?.WriteHeader(StatusOK)
      w?.Write($.stringToBytes('default handlefunc'))
    })

    DefaultServeMux.ServeHTTP(defaultWriter, defaultReq)

    expect(defaultWriter.Code).toBe(StatusOK)
    expect(defaultWriter.Body.String()).toBe('default handlefunc')

    let strippedPath = ''
    const [stripReq] = NewRequest(
      MethodGet,
      'http://example.invalid/static/app.js',
      null,
    )
    const stripWriter = new testResponseWriter()

    StripPrefix('/static', {
      ServeHTTP(_w, r) {
        strippedPath = $.pointerValue<Request>(r).URL.Path
      },
    }).ServeHTTP(stripWriter, stripReq)

    expect(strippedPath).toBe('/app.js')
    expect(stripReq!.URL.Path).toBe('/static/app.js')

    let rewrittenQuery = ''
    const [semicolonReq] = NewRequest(
      MethodGet,
      'http://example.invalid/search?a=1;b=2',
      null,
    )

    AllowQuerySemicolons({
      ServeHTTP(_w, r) {
        rewrittenQuery = $.pointerValue<Request>(r).URL.RawQuery
      },
    }).ServeHTTP(null, semicolonReq)

    expect(rewrittenQuery).toBe('a=1&b=2')
    expect(semicolonReq!.URL.RawQuery).toBe('a=1;b=2')

    const fixedProxy = { href: 'http://proxy.invalid' }
    expect(ProxyURL(fixedProxy)(null)).toEqual([fixedProxy, null])
    expect(ProxyFromEnvironment(null)).toEqual([null, null])

    const redirectWriter = new testResponseWriter()
    const [redirectReq] = NewRequest(
      MethodGet,
      'http://example.invalid/dir/page',
      null,
    )

    await RedirectHandler('next?x=1', StatusFound).ServeHTTP(
      redirectWriter,
      redirectReq,
    )

    expect(redirectWriter.Code).toBe(StatusFound)
    expect(Header_Get(redirectWriter.Header(), 'Location')).toBe(
      '/dir/next?x=1',
    )
    expect(redirectWriter.Body.String()).toContain('Found')

    const directRedirectWriter = new testResponseWriter()
    await Redirect(directRedirectWriter, redirectReq, '/abs', StatusFound)

    expect(Header_Get(directRedirectWriter.Header(), 'Location')).toBe('/abs')

    const timeoutWriter = new testResponseWriter()
    TimeoutHandler(null, 1, 'timed out').ServeHTTP(timeoutWriter, redirectReq)

    expect(timeoutWriter.Code).toBe(StatusServiceUnavailable)
    expect(timeoutWriter.Body.String()).toBe('timed out\n')

    const makeFSFile = () => {
      const data = $.stringToBytes('fs-body')
      const reader = bytes.NewReader(data)
      return {
        Close: () => null,
        Read: (p: $.Slice<number>) => reader.Read(p),
        Stat: () =>
          [
            {
              Name: () => 'asset.txt',
              Size: () => data.length,
              Mode: () => 0,
              ModTime: () => new time.Time(),
              IsDir: () => false,
              Sys: () => null,
            },
            null,
          ] as const,
      }
    }
    const fsys = {
      Open: (name: string) =>
        name === 'asset.txt' ?
          [makeFSFile(), null]
        : [null, new Error('missing')],
    }
    const serveFileWriter = new testResponseWriter()

    await ServeFileFS(serveFileWriter, redirectReq, fsys, 'asset.txt')

    expect(serveFileWriter.Code).toBe(StatusOK)
    expect(serveFileWriter.Body.String()).toBe('fs-body')

    const [fileReq] = NewRequest(
      MethodGet,
      'file:///asset.txt',
      io.NopCloser(bytes.NewReader($.stringToBytes('request'))),
    )
    const [fileResp, fileErr] =
      await NewFileTransportFS(fsys).RoundTrip(fileReq)

    expect(fileErr).toBeNull()
    expect(fileResp?.StatusCode).toBe(StatusOK)
    expect(fileResp?.Body).not.toBeNull()
  })

  it('formats Set-Cookie headers for browser bootstrap routes', async () => {
    const header = new Header()
    const writer: ResponseWriter = {
      Header: () => header,
      Write: (p) => [p?.length ?? 0, null],
      WriteHeader: () => undefined,
    }

    await SetCookie(
      writer,
      new Cookie({
        Name: 'spacewave_local_capability',
        Value: 'token',
        Path: '/',
        MaxAge: 300,
        HttpOnly: true,
        Secure: true,
        SameSite: SameSiteStrictMode,
      }),
    )

    expect(Array.from(header.get('Set-Cookie') ?? [])).toEqual([
      'spacewave_local_capability=token; Path=/; Max-Age=300; HttpOnly; Secure; SameSite=Strict',
    ])
  })

  it('parses HTTP dates', () => {
    const [parsed, err] = ParseTime('Sun, 06 Nov 1994 08:49:37 GMT')

    expect(err).toBeNull()
    expect(parsed.Unix()).toBe(784111777n)
    expect(DetectContentType($.stringToBytes('<HTML>ok'))).toBe(
      'text/html; charset=utf-8',
    )
    expect(
      DetectContentType(
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ),
    ).toBe('image/png')
    expect(DetectContentType(new Uint8Array([0xff, 0xd8, 0xff, 0x00]))).toBe(
      'image/jpeg',
    )
    expect(DetectContentType($.stringToBytes('%PDF-1.7'))).toBe(
      'application/pdf',
    )
    expect(DetectContentType($.stringToBytes('RIFFxxxxWEBPVP'))).toBe(
      'image/webp',
    )
    expect(DetectContentType($.stringToBytes('FORMxxxxAIFF'))).toBe(
      'audio/aiff',
    )
    expect(DetectContentType($.stringToBytes('ID3payload'))).toBe('audio/mpeg')
    expect(DetectContentType($.stringToBytes('wOFFpayload'))).toBe('font/woff')
    expect(
      DetectContentType(
        new Uint8Array([
          0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f,
          0x6d, 0x00, 0x00, 0x00, 0x00, 0x6d, 0x70, 0x34, 0x31, 0x00, 0x00,
          0x00, 0x00,
        ]),
      ),
    ).toBe('video/mp4')
    expect(DetectContentType(new Uint8Array([0x00, 0x01, 0x02]))).toBe(
      'application/octet-stream',
    )
    expect(DetectContentType(new Uint8Array())).toBe(
      'text/plain; charset=utf-8',
    )
  })

  it('exports file server interface shapes', async () => {
    const file: File = {
      Close: () => null,
      Read: (p) => [p?.length ?? 0, null],
      Seek: (offset) => [offset, null],
      Readdir: () => [null, null],
      Stat: () => [null, null],
    }
    const fsys: FileSystem = {
      Open: (name) =>
        name === 'ok' ? [file, null] : [null, new Error('missing')],
    }

    const [okFile] = await fsys.Open('ok')
    const [, missingErr] = await fsys.Open('missing')

    expect(okFile).toBe(file)
    expect(missingErr?.message).toBe('missing')
  })

  it('serves files and omits HEAD response bodies', async () => {
    const opened: string[] = []
    const makeFile = () => {
      const reader = bytes.NewReader($.stringToBytes('hello'))
      return {
        Close: () => null,
        Read: (p: Uint8Array) => reader.Read(p),
        Seek: (offset: number, whence: number) => reader.Seek(offset, whence),
        Readdir: () => [null, null] as [null, null],
        Stat: () =>
          [
            {
              IsDir: () => false,
              ModTime: () => null as never,
              Mode: () => 0,
              Name: () => 'file.txt',
              Size: () => 5,
              Sys: () => null,
            },
            null,
          ] as const,
      }
    }
    const root = FS({
      Open: (name) => {
        opened.push(name)
        return name === 'file.txt' ?
            [makeFile(), null]
          : [null, new Error('missing')]
      },
    })
    const writes: string[] = []
    const header = new Header()
    const writer: ResponseWriter = {
      Header: () => header,
      Write: (p) => {
        writes.push(Buffer.from(p ?? []).toString('utf8'))
        return [p?.length ?? 0, null]
      },
      WriteHeader: (code) => writes.push(`status:${code}`),
    }
    const handler = FileServer(root)
    const [getReq] = NewRequest(
      MethodGet,
      'http://example.invalid/../file.txt',
      null,
    )

    await handler.ServeHTTP(writer, getReq)

    expect(opened).toEqual(['file.txt'])
    expect(writes).toEqual(['status:200', 'hello'])
    expect(Header_Get(header, 'Content-Length')).toBe('5')
    expect(Header_Get(header, 'Content-Type')).toBe('text/plain; charset=utf-8')

    writes.length = 0
    opened.length = 0
    const [headReq] = NewRequest(
      MethodHead,
      'http://example.invalid/file.txt',
      null,
    )

    await handler.ServeHTTP(writer, headReq)

    expect(opened).toEqual(['file.txt'])
    expect(writes).toEqual(['status:200'])
  })

  it('serves files whose request paths contain escaped spaces', async () => {
    const opened: string[] = []
    const root = FS({
      Open: (name) => {
        opened.push(name)
        const reader = bytes.NewReader($.stringToBytes('video'))
        return name === 'what is this.mp4' ?
            [
              {
                Close: () => null,
                Read: (p: Uint8Array) => reader.Read(p),
                Seek: (offset: number, whence: number) =>
                  reader.Seek(offset, whence),
                Readdir: () => [null, null] as [null, null],
                Stat: () =>
                  [
                    {
                      IsDir: () => false,
                      ModTime: () => null as never,
                      Mode: () => 0,
                      Name: () => name,
                      Size: () => 5,
                      Sys: () => null,
                    },
                    null,
                  ] as const,
              },
              null,
            ]
          : [null, new Error('missing')]
      },
    })
    const writes: string[] = []
    const writer: ResponseWriter = {
      Header: () => new Header(),
      Write: (p) => {
        writes.push(Buffer.from(p ?? []).toString('utf8'))
        return [p?.length ?? 0, null]
      },
      WriteHeader: (code) => writes.push(`status:${code}`),
    }
    const [req] = NewRequest(
      MethodGet,
      'http://example.invalid/what%20is%20this.mp4',
      null,
    )

    await FileServer(root).ServeHTTP(writer, req)

    expect(opened).toEqual(['what is this.mp4'])
    expect(writes).toEqual(['status:200', 'video'])
  })

  it('serves byte ranges from files like native net/http', async () => {
    const data = $.stringToBytes('0123456789')
    let offset = 0
    const root = {
      Open: () =>
        [
          {
            Close: () => null,
            Read: (p: $.Slice<number>) => {
              if (offset >= data.length) {
                return [0, io.EOF] as [number, $.GoError]
              }
              const n = Math.min(p?.length ?? 0, data.length - offset)
              p?.set(data.subarray(offset, offset + n), 0)
              offset += n
              return [n, null] as [number, $.GoError]
            },
            Seek: (seekOffset: bigint, whence: number) => {
              switch (whence) {
                case io.SeekStart:
                  offset = Number(seekOffset)
                  break
                case io.SeekCurrent:
                  offset += Number(seekOffset)
                  break
                case io.SeekEnd:
                  offset = data.length + Number(seekOffset)
                  break
              }
              return [BigInt(offset), null] as [bigint, $.GoError]
            },
            Readdir: () => [null, null] as [null, $.GoError],
            Stat: () =>
              [
                {
                  IsDir: () => false,
                  ModTime: () => null as never,
                  Mode: () => 0,
                  Name: () => 'media.mp4',
                  Size: () => BigInt(data.length),
                  Sys: () => null,
                },
                null,
              ] as const,
          },
          null,
        ] as [File, $.GoError],
    }
    const header = new Header()
    const writes: string[] = []
    const writer: ResponseWriter = {
      Header: () => header,
      Write: (p) => {
        writes.push(Buffer.from(p ?? []).toString('utf8'))
        return [p?.length ?? 0, null]
      },
      WriteHeader: (code) => writes.push(`status:${code}`),
    }
    const [req] = NewRequest(
      MethodGet,
      'http://example.invalid/media.mp4',
      null,
    )
    Header_Set(req!.Header, 'Range', 'bytes=2-5')

    await FileServer(root).ServeHTTP(writer, req)

    expect(writes).toEqual([`status:${StatusPartialContent}`, '2345'])
    expect(Header_Get(header, 'Accept-Ranges')).toBe('bytes')
    expect(Header_Get(header, 'Content-Length')).toBe('4')
    expect(Header_Get(header, 'Content-Range')).toBe('bytes 2-5/10')
    expect(Header_Get(header, 'Content-Type')).toBe('video/mp4')
  })

  it('serves open-ended and suffix byte ranges from FileServer', async () => {
    const serveRange = async (
      range: string,
    ): Promise<{
      body: string
      code: number
      contentRange: string
      length: string
    }> => {
      const reader = bytes.NewReader($.stringToBytes('0123456789'))
      const root = {
        Open: () =>
          [
            {
              Close: () => null,
              Read: (p: $.Slice<number>) => reader.Read(p),
              Seek: (offset: number, whence: number) =>
                reader.Seek(offset, whence),
              Readdir: () => [null, null] as [null, $.GoError],
              Stat: () =>
                [
                  {
                    IsDir: () => false,
                    ModTime: () => null as never,
                    Mode: () => 0,
                    Name: () => 'range.txt',
                    Size: () => 10,
                    Sys: () => null,
                  },
                  null,
                ] as const,
            },
            null,
          ] as [File, $.GoError],
      }
      let code = 0
      const header = new Header()
      const body: string[] = []
      const writer: ResponseWriter = {
        Header: () => header,
        Write: (p) => {
          body.push(Buffer.from(p ?? []).toString('utf8'))
          return [p?.length ?? 0, null]
        },
        WriteHeader: (statusCode) => {
          code = statusCode
        },
      }
      const [req] = NewRequest(
        MethodGet,
        'http://example.invalid/range.txt',
        null,
      )
      Header_Set(req!.Header, 'Range', range)

      await FileServer(root).ServeHTTP(writer, req)

      return {
        body: body.join(''),
        code,
        contentRange: Header_Get(header, 'Content-Range'),
        length: Header_Get(header, 'Content-Length'),
      }
    }

    await expect(serveRange('bytes=6-')).resolves.toEqual({
      body: '6789',
      code: StatusPartialContent,
      contentRange: 'bytes 6-9/10',
      length: '4',
    })
    await expect(serveRange('bytes=-4')).resolves.toEqual({
      body: '6789',
      code: StatusPartialContent,
      contentRange: 'bytes 6-9/10',
      length: '4',
    })
  })

  it('rejects unsatisfiable file ranges like native net/http', async () => {
    const root = {
      Open: () =>
        [
          {
            Close: () => null,
            Read: () => [0, io.EOF] as [number, $.GoError],
            Seek: () => [0, null] as [number, $.GoError],
            Readdir: () => [null, null] as [null, $.GoError],
            Stat: () =>
              [
                {
                  IsDir: () => false,
                  ModTime: () => null as never,
                  Mode: () => 0,
                  Name: () => 'range.txt',
                  Size: () => 10,
                  Sys: () => null,
                },
                null,
              ] as const,
          },
          null,
        ] as [File, $.GoError],
    }
    const header = new Header()
    const writes: string[] = []
    const writer: ResponseWriter = {
      Header: () => header,
      Write: (p) => {
        writes.push(Buffer.from(p ?? []).toString('utf8'))
        return [p?.length ?? 0, null]
      },
      WriteHeader: (code) => writes.push(`status:${code}`),
    }
    const [req] = NewRequest(
      MethodGet,
      'http://example.invalid/range.txt',
      null,
    )
    Header_Set(req!.Header, 'Range', 'bytes=99-100')

    await FileServer(root).ServeHTTP(writer, req)

    expect(writes[0]).toBe(`status:${StatusRequestedRangeNotSatisfiable}`)
    expect(Header_Get(header, 'Content-Range')).toBe('bytes */10')
    expect(Header_Get(header, 'Content-Length')).toBe('0')
  })

  it('serves files from async file systems and file methods', async () => {
    const closeCalls: string[] = []
    const root = {
      async Open(name: string) {
        if (name !== 'async.txt') {
          return [null, new Error('missing')]
        }
        let offset = 0
        const file = {
          async Close() {
            closeCalls.push(name)
            return null
          },
          async Read(p) {
            const data = $.stringToBytes('async-body')
            if (offset >= data.length) {
              return [0, io.EOF]
            }
            const n = Math.min(p.length, data.length - offset)
            p.set(data.subarray(offset, offset + n), 0)
            offset += n
            return [n, null]
          },
          async Seek(seekOffset) {
            offset = Number(seekOffset)
            return [offset, null]
          },
          async Readdir() {
            return [null, null]
          },
          async Stat() {
            return [
              {
                IsDir: () => false,
                ModTime: () => null as never,
                Mode: () => 0,
                Name: () => name,
                Size: () => 10,
                Sys: () => null,
              },
              null,
            ]
          },
        }
        return [file, null]
      },
    }
    const writes: string[] = []
    const header = new Header()
    const writer: ResponseWriter = {
      Header: () => header,
      Write: (p) => {
        writes.push(Buffer.from(p ?? []).toString('utf8'))
        return [p?.length ?? 0, null]
      },
      WriteHeader: (code) => writes.push(`status:${code}`),
    }
    const [req] = NewRequest(
      MethodGet,
      'http://example.invalid/async.txt',
      null,
    )

    await FileServer(root).ServeHTTP(writer, req)

    expect(writes).toEqual(['status:200', 'async-body'])
    expect(Header_Get(header, 'Content-Length')).toBe('10')
    expect(closeCalls).toEqual(['async.txt'])
  })

  it('serves files through FS adapters backed by async io/fs Open', async () => {
    const opened: string[] = []
    const root = {
      async Open(name: string) {
        opened.push(name)
        const data = $.stringToBytes('fs-adapter')
        let offset = 0
        return [
          {
            Close: async () => null,
            Read: async (p: $.Slice<number>) => {
              if (offset >= data.length) {
                return [0, io.EOF] as [number, $.GoError]
              }
              const n = Math.min(p?.length ?? 0, data.length - offset)
              p?.set(data.subarray(offset, offset + n), 0)
              offset += n
              return [n, null] as [number, $.GoError]
            },
            Stat: async () => [
              {
                Name: () => name,
                Size: () => data.length,
                Mode: () => 0,
                ModTime: () => new time.Time(),
                IsDir: () => false,
                Sys: () => null,
              },
              null,
            ],
          },
          null,
        ]
      },
    }
    const writes: string[] = []
    const header = new Header()
    const writer: ResponseWriter = {
      Header: () => header,
      Write: (p) => {
        writes.push(Buffer.from(p ?? []).toString('utf8'))
        return [p?.length ?? 0, null]
      },
      WriteHeader: (code) => writes.push(`status:${code}`),
    }
    const [req] = NewRequest(
      MethodGet,
      'http://example.invalid/dir/fs-adapter.txt',
      null,
    )

    await FileServerFS(root).ServeHTTP(writer, req)

    expect(opened).toEqual(['dir/fs-adapter.txt'])
    expect(writes).toEqual(['status:200', 'fs-adapter'])
    expect(Header_Get(header, 'Content-Length')).toBe('10')
  })

  it('serves files through async response writer adapters', async () => {
    const root = {
      async Open(name: string) {
        const data = $.stringToBytes('async-adapter')
        return [
          {
            Read: (p: $.Slice<number>) => {
              p?.set(data.subarray(0, p.length))
              return [data.length, io.EOF] as [number, $.GoError]
            },
            Close: async () => null,
            Stat: async () => [
              {
                Name: () => name,
                Size: () => data.length,
                Mode: () => 0,
                ModTime: () => new time.Time(),
                IsDir: () => false,
                Sys: () => null,
              },
              null,
            ],
          },
          null,
        ] as [File, $.GoError]
      },
    }
    const writes: string[] = []
    const header = new Header()
    const writer: ResponseWriter = {
      Header: async () => header,
      Write: async (p) => {
        writes.push(Buffer.from(p ?? []).toString('utf8'))
        return [p?.length ?? 0, null]
      },
      WriteHeader: async (code) => {
        writes.push(`status:${code}`)
      },
    }
    const [req] = NewRequest(
      MethodGet,
      'http://example.invalid/async-adapter.txt',
      null,
    )

    await FileServer(root).ServeHTTP(writer, req)

    expect(writes).toEqual(['status:200', 'async-adapter'])
    expect(Header_Get(header, 'Content-Length')).toBe('13')
  })

  it('writes file server headers before reading response bodies', async () => {
    let headerWritten = false
    let readSawHeader = false
    let offset = 0
    const data = $.stringToBytes('streamed-body')
    const root = {
      async Open(name: string) {
        return [
          {
            Close: async () => null,
            Read: async (p: $.Slice<number>) => {
              readSawHeader = headerWritten
              if (offset >= data.length) {
                return [0, io.EOF] as [number, $.GoError]
              }
              const n = Math.min(p?.length ?? 0, data.length - offset)
              p?.set(data.subarray(offset, offset + n), 0)
              offset += n
              return [n, null] as [number, $.GoError]
            },
            Seek: async () => [0, null] as [number, $.GoError],
            Readdir: async () => [null, null] as [null, $.GoError],
            Stat: async () => [
              {
                Name: () => name,
                Size: () => data.length,
                Mode: () => 0,
                ModTime: () => null as never,
                IsDir: () => false,
                Sys: () => null,
              },
              null,
            ],
          },
          null,
        ] as [File, $.GoError]
      },
    }
    const writes: string[] = []
    const header = new Header()
    const writer: ResponseWriter = {
      Header: () => header,
      Write: (p) => {
        writes.push(Buffer.from(p ?? []).toString('utf8'))
        return [p?.length ?? 0, null]
      },
      WriteHeader: (code) => {
        headerWritten = true
        writes.push(`status:${code}`)
      },
    }
    const [req] = NewRequest(
      MethodGet,
      'http://example.invalid/streamed.mjs',
      null,
    )

    await FileServer(root).ServeHTTP(writer, req)

    expect(readSawHeader).toBe(true)
    expect(writes).toEqual(['status:200', 'streamed-body'])
    expect(Header_Get(header, 'Content-Type')).toBe(
      'text/javascript; charset=utf-8',
    )
  })

  it('awaits ServeContent writes before returning', async () => {
    const writes: string[] = []
    const writer: ResponseWriter = {
      Header: () => new Header(),
      Write: (p) => {
        writes.push(Buffer.from(p ?? []).toString('utf8'))
        return [p?.length ?? 0, null]
      },
      WriteHeader: (code) => writes.push(`status:${code}`),
    }
    const [req] = NewRequest(
      MethodGet,
      'http://example.invalid/content.txt',
      null,
    )

    await ServeContent(
      writer,
      req,
      'content.txt',
      null as never,
      bytes.NewReader($.stringToBytes('served')),
    )

    expect(writes).toEqual(['status:200', 'served'])

    writes.length = 0
    const [headReq] = NewRequest(
      MethodHead,
      'http://example.invalid/content.txt',
      null,
    )
    await ServeContent(
      writer,
      headReq,
      'content.txt',
      null as never,
      bytes.NewReader($.stringToBytes('hidden')),
    )

    expect(writes).toEqual(['status:200'])
  })

  it('serves byte ranges from ServeContent like native net/http', async () => {
    const writes: string[] = []
    const header = new Header()
    const writer: ResponseWriter = {
      Header: () => header,
      Write: (p) => {
        writes.push(Buffer.from(p ?? []).toString('utf8'))
        return [p?.length ?? 0, null]
      },
      WriteHeader: (code) => writes.push(`status:${code}`),
    }
    const [req] = NewRequest(
      MethodGet,
      'http://example.invalid/content.txt',
      null,
    )
    Header_Set(req!.Header, 'Range', 'bytes=1-3')

    await ServeContent(
      writer,
      req,
      'content.txt',
      null as never,
      bytes.NewReader($.stringToBytes('served')),
    )

    expect(writes).toEqual([`status:${StatusPartialContent}`, 'erv'])
    expect(Header_Get(header, 'Accept-Ranges')).toBe('bytes')
    expect(Header_Get(header, 'Content-Length')).toBe('3')
    expect(Header_Get(header, 'Content-Range')).toBe('bytes 1-3/6')
  })

  it('closes request bodies after file transport requests', async () => {
    const root = FS({
      Open: () => [null, new Error('missing')],
    })
    let closed = false
    const [req] = NewRequest(MethodGet, 'file:///missing.txt', {
      Read: () => [0, io.EOF],
      Close: () => {
        closed = true
        return null
      },
    })

    const [resp, err] = await NewFileTransport(root).RoundTrip(req)

    expect(err).toBeNull()
    expect(resp?.StatusCode).toBe(StatusNotFound)
    expect(closed).toBe(true)
  })

  it('exports ServeFile for browser builds without local filesystem access', () => {
    const writes: string[] = []
    const writer: ResponseWriter = {
      Header: () => new Header(),
      Write: (p) => {
        writes.push(Buffer.from(p ?? []).toString('utf8'))
        return [p?.length ?? 0, null]
      },
      WriteHeader: (code) => writes.push(`status:${code}`),
    }
    const [req] = NewRequest(
      MethodGet,
      'http://example.invalid/eval/missing.js',
      null,
    )

    ServeFile(writer, req, '/host-only/missing.js')

    expect(writes[0]).toBe('status:404')
  })
})

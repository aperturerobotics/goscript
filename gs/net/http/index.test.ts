import { afterEach, describe, expect, it } from 'vitest'

import { varRef } from '../../builtin/varRef.js'
import * as $ from '../../builtin/index.js'
import * as bytes from '../../bytes/index.js'
import * as context from '../../context/index.js'
import {
  Client,
  Cookie,
  DefaultTransport,
  ErrServerClosed,
  File,
  FileServer,
  FileSystem,
  FS,
  Get,
  Header,
  Header_Add,
  Header_Del,
  Header_Get,
  Header_Set,
  HandlerFunc_ServeHTTP,
  MethodGet,
  MethodHead,
  MethodPost,
  MethodDelete,
  NewRequest,
  NotFound,
  ParseTime,
  RegisterInProcessServer,
  SameSiteStrictMode,
  SetCookie,
  StatusBadGateway,
  Response,
  ResponseWriter,
  Server,
  StatusCreated,
  StatusForbidden,
  StatusMethodNotAllowed,
  StatusNotFound,
  StatusOK,
  StatusServiceUnavailable,
  StatusTeapot,
  StatusText,
  StatusTooManyRequests,
  StatusUnauthorized,
  StatusUnsupportedMediaType,
  UnregisterInProcessServer,
} from './index.js'

const originalFetch = globalThis.fetch

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
    expect(StatusText(StatusUnsupportedMediaType)).toBe('Unsupported Media Type')
    expect(StatusText(StatusTeapot)).toBe("I'm a teapot")
    expect(StatusText(StatusTooManyRequests)).toBe('Too Many Requests')
    expect(StatusText(StatusBadGateway)).toBe('Bad Gateway')
    expect(StatusText(StatusServiceUnavailable)).toBe('Service Unavailable')
    expect(StatusText(599)).toBe('')
    expect(MethodGet).toBe('GET')
    expect(MethodHead).toBe('HEAD')
    expect(MethodPost).toBe('POST')
    expect(MethodDelete).toBe('DELETE')
    expect(StatusCreated).toBe(201)
    expect(ErrServerClosed.Error()).toBe('http: Server closed')
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
    const [req, reqErr] = NewRequest(MethodPost, 'https://example.invalid', null)
    expect(reqErr).toBeNull()
    expect((req!.URL as any).Path).toBe('/')
    expect(req!.RequestURI).toBe('/')

    const [resp, err] = await new Client().Do(varRef(req!))
    expect(resp).toBeNull()
    expect(err?.Error()).toContain('network down')
  })

  it('wraps request body readers and keeps response metadata', () => {
    const reader = {
      Read: (p: Uint8Array) => [p.length, null] as [number, null],
    }

    const [req, reqErr] = NewRequest(MethodPost, 'https://example.invalid/upload', reader)

    expect(reqErr).toBeNull()
    expect(req!.Body).not.toBeNull()
    expect(req!.Body!.Close()).toBeNull()

    const resp = new Response({ StatusCode: StatusCreated, ContentLength: -1, Request: varRef(req!) })
    expect(resp.ContentLength).toBe(-1)
    expect((resp.Request as any).value).toBe(req)
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
        expect(Buffer.from((init?.body as Uint8Array) ?? []).toString('utf8')).toBe('payload')
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
    const [req] = NewRequest(MethodPost, 'https://example.invalid/upload', requestBody)
    Header_Set(req!.Header, 'Range', 'bytes=0-9')
    Header_Set(req!.Header, 'Authorization', 'Bearer test')

    const [resp, err] = await DefaultTransport.RoundTrip(req)

    expect(err).toBeNull()
    expect(resp?.StatusCode).toBe(StatusCreated)
    expect(resp?.ContentLength).toBe(8)
    expect(Header_Get(resp!.Header, 'x-reply')).toBe('yes')
    expect(requestBodyClosed).toBe(true)
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
    const [unsupportedReq] = NewRequest(MethodPost, 'https://example.invalid/upload', {
      Read: () => [0, null],
      Close: () => {
        unsupportedClosed = true
        return null
      },
    })

    const [unsupportedResp, unsupportedErr] = await DefaultTransport.RoundTrip(unsupportedReq)

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
    const [canceledReq] = NewRequest(MethodPost, 'https://example.invalid/upload', {
      Read: () => [0, null],
      Close: () => {
        canceledClosed = true
        return null
      },
    })

    const [canceledResp, canceledErr] = await DefaultTransport.RoundTrip(canceledReq!.WithContext(ctx))

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
        handlerSawBody = r?.Body != null
        w?.WriteHeader(StatusOK)
      },
    })
    try {
      const [req] = NewRequest(MethodPost, url, {
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

  it('delegates client calls through RoundTripper implementations', async () => {
    const [req] = NewRequest(MethodPost, 'https://example.invalid/path', null)
    Header_Set(req!.Header, 'User-Agent', 'goscript-test')
    req!.RemoteAddr = '127.0.0.1:1234'
    req!.ContentLength = 42

    const client = new Client({
      Transport: {
        RoundTrip: (got) => {
          const request = (got as any).value ?? got
          expect(request.UserAgent()).toBe('goscript-test')
          expect(request.RemoteAddr).toBe('127.0.0.1:1234')
          expect(request.RequestURI).toBe('/path')
          expect(request.ContentLength).toBe(42)
          return [new Response({ StatusCode: StatusOK }), null]
        },
      },
    })

    const [resp, err] = await client.Do(varRef(req!))
    expect(err).toBeNull()
    expect(resp?.StatusCode).toBe(StatusOK)
  })

  it('canonicalizes header keys for case-insensitive lookup', () => {
    const header = new Header()

    Header_Set(header, 'Content-Type', 'application/json')

    expect(header.has('Content-Type')).toBe(true)
    expect(header.has('content-type')).toBe(false)
    expect(Header_Get(header, 'content-type')).toBe('application/json')

    Header_Add(header, 'x-pack-id', 'pack-1')
    Header_Add(header, 'X-Pack-Id', 'pack-2')
    expect(Array.from(header.get('X-Pack-Id') ?? [])).toEqual(['pack-1', 'pack-2'])

    Header_Del(header, 'x-pack-id')
    expect(Header_Get(header, 'X-Pack-ID')).toBe('')
  })

  it('accepts server context and shutdown surfaces', () => {
    const srv = new Server({
      Addr: ':0',
      BaseContext: () => ({} as any),
      ReadHeaderTimeout: 10,
    })

    expect(srv.Addr).toBe(':0')
    expect(srv.BaseContext?.(null)).toEqual({})
    expect(srv.ReadHeaderTimeout).toBe(10)
    expect(srv.Shutdown({} as any)).toBeNull()
    expect(srv.ListenAndServeTLS('cert.pem', 'key.pem')?.Error()).toBe('net/http: Server.ListenAndServeTLS is not implemented in GoScript')
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

  it('formats Set-Cookie headers for browser bootstrap routes', () => {
    const header = new Header()
    const writer: ResponseWriter = {
      Header: () => header,
      Write: (p) => [p?.length ?? 0, null],
      WriteHeader: () => undefined,
    }

    SetCookie(writer, new Cookie({
      Name: 'spacewave_local_capability',
      Value: 'token',
      Path: '/',
      MaxAge: 300,
      HttpOnly: true,
      Secure: true,
      SameSite: SameSiteStrictMode,
    }))

    expect(Array.from(header.get('Set-Cookie') ?? [])).toEqual([
      'spacewave_local_capability=token; Path=/; Max-Age=300; HttpOnly; Secure; SameSite=Strict',
    ])
  })

  it('parses HTTP dates', () => {
    const [parsed, err] = ParseTime('Sun, 06 Nov 1994 08:49:37 GMT')

    expect(err).toBeNull()
    expect(parsed.Unix()).toBe(784111777)
  })

  it('exports file server interface shapes', () => {
    const file: File = {
      Close: () => null,
      Read: (p) => [p?.length ?? 0, null],
      Seek: (offset) => [offset, null],
      Readdir: () => [null, null],
      Stat: () => [null, null],
    }
    const fsys: FileSystem = {
      Open: (name) => (name === 'ok' ? [file, null] : [null, new Error('missing')]),
    }

    expect(fsys.Open('ok')[0]).toBe(file)
    expect(fsys.Open('missing')[1]?.message).toBe('missing')
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
        Stat: () => [
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
        return name === 'file.txt' ? [makeFile(), null] : [null, new Error('missing')]
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
    const [getReq] = NewRequest(MethodGet, 'http://example.invalid/../file.txt', null)

    await handler.ServeHTTP(writer, getReq)

    expect(opened).toEqual(['file.txt'])
    expect(writes).toEqual(['status:200', 'hello'])
    expect(Header_Get(header, 'Content-Length')).toBe('5')

    writes.length = 0
    opened.length = 0
    const [headReq] = NewRequest(MethodHead, 'http://example.invalid/file.txt', null)

    await handler.ServeHTTP(writer, headReq)

    expect(opened).toEqual(['file.txt'])
    expect(writes).toEqual(['status:200'])
  })
})

import { describe, expect, it } from 'vitest'

import { varRef } from '../../builtin/varRef.js'
import {
  Client,
  DefaultTransport,
  File,
  FileSystem,
  Header,
  Header_Add,
  Header_Del,
  Header_Get,
  Header_Set,
  HandlerFunc_ServeHTTP,
  Get,
  MethodPost,
  MethodDelete,
  NewRequest,
  NotFound,
  ParseTime,
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
} from './index.js'

describe('net/http override', () => {
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
    expect(StatusText(StatusServiceUnavailable)).toBe('Service Unavailable')
    expect(StatusText(599)).toBe('')
    expect(MethodPost).toBe('POST')
    expect(MethodDelete).toBe('DELETE')
    expect(StatusCreated).toBe(201)
  })

  it('returns an explicit unsupported error for Get', () => {
    const [resp, err] = Get('https://example.invalid')

    expect(resp).toBeNull()
    expect(err?.Error()).toBe('net/http: Get is not implemented in GoScript')
  })

  it('accepts VarRef requests for client calls', async () => {
    const [req, reqErr] = NewRequest(MethodPost, 'https://example.invalid', null)
    expect(reqErr).toBeNull()
    expect((req!.URL as any).Path).toBe('/')
    expect(req!.RequestURI).toBe('/')

    const [resp, err] = await new Client().Do(varRef(req!))
    expect(resp).toBeNull()
    expect(err?.Error()).toBe('net/http: Client.Do is not implemented in GoScript')
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

  it('exports the default transport surface', async () => {
    const [req] = NewRequest(MethodPost, 'https://example.invalid', null)

    const [resp, err] = await DefaultTransport.RoundTrip(req)

    expect(resp).toBeNull()
    expect(err?.Error()).toBe('net/http: Client.Do is not implemented in GoScript')
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
})

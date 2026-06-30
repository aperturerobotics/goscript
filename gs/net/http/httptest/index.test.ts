import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'
import * as context from '@goscript/context/index.js'
import * as io from '@goscript/io/index.js'

import {
  Handler,
  Header_Get,
  Header_Set,
  MethodGet,
  MethodPost,
  NoBody,
  NewRequest,
  StatusPartialContent,
} from '../index.js'
import {
  DefaultRemoteAddr,
  NewRequest as NewTestRequest,
  NewRecorder,
  NewRequestWithContext,
  NewServer,
  NewTLSServer,
  NewUnstartedServer,
  Server_Start,
} from './index.js'

describe('net/http/httptest override', () => {
  it('exports server helpers for typechecked server tests', () => {
    const handler: Handler = {
      ServeHTTP: () => undefined,
    }

    const srv = NewServer(handler)
    const tlsSrv = NewTLSServer(handler)
    expect(srv.URL).toMatch(/^http:\/\/goscript-httptest-\d+\.invalid$/)
    expect(tlsSrv.URL).toMatch(/^https:\/\/goscript-httptest-\d+\.invalid$/)
    expect(srv.Client()).toBeTruthy()
    expect(srv.Config().Handler).toBe(handler)
    expect(tlsSrv.Client()).toBeTruthy()
    expect(Server_Start(NewUnstartedServer(handler))?.Error()).toBe(
      'net/http/httptest: Server.Start is not implemented in GoScript',
    )
    srv.Close()
    tlsSrv.Close()
  })

  it('exports request defaults and recorder compatibility helpers', () => {
    const req = NewRequestWithContext(
      context.Background(),
      '',
      'https://example.invalid/path',
      null,
    )
    expect(DefaultRemoteAddr).toBe('1.2.3.4')
    expect(req.Method).toBe(MethodGet)
    expect(req.Host).toBe('example.invalid')
    expect(req.RemoteAddr).toBe('192.0.2.1:1234')
    expect(req.TLS).not.toBeNull()

    const pathReq = NewRequestWithContext(
      context.Background(),
      MethodGet,
      '/local?x=1',
      null,
    )
    expect(pathReq.Host).toBe('example.com')
    expect(pathReq.RequestURI).toBe('/local?x=1')
    expect(pathReq.URL.Host).toBe('')
    expect(pathReq.URL.Scheme).toBe('')

    const bodyReq = NewTestRequest(
      MethodPost,
      '/body',
      bytes.NewReader($.stringToBytes('abc')),
    )
    expect(bodyReq.ContentLength).toBe(3n)
    const noBodyReq = NewTestRequest(MethodPost, '/empty', NoBody)
    expect(noBodyReq.ContentLength).toBe(0n)
    const unknownReq = NewTestRequest(MethodPost, '/unknown', {
      Read: () => [0, io.EOF],
    })
    expect(unknownReq.ContentLength).toBe(-1n)

    const recorder = NewRecorder()
    recorder.WriteString('ok')
    recorder.Flush()
    expect(recorder.Code).toBe(200)
    expect(recorder.Flushed).toBe(true)
    expect(Buffer.from(recorder.Body.Bytes()).toString('utf8')).toBe('ok')
  })

  it('routes Client.Do through the in-memory server handler', async () => {
    const srv = NewServer({
      ServeHTTP(w, r) {
        const req = $.pointerValue(r)!
        expect(req.RequestURI).toBe('/pack.kvf')
        expect(req.URL.Host).toBe('')
        expect(req.Host).toMatch(/^goscript-httptest-\d+\.invalid$/)
        Header_Set(w!.Header(), 'Content-Range', 'bytes 0-3/4')
        const range = Header_Get(req.Header, 'Range')
        if (range !== 'bytes=0-3') {
          w!.WriteHeader(400)
          w!.Write($.stringToBytes(range))
          return
        }
        w!.WriteHeader(StatusPartialContent)
        w!.Write($.stringToBytes('data'))
      },
    })
    const [req, reqErr] = NewRequest(MethodGet, srv.URL + '/pack.kvf', null)
    expect(reqErr).toBeNull()
    Header_Set(req!.Header, 'Range', 'bytes=0-3')

    const [resp, err] = await srv.Client().Do(req)

    expect(err).toBeNull()
    expect(resp?.StatusCode).toBe(StatusPartialContent)
    expect(Header_Get(resp!.Header, 'Content-Range')).toBe('bytes 0-3/4')
    const buf = new Uint8Array(4)
    const [n, readErr] = resp!.Body!.Read(buf)
    expect(readErr).toBeNull()
    expect(n).toBe(4)
    expect(Buffer.from(buf).toString('utf8')).toBe('data')
    expect(resp!.Body!.Close()).toBeNull()
    srv.Close()
  })

  it('awaits async handlers through Server.Client transport', async () => {
    const srv = NewServer({
      async ServeHTTP(w) {
        await Promise.resolve()
        w!.WriteHeader(StatusPartialContent)
        w!.Write($.stringToBytes('async'))
      },
    })
    const [req, reqErr] = NewRequest(MethodGet, srv.URL + '/async', null)
    expect(reqErr).toBeNull()

    const [resp, err] = await srv.Client().Do(req)

    expect(err).toBeNull()
    expect(resp?.StatusCode).toBe(StatusPartialContent)
    const buf = new Uint8Array(5)
    const [n, readErr] = resp!.Body!.Read(buf)
    expect(readErr).toBeNull()
    expect(n).toBe(5)
    expect(Buffer.from(buf).toString('utf8')).toBe('async')
    srv.Close()
  })

  it('closes request bodies through Server.Client transport', async () => {
    const srv = NewServer({
      ServeHTTP(w) {
        w!.WriteHeader(StatusPartialContent)
      },
    })
    let closed = false
    const body = {
      Read: (_p: Uint8Array): [number, $.GoError] => [0, io.EOF],
      Close: (): $.GoError => {
        closed = true
        return null
      },
    }
    const [req, reqErr] = NewRequest(MethodPost, srv.URL + '/close', body)
    expect(reqErr).toBeNull()

    const [resp, err] = await srv.Client().Do(req)

    expect(err).toBeNull()
    expect(resp?.StatusCode).toBe(StatusPartialContent)
    expect(closed).toBe(true)
    srv.Close()
  })

  it('suppresses bodies for Server.Client HEAD requests', async () => {
    const srv = NewServer({
      ServeHTTP(w) {
        w!.WriteHeader(StatusPartialContent)
        w!.Write($.stringToBytes('hidden'))
      },
    })

    const [resp, err] = await srv.Client().Head(srv.URL + '/head')

    expect(err).toBeNull()
    expect(resp?.StatusCode).toBe(StatusPartialContent)
    const [n, readErr] = resp!.Body!.Read(new Uint8Array(8))
    expect(n).toBe(0)
    expect(readErr).toBe(io.EOF)
    srv.Close()
  })
})

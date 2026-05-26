import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  Handler,
  Header_Get,
  Header_Set,
  MethodGet,
  NewRequest,
  StatusPartialContent,
} from '../index.js'
import { NewServer, NewUnstartedServer, Server_Start } from './index.js'

describe('net/http/httptest override', () => {
  it('exports server helpers for typechecked server tests', () => {
    const handler: Handler = {
      ServeHTTP: () => undefined,
    }

    const srv = NewServer(handler)
    expect(srv.URL).toMatch(/^http:\/\/goscript-httptest-\d+\.invalid$/)
    expect(srv.Client()).toBeTruthy()
    expect(srv.Config().Handler).toBe(handler)
    expect(Server_Start(NewUnstartedServer(handler))?.Error()).toBe(
      'net/http/httptest: Server.Start is not implemented in GoScript',
    )
    srv.Close()
  })

  it('routes Client.Do through the in-memory server handler', async () => {
    const srv = NewServer({
      ServeHTTP(w, r) {
        Header_Set(w!.Header(), 'Content-Range', 'bytes 0-3/4')
        const range = Header_Get($.pointerValue(r)!.Header, 'Range')
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
})

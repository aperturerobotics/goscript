import { describe, expect, it } from 'vitest'

import { varRef } from '../../builtin/varRef.js'
import {
  Client,
  Header,
  HandlerFunc_ServeHTTP,
  Get,
  MethodPost,
  NewRequest,
  NotFound,
  Response,
  ResponseWriter,
  StatusNotFound,
  StatusOK,
  StatusText,
} from './index.js'

describe('net/http override', () => {
  it('exports response status helpers', () => {
    const resp = new Response({ StatusCode: StatusOK })

    expect(resp.StatusCode).toBe(200)
    expect(StatusText(resp.StatusCode)).toBe('OK')
    expect(StatusText(StatusNotFound)).toBe('Not Found')
    expect(StatusText(599)).toBe('')
    expect(MethodPost).toBe('POST')
  })

  it('returns an explicit unsupported error for Get', () => {
    const [resp, err] = Get('https://example.invalid')

    expect(resp).toBeNull()
    expect(err?.Error()).toBe('net/http: Get is not implemented in GoScript')
  })

  it('accepts VarRef requests for client calls', () => {
    const [req, reqErr] = NewRequest(MethodPost, 'https://example.invalid', null)
    expect(reqErr).toBeNull()
    expect((req!.URL as any).Path).toBe('/')

    const [resp, err] = new Client().Do(varRef(req!))
    expect(resp).toBeNull()
    expect(err?.Error()).toBe('net/http: Client.Do is not implemented in GoScript')
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
})

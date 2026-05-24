import { describe, expect, it } from 'vitest'

import { Handler } from '../index.js'
import { NewServer, NewUnstartedServer, Server_Start } from './index.js'

describe('net/http/httptest override', () => {
  it('exports server helpers for typechecked server tests', () => {
    const handler: Handler = {
      ServeHTTP: () => undefined,
    }

    const srv = NewServer(handler)
    expect(srv.URL).toBe('http://127.0.0.1')
    expect(srv.Client()).toBeTruthy()
    expect(srv.Config().Handler).toBe(handler)
    expect(Server_Start(NewUnstartedServer(handler))?.Error()).toBe(
      'net/http/httptest: Server.Start is not implemented in GoScript',
    )
  })
})

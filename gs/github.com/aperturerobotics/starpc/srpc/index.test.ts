import { describe, expect, it } from 'vitest'

import * as context from '@goscript/context/index.js'
import * as $ from '@goscript/builtin/index.js'

import { MuxedConn, NewClientSet, NewPrefixClient, NewWebSocketConn } from './index.js'

describe('starpc/srpc override', () => {
  it('wraps websocket connections with the same outbound direction as Go', () => {
    const conn = { Close: () => null }

    const [serverConn, serverErr] = NewWebSocketConn(
      context.Background(),
      conn,
      true,
      null,
    )
    const [clientConn, clientErr] = NewWebSocketConn(
      context.Background(),
      conn,
      false,
      null,
    )

    expect(serverErr).toBeNull()
    expect(clientErr).toBeNull()
    expect(serverConn).toBeInstanceOf(MuxedConn)
    expect(clientConn).toBeInstanceOf(MuxedConn)
    expect(serverConn?.outbound).toBe(false)
    expect(clientConn?.outbound).toBe(true)
  })

  it('registers prefixed clients as srpc.Client values', () => {
    const client = NewPrefixClient(NewClientSet(null), ['plugin-host/'])

    expect($.typeAssert(client, 'srpc.Client').ok).toBe(true)
  })
})

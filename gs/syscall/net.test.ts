import { describe, expect, test } from 'vitest'

import {
  Bind,
  CloseOnExec,
  Connect,
  ENOSYS,
  ENOTSUP,
  GetsockoptInt,
  IPPROTO_IPV6,
  IPPROTO_TCP,
  IPV6_V6ONLY,
  Listen,
  SetNonblock,
  SetsockoptInt,
  SOCK_SEQPACKET,
  SOMAXCONN,
  Socket,
} from './index.js'

describe('syscall network stubs', () => {
  test('exports network constants used by generated net', () => {
    expect(SOCK_SEQPACKET).toBe(5)
    expect(IPPROTO_IPV6).toBe(0x29)
    expect(IPPROTO_TCP).toBe(6)
    expect(IPV6_V6ONLY).toBe(0x1a)
    expect(SOMAXCONN).toBe(0x80)
    expect(ENOTSUP.Error()).toBe('operation not supported')
  })

  test('reports unsupported socket operations as syscall errors', () => {
    expect(Socket(0, 0, 0)).toEqual([-1, ENOSYS])
    expect(Connect(-1, null)).toBe(ENOSYS)
    expect(Listen(-1, 0)).toBe(ENOSYS)
    expect(Bind(-1, null)).toBe(ENOSYS)
    expect(GetsockoptInt(-1, 0, 0)).toEqual([0, ENOSYS])
    expect(SetsockoptInt(-1, 0, 0, 0)).toBe(ENOSYS)
  })

  test('exports JavaScript no-op descriptor flag helpers', () => {
    expect(CloseOnExec(1)).toBeUndefined()
    expect(SetNonblock(1, true)).toBeNull()
    expect(SetNonblock(1, false)).toBeNull()
  })
})

import { describe, expect, test } from 'vitest'

import {
  Bind,
  Close,
  CloseOnExec,
  Connect,
  Dup,
  ENOSYS,
  ENOTSUP,
  GetsockoptInt,
  Iovec,
  IPPROTO_IPV6,
  IPPROTO_TCP,
  IPV6_V6ONLY,
  Listen,
  Pread,
  Pwrite,
  Read,
  ReadDirent,
  Recvfrom,
  Recvmsg,
  Seek,
  SendmsgN,
  Sendto,
  SetReadDeadline,
  SetNonblock,
  SetsockoptInt,
  SetWriteDeadline,
  Shutdown,
  SOCK_SEQPACKET,
  SOMAXCONN,
  Socket,
  StopIO,
  Write,
  readv,
  writev,
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
    expect(StopIO(-1)).toBe(ENOSYS)
    expect(Recvfrom(-1, null, 0)).toEqual([0, null, ENOSYS])
    expect(Sendto(-1, null, 0, null)).toBe(ENOSYS)
    expect(Recvmsg(-1, null, null, 0)).toEqual([0, 0, 0, null, ENOSYS])
    expect(SendmsgN(-1, null, null, null, 0)).toEqual([0, ENOSYS])
    expect(GetsockoptInt(-1, 0, 0)).toEqual([0, ENOSYS])
    expect(SetsockoptInt(-1, 0, 0, 0)).toBeNull()
    expect(SetReadDeadline(-1, 0)).toBe(ENOSYS)
    expect(SetWriteDeadline(-1, 0)).toBe(ENOSYS)
    expect(Shutdown(-1, 0)).toBe(ENOSYS)
  })

  test('exports JavaScript no-op descriptor flag helpers', () => {
    expect(Close(1)).toBeNull()
    expect(CloseOnExec(1)).toBeUndefined()
    expect(SetNonblock(1, true)).toBeNull()
    expect(SetNonblock(1, false)).toBeNull()
  })

  test('exports unsupported descriptor operations', () => {
    expect(Read(-1, null)).toEqual([0, ENOSYS])
    expect(ReadDirent(-1, null)).toEqual([0, ENOSYS])
    expect(Pread(-1, null, 0)).toEqual([0, ENOSYS])
    expect(Pwrite(-1, null, 0)).toEqual([0, ENOSYS])
    expect(Seek(-1, 0, 0)).toEqual([0, ENOSYS])
    expect(Write(-1, null)).toEqual([0, ENOSYS])
    expect(Dup(-1)).toEqual([0, ENOSYS])
    expect(readv(-1, [new Iovec()])).toEqual([0, ENOSYS])
    expect(writev(-1, [new Iovec()])).toEqual([0, ENOSYS])
  })
})

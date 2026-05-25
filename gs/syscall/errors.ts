import * as $ from '@goscript/builtin/index.js'
import { Errno, ErrnoObject } from './types.js'

export function Errno_Error(errno: Errno): string {
  if (typeof errno !== 'number') {
    return errno.Error()
  }
  return `errno ${errno}`
}

export function Errno_Is(errno: Errno, target: $.GoError): boolean {
  if (target === null) {
    return false
  }
  if (typeof errno !== 'number' && errno.Is(target)) {
    return true
  }
  const errnoValue = errnoNumber(errno)
  const targetValue = errnoNumber(target)
  return targetValue !== null && errnoValue === targetValue
}

export function Errno_Temporary(errno: Errno): boolean {
  const value = errnoNumber(errno)
  return (
    value === errnoNumber(EINTR) ||
    value === errnoNumber(EMFILE) ||
    value === errnoNumber(ENFILE) ||
    Errno_Timeout(errno)
  )
}

export function Errno_Timeout(errno: Errno): boolean {
  const value = errnoNumber(errno)
  return value === errnoNumber(EAGAIN) || value === errnoNumber(ETIMEDOUT)
}

function errnoNumber(errno: unknown): number | null {
  if (typeof errno === 'number') {
    return errno
  }
  if (errno !== null && typeof errno === 'object') {
    const value = (errno as { Errno?: () => unknown }).Errno?.()
    if (typeof value === 'number') {
      return value
    }
  }
  return null
}

export const EPERM: ErrnoObject = {
  Error: () => 'operation not permitted',
  Is: (target: $.GoError) => target === EPERM,
  Errno: () => 1,
}

export const ENOENT: ErrnoObject = {
  Error: () => 'no such file or directory',
  Is: (target: $.GoError) => target === ENOENT,
  Errno: () => 2,
}

export const ESRCH: ErrnoObject = {
  Error: () => 'no such process',
  Is: (target: $.GoError) => target === ESRCH,
  Errno: () => 3,
}

export const EINTR: ErrnoObject = {
  Error: () => 'interrupted system call',
  Is: (target: $.GoError) => target === EINTR,
  Errno: () => 4,
}

export const EIO: ErrnoObject = {
  Error: () => 'I/O error',
  Is: (target: $.GoError) => target === EIO,
  Errno: () => 5,
}

export const ENXIO: ErrnoObject = {
  Error: () => 'no such device or address',
  Is: (target: $.GoError) => target === ENXIO,
  Errno: () => 6,
}

export const E2BIG: ErrnoObject = {
  Error: () => 'argument list too long',
  Is: (target: $.GoError) => target === E2BIG,
  Errno: () => 7,
}

export const ENOEXEC: ErrnoObject = {
  Error: () => 'exec format error',
  Is: (target: $.GoError) => target === ENOEXEC,
  Errno: () => 8,
}

export const EBADF: ErrnoObject = {
  Error: () => 'bad file number',
  Is: (target: $.GoError) => target === EBADF,
  Errno: () => 9,
}

export const ECHILD: ErrnoObject = {
  Error: () => 'no child processes',
  Is: (target: $.GoError) => target === ECHILD,
  Errno: () => 10,
}

export const EAGAIN: ErrnoObject = {
  Error: () => 'try again',
  Is: (target: $.GoError) => target === EAGAIN,
  Errno: () => 11,
}

export const ENOMEM: ErrnoObject = {
  Error: () => 'out of memory',
  Is: (target: $.GoError) => target === ENOMEM,
  Errno: () => 12,
}

export const EACCES: ErrnoObject = {
  Error: () => 'permission denied',
  Is: (target: $.GoError) => target === EACCES,
  Errno: () => 13,
}

export const EFAULT: ErrnoObject = {
  Error: () => 'bad address',
  Is: (target: $.GoError) => target === EFAULT,
  Errno: () => 14,
}

export const EBUSY: ErrnoObject = {
  Error: () => 'device or resource busy',
  Is: (target: $.GoError) => target === EBUSY,
  Errno: () => 16,
}

export const EEXIST: ErrnoObject = {
  Error: () => 'file exists',
  Is: (target: $.GoError) => target === EEXIST,
  Errno: () => 17,
}

export const EXDEV: ErrnoObject = {
  Error: () => 'cross-device link',
  Is: (target: $.GoError) => target === EXDEV,
  Errno: () => 18,
}

export const ENODEV: ErrnoObject = {
  Error: () => 'no such device',
  Is: (target: $.GoError) => target === ENODEV,
  Errno: () => 19,
}

export const ENOTDIR: ErrnoObject = {
  Error: () => 'not a directory',
  Is: (target: $.GoError) => target === ENOTDIR,
  Errno: () => 20,
}

export const EISDIR: ErrnoObject = {
  Error: () => 'is a directory',
  Is: (target: $.GoError) => target === EISDIR,
  Errno: () => 21,
}

export const EINVAL: ErrnoObject = {
  Error: () => 'invalid argument',
  Is: (target: $.GoError) => target === EINVAL,
  Errno: () => 22,
}

export const ENFILE: ErrnoObject = {
  Error: () => 'file table overflow',
  Is: (target: $.GoError) => target === ENFILE,
  Errno: () => 23,
}

export const EMFILE: ErrnoObject = {
  Error: () => 'too many open files',
  Is: (target: $.GoError) => target === EMFILE,
  Errno: () => 24,
}

export const ENOTTY: ErrnoObject = {
  Error: () => 'not a typewriter',
  Is: (target: $.GoError) => target === ENOTTY,
  Errno: () => 25,
}

export const EFBIG: ErrnoObject = {
  Error: () => 'file too large',
  Is: (target: $.GoError) => target === EFBIG,
  Errno: () => 27,
}

export const ENOSPC: ErrnoObject = {
  Error: () => 'no space left on device',
  Is: (target: $.GoError) => target === ENOSPC,
  Errno: () => 28,
}

export const ESPIPE: ErrnoObject = {
  Error: () => 'illegal seek',
  Is: (target: $.GoError) => target === ESPIPE,
  Errno: () => 29,
}

export const EROFS: ErrnoObject = {
  Error: () => 'read-only file system',
  Is: (target: $.GoError) => target === EROFS,
  Errno: () => 30,
}

export const EMLINK: ErrnoObject = {
  Error: () => 'too many links',
  Is: (target: $.GoError) => target === EMLINK,
  Errno: () => 31,
}

export const EPIPE: ErrnoObject = {
  Error: () => 'broken pipe',
  Is: (target: $.GoError) => target === EPIPE,
  Errno: () => 32,
}

export const EDOM: ErrnoObject = {
  Error: () => 'math arg out of domain of func',
  Is: (target: $.GoError) => target === EDOM,
  Errno: () => 33,
}

export const ERANGE: ErrnoObject = {
  Error: () => 'result too large',
  Is: (target: $.GoError) => target === ERANGE,
  Errno: () => 34,
}

export const EDEADLK: ErrnoObject = {
  Error: () => 'deadlock condition',
  Is: (target: $.GoError) => target === EDEADLK,
  Errno: () => 35,
}

export const ENAMETOOLONG: ErrnoObject = {
  Error: () => 'file name too long',
  Is: (target: $.GoError) => target === ENAMETOOLONG,
  Errno: () => 36,
}

export const ENOLCK: ErrnoObject = {
  Error: () => 'no record locks available',
  Is: (target: $.GoError) => target === ENOLCK,
  Errno: () => 37,
}

export const ENOSYS: ErrnoObject = {
  Error: () => 'function not implemented',
  Is: (target: $.GoError) => target === ENOSYS,
  Errno: () => 38,
}

export const ENOTSUP: ErrnoObject = {
  Error: () => 'operation not supported',
  Is: (target: $.GoError) => target === ENOTSUP,
  Errno: () => 95,
}

export const ENOTEMPTY: ErrnoObject = {
  Error: () => 'directory not empty',
  Is: (target: $.GoError) => target === ENOTEMPTY,
  Errno: () => 39,
}

export const ELOOP: ErrnoObject = {
  Error: () => 'too many symbolic links',
  Is: (target: $.GoError) => target === ELOOP,
  Errno: () => 40,
}

export const ENOMSG: ErrnoObject = {
  Error: () => 'no message of desired type',
  Is: (target: $.GoError) => target === ENOMSG,
  Errno: () => 42,
}

export const EIDRM: ErrnoObject = {
  Error: () => 'identifier removed',
  Is: (target: $.GoError) => target === EIDRM,
  Errno: () => 43,
}

export const ECHRNG: ErrnoObject = {
  Error: () => 'channel number out of range',
  Is: (target: $.GoError) => target === ECHRNG,
  Errno: () => 44,
}

export const EL2NSYNC: ErrnoObject = {
  Error: () => 'level 2 not synchronized',
  Is: (target: $.GoError) => target === EL2NSYNC,
  Errno: () => 45,
}

export const EL3HLT: ErrnoObject = {
  Error: () => 'level 3 halted',
  Is: (target: $.GoError) => target === EL3HLT,
  Errno: () => 46,
}

export const EL3RST: ErrnoObject = {
  Error: () => 'level 3 reset',
  Is: (target: $.GoError) => target === EL3RST,
  Errno: () => 47,
}

export const ELNRNG: ErrnoObject = {
  Error: () => 'link number out of range',
  Is: (target: $.GoError) => target === ELNRNG,
  Errno: () => 48,
}

export const EUNATCH: ErrnoObject = {
  Error: () => 'protocol driver not attached',
  Is: (target: $.GoError) => target === EUNATCH,
  Errno: () => 49,
}

export const ENOCSI: ErrnoObject = {
  Error: () => 'no CSI structure available',
  Is: (target: $.GoError) => target === ENOCSI,
  Errno: () => 50,
}

export const EL2HLT: ErrnoObject = {
  Error: () => 'level 2 halted',
  Is: (target: $.GoError) => target === EL2HLT,
  Errno: () => 51,
}

export const EBADE: ErrnoObject = {
  Error: () => 'invalid exchange',
  Is: (target: $.GoError) => target === EBADE,
  Errno: () => 52,
}

export const EBADR: ErrnoObject = {
  Error: () => 'invalid request descriptor',
  Is: (target: $.GoError) => target === EBADR,
  Errno: () => 53,
}

export const EXFULL: ErrnoObject = {
  Error: () => 'exchange full',
  Is: (target: $.GoError) => target === EXFULL,
  Errno: () => 54,
}

export const ENOANO: ErrnoObject = {
  Error: () => 'no anode',
  Is: (target: $.GoError) => target === ENOANO,
  Errno: () => 55,
}

export const EBADRQC: ErrnoObject = {
  Error: () => 'invalid request code',
  Is: (target: $.GoError) => target === EBADRQC,
  Errno: () => 56,
}

export const EBADSLT: ErrnoObject = {
  Error: () => 'invalid slot',
  Is: (target: $.GoError) => target === EBADSLT,
  Errno: () => 57,
}

export const EDEADLOCK: ErrnoObject = EDEADLK // File locking deadlock error

export const EBFONT: ErrnoObject = {
  Error: () => 'bad font file fmt',
  Is: (target: $.GoError) => target === EBFONT,
  Errno: () => 59,
}

export const ENOSTR: ErrnoObject = {
  Error: () => 'device not a stream',
  Is: (target: $.GoError) => target === ENOSTR,
  Errno: () => 60,
}

export const ENODATA: ErrnoObject = {
  Error: () => 'no data (for no delay io)',
  Is: (target: $.GoError) => target === ENODATA,
  Errno: () => 61,
}

export const ETIME: ErrnoObject = {
  Error: () => 'timer expired',
  Is: (target: $.GoError) => target === ETIME,
  Errno: () => 62,
}

export const ENOSR: ErrnoObject = {
  Error: () => 'out of streams resources',
  Is: (target: $.GoError) => target === ENOSR,
  Errno: () => 63,
}

export const ENONET: ErrnoObject = {
  Error: () => 'machine is not on the network',
  Is: (target: $.GoError) => target === ENONET,
  Errno: () => 64,
}

export const ENOPKG: ErrnoObject = {
  Error: () => 'package not installed',
  Is: (target: $.GoError) => target === ENOPKG,
  Errno: () => 65,
}

export const EREMOTE: ErrnoObject = {
  Error: () => 'the object is remote',
  Is: (target: $.GoError) => target === EREMOTE,
  Errno: () => 66,
}

export const ENOLINK: ErrnoObject = {
  Error: () => 'the link has been severed',
  Is: (target: $.GoError) => target === ENOLINK,
  Errno: () => 67,
}

export const EADV: ErrnoObject = {
  Error: () => 'advertise error',
  Is: (target: $.GoError) => target === EADV,
  Errno: () => 68,
}

export const ESRMNT: ErrnoObject = {
  Error: () => 'srmount error',
  Is: (target: $.GoError) => target === ESRMNT,
  Errno: () => 69,
}

export const ECOMM: ErrnoObject = {
  Error: () => 'communication error on send',
  Is: (target: $.GoError) => target === ECOMM,
  Errno: () => 70,
}

export const EPROTO: ErrnoObject = {
  Error: () => 'protocol error',
  Is: (target: $.GoError) => target === EPROTO,
  Errno: () => 71,
}

export const EMULTIHOP: ErrnoObject = {
  Error: () => 'multihop attempted',
  Is: (target: $.GoError) => target === EMULTIHOP,
  Errno: () => 72,
}

export const EDOTDOT: ErrnoObject = {
  Error: () => 'cross mount point (not really error)',
  Is: (target: $.GoError) => target === EDOTDOT,
  Errno: () => 73,
}

export const EBADMSG: ErrnoObject = {
  Error: () => 'trying to read unreadable message',
  Is: (target: $.GoError) => target === EBADMSG,
  Errno: () => 74,
}

export const EOVERFLOW: ErrnoObject = {
  Error: () => 'value too large for defined data type',
  Is: (target: $.GoError) => target === EOVERFLOW,
  Errno: () => 75,
}

export const ENOTUNIQ: ErrnoObject = {
  Error: () => 'given log. name not unique',
  Is: (target: $.GoError) => target === ENOTUNIQ,
  Errno: () => 76,
}

export const EBADFD: ErrnoObject = {
  Error: () => 'f.d. invalid for this operation',
  Is: (target: $.GoError) => target === EBADFD,
  Errno: () => 77,
}

export const EREMCHG: ErrnoObject = {
  Error: () => 'remote address changed',
  Is: (target: $.GoError) => target === EREMCHG,
  Errno: () => 78,
}

export const ELIBACC: ErrnoObject = {
  Error: () => "can't access a needed shared lib",
  Is: (target: $.GoError) => target === ELIBACC,
  Errno: () => 79,
}

export const ELIBBAD: ErrnoObject = {
  Error: () => 'accessing a corrupted shared lib',
  Is: (target: $.GoError) => target === ELIBBAD,
  Errno: () => 80,
}

export const ELIBSCN: ErrnoObject = {
  Error: () => '.lib section in a.out corrupted',
  Is: (target: $.GoError) => target === ELIBSCN,
  Errno: () => 81,
}

export const ELIBMAX: ErrnoObject = {
  Error: () => 'attempting to link in too many libs',
  Is: (target: $.GoError) => target === ELIBMAX,
  Errno: () => 82,
}

export const ELIBEXEC: ErrnoObject = {
  Error: () => 'attempting to exec a shared library',
  Is: (target: $.GoError) => target === ELIBEXEC,
  Errno: () => 83,
}

export const EILSEQ: ErrnoObject = {
  Error: () => 'illegal byte sequence',
  Is: (target: $.GoError) => target === EILSEQ,
  Errno: () => 84,
}

export const EUSERS: ErrnoObject = {
  Error: () => 'too many users',
  Is: (target: $.GoError) => target === EUSERS,
  Errno: () => 87,
}

export const ENOTSOCK: ErrnoObject = {
  Error: () => 'socket operation on non-socket',
  Is: (target: $.GoError) => target === ENOTSOCK,
  Errno: () => 88,
}

export const EDESTADDRREQ: ErrnoObject = {
  Error: () => 'destination address required',
  Is: (target: $.GoError) => target === EDESTADDRREQ,
  Errno: () => 89,
}

export const EMSGSIZE: ErrnoObject = {
  Error: () => 'message too long',
  Is: (target: $.GoError) => target === EMSGSIZE,
  Errno: () => 90,
}

export const EPROTOTYPE: ErrnoObject = {
  Error: () => 'protocol wrong type for socket',
  Is: (target: $.GoError) => target === EPROTOTYPE,
  Errno: () => 91,
}

export const ENOPROTOOPT: ErrnoObject = {
  Error: () => 'protocol not available',
  Is: (target: $.GoError) => target === ENOPROTOOPT,
  Errno: () => 92,
}

export const EPROTONOSUPPORT: ErrnoObject = {
  Error: () => 'unknown protocol',
  Is: (target: $.GoError) => target === EPROTONOSUPPORT,
  Errno: () => 93,
}

export const ESOCKTNOSUPPORT: ErrnoObject = {
  Error: () => 'socket type not supported',
  Is: (target: $.GoError) => target === ESOCKTNOSUPPORT,
  Errno: () => 94,
}

export const EOPNOTSUPP: ErrnoObject = {
  Error: () => 'operation not supported on transport endpoint',
  Is: (target: $.GoError) => target === EOPNOTSUPP,
  Errno: () => 95,
}

export const EPFNOSUPPORT: ErrnoObject = {
  Error: () => 'protocol family not supported',
  Is: (target: $.GoError) => target === EPFNOSUPPORT,
  Errno: () => 96,
}

export const EAFNOSUPPORT: ErrnoObject = {
  Error: () => 'address family not supported by protocol family',
  Is: (target: $.GoError) => target === EAFNOSUPPORT,
  Errno: () => 97,
}

export const EADDRINUSE: ErrnoObject = {
  Error: () => 'address already in use',
  Is: (target: $.GoError) => target === EADDRINUSE,
  Errno: () => 98,
}

export const EADDRNOTAVAIL: ErrnoObject = {
  Error: () => 'address not available',
  Is: (target: $.GoError) => target === EADDRNOTAVAIL,
  Errno: () => 99,
}

export const ENETDOWN: ErrnoObject = {
  Error: () => 'network interface is not configured',
  Is: (target: $.GoError) => target === ENETDOWN,
  Errno: () => 100,
}

export const ENETUNREACH: ErrnoObject = {
  Error: () => 'network is unreachable',
  Is: (target: $.GoError) => target === ENETUNREACH,
  Errno: () => 101,
}

export const ENETRESET: ErrnoObject = {
  Error: () => 'network dropped connection because of reset',
  Is: (target: $.GoError) => target === ENETRESET,
  Errno: () => 102,
}

export const ECONNABORTED: ErrnoObject = {
  Error: () => 'connection aborted',
  Is: (target: $.GoError) => target === ECONNABORTED,
  Errno: () => 103,
}

export const ECONNRESET: ErrnoObject = {
  Error: () => 'connection reset by peer',
  Is: (target: $.GoError) => target === ECONNRESET,
  Errno: () => 104,
}

export const ENOBUFS: ErrnoObject = {
  Error: () => 'no buffer space available',
  Is: (target: $.GoError) => target === ENOBUFS,
  Errno: () => 105,
}

export const EISCONN: ErrnoObject = {
  Error: () => 'socket is already connected',
  Is: (target: $.GoError) => target === EISCONN,
  Errno: () => 106,
}

export const ENOTCONN: ErrnoObject = {
  Error: () => 'socket is not connected',
  Is: (target: $.GoError) => target === ENOTCONN,
  Errno: () => 107,
}

export const ESHUTDOWN: ErrnoObject = {
  Error: () => "can't send after socket shutdown",
  Is: (target: $.GoError) => target === ESHUTDOWN,
  Errno: () => 108,
}

export const ETOOMANYREFS: ErrnoObject = {
  Error: () => 'too many references: cannot splice',
  Is: (target: $.GoError) => target === ETOOMANYREFS,
  Errno: () => 109,
}

export const ETIMEDOUT: ErrnoObject = {
  Error: () => 'connection timed out',
  Is: (target: $.GoError) => target === ETIMEDOUT,
  Errno: () => 110,
}

export const ECONNREFUSED: ErrnoObject = {
  Error: () => 'connection refused',
  Is: (target: $.GoError) => target === ECONNREFUSED,
  Errno: () => 111,
}

export const EHOSTDOWN: ErrnoObject = {
  Error: () => 'host is down',
  Is: (target: $.GoError) => target === EHOSTDOWN,
  Errno: () => 112,
}

export const EHOSTUNREACH: ErrnoObject = {
  Error: () => 'host is unreachable',
  Is: (target: $.GoError) => target === EHOSTUNREACH,
  Errno: () => 113,
}

export const EALREADY: ErrnoObject = {
  Error: () => 'socket already connected',
  Is: (target: $.GoError) => target === EALREADY,
  Errno: () => 114,
}

export const EDQUOT: ErrnoObject = {
  Error: () => 'quota exceeded',
  Is: (target: $.GoError) => target === EDQUOT,
  Errno: () => 122,
}

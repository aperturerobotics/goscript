import * as $ from '@goscript/builtin/index.js'
import { RWMutex } from '@goscript/sync/index.js'
import { ENOSYS } from './errors.js'
import type { Iovec, Sockaddr } from './types.js'

// Dirent structure with Reclen field
export class Dirent {
  public Name: $.Bytes = new Uint8Array(0)
  public Reclen: number = 0
  constructor(init?: any) {
    if (init?.Name) this.Name = init.Name
    if (init?.Reclen) this.Reclen = init.Reclen
  }
}

// Stat_t structure stub
export class Stat_t {
  public Dev: number = 0
  public Ino: number = 0
  public Mode: number = 0
  public Nlink: number = 0
  public Uid: number = 0
  public Gid: number = 0
  public Rdev: number = 0
  public Size: number = 0
  public Blksize: number = 0
  public Blocks: number = 0
  public Atime: number = 0
  public Mtime: number = 0
  public Ctime: number = 0
  public AtimeNsec: number = 0
  public MtimeNsec: number = 0
  public CtimeNsec: number = 0

  constructor(init?: any) {
    if (init) {
      Object.assign(this, init)
    }
  }

  public clone(): Stat_t {
    return new Stat_t(this)
  }
}

// Additional missing syscall functions
export function Open(
  _path: string,
  _flag: number,
  _perm: number,
): [number, $.GoError] {
  return [-1, ENOSYS]
}

export function Sysctl(_name: string): [string, $.GoError] {
  return ['', ENOSYS]
}

export function Unlink(_path: string): $.GoError {
  return ENOSYS
}

export const ForkLock = new RWMutex()

export function Close(_fd: number): $.GoError {
  return null
}

export function CloseOnExec(_fd: number): void {}

export function SetNonblock(_fd: number, _nonblocking: boolean): $.GoError {
  return null
}

export function Fchdir(_fd: number): $.GoError {
  return ENOSYS
}

export function Fchmod(_fd: number, _mode: number): $.GoError {
  return ENOSYS
}

export function Fchown(_fd: number, _uid: number, _gid: number): $.GoError {
  return ENOSYS
}

export function Fstat(
  _fd: number,
  _stat: Stat_t | $.VarRef<Stat_t> | null,
): $.GoError {
  return ENOSYS
}

export function Fsync(_fd: number): $.GoError {
  return ENOSYS
}

export function Ftruncate(_fd: number, _length: number): $.GoError {
  return ENOSYS
}

export function Read(_fd: number, _b: $.Bytes | null): [number, $.GoError] {
  return [0, ENOSYS]
}

export function ReadDirent(
  _fd: number,
  _buf: $.Bytes | null,
): [number, $.GoError] {
  return [0, ENOSYS]
}

export function Pread(
  _fd: number,
  _b: $.Bytes | null,
  _offset: number,
): [number, $.GoError] {
  return [0, ENOSYS]
}

export function Pwrite(
  _fd: number,
  _b: $.Bytes | null,
  _offset: number,
): [number, $.GoError] {
  return [0, ENOSYS]
}

export function Seek(
  _fd: number,
  _offset: number,
  _whence: number,
): [number, $.GoError] {
  return [0, ENOSYS]
}

export function Write(_fd: number, _b: $.Bytes | null): [number, $.GoError] {
  return [0, ENOSYS]
}

export function Dup(_fd: number): [number, $.GoError] {
  return [0, ENOSYS]
}

// Getpagesize returns the underlying system's memory page size.
export function Getpagesize(): number {
  // Return a standard page size for JavaScript environment
  // Most systems use 4096 bytes as the default page size
  return 4096
}

export function Socket(
  _domain: number,
  _typ: number,
  _proto: number,
): [number, $.GoError] {
  return [-1, ENOSYS]
}

export function Connect(_fd: number, _sa: Sockaddr | null): $.GoError {
  return ENOSYS
}

export function Listen(_fd: number, _backlog: number): $.GoError {
  return ENOSYS
}

export function Bind(_fd: number, _sa: Sockaddr | null): $.GoError {
  return ENOSYS
}

export function StopIO(_fd: number): $.GoError {
  return ENOSYS
}

export function Accept(_fd: number): [number, Sockaddr | null, $.GoError] {
  return [0, null, ENOSYS]
}

export function Recvfrom(
  _fd: number,
  _p: $.Bytes | null,
  _flags: number,
): [number, Sockaddr | null, $.GoError] {
  return [0, null, ENOSYS]
}

export function Sendto(
  _fd: number,
  _p: $.Bytes | null,
  _flags: number,
  _to: Sockaddr | null,
): $.GoError {
  return ENOSYS
}

export function Recvmsg(
  _fd: number,
  _p: $.Bytes | null,
  _oob: $.Bytes | null,
  _flags: number,
): [number, number, number, Sockaddr | null, $.GoError] {
  return [0, 0, 0, null, ENOSYS]
}

export function SendmsgN(
  _fd: number,
  _p: $.Bytes | null,
  _oob: $.Bytes | null,
  _to: Sockaddr | null,
  _flags: number,
): [number, $.GoError] {
  return [0, ENOSYS]
}

export function SetReadDeadline(_fd: number, _t: number): $.GoError {
  return ENOSYS
}

export function SetWriteDeadline(_fd: number, _t: number): $.GoError {
  return ENOSYS
}

export function Shutdown(_fd: number, _how: number): $.GoError {
  return ENOSYS
}

export function GetsockoptInt(
  _fd: number,
  _level: number,
  _opt: number,
): [number, $.GoError] {
  return [0, ENOSYS]
}

export function SetsockoptInt(
  _fd: number,
  _level: number,
  _opt: number,
  _value: number,
): $.GoError {
  return null
}

export function readv(
  _fd: number,
  _iovecs: $.Slice<Iovec> | null,
): [number, $.GoError] {
  return [0, ENOSYS]
}

export function writev(
  _fd: number,
  _iovecs: $.Slice<Iovec> | null,
): [number, $.GoError] {
  return [0, ENOSYS]
}

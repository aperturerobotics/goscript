import * as $ from '@goscript/builtin/index.js'

// Essential type aliases
export type uintptr = number

// Errno type for syscall errors
export interface Errno {
  Error(): string
  Is(target: $.GoError): boolean
  Errno(): number
}

// RawConn interface - stub implementation for JavaScript environment
export interface RawConn {
  Control(f: (fd: uintptr) => void): $.GoError
  Read(f: (fd: uintptr) => boolean): $.GoError
  Write(f: (fd: uintptr) => boolean): $.GoError
}

export interface Sockaddr {}

export class SockaddrInet4 implements Sockaddr {
  public Port: number = 0
  public Addr: number[] = [0, 0, 0, 0]

  constructor(init?: Partial<SockaddrInet4>) {
    if (init) {
      Object.assign(this, init)
    }
  }

  public clone(): SockaddrInet4 {
    return new SockaddrInet4({
      Port: this.Port,
      Addr: [...this.Addr],
    })
  }
}

export class SockaddrInet6 implements Sockaddr {
  public Port: number = 0
  public ZoneId: number = 0
  public Addr: number[] = Array.from({ length: 16 }, () => 0)

  constructor(init?: Partial<SockaddrInet6>) {
    if (init) {
      Object.assign(this, init)
    }
  }

  public clone(): SockaddrInet6 {
    return new SockaddrInet6({
      Port: this.Port,
      ZoneId: this.ZoneId,
      Addr: [...this.Addr],
    })
  }
}

export class SockaddrUnix implements Sockaddr {
  public Name: string = ''

  constructor(init?: Partial<SockaddrUnix>) {
    if (init) {
      Object.assign(this, init)
    }
  }

  public clone(): SockaddrUnix {
    return new SockaddrUnix({ Name: this.Name })
  }
}

export class Iovec {}

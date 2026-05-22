// Essential syscall constants
export const O_RDONLY: number = 0
export const O_WRONLY: number = 1
export const O_RDWR: number = 2
export const O_APPEND: number = 8
export const O_CREATE: number = 64
export const O_EXCL: number = 128
export const O_SYNC: number = 256
export const O_TRUNC: number = 512

export const Stdin: number = 0
export const Stdout: number = 1
export const Stderr: number = 2

export const SIGINT: number = 2
export const SIGTERM: number = 15

export const AF_UNIX: number = 1
export const AF_INET: number = 2
export const AF_INET6: number = 10

export const SOCK_STREAM: number = 1
export const SOCK_DGRAM: number = 2
export const SOCK_RAW: number = 3
export const SOCK_SEQPACKET: number = 5

export const IPPROTO_IPV6: number = 0x29
export const IPPROTO_TCP: number = 6
export const IPV6_V6ONLY: number = 0x1a
export const SOMAXCONN: number = 0x80
export const F_DUPFD_CLOEXEC: number = 1

// File mode constants
export const S_IFMT: number = 0o170000
export const S_IFREG: number = 0o100000
export const S_IFDIR: number = 0o040000
export const S_IFLNK: number = 0o120000
export const S_IFBLK: number = 0o060000
export const S_IFCHR: number = 0o020000
export const S_IFIFO: number = 0o010000
export const S_IFSOCK: number = 0o140000
export const S_ISUID: number = 0o004000
export const S_ISGID: number = 0o002000
export const S_ISVTX: number = 0o001000

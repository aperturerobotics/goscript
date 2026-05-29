// Generated file based on net_js.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syscall from "@goscript/syscall/index.js"
import "@goscript/syscall/index.js"

export function RecvfromInet4(fd: number, p: $.Slice<number>, flags: number, _from: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null): [number, $.GoError] {
	return [0, $.namedValueInterfaceValue<$.GoError>(syscall.ENOSYS, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
}

export function RecvfromInet6(fd: number, p: $.Slice<number>, flags: number, _from: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null): [number, $.GoError] {
	let n: number = 0
	let err: $.GoError = null as $.GoError
	return [0, $.namedValueInterfaceValue<$.GoError>(syscall.ENOSYS, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
}

export function SendtoInet4(fd: number, p: $.Slice<number>, flags: number, to: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null): $.GoError {
	let err: $.GoError = null as $.GoError
	return $.namedValueInterfaceValue<$.GoError>(syscall.ENOSYS, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
}

export function SendtoInet6(fd: number, p: $.Slice<number>, flags: number, to: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null): $.GoError {
	let err: $.GoError = null as $.GoError
	return $.namedValueInterfaceValue<$.GoError>(syscall.ENOSYS, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
}

export function SendmsgNInet4(fd: number, p: $.Slice<number>, oob: $.Slice<number>, to: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null, flags: number): [number, $.GoError] {
	let n: number = 0
	let err: $.GoError = null as $.GoError
	return [0, $.namedValueInterfaceValue<$.GoError>(syscall.ENOSYS, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
}

export function SendmsgNInet6(fd: number, p: $.Slice<number>, oob: $.Slice<number>, to: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null, flags: number): [number, $.GoError] {
	let n: number = 0
	let err: $.GoError = null as $.GoError
	return [0, $.namedValueInterfaceValue<$.GoError>(syscall.ENOSYS, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
}

export function RecvmsgInet4(fd: number, p: $.Slice<number>, oob: $.Slice<number>, flags: number, _from: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null): [number, number, number, $.GoError] {
	let n: number = 0
	let oobn: number = 0
	let recvflags: number = 0
	let err: $.GoError = null as $.GoError
	return [0, 0, 0, $.namedValueInterfaceValue<$.GoError>(syscall.ENOSYS, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
}

export function RecvmsgInet6(fd: number, p: $.Slice<number>, oob: $.Slice<number>, flags: number, _from: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null): [number, number, number, $.GoError] {
	let n: number = 0
	let oobn: number = 0
	let recvflags: number = 0
	let err: $.GoError = null as $.GoError
	return [0, 0, 0, $.namedValueInterfaceValue<$.GoError>(syscall.ENOSYS, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
}

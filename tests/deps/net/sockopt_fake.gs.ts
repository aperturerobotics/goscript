// Generated file based on sockopt_fake.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import type * as os from "@goscript/os/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_fd_fake from "./fd_fake.gs.ts"

import * as __goscript_fd_js from "./fd_js.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_net_fake from "./net_fake.gs.ts"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"
import "@goscript/syscall/index.js"
import "@goscript/internal/poll/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "./fd_fake.gs.ts"
import "./fd_js.gs.ts"
import "./net.gs.ts"
import "./net_fake.gs.ts"
import "./sockaddr_posix.gs.ts"

export function setDefaultSockopts(s: number, family: number, sotype: number, ipv6only: boolean): $.GoError {
	return null
}

export function setDefaultListenerSockopts(s: number): $.GoError {
	return null
}

export function setDefaultMulticastSockopts(s: number): $.GoError {
	return null
}

export async function setReadBuffer(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, bytes: number): globalThis.Promise<$.GoError> {
	if ($.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD != null) {
		return __goscript_net_fake.fakeNetFD.prototype.setReadBuffer.call($.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD, bytes)
	}
	return $.namedValueInterfaceValue<$.GoError>(syscall.ENOPROTOOPT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
}

export function setWriteBuffer(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, bytes: number): $.GoError {
	if ($.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD != null) {
		return __goscript_net_fake.fakeNetFD.prototype.setWriteBuffer.call($.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD, bytes)
	}
	return $.namedValueInterfaceValue<$.GoError>(syscall.ENOPROTOOPT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
}

export function setKeepAlive(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, keepalive: boolean): $.GoError {
	return $.namedValueInterfaceValue<$.GoError>(syscall.ENOPROTOOPT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
}

export async function setLinger(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, sec: number): globalThis.Promise<$.GoError> {
	if ($.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD != null) {
		return __goscript_net_fake.fakeNetFD.prototype.setLinger.call($.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD, sec)
	}
	return $.namedValueInterfaceValue<$.GoError>(syscall.ENOPROTOOPT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
}

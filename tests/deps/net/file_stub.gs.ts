// Generated file based on file_stub.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"

import * as syscall from "@goscript/syscall/index.js"

import type * as time from "@goscript/time/index.js"

import type * as __goscript_net from "./net.gs.ts"
import "@goscript/os/index.js"
import "@goscript/syscall/index.js"

export function fileConn(f: os.File | $.VarRef<os.File> | null): [__goscript_net.Conn | null, $.GoError] {
	return [null, $.namedValueInterfaceValue<$.GoError>(syscall.ENOPROTOOPT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
}

export function fileListener(f: os.File | $.VarRef<os.File> | null): [__goscript_net.Listener | null, $.GoError] {
	return [null, $.namedValueInterfaceValue<$.GoError>(syscall.ENOPROTOOPT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
}

export function filePacketConn(f: os.File | $.VarRef<os.File> | null): [__goscript_net.PacketConn | null, $.GoError] {
	return [null, $.namedValueInterfaceValue<$.GoError>(syscall.ENOPROTOOPT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
}

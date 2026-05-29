// Generated file based on file.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"

import type * as time from "@goscript/time/index.js"

import * as __goscript_file_stub from "./file_stub.gs.ts"

import * as __goscript_net from "./net.gs.ts"
import "@goscript/os/index.js"
import "./file_stub.gs.ts"
import "./net.gs.ts"

export type fileAddr = string

export function fileAddr_Network(recv: fileAddr): string {
	return "file+net"
}

export function fileAddr_String(f: fileAddr): string {
	return f
}

export function FileConn(f: os.File | $.VarRef<os.File> | null): [__goscript_net.Conn | null, $.GoError] {
	let c: __goscript_net.Conn | null = null as __goscript_net.Conn | null
	let err: $.GoError = null as $.GoError
	let __goscriptTuple0: any = __goscript_file_stub.fileConn(f)
	c = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	if (err != null) {
		err = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField0 = $.namedValueInterfaceValue<__goscript_net.Addr | null>(os.File.prototype.Name.call($.pointerValue<os.File>(f)), "net.fileAddr", {Network: (receiver: any, ...args: any[]) => (fileAddr_Network as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (fileAddr_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.fileAddr" }); return new __goscript_net.OpError({Op: "file", Net: "file+net", Source: null, Addr: __goscriptLiteralField0, Err: err}) })(), "*net.OpError")
	}
	return [c, err]
}

export function FileListener(f: os.File | $.VarRef<os.File> | null): [__goscript_net.Listener | null, $.GoError] {
	let ln: __goscript_net.Listener | null = null as __goscript_net.Listener | null
	let err: $.GoError = null as $.GoError
	let __goscriptTuple1: any = __goscript_file_stub.fileListener(f)
	ln = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	if (err != null) {
		err = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField1 = $.namedValueInterfaceValue<__goscript_net.Addr | null>(os.File.prototype.Name.call($.pointerValue<os.File>(f)), "net.fileAddr", {Network: (receiver: any, ...args: any[]) => (fileAddr_Network as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (fileAddr_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.fileAddr" }); return new __goscript_net.OpError({Op: "file", Net: "file+net", Source: null, Addr: __goscriptLiteralField1, Err: err}) })(), "*net.OpError")
	}
	return [ln, err]
}

export function FilePacketConn(f: os.File | $.VarRef<os.File> | null): [__goscript_net.PacketConn | null, $.GoError] {
	let c: __goscript_net.PacketConn | null = null as __goscript_net.PacketConn | null
	let err: $.GoError = null as $.GoError
	let __goscriptTuple2: any = __goscript_file_stub.filePacketConn(f)
	c = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	if (err != null) {
		err = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField2 = $.namedValueInterfaceValue<__goscript_net.Addr | null>(os.File.prototype.Name.call($.pointerValue<os.File>(f)), "net.fileAddr", {Network: (receiver: any, ...args: any[]) => (fileAddr_Network as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (fileAddr_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.fileAddr" }); return new __goscript_net.OpError({Op: "file", Net: "file+net", Source: null, Addr: __goscriptLiteralField2, Err: err}) })(), "*net.OpError")
	}
	return [c, err]
}

// Generated file based on muxed.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/time/index.js"

export type MuxedConn = {
	AcceptStream(): [MuxedStream | null, $.GoError] | globalThis.Promise<[MuxedStream | null, $.GoError]>
	Close(): $.GoError | globalThis.Promise<$.GoError>
	IsClosed(): boolean | globalThis.Promise<boolean>
	OpenStream(_p0: context.Context | null): [MuxedStream | null, $.GoError] | globalThis.Promise<[MuxedStream | null, $.GoError]>
}

$.registerInterfaceType(
	"srpc.MuxedConn",
	null,
	[{ name: "AcceptStream", args: [], returns: [{ name: "_r0", type: "srpc.MuxedStream" }, { name: "_r1", type: "error" }] }, { name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "IsClosed", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "OpenStream", args: [{ name: "_p0", type: "context.Context" }], returns: [{ name: "_r0", type: "srpc.MuxedStream" }, { name: "_r1", type: "error" }] }]
);

export type MuxedStream = {
	Close(): $.GoError | globalThis.Promise<$.GoError>
	CloseRead(): $.GoError | globalThis.Promise<$.GoError>
	CloseWrite(): $.GoError | globalThis.Promise<$.GoError>
	Read(p: $.Slice<number>): [number, $.GoError] | globalThis.Promise<[number, $.GoError]>
	Reset(): $.GoError | globalThis.Promise<$.GoError>
	SetDeadline(_p0: time.Time): $.GoError | globalThis.Promise<$.GoError>
	SetReadDeadline(_p0: time.Time): $.GoError | globalThis.Promise<$.GoError>
	SetWriteDeadline(_p0: time.Time): $.GoError | globalThis.Promise<$.GoError>
	Write(p: $.Slice<number>): [number, $.GoError] | globalThis.Promise<[number, $.GoError]>
}

$.registerInterfaceType(
	"srpc.MuxedStream",
	null,
	[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseRead", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseWrite", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "Reset", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "SetDeadline", args: [{ name: "_p0", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "_p0", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "_p0", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }]
);

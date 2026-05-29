// Generated file based on handler.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as context from "@goscript/context/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as __goscript_invoker from "./invoker.gs.ts"

import type * as __goscript_message from "./message.gs.ts"

import type * as __goscript_stream from "./stream.gs.ts"

export type Handler = {
	GetMethodIDs(): $.Slice<string>
	GetServiceID(): string
	InvokeMethod(serviceID: string, methodID: string, strm: __goscript_stream.Stream | null): [boolean, $.GoError] | globalThis.Promise<[boolean, $.GoError]>
}

$.registerInterfaceType(
	"srpc.Handler",
	null,
	[{ name: "GetMethodIDs", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }] }, { name: "GetServiceID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "InvokeMethod", args: [{ name: "serviceID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "methodID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "strm", type: "srpc.Stream" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "_r1", type: "error" }] }]
)

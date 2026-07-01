// Generated file based on invoker.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as context from "@goscript/context/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as __goscript_message from "./message.gs.ts"

import * as __goscript_stream from "./stream.gs.ts"
import "./stream.gs.ts"

export type Invoker = {
	InvokeMethod(serviceID: string, methodID: string, strm: __goscript_stream.Stream | null): [boolean, $.GoError] | globalThis.Promise<[boolean, $.GoError]>
}

$.registerInterfaceType(
	"srpc.Invoker",
	null,
	[{ name: "InvokeMethod", args: [{ name: "serviceID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "methodID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "strm", type: "srpc.Stream" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "_r1", type: "error" }] }]
);

export type QueryableInvoker = {
	HasService(serviceID: string): boolean | globalThis.Promise<boolean>
	HasServiceMethod(serviceID: string, methodID: string): boolean | globalThis.Promise<boolean>
}

$.registerInterfaceType(
	"srpc.QueryableInvoker",
	null,
	[{ name: "HasService", args: [{ name: "serviceID", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "HasServiceMethod", args: [{ name: "serviceID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "methodID", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]
);

export type InvokerSlice = $.Slice<Invoker | null>

export type InvokerFunc = ((serviceID: string, methodID: string, strm: __goscript_stream.Stream | null) => [boolean, $.GoError] | globalThis.Promise<[boolean, $.GoError]>) | null

export async function InvokerSlice_InvokeMethod(s: InvokerSlice, serviceID: string, methodID: string, strm: __goscript_stream.Stream | null): globalThis.Promise<[boolean, $.GoError]> {
	for (let __goscriptRangeTarget0 = s, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let invoker = __goscriptRangeTarget0![__rangeIndex]
		if (invoker == null) {
			continue
		}

		let [found, err] = await $.pointerValue<Exclude<Invoker, null>>(invoker).InvokeMethod(serviceID, methodID, strm)
		if (found || (err != null)) {
			return [true, err]
		}
	}
	return [false, null]
}

export async function InvokerFunc_InvokeMethod(f: InvokerFunc | null, serviceID: string, methodID: string, strm: __goscript_stream.Stream | null): globalThis.Promise<[boolean, $.GoError]> {
	if (f == null) {
		return [false, null]
	}
	return f!(serviceID, methodID, strm)
}

let __goscriptBlank0: Invoker | null = $.namedValueInterfaceValue<Invoker | null>($.namedFunction(null, "srpc.InvokerFunc", ({ kind: $.TypeKind.Function, name: "srpc.InvokerFunc", params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "srpc.Stream"], results: [{ kind: $.TypeKind.Basic, name: "bool" }, "error"] } as $.FunctionTypeInfo)), "srpc.InvokerFunc", {InvokeMethod: (receiver: any, ...args: any[]) => (InvokerFunc_InvokeMethod as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, ({ kind: $.TypeKind.Function, name: "srpc.InvokerFunc", params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "srpc.Stream"], results: [{ kind: $.TypeKind.Basic, name: "bool" }, "error"] } as $.FunctionTypeInfo))

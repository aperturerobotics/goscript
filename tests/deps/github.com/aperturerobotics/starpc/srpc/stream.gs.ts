// Generated file based on stream.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as __goscript_message from "./message.gs.ts"
import "@goscript/context/index.js"

export type Stream = {
	Close(): $.GoError | globalThis.Promise<$.GoError>
	CloseSend(): $.GoError | globalThis.Promise<$.GoError>
	Context(): context.Context | null
	MsgRecv(msg: __goscript_message.Message): $.GoError | globalThis.Promise<$.GoError>
	MsgSend(msg: __goscript_message.Message): $.GoError | globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"srpc.Stream",
	null,
	[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseSend", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "MsgRecv", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "MsgSend", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }]
)

export type StreamRecv = {
	Close(): $.GoError | globalThis.Promise<$.GoError>
	CloseSend(): $.GoError | globalThis.Promise<$.GoError>
	Context(): context.Context | null
	MsgRecv(msg: __goscript_message.Message): $.GoError | globalThis.Promise<$.GoError>
	MsgSend(msg: __goscript_message.Message): $.GoError | globalThis.Promise<$.GoError>
	Recv(): [any, $.GoError]
	RecvTo(_p0: any): $.GoError
}

$.registerInterfaceType(
	"srpc.StreamRecv",
	null,
	[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseSend", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "MsgRecv", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "MsgSend", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Recv", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "RecvTo", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: "error" }] }]
)

export type StreamSend = {
	Close(): $.GoError | globalThis.Promise<$.GoError>
	CloseSend(): $.GoError | globalThis.Promise<$.GoError>
	Context(): context.Context | null
	MsgRecv(msg: __goscript_message.Message): $.GoError | globalThis.Promise<$.GoError>
	MsgSend(msg: __goscript_message.Message): $.GoError | globalThis.Promise<$.GoError>
	Send(_p0: any): $.GoError
}

$.registerInterfaceType(
	"srpc.StreamSend",
	null,
	[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseSend", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "MsgRecv", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "MsgSend", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Send", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: "error" }] }]
)

export type StreamSendAndClose = {
	Close(): $.GoError | globalThis.Promise<$.GoError>
	CloseSend(): $.GoError | globalThis.Promise<$.GoError>
	Context(): context.Context | null
	MsgRecv(msg: __goscript_message.Message): $.GoError | globalThis.Promise<$.GoError>
	MsgSend(msg: __goscript_message.Message): $.GoError | globalThis.Promise<$.GoError>
	Send(_p0: any): $.GoError
	SendAndClose(_p0: any): $.GoError
}

$.registerInterfaceType(
	"srpc.StreamSendAndClose",
	null,
	[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseSend", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "MsgRecv", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "MsgSend", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Send", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SendAndClose", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: "error" }] }]
)

export class streamWithClose {
	public get Stream(): Stream | null {
		return this._fields.Stream.value
	}
	public set Stream(value: Stream | null) {
		this._fields.Stream.value = value
	}

	public get closeFn(): (() => $.GoError | globalThis.Promise<$.GoError>) | null {
		return this._fields.closeFn.value
	}
	public set closeFn(value: (() => $.GoError | globalThis.Promise<$.GoError>) | null) {
		this._fields.closeFn.value = value
	}

	public _fields: {
		Stream: $.VarRef<Stream | null>
		closeFn: $.VarRef<(() => $.GoError | globalThis.Promise<$.GoError>) | null>
	}

	constructor(init?: Partial<{Stream?: Stream | null, closeFn?: (() => $.GoError | globalThis.Promise<$.GoError>) | null}>) {
		this._fields = {
			Stream: $.varRef(init?.Stream ?? null),
			closeFn: $.varRef(init?.closeFn ?? null)
		}
	}

	public clone(): streamWithClose {
		const cloned = new streamWithClose()
		cloned._fields = {
			Stream: $.varRef(this._fields.Stream.value),
			closeFn: $.varRef(this._fields.closeFn.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const s: streamWithClose | $.VarRef<streamWithClose> | null = this
		let err = await $.pointerValue<Exclude<Stream, null>>($.pointerValue<streamWithClose>(s).Stream).Close()
		let err2 = await $.pointerValue<streamWithClose>(s).closeFn!()
		if (err != null) {
			return err
		}
		return err2
	}

	public async CloseSend(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<Stream | null, null>>(this.Stream).CloseSend()
	}

	public Context(): any {
		return $.pointerValue<Exclude<Stream | null, null>>(this.Stream).Context()
	}

	public async MsgRecv(msg: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<Stream | null, null>>(this.Stream).MsgRecv(msg)
	}

	public async MsgSend(msg: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<Stream | null, null>>(this.Stream).MsgSend(msg)
	}

	static __typeInfo = $.registerStructType(
		"srpc.streamWithClose",
		() => new streamWithClose(),
		[{ name: "Close", args: [], returns: [] }, { name: "CloseSend", args: [], returns: [] }, { name: "Context", args: [], returns: [] }, { name: "MsgRecv", args: [], returns: [] }, { name: "MsgSend", args: [], returns: [] }],
		streamWithClose,
		{"Stream": "srpc.Stream", "closeFn": ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)}
	)
}

export class streamWithContext {
	public get Stream(): Stream | null {
		return this._fields.Stream.value
	}
	public set Stream(value: Stream | null) {
		this._fields.Stream.value = value
	}

	public get ctx(): context.Context | null {
		return this._fields.ctx.value
	}
	public set ctx(value: context.Context | null) {
		this._fields.ctx.value = value
	}

	public _fields: {
		Stream: $.VarRef<Stream | null>
		ctx: $.VarRef<context.Context | null>
	}

	constructor(init?: Partial<{Stream?: Stream | null, ctx?: context.Context | null}>) {
		this._fields = {
			Stream: $.varRef(init?.Stream ?? null),
			ctx: $.varRef(init?.ctx ?? null)
		}
	}

	public clone(): streamWithContext {
		const cloned = new streamWithContext()
		cloned._fields = {
			Stream: $.varRef(this._fields.Stream.value),
			ctx: $.varRef(this._fields.ctx.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Context(): context.Context | null {
		const s: streamWithContext | $.VarRef<streamWithContext> | null = this
		return $.pointerValue<streamWithContext>(s).ctx
	}

	public async Close(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<Stream | null, null>>(this.Stream).Close()
	}

	public async CloseSend(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<Stream | null, null>>(this.Stream).CloseSend()
	}

	public async MsgRecv(msg: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<Stream | null, null>>(this.Stream).MsgRecv(msg)
	}

	public async MsgSend(msg: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<Stream | null, null>>(this.Stream).MsgSend(msg)
	}

	static __typeInfo = $.registerStructType(
		"srpc.streamWithContext",
		() => new streamWithContext(),
		[{ name: "Context", args: [], returns: [] }, { name: "Close", args: [], returns: [] }, { name: "CloseSend", args: [], returns: [] }, { name: "MsgRecv", args: [], returns: [] }, { name: "MsgSend", args: [], returns: [] }],
		streamWithContext,
		{"Stream": "srpc.Stream", "ctx": "context.Context"}
	)
}

export function NewStreamWithClose(strm: Stream | null, close: (() => $.GoError | globalThis.Promise<$.GoError>) | null): Stream | null {
	return $.interfaceValue<Stream | null>(new streamWithClose({Stream: strm, closeFn: close}), "*srpc.streamWithClose")
}

export function NewStreamWithContext(strm: Stream | null, ctx: context.Context | null): Stream | null {
	return $.interfaceValue<Stream | null>(new streamWithContext({Stream: strm, ctx: ctx}), "*srpc.streamWithContext")
}

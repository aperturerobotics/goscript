// Generated file based on msg-stream.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as __goscript_message from "./message.gs.ts"

import type * as __goscript_stream from "./stream.gs.ts"
import "@goscript/context/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "./message.gs.ts"

export type MsgStreamRw = {
	ReadOne(): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
	WriteCallCancel(): $.GoError | globalThis.Promise<$.GoError>
	WriteCallData(data: $.Slice<number>, dataIsZero: boolean, complete: boolean, err: $.GoError): $.GoError | globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"srpc.MsgStreamRw",
	null,
	[{ name: "ReadOne", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "WriteCallCancel", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "WriteCallData", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "dataIsZero", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "complete", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "err", type: "error" }], returns: [{ name: "_r0", type: "error" }] }]
);

export class MsgStream {
	// ctx is the stream context
	public get ctx(): context.Context | null {
		return this._fields.ctx.value
	}
	public set ctx(value: context.Context | null) {
		this._fields.ctx.value = value
	}

	// rw is the msg stream read-writer
	public get rw(): MsgStreamRw | null {
		return this._fields.rw.value
	}
	public set rw(value: MsgStreamRw | null) {
		this._fields.rw.value = value
	}

	// closeCb is the close callback
	public get closeCb(): (() => void) | null {
		return this._fields.closeCb.value
	}
	public set closeCb(value: (() => void) | null) {
		this._fields.closeCb.value = value
	}

	public _fields: {
		ctx: $.VarRef<context.Context | null>
		rw: $.VarRef<MsgStreamRw | null>
		closeCb: $.VarRef<(() => void) | null>
	}

	constructor(init?: Partial<{ctx?: context.Context | null, rw?: MsgStreamRw | null, closeCb?: (() => void) | null}>) {
		this._fields = {
			ctx: $.varRef(init?.ctx ?? (null as unknown as context.Context | null)),
			rw: $.varRef(init?.rw ?? (null as unknown as MsgStreamRw | null)),
			closeCb: $.varRef(init?.closeCb ?? (null as unknown as (() => void) | null))
		}
	}

	public clone(): MsgStream {
		const cloned = new MsgStream()
		cloned._fields = {
			ctx: $.varRef(this._fields.ctx.value),
			rw: $.varRef(this._fields.rw.value),
			closeCb: $.varRef(this._fields.closeCb.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const r: MsgStream | $.VarRef<MsgStream> | null = this
		let err = await $.pointerValue<Exclude<MsgStreamRw, null>>($.pointerValue<MsgStream>(r).rw).WriteCallCancel()
		if ($.pointerValue<MsgStream>(r).closeCb != null) {
			await $.pointerValue<MsgStream>(r).closeCb!()
		}

		return err
	}

	public async CloseSend(): globalThis.Promise<$.GoError> {
		const r: MsgStream | $.VarRef<MsgStream> | null = this
		return await $.pointerValue<Exclude<MsgStreamRw, null>>($.pointerValue<MsgStream>(r).rw).WriteCallData(null, false, true, null)
	}

	public Context(): context.Context | null {
		const r: MsgStream | $.VarRef<MsgStream> | null = this
		return $.pointerValue<MsgStream>(r).ctx
	}

	public async MsgRecv(msg: __goscript_message.Message): globalThis.Promise<$.GoError> {
		const r: MsgStream | $.VarRef<MsgStream> | null = this
		let __goscriptTuple0: any = await $.pointerValue<Exclude<MsgStreamRw, null>>($.pointerValue<MsgStream>(r).rw).ReadOne()
		let data: $.Slice<number> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return err
		}
		return await $.pointerValue<Exclude<protobuf_go_lite.Message, null>>(msg).UnmarshalVT(data)
	}

	public async MsgSend(msg: __goscript_message.Message): globalThis.Promise<$.GoError> {
		const r: MsgStream | $.VarRef<MsgStream> | null = this
		{
			let err = await $.pointerValue<Exclude<context.Context, null>>($.pointerValue<MsgStream>(r).ctx).Err()
			if (err != null) {
				return context.Canceled
			}
		}

		let __goscriptTuple1: any = await $.pointerValue<Exclude<protobuf_go_lite.Message, null>>(msg).MarshalVT()
		let msgData: $.Slice<number> = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		if (err != null) {
			return err
		}

		return await $.pointerValue<Exclude<MsgStreamRw, null>>($.pointerValue<MsgStream>(r).rw).WriteCallData(msgData, $.len(msgData) == 0, false, null)
	}

	static __typeInfo = $.registerStructType(
		"srpc.MsgStream",
		() => new MsgStream(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseSend", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "MsgRecv", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "MsgSend", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }],
		MsgStream,
		[{ name: "ctx", key: "ctx", type: "context.Context", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "rw", key: "rw", type: "srpc.MsgStreamRw", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 16, exported: false }, { name: "closeCb", key: "closeCb", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [2], offset: 32, exported: false }]
	)
}

export async function NewMsgStream(ctx: context.Context | null, rw: MsgStreamRw | null, closeCb: (() => void) | null): globalThis.Promise<MsgStream | $.VarRef<MsgStream> | null> {
	return new MsgStream({ctx: ctx, rw: rw, closeCb: closeCb})
}

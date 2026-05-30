// Generated file based on stream-pipe.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"

import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as __goscript_message from "./message.gs.ts"

import type * as __goscript_stream from "./stream.gs.ts"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/sync/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "./message.gs.ts"

export class pipeStream {
	public get ctx(): context.Context | null {
		return this._fields.ctx.value
	}
	public set ctx(value: context.Context | null) {
		this._fields.ctx.value = value
	}

	public get ctxCancel(): (() => void) | null {
		return this._fields.ctxCancel.value
	}
	public set ctxCancel(value: (() => void) | null) {
		this._fields.ctxCancel.value = value
	}

	// other is the other end of the stream.
	public get other(): pipeStream | $.VarRef<pipeStream> | null {
		return this._fields.other.value
	}
	public set other(value: pipeStream | $.VarRef<pipeStream> | null) {
		this._fields.other.value = value
	}

	// closeOnce ensures we close only once.
	public get closeOnce(): sync.Once {
		return this._fields.closeOnce.value
	}
	public set closeOnce(value: sync.Once) {
		this._fields.closeOnce.value = value
	}

	// dataCh is the data channel
	public get dataCh(): $.Channel<$.Slice<number>> | null {
		return this._fields.dataCh.value
	}
	public set dataCh(value: $.Channel<$.Slice<number>> | null) {
		this._fields.dataCh.value = value
	}

	public _fields: {
		ctx: $.VarRef<context.Context | null>
		ctxCancel: $.VarRef<(() => void) | null>
		other: $.VarRef<pipeStream | $.VarRef<pipeStream> | null>
		closeOnce: $.VarRef<sync.Once>
		dataCh: $.VarRef<$.Channel<$.Slice<number>> | null>
	}

	constructor(init?: Partial<{ctx?: context.Context | null, ctxCancel?: (() => void) | null, other?: pipeStream | $.VarRef<pipeStream> | null, closeOnce?: sync.Once, dataCh?: $.Channel<$.Slice<number>> | null}>) {
		this._fields = {
			ctx: $.varRef(init?.ctx ?? null),
			ctxCancel: $.varRef(init?.ctxCancel ?? null),
			other: $.varRef(init?.other ?? null),
			closeOnce: $.varRef(init?.closeOnce ? $.markAsStructValue($.cloneStructValue(init.closeOnce)) : $.markAsStructValue(new sync.Once())),
			dataCh: $.varRef(init?.dataCh ?? null)
		}
	}

	public clone(): pipeStream {
		const cloned = new pipeStream()
		cloned._fields = {
			ctx: $.varRef(this._fields.ctx.value),
			ctxCancel: $.varRef(this._fields.ctxCancel.value),
			other: $.varRef(this._fields.other.value),
			closeOnce: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.closeOnce.value))),
			dataCh: $.varRef(this._fields.dataCh.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const p: pipeStream | $.VarRef<pipeStream> | null = this
		await $.pointerValue<pipeStream>(p).ctxCancel!()
		await pipeStream.prototype.closeRemote.call(p)
		return null
	}

	public async CloseSend(): globalThis.Promise<$.GoError> {
		const p: pipeStream | $.VarRef<pipeStream> | null = this
		await pipeStream.prototype.closeRemote.call(p)
		return null
	}

	public Context(): context.Context | null {
		const p: pipeStream | $.VarRef<pipeStream> | null = this
		return $.pointerValue<pipeStream>(p).ctx
	}

	public async MsgRecv(msg: __goscript_message.Message): globalThis.Promise<$.GoError> {
		const p: pipeStream | $.VarRef<pipeStream> | null = this
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, $.GoError>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<Exclude<context.Context, null>>($.pointerValue<pipeStream>(p).ctx).Done(),
				onSelected: async (__goscriptSelect0Result) => {
					return context.Canceled
				}
			},
			{
				id: 1,
				isSend: false,
				channel: $.pointerValue<pipeStream>(p).dataCh,
				onSelected: async (__goscriptSelect0Result) => {
					let data = __goscriptSelect0Result.value
					let ok = __goscriptSelect0Result.ok
					if (!ok) {
						return io.EOF
					}
					return $.pointerValue<Exclude<protobuf_go_lite.Message, null>>(msg).UnmarshalVT(data)
				}
			}
		], false)
		if (__goscriptSelect0HasReturn) {
			return __goscriptSelect0Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async MsgSend(msg: __goscript_message.Message): globalThis.Promise<$.GoError> {
		const p: pipeStream | $.VarRef<pipeStream> | null = this
		let __goscriptTuple0: any = $.pointerValue<Exclude<protobuf_go_lite.Message, null>>(msg).MarshalVT()
		let data: $.Slice<number> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return err
		}
		const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, $.GoError>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<Exclude<context.Context, null>>($.pointerValue<pipeStream>(p).ctx).Done(),
				onSelected: async (__goscriptSelect1Result) => {
					return context.Canceled
				}
			},
			{
				id: 1,
				isSend: true,
				channel: $.pointerValue<pipeStream>($.pointerValue<pipeStream>(p).other).dataCh,
				value: data,
				onSelected: async (__goscriptSelect1Result) => {
					return null
				}
			}
		], false)
		if (__goscriptSelect1HasReturn) {
			return __goscriptSelect1Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async closeRemote(): globalThis.Promise<void> {
		const p: pipeStream | $.VarRef<pipeStream> | null = this
		await $.pointerValue<pipeStream>(p).closeOnce.Do($.functionValue((): void => {
			$.pointerValue<pipeStream>($.pointerValue<pipeStream>(p).other).dataCh!.close()
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	}

	static __typeInfo = $.registerStructType(
		"srpc.pipeStream",
		() => new pipeStream(),
		[{ name: "Close", args: [], returns: [] }, { name: "CloseSend", args: [], returns: [] }, { name: "Context", args: [], returns: [] }, { name: "MsgRecv", args: [], returns: [] }, { name: "MsgSend", args: [], returns: [] }, { name: "closeRemote", args: [], returns: [] }],
		pipeStream,
		[{ name: "ctx", key: "ctx", type: "context.Context", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "ctxCancel", key: "ctxCancel", type: ({ kind: $.TypeKind.Function, name: "context.CancelFunc", params: [], results: [] } as $.FunctionTypeInfo), pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 16, exported: false }, { name: "other", key: "other", type: { kind: $.TypeKind.Pointer, elemType: "srpc.pipeStream" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [2], offset: 24, exported: false }, { name: "closeOnce", key: "closeOnce", type: "sync.Once", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [3], offset: 32, exported: false }, { name: "dataCh", key: "dataCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [4], offset: 48, exported: false }]
	)
}

export function NewPipeStream(ctx: context.Context | null): [__goscript_stream.Stream | null, __goscript_stream.Stream | null] {
	let s1: pipeStream | $.VarRef<pipeStream> | null = new pipeStream({dataCh: $.makeChannel<$.Slice<number>>(5, null, "both")})
	let __goscriptTuple1: any = context.WithCancel($.pointerValueOrNil(ctx)!)
	$.pointerValue<pipeStream>(s1).ctx = __goscriptTuple1[0]
	$.pointerValue<pipeStream>(s1).ctxCancel = __goscriptTuple1[1]
	let s2: pipeStream | $.VarRef<pipeStream> | null = new pipeStream({other: s1, dataCh: $.makeChannel<$.Slice<number>>(5, null, "both")})
	let __goscriptTuple2: any = context.WithCancel($.pointerValueOrNil(ctx)!)
	$.pointerValue<pipeStream>(s2).ctx = __goscriptTuple2[0]
	$.pointerValue<pipeStream>(s2).ctxCancel = __goscriptTuple2[1]
	$.pointerValue<pipeStream>(s1).other = s2
	return [$.interfaceValue<__goscript_stream.Stream | null>(s1, "*srpc.pipeStream"), $.interfaceValue<__goscript_stream.Stream | null>(s2, "*srpc.pipeStream")]
}

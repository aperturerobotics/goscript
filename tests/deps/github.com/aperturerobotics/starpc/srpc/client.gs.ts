// Generated file based on client.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as errors from "@goscript/github.com/pkg/errors/index.js"

import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as broadcast from "@goscript/github.com/aperturerobotics/util/broadcast/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as __goscript_client_rpc from "./client-rpc.gs.ts"

import * as __goscript_common_rpc from "./common-rpc.gs.ts"

import * as __goscript_errors from "./errors.gs.ts"

import * as __goscript_message from "./message.gs.ts"

import * as __goscript_msg_stream from "./msg-stream.gs.ts"

import type * as __goscript_packet from "./packet.gs.ts"

import * as __goscript_rpcproto_pb from "./rpcproto.pb.gs.ts"

import type * as __goscript_stream from "./stream.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/context/index.js"
import "@goscript/github.com/pkg/errors/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "@goscript/github.com/aperturerobotics/util/broadcast/index.js"
import "@goscript/sync/atomic/index.js"
import "./client-rpc.gs.ts"
import "./common-rpc.gs.ts"
import "./errors.gs.ts"
import "./message.gs.ts"
import "./msg-stream.gs.ts"
import "./rpcproto.pb.gs.ts"
import "./writer.gs.ts"

export type Client = {
	ExecCall(ctx: context.Context | null, service: string, method: string, _in: __goscript_message.Message, out: __goscript_message.Message): $.GoError | globalThis.Promise<$.GoError>
	NewStream(ctx: context.Context | null, service: string, method: string, firstMsg: __goscript_message.Message): [__goscript_stream.Stream | null, $.GoError] | globalThis.Promise<[__goscript_stream.Stream | null, $.GoError]>
}

$.registerInterfaceType(
	"srpc.Client",
	null,
	[{ name: "ExecCall", args: [{ name: "ctx", type: "context.Context" }, { name: "service", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "method", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "in", type: "protobuf_go_lite.Message" }, { name: "out", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "NewStream", args: [{ name: "ctx", type: "context.Context" }, { name: "service", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "method", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "firstMsg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "srpc.Stream" }, { name: "_r1", type: "error" }] }]
);

export type OpenStreamFunc = ((ctx: context.Context | null, msgHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null, closeHandler: ((closeErr: $.GoError) => void) | null) => [__goscript_writer.PacketWriter | null, $.GoError] | globalThis.Promise<[__goscript_writer.PacketWriter | null, $.GoError]>) | null

export class client {
	// openStream opens a new stream.
	public get openStream(): ((ctx: context.Context | null, msgHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null, closeHandler: ((closeErr: $.GoError) => void) | null) => [__goscript_writer.PacketWriter | null, $.GoError] | globalThis.Promise<[__goscript_writer.PacketWriter | null, $.GoError]>) | null {
		return this._fields.openStream.value
	}
	public set openStream(value: ((ctx: context.Context | null, msgHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null, closeHandler: ((closeErr: $.GoError) => void) | null) => [__goscript_writer.PacketWriter | null, $.GoError] | globalThis.Promise<[__goscript_writer.PacketWriter | null, $.GoError]>) | null) {
		this._fields.openStream.value = value
	}

	public _fields: {
		openStream: $.VarRef<((ctx: context.Context | null, msgHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null, closeHandler: ((closeErr: $.GoError) => void) | null) => [__goscript_writer.PacketWriter | null, $.GoError] | globalThis.Promise<[__goscript_writer.PacketWriter | null, $.GoError]>) | null>
	}

	constructor(init?: Partial<{openStream?: ((ctx: context.Context | null, msgHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null, closeHandler: ((closeErr: $.GoError) => void) | null) => [__goscript_writer.PacketWriter | null, $.GoError] | globalThis.Promise<[__goscript_writer.PacketWriter | null, $.GoError]>) | null}>) {
		this._fields = {
			openStream: $.varRef(init?.openStream ?? (null as unknown as ((ctx: context.Context | null, msgHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null, closeHandler: ((closeErr: $.GoError) => void) | null) => [__goscript_writer.PacketWriter | null, $.GoError] | globalThis.Promise<[__goscript_writer.PacketWriter | null, $.GoError]>) | null))
		}
	}

	public clone(): client {
		const cloned = new client()
		cloned._fields = {
			openStream: $.varRef(this._fields.openStream.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async ExecCall(ctx: context.Context | null, service: string, method: string, _in: __goscript_message.Message, out: __goscript_message.Message): globalThis.Promise<$.GoError> {
		const c: client | $.VarRef<client> | null = this
		await using __defer = new $.AsyncDisposableStack()
		let __goscriptTuple0: any = await $.pointerValue<Exclude<protobuf_go_lite.Message, null>>(_in).MarshalVT()
		let firstMsg: $.Slice<number> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return err
		}

		let clientRPC: __goscript_client_rpc.ClientRPC | $.VarRef<__goscript_client_rpc.ClientRPC> | null = __goscript_client_rpc.NewClientRPC(ctx, service, method)
		__defer.defer(async () => { await __goscript_client_rpc.ClientRPC.prototype.Close.call(clientRPC) })

		let __goscriptTuple1: any = await $.pointerValue<client>(c).openStream!(ctx, ((__receiver) => (data: $.Slice<number>) => __receiver.HandlePacketData(data))($.pointerValue<__goscript_client_rpc.ClientRPC>(clientRPC)), ((__receiver) => (closeErr: $.GoError) => __receiver.HandleStreamClose(closeErr))($.pointerValue<__goscript_client_rpc.ClientRPC>(clientRPC)))
		let writer = __goscriptTuple1[0]
		err = __goscriptTuple1[1]
		if (err != null) {
			return err
		}

		{
			let __goscriptShadow0 = await __goscript_client_rpc.ClientRPC.prototype.Start.call(clientRPC, writer, true, firstMsg)
			if (__goscriptShadow0 != null) {
				return __goscriptShadow0
			}
		}

		let __goscriptTuple2: any = await $.pointerValue<__goscript_client_rpc.ClientRPC>(clientRPC).commonRPC.ReadOne()
		let msg: $.Slice<number> = __goscriptTuple2[0]
		err = __goscriptTuple2[1]
		if (err != null) {
			// this includes any server returned error.
			return err
		}
		{
			let __goscriptShadow1 = await $.pointerValue<Exclude<protobuf_go_lite.Message, null>>(out).UnmarshalVT(msg)
			if (__goscriptShadow1 != null) {
				return errors.Wrap($.pointerValueOrNil(__goscript_errors.ErrInvalidMessage)!, $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow1).Error())
			}
		}

		return null
	}

	public async NewStream(ctx: context.Context | null, service: string, method: string, firstMsg: __goscript_message.Message): globalThis.Promise<[__goscript_stream.Stream | null, $.GoError]> {
		const c: client | $.VarRef<client> | null = this
		let firstMsgData: $.Slice<number> = null as $.Slice<number>
		if (firstMsg != null) {
			let err: $.GoError = null as $.GoError
			let __goscriptTuple3: any = await $.pointerValue<Exclude<protobuf_go_lite.Message, null>>(firstMsg).MarshalVT()
			firstMsgData = __goscriptTuple3[0]
			err = __goscriptTuple3[1]
			if (err != null) {
				return [null, err]
			}
		}

		let clientRPC: __goscript_client_rpc.ClientRPC | $.VarRef<__goscript_client_rpc.ClientRPC> | null = __goscript_client_rpc.NewClientRPC(ctx, service, method)
		let [writer, err] = await $.pointerValue<client>(c).openStream!(ctx, ((__receiver) => (data: $.Slice<number>) => __receiver.HandlePacketData(data))($.pointerValue<__goscript_client_rpc.ClientRPC>(clientRPC)), ((__receiver) => (closeErr: $.GoError) => __receiver.HandleStreamClose(closeErr))($.pointerValue<__goscript_client_rpc.ClientRPC>(clientRPC)))
		if (err != null) {
			return [null, err]
		}

		{
			let __goscriptShadow2 = await __goscript_client_rpc.ClientRPC.prototype.Start.call(clientRPC, writer, firstMsg != null, firstMsgData)
			if (__goscriptShadow2 != null) {
				return [null, __goscriptShadow2]
			}
		}

		return [$.interfaceValue<__goscript_stream.Stream | null>(await __goscript_msg_stream.NewMsgStream(ctx, $.interfaceValue<__goscript_msg_stream.MsgStreamRw | null>(clientRPC, "*srpc.ClientRPC"), $.functionValue(async (): globalThis.Promise<void> => {
			await $.pointerValue<__goscript_client_rpc.ClientRPC>(clientRPC).commonRPC.cancelContext()
			await $.pointerValue<Exclude<__goscript_writer.PacketWriter, null>>(writer).Close()
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))), "*srpc.MsgStream"), null]
	}

	static __typeInfo = $.registerStructType(
		"srpc.client",
		() => new client(),
		[{ name: "ExecCall", args: [{ name: "ctx", type: "context.Context" }, { name: "service", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "method", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "in", type: "protobuf_go_lite.Message" }, { name: "out", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "NewStream", args: [{ name: "ctx", type: "context.Context" }, { name: "service", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "method", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "firstMsg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "srpc.Stream" }, { name: "_r1", type: "error" }] }],
		client,
		[{ name: "openStream", key: "openStream", type: ({ kind: $.TypeKind.Function, params: ["context.Context", ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["error"] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: ["error"], results: [] } as $.FunctionTypeInfo)], results: ["srpc.PacketWriter", "error"] } as $.FunctionTypeInfo), pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }]
	)
}

export function NewClient(openStream: OpenStreamFunc): Client | null {
	return $.interfaceValue<Client | null>(new client({openStream: openStream}), "*srpc.client")
}

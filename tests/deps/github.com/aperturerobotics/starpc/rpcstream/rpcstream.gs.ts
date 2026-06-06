// Generated file based on rpcstream.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as contextutil from "@goscript/github.com/aperturerobotics/starpc/internal/contextutil/index.js"

import * as srpc from "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"

import * as errors from "@goscript/github.com/pkg/errors/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as __goscript_errors from "./errors.gs.ts"

import * as __goscript_read_writer from "./read-writer.gs.ts"

import * as __goscript_rpcstream_pb from "./rpcstream.pb.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/context/index.js"
import "@goscript/github.com/aperturerobotics/starpc/internal/contextutil/index.js"
import "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"
import "@goscript/github.com/pkg/errors/index.js"
import "./errors.gs.ts"
import "./read-writer.gs.ts"
import "./rpcstream.pb.gs.ts"
import "./writer.gs.ts"

export type RpcStream = {
	Close(): $.GoError | globalThis.Promise<$.GoError>
	CloseSend(): $.GoError | globalThis.Promise<$.GoError>
	Context(): context.Context | null
	MsgRecv(msg: srpc.Message): $.GoError | globalThis.Promise<$.GoError>
	MsgSend(msg: srpc.Message): $.GoError | globalThis.Promise<$.GoError>
	Recv(): [__goscript_rpcstream_pb.RpcStreamPacket | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket> | null, $.GoError] | globalThis.Promise<[__goscript_rpcstream_pb.RpcStreamPacket | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket> | null, $.GoError]>
	Send(_p0: __goscript_rpcstream_pb.RpcStreamPacket | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket> | null): $.GoError | globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"rpcstream.RpcStream",
	null,
	[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseSend", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "MsgRecv", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "MsgSend", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Recv", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" } }, { name: "_r1", type: "error" }] }, { name: "Send", args: [{ name: "_p0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" } }], returns: [{ name: "_r0", type: "error" }] }]
);

export type RpcStreamGetter = ((ctx: context.Context | null, componentID: string, released: (() => void) | null) => [srpc.Invoker | null, (() => void) | null, $.GoError] | globalThis.Promise<[srpc.Invoker | null, (() => void) | null, $.GoError]>) | null

export type RpcStreamCaller = ((ctx: context.Context | null) => [any, $.GoError] | globalThis.Promise<[any, $.GoError]>) | null

export async function OpenRpcStream(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, rpcCaller: ((ctx: context.Context | null) => [any, $.GoError] | globalThis.Promise<[any, $.GoError]>) | null, componentID: string, waitAck: boolean): globalThis.Promise<[RpcStream | null, $.GoError]> {
	// open the rpc stream
	let [rpcStream, err] = await rpcCaller!(ctx)
	if (err != null) {
		return [null, err]
	}

	// write the component id
	err = await $.callGenericMethod(__typeArgs, "T", "Send", rpcStream, new __goscript_rpcstream_pb.RpcStreamPacket({Body: $.interfaceValue<__goscript_rpcstream_pb.isRpcStreamPacket_Body | null>(new __goscript_rpcstream_pb.RpcStreamPacket_Init({Init: new __goscript_rpcstream_pb.RpcStreamInit({ComponentId: componentID})}), "*rpcstream.RpcStreamPacket_Init")}))
	if (err != null) {
		await $.callGenericMethod(__typeArgs, "T", "Close", rpcStream)
		return [null, err]
	}

	// wait for ack
	if (waitAck) {
		let __goscriptTuple0: any = await $.callGenericMethod(__typeArgs, "T", "Recv", rpcStream)
		let pkt: __goscript_rpcstream_pb.RpcStreamPacket | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket> | null = __goscriptTuple0[0]
		let __goscriptShadow0 = __goscriptTuple0[1]
		if (__goscriptShadow0 == null) {
			{
				const __goscriptTypeSwitchValue = __goscript_rpcstream_pb.RpcStreamPacket.prototype.GetBody.call(pkt)
				switch (true) {
					case $.typeAssert<__goscript_rpcstream_pb.RpcStreamPacket_Ack | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket_Ack> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Ack" }).ok:
						{
							let b: __goscript_rpcstream_pb.RpcStreamPacket_Ack | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket_Ack> | null = $.typeAssert<__goscript_rpcstream_pb.RpcStreamPacket_Ack | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket_Ack> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Ack" }).value
							{
								let errStr = __goscript_rpcstream_pb.RpcAck.prototype.GetError.call($.pointerValue<__goscript_rpcstream_pb.RpcStreamPacket_Ack>(b).Ack)
								if (!$.stringEqual(errStr, "")) {
									__goscriptShadow0 = errors.Errorf("remote: %s", errStr)
								}
							}
						}
						break
					default:
						{
							let b: any = __goscriptTypeSwitchValue
							__goscriptShadow0 = errors.New("expected ack packet")
						}
						break
				}
			}
		}
		if (__goscriptShadow0 != null) {
			await $.callGenericMethod(__typeArgs, "T", "Close", rpcStream)
			return [null, __goscriptShadow0]
		}
	}

	return [(rpcStream as RpcStream | null), null]
}

export function NewRpcStreamOpenStream(__typeArgs: $.GenericTypeArgs | undefined, rpcCaller: RpcStreamCaller | null, componentID: string, waitAck: boolean): ((ctx: context.Context | null, msgHandler: srpc.PacketDataHandler, closeHandler: srpc.CloseHandler) => [srpc.PacketWriter | null, $.GoError] | globalThis.Promise<[srpc.PacketWriter | null, $.GoError]>) | null {
	return $.functionValue(async (ctx: context.Context | null, msgHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null, closeHandler: ((closeErr: $.GoError) => void) | null): globalThis.Promise<[srpc.PacketWriter | null, $.GoError]> => {
		// open the stream
		let [rw, err] = await OpenRpcStream({T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseSend", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "MsgRecv", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "MsgSend", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Recv", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" } }, { name: "_r1", type: "error" }] }, { name: "Send", args: [{ name: "_p0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" } }], returns: [{ name: "_r0", type: "error" }] }] }, zero: () => null }}, ctx, rpcCaller, componentID, waitAck)
		if (err != null) {
			return [null, err]
		}

		// start the read pump
		queueMicrotask(async () => { await __goscript_read_writer.ReadPump(rw, msgHandler, closeHandler) })
		// return the writer
		return [$.interfaceValue<srpc.PacketWriter | null>(__goscript_writer.NewRpcStreamWriter(rw), "*rpcstream.RpcStreamWriter"), null]
	}, ({ kind: $.TypeKind.Function, params: ["context.Context", ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["error"] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: ["error"], results: [] } as $.FunctionTypeInfo)], results: ["srpc.PacketWriter", "error"] } as $.FunctionTypeInfo))
}

export function NewRpcStreamClient(__typeArgs: $.GenericTypeArgs | undefined, rpcCaller: RpcStreamCaller | null, componentID: string, waitAck: boolean): srpc.Client | null {
	let openStream: ((ctx: context.Context | null, msgHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null, closeHandler: ((closeErr: $.GoError) => void) | null) => [srpc.PacketWriter | null, $.GoError] | globalThis.Promise<[srpc.PacketWriter | null, $.GoError]>) | null = NewRpcStreamOpenStream({T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseSend", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "MsgRecv", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "MsgSend", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Recv", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" } }, { name: "_r1", type: "error" }] }, { name: "Send", args: [{ name: "_p0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" } }], returns: [{ name: "_r0", type: "error" }] }] }, zero: () => null }}, rpcCaller, componentID, waitAck)
	return srpc.NewClient(openStream)
}

export async function HandleRpcStream(stream: RpcStream | null, getter: ((ctx: context.Context | null, componentID: string, released: (() => void) | null) => [srpc.Invoker | null, (() => void) | null, $.GoError] | globalThis.Promise<[srpc.Invoker | null, (() => void) | null, $.GoError]>) | null): globalThis.Promise<$.GoError> {
	await using __defer = new $.AsyncDisposableStack()
	// Read the "init" packet.
	let __goscriptTuple1: any = await $.pointerValue<Exclude<RpcStream, null>>(stream).Recv()
	let initPkt: __goscript_rpcstream_pb.RpcStreamPacket | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket> | null = __goscriptTuple1[0]
	let err = __goscriptTuple1[1]
	if (err != null) {
		return err
	}
	let __goscriptTuple2: any = $.typeAssertTuple<__goscript_rpcstream_pb.RpcStreamPacket_Init | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket_Init> | null>(__goscript_rpcstream_pb.RpcStreamPacket.prototype.GetBody.call(initPkt), { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Init" })
	let initInner: __goscript_rpcstream_pb.RpcStreamPacket_Init | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket_Init> | null = __goscriptTuple2[0]
	let ok = __goscriptTuple2[1]
	if (!ok || ($.pointerValue<__goscript_rpcstream_pb.RpcStreamPacket_Init>(initInner).Init == null)) {
		return __goscript_errors.ErrUnexpectedPacket
	}

	let [ctx, ctxCancel] = contextutil.WithCancel(await $.pointerValue<Exclude<RpcStream, null>>(stream).Context())
	__defer.defer(async () => { await ctxCancel!() })

	// lookup the server for this component id
	let componentID = __goscript_rpcstream_pb.RpcStreamInit.prototype.GetComponentId.call($.pointerValue<__goscript_rpcstream_pb.RpcStreamPacket_Init>(initInner).Init)
	let __goscriptTuple3: any = await getter!(ctx, componentID, ctxCancel)
	let mux = __goscriptTuple3[0]
	let muxRel: (() => void) | null = __goscriptTuple3[1]
	err = __goscriptTuple3[2]
	if ((err == null) && (await $.pointerValue<Exclude<context.Context, null>>(ctx).Err() != null)) {
		err = context.Canceled
	}
	if ((err == null) && (mux == null)) {
		err = __goscript_errors.ErrNoServerForComponent
	}
	if (muxRel != null) {
		__defer.defer(async () => { await muxRel!() })
	}

	// send ack
	let errStr: string = ""
	if (err != null) {
		errStr = $.pointerValue<Exclude<$.GoError, null>>(err).Error()
	}
	let sendErr = await $.pointerValue<Exclude<RpcStream, null>>(stream).Send(new __goscript_rpcstream_pb.RpcStreamPacket({Body: $.interfaceValue<__goscript_rpcstream_pb.isRpcStreamPacket_Body | null>(new __goscript_rpcstream_pb.RpcStreamPacket_Ack({Ack: new __goscript_rpcstream_pb.RpcAck({Error: errStr})}), "*rpcstream.RpcStreamPacket_Ack")}))
	if (err != null) {
		return err
	}
	if (sendErr != null) {
		return sendErr
	}

	// handle the rpc
	let serverRPC: srpc.ServerRPC | $.VarRef<srpc.ServerRPC> | null = srpc.NewServerRPC(ctx, mux, $.interfaceValue<srpc.PacketWriter | null>(__goscript_writer.NewRpcStreamWriter(stream), "*rpcstream.RpcStreamWriter"))
	queueMicrotask(async () => { await __goscript_read_writer.ReadPump(stream, ((__receiver) => (data: $.Slice<number>) => __receiver.HandlePacketData(data))($.pointerValue<srpc.ServerRPC>(serverRPC)), ((__receiver) => (closeErr: $.GoError) => __receiver.HandleStreamClose(closeErr))($.pointerValue<srpc.ServerRPC>(serverRPC).commonRPC)) })
	err = await $.pointerValue<srpc.ServerRPC>(serverRPC).commonRPC.Wait(ctx)
	if (($.comparableEqual(err, context.Canceled)) && (await $.pointerValue<Exclude<context.Context, null>>(ctx).Err() == null)) {
		return null
	}
	return err
}

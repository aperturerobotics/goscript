// Generated file based on server-rpc.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as errors from "@goscript/github.com/pkg/errors/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as broadcast from "@goscript/github.com/aperturerobotics/util/broadcast/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as __goscript_common_rpc from "./common-rpc.gs.ts"

import * as __goscript_errors from "./errors.gs.ts"

import * as __goscript_invoker from "./invoker.gs.ts"

import type * as __goscript_message from "./message.gs.ts"

import * as __goscript_msg_stream from "./msg-stream.gs.ts"

import * as __goscript_packet from "./packet.gs.ts"

import * as __goscript_rpcproto_pb from "./rpcproto.pb.gs.ts"

import type * as __goscript_stream from "./stream.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/context/index.js"
import "@goscript/github.com/pkg/errors/index.js"
import "@goscript/github.com/aperturerobotics/util/broadcast/index.js"
import "@goscript/sync/atomic/index.js"
import "./common-rpc.gs.ts"
import "./errors.gs.ts"
import "./invoker.gs.ts"
import "./msg-stream.gs.ts"
import "./packet.gs.ts"
import "./rpcproto.pb.gs.ts"
import "./writer.gs.ts"

export class ServerRPC {
	public get commonRPC(): __goscript_common_rpc.commonRPC {
		return this._fields.commonRPC.value
	}
	public set commonRPC(value: __goscript_common_rpc.commonRPC) {
		this._fields.commonRPC.value = value
	}

	// invoker is the rpc call invoker
	public get invoker(): __goscript_invoker.Invoker | null {
		return this._fields.invoker.value
	}
	public set invoker(value: __goscript_invoker.Invoker | null) {
		this._fields.invoker.value = value
	}

	public _fields: {
		commonRPC: $.VarRef<__goscript_common_rpc.commonRPC>
		invoker: $.VarRef<__goscript_invoker.Invoker | null>
	}

	constructor(init?: Partial<{commonRPC?: __goscript_common_rpc.commonRPC, invoker?: __goscript_invoker.Invoker | null}>) {
		this._fields = {
			commonRPC: $.varRef(init?.commonRPC ? $.markAsStructValue($.cloneStructValue(init.commonRPC)) : $.markAsStructValue(new __goscript_common_rpc.commonRPC())),
			invoker: $.varRef(init?.invoker ?? null)
		}
	}

	public clone(): ServerRPC {
		const cloned = new ServerRPC()
		cloned._fields = {
			commonRPC: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.commonRPC.value))),
			invoker: $.varRef(this._fields.invoker.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async HandleCallStart(pkt: __goscript_rpcproto_pb.CallStart | $.VarRef<__goscript_rpcproto_pb.CallStart> | null): globalThis.Promise<$.GoError> {
		let r: ServerRPC | $.VarRef<ServerRPC> | null = this
		let err: $.GoError = null as $.GoError

		let locked = $.varRef($.markAsStructValue($.cloneStructValue(await $.pointerValue<ServerRPC>(r).commonRPC.bcast.Lock())))
		// process start: method and service
		if ((!$.stringEqual($.pointerValue<ServerRPC>(r).commonRPC.method, "")) || (!$.stringEqual($.pointerValue<ServerRPC>(r).commonRPC.service, ""))) {
			err = errors.New("call start must be sent only once")
			locked.value.Unlock()
			return err
		}
		if ($.pointerValue<ServerRPC>(r).commonRPC.dataClosed) {
			err = __goscript_errors.ErrCompleted
			locked.value.Unlock()
			return err
		}

		let service = __goscript_rpcproto_pb.CallStart.prototype.GetRpcService.call(pkt)
		let method = __goscript_rpcproto_pb.CallStart.prototype.GetRpcMethod.call(pkt)
		let __goscriptAssign0_0: string = service
		let __goscriptAssign0_1: string = method
		$.pointerValue<ServerRPC>(r).commonRPC.service = __goscriptAssign0_0
		$.pointerValue<ServerRPC>(r).commonRPC.method = __goscriptAssign0_1

		// process first data packet, if included
		{
			let data: $.Slice<number> = __goscript_rpcproto_pb.CallStart.prototype.GetData.call(pkt)
			if (($.len(data) != 0) || __goscript_rpcproto_pb.CallStart.prototype.GetDataIsZero.call(pkt)) {
				$.pointerValue<ServerRPC>(r).commonRPC.dataQueue = $.append($.pointerValue<ServerRPC>(r).commonRPC.dataQueue, data)
			}
		}

		// invoke the rpc
		await locked.value.Broadcast()
		queueMicrotask(async () => { await ServerRPC.prototype.invokeRPC.call(r, service, method) })
		locked.value.Unlock()

		return err
	}

	public async HandlePacket(msg: __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null): globalThis.Promise<$.GoError> {
		const r: ServerRPC | $.VarRef<ServerRPC> | null = this
		if (msg == null) {
			return null
		}
		{
			let err = __goscript_rpcproto_pb.Packet.prototype.Validate.call(msg)
			if (err != null) {
				return err
			}
		}

		{
			const __goscriptTypeSwitchValue = __goscript_rpcproto_pb.Packet.prototype.GetBody.call(msg)
			switch (true) {
				case $.typeAssert<__goscript_rpcproto_pb.Packet_CallStart | $.VarRef<__goscript_rpcproto_pb.Packet_CallStart> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallStart" }).ok:
					{
						let b: __goscript_rpcproto_pb.Packet_CallStart | $.VarRef<__goscript_rpcproto_pb.Packet_CallStart> | null = $.typeAssert<__goscript_rpcproto_pb.Packet_CallStart | $.VarRef<__goscript_rpcproto_pb.Packet_CallStart> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallStart" }).value
						return await ServerRPC.prototype.HandleCallStart.call(r, $.pointerValue<__goscript_rpcproto_pb.Packet_CallStart>(b).CallStart)
					}
					break
				case $.typeAssert<__goscript_rpcproto_pb.Packet_CallData | $.VarRef<__goscript_rpcproto_pb.Packet_CallData> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallData" }).ok:
					{
						let b: __goscript_rpcproto_pb.Packet_CallData | $.VarRef<__goscript_rpcproto_pb.Packet_CallData> | null = $.typeAssert<__goscript_rpcproto_pb.Packet_CallData | $.VarRef<__goscript_rpcproto_pb.Packet_CallData> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallData" }).value
						return await $.pointerValue<ServerRPC>(r).commonRPC.HandleCallData($.pointerValue<__goscript_rpcproto_pb.Packet_CallData>(b).CallData)
					}
					break
				case $.typeAssert<__goscript_rpcproto_pb.Packet_CallCancel | $.VarRef<__goscript_rpcproto_pb.Packet_CallCancel> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallCancel" }).ok:
					{
						let b: __goscript_rpcproto_pb.Packet_CallCancel | $.VarRef<__goscript_rpcproto_pb.Packet_CallCancel> | null = $.typeAssert<__goscript_rpcproto_pb.Packet_CallCancel | $.VarRef<__goscript_rpcproto_pb.Packet_CallCancel> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallCancel" }).value
						if ($.pointerValue<__goscript_rpcproto_pb.Packet_CallCancel>(b).CallCancel) {
							return await $.pointerValue<ServerRPC>(r).commonRPC.HandleCallCancel()
						}
						return null
					}
					break
				default:
					{
						let b: any = __goscriptTypeSwitchValue
						return null
					}
					break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async HandlePacketData(data: $.Slice<number>): globalThis.Promise<$.GoError> {
		const r: ServerRPC | $.VarRef<ServerRPC> | null = this
		let msg: __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null = new __goscript_rpcproto_pb.Packet()
		{
			let err = __goscript_rpcproto_pb.Packet.prototype.UnmarshalVT.call(msg, data)
			if (err != null) {
				return err
			}
		}
		return await ServerRPC.prototype.HandlePacket.call(r, msg)
	}

	public async invokeRPC(serviceID: string, methodID: string): globalThis.Promise<void> {
		const r: ServerRPC | $.VarRef<ServerRPC> | null = this
		// on the server side, the writer is closed by invokeRPC.
		let strm: __goscript_msg_stream.MsgStream | $.VarRef<__goscript_msg_stream.MsgStream> | null = await __goscript_msg_stream.NewMsgStream($.pointerValue<ServerRPC>(r).commonRPC.ctx, $.interfaceValue<__goscript_msg_stream.MsgStreamRw | null>(r, "*srpc.ServerRPC"), $.pointerValue<ServerRPC>(r).commonRPC.ctxCancel)
		let [ok, err] = await $.pointerValue<Exclude<__goscript_invoker.Invoker, null>>($.pointerValue<ServerRPC>(r).invoker).InvokeMethod(serviceID, methodID, $.interfaceValue<__goscript_stream.Stream | null>(strm, "*srpc.MsgStream"))
		if ((err == null) && !ok) {
			err = __goscript_errors.ErrUnimplemented
		}
		let outPkt: __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null = await __goscript_packet.NewCallDataPacket(null, false, true, err)
		await $.pointerValue<Exclude<__goscript_writer.PacketWriter, null>>($.pointerValue<ServerRPC>(r).commonRPC.writer).WritePacket(outPkt)
		await $.pointerValue<Exclude<__goscript_writer.PacketWriter, null>>($.pointerValue<ServerRPC>(r).commonRPC.writer).Close()
		await $.pointerValue<ServerRPC>(r).commonRPC.ctxCancel!()
	}

	public Context(): any {
		return $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).Context()
	}

	public async HandleCallCancel(): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).HandleCallCancel()
	}

	public async HandleCallData(pkt: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).HandleCallData(pkt)
	}

	public async HandleStreamClose(closeErr: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).HandleStreamClose(closeErr)
	}

	public async ReadOne(): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).ReadOne()
	}

	public async Wait(ctx: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).Wait(ctx)
	}

	public async WriteCallCancel(): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).WriteCallCancel()
	}

	public async WriteCallData(data: any, dataIsZero: any, complete: any, err: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).WriteCallData(data, dataIsZero, complete, err)
	}

	public async closeLocked(locked: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).closeLocked(locked)
	}

	public closeWriterLocked(): any {
		return $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).closeWriterLocked()
	}

	static __typeInfo = $.registerStructType(
		"srpc.ServerRPC",
		() => new ServerRPC(),
		[{ name: "HandleCallStart", args: [], returns: [] }, { name: "HandlePacket", args: [], returns: [] }, { name: "HandlePacketData", args: [], returns: [] }, { name: "invokeRPC", args: [], returns: [] }, { name: "Context", args: [], returns: [] }, { name: "HandleCallCancel", args: [], returns: [] }, { name: "HandleCallData", args: [], returns: [] }, { name: "HandleStreamClose", args: [], returns: [] }, { name: "ReadOne", args: [], returns: [] }, { name: "Wait", args: [], returns: [] }, { name: "WriteCallCancel", args: [], returns: [] }, { name: "WriteCallData", args: [], returns: [] }, { name: "closeLocked", args: [], returns: [] }, { name: "closeWriterLocked", args: [], returns: [] }],
		ServerRPC,
		[{ name: "commonRPC", key: "commonRPC", type: "srpc.commonRPC", pkgPath: "github.com/aperturerobotics/starpc/srpc", anonymous: true, index: [0], offset: 0, exported: false }, { name: "invoker", key: "invoker", type: "srpc.Invoker", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 152, exported: false }]
	)
}

export function NewServerRPC(ctx: context.Context | null, invoker: __goscript_invoker.Invoker | null, writer: __goscript_writer.PacketWriter | null): ServerRPC | $.VarRef<ServerRPC> | null {
	let rpc: ServerRPC | $.VarRef<ServerRPC> | null = new ServerRPC({invoker: invoker})
	__goscript_common_rpc.initCommonRPC(ctx, $.pointerValue<ServerRPC>(rpc)._fields.commonRPC)
	$.pointerValue<ServerRPC>(rpc).commonRPC.writer = writer
	return rpc
}

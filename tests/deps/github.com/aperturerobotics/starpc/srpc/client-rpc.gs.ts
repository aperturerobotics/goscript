// Generated file based on client-rpc.go
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

import * as __goscript_packet from "./packet.gs.ts"

import * as __goscript_rpcproto_pb from "./rpcproto.pb.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/context/index.js"
import "@goscript/github.com/pkg/errors/index.js"
import "@goscript/github.com/aperturerobotics/util/broadcast/index.js"
import "@goscript/sync/atomic/index.js"
import "./common-rpc.gs.ts"
import "./errors.gs.ts"
import "./packet.gs.ts"
import "./rpcproto.pb.gs.ts"
import "./writer.gs.ts"

export class ClientRPC {
	public get commonRPC(): __goscript_common_rpc.commonRPC {
		return this._fields.commonRPC.value
	}
	public set commonRPC(value: __goscript_common_rpc.commonRPC) {
		this._fields.commonRPC.value = value
	}

	public _fields: {
		commonRPC: $.VarRef<__goscript_common_rpc.commonRPC>
	}

	constructor(init?: Partial<{commonRPC?: __goscript_common_rpc.commonRPC}>) {
		this._fields = {
			commonRPC: $.varRef(init?.commonRPC ? $.markAsStructValue($.cloneStructValue(init.commonRPC)) : $.markAsStructValue(new __goscript_common_rpc.commonRPC()))
		}
	}

	public clone(): ClientRPC {
		const cloned = new ClientRPC()
		cloned._fields = {
			commonRPC: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.commonRPC.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<void> {
		const r: ClientRPC | $.VarRef<ClientRPC> | null = this
		let locked = $.varRef($.markAsStructValue($.cloneStructValue(await $.pointerValue<ClientRPC>(r).commonRPC.bcast.Lock())))
		let writer: __goscript_writer.PacketWriter | null = null as __goscript_writer.PacketWriter | null
		// call did not start yet if writer is nil.
		if ($.pointerValue<ClientRPC>(r).commonRPC.writer != null) {
			await $.pointerValue<ClientRPC>(r).commonRPC.WriteCallCancel()
			writer = await $.pointerValue<ClientRPC>(r).commonRPC.closeLocked(locked)
		}
		locked.value.Unlock()
		if (writer != null) {
			await $.pointerValue<Exclude<__goscript_writer.PacketWriter, null>>(writer).Close()
		}
	}

	public HandleCallStart(pkt: __goscript_rpcproto_pb.CallStart | $.VarRef<__goscript_rpcproto_pb.CallStart> | null): $.GoError {
		const r: ClientRPC | $.VarRef<ClientRPC> | null = this
		// server-to-client calls not supported
		return errors.Wrap($.pointerValueOrNil(__goscript_errors.ErrUnrecognizedPacket)!, "call start packet unexpected")
	}

	public async HandlePacket(msg: __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null): globalThis.Promise<$.GoError> {
		const r: ClientRPC | $.VarRef<ClientRPC> | null = this
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
						return ClientRPC.prototype.HandleCallStart.call(r, $.pointerValue<__goscript_rpcproto_pb.Packet_CallStart>(b).CallStart)
					}
					break
				case $.typeAssert<__goscript_rpcproto_pb.Packet_CallData | $.VarRef<__goscript_rpcproto_pb.Packet_CallData> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallData" }).ok:
					{
						let b: __goscript_rpcproto_pb.Packet_CallData | $.VarRef<__goscript_rpcproto_pb.Packet_CallData> | null = $.typeAssert<__goscript_rpcproto_pb.Packet_CallData | $.VarRef<__goscript_rpcproto_pb.Packet_CallData> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallData" }).value
						return await $.pointerValue<ClientRPC>(r).commonRPC.HandleCallData($.pointerValue<__goscript_rpcproto_pb.Packet_CallData>(b).CallData)
					}
					break
				case $.typeAssert<__goscript_rpcproto_pb.Packet_CallCancel | $.VarRef<__goscript_rpcproto_pb.Packet_CallCancel> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallCancel" }).ok:
					{
						let b: __goscript_rpcproto_pb.Packet_CallCancel | $.VarRef<__goscript_rpcproto_pb.Packet_CallCancel> | null = $.typeAssert<__goscript_rpcproto_pb.Packet_CallCancel | $.VarRef<__goscript_rpcproto_pb.Packet_CallCancel> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallCancel" }).value
						if ($.pointerValue<__goscript_rpcproto_pb.Packet_CallCancel>(b).CallCancel) {
							return await $.pointerValue<ClientRPC>(r).commonRPC.HandleCallCancel()
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
		const r: ClientRPC | $.VarRef<ClientRPC> | null = this
		let pkt: __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null = new __goscript_rpcproto_pb.Packet()
		{
			let err = __goscript_rpcproto_pb.Packet.prototype.UnmarshalVT.call(pkt, data)
			if (err != null) {
				return err
			}
		}
		return await ClientRPC.prototype.HandlePacket.call(r, pkt)
	}

	public async HandleStreamClose(closeErr: $.GoError): globalThis.Promise<void> {
		let r: ClientRPC | $.VarRef<ClientRPC> | null = this
		let locked = $.varRef($.markAsStructValue($.cloneStructValue(await $.pointerValue<ClientRPC>(r).commonRPC.bcast.Lock())))
		if ((closeErr != null) && ($.pointerValue<ClientRPC>(r).commonRPC.remoteErr == null)) {
			$.pointerValue<ClientRPC>(r).commonRPC.remoteErr = closeErr
		}
		$.pointerValue<ClientRPC>(r).commonRPC.dataClosed = true
		await $.pointerValue<ClientRPC>(r).commonRPC.cancelContext()
		await locked.value.Broadcast()
		locked.value.Unlock()
	}

	public async Start(writer: __goscript_writer.PacketWriter | null, writeFirstMsg: boolean, firstMsg: $.Slice<number>): globalThis.Promise<$.GoError> {
		let r: ClientRPC | $.VarRef<ClientRPC> | null = this
		if (writer == null) {
			return __goscript_errors.ErrNilWriter
		}

		{
			let err = await $.pointerValue<Exclude<context.Context, null>>($.pointerValue<ClientRPC>(r).commonRPC.ctx).Err()
			if (err != null) {
				await $.pointerValue<ClientRPC>(r).commonRPC.cancelContext()
				await $.pointerValue<Exclude<__goscript_writer.PacketWriter, null>>(writer).Close()
				return context.Canceled
			}
		}

		let firstMsgEmpty: boolean = false
		let err: $.GoError = null as $.GoError
		let locked = $.varRef($.markAsStructValue($.cloneStructValue(await $.pointerValue<ClientRPC>(r).commonRPC.bcast.Lock())))
		$.pointerValue<ClientRPC>(r).commonRPC.writer = writer

		if (writeFirstMsg) {
			firstMsgEmpty = $.len(firstMsg) == 0
		}

		let pkt: __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null = __goscript_packet.NewCallStartPacket($.pointerValue<ClientRPC>(r).commonRPC.service, $.pointerValue<ClientRPC>(r).commonRPC.method, firstMsg, firstMsgEmpty)
		err = await $.pointerValue<Exclude<__goscript_writer.PacketWriter, null>>(writer).WritePacket(pkt)
		if (err != null) {
			await $.pointerValue<ClientRPC>(r).commonRPC.cancelContext()
			await $.pointerValue<Exclude<__goscript_writer.PacketWriter, null>>(writer).Close()
		}

		await locked.value.Broadcast()
		locked.value.Unlock()

		return err
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

	public async beginLocalCompletion(): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).beginLocalCompletion()
	}

	public async cancelContext(): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).cancelContext()
	}

	public async closeLocked(locked: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).closeLocked(locked)
	}

	public closeWriterLocked(): any {
		return $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).closeWriterLocked()
	}

	public async finishLocalCompletion(): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_common_rpc.commonRPC>(this.commonRPC).finishLocalCompletion()
	}

	static __typeInfo = $.registerStructType(
		"srpc.ClientRPC",
		() => new ClientRPC(),
		[{ name: "Close", args: [], returns: [] }, { name: "HandleCallStart", args: [{ name: "pkt", type: { kind: $.TypeKind.Pointer, elemType: "srpc.CallStart" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "HandlePacket", args: [{ name: "msg", type: { kind: $.TypeKind.Pointer, elemType: "srpc.Packet" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "HandlePacketData", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "HandleStreamClose", args: [{ name: "closeErr", type: "error" }], returns: [] }, { name: "Start", args: [{ name: "writer", type: "srpc.PacketWriter" }, { name: "writeFirstMsg", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "firstMsg", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "HandleCallCancel", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "HandleCallData", args: [{ name: "pkt", type: { kind: $.TypeKind.Pointer, elemType: "srpc.CallData" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "ReadOne", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Wait", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: "error" }] }, { name: "WriteCallCancel", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "WriteCallData", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "dataIsZero", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "complete", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "err", type: "error" }], returns: [{ name: "_r0", type: "error" }] }, { name: "beginLocalCompletion", args: [], returns: [] }, { name: "cancelContext", args: [], returns: [] }, { name: "closeLocked", args: [{ name: "locked", type: { kind: $.TypeKind.Pointer, elemType: "broadcast.Locked" } }], returns: [{ name: "_r0", type: "srpc.PacketWriter" }] }, { name: "closeWriterLocked", args: [], returns: [{ name: "_r0", type: "srpc.PacketWriter" }] }, { name: "finishLocalCompletion", args: [], returns: [] }],
		ClientRPC,
		[{ name: "commonRPC", key: "commonRPC", type: "srpc.commonRPC", pkgPath: "github.com/aperturerobotics/starpc/srpc", anonymous: true, index: [0], offset: 0, exported: false }]
	)
}

export function NewClientRPC(ctx: context.Context | null, service: string, method: string): ClientRPC | $.VarRef<ClientRPC> | null {
	let rpc: ClientRPC | $.VarRef<ClientRPC> | null = new ClientRPC()
	__goscript_common_rpc.initCommonRPC(ctx, $.pointerValue<ClientRPC>(rpc)._fields.commonRPC)
	$.pointerValue<ClientRPC>(rpc).commonRPC.service = service
	$.pointerValue<ClientRPC>(rpc).commonRPC.method = method
	return rpc
}

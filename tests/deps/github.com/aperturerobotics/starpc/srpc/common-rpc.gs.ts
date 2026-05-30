// Generated file based on common-rpc.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as broadcast from "@goscript/github.com/aperturerobotics/util/broadcast/index.js"

import * as errors from "@goscript/github.com/pkg/errors/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as __goscript_errors from "./errors.gs.ts"

import * as __goscript_packet from "./packet.gs.ts"

import * as __goscript_rpcproto_pb from "./rpcproto.pb.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/github.com/aperturerobotics/util/broadcast/index.js"
import "@goscript/github.com/pkg/errors/index.js"
import "./errors.gs.ts"
import "./packet.gs.ts"
import "./rpcproto.pb.gs.ts"
import "./writer.gs.ts"

export class commonRPC {
	// ctx is the context, canceled when the rpc ends.
	public get ctx(): context.Context | null {
		return this._fields.ctx.value
	}
	public set ctx(value: context.Context | null) {
		this._fields.ctx.value = value
	}

	// ctxCancel is called when the rpc ends.
	public get ctxCancel(): (() => void) | null {
		return this._fields.ctxCancel.value
	}
	public set ctxCancel(value: (() => void) | null) {
		this._fields.ctxCancel.value = value
	}

	// service is the rpc service
	public get service(): string {
		return this._fields.service.value
	}
	public set service(value: string) {
		this._fields.service.value = value
	}

	// method is the rpc method
	public get method(): string {
		return this._fields.method.value
	}
	public set method(value: string) {
		this._fields.method.value = value
	}

	// localCompleted tracks if we have sent a completion or cancel locally.
	// note: not guarded by bcast
	public get localCompleted(): atomic.Bool {
		return this._fields.localCompleted.value
	}
	public set localCompleted(value: atomic.Bool) {
		this._fields.localCompleted.value = value
	}

	// bcast guards below fields
	public get bcast(): broadcast.Broadcast {
		return this._fields.bcast.value
	}
	public set bcast(value: broadcast.Broadcast) {
		this._fields.bcast.value = value
	}

	// writer is the writer to write messages to
	public get writer(): __goscript_writer.PacketWriter | null {
		return this._fields.writer.value
	}
	public set writer(value: __goscript_writer.PacketWriter | null) {
		this._fields.writer.value = value
	}

	// writerClosed is set after writer has been closed locally.
	public get writerClosed(): boolean {
		return this._fields.writerClosed.value
	}
	public set writerClosed(value: boolean) {
		this._fields.writerClosed.value = value
	}

	// dataQueue contains incoming data packets.
	// note: packets may be len() == 0
	public get dataQueue(): $.Slice<$.Slice<number>> {
		return this._fields.dataQueue.value
	}
	public set dataQueue(value: $.Slice<$.Slice<number>>) {
		this._fields.dataQueue.value = value
	}

	// dataClosed is a flag set after dataQueue is closed.
	// controlled by HandlePacket.
	public get dataClosed(): boolean {
		return this._fields.dataClosed.value
	}
	public set dataClosed(value: boolean) {
		this._fields.dataClosed.value = value
	}

	// remoteErr is an error set by the remote.
	public get remoteErr(): $.GoError {
		return this._fields.remoteErr.value
	}
	public set remoteErr(value: $.GoError) {
		this._fields.remoteErr.value = value
	}

	public _fields: {
		ctx: $.VarRef<context.Context | null>
		ctxCancel: $.VarRef<(() => void) | null>
		service: $.VarRef<string>
		method: $.VarRef<string>
		localCompleted: $.VarRef<atomic.Bool>
		bcast: $.VarRef<broadcast.Broadcast>
		writer: $.VarRef<__goscript_writer.PacketWriter | null>
		writerClosed: $.VarRef<boolean>
		dataQueue: $.VarRef<$.Slice<$.Slice<number>>>
		dataClosed: $.VarRef<boolean>
		remoteErr: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{ctx?: context.Context | null, ctxCancel?: (() => void) | null, service?: string, method?: string, localCompleted?: atomic.Bool, bcast?: broadcast.Broadcast, writer?: __goscript_writer.PacketWriter | null, writerClosed?: boolean, dataQueue?: $.Slice<$.Slice<number>>, dataClosed?: boolean, remoteErr?: $.GoError}>) {
		this._fields = {
			ctx: $.varRef(init?.ctx ?? null),
			ctxCancel: $.varRef(init?.ctxCancel ?? null),
			service: $.varRef(init?.service ?? ""),
			method: $.varRef(init?.method ?? ""),
			localCompleted: $.varRef(init?.localCompleted ? $.markAsStructValue($.cloneStructValue(init.localCompleted)) : $.markAsStructValue(new atomic.Bool())),
			bcast: $.varRef(init?.bcast ? $.markAsStructValue($.cloneStructValue(init.bcast)) : $.markAsStructValue(new broadcast.Broadcast())),
			writer: $.varRef(init?.writer ?? null),
			writerClosed: $.varRef(init?.writerClosed ?? false),
			dataQueue: $.varRef(init?.dataQueue ?? null),
			dataClosed: $.varRef(init?.dataClosed ?? false),
			remoteErr: $.varRef(init?.remoteErr ?? null)
		}
	}

	public clone(): commonRPC {
		const cloned = new commonRPC()
		cloned._fields = {
			ctx: $.varRef(this._fields.ctx.value),
			ctxCancel: $.varRef(this._fields.ctxCancel.value),
			service: $.varRef(this._fields.service.value),
			method: $.varRef(this._fields.method.value),
			localCompleted: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.localCompleted.value))),
			bcast: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.bcast.value))),
			writer: $.varRef(this._fields.writer.value),
			writerClosed: $.varRef(this._fields.writerClosed.value),
			dataQueue: $.varRef(this._fields.dataQueue.value),
			dataClosed: $.varRef(this._fields.dataClosed.value),
			remoteErr: $.varRef(this._fields.remoteErr.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Context(): context.Context | null {
		const c: commonRPC | $.VarRef<commonRPC> | null = this
		return $.pointerValue<commonRPC>(c).ctx
	}

	public async HandleCallCancel(): globalThis.Promise<$.GoError> {
		const c: commonRPC | $.VarRef<commonRPC> | null = this
		await commonRPC.prototype.HandleStreamClose.call(c, context.Canceled)
		return null
	}

	public async HandleCallData(pkt: __goscript_rpcproto_pb.CallData | $.VarRef<__goscript_rpcproto_pb.CallData> | null): globalThis.Promise<$.GoError> {
		let c: commonRPC | $.VarRef<commonRPC> | null = this
		let err: $.GoError = null as $.GoError
		let locked = $.varRef($.markAsStructValue($.cloneStructValue(await $.pointerValue<commonRPC>(c).bcast.Lock())))
		if ($.pointerValue<commonRPC>(c).dataClosed) {
			// If the packet is just indicating the call is complete, ignore it.
			if (!__goscript_rpcproto_pb.CallData.prototype.GetComplete.call(pkt)) {
				// Otherwise, return ErrCompleted (unexpected packet).
				err = __goscript_errors.ErrCompleted
			}
			locked.value.Unlock()
			return err
		}

		{
			let data: $.Slice<number> = __goscript_rpcproto_pb.CallData.prototype.GetData.call(pkt)
			if (($.len(data) != 0) || __goscript_rpcproto_pb.CallData.prototype.GetDataIsZero.call(pkt)) {
				$.pointerValue<commonRPC>(c).dataQueue = $.append($.pointerValue<commonRPC>(c).dataQueue, data)
			}
		}

		let complete = __goscript_rpcproto_pb.CallData.prototype.GetComplete.call(pkt)
		{
			let pktErr = __goscript_rpcproto_pb.CallData.prototype.GetError.call(pkt)
			if ($.len(pktErr) != 0) {
				complete = true
				$.pointerValue<commonRPC>(c).remoteErr = errors.New(pktErr)
			}
		}

		if (complete) {
			$.pointerValue<commonRPC>(c).dataClosed = true
		}

		await locked.value.Broadcast()
		locked.value.Unlock()

		return err
	}

	public async HandleStreamClose(closeErr: $.GoError): globalThis.Promise<void> {
		let c: commonRPC | $.VarRef<commonRPC> | null = this
		let writer: __goscript_writer.PacketWriter | null = null as __goscript_writer.PacketWriter | null
		let locked = $.varRef($.markAsStructValue($.cloneStructValue(await $.pointerValue<commonRPC>(c).bcast.Lock())))
		if ($.pointerValue<commonRPC>(c).dataClosed && $.pointerValue<commonRPC>(c).writerClosed) {
			locked.value.Unlock()
			return
		}
		if ((closeErr != null) && ($.pointerValue<commonRPC>(c).remoteErr == null)) {
			$.pointerValue<commonRPC>(c).remoteErr = closeErr
		}
		$.pointerValue<commonRPC>(c).dataClosed = true
		await $.pointerValue<commonRPC>(c).ctxCancel!()
		writer = commonRPC.prototype.closeWriterLocked.call(c)
		await locked.value.Broadcast()
		locked.value.Unlock()
		if (writer != null) {
			await $.pointerValue<Exclude<__goscript_writer.PacketWriter, null>>(writer).Close()
		}
	}

	public async ReadOne(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		let c: commonRPC | $.VarRef<commonRPC> | null = this
		let ctxDone: boolean = false
		while (true) {
			let waitCh: $.Channel<{}> | null = null as $.Channel<{}> | null
			let locked = $.varRef($.markAsStructValue($.cloneStructValue(await $.pointerValue<commonRPC>(c).bcast.Lock())))
			if (ctxDone && !$.pointerValue<commonRPC>(c).dataClosed) {
				// context must have been canceled locally
				let writer = await commonRPC.prototype.closeLocked.call(c, locked)
				locked.value.Unlock()
				if (writer != null) {
					await $.pointerValue<Exclude<__goscript_writer.PacketWriter, null>>(writer).Close()
				}
				return [null, context.Canceled]
			}

			if ($.len($.pointerValue<commonRPC>(c).dataQueue) != 0) {
				let msg: $.Slice<number> = $.pointerValue<commonRPC>(c).dataQueue![0]
				$.pointerValue<commonRPC>(c).dataQueue![0] = null
				$.pointerValue<commonRPC>(c).dataQueue = $.goSlice($.pointerValue<commonRPC>(c).dataQueue, 1, undefined)
				locked.value.Unlock()
				return [msg, null]
			}

			if ($.pointerValue<commonRPC>(c).dataClosed || ($.pointerValue<commonRPC>(c).remoteErr != null)) {
				let err = $.pointerValue<commonRPC>(c).remoteErr
				if (err == null) {
					err = io.EOF
				}
				locked.value.Unlock()
				return [null, err]
			}

			waitCh = locked.value.WaitCh()
			locked.value.Unlock()

			const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, [$.Slice<number>, $.GoError]>([
				{
					id: 0,
					isSend: false,
					channel: $.pointerValue<Exclude<context.Context, null>>($.pointerValue<commonRPC>(c).ctx).Done(),
					onSelected: async (__goscriptSelect0Result) => {
						ctxDone = true
					}
				},
				{
					id: 1,
					isSend: false,
					channel: waitCh,
					onSelected: async (__goscriptSelect0Result) => {
					}
				}
			], false)
			if (__goscriptSelect0HasReturn) {
				return __goscriptSelect0Value
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Wait(ctx: context.Context | null): globalThis.Promise<$.GoError> {
		const c: commonRPC | $.VarRef<commonRPC> | null = this
		while (true) {
			let err: $.GoError = null as $.GoError
			let waitCh: $.Channel<{}> | null = null as $.Channel<{}> | null
			let rpcCtx: context.Context | null = null as context.Context | null
			let locked = $.varRef($.markAsStructValue($.cloneStructValue(await $.pointerValue<commonRPC>(c).bcast.Lock())))
			let __goscriptAssign0_0: context.Context | null = $.pointerValue<commonRPC>(c).ctx
			let __goscriptAssign0_1: $.GoError = $.pointerValue<commonRPC>(c).remoteErr
			rpcCtx = __goscriptAssign0_0
			err = __goscriptAssign0_1
			if ((err == null) && ($.pointerValue<Exclude<context.Context, null>>(rpcCtx).Err() == null)) {
				waitCh = locked.value.WaitCh()
			}
			locked.value.Unlock()

			if (err != null) {
				return err
			}
			if ($.pointerValue<Exclude<context.Context, null>>(rpcCtx).Err() != null) {
				// rpc must have ended w/o an error being set
				return context.Canceled
			}

			const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, $.GoError>([
				{
					id: 0,
					isSend: false,
					channel: $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
					onSelected: async (__goscriptSelect1Result) => {
						return context.Canceled
					}
				},
				{
					id: 1,
					isSend: false,
					channel: $.pointerValue<Exclude<context.Context, null>>(rpcCtx).Done(),
					onSelected: async (__goscriptSelect1Result) => {
					}
				},
				{
					id: 2,
					isSend: false,
					channel: waitCh,
					onSelected: async (__goscriptSelect1Result) => {
					}
				}
			], false)
			if (__goscriptSelect1HasReturn) {
				return __goscriptSelect1Value
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async WriteCallCancel(): globalThis.Promise<$.GoError> {
		const c: commonRPC | $.VarRef<commonRPC> | null = this
		// Use atomic swap to check and set completion atomically
		if ($.pointerValue<commonRPC>(c).localCompleted.Swap(true)) {
			return __goscript_errors.ErrCompleted
		}

		return await $.pointerValue<Exclude<__goscript_writer.PacketWriter, null>>($.pointerValue<commonRPC>(c).writer).WritePacket(__goscript_packet.NewCallCancelPacket())
	}

	public async WriteCallData(data: $.Slice<number>, dataIsZero: boolean, complete: boolean, err: $.GoError): globalThis.Promise<$.GoError> {
		const c: commonRPC | $.VarRef<commonRPC> | null = this
		// Check if already completed
		if ($.pointerValue<commonRPC>(c).localCompleted.Load()) {
			// If we're just marking completion and already completed, allow it (no-op)
			if ((complete && ($.len(data) == 0)) && !dataIsZero) {
				return null
			}
			// Otherwise, return error for trying to send data after completion
			return __goscript_errors.ErrCompleted
		}

		// Mark as completed if this call completes the RPC
		if (complete || (err != null)) {
			$.pointerValue<commonRPC>(c).localCompleted.Store(true)
		}

		let outPkt: __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null = await __goscript_packet.NewCallDataPacket(data, ($.len(data) == 0) && dataIsZero, complete, err)
		return await $.pointerValue<Exclude<__goscript_writer.PacketWriter, null>>($.pointerValue<commonRPC>(c).writer).WritePacket(outPkt)
	}

	public async closeLocked(locked: broadcast.Locked | $.VarRef<broadcast.Locked> | null): globalThis.Promise<__goscript_writer.PacketWriter | null> {
		let c: commonRPC | $.VarRef<commonRPC> | null = this
		$.pointerValue<commonRPC>(c).dataClosed = true
		$.pointerValue<commonRPC>(c).localCompleted.Store(true)
		if ($.pointerValue<commonRPC>(c).remoteErr == null) {
			$.pointerValue<commonRPC>(c).remoteErr = context.Canceled
		}
		let writer = commonRPC.prototype.closeWriterLocked.call(c)
		await broadcast.Locked.prototype.Broadcast.call(locked)
		await $.pointerValue<commonRPC>(c).ctxCancel!()
		return writer
	}

	public closeWriterLocked(): __goscript_writer.PacketWriter | null {
		let c: commonRPC | $.VarRef<commonRPC> | null = this
		if ($.pointerValue<commonRPC>(c).writerClosed || ($.pointerValue<commonRPC>(c).writer == null)) {
			return null
		}
		$.pointerValue<commonRPC>(c).writerClosed = true
		return $.pointerValue<commonRPC>(c).writer
	}

	static __typeInfo = $.registerStructType(
		"srpc.commonRPC",
		() => new commonRPC(),
		[{ name: "Context", args: [], returns: [] }, { name: "HandleCallCancel", args: [], returns: [] }, { name: "HandleCallData", args: [], returns: [] }, { name: "HandleStreamClose", args: [], returns: [] }, { name: "ReadOne", args: [], returns: [] }, { name: "Wait", args: [], returns: [] }, { name: "WriteCallCancel", args: [], returns: [] }, { name: "WriteCallData", args: [], returns: [] }, { name: "closeLocked", args: [], returns: [] }, { name: "closeWriterLocked", args: [], returns: [] }],
		commonRPC,
		[{ name: "ctx", key: "ctx", type: "context.Context", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "ctxCancel", key: "ctxCancel", type: ({ kind: $.TypeKind.Function, name: "context.CancelFunc", params: [], results: [] } as $.FunctionTypeInfo), pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 16, exported: false }, { name: "service", key: "service", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [2], offset: 24, exported: false }, { name: "method", key: "method", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [3], offset: 40, exported: false }, { name: "localCompleted", key: "localCompleted", type: "atomic.Bool", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [4], offset: 56, exported: false }, { name: "bcast", key: "bcast", type: "broadcast.Broadcast", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [5], offset: 64, exported: false }, { name: "writer", key: "writer", type: "srpc.PacketWriter", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [6], offset: 80, exported: false }, { name: "writerClosed", key: "writerClosed", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [7], offset: 96, exported: false }, { name: "dataQueue", key: "dataQueue", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [8], offset: 104, exported: false }, { name: "dataClosed", key: "dataClosed", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [9], offset: 128, exported: false }, { name: "remoteErr", key: "remoteErr", type: "error", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [10], offset: 136, exported: false }]
	)
}

export function initCommonRPC(ctx: context.Context | null, rpc: commonRPC | $.VarRef<commonRPC> | null): void {
	let __goscriptTuple0: any = context.WithCancel($.pointerValueOrNil(ctx)!)
	$.pointerValue<commonRPC>(rpc).ctx = __goscriptTuple0[0]
	$.pointerValue<commonRPC>(rpc).ctxCancel = __goscriptTuple0[1]
}

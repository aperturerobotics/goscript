// Generated file based on common-rpc.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as contextutil from "@goscript/github.com/aperturerobotics/starpc/internal/contextutil/index.js"

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
import "@goscript/github.com/aperturerobotics/starpc/internal/contextutil/index.js"
import "@goscript/github.com/aperturerobotics/util/broadcast/index.js"
import "@goscript/github.com/pkg/errors/index.js"
import "./errors.gs.ts"
import "./packet.gs.ts"
import "./rpcproto.pb.gs.ts"
import "./writer.gs.ts"

export class commonRPC {
	// ctx is the RPC context, canceled when the RPC is canceled.
	public get ctx(): context.Context | null {
		return this._fields.ctx.value
	}
	public set ctx(value: context.Context | null) {
		this._fields.ctx.value = value
	}

	// ctxCancel cancels ctx.
	public get ctxCancel(): (() => void) | null {
		return this._fields.ctxCancel.value
	}
	public set ctxCancel(value: (() => void) | null) {
		this._fields.ctxCancel.value = value
	}

	// ctxCanceled tracks whether ctxCancel has already been called.
	public get ctxCanceled(): atomic.Bool {
		return this._fields.ctxCanceled.value
	}
	public set ctxCanceled(value: atomic.Bool) {
		this._fields.ctxCanceled.value = value
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

	// localCompleting is set while the local handler is publishing its terminal
	// packet and closing the writer.
	public get localCompleting(): boolean {
		return this._fields.localCompleting.value
	}
	public set localCompleting(value: boolean) {
		this._fields.localCompleting.value = value
	}

	// localDone is set after the local handler has completed normally.
	public get localDone(): boolean {
		return this._fields.localDone.value
	}
	public set localDone(value: boolean) {
		this._fields.localDone.value = value
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
		ctxCanceled: $.VarRef<atomic.Bool>
		service: $.VarRef<string>
		method: $.VarRef<string>
		localCompleted: $.VarRef<atomic.Bool>
		bcast: $.VarRef<broadcast.Broadcast>
		writer: $.VarRef<__goscript_writer.PacketWriter | null>
		writerClosed: $.VarRef<boolean>
		localCompleting: $.VarRef<boolean>
		localDone: $.VarRef<boolean>
		dataQueue: $.VarRef<$.Slice<$.Slice<number>>>
		dataClosed: $.VarRef<boolean>
		remoteErr: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{ctx?: context.Context | null, ctxCancel?: (() => void) | null, ctxCanceled?: atomic.Bool, service?: string, method?: string, localCompleted?: atomic.Bool, bcast?: broadcast.Broadcast, writer?: __goscript_writer.PacketWriter | null, writerClosed?: boolean, localCompleting?: boolean, localDone?: boolean, dataQueue?: $.Slice<$.Slice<number>>, dataClosed?: boolean, remoteErr?: $.GoError}>) {
		this._fields = {
			ctx: $.varRef(init?.ctx ?? (null as unknown as context.Context | null)),
			ctxCancel: $.varRef(init?.ctxCancel ?? (null as unknown as (() => void) | null)),
			ctxCanceled: $.varRef(init?.ctxCanceled ? $.markAsStructValue($.cloneStructValue(init.ctxCanceled)) : $.markAsStructValue(new atomic.Bool())),
			service: $.varRef(init?.service ?? ("" as unknown as string)),
			method: $.varRef(init?.method ?? ("" as unknown as string)),
			localCompleted: $.varRef(init?.localCompleted ? $.markAsStructValue($.cloneStructValue(init.localCompleted)) : $.markAsStructValue(new atomic.Bool())),
			bcast: $.varRef(init?.bcast ? $.markAsStructValue($.cloneStructValue(init.bcast)) : $.markAsStructValue(new broadcast.Broadcast())),
			writer: $.varRef(init?.writer ?? (null as unknown as __goscript_writer.PacketWriter | null)),
			writerClosed: $.varRef(init?.writerClosed ?? (false as unknown as boolean)),
			localCompleting: $.varRef(init?.localCompleting ?? (false as unknown as boolean)),
			localDone: $.varRef(init?.localDone ?? (false as unknown as boolean)),
			dataQueue: $.varRef(init?.dataQueue ?? (null as unknown as $.Slice<$.Slice<number>>)),
			dataClosed: $.varRef(init?.dataClosed ?? (false as unknown as boolean)),
			remoteErr: $.varRef(init?.remoteErr ?? (null as unknown as $.GoError))
		}
	}

	public clone(): commonRPC {
		const cloned = new commonRPC()
		cloned._fields = {
			ctx: $.varRef(this._fields.ctx.value),
			ctxCancel: $.varRef(this._fields.ctxCancel.value),
			ctxCanceled: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.ctxCanceled.value))),
			service: $.varRef(this._fields.service.value),
			method: $.varRef(this._fields.method.value),
			localCompleted: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.localCompleted.value))),
			bcast: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.bcast.value))),
			writer: $.varRef(this._fields.writer.value),
			writerClosed: $.varRef(this._fields.writerClosed.value),
			localCompleting: $.varRef(this._fields.localCompleting.value),
			localDone: $.varRef(this._fields.localDone.value),
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
		let normalRemoteCloseAfterLocalComplete = (closeErr == null) && ($.pointerValue<commonRPC>(c).localCompleting || $.pointerValue<commonRPC>(c).localDone)
		if ((closeErr != null) && ($.pointerValue<commonRPC>(c).remoteErr == null)) {
			$.pointerValue<commonRPC>(c).remoteErr = closeErr
		}
		$.pointerValue<commonRPC>(c).dataClosed = true
		if (!normalRemoteCloseAfterLocalComplete) {
			await commonRPC.prototype.cancelContext.call(c)
			writer = commonRPC.prototype.closeWriterLocked.call(c)
		}
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
					channel: await $.pointerValue<Exclude<context.Context, null>>($.pointerValue<commonRPC>(c).ctx).Done(),
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
			let rpcCanceled: boolean = false
			let localDone: boolean = false
			let locked = $.varRef($.markAsStructValue($.cloneStructValue(await $.pointerValue<commonRPC>(c).bcast.Lock())))
			err = $.pointerValue<commonRPC>(c).remoteErr
			rpcCanceled = await $.pointerValue<Exclude<context.Context, null>>($.pointerValue<commonRPC>(c).ctx).Err() != null
			localDone = $.pointerValue<commonRPC>(c).localDone
			if (((err == null) && !rpcCanceled) && !localDone) {
				waitCh = locked.value.WaitCh()
			}
			locked.value.Unlock()

			if (err != null) {
				return err
			}
			if (localDone) {
				return null
			}
			if (rpcCanceled) {
				return context.Canceled
			}

			const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, $.GoError>([
				{
					id: 0,
					isSend: false,
					channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
					onSelected: async (__goscriptSelect1Result) => {
						return context.Canceled
					}
				},
				{
					id: 1,
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

		let outPkt: __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null = __goscript_packet.NewCallDataPacket(data, ($.len(data) == 0) && dataIsZero, complete, err)
		return await $.pointerValue<Exclude<__goscript_writer.PacketWriter, null>>($.pointerValue<commonRPC>(c).writer).WritePacket(outPkt)
	}

	public async beginLocalCompletion(): globalThis.Promise<void> {
		let c: commonRPC | $.VarRef<commonRPC> | null = this
		let locked = $.varRef($.markAsStructValue($.cloneStructValue(await $.pointerValue<commonRPC>(c).bcast.Lock())))
		$.pointerValue<commonRPC>(c).localCompleted.Store(true)
		$.pointerValue<commonRPC>(c).localCompleting = true
		locked.value.Unlock()
	}

	public async cancelContext(): globalThis.Promise<void> {
		const c: commonRPC | $.VarRef<commonRPC> | null = this
		if ($.pointerValue<commonRPC>(c).ctxCanceled.Swap(true)) {
			return
		}
		await $.pointerValue<commonRPC>(c).ctxCancel!()
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
		await commonRPC.prototype.cancelContext.call(c)
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

	public async finishLocalCompletion(): globalThis.Promise<void> {
		let c: commonRPC | $.VarRef<commonRPC> | null = this
		let locked = $.varRef($.markAsStructValue($.cloneStructValue(await $.pointerValue<commonRPC>(c).bcast.Lock())))
		$.pointerValue<commonRPC>(c).localCompleted.Store(true)
		let writer = commonRPC.prototype.closeWriterLocked.call(c)
		locked.value.Unlock()
		if (writer != null) {
			await $.pointerValue<Exclude<__goscript_writer.PacketWriter, null>>(writer).Close()
		}
		locked.value = $.markAsStructValue($.cloneStructValue(await $.pointerValue<commonRPC>(c).bcast.Lock()))
		$.pointerValue<commonRPC>(c).localCompleting = false
		$.pointerValue<commonRPC>(c).localDone = true
		await locked.value.Broadcast()
		locked.value.Unlock()
	}

	static __typeInfo = $.registerStructType(
		"srpc.commonRPC",
		() => new commonRPC(),
		[{ name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "HandleCallCancel", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "HandleCallData", args: [{ name: "pkt", type: { kind: $.TypeKind.Pointer, elemType: "srpc.CallData" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "HandleStreamClose", args: [{ name: "closeErr", type: "error" }], returns: [] }, { name: "ReadOne", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Wait", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: "error" }] }, { name: "WriteCallCancel", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "WriteCallData", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "dataIsZero", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "complete", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "err", type: "error" }], returns: [{ name: "_r0", type: "error" }] }, { name: "beginLocalCompletion", args: [], returns: [] }, { name: "cancelContext", args: [], returns: [] }, { name: "closeLocked", args: [{ name: "locked", type: { kind: $.TypeKind.Pointer, elemType: "broadcast.Locked" } }], returns: [{ name: "_r0", type: "srpc.PacketWriter" }] }, { name: "closeWriterLocked", args: [], returns: [{ name: "_r0", type: "srpc.PacketWriter" }] }, { name: "finishLocalCompletion", args: [], returns: [] }],
		commonRPC,
		[{ name: "ctx", key: "ctx", type: "context.Context", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "ctxCancel", key: "ctxCancel", type: ({ kind: $.TypeKind.Function, name: "context.CancelFunc", params: [], results: [] } as $.FunctionTypeInfo), pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 16, exported: false }, { name: "ctxCanceled", key: "ctxCanceled", type: "atomic.Bool", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [2], offset: 24, exported: false }, { name: "service", key: "service", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [3], offset: 32, exported: false }, { name: "method", key: "method", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [4], offset: 48, exported: false }, { name: "localCompleted", key: "localCompleted", type: "atomic.Bool", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [5], offset: 64, exported: false }, { name: "bcast", key: "bcast", type: "broadcast.Broadcast", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [6], offset: 72, exported: false }, { name: "writer", key: "writer", type: "srpc.PacketWriter", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [7], offset: 88, exported: false }, { name: "writerClosed", key: "writerClosed", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [8], offset: 104, exported: false }, { name: "localCompleting", key: "localCompleting", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [9], offset: 105, exported: false }, { name: "localDone", key: "localDone", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [10], offset: 106, exported: false }, { name: "dataQueue", key: "dataQueue", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [11], offset: 112, exported: false }, { name: "dataClosed", key: "dataClosed", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [12], offset: 136, exported: false }, { name: "remoteErr", key: "remoteErr", type: "error", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [13], offset: 144, exported: false }]
	)
}

export function initCommonRPC(ctx: context.Context | null, rpc: commonRPC | $.VarRef<commonRPC> | null): void {
	let __goscriptTuple0: any = contextutil.WithCancel(ctx)
	$.pointerValue<commonRPC>(rpc).ctx = __goscriptTuple0[0]
	$.pointerValue<commonRPC>(rpc).ctxCancel = __goscriptTuple0[1]
}

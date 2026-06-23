// Generated file based on package_import_starpc_srpc.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"

import * as js from "@goscript/syscall/js/index.js"

import * as time from "@goscript/time/index.js"

import * as rpcstream from "@goscript/github.com/aperturerobotics/starpc/rpcstream/index.js"

import * as srpc from "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"

import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/sync/index.js"
import "@goscript/syscall/js/index.js"
import "@goscript/time/index.js"
import "@goscript/github.com/aperturerobotics/starpc/rpcstream/index.js"
import "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

export class handler {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): handler {
		const cloned = new handler()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public GetMethodIDs(): $.Slice<string> {
		return $.arrayToSlice<string>(["method", "stream", "hold", "empty"])
	}

	public GetServiceID(): string {
		return "svc"
	}

	public async InvokeMethod(serviceID: string, methodID: string, strm: srpc.Stream | null): globalThis.Promise<[boolean, $.GoError]> {
		if ($.stringEqual(methodID, "empty")) {
			return [true, await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage(null, false), "*srpc.RawMessage"))]
		}
		if (($.stringEqual(methodID, "stream")) || ($.stringEqual(methodID, "hold"))) {
			let total = 0
			while (true) {
				let msg: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
				let err = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgRecv($.interfaceValue<srpc.Message>(msg, "*srpc.RawMessage"))
				if ($.comparableEqual(err, io.EOF)) {
					break
				}
				if (err != null) {
					return [true, err]
				}
				total = total + ($.len(srpc.RawMessage.prototype.GetData.call(msg)))
			}
			return [true, await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage($.arrayToSlice<number>([$.uint($.uint(total, 8), 8)]), false), "*srpc.RawMessage"))]
		}
		if (strm == null) {
			return [true, null]
		}
		return [true, await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage(new Uint8Array([111, 107]), false), "*srpc.RawMessage"))]
	}

	static __typeInfo = $.registerStructType(
		"main.handler",
		() => new handler(),
		[{ name: "GetMethodIDs", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }] }, { name: "GetServiceID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "InvokeMethod", args: [{ name: "serviceID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "methodID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "strm", type: "srpc.Stream" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "_r1", type: "error" }] }],
		handler,
		[]
	)
}

export class embeddedStream {
	public get Stream(): srpc.Stream | null {
		return this._fields.Stream.value
	}
	public set Stream(value: srpc.Stream | null) {
		this._fields.Stream.value = value
	}

	public _fields: {
		Stream: $.VarRef<srpc.Stream | null>
	}

	constructor(init?: Partial<{Stream?: srpc.Stream | null}>) {
		this._fields = {
			Stream: $.varRef(init?.Stream ?? (null as unknown as srpc.Stream | null))
		}
	}

	public clone(): embeddedStream {
		const cloned = new embeddedStream()
		cloned._fields = {
			Stream: $.varRef(this._fields.Stream.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).Close()
	}

	public async CloseSend(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).CloseSend()
	}

	public Context(): any {
		return $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).Context()
	}

	public async MsgRecv(msg: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).MsgRecv(msg)
	}

	public async MsgSend(msg: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).MsgSend(msg)
	}

	static __typeInfo = $.registerStructType(
		"main.embeddedStream",
		() => new embeddedStream(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseSend", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "MsgRecv", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "MsgSend", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }],
		embeddedStream,
		[{ name: "Stream", key: "Stream", type: "srpc.Stream", anonymous: true, index: [0], offset: 0, exported: true }]
	)
}

export class streamOpenResult {
	public get stream(): srpc.Stream | null {
		return this._fields.stream.value
	}
	public set stream(value: srpc.Stream | null) {
		this._fields.stream.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public _fields: {
		stream: $.VarRef<srpc.Stream | null>
		err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{stream?: srpc.Stream | null, err?: $.GoError}>) {
		this._fields = {
			stream: $.varRef(init?.stream ?? (null as unknown as srpc.Stream | null)),
			err: $.varRef(init?.err ?? (null as unknown as $.GoError))
		}
	}

	public clone(): streamOpenResult {
		const cloned = new streamOpenResult()
		cloned._fields = {
			stream: $.varRef(this._fields.stream.value),
			err: $.varRef(this._fields.err.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.streamOpenResult",
		() => new streamOpenResult(),
		[],
		streamOpenResult,
		[{ name: "stream", key: "stream", type: "srpc.Stream", pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc", index: [0], offset: 0, exported: false }, { name: "err", key: "err", type: "error", pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc", index: [1], offset: 16, exported: false }]
	)
}

export class streamProbeResult {
	public get total(): number {
		return this._fields.total.value
	}
	public set total(value: number) {
		this._fields.total.value = value
	}

	public get err(): string {
		return this._fields.err.value
	}
	public set err(value: string) {
		this._fields.err.value = value
	}

	public _fields: {
		total: $.VarRef<number>
		err: $.VarRef<string>
	}

	constructor(init?: Partial<{total?: number, err?: string}>) {
		this._fields = {
			total: $.varRef(init?.total ?? (0 as unknown as number)),
			err: $.varRef(init?.err ?? ("" as unknown as string))
		}
	}

	public clone(): streamProbeResult {
		const cloned = new streamProbeResult()
		cloned._fields = {
			total: $.varRef(this._fields.total.value),
			err: $.varRef(this._fields.err.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.streamProbeResult",
		() => new streamProbeResult(),
		[],
		streamProbeResult,
		[{ name: "total", key: "total", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc", index: [0], offset: 0, exported: false }, { name: "err", key: "err", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc", index: [1], offset: 8, exported: false }]
	)
}

export class rpcStreamServerResult {
	public get err(): string {
		return this._fields.err.value
	}
	public set err(value: string) {
		this._fields.err.value = value
	}

	public _fields: {
		err: $.VarRef<string>
	}

	constructor(init?: Partial<{err?: string}>) {
		this._fields = {
			err: $.varRef(init?.err ?? ("" as unknown as string))
		}
	}

	public clone(): rpcStreamServerResult {
		const cloned = new rpcStreamServerResult()
		cloned._fields = {
			err: $.varRef(this._fields.err.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.rpcStreamServerResult",
		() => new rpcStreamServerResult(),
		[],
		rpcStreamServerResult,
		[{ name: "err", key: "err", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc", index: [0], offset: 0, exported: false }]
	)
}

export class memoryRpcStream {
	public get ctx(): context.Context | null {
		return this._fields.ctx.value
	}
	public set ctx(value: context.Context | null) {
		this._fields.ctx.value = value
	}

	public get cancel(): (() => void) | null {
		return this._fields.cancel.value
	}
	public set cancel(value: (() => void) | null) {
		this._fields.cancel.value = value
	}

	public get recv(): $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null {
		return this._fields.recv.value
	}
	public set recv(value: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null) {
		this._fields.recv.value = value
	}

	public get send(): $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null {
		return this._fields.send.value
	}
	public set send(value: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null) {
		this._fields.send.value = value
	}

	public get closeSend(): sync.Once {
		return this._fields.closeSend.value
	}
	public set closeSend(value: sync.Once) {
		this._fields.closeSend.value = value
	}

	public get cancelLocal(): sync.Once {
		return this._fields.cancelLocal.value
	}
	public set cancelLocal(value: sync.Once) {
		this._fields.cancelLocal.value = value
	}

	public _fields: {
		ctx: $.VarRef<context.Context | null>
		cancel: $.VarRef<(() => void) | null>
		recv: $.VarRef<$.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null>
		send: $.VarRef<$.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null>
		closeSend: $.VarRef<sync.Once>
		cancelLocal: $.VarRef<sync.Once>
	}

	constructor(init?: Partial<{ctx?: context.Context | null, cancel?: (() => void) | null, recv?: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null, send?: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null, closeSend?: sync.Once, cancelLocal?: sync.Once}>) {
		this._fields = {
			ctx: $.varRef(init?.ctx ?? (null as unknown as context.Context | null)),
			cancel: $.varRef(init?.cancel ?? (null as unknown as (() => void) | null)),
			recv: $.varRef(init?.recv ?? (null as unknown as $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null)),
			send: $.varRef(init?.send ?? (null as unknown as $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null)),
			closeSend: $.varRef(init?.closeSend ? $.markAsStructValue($.cloneStructValue(init.closeSend)) : $.markAsStructValue(new sync.Once())),
			cancelLocal: $.varRef(init?.cancelLocal ? $.markAsStructValue($.cloneStructValue(init.cancelLocal)) : $.markAsStructValue(new sync.Once()))
		}
	}

	public clone(): memoryRpcStream {
		const cloned = new memoryRpcStream()
		cloned._fields = {
			ctx: $.varRef(this._fields.ctx.value),
			cancel: $.varRef(this._fields.cancel.value),
			recv: $.varRef(this._fields.recv.value),
			send: $.varRef(this._fields.send.value),
			closeSend: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.closeSend.value))),
			cancelLocal: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.cancelLocal.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this
		await memoryRpcStream.prototype.CloseSend.call(m)
		await $.pointerValue<memoryRpcStream>(m).cancelLocal.Do($.functionValue(async (): globalThis.Promise<void> => {
			await $.pointerValue<memoryRpcStream>(m).cancel!()
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		return null
	}

	public async CloseSend(): globalThis.Promise<$.GoError> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this
		await $.pointerValue<memoryRpcStream>(m).closeSend.Do($.functionValue((): void => {
			$.pointerValue<memoryRpcStream>(m).send!.close()
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		return null
	}

	public Context(): context.Context | null {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this
		return $.pointerValue<memoryRpcStream>(m).ctx
	}

	public async MsgRecv(msg: srpc.Message): globalThis.Promise<$.GoError> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this
		while (true) {
			let __goscriptTuple0: any = await memoryRpcStream.prototype.Recv.call(m)
			let pkt: rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null = __goscriptTuple0[0]
			let err = __goscriptTuple0[1]
			if (err != null) {
				return err
			}
			let data: $.Slice<number> = rpcstream.RpcStreamPacket.prototype.GetData.call(pkt)
			if ($.len(data) == 0) {
				continue
			}
			return await $.pointerValue<Exclude<protobuf_go_lite.Message, null>>(msg).UnmarshalVT(data)
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async MsgSend(msg: srpc.Message): globalThis.Promise<$.GoError> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this
		let __goscriptTuple1: any = await $.pointerValue<Exclude<protobuf_go_lite.Message, null>>(msg).MarshalVT()
		let data: $.Slice<number> = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		if (err != null) {
			return err
		}
		return await memoryRpcStream.prototype.Send.call(m, new rpcstream.RpcStreamPacket({Body: $.interfaceValue<any>(new rpcstream.RpcStreamPacket_Data({Data: data}), "*rpcstream.RpcStreamPacket_Data")}))
	}

	public async Recv(): globalThis.Promise<[rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null, $.GoError]> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, [rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null, $.GoError]>([
			{
				id: 0,
				isSend: false,
				channel: await $.pointerValue<Exclude<context.Context, null>>($.pointerValue<memoryRpcStream>(m).ctx).Done(),
				onSelected: async (__goscriptSelect0Result) => {
					return [null, context.Canceled]
				}
			},
			{
				id: 1,
				isSend: false,
				channel: $.pointerValue<memoryRpcStream>(m).recv,
				onSelected: async (__goscriptSelect0Result) => {
					let pkt = __goscriptSelect0Result.value
					let ok = __goscriptSelect0Result.ok
					if (!ok) {
						return [null, io.EOF]
					}
					return [pkt, null]
				}
			}
		], false)
		if (__goscriptSelect0HasReturn) {
			return __goscriptSelect0Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Send(pkt: rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null): globalThis.Promise<$.GoError> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this
		const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, $.GoError>([
			{
				id: 0,
				isSend: false,
				channel: await $.pointerValue<Exclude<context.Context, null>>($.pointerValue<memoryRpcStream>(m).ctx).Done(),
				onSelected: async (__goscriptSelect1Result) => {
					return context.Canceled
				}
			},
			{
				id: 1,
				isSend: true,
				channel: $.pointerValue<memoryRpcStream>(m).send,
				value: await rpcstream.RpcStreamPacket.prototype.CloneVT.call(pkt),
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

	static __typeInfo = $.registerStructType(
		"main.memoryRpcStream",
		() => new memoryRpcStream(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseSend", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "MsgRecv", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "MsgSend", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Recv", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" } }, { name: "_r1", type: "error" }] }, { name: "Send", args: [{ name: "pkt", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" } }], returns: [{ name: "_r0", type: "error" }] }],
		memoryRpcStream,
		[{ name: "ctx", key: "ctx", type: "context.Context", pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc", index: [0], offset: 0, exported: false }, { name: "cancel", key: "cancel", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc", index: [1], offset: 16, exported: false }, { name: "recv", key: "recv", type: { kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" } }, pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc", index: [2], offset: 24, exported: false }, { name: "send", key: "send", type: { kind: $.TypeKind.Channel, direction: "send", elemType: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" } }, pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc", index: [3], offset: 32, exported: false }, { name: "closeSend", key: "closeSend", type: "sync.Once", pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc", index: [4], offset: 40, exported: false }, { name: "cancelLocal", key: "cancelLocal", type: "sync.Once", pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc", index: [5], offset: 52, exported: false }]
	)
}

export class memoryRpcContext {
	public get done(): $.Channel<{}> | null {
		return this._fields.done.value
	}
	public set done(value: $.Channel<{}> | null) {
		this._fields.done.value = value
	}

	public get once(): sync.Once {
		return this._fields.once.value
	}
	public set once(value: sync.Once) {
		this._fields.once.value = value
	}

	public _fields: {
		done: $.VarRef<$.Channel<{}> | null>
		once: $.VarRef<sync.Once>
	}

	constructor(init?: Partial<{done?: $.Channel<{}> | null, once?: sync.Once}>) {
		this._fields = {
			done: $.varRef(init?.done ?? (null as unknown as $.Channel<{}> | null)),
			once: $.varRef(init?.once ? $.markAsStructValue($.cloneStructValue(init.once)) : $.markAsStructValue(new sync.Once()))
		}
	}

	public clone(): memoryRpcContext {
		const cloned = new memoryRpcContext()
		cloned._fields = {
			done: $.varRef(this._fields.done.value),
			once: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.once.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Deadline(): [time.Time, boolean] {
		const m: memoryRpcContext | $.VarRef<memoryRpcContext> | null = this
		return [$.markAsStructValue(new time.Time()), false]
	}

	public Done(): $.Channel<{}> | null {
		const m: memoryRpcContext | $.VarRef<memoryRpcContext> | null = this
		return $.pointerValue<memoryRpcContext>(m).done
	}

	public async Err(): globalThis.Promise<$.GoError> {
		const m: memoryRpcContext | $.VarRef<memoryRpcContext> | null = this
		const [__goscriptSelect2HasReturn, __goscriptSelect2Value] = await $.selectStatement<any, $.GoError>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<memoryRpcContext>(m).done,
				onSelected: async (__goscriptSelect2Result) => {
					return context.Canceled
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect2Result) => {
					return null
				}
			}
		], true)
		if (__goscriptSelect2HasReturn) {
			return __goscriptSelect2Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Value(key: any): globalThis.Promise<any> {
		const m: memoryRpcContext | $.VarRef<memoryRpcContext> | null = this
		return await $.pointerValue<Exclude<context.Context, null>>(context.Background()).Value(key)
	}

	static __typeInfo = $.registerStructType(
		"main.memoryRpcContext",
		() => new memoryRpcContext(),
		[{ name: "Deadline", args: [], returns: [{ name: "_r0", type: "time.Time" }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Done", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } } }] }, { name: "Err", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Value", args: [{ name: "key", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		memoryRpcContext,
		[{ name: "done", key: "done", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc", index: [0], offset: 0, exported: false }, { name: "once", key: "once", type: "sync.Once", pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc", index: [1], offset: 8, exported: false }]
	)
}

export async function closeEmbedded(strm: embeddedStream): globalThis.Promise<$.GoError> {
	return await $.pointerValue<Exclude<srpc.Stream, null>>(strm.Stream).CloseSend()
}

export async function recvOne(__typeArgs: $.GenericTypeArgs | undefined, strm: srpc.StreamRecv | null): globalThis.Promise<$.GoError> {
	let [, err] = await $.pointerValue<Exclude<srpc.StreamRecv, null>>(strm).Recv()
	return err
}

export function newMemoryRpcContext(): [memoryRpcContext | $.VarRef<memoryRpcContext> | null, (() => void) | null] {
	let ctx: memoryRpcContext | $.VarRef<memoryRpcContext> | null = new memoryRpcContext({done: $.makeChannel<{}>(0, {}, "both")})
	return [ctx, $.functionValue(async (): globalThis.Promise<void> => {
		await $.pointerValue<memoryRpcContext>(ctx).once.Do($.functionValue((): void => {
			$.pointerValue<memoryRpcContext>(ctx).done!.close()
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))]
}

export function newMemoryRpcStreamPair(): [memoryRpcStream | $.VarRef<memoryRpcStream> | null, memoryRpcStream | $.VarRef<memoryRpcStream> | null] {
	let __goscriptTuple2: any = newMemoryRpcContext()
	let aCtx: memoryRpcContext | $.VarRef<memoryRpcContext> | null = __goscriptTuple2[0]
	let aCancel: (() => void) | null = __goscriptTuple2[1]
	let __goscriptTuple3: any = newMemoryRpcContext()
	let bCtx: memoryRpcContext | $.VarRef<memoryRpcContext> | null = __goscriptTuple3[0]
	let bCancel: (() => void) | null = __goscriptTuple3[1]
	let aToB: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null = $.makeChannel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null>(16, null, "both")
	let bToA: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null = $.makeChannel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null>(16, null, "both")
	return [new memoryRpcStream({ctx: $.interfaceValue<context.Context | null>(aCtx, "*main.memoryRpcContext"), cancel: aCancel, recv: bToA, send: aToB}), new memoryRpcStream({ctx: $.interfaceValue<context.Context | null>(bCtx, "*main.memoryRpcContext"), cancel: bCancel, recv: aToB, send: bToA})]
}

export async function openHeldStreams(ctx: context.Context | null, client: srpc.Client | null, count: number): globalThis.Promise<[$.Slice<srpc.Stream | null>, boolean]> {
	let resultCh: $.Channel<streamOpenResult> | null = $.makeChannel<streamOpenResult>(count, $.markAsStructValue(new streamOpenResult()), "both")
	for (let i = 0; i < count; i++) {
		queueMicrotask(async () => { await (async (idx: number): globalThis.Promise<void> => {
			let [strm, err] = await $.pointerValue<Exclude<srpc.Client, null>>(client).NewStream(ctx, "svc", "hold", null)
			if (err == null) {
				err = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage($.arrayToSlice<number>([$.uint($.uint(idx, 8), 8)]), false), "*srpc.RawMessage"))
			}
			await $.chanSend(resultCh, $.markAsStructValue(new streamOpenResult({stream: strm, err: err})))
		})(i) })
	}

	let streams: $.Slice<srpc.Stream | null> = $.makeSlice<srpc.Stream | null>(0, count)
	for (let __rangeIndex = 0; __rangeIndex < count; __rangeIndex++) {
		const [__goscriptSelect3HasReturn, __goscriptSelect3Value] = await $.selectStatement<any, [$.Slice<srpc.Stream | null>, boolean]>([
			{
				id: 0,
				isSend: false,
				channel: resultCh,
				onSelected: async (__goscriptSelect3Result) => {
					let result = __goscriptSelect3Result.value
					if (result.err != null) {
						$.println("hold open error:", $.pointerValue<Exclude<$.GoError, null>>(result.err).Error())
						return [streams, false]
					}
					streams = $.append(streams, result.stream)
				}
			},
			{
				id: 1,
				isSend: false,
				channel: time.After(5000000000n),
				onSelected: async (__goscriptSelect3Result) => {
					$.println("hold open timeout")
					return [streams, false]
				}
			}
		], false)
		if (__goscriptSelect3HasReturn) {
			return __goscriptSelect3Value
		}
	}

	return [streams, true]
}

export async function closeHeldStreams(streams: $.Slice<srpc.Stream | null>): globalThis.Promise<boolean> {
	for (let __goscriptRangeTarget0 = streams, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let strm = __goscriptRangeTarget0![__rangeIndex]
		{
			let err = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).CloseSend()
			if (err != null) {
				$.println("hold close send error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
				return false
			}
		}
		let resp: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
		{
			let err = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgRecv($.interfaceValue<srpc.Message>(resp, "*srpc.RawMessage"))
			if (err != null) {
				$.println("hold recv error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
				return false
			}
		}
		if (($.len(srpc.RawMessage.prototype.GetData.call(resp)) != 1) || ($.uint(srpc.RawMessage.prototype.GetData.call(resp)![0], 8) != $.uint(1, 8))) {
			$.println("hold response mismatch")
			return false
		}
	}
	return true
}

export async function probeConcurrentStreams(ctx: context.Context | null, client: srpc.Client | null, count: number): globalThis.Promise<boolean> {
	let resultCh: $.Channel<streamProbeResult> | null = $.makeChannel<streamProbeResult>(count, $.markAsStructValue(new streamProbeResult()), "both")
	for (let i = 0; i < count; i++) {
		queueMicrotask(async () => { await (async (idx: number): globalThis.Promise<void> => {
			let [total, err] = await probeStream(ctx, client, $.uint($.uint(idx + 1, 8), 8), $.uint($.uint(idx + 2, 8), 8))
			if (err != null) {
				await $.chanSend(resultCh, (() => { const __goscriptLiteralField0 = $.pointerValue<Exclude<$.GoError, null>>(err).Error(); return $.markAsStructValue(new streamProbeResult({err: __goscriptLiteralField0})) })())
				return
			}
			await $.chanSend(resultCh, $.markAsStructValue(new streamProbeResult({total: total})))
		})(i) })
	}

	for (let i = 0; i < count; i++) {
		const [__goscriptSelect4HasReturn, __goscriptSelect4Value] = await $.selectStatement<any, boolean>([
			{
				id: 0,
				isSend: false,
				channel: resultCh,
				onSelected: async (__goscriptSelect4Result) => {
					let result = __goscriptSelect4Result.value
					if (!$.stringEqual(result.err, "")) {
						$.println("probe error:", result.err)
						return false
					}
					if (result.total != 2) {
						$.println("probe total mismatch:", i, result.total)
						return false
					}
				}
			},
			{
				id: 1,
				isSend: false,
				channel: time.After(5000000000n),
				onSelected: async (__goscriptSelect4Result) => {
					$.println("probe timeout:", i)
					return false
				}
			}
		], false)
		if (__goscriptSelect4HasReturn) {
			return __goscriptSelect4Value
		}
	}
	return true
}

export async function probeStream(ctx: context.Context | null, client: srpc.Client | null, a: number, b: number): globalThis.Promise<[number, $.GoError]> {
	let [strm, err] = await $.pointerValue<Exclude<srpc.Client, null>>(client).NewStream(ctx, "svc", "stream", null)
	if (err != null) {
		return [0, err]
	}
	{
		let __goscriptShadow0 = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage($.arrayToSlice<number>([$.uint(a, 8)]), false), "*srpc.RawMessage"))
		if (__goscriptShadow0 != null) {
			return [0, __goscriptShadow0]
		}
	}
	{
		let __goscriptShadow1 = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage($.arrayToSlice<number>([$.uint(b, 8)]), false), "*srpc.RawMessage"))
		if (__goscriptShadow1 != null) {
			return [0, __goscriptShadow1]
		}
	}
	{
		let __goscriptShadow2 = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).CloseSend()
		if (__goscriptShadow2 != null) {
			return [0, __goscriptShadow2]
		}
	}
	let resp: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
	{
		let __goscriptShadow3 = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgRecv($.interfaceValue<srpc.Message>(resp, "*srpc.RawMessage"))
		if (__goscriptShadow3 != null) {
			return [0, __goscriptShadow3]
		}
	}
	let data: $.Slice<number> = srpc.RawMessage.prototype.GetData.call(resp)
	if ($.len(data) != 1) {
		return [$.len(data), null]
	}
	return [$.int(data![0]), null]
}

export function newRoutedRpcStreamClient(ctx: context.Context | null, componentID: string, getter: rpcstream.RpcStreamGetter | null, waitAck: boolean, results: $.Channel<rpcStreamServerResult> | null): srpc.Client | null {
	return rpcstream.NewRpcStreamClient(undefined, $.functionValue(async (callCtx: context.Context | null): globalThis.Promise<[memoryRpcStream | $.VarRef<memoryRpcStream> | null, $.GoError]> => {
		let __goscriptTuple4: any = newMemoryRpcStreamPair()
		let client: memoryRpcStream | $.VarRef<memoryRpcStream> | null = __goscriptTuple4[0]
		let server: memoryRpcStream | $.VarRef<memoryRpcStream> | null = __goscriptTuple4[1]
		queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
			let err = await rpcstream.HandleRpcStream($.interfaceValue<rpcstream.RpcStream | null>(server, "*main.memoryRpcStream"), getter)
			if (((err != null) && (!$.comparableEqual(err, context.Canceled))) && (!$.comparableEqual(err, io.EOF))) {
				const [__goscriptSelect5HasReturn, __goscriptSelect5Value] = await $.selectStatement<any, void>([
					{
						id: 0,
						isSend: true,
						channel: results,
						value: (() => { const __goscriptLiteralField1 = $.pointerValue<Exclude<$.GoError, null>>(err).Error(); return $.markAsStructValue(new rpcStreamServerResult({err: __goscriptLiteralField1})) })(),
						onSelected: async (__goscriptSelect5Result) => {
						}
					},
					{
						id: -1,
						isSend: false,
						channel: null,
						onSelected: async (__goscriptSelect5Result) => {
						}
					}
				], true)
				if (__goscriptSelect5HasReturn) {
					return __goscriptSelect5Value
				}
			}
		})() })
		queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
			const [__goscriptSelect6HasReturn, __goscriptSelect6Value] = await $.selectStatement<any, void>([
				{
					id: 0,
					isSend: false,
					channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
					onSelected: async (__goscriptSelect6Result) => {
						await memoryRpcStream.prototype.Close.call(client)
						await memoryRpcStream.prototype.Close.call(server)
					}
				},
				{
					id: 1,
					isSend: false,
					channel: await $.pointerValue<Exclude<context.Context, null>>(callCtx).Done(),
					onSelected: async (__goscriptSelect6Result) => {
						await memoryRpcStream.prototype.Close.call(client)
						await memoryRpcStream.prototype.Close.call(server)
					}
				}
			], false)
			if (__goscriptSelect6HasReturn) {
				return __goscriptSelect6Value
			}
		})() })
		return [client, null]
	}, ({ kind: $.TypeKind.Function, params: ["context.Context"], results: [{ kind: $.TypeKind.Pointer, elemType: "main.memoryRpcStream" }, "error"] } as $.FunctionTypeInfo)), componentID, waitAck)
}

export async function exerciseRpcStreamClientPressure(ctx: context.Context | null): globalThis.Promise<boolean> {
	let mux = srpc.NewMux(null)
	{
		let err = await $.pointerValue<Exclude<srpc.Mux, null>>(mux).Register($.interfaceValue<srpc.Handler | null>($.markAsStructValue(new handler()), "main.handler"))
		if (err != null) {
			$.println("rpcstream pressure register error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return false
		}
	}

	let results: $.Channel<rpcStreamServerResult> | null = $.makeChannel<rpcStreamServerResult>(8, $.markAsStructValue(new rpcStreamServerResult()), "both")
	let getter: ((ctx: context.Context | null, componentID: string, released: (() => void) | null) => [srpc.Invoker | null, (() => void) | null, $.GoError] | globalThis.Promise<[srpc.Invoker | null, (() => void) | null, $.GoError]>) | null = $.functionValue((ctx: context.Context | null, componentID: string, released: (() => void) | null): [srpc.Invoker | null, (() => void) | null, $.GoError] => {
		if ((!$.stringEqual(componentID, "component-root")) && (!$.stringEqual(componentID, "component-space"))) {
			return [null, (null as (() => void) | null), null]
		}
		return [(mux as srpc.Invoker | null), (null as (() => void) | null), null]
	}, ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)], results: ["srpc.Invoker", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "error"] } as $.FunctionTypeInfo))

	let rootClient = newRoutedRpcStreamClient(ctx, "component-root", getter, true, results)
	let __goscriptTuple5: any = await openHeldStreams(ctx, rootClient, 64)
	let held: $.Slice<srpc.Stream | null> = __goscriptTuple5[0]
	let ok = __goscriptTuple5[1]
	if (!ok) {
		return false
	}

	let spaceClient = newRoutedRpcStreamClient(ctx, "component-space", getter, true, results)
	if (!await probeConcurrentStreams(ctx, spaceClient, 16)) {
		return false
	}
	if (!await closeHeldStreams(held)) {
		return false
	}

	const [__goscriptSelect7HasReturn, __goscriptSelect7Value] = await $.selectStatement<any, boolean>([
		{
			id: 0,
			isSend: false,
			channel: results,
			onSelected: async (__goscriptSelect7Result) => {
				let result = __goscriptSelect7Result.value
				$.println("rpcstream pressure server error:", result.err)
				return false
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect7Result) => {
			}
		}
	], true)
	if (__goscriptSelect7HasReturn) {
		return __goscriptSelect7Value
	}
	return true
}

export async function exerciseRpcStreamHandle(): globalThis.Promise<boolean> {
	await using __defer = new $.AsyncDisposableStack()
	let __goscriptTuple6: any = newMemoryRpcStreamPair()
	let client: memoryRpcStream | $.VarRef<memoryRpcStream> | null = __goscriptTuple6[0]
	let server: memoryRpcStream | $.VarRef<memoryRpcStream> | null = __goscriptTuple6[1]
	__defer.defer(async () => { await memoryRpcStream.prototype.Close.call(client) })
	__defer.defer(async () => { await memoryRpcStream.prototype.Close.call(server) })

	let invoked: $.Channel<boolean> | null = $.makeChannel<boolean>(1, false, "both")
	let done: $.Channel<$.GoError> | null = $.makeChannel<$.GoError>(1, null, "both")
	queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
		await $.chanSend(done, await rpcstream.HandleRpcStream($.interfaceValue<rpcstream.RpcStream | null>(server, "*main.memoryRpcStream"), $.functionValue(async (ctx: context.Context | null, componentID: string, released: (() => void) | null): globalThis.Promise<[srpc.Invoker | null, (() => void) | null, $.GoError]> => {
			if (!$.stringEqual(componentID, "component-a")) {
				await $.chanSend(invoked, false)
				return [null, (null as (() => void) | null), null]
			}
			return [$.namedValueInterfaceValue<srpc.Invoker | null>($.namedFunction($.functionValue(async (serviceID: string, methodID: string, strm: srpc.Stream | null): globalThis.Promise<[boolean, $.GoError]> => {
				await $.chanSend(invoked, ($.stringEqual(serviceID, "svc")) && ($.stringEqual(methodID, "method")))
				return [true, null]
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "srpc.Stream"], results: [{ kind: $.TypeKind.Basic, name: "bool" }, "error"] } as $.FunctionTypeInfo)), "srpc.InvokerFunc", ({ kind: $.TypeKind.Function, name: "srpc.InvokerFunc", params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "srpc.Stream"], results: [{ kind: $.TypeKind.Basic, name: "bool" }, "error"] } as $.FunctionTypeInfo)), "srpc.InvokerFunc", {InvokeMethod: (receiver: any, ...args: any[]) => (srpc.InvokerFunc_InvokeMethod as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, ({ kind: $.TypeKind.Function, name: "srpc.InvokerFunc", params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "srpc.Stream"], results: [{ kind: $.TypeKind.Basic, name: "bool" }, "error"] } as $.FunctionTypeInfo)), (null as (() => void) | null), null]
		}, ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)], results: ["srpc.Invoker", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "error"] } as $.FunctionTypeInfo))))
	})() })

	{
		let err = await memoryRpcStream.prototype.Send.call(client, new rpcstream.RpcStreamPacket({Body: $.interfaceValue<any>(new rpcstream.RpcStreamPacket_Init({Init: new rpcstream.RpcStreamInit({ComponentId: "component-a"})}), "*rpcstream.RpcStreamPacket_Init")}))
		if (err != null) {
			$.println("rpcstream init send error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return false
		}
	}

	let __goscriptTuple7: any = await memoryRpcStream.prototype.Recv.call(client)
	let ack: rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null = __goscriptTuple7[0]
	let err = __goscriptTuple7[1]
	if (err != null) {
		$.println("rpcstream ack recv error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return false
	}
	if ((rpcstream.RpcStreamPacket.prototype.GetAck.call(ack) == null) || (!$.stringEqual(rpcstream.RpcAck.prototype.GetError.call(rpcstream.RpcStreamPacket.prototype.GetAck.call(ack)), ""))) {
		$.println("rpcstream ack mismatch")
		return false
	}

	let __goscriptTuple8: any = await srpc.Packet.prototype.MarshalVT.call(srpc.NewCallStartPacket("svc", "method", null, false))
	let start: $.Slice<number> = __goscriptTuple8[0]
	err = __goscriptTuple8[1]
	if (err != null) {
		$.println("rpcstream call start marshal error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return false
	}
	{
		let __goscriptShadow4 = await memoryRpcStream.prototype.Send.call(client, new rpcstream.RpcStreamPacket({Body: $.interfaceValue<any>(new rpcstream.RpcStreamPacket_Data({Data: start}), "*rpcstream.RpcStreamPacket_Data")}))
		if (__goscriptShadow4 != null) {
			$.println("rpcstream call start send error:", $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow4).Error())
			return false
		}
	}

	const [__goscriptSelect8HasReturn, __goscriptSelect8Value] = await $.selectStatement<any, boolean>([
		{
			id: 0,
			isSend: false,
			channel: invoked,
			onSelected: async (__goscriptSelect8Result) => {
				let ok = __goscriptSelect8Result.value
				if (!ok) {
					$.println("rpcstream invoke mismatch")
					return false
				}
			}
		},
		{
			id: 1,
			isSend: false,
			channel: time.After(5000000000n),
			onSelected: async (__goscriptSelect8Result) => {
				$.println("rpcstream invoke timeout")
				return false
			}
		}
	], false)
	if (__goscriptSelect8HasReturn) {
		return __goscriptSelect8Value
	}

	let __goscriptTuple9: any = await memoryRpcStream.prototype.Recv.call(client)
	let resp: rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null = __goscriptTuple9[0]
	err = __goscriptTuple9[1]
	if (err != null) {
		$.println("rpcstream response recv error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return false
	}
	if (rpcstream.RpcStreamPacket.prototype.GetData.call(resp) == null) {
		$.println("rpcstream response missing data")
		return false
	}

	const [__goscriptSelect9HasReturn, __goscriptSelect9Value] = await $.selectStatement<any, boolean>([
		{
			id: 0,
			isSend: false,
			channel: done,
			onSelected: async (__goscriptSelect9Result) => {
				let err = __goscriptSelect9Result.value
				if (err != null) {
					$.println("rpcstream handle error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
					return false
				}
			}
		},
		{
			id: 1,
			isSend: false,
			channel: time.After(5000000000n),
			onSelected: async (__goscriptSelect9Result) => {
				$.println("rpcstream handle timeout")
				return false
			}
		}
	], false)
	if (__goscriptSelect9HasReturn) {
		return __goscriptSelect9Value
	}

	return true
}

export async function exercisePushablePacketWriter(): globalThis.Promise<boolean> {
	using __defer = new $.DisposableStack()
	let pushed: $.Slice<$.Slice<number>> = null as $.Slice<$.Slice<number>>
	let ended = false
	let pushFn = $.markAsStructValue($.cloneStructValue(js.FuncOf($.functionValue((_this: js.Value, args: $.Slice<js.Value>): any => {
		if ($.len(args) != 1) {
			$.println("push arg count:", $.len(args))
			return null
		}
		let data: $.Slice<number> = $.makeSlice<number>($.markAsStructValue($.cloneStructValue(args![0])).Length(), undefined, "byte")
		js.CopyBytesToGo(data, $.markAsStructValue($.cloneStructValue(args![0])))
		pushed = $.append(pushed, data)
		return null
	}, ({ kind: $.TypeKind.Function, params: ["js.Value", { kind: $.TypeKind.Slice, elemType: "js.Value" }], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo)))))
	__defer.defer(() => { $.markAsStructValue($.cloneStructValue(pushFn)).Release() })
	let endFn = $.markAsStructValue($.cloneStructValue(js.FuncOf($.functionValue((_this: js.Value, args: $.Slice<js.Value>): any => {
		ended = true
		return null
	}, ({ kind: $.TypeKind.Function, params: ["js.Value", { kind: $.TypeKind.Slice, elemType: "js.Value" }], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo)))))
	__defer.defer(() => { $.markAsStructValue($.cloneStructValue(endFn)).Release() })

	let writer: srpc.PushablePacketWriter | $.VarRef<srpc.PushablePacketWriter> | null = srpc.NewPushablePacketWriter($.markAsStructValue($.cloneStructValue(js.ValueOf($.interfaceValue<any>(new globalThis.Map<string, any>([["push", $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(pushFn)), "js.Func")], ["end", $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(endFn)), "js.Func")]]), "map[string]any")))))
	{
		let err = await srpc.PushablePacketWriter.prototype.WritePacket.call(writer, srpc.NewCallStartPacket("svc", "push", $.arrayToSlice<number>([$.uint(7, 8), $.uint(8, 8), $.uint(9, 8)]), false))
		if (err != null) {
			$.println("pushable call-start error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return false
		}
	}
	{
		let err = await srpc.PushablePacketWriter.prototype.WritePacket.call(writer, srpc.NewCallCancelPacket())
		if (err != null) {
			$.println("pushable cancel error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return false
		}
	}
	{
		let err = srpc.PushablePacketWriter.prototype.Close.call(writer)
		if (err != null) {
			$.println("pushable close error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return false
		}
	}
	if (!ended) {
		$.println("pushable end missing")
		return false
	}
	if ($.len(pushed) != 2) {
		$.println("pushable packets:", $.len(pushed))
		return false
	}

	let sawStart = false
	let startHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null = srpc.NewPacketDataHandler($.functionValue((pkt: srpc.Packet | $.VarRef<srpc.Packet> | null): $.GoError => {
		let start: srpc.CallStart | $.VarRef<srpc.CallStart> | null = srpc.Packet.prototype.GetCallStart.call(pkt)
		if (start == null) {
			return io.ErrUnexpectedEOF
		}
		sawStart = (($.stringEqual(srpc.CallStart.prototype.GetRpcService.call(start), "svc")) && ($.stringEqual(srpc.CallStart.prototype.GetRpcMethod.call(start), "push"))) && ($.stringEqual($.bytesToString(srpc.CallStart.prototype.GetData.call(start)), $.bytesToString($.arrayToSlice<number>([$.uint(7, 8), $.uint(8, 8), $.uint(9, 8)]))))
		return null
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "srpc.Packet" }], results: ["error"] } as $.FunctionTypeInfo)))
	{
		let err = await startHandler!(pushed![0])
		if (err != null) {
			$.println("pushable start decode error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return false
		}
	}
	if (!sawStart) {
		$.println("pushable start mismatch")
		return false
	}

	let sawCancel = false
	let cancelHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null = srpc.NewPacketDataHandler($.functionValue((pkt: srpc.Packet | $.VarRef<srpc.Packet> | null): $.GoError => {
		sawCancel = srpc.Packet.prototype.GetCallCancel.call(pkt)
		return null
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "srpc.Packet" }], results: ["error"] } as $.FunctionTypeInfo)))
	{
		let err = await cancelHandler!(pushed![1])
		if (err != null) {
			$.println("pushable cancel decode error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return false
		}
	}
	if (!sawCancel) {
		$.println("pushable cancel missing")
		return false
	}

	return true
}

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let [ctx, cancel] = context.WithTimeout($.pointerValueOrNil(context.Background())!, 20000000000n)
	__defer.defer(async () => { await cancel!() })

	let mux = srpc.NewMux(null)
	await $.pointerValue<Exclude<srpc.Mux, null>>(mux).Register($.interfaceValue<srpc.Handler | null>($.markAsStructValue(new handler()), "main.handler"))
	await $.pointerValue<Exclude<srpc.Mux, null>>(mux).InvokeMethod("svc", "method", null)
	closeEmbedded
	$.functionValue(async (strm: srpc.StreamRecv | null): globalThis.Promise<$.GoError> => await recvOne({T: { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, strm), ({ kind: $.TypeKind.Function, params: ["srpc.StreamRecv"], results: ["error"] } as $.FunctionTypeInfo))
	srpc.NewRawMessage($.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8)]), true)
	let server: srpc.Server | $.VarRef<srpc.Server> | null = srpc.NewServer((mux as srpc.Invoker | null))
	let client = srpc.NewClient(srpc.NewServerPipe(server))
	let unaryResp: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
	let err = await $.pointerValue<Exclude<srpc.Client, null>>(client).ExecCall(ctx, "svc", "method", $.interfaceValue<srpc.Message>(srpc.NewRawMessage(null, false), "*srpc.RawMessage"), $.interfaceValue<srpc.Message>(unaryResp, "*srpc.RawMessage"))
	if (err != null) {
		$.println("exec error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("exec bytes:", $.len(srpc.RawMessage.prototype.GetData.call(unaryResp)))
	let __goscriptTuple10: any = await $.pointerValue<Exclude<srpc.Client, null>>(client).NewStream(ctx, "svc", "stream", null)
	let strm = __goscriptTuple10[0]
	err = __goscriptTuple10[1]
	if (err != null) {
		$.println("stream open error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage($.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8)]), false), "*srpc.RawMessage"))
	await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage($.arrayToSlice<number>([$.uint(4, 8), $.uint(5, 8)]), false), "*srpc.RawMessage"))
	await $.pointerValue<Exclude<srpc.Stream, null>>(strm).CloseSend()
	let resp: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
	{
		let __goscriptShadow5 = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgRecv($.interfaceValue<srpc.Message>(resp, "*srpc.RawMessage"))
		if (__goscriptShadow5 != null) {
			$.println("stream recv error:", $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow5).Error())
			return
		}
	}
	let data: $.Slice<number> = srpc.RawMessage.prototype.GetData.call(resp)
	if ($.len(data) != 1) {
		$.println("stream response length:", $.len(data))
		return
	}
	$.println("stream bytes:", $.uint(data![0], 8))
	let emptyResp: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
	{
		let __goscriptShadow6 = await $.pointerValue<Exclude<srpc.Client, null>>(client).ExecCall(ctx, "svc", "empty", $.interfaceValue<srpc.Message>(srpc.NewRawMessage(null, false), "*srpc.RawMessage"), $.interfaceValue<srpc.Message>(emptyResp, "*srpc.RawMessage"))
		if (__goscriptShadow6 != null) {
			$.println("empty exec error:", $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow6).Error())
			return
		}
	}
	$.println("empty exec bytes:", $.len(srpc.RawMessage.prototype.GetData.call(emptyResp)))

	let __goscriptTuple11: any = await openHeldStreams(ctx, client, 32)
	let held: $.Slice<srpc.Stream | null> = __goscriptTuple11[0]
	let ok = __goscriptTuple11[1]
	if (!ok) {
		return
	}
	if (!await probeConcurrentStreams(ctx, client, 16)) {
		return
	}
	if (!await closeHeldStreams(held)) {
		return
	}
	$.println("pressure streams: ok")
	if (!await exercisePushablePacketWriter()) {
		return
	}
	$.println("pushable writer: ok")
	if (!await exerciseRpcStreamHandle()) {
		return
	}
	$.println("rpcstream handle: ok")
	if (!await exerciseRpcStreamClientPressure(ctx)) {
		return
	}
	$.println("rpcstream pressure: ok")
	$.println("success: native starpc srpc")
}

if ($.isMainScript(import.meta)) {
	await main()
}

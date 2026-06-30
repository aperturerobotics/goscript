// Generated file based on client-verbose.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import * as logrus from "@goscript/github.com/sirupsen/logrus/index.js"

import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as __goscript_client from "./client.gs.ts"

import * as __goscript_message from "./message.gs.ts"

import type * as __goscript_stream from "./stream.gs.ts"
import "@goscript/context/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "@goscript/github.com/sirupsen/logrus/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "./client.gs.ts"
import "./message.gs.ts"

export class VClient {
	public get le(): logrus.Entry | $.VarRef<logrus.Entry> | null {
		return this._fields.le.value
	}
	public set le(value: logrus.Entry | $.VarRef<logrus.Entry> | null) {
		this._fields.le.value = value
	}

	public get client(): __goscript_client.Client | null {
		return this._fields.client.value
	}
	public set client(value: __goscript_client.Client | null) {
		this._fields.client.value = value
	}

	public get execID(): atomic.Int32 {
		return this._fields.execID.value
	}
	public set execID(value: atomic.Int32) {
		this._fields.execID.value = value
	}

	public _fields: {
		le: $.VarRef<logrus.Entry | $.VarRef<logrus.Entry> | null>
		client: $.VarRef<__goscript_client.Client | null>
		execID: $.VarRef<atomic.Int32>
	}

	constructor(init?: Partial<{le?: logrus.Entry | $.VarRef<logrus.Entry> | null, client?: __goscript_client.Client | null, execID?: atomic.Int32}>) {
		this._fields = {
			le: $.varRef(init?.le ?? (null as logrus.Entry | $.VarRef<logrus.Entry> | null)),
			client: $.varRef(init?.client ?? (null as __goscript_client.Client | null)),
			execID: $.varRef(init?.execID ? $.markAsStructValue($.cloneStructValue(init.execID)) : $.markAsStructValue(new atomic.Int32()))
		}
	}

	public clone(): VClient {
		const cloned = new VClient()
		cloned._fields = {
			le: $.varRef(this._fields.le.value),
			client: $.varRef(this._fields.client.value),
			execID: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.execID.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async ExecCall(ctx: context.Context | null, service: string, method: string, _in: __goscript_message.Message, out: __goscript_message.Message): globalThis.Promise<$.GoError> {
		const c: VClient | $.VarRef<VClient> | null = this
		let err: $.GoError = null as $.GoError
		await using __defer = new $.AsyncDisposableStack()
		let t1 = $.markAsStructValue($.cloneStructValue(time.Now()))
		let id = $.int($.pointerValue<VClient>(c).execID.Add($.int(1, 32)) - 1, 32)
		await logrus.Entry.prototype.Debugf.call($.pointerValue<VClient>(c).le, "ExecCall(service(%s), method(%s)) => id(%d) started", $.arrayToSlice<any>([service, method, $.namedValueInterfaceValue<any>(id, "int32", {}, { kind: $.TypeKind.Basic, name: "int32" })]))
		__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
			await logrus.Entry.prototype.Debugf.call($.pointerValue<VClient>(c).le, "ExecCall(service(%s), method(%s)) => id(%d) dur(%v) err(%v)", $.arrayToSlice<any>([service, method, $.namedValueInterfaceValue<any>(id, "int32", {}, { kind: $.TypeKind.Basic, name: "int32" }), time.Duration_String(time.Since($.markAsStructValue($.cloneStructValue(t1)))), (err as any)]))
		})() })

		err = await $.pointerValue<Exclude<__goscript_client.Client, null>>($.pointerValue<VClient>(c).client).ExecCall(ctx, service, method, _in, out)
		const __goscriptReturn0: $.GoError = err
		err = __goscriptReturn0
		await __defer.dispose()
		return err
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async NewStream(ctx: context.Context | null, service: string, method: string, firstMsg: __goscript_message.Message): globalThis.Promise<[__goscript_stream.Stream | null, $.GoError]> {
		const c: VClient | $.VarRef<VClient> | null = this
		let stream: __goscript_stream.Stream | null = null as __goscript_stream.Stream | null
		let err: $.GoError = null as $.GoError
		await using __defer = new $.AsyncDisposableStack()
		let t1 = $.markAsStructValue($.cloneStructValue(time.Now()))
		__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
			await logrus.Entry.prototype.Debugf.call($.pointerValue<VClient>(c).le, "NewStream(service(%s), method(%s)) => dur(%v) err(%v)", $.arrayToSlice<any>([service, method, time.Duration_String(time.Since($.markAsStructValue($.cloneStructValue(t1)))), (err as any)]))
		})() })
		let __goscriptTuple0: any = await $.pointerValue<Exclude<__goscript_client.Client, null>>($.pointerValue<VClient>(c).client).NewStream(ctx, service, method, firstMsg)
		stream = __goscriptTuple0[0]
		err = __goscriptTuple0[1]
		const __goscriptReturn1: [__goscript_stream.Stream | null, $.GoError] = [stream, err]
		stream = __goscriptReturn1[0]
		err = __goscriptReturn1[1]
		await __defer.dispose()
		return [stream, err]
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"srpc.VClient",
		() => new VClient(),
		[{ name: "ExecCall", args: [{ name: "ctx", type: "context.Context" }, { name: "service", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "method", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "in", type: "protobuf_go_lite.Message" }, { name: "out", type: "protobuf_go_lite.Message" }], returns: [{ name: "err", type: "error" }] }, { name: "NewStream", args: [{ name: "ctx", type: "context.Context" }, { name: "service", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "method", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "firstMsg", type: "protobuf_go_lite.Message" }], returns: [{ name: "stream", type: "srpc.Stream" }, { name: "err", type: "error" }] }],
		VClient,
		[{ name: "le", key: "le", type: { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "client", key: "client", type: "srpc.Client", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 8, exported: false }, { name: "execID", key: "execID", type: "atomic.Int32", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [2], offset: 24, exported: false }]
	)
}

export function NewVClient(c: __goscript_client.Client | null, le: logrus.Entry | $.VarRef<logrus.Entry> | null): VClient | $.VarRef<VClient> | null {
	return new VClient({le: le, client: c})
}

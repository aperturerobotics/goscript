// Generated file based on mux-verbose.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as time from "@goscript/time/index.js"

import * as logrus from "@goscript/github.com/sirupsen/logrus/index.js"

import type * as context from "@goscript/context/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as __goscript_handler from "./handler.gs.ts"

import type * as __goscript_invoker from "./invoker.gs.ts"

import type * as __goscript_message from "./message.gs.ts"

import * as __goscript_mux from "./mux.gs.ts"

import * as __goscript_stream from "./stream.gs.ts"
import "@goscript/time/index.js"
import "@goscript/github.com/sirupsen/logrus/index.js"
import "./handler.gs.ts"
import "./mux.gs.ts"
import "./stream.gs.ts"

export class VMux {
	public get mx(): __goscript_mux.Mux | null {
		return this._fields.mx.value
	}
	public set mx(value: __goscript_mux.Mux | null) {
		this._fields.mx.value = value
	}

	public get le(): logrus.Entry | $.VarRef<logrus.Entry> | null {
		return this._fields.le.value
	}
	public set le(value: logrus.Entry | $.VarRef<logrus.Entry> | null) {
		this._fields.le.value = value
	}

	public get veryVerbose(): boolean {
		return this._fields.veryVerbose.value
	}
	public set veryVerbose(value: boolean) {
		this._fields.veryVerbose.value = value
	}

	public _fields: {
		mx: $.VarRef<__goscript_mux.Mux | null>
		le: $.VarRef<logrus.Entry | $.VarRef<logrus.Entry> | null>
		veryVerbose: $.VarRef<boolean>
	}

	constructor(init?: Partial<{mx?: __goscript_mux.Mux | null, le?: logrus.Entry | $.VarRef<logrus.Entry> | null, veryVerbose?: boolean}>) {
		this._fields = {
			mx: $.varRef(init?.mx ?? (null as unknown as __goscript_mux.Mux | null)),
			le: $.varRef(init?.le ?? (null as unknown as logrus.Entry | $.VarRef<logrus.Entry> | null)),
			veryVerbose: $.varRef(init?.veryVerbose ?? (false as unknown as boolean))
		}
	}

	public clone(): VMux {
		const cloned = new VMux()
		cloned._fields = {
			mx: $.varRef(this._fields.mx.value),
			le: $.varRef(this._fields.le.value),
			veryVerbose: $.varRef(this._fields.veryVerbose.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async HasService(serviceID: string): globalThis.Promise<boolean> {
		const v: VMux | $.VarRef<VMux> | null = this
		let has: boolean = false
		await using __defer = new $.AsyncDisposableStack()
		if ($.pointerValue<VMux>(v).veryVerbose) {
			let t1 = $.markAsStructValue($.cloneStructValue(time.Now()))
			__defer.defer(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
				await logrus.Entry.prototype.Debugf.call($.pointerValue<VMux>(v).le, "HasService(serviceID(%s)) => dur(%v) has(%v)", $.arrayToSlice<any>([serviceID, time.Duration_String(time.Since($.markAsStructValue($.cloneStructValue(t1)))), has]))
			}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })
		}
		const __goscriptReturn0: boolean = await $.pointerValue<Exclude<__goscript_mux.Mux, null>>($.pointerValue<VMux>(v).mx).HasService(serviceID)
		has = __goscriptReturn0
		await __defer[Symbol.asyncDispose]()
		return has
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async HasServiceMethod(serviceID: string, methodID: string): globalThis.Promise<boolean> {
		const v: VMux | $.VarRef<VMux> | null = this
		let has: boolean = false
		await using __defer = new $.AsyncDisposableStack()
		if ($.pointerValue<VMux>(v).veryVerbose) {
			let t1 = $.markAsStructValue($.cloneStructValue(time.Now()))
			__defer.defer(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
				await logrus.Entry.prototype.Debugf.call($.pointerValue<VMux>(v).le, "HasServiceMethod(serviceID(%s), methodID(%s)) => dur(%v) has(%v)", $.arrayToSlice<any>([serviceID, methodID, time.Duration_String(time.Since($.markAsStructValue($.cloneStructValue(t1)))), has]))
			}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })
		}
		const __goscriptReturn1: boolean = await $.pointerValue<Exclude<__goscript_mux.Mux, null>>($.pointerValue<VMux>(v).mx).HasServiceMethod(serviceID, methodID)
		has = __goscriptReturn1
		await __defer[Symbol.asyncDispose]()
		return has
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async InvokeMethod(serviceID: string, methodID: string, strm: __goscript_stream.Stream | null): globalThis.Promise<[boolean, $.GoError]> {
		const v: VMux | $.VarRef<VMux> | null = this
		let done: boolean = false
		let err: $.GoError = null as $.GoError
		await using __defer = new $.AsyncDisposableStack()
		let t1 = $.markAsStructValue($.cloneStructValue(time.Now()))
		await logrus.Entry.prototype.Debugf.call($.pointerValue<VMux>(v).le, "InvokeMethod(serviceID(%s), methodID(%s)) => started", $.arrayToSlice<any>([serviceID, methodID]))
		__defer.defer(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
			await logrus.Entry.prototype.Debugf.call($.pointerValue<VMux>(v).le, "InvokeMethod(serviceID(%s), methodID(%s)) => dur(%v) done(%v) err(%v)", $.arrayToSlice<any>([serviceID, methodID, time.Duration_String(time.Since($.markAsStructValue($.cloneStructValue(t1)))), done, (err as any)]))
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })
		const __goscriptReturn3: [boolean, $.GoError] = await $.pointerValue<Exclude<__goscript_mux.Mux, null>>($.pointerValue<VMux>(v).mx).InvokeMethod(serviceID, methodID, strm)
		done = __goscriptReturn3[0]
		err = __goscriptReturn3[1]
		await __defer[Symbol.asyncDispose]()
		return [done, err]
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Register(handler: __goscript_handler.Handler | null): globalThis.Promise<$.GoError> {
		const v: VMux | $.VarRef<VMux> | null = this
		let err: $.GoError = null as $.GoError
		await using __defer = new $.AsyncDisposableStack()
		if ($.pointerValue<VMux>(v).veryVerbose) {
			let t1 = $.markAsStructValue($.cloneStructValue(time.Now()))
			__defer.defer(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
				await logrus.Entry.prototype.Debugf.call($.pointerValue<VMux>(v).le, "Register(handler(%v)) => dur(%v) err(%v)", $.arrayToSlice<any>([(handler as any), time.Duration_String(time.Since($.markAsStructValue($.cloneStructValue(t1)))), (err as any)]))
			}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })
		}
		const __goscriptReturn4: $.GoError = await $.pointerValue<Exclude<__goscript_mux.Mux, null>>($.pointerValue<VMux>(v).mx).Register(handler)
		err = __goscriptReturn4
		await __defer[Symbol.asyncDispose]()
		return err
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"srpc.VMux",
		() => new VMux(),
		[{ name: "HasService", args: [{ name: "serviceID", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "has", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "HasServiceMethod", args: [{ name: "serviceID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "methodID", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "has", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "InvokeMethod", args: [{ name: "serviceID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "methodID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "strm", type: "srpc.Stream" }], returns: [{ name: "done", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "err", type: "error" }] }, { name: "Register", args: [{ name: "handler", type: "srpc.Handler" }], returns: [{ name: "err", type: "error" }] }],
		VMux,
		[{ name: "mx", key: "mx", type: "srpc.Mux", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "le", key: "le", type: { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 16, exported: false }, { name: "veryVerbose", key: "veryVerbose", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [2], offset: 24, exported: false }]
	)
}

export function NewVMux(mux: __goscript_mux.Mux | null, le: logrus.Entry | $.VarRef<logrus.Entry> | null, veryVerbose: boolean): VMux | $.VarRef<VMux> | null {
	return new VMux({mx: mux, le: le, veryVerbose: veryVerbose})
}

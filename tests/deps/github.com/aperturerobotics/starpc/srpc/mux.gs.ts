// Generated file based on mux.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"

import * as sync from "@goscript/sync/index.js"

import type * as context from "@goscript/context/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as __goscript_errors from "./errors.gs.ts"

import * as __goscript_handler from "./handler.gs.ts"

import * as __goscript_invoker from "./invoker.gs.ts"

import type * as __goscript_message from "./message.gs.ts"

import * as __goscript_stream from "./stream.gs.ts"
import "@goscript/slices/index.js"
import "@goscript/sync/index.js"
import "./errors.gs.ts"
import "./handler.gs.ts"
import "./invoker.gs.ts"
import "./stream.gs.ts"

export type Mux = {
	HasService(serviceID: string): boolean | globalThis.Promise<boolean>
	HasServiceMethod(serviceID: string, methodID: string): boolean | globalThis.Promise<boolean>
	InvokeMethod(serviceID: string, methodID: string, strm: __goscript_stream.Stream | null): [boolean, $.GoError] | globalThis.Promise<[boolean, $.GoError]>
	Register(handler: __goscript_handler.Handler | null): $.GoError | globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"srpc.Mux",
	null,
	[{ name: "HasService", args: [{ name: "serviceID", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "HasServiceMethod", args: [{ name: "serviceID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "methodID", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "InvokeMethod", args: [{ name: "serviceID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "methodID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "strm", type: "srpc.Stream" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "_r1", type: "error" }] }, { name: "Register", args: [{ name: "handler", type: "srpc.Handler" }], returns: [{ name: "_r0", type: "error" }] }]
);

export class mux {
	// fallback is the list of fallback invokers
	// if the mux doesn't match the service, calls the invokers.
	public get fallback(): $.Slice<__goscript_invoker.Invoker | null> {
		return this._fields.fallback.value
	}
	public set fallback(value: $.Slice<__goscript_invoker.Invoker | null>) {
		this._fields.fallback.value = value
	}

	// rmtx guards below fields
	public get rmtx(): sync.RWMutex {
		return this._fields.rmtx.value
	}
	public set rmtx(value: sync.RWMutex) {
		this._fields.rmtx.value = value
	}

	// services contains a mapping from services to handlers.
	public get services(): globalThis.Map<string, muxMethods> | null {
		return this._fields.services.value
	}
	public set services(value: globalThis.Map<string, muxMethods> | null) {
		this._fields.services.value = value
	}

	public _fields: {
		fallback: $.VarRef<$.Slice<__goscript_invoker.Invoker | null>>
		rmtx: $.VarRef<sync.RWMutex>
		services: $.VarRef<globalThis.Map<string, muxMethods> | null>
	}

	constructor(init?: Partial<{fallback?: $.Slice<__goscript_invoker.Invoker | null>, rmtx?: sync.RWMutex, services?: globalThis.Map<string, muxMethods> | null}>) {
		this._fields = {
			fallback: $.varRef(init?.fallback ?? (null as $.Slice<__goscript_invoker.Invoker | null>)),
			rmtx: $.varRef(init?.rmtx ? $.markAsStructValue($.cloneStructValue(init.rmtx)) : $.markAsStructValue(new sync.RWMutex())),
			services: $.varRef(init?.services ?? (null as globalThis.Map<string, muxMethods> | null))
		}
	}

	public clone(): mux {
		const cloned = new mux()
		cloned._fields = {
			fallback: $.varRef(this._fields.fallback.value),
			rmtx: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.rmtx.value))),
			services: $.varRef(this._fields.services.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async HasService(serviceID: string): globalThis.Promise<boolean> {
		const m: mux | $.VarRef<mux> | null = this
		using __defer = new $.DisposableStack()
		if ($.stringEqual(serviceID, "")) {
			return false
		}

		await $.pointerValue<mux>(m).rmtx.Lock()
		__defer.defer(() => { $.pointerValue<mux>(m).rmtx.Unlock() })

		return $.len($.mapGet<string, muxMethods, muxMethods>($.pointerValue<mux>(m).services, serviceID, null)[0]) != 0
	}

	public async HasServiceMethod(serviceID: string, methodID: string): globalThis.Promise<boolean> {
		const m: mux | $.VarRef<mux> | null = this
		using __defer = new $.DisposableStack()
		if (($.stringEqual(serviceID, "")) || ($.stringEqual(methodID, ""))) {
			return false
		}

		await $.pointerValue<mux>(m).rmtx.Lock()
		__defer.defer(() => { $.pointerValue<mux>(m).rmtx.Unlock() })

		let handlers: muxMethods = $.mapGet<string, muxMethods, muxMethods>($.pointerValue<mux>(m).services, serviceID, null)[0]
		for (const [__rangeKey, mh] of handlers?.entries() ?? []) {
			if (slices.Contains(await $.pointerValue<Exclude<__goscript_handler.Handler, null>>(mh).GetMethodIDs(), methodID)) {
				return true
			}
		}

		return false
	}

	public async InvokeMethod(serviceID: string, methodID: string, strm: __goscript_stream.Stream | null): globalThis.Promise<[boolean, $.GoError]> {
		const m: mux | $.VarRef<mux> | null = this
		let handler: __goscript_handler.Handler | null = null as __goscript_handler.Handler | null
		await $.pointerValue<mux>(m).rmtx.RLock()
		if ($.stringEqual(serviceID, "")) {
			for (const [__rangeKey, svc] of $.pointerValue<mux>(m).services?.entries() ?? []) {
				{
					handler = $.mapGet<string, __goscript_handler.Handler | null, __goscript_handler.Handler | null>(svc, methodID, null)[0]
					if (handler != null) {
						break
					}
				}
			}
		} else {
			let svcMethods: muxMethods = $.mapGet<string, muxMethods, muxMethods>($.pointerValue<mux>(m).services, serviceID, null)[0]
			if (svcMethods != null) {
				handler = $.mapGet<string, __goscript_handler.Handler | null, __goscript_handler.Handler | null>(svcMethods, methodID, null)[0]
			}
		}
		$.pointerValue<mux>(m).rmtx.RUnlock()

		if (handler != null) {
			return await $.pointerValue<Exclude<__goscript_handler.Handler, null>>(handler).InvokeMethod(serviceID, methodID, strm)
		}

		for (let __goscriptRangeTarget0 = $.pointerValue<mux>(m).fallback, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let invoker = __goscriptRangeTarget0![__rangeIndex]
			if (invoker != null) {
				let [handled, err] = await $.pointerValue<Exclude<__goscript_invoker.Invoker, null>>(invoker).InvokeMethod(serviceID, methodID, strm)
				if ((err != null) || handled) {
					return [handled, err]
				}
			}
		}

		return [false, null]
	}

	public async Register(handler: __goscript_handler.Handler | null): globalThis.Promise<$.GoError> {
		let m: mux | $.VarRef<mux> | null = this
		using __defer = new $.DisposableStack()
		let serviceID = await $.pointerValue<Exclude<__goscript_handler.Handler, null>>(handler).GetServiceID()
		let methodIDs: $.Slice<string> = await $.pointerValue<Exclude<__goscript_handler.Handler, null>>(handler).GetMethodIDs()
		if ($.stringEqual(serviceID, "")) {
			return __goscript_errors.ErrEmptyServiceID
		}

		await $.pointerValue<mux>(m).rmtx.Lock()
		__defer.defer(() => { $.pointerValue<mux>(m).rmtx.Unlock() })

		let serviceMethods: muxMethods = $.mapGet<string, muxMethods, muxMethods>($.pointerValue<mux>(m).services, serviceID, null)[0]
		if (serviceMethods == null) {
			serviceMethods = $.makeMap<string, __goscript_handler.Handler | null>()
			$.mapSet($.pointerValue<mux>(m).services, serviceID, serviceMethods)
		}
		for (let __goscriptRangeTarget1 = methodIDs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
			let methodID = __goscriptRangeTarget1![__rangeIndex]
			if (!$.stringEqual(methodID, "")) {
				$.mapSet(serviceMethods, methodID, handler)
			}
		}

		return null
	}

	static __typeInfo = $.registerStructType(
		"srpc.mux",
		() => new mux(),
		[{ name: "HasService", args: [{ name: "serviceID", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "HasServiceMethod", args: [{ name: "serviceID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "methodID", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "InvokeMethod", args: [{ name: "serviceID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "methodID", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "strm", type: "srpc.Stream" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "_r1", type: "error" }] }, { name: "Register", args: [{ name: "handler", type: "srpc.Handler" }], returns: [{ name: "_r0", type: "error" }] }],
		mux,
		[{ name: "fallback", key: "fallback", type: { kind: $.TypeKind.Slice, elemType: "srpc.Invoker" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "rmtx", key: "rmtx", type: "sync.RWMutex", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 24, exported: false }, { name: "services", key: "services", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: "srpc.muxMethods" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [2], offset: 48, exported: false }]
	)
}

export type muxMethods = globalThis.Map<string, __goscript_handler.Handler | null> | null

export function NewMux(fallbackInvokers: $.Slice<__goscript_invoker.Invoker | null>): Mux | null {
	return $.interfaceValue<Mux | null>(new mux({fallback: fallbackInvokers, services: $.makeMap<string, muxMethods>()}), "*srpc.mux")
}

// Generated file based on client-set.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as __goscript_client from "./client.gs.ts"

import * as __goscript_errors from "./errors.gs.ts"

import * as __goscript_message from "./message.gs.ts"

import * as __goscript_stream from "./stream.gs.ts"
import "@goscript/context/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "./client.gs.ts"
import "./errors.gs.ts"
import "./message.gs.ts"
import "./stream.gs.ts"

export class ClientSet {
	public get clients(): $.Slice<__goscript_client.Client | null> {
		return this._fields.clients.value
	}
	public set clients(value: $.Slice<__goscript_client.Client | null>) {
		this._fields.clients.value = value
	}

	public _fields: {
		clients: $.VarRef<$.Slice<__goscript_client.Client | null>>
	}

	constructor(init?: Partial<{clients?: $.Slice<__goscript_client.Client | null>}>) {
		this._fields = {
			clients: $.varRef(init?.clients ?? (null as unknown as $.Slice<__goscript_client.Client | null>))
		}
	}

	public clone(): ClientSet {
		const cloned = new ClientSet()
		cloned._fields = {
			clients: $.varRef(this._fields.clients.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async ExecCall(ctx: context.Context | null, service: string, method: string, _in: __goscript_message.Message, out: __goscript_message.Message): globalThis.Promise<$.GoError> {
		const c: ClientSet | $.VarRef<ClientSet> | null = this
		return await ClientSet.prototype.execCall.call(c, ctx, $.functionValue(async (client: __goscript_client.Client | null): globalThis.Promise<$.GoError> => {
			return await $.pointerValue<Exclude<__goscript_client.Client, null>>(client).ExecCall(ctx, service, method, _in, out)
		}, ({ kind: $.TypeKind.Function, params: ["srpc.Client"], results: ["error"] } as $.FunctionTypeInfo)))
	}

	public async NewStream(ctx: context.Context | null, service: string, method: string, firstMsg: __goscript_message.Message): globalThis.Promise<[__goscript_stream.Stream | null, $.GoError]> {
		const c: ClientSet | $.VarRef<ClientSet> | null = this
		let strm: __goscript_stream.Stream | null = null as __goscript_stream.Stream | null
		let err = await ClientSet.prototype.execCall.call(c, ctx, $.functionValue(async (client: __goscript_client.Client | null): globalThis.Promise<$.GoError> => {
			let __goscriptShadow0: $.GoError = null as $.GoError
			let __goscriptTuple0: any = await $.pointerValue<Exclude<__goscript_client.Client, null>>(client).NewStream(ctx, service, method, firstMsg)
			strm = __goscriptTuple0[0]
			__goscriptShadow0 = __goscriptTuple0[1]
			return __goscriptShadow0
		}, ({ kind: $.TypeKind.Function, params: ["srpc.Client"], results: ["error"] } as $.FunctionTypeInfo)))
		return [strm, err]
	}

	public async execCall(ctx: context.Context | null, doCall: ((client: __goscript_client.Client | null) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
		const c: ClientSet | $.VarRef<ClientSet> | null = this
		let _any: boolean = false
		for (let __goscriptRangeTarget0 = $.pointerValue<ClientSet>(c).clients, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let client = __goscriptRangeTarget0![__rangeIndex]
			if (client == null) {
				continue
			}
			let err = await doCall!(client)
			_any = true
			if (err == null) {
				return null
			}
			if ($.comparableEqual(err, context.Canceled)) {
				const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, any>([
					{
						id: 0,
						isSend: false,
						channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
						onSelected: async (__goscriptSelect0Result) => {
							return __goscriptSelect0Result
						}
					},
					{
						id: -1,
						isSend: false,
						channel: null,
						onSelected: async (__goscriptSelect0Result) => {
							return __goscriptSelect0Result
						}
					}
				], true)
				switch (__goscriptSelect0Value?.id) {
					case 0:
						{
							const __goscriptSelect0Result = __goscriptSelect0Value
							return context.Canceled
							break
						}
					case -1:
						{
							const __goscriptSelect0Result = __goscriptSelect0Value
							continue
							break
						}
				}
			}
			if ($.stringEqual($.pointerValue<Exclude<$.GoError, null>>(err).Error(), $.pointerValue<Exclude<$.GoError, null>>(__goscript_errors.ErrUnimplemented).Error())) {
				continue
			}
			return err
		}

		if (!_any) {
			return __goscript_errors.ErrNoAvailableClients
		}

		return __goscript_errors.ErrUnimplemented
	}

	static __typeInfo = $.registerStructType(
		"srpc.ClientSet",
		() => new ClientSet(),
		[{ name: "ExecCall", args: [{ name: "ctx", type: "context.Context" }, { name: "service", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "method", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "in", type: "protobuf_go_lite.Message" }, { name: "out", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "NewStream", args: [{ name: "ctx", type: "context.Context" }, { name: "service", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "method", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "firstMsg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "srpc.Stream" }, { name: "_r1", type: "error" }] }, { name: "execCall", args: [{ name: "ctx", type: "context.Context" }, { name: "doCall", type: ({ kind: $.TypeKind.Function, params: ["srpc.Client"], results: ["error"] } as $.FunctionTypeInfo) }], returns: [{ name: "_r0", type: "error" }] }],
		ClientSet,
		[{ name: "clients", key: "clients", type: { kind: $.TypeKind.Slice, elemType: "srpc.Client" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }]
	)
}

export function NewClientSet(clients: $.Slice<__goscript_client.Client | null>): ClientSet | $.VarRef<ClientSet> | null {
	return new ClientSet({clients: clients})
}

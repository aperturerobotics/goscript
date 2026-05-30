// Generated file based on client-prefix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as __goscript_client from "./client.gs.ts"

import * as __goscript_errors from "./errors.gs.ts"

import * as __goscript_message from "./message.gs.ts"

import type * as __goscript_stream from "./stream.gs.ts"

import * as __goscript_strip_prefix from "./strip-prefix.gs.ts"
import "@goscript/context/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "./client.gs.ts"
import "./errors.gs.ts"
import "./message.gs.ts"
import "./strip-prefix.gs.ts"

export class PrefixClient {
	// client is the underlying client
	public get client(): __goscript_client.Client | null {
		return this._fields.client.value
	}
	public set client(value: __goscript_client.Client | null) {
		this._fields.client.value = value
	}

	// serviceIDPrefixes is the list of service id prefixes to match.
	public get serviceIDPrefixes(): $.Slice<string> {
		return this._fields.serviceIDPrefixes.value
	}
	public set serviceIDPrefixes(value: $.Slice<string>) {
		this._fields.serviceIDPrefixes.value = value
	}

	public _fields: {
		client: $.VarRef<__goscript_client.Client | null>
		serviceIDPrefixes: $.VarRef<$.Slice<string>>
	}

	constructor(init?: Partial<{client?: __goscript_client.Client | null, serviceIDPrefixes?: $.Slice<string>}>) {
		this._fields = {
			client: $.varRef(init?.client ?? null),
			serviceIDPrefixes: $.varRef(init?.serviceIDPrefixes ?? null)
		}
	}

	public clone(): PrefixClient {
		const cloned = new PrefixClient()
		cloned._fields = {
			client: $.varRef(this._fields.client.value),
			serviceIDPrefixes: $.varRef(this._fields.serviceIDPrefixes.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async ExecCall(ctx: context.Context | null, service: string, method: string, _in: __goscript_message.Message, out: __goscript_message.Message): globalThis.Promise<$.GoError> {
		const i: PrefixClient | $.VarRef<PrefixClient> | null = this
		let __goscriptTuple0: any = PrefixClient.prototype.stripCheckServiceIDPrefix.call(i, service)
		service = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return err
		}
		return await $.pointerValue<Exclude<__goscript_client.Client, null>>($.pointerValue<PrefixClient>(i).client).ExecCall(ctx, service, method, _in, out)
	}

	public async NewStream(ctx: context.Context | null, service: string, method: string, firstMsg: __goscript_message.Message): globalThis.Promise<[__goscript_stream.Stream | null, $.GoError]> {
		const i: PrefixClient | $.VarRef<PrefixClient> | null = this
		let __goscriptTuple1: any = PrefixClient.prototype.stripCheckServiceIDPrefix.call(i, service)
		service = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		if (err != null) {
			return [null, err]
		}
		return await $.pointerValue<Exclude<__goscript_client.Client, null>>($.pointerValue<PrefixClient>(i).client).NewStream(ctx, service, method, firstMsg)
	}

	public stripCheckServiceIDPrefix(service: string): [string, $.GoError] {
		const i: PrefixClient | $.VarRef<PrefixClient> | null = this
		if ($.len($.pointerValue<PrefixClient>(i).serviceIDPrefixes) != 0) {
			let [strippedID, matchedPrefix] = __goscript_strip_prefix.CheckStripPrefix(service, $.pointerValue<PrefixClient>(i).serviceIDPrefixes)
			if ($.len(matchedPrefix) == 0) {
				return [service, __goscript_errors.ErrUnimplemented]
			}
			return [strippedID, null]
		}
		return [service, null]
	}

	static __typeInfo = $.registerStructType(
		"srpc.PrefixClient",
		() => new PrefixClient(),
		[{ name: "ExecCall", args: [], returns: [] }, { name: "NewStream", args: [], returns: [] }, { name: "stripCheckServiceIDPrefix", args: [], returns: [] }],
		PrefixClient,
		[{ name: "client", key: "client", type: "srpc.Client", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "serviceIDPrefixes", key: "serviceIDPrefixes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 16, exported: false }]
	)
}

export function NewPrefixClient(client: __goscript_client.Client | null, serviceIDPrefixes: $.Slice<string>): PrefixClient | $.VarRef<PrefixClient> | null {
	return new PrefixClient({client: client, serviceIDPrefixes: serviceIDPrefixes})
}

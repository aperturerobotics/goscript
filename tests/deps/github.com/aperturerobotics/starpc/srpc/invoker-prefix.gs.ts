// Generated file based on invoker-prefix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as context from "@goscript/context/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as __goscript_invoker from "./invoker.gs.ts"

import type * as __goscript_message from "./message.gs.ts"

import * as __goscript_stream from "./stream.gs.ts"

import * as __goscript_strip_prefix from "./strip-prefix.gs.ts"
import "./invoker.gs.ts"
import "./stream.gs.ts"
import "./strip-prefix.gs.ts"

export class PrefixInvoker {
	// inv is the underlying invoker
	public get inv(): __goscript_invoker.Invoker | null {
		return this._fields.inv.value
	}
	public set inv(value: __goscript_invoker.Invoker | null) {
		this._fields.inv.value = value
	}

	// serviceIDPrefixes is the list of service id prefixes to match.
	public get serviceIDPrefixes(): $.Slice<string> {
		return this._fields.serviceIDPrefixes.value
	}
	public set serviceIDPrefixes(value: $.Slice<string>) {
		this._fields.serviceIDPrefixes.value = value
	}

	public _fields: {
		inv: $.VarRef<__goscript_invoker.Invoker | null>
		serviceIDPrefixes: $.VarRef<$.Slice<string>>
	}

	constructor(init?: Partial<{inv?: __goscript_invoker.Invoker | null, serviceIDPrefixes?: $.Slice<string>}>) {
		this._fields = {
			inv: $.varRef(init?.inv ?? null),
			serviceIDPrefixes: $.varRef(init?.serviceIDPrefixes ?? null)
		}
	}

	public clone(): PrefixInvoker {
		const cloned = new PrefixInvoker()
		cloned._fields = {
			inv: $.varRef(this._fields.inv.value),
			serviceIDPrefixes: $.varRef(this._fields.serviceIDPrefixes.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async InvokeMethod(serviceID: string, methodID: string, strm: __goscript_stream.Stream | null): globalThis.Promise<[boolean, $.GoError]> {
		const i: PrefixInvoker | $.VarRef<PrefixInvoker> | null = this
		if ($.len($.pointerValue<PrefixInvoker>(i).serviceIDPrefixes) != 0) {
			let [strippedID, matchedPrefix] = __goscript_strip_prefix.CheckStripPrefix(serviceID, $.pointerValue<PrefixInvoker>(i).serviceIDPrefixes)
			if ($.len(matchedPrefix) == 0) {
				return [false, null]
			}
			serviceID = strippedID
		}

		return await $.pointerValue<Exclude<__goscript_invoker.Invoker, null>>($.pointerValue<PrefixInvoker>(i).inv).InvokeMethod(serviceID, methodID, strm)
	}

	static __typeInfo = $.registerStructType(
		"srpc.PrefixInvoker",
		() => new PrefixInvoker(),
		[{ name: "InvokeMethod", args: [], returns: [] }],
		PrefixInvoker,
		{"inv": "srpc.Invoker", "serviceIDPrefixes": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }}
	)
}

export function NewPrefixInvoker(inv: __goscript_invoker.Invoker | null, serviceIDPrefixes: $.Slice<string>): PrefixInvoker | $.VarRef<PrefixInvoker> | null {
	return new PrefixInvoker({inv: inv, serviceIDPrefixes: serviceIDPrefixes})
}

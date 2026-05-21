// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_alias from "./alias.gs.ts"

import * as __goscript_iterator from "./iterator.gs.ts"

export class source {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): source {
		const cloned = new source()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Val(): __goscript_alias.Value {
		return $.stringToBytes("ok")
	}

	static __typeInfo = $.registerStructType(
		"main.source",
		new source(),
		[{ name: "Val", args: [], returns: [] }],
		source,
		{}
	)
}

export async function main(): Promise<void> {
	$.println($.bytesToString(__goscript_iterator.Read($.interfaceValue<__goscript_iterator.Reader | null>($.markAsStructValue(new source()), "main.source"))))
}


if ($.isMainScript(import.meta)) {
	await main()
}

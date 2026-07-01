// Generated file based on short_decl_type_assert_type_shadow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): item {
		const cloned = new item()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Dump(): string {
		return "ok"
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		[{ name: "Dump", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		item,
		[]
	)
}

export type dumper = {
	Dump(): string
}

$.registerInterfaceType(
	"main.dumper",
	null,
	[{ name: "Dump", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export async function use(v: any): globalThis.Promise<string> {
	let __goscriptTuple0: any = $.typeAssertTuple<dumper | null>(v, "main.dumper")
	let __goscriptShadow0 = __goscriptTuple0[0]
	let ok = __goscriptTuple0[1]
	if (!ok) {
		return "bad"
	}
	return $.pointerValue<Exclude<dumper, null>>(__goscriptShadow0).Dump()
}

export async function main(): globalThis.Promise<void> {
	$.println(await use($.interfaceValue<any>($.markAsStructValue(new item()), "main.item")))
}

if ($.isMainScript(import.meta)) {
	await main()
}

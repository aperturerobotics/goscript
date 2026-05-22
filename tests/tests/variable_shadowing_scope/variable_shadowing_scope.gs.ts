// Generated file based on variable_shadowing_scope.go
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

	public Name(): string {
		return "item"
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		new item(),
		[{ name: "Name", args: [], returns: [] }],
		item,
		{}
	)
}

export function firstFunc(): [string, number] {
	return ["", 42]
}

export function secondFunc(x: number): number {
	if (x != 0) {
		$.println("Got value:", x)
		return 0
	}
	return 99
}

export type named = null | {
	Name(): string
}

$.registerInterfaceType(
	"main.named",
	null,
	[{ name: "Name", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export function describe(value: any): void {
	let __goscriptShadow0 = value
	{
		let __goscriptTuple0 = $.typeAssertTuple<named | null>(__goscriptShadow0, "main.named")
		let __goscriptShadow1 = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (ok) {
			$.println("Shadowed name:", $.pointerValue<Exclude<named, null>>(__goscriptShadow1).Name())
			return
		}
	}
	$.println("Shadowed name: missing")
}

export async function main(): globalThis.Promise<void> {
	let [, x] = firstFunc()
	// This is the problematic pattern: x is shadowed but also used in the call
	let __goscriptShadow2 = x
	{
		let __goscriptShadow3 = secondFunc(__goscriptShadow2)
		if (__goscriptShadow3 != 0) {
			$.println("Function returned value")
			return
		}
	}
	$.println("Completed successfully")
	describe($.interfaceValue<any>($.markAsStructValue(new item()), "main.item"))
	describe("nope")
}


if ($.isMainScript(import.meta)) {
	await main()
}

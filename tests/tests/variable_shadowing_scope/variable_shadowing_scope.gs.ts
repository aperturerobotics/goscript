// Generated file based on variable_shadowing_scope.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

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

export function describe(value: any): void {
	let __goscriptShadow0 = value
	{
		let __goscriptTuple0 = $.typeAssertTuple<named | null>(__goscriptShadow0, "main.named")
		let value = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (ok) {
			$.println("Shadowed name:", $.pointerValue(value).Name())
			return
		}
	}
	$.println("Shadowed name: missing")
}

export async function main(): Promise<void> {
	let [, x] = firstFunc()
	// This is the problematic pattern: x is shadowed but also used in the call
	let __goscriptShadow1 = x
	{
		let x = secondFunc(__goscriptShadow1)
		if (x != 0) {
			$.println("Function returned value")
			return
		}
	}
	$.println("Completed successfully")
	describe($.markAsStructValue($.markAsStructValue(new item()).clone()))
	describe("nope")
}


if ($.isMainScript(import.meta)) {
	await main()
}

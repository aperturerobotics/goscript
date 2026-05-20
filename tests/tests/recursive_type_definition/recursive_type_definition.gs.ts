// Generated file based on recursive_type_definition.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type A = null | {
	MethodA(a: A): void
}

$.registerInterfaceType(
	"main.A",
	null,
	[{ name: "MethodA", args: [{ name: "a", type: "main.A" }], returns: [] }]
)

export class B {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): B {
		const cloned = new B()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public MethodB(valB: B | $.VarRef<B> | null): void {
		const b: B | $.VarRef<B> | null = this
	}

	static __typeInfo = $.registerStructType(
		"main.B",
		new B(),
		[{ name: "MethodB", args: [], returns: [] }],
		B,
		{}
	)
}

export type C = null | {
	MethodC(d: D): void
}

$.registerInterfaceType(
	"main.C",
	null,
	[{ name: "MethodC", args: [{ name: "d", type: "main.D" }], returns: [] }]
)

export type D = null | {
	MethodD(c: C): void
}

$.registerInterfaceType(
	"main.D",
	null,
	[{ name: "MethodD", args: [{ name: "c", type: "main.C" }], returns: [] }]
)

export async function main(): Promise<void> {
	$.println("recursive type definition test")
}


if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on recursive_type_definition.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type A = {
	MethodA(a: A | null): void
}

$.registerInterfaceType(
	"main.A",
	null,
	[{ name: "MethodA", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }]
);

export type C = {
	MethodC(d: D | null): void
}

$.registerInterfaceType(
	"main.C",
	null,
	[{ name: "MethodC", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }]
);

export type D = {
	MethodD(c: C | null): void
}

$.registerInterfaceType(
	"main.D",
	null,
	[{ name: "MethodD", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }]
);

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
		() => new B(),
		[{ name: "MethodB", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		B,
		[]
	)
}

export async function main(): globalThis.Promise<void> {
	$.println("recursive type definition test")
}

if ($.isMainScript(import.meta)) {
	await main()
}

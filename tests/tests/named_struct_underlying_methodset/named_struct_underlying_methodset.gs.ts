// Generated file based on named_struct_underlying_methodset.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Stringer = null | {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export class Base {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): Base {
		const cloned = new Base()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public String(): string {
		return "base"
	}

	static __typeInfo = $.registerStructType(
		"main.Base",
		() => new Base(),
		[{ name: "String", args: [], returns: [] }],
		Base,
		{}
	)
}

export class Derived {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): Derived {
		const cloned = new Derived()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Own(): string {
		return "derived"
	}

	static __typeInfo = $.registerStructType(
		"main.Derived",
		() => new Derived(),
		[{ name: "Own", args: [], returns: [] }],
		Derived,
		{}
	)
}

export async function main(): globalThis.Promise<void> {
	let base: any = $.interfaceValue<any>($.markAsStructValue(new Base()), "main.Base")
	let [, baseOK] = $.typeAssertTuple<Stringer | null>(base, "main.Stringer")
	$.println("base implements Stringer:", baseOK)

	let derived: any = $.interfaceValue<any>($.markAsStructValue(new Derived()), "main.Derived")
	let [, derivedOK] = $.typeAssertTuple<Stringer | null>(derived, "main.Stringer")
	$.println("derived implements Stringer:", derivedOK)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on named_struct_underlying_methodset.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

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
		new Base(),
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
		new Derived(),
		[{ name: "Own", args: [], returns: [] }],
		Derived,
		{}
	)
}

export type Stringer = null | {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export async function main(): Promise<void> {
	let base: any = $.markAsStructValue($.markAsStructValue(new Base()).clone())
	let [, baseOK] = $.typeAssertTuple<Stringer>(base, "main.Stringer")
	$.println("base implements Stringer:", baseOK)
	let derived: any = $.markAsStructValue($.markAsStructValue(new Derived()).clone())
	let [, derivedOK] = $.typeAssertTuple<Stringer>(derived, "main.Stringer")
	$.println("derived implements Stringer:", derivedOK)
}


if ($.isMainScript(import.meta)) {
	await main()
}

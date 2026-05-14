// Generated file based on inline_interface_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class Greeter {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): Greeter {
		const cloned = new Greeter()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Greet(): string {
		const g = this
		return "Hello from Greeter"
	}

	static __typeInfo = $.registerStructType(
		"main.Greeter",
		new Greeter(),
		[{ name: "Greet", args: [], returns: [] }],
		Greeter,
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

export class MyStringer {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): MyStringer {
		const cloned = new MyStringer()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public String(): string {
		const ms = this
		return "MyStringer implementation"
	}

	static __typeInfo = $.registerStructType(
		"main.MyStringer",
		new MyStringer(),
		[{ name: "String", args: [], returns: [] }],
		MyStringer,
		{}
	)
}

export async function main(): Promise<void> {
	let i: any = null
	i = $.markAsStructValue($.markAsStructValue(new Greeter()).clone())
	let [g, ok] = $.typeAssertTuple<any>(i, { kind: $.TypeKind.Interface, methods: [{ name: "Greet", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] })
	if (ok) {
		$.println("Greet assertion successful:", g!.Greet())
	} else {
		$.println("Greet assertion failed")
	}
	let [s, ok2] = $.typeAssertTuple<any>(i, { kind: $.TypeKind.Interface, methods: [{ name: "NonExistentMethod", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }] })
	if (ok2) {
		$.println("NonExistentMethod assertion successful (unexpected):", s!.NonExistentMethod())
	} else {
		$.println("NonExistentMethod assertion failed as expected")
	}
	let j: any = null
	j = $.markAsStructValue($.markAsStructValue(new MyStringer()).clone())
	let [inlineMs, ok4] = $.typeAssertTuple<any>(j, { kind: $.TypeKind.Interface, methods: [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] })
	if (ok4) {
		$.println("Inline String assertion successful:", inlineMs!.String())
	} else {
		$.println("Inline String assertion failed")
	}
	let k: Stringer = null
	k = $.markAsStructValue($.markAsStructValue(new MyStringer()).clone())
	let [inlineK, ok5] = $.typeAssertTuple<any>(k, { kind: $.TypeKind.Interface, methods: [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] })
	if (ok5) {
		$.println("k.(interface{ String() string }) successful:", inlineK!.String())
	} else {
		$.println("k.(interface{ String() string }) failed")
	}
	let l: any = $.typedNil("*struct{Name string}")
	let [ptr, ok6] = $.typeAssertTuple<$.VarRef<Record<string, unknown>> | null>(l, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Struct, methods: [], fields: {"Name": { kind: $.TypeKind.Basic, name: "string" }} } })
	if (ok6) {
		if (ptr == null) {
			$.println("l.(*struct{ Name string }) successful, ptr is nil as expected")
		} else {
			$.println("l.(*struct{ Name string }) successful, but ptr is not nil (unexpected)")
		}
	} else {
		$.println("l.(*struct{ Name string }) failed (unexpected)")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

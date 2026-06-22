// Generated file based on inline_interface_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Stringer = {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[{ name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

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
		() => new Greeter(),
		[{ name: "Greet", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		Greeter,
		[]
	)
}

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
		() => new MyStringer(),
		[{ name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		MyStringer,
		[]
	)
}

export async function main(): globalThis.Promise<void> {
	let i: any = null as any
	i = $.interfaceValue<any>($.markAsStructValue(new Greeter()), "main.Greeter")

	// Successful type assertion to an inline interface
	let [g, ok] = $.typeAssertTuple<any>(i, { kind: $.TypeKind.Interface, methods: [{ name: "Greet", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] })
	if (ok) {
		$.println("Greet assertion successful:", await $.pointerValue<any>(g).Greet())
	} else {
		$.println("Greet assertion failed")
	}

	// Failing type assertion to a different inline interface
	let [s, ok2] = $.typeAssertTuple<any>(i, { kind: $.TypeKind.Interface, methods: [{ name: "NonExistentMethod", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }] })
	if (ok2) {
		$.println("NonExistentMethod assertion successful (unexpected):", await $.pointerValue<any>(s).NonExistentMethod())
	} else {
		$.println("NonExistentMethod assertion failed as expected")
	}

	// Successful type assertion to a named interface, where the asserted value also implements an inline interface method
	let j: any = null as any
	j = $.interfaceValue<any>($.markAsStructValue(new MyStringer()), "main.MyStringer")

	// Assert 'j' (which holds MyStringer) to an inline interface that MyStringer satisfies.
	let [inlineMs, ok4] = $.typeAssertTuple<any>(j, { kind: $.TypeKind.Interface, methods: [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] })
	if (ok4) {
		$.println("Inline String assertion successful:", await $.pointerValue<any>(inlineMs).String())
	} else {
		$.println("Inline String assertion failed")
	}

	// Test case: variable of named interface type, asserted to inline interface
	let k: Stringer | null = null as Stringer | null
	k = $.interfaceValue<Stringer | null>($.markAsStructValue(new MyStringer()), "main.MyStringer")

	let [inlineK, ok5] = $.typeAssertTuple<any>(k, { kind: $.TypeKind.Interface, methods: [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] })
	if (ok5) {
		$.println("k.(interface{ String() string }) successful:", await $.pointerValue<any>(inlineK).String())
	} else {
		$.println("k.(interface{ String() string }) failed")
	}

	// Test case: nil value of an inline interface type assigned to interface{}
	let l: any = $.interfaceValue<any>(null, "*struct{Name string}")

	let [ptr, ok6] = $.typeAssertTuple<$.VarRef<{"Name": string}> | null>(l, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Struct, methods: [], fields: [{ name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }] } })
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

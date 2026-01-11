// Generated file based on inline_interface_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Greeter {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {}
	}

	public clone(): Greeter {
		const cloned = new Greeter()
		cloned._fields = {
		}
		return cloned
	}

	public Greet(): string {
		return "Hello from Greeter"
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Greeter',
	  new Greeter(),
	  [{ name: "Greet", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  Greeter,
	  {}
	);
}

export class MyStringer {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {}
	}

	public clone(): MyStringer {
		const cloned = new MyStringer()
		cloned._fields = {
		}
		return cloned
	}

	public String(): string {
		return "MyStringer implementation"
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.MyStringer',
	  new MyStringer(),
	  [{ name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  MyStringer,
	  {}
	);
}

export type Stringer = null | {
	String(): string
}

$.registerInterfaceType(
  'main.Stringer',
  null, // Zero value for interface is null
  [{ name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export async function main(): Promise<void> {
	let i: null | any = null
	i = $.markAsStructValue(new Greeter({}))

	// Successful type assertion to an inline interface
	let { value: g, ok: ok } = $.typeAssert<null | {
		Greet(): string
	}>(i, {kind: $.TypeKind.Interface, methods: [{ name: 'Greet', args: [], returns: [{ type: {kind: $.TypeKind.Basic, name: 'string'} }] }]})
	if (ok) {
		$.println("Greet assertion successful:", g!.Greet())
	} else {
		$.println("Greet assertion failed")
	}

	// Failing type assertion to a different inline interface
	let { value: s, ok: ok2 } = $.typeAssert<null | {
		NonExistentMethod(): number
	}>(i, {kind: $.TypeKind.Interface, methods: [{ name: 'NonExistentMethod', args: [], returns: [{ type: {kind: $.TypeKind.Basic, name: 'number'} }] }]})
	if (ok2) {
		$.println("NonExistentMethod assertion successful (unexpected):", s!.NonExistentMethod())
	} else {
		$.println("NonExistentMethod assertion failed as expected")
	}

	// Successful type assertion to a named interface, where the asserted value also implements an inline interface method
	let j: null | any = null
	j = $.markAsStructValue(new MyStringer({}))

	// Assert 'j' (which holds MyStringer) to an inline interface that MyStringer satisfies.
	let { value: inlineMs, ok: ok4 } = $.typeAssert<null | {
		String(): string
	}>(j, {kind: $.TypeKind.Interface, methods: [{ name: 'String', args: [], returns: [{ type: {kind: $.TypeKind.Basic, name: 'string'} }] }]})
	if (ok4) {
		$.println("Inline String assertion successful:", inlineMs!.String())
	} else {
		$.println("Inline String assertion failed")
	}

	// Test case: variable of named interface type, asserted to inline interface
	let k: Stringer = null
	k = $.markAsStructValue(new MyStringer({}))

	let { value: inlineK, ok: ok5 } = $.typeAssert<null | {
		String(): string
	}>(k, {kind: $.TypeKind.Interface, methods: [{ name: 'String', args: [], returns: [{ type: {kind: $.TypeKind.Basic, name: 'string'} }] }]})
	if (ok5) {
		$.println("k.(interface{ String() string }) successful:", inlineK!.String())
	} else {
		$.println("k.(interface{ String() string }) failed")
	}

	// Test case: nil value of an inline interface type assigned to interface{}
	let l: null | any = $.typedNil("*struct{Name string}")

	let { value: ptr, ok: ok6 } = $.typeAssert<{ Name?: string } | null>(l, {kind: $.TypeKind.Pointer, elemType: {kind: $.TypeKind.Struct, fields: {'Name': {kind: $.TypeKind.Basic, name: 'string'}}, methods: []}})
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


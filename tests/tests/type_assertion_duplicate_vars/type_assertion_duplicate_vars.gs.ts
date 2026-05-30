// Generated file based on type_assertion_duplicate_vars.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Interface = {
	Method(): string
}

$.registerInterfaceType(
	"main.Interface",
	null,
	[{ name: "Method", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export class ConcreteA {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): ConcreteA {
		const cloned = new ConcreteA()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Method(): string {
		const c = this
		return "A"
	}

	static __typeInfo = $.registerStructType(
		"main.ConcreteA",
		() => new ConcreteA(),
		[{ name: "Method", args: [], returns: [] }],
		ConcreteA,
		[]
	)
}

export class ConcreteB {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): ConcreteB {
		const cloned = new ConcreteB()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Method(): string {
		const c = this
		return "B"
	}

	static __typeInfo = $.registerStructType(
		"main.ConcreteB",
		() => new ConcreteB(),
		[{ name: "Method", args: [], returns: [] }],
		ConcreteB,
		[]
	)
}

export class Container {
	public get hasA(): boolean {
		return this._fields.hasA.value
	}
	public set hasA(value: boolean) {
		this._fields.hasA.value = value
	}

	public get hasB(): boolean {
		return this._fields.hasB.value
	}
	public set hasB(value: boolean) {
		this._fields.hasB.value = value
	}

	public _fields: {
		hasA: $.VarRef<boolean>
		hasB: $.VarRef<boolean>
	}

	constructor(init?: Partial<{hasA?: boolean, hasB?: boolean}>) {
		this._fields = {
			hasA: $.varRef(init?.hasA ?? false),
			hasB: $.varRef(init?.hasB ?? false)
		}
	}

	public clone(): Container {
		const cloned = new Container()
		cloned._fields = {
			hasA: $.varRef(this._fields.hasA.value),
			hasB: $.varRef(this._fields.hasB.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Container",
		() => new Container(),
		[],
		Container,
		[{ name: "hasA", key: "hasA", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/type_assertion_duplicate_vars", index: [0], offset: 0, exported: false }, { name: "hasB", key: "hasB", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/type_assertion_duplicate_vars", index: [1], offset: 1, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	let iface: Interface | null = $.interfaceValue<Interface | null>($.markAsStructValue(new ConcreteA()), "main.ConcreteA")

	let c: Container | $.VarRef<Container> | null = new Container()

	// Multiple type assertions that should generate unique variable names
	let __goscriptTuple0: any = $.typeAssertTuple<ConcreteA>(iface, "main.ConcreteA")
	$.pointerValue<Container>(c).hasA = __goscriptTuple0[1]
	let __goscriptTuple1: any = $.typeAssertTuple<ConcreteB>(iface, "main.ConcreteB")
	$.pointerValue<Container>(c).hasB = __goscriptTuple1[1]

	$.println("hasA:", $.pointerValue<Container>(c).hasA)
	$.println("hasB:", $.pointerValue<Container>(c).hasB)
}

if ($.isMainScript(import.meta)) {
	await main()
}

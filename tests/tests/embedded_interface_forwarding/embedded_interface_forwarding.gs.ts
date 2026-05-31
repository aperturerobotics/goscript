// Generated file based on embedded_interface_forwarding.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Adder = {
	Add(value: number): number
}

$.registerInterfaceType(
	"main.Adder",
	null,
	[{ name: "Add", args: [{ name: "value", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export class Box {
	public get Adder(): Adder | null {
		return this._fields.Adder.value
	}
	public set Adder(value: Adder | null) {
		this._fields.Adder.value = value
	}

	public _fields: {
		Adder: $.VarRef<Adder | null>
	}

	constructor(init?: Partial<{Adder?: Adder | null}>) {
		this._fields = {
			Adder: $.varRef(init?.Adder ?? null)
		}
	}

	public clone(): Box {
		const cloned = new Box()
		cloned._fields = {
			Adder: $.varRef(this._fields.Adder.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Add(value: any): any {
		return $.pointerValue<Exclude<Adder | null, null>>(this.Adder).Add(value)
	}

	static __typeInfo = $.registerStructType(
		"main.Box",
		() => new Box(),
		[{ name: "Add", args: [{ name: "value", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		Box,
		[{ name: "Adder", key: "Adder", type: "main.Adder", anonymous: true, index: [0], offset: 0, exported: true }]
	)
}

export class Counter {
	public get base(): number {
		return this._fields.base.value
	}
	public set base(value: number) {
		this._fields.base.value = value
	}

	public _fields: {
		base: $.VarRef<number>
	}

	constructor(init?: Partial<{base?: number}>) {
		this._fields = {
			base: $.varRef(init?.base ?? 0)
		}
	}

	public clone(): Counter {
		const cloned = new Counter()
		cloned._fields = {
			base: $.varRef(this._fields.base.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Add(value: number): number {
		const c: Counter | $.VarRef<Counter> | null = this
		return $.pointerValue<Counter>(c).base + value
	}

	static __typeInfo = $.registerStructType(
		"main.Counter",
		() => new Counter(),
		[{ name: "Add", args: [{ name: "value", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		Counter,
		[{ name: "base", key: "base", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/embedded_interface_forwarding", index: [0], offset: 0, exported: false }]
	)
}

export function call(adder: Adder | null): number {
	return $.pointerValue<Exclude<Adder, null>>(adder).Add(4)
}

export async function main(): globalThis.Promise<void> {
	let box: Box | $.VarRef<Box> | null = new Box({Adder: $.interfaceValue<Adder | null>(new Counter({base: 3}), "*main.Counter")})
	$.println($.pointerValue<Exclude<Adder, null>>($.pointerValue<Box>(box).Adder).Add(5))
	$.println(call($.interfaceValue<Adder | null>(box, "*main.Box")))
}

if ($.isMainScript(import.meta)) {
	await main()
}

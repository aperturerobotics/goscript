// Generated file based on variadic_pointer_interface_param.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Expr = {
	Value(): number
}

$.registerInterfaceType(
	"main.Expr",
	null,
	[{ name: "Value", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export class lit {
	public get n(): number {
		return this._fields.n.value
	}
	public set n(value: number) {
		this._fields.n.value = value
	}

	public _fields: {
		n: $.VarRef<number>
	}

	constructor(init?: Partial<{n?: number}>) {
		this._fields = {
			n: $.varRef(init?.n ?? (0 as unknown as number))
		}
	}

	public clone(): lit {
		const cloned = new lit()
		cloned._fields = {
			n: $.varRef(this._fields.n.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Value(): number {
		const l: lit | $.VarRef<lit> | null = this
		return $.pointerValue<lit>(l).n
	}

	static __typeInfo = $.registerStructType(
		"main.lit",
		() => new lit(),
		[{ name: "Value", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		lit,
		[{ name: "n", key: "n", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/variadic_pointer_interface_param", index: [0], offset: 0, exported: false }]
	)
}

export function replace(to: Expr | null, exprs: $.Slice<$.VarRef<Expr | null> | null>): boolean {
	for (let __goscriptRangeTarget0 = exprs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let expr = __goscriptRangeTarget0![__rangeIndex]
		if ($.pointerValue<Expr | null>(expr) == null) {
			continue
		}
		expr!.value = to
		return true
	}
	return false
}

export async function main(): globalThis.Promise<void> {
	let expr: $.VarRef<Expr | null> = $.varRef($.interfaceValue<Expr | null>(new lit({n: 1}), "*main.lit"))
	let next: Expr | null = $.interfaceValue<Expr | null>(new lit({n: 7}), "*main.lit")
	$.println(replace(next, $.arrayToSlice<$.VarRef<Expr | null> | null>([expr])), await $.pointerValue<Exclude<Expr, null>>(expr.value).Value())
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on struct_method_expression.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class worker {
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
			base: $.varRef(init?.base ?? (0 as unknown as number))
		}
	}

	public clone(): worker {
		const cloned = new worker()
		cloned._fields = {
			base: $.varRef(this._fields.base.value)
		}
		return $.markAsStructValue(cloned)
	}

	public add(v: number): number {
		const w: worker | $.VarRef<worker> | null = this
		return $.pointerValue<worker>(w).base + v
	}

	static __typeInfo = $.registerStructType(
		"main.worker",
		() => new worker(),
		[{ name: "add", args: [{ name: "v", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		worker,
		[{ name: "base", key: "base", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/struct_method_expression", index: [0], offset: 0, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	let fn: ((w: worker | $.VarRef<worker> | null, v: number) => number | globalThis.Promise<number>) | null = $.functionValue((w: worker | $.VarRef<worker> | null, v: number): number => $.pointerValue<worker>(w).add(v), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "main.worker" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	$.println("method expr:", await fn!(new worker({base: 5}), 7))
}

if ($.isMainScript(import.meta)) {
	await main()
}

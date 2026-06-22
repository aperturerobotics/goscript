// Generated file based on selector_expr_ok_variable.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Result {
	public get ok(): boolean {
		return this._fields.ok.value
	}
	public set ok(value: boolean) {
		this._fields.ok.value = value
	}

	public _fields: {
		ok: $.VarRef<boolean>
	}

	constructor(init?: Partial<{ok?: boolean}>) {
		this._fields = {
			ok: $.varRef(init?.ok ?? (false as unknown as boolean))
		}
	}

	public clone(): Result {
		const cloned = new Result()
		cloned._fields = {
			ok: $.varRef(this._fields.ok.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Result",
		() => new Result(),
		[],
		Result,
		[{ name: "ok", key: "ok", type: { kind: $.TypeKind.Basic, name: "bool" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let x: any = $.namedValueInterfaceValue<any>(42, "int", {}, { kind: $.TypeKind.Basic, name: "int" })
	let result = $.markAsStructValue(new Result())

	// This should trigger the error: ok expression is not an identifier: *ast.SelectorExpr
	// The 'ok' variable is result.ok (a selector expression) instead of a simple identifier
	let __goscriptTuple0: any = $.typeAssertTuple<number>(x, { kind: $.TypeKind.Basic, name: "int" })
	result.ok = __goscriptTuple0[1]

	$.println("Type assertion successful:", result.ok)
}

if ($.isMainScript(import.meta)) {
	await main()
}

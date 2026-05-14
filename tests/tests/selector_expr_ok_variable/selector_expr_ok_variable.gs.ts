// Generated file based on selector_expr_ok_variable.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

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
			ok: $.varRef(init?.ok ?? false)
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
		new Result(),
		[],
		Result,
		{"ok": { kind: $.TypeKind.Basic, name: "bool" }}
	)
}

export async function main(): Promise<void> {
	let x: any = 42
	let result = $.markAsStructValue(new Result())
	let __goscriptTuple279 = $.typeAssertTuple<number>(x, { kind: $.TypeKind.Basic, name: "int" })
	result.ok = __goscriptTuple279[1]
	$.println("Type assertion successful:", result.ok)
}


if ($.isMainScript(import.meta)) {
	await main()
}

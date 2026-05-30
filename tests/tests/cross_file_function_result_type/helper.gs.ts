// Generated file based on helper.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class token {
	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<number>
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: $.varRef(init?.value ?? 0)
		}
	}

	public clone(): token {
		const cloned = new token()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.token",
		() => new token(),
		[],
		token,
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/cross_file_function_result_type", index: [0], offset: 0, exported: false }]
	)
}

export function newToken(value: number): token | $.VarRef<token> | null {
	return new token({value: value})
}

export function consumeToken(tok: token | $.VarRef<token> | null): number {
	return $.pointerValue<token>(tok).value
}

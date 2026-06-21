// Generated file based on helper.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class helperState {
	public get text(): string {
		return this._fields.text.value
	}
	public set text(value: string) {
		this._fields.text.value = value
	}

	public _fields: {
		text: $.VarRef<string>
	}

	constructor(init?: Partial<{text?: string}>) {
		this._fields = {
			text: $.varRef(init?.text ?? ("" as unknown as string))
		}
	}

	public clone(): helperState {
		const cloned = new helperState()
		cloned._fields = {
			text: $.varRef(this._fields.text.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.helperState",
		() => new helperState(),
		[],
		helperState,
		[{ name: "text", key: "text", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/s4wave/goscript/tests/tests/cross_file_method_imports", index: [0], offset: 0, exported: false }]
	)
}

export function newHelperState(): helperState | $.VarRef<helperState> | null {
	return (() => { const __goscriptLiteralField0 = suffix(); return new helperState({text: __goscriptLiteralField0}) })()
}

export function suffix(): string {
	return "SCRIPT"
}

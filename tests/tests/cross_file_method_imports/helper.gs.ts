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
			text: $.varRef(init?.text ?? "")
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
		new helperState(),
		[],
		helperState,
		{"text": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export function newHelperState(): helperState | $.VarRef<helperState> | null {
	return new helperState({text: suffix()})
}

export function suffix(): string {
	return "SCRIPT"
}

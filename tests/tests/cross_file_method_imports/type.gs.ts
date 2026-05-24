// Generated file based on type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strings from "@goscript/strings/index.js"

import * as __goscript_helper from "./helper.gs.ts"

import * as __goscript_method from "./method.gs.ts"
import "@goscript/strings/index.js"
import "./helper.gs.ts"
import "./method.gs.ts"

export class label {
	public get value(): string {
		return this._fields.value.value
	}
	public set value(value: string) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<string>
	}

	constructor(init?: Partial<{value?: string}>) {
		this._fields = {
			value: $.varRef(init?.value ?? "")
		}
	}

	public clone(): label {
		const cloned = new label()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Format(): string {
		const l = this
		let state: __goscript_helper.helperState | $.VarRef<__goscript_helper.helperState> | null = __goscript_helper.newHelperState()
		return strings.ToUpper(l.value) + $.pointerValue<__goscript_helper.helperState>(state).text
	}

	static __typeInfo = $.registerStructType(
		"main.label",
		() => new label(),
		[{ name: "Format", args: [], returns: [] }],
		label,
		{"value": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export async function main(): globalThis.Promise<void> {
	let item = $.markAsStructValue(new label({value: "go"}))
	$.println($.markAsStructValue($.cloneStructValue(item)).Format())
}

if ($.isMainScript(import.meta)) {
	await main()
}

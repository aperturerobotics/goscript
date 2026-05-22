// Generated file based on promise_type_name_shadow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Promise {
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

	public clone(): Promise {
		const cloned = new Promise()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Promise",
		() => new Promise(),
		[],
		Promise,
		{"value": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export async function main(): globalThis.Promise<void> {
	let p = $.markAsStructValue(new Promise({value: "ok"}))
	$.println(p.value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

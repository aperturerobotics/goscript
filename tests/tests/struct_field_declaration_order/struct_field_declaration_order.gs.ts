// Generated file based on struct_field_declaration_order.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class inner {
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

	public clone(): inner {
		const cloned = new inner()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.inner",
		new inner(),
		[],
		inner,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class outer {
	public get inner(): inner {
		return this._fields.inner.value
	}
	public set inner(value: inner) {
		this._fields.inner.value = value
	}

	public _fields: {
		inner: $.VarRef<inner>
	}

	constructor(init?: Partial<{inner?: inner}>) {
		this._fields = {
			inner: $.varRef(init?.inner ? $.markAsStructValue(init.inner.clone()) : $.markAsStructValue(new inner()))
		}
	}

	public clone(): outer {
		const cloned = new outer()
		cloned._fields = {
			inner: $.varRef($.markAsStructValue(this._fields.inner.value.clone()))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.outer",
		new outer(),
		[],
		outer,
		{"inner": "main.inner"}
	)
}

export let defaultOuter: outer = $.markAsStructValue(new outer())

export async function main(): globalThis.Promise<void> {
	defaultOuter.inner.value = 7
	$.println(defaultOuter.inner.value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

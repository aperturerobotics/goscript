// Generated file based on promoted_method_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class base {
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

	public clone(): base {
		const cloned = new base()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Add(n: number): number {
		const b: base | $.VarRef<base> | null = this
		return $.pointerValue<base>(b).value + n
	}

	static __typeInfo = $.registerStructType(
		"main.base",
		new base(),
		[{ name: "Add", args: [], returns: [] }],
		base,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class wrapper {
	public get base(): base {
		return this._fields.base.value
	}
	public set base(value: base) {
		this._fields.base.value = value
	}

	public _fields: {
		base: $.VarRef<base>
	}

	constructor(init?: Partial<{base?: base}>) {
		this._fields = {
			base: $.varRef(init?.base ? $.markAsStructValue(init.base.clone()) : $.markAsStructValue(new base()))
		}
	}

	public clone(): wrapper {
		const cloned = new wrapper()
		cloned._fields = {
			base: $.varRef($.markAsStructValue(this._fields.base.value.clone()))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.wrapper",
		new wrapper(),
		[],
		wrapper,
		{"base": "main.base"}
	)
}

export async function main(): Promise<void> {
	let w = new wrapper({base: $.markAsStructValue(new base({value: 3}))})
	$.println($.pointerValue<wrapper>(w).base.Add(4))

	let add = ((__receiver) => (n: number) => __receiver.Add(n))($.pointerValue<wrapper>(w).base)
	$.println(add!(5))
}


if ($.isMainScript(import.meta)) {
	await main()
}

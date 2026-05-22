// Generated file based on function_result_async_compatible.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Value = null | {
	Value(): number
}

$.registerInterfaceType(
	"main.Value",
	null,
	[{ name: "Value", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
)

export class box {
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

	public clone(): box {
		const cloned = new box()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Value(): number {
		const b: box | $.VarRef<box> | null = this
		return $.pointerValue<box>(b).value
	}

	static __typeInfo = $.registerStructType(
		"main.box",
		new box(),
		[{ name: "Value", args: [], returns: [] }],
		box,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function asyncBox(): Promise<box | $.VarRef<box> | null> {
	let ch = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch, 7)
	return new box({value: await $.chanRecv(ch)})
}

export function unwrap(v: Value | null): Value | null {
	return v
}

export async function wrapNew(__typeArgs: $.GenericTypeArgs | undefined, newValue: (() => any | Promise<any>) | null): Promise<(() => Value | null | Promise<Value | null>) | null> {
	return $.functionValue(async (): Promise<Value | null> => {
		return unwrap(await newValue!())
	}, { kind: $.TypeKind.Function, params: [], results: ["main.Value"] })
}

export async function main(): Promise<void> {
	let fn = await wrapNew(undefined, asyncBox)
	$.println($.pointerValue<Exclude<Value, null>>(await fn!()).Value())
}


if ($.isMainScript(import.meta)) {
	await main()
}

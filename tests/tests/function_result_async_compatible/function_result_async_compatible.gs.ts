// Generated file based on function_result_async_compatible.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Value = {
	Value(): number
}

$.registerInterfaceType(
	"main.Value",
	null,
	[{ name: "Value", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

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
		() => new box(),
		[{ name: "Value", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		box,
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/function_result_async_compatible", index: [0], offset: 0, exported: false }]
	)
}

export async function asyncBox(): globalThis.Promise<box | $.VarRef<box> | null> {
	let ch: $.Channel<number> | null = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch, 7)
	return (await (async () => { const __goscriptLiteralField0 = await $.chanRecv(ch); return new box({value: __goscriptLiteralField0}) })())
}

export function unwrap(v: Value | null): Value | null {
	return v
}

export async function wrapNew(__typeArgs: $.GenericTypeArgs | undefined, newValue: (() => any | globalThis.Promise<any>) | null): globalThis.Promise<(() => Value | null | globalThis.Promise<Value | null>) | null> {
	return $.functionValue(async (): globalThis.Promise<Value | null> => {
		return unwrap((await newValue!() as Value | null))
	}, ({ kind: $.TypeKind.Function, params: [], results: ["main.Value"] } as $.FunctionTypeInfo))
}

export async function main(): globalThis.Promise<void> {
	let fn: (() => Value | null | globalThis.Promise<Value | null>) | null = await wrapNew(undefined, asyncBox)
	$.println($.pointerValue<Exclude<Value, null>>((await fn!())).Value())
}

if ($.isMainScript(import.meta)) {
	await main()
}

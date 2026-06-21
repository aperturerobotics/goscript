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
			value: $.varRef(init?.value ?? (0 as unknown as number))
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
		() => new base(),
		[{ name: "Add", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		base,
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/s4wave/goscript/tests/tests/promoted_method_call", index: [0], offset: 0, exported: false }]
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
			base: $.varRef(init?.base ? $.markAsStructValue($.cloneStructValue(init.base)) : $.markAsStructValue(new base()))
		}
	}

	public clone(): wrapper {
		const cloned = new wrapper()
		cloned._fields = {
			base: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.base.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Add(n: any): any {
		return $.pointerValue<base>(this.base).Add(n)
	}

	static __typeInfo = $.registerStructType(
		"main.wrapper",
		() => new wrapper(),
		[{ name: "Add", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		wrapper,
		[{ name: "base", key: "base", type: "main.base", pkgPath: "github.com/s4wave/goscript/tests/tests/promoted_method_call", anonymous: true, index: [0], offset: 0, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	let w: wrapper | $.VarRef<wrapper> | null = new wrapper({base: $.markAsStructValue(new base({value: 3}))})
	$.println($.pointerValue<wrapper>(w).base.Add(4))

	let add: ((n: number) => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => (n: number) => __receiver.Add(n))($.pointerValue<wrapper>(w).base), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	$.println(await add!(5))
}

if ($.isMainScript(import.meta)) {
	await main()
}

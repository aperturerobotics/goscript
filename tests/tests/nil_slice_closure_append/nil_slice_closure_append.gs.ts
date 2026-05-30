// Generated file based on nil_slice_closure_append.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
	public get Value(): number {
		return this._fields.Value.value
	}
	public set Value(value: number) {
		this._fields.Value.value = value
	}

	public _fields: {
		Value: $.VarRef<number>
	}

	constructor(init?: Partial<{Value?: number}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? 0)
		}
	}

	public clone(): item {
		const cloned = new item()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		[],
		item,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }]
	)
}

export async function fill(fn: ((_p0: number) => void) | null): globalThis.Promise<void> {
	await fn!(3)
}

export async function main(): globalThis.Promise<void> {
	let values: $.Slice<item> = null as $.Slice<item>
	await fill($.functionValue((value: number): void => {
		values = $.append(values, $.markAsStructValue(new item({Value: value})))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [] } as $.FunctionTypeInfo)))
	if ($.len(values) != 0) {
		$.println("first:", values![0].Value)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

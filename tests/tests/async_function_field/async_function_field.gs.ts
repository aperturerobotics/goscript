// Generated file based on async_function_field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"

export class loader {
	public get load(): ((_p0: string) => [any, boolean] | Promise<[any, boolean]>) | null {
		return this._fields.load.value
	}
	public set load(value: ((_p0: string) => [any, boolean] | Promise<[any, boolean]>) | null) {
		this._fields.load.value = value
	}

	public _fields: {
		load: $.VarRef<((_p0: string) => [any, boolean] | Promise<[any, boolean]>) | null>
	}

	constructor(init?: Partial<{load?: ((_p0: string) => [any, boolean] | Promise<[any, boolean]>) | null}>) {
		this._fields = {
			load: $.varRef(init?.load ?? null)
		}
	}

	public clone(): loader {
		const cloned = new loader()
		cloned._fields = {
			load: $.varRef(this._fields.load.value)
		}
		return $.markAsStructValue(cloned)
	}

	public getLoad(): ((_p0: string) => [any, boolean] | Promise<[any, boolean]>) | null {
		const l: loader | $.VarRef<loader> | null = this
		return $.pointerValue<loader>(l).load
	}

	static __typeInfo = $.registerStructType(
		"main.loader",
		new loader(),
		[{ name: "getLoad", args: [], returns: [] }],
		loader,
		{"load": { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Basic, name: "bool" }] }}
	)
}

export let cache: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export let defaultLoader: loader | $.VarRef<loader> | null = new loader({load: $.functionValue(async (key: string): Promise<[any, boolean]> => {
	return await cache.value.Load(key)
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Basic, name: "bool" }] })})

export async function lookup(key: string): Promise<[any, boolean]> {
	return await $.pointerValue<loader>(defaultLoader).load!(key)
}

export async function lookupViaGetter(key: string): Promise<[any, boolean]> {
	return await $.pointerValue<loader>(defaultLoader).getLoad()!(key)
}

export async function main(): Promise<void> {
	await cache.value.Store("answer", 42)
	let [value, ok] = await lookup("answer")
	if (ok) {
		$.println("value:", $.mustTypeAssert<number>(value, { kind: $.TypeKind.Basic, name: "int" }))
	}
	let [getterValue, getterOk] = await lookupViaGetter("answer")
	if (getterOk) {
		$.println("getter value:", $.mustTypeAssert<number>(getterValue, { kind: $.TypeKind.Basic, name: "int" }))
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

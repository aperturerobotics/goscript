// Generated file based on async_function_field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/sync/index.js"

export class loader {
	public get load(): ((_p0: string) => [any, boolean] | globalThis.Promise<[any, boolean]>) | null {
		return this._fields.load.value
	}
	public set load(value: ((_p0: string) => [any, boolean] | globalThis.Promise<[any, boolean]>) | null) {
		this._fields.load.value = value
	}

	public _fields: {
		load: $.VarRef<((_p0: string) => [any, boolean] | globalThis.Promise<[any, boolean]>) | null>
	}

	constructor(init?: Partial<{load?: ((_p0: string) => [any, boolean] | globalThis.Promise<[any, boolean]>) | null}>) {
		this._fields = {
			load: $.varRef(init?.load ?? (null as unknown as ((_p0: string) => [any, boolean] | globalThis.Promise<[any, boolean]>) | null))
		}
	}

	public clone(): loader {
		const cloned = new loader()
		cloned._fields = {
			load: $.varRef(this._fields.load.value)
		}
		return $.markAsStructValue(cloned)
	}

	public getLoad(): ((_p0: string) => [any, boolean] | globalThis.Promise<[any, boolean]>) | null {
		const l: loader | $.VarRef<loader> | null = this
		return $.pointerValue<loader>(l).load
	}

	static __typeInfo = $.registerStructType(
		"main.loader",
		() => new loader(),
		[{ name: "getLoad", args: [], returns: [{ name: "_r0", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo) }] }],
		loader,
		[{ name: "load", key: "load", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo), pkgPath: "github.com/s4wave/goscript/tests/tests/async_function_field", index: [0], offset: 0, exported: false }]
	)
}

export let cache: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export function __goscript_set_cache(__goscriptValue: sync.Map): void {
	cache.value = __goscriptValue
}

export let defaultLoader: loader | $.VarRef<loader> | null = new loader({load: $.functionValue(async (key: string): globalThis.Promise<[any, boolean]> => {
	return await cache.value.Load(key)
}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))})

export function __goscript_set_defaultLoader(__goscriptValue: loader | $.VarRef<loader> | null): void {
	defaultLoader = __goscriptValue
}

export async function lookup(key: string): globalThis.Promise<[any, boolean]> {
	return await $.pointerValue<loader>(defaultLoader).load!(key)
}

export async function lookupViaGetter(key: string): globalThis.Promise<[any, boolean]> {
	return await loader.prototype.getLoad.call(defaultLoader)!(key)
}

export async function main(): globalThis.Promise<void> {
	await cache.value.Store("answer", $.namedValueInterfaceValue<any>(42, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
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

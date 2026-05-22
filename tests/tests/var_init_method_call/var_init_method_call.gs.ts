// Generated file based on var_init_method_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class T {
	public get val(): number {
		return this._fields.val.value
	}
	public set val(value: number) {
		this._fields.val.value = value
	}

	public _fields: {
		val: $.VarRef<number>
	}

	constructor(init?: Partial<{val?: number}>) {
		this._fields = {
			val: $.varRef(init?.val ?? 0)
		}
	}

	public clone(): T {
		const cloned = new T()
		cloned._fields = {
			val: $.varRef(this._fields.val.value)
		}
		return $.markAsStructValue(cloned)
	}

	public WithDelta(delta: number): T | $.VarRef<T> | null {
		const t: T | $.VarRef<T> | null = this
		return new T({val: $.pointerValue<T>(t).val + delta})
	}

	static __typeInfo = $.registerStructType(
		"main.T",
		() => new T(),
		[{ name: "WithDelta", args: [], returns: [] }],
		T,
		{"val": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function NewT(v: number): T | $.VarRef<T> | null {
	return new T({val: v})
}

export let Base: T | $.VarRef<T> | null = NewT(10)

export function __goscript_set_Base(value: T | $.VarRef<T> | null): void {
	Base = value
}

export let Derived: T | $.VarRef<T> | null = $.pointerValue<T>(Base).WithDelta(5)

export function __goscript_set_Derived(value: T | $.VarRef<T> | null): void {
	Derived = value
}

export async function main(): globalThis.Promise<void> {
	$.println("Base:", $.pointerValue<T>(Base).val)
	$.println("Derived:", $.pointerValue<T>(Derived).val)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on shadowed_varref_pointer_receiver.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class locked {
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

	public clone(): locked {
		const cloned = new locked()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Inc(): void {
		let l: locked | $.VarRef<locked> | null = this
		$.pointerValue<locked>(l).value++
	}

	public Value(): number {
		const l: locked | $.VarRef<locked> | null = this
		return $.pointerValue<locked>(l).value
	}

	static __typeInfo = $.registerStructType(
		"main.locked",
		() => new locked(),
		[{ name: "Inc", args: [], returns: [] }, { name: "Value", args: [], returns: [] }],
		locked,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function newLocked(value: number): locked {
	return $.markAsStructValue(new locked({value: value}))
}

export async function main(): globalThis.Promise<void> {
	let __goscriptShadow0 = $.varRef($.markAsStructValue($.cloneStructValue(newLocked(1))))
	$.pointerValue<locked>(__goscriptShadow0.value).Inc()
	$.println($.pointerValue<locked>(__goscriptShadow0.value).Value())

	for (let __rangeIndex = 0; __rangeIndex < 1; __rangeIndex++) {
		let __goscriptShadow1 = $.varRef($.markAsStructValue($.cloneStructValue(newLocked(10))))
		$.pointerValue<locked>(__goscriptShadow1.value).Inc()
		$.println($.pointerValue<locked>(__goscriptShadow1.value).Value())
	}

	$.println($.pointerValue<locked>(__goscriptShadow0.value).Value())
}

if ($.isMainScript(import.meta)) {
	await main()
}

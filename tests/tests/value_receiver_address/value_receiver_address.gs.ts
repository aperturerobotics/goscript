// Generated file based on value_receiver_address.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Counter {
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

	public clone(): Counter {
		const cloned = new Counter()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public PointerAfterIncrement(): Counter | $.VarRef<Counter> | null {
		const c = $.varRef(this)
		c.value.value++
		return c
	}

	public Value(): number {
		const c: Counter | $.VarRef<Counter> | null = this
		return $.pointerValue<Counter>(c).value
	}

	static __typeInfo = $.registerStructType(
		"main.Counter",
		new Counter(),
		[{ name: "PointerAfterIncrement", args: [], returns: [] }, { name: "Value", args: [], returns: [] }],
		Counter,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): Promise<void> {
	let original = $.varRef($.markAsStructValue(new Counter({value: 10})))
	let pointerFromValue = $.markAsStructValue(original.value.clone()).PointerAfterIncrement()

	$.println("Value receiver pointer value:", $.pointerValue<Counter>(pointerFromValue).Value())
	$.println("Original after PointerAfterIncrement:", original.value.Value())
}


if ($.isMainScript(import.meta)) {
	await main()
}

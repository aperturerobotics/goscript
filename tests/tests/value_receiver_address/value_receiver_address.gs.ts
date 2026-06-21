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
			value: $.varRef(init?.value ?? (0 as unknown as number))
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
		let c = $.varRef(this)
		c.value.value++
		return c
	}

	public Value(): number {
		const c: Counter | $.VarRef<Counter> | null = this
		return $.pointerValue<Counter>(c).value
	}

	static __typeInfo = $.registerStructType(
		"main.Counter",
		() => new Counter(),
		[{ name: "PointerAfterIncrement", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "main.Counter" } }] }, { name: "Value", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		Counter,
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/s4wave/goscript/tests/tests/value_receiver_address", index: [0], offset: 0, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	let original = $.varRef($.markAsStructValue(new Counter({value: 10})))
	let pointerFromValue: Counter | $.VarRef<Counter> | null = $.markAsStructValue($.cloneStructValue(original.value)).PointerAfterIncrement()

	$.println("Value receiver pointer value:", Counter.prototype.Value.call(pointerFromValue))
	$.println("Original after PointerAfterIncrement:", original.value.Value())
}

if ($.isMainScript(import.meta)) {
	await main()
}

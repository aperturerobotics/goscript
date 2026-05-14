// Generated file based on method_binding.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

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

	public GetValue(): number {
		const c = this
		return $.pointerValue(c).value
	}

	public GetValueByValue(): number {
		const c = this
		return c.value
	}

	public Increment(): void {
		const c = this
		$.pointerValue(c).value++
	}

	public IncrementValue(): void {
		const c = this
		c.value++
	}

	static __typeInfo = $.registerStructType(
		"main.Counter",
		new Counter(),
		[{ name: "GetValue", args: [], returns: [] }, { name: "GetValueByValue", args: [], returns: [] }, { name: "Increment", args: [], returns: [] }, { name: "IncrementValue", args: [], returns: [] }],
		Counter,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function callFunction(fn: () => void): void {
	fn()
}

export function callFunctionWithReturn(fn: () => number): number {
	return fn()
}

export async function main(): Promise<void> {
	let counter = new Counter({value: 0})
	$.println("Initial value:", $.pointerValue(counter).GetValue())
	callFunction(((__receiver) => (...args: any[]) => __receiver.Increment(...args))($.pointerValue(counter)))
	$.println("After calling Increment via parameter:", $.pointerValue(counter).GetValue())
	let incrementFunc = ((__receiver) => (...args: any[]) => __receiver.Increment(...args))($.pointerValue(counter))
	incrementFunc()
	$.println("After calling Increment via variable:", $.pointerValue(counter).GetValue())
	let getValueFunc = ((__receiver) => (...args: any[]) => __receiver.GetValue(...args))($.pointerValue(counter))
	let value = getValueFunc()
	$.println("Value from assigned method:", value)
	let value2 = callFunctionWithReturn(((__receiver) => (...args: any[]) => __receiver.GetValue(...args))($.pointerValue(counter)))
	$.println("Value from method via parameter:", value2)
	let counter2 = $.markAsStructValue(new Counter({value: 10}))
	$.println("Initial value2:", $.markAsStructValue(counter2.clone()).GetValueByValue())
	callFunction(((__receiver) => (...args: any[]) => __receiver.IncrementValue(...args))($.markAsStructValue(counter2.clone())))
	$.println("After calling IncrementValue via parameter (should be unchanged):", $.markAsStructValue(counter2.clone()).GetValueByValue())
	let incrementValueFunc = ((__receiver) => (...args: any[]) => __receiver.IncrementValue(...args))($.markAsStructValue(counter2.clone()))
	incrementValueFunc()
	$.println("After calling IncrementValue via variable (should be unchanged):", $.markAsStructValue(counter2.clone()).GetValueByValue())
	let getValueByValueFunc = ((__receiver) => (...args: any[]) => __receiver.GetValueByValue(...args))($.markAsStructValue(counter2.clone()))
	let value3 = getValueByValueFunc()
	$.println("Value from assigned value method:", value3)
}


if ($.isMainScript(import.meta)) {
	await main()
}

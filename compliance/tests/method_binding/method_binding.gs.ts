// Generated file based on method_binding.go
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
		value: $.VarRef<number>;
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
		return cloned
	}

	public Increment(): void {
		const c = this
		c.value++
	}

	public GetValue(): number {
		const c = this
		return c.value
	}

	public IncrementValue(): void {
		const c = this
		c.value++
	}

	public GetValueByValue(): number {
		const c = this
		return c.value
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'Counter',
	  new Counter(),
	  [{ name: "Increment", args: [], returns: [] }, { name: "GetValue", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }] }, { name: "IncrementValue", args: [], returns: [] }, { name: "GetValueByValue", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }] }],
	  Counter,
	  {"value": { kind: $.TypeKind.Basic, name: "number" }}
	);
}

export function callFunction(fn: (() => void) | null): void {
	fn!()
}

export function callFunctionWithReturn(fn: (() => number) | null): number {
	return fn!()
}

export async function main(): Promise<void> {
	// Test with pointer receiver methods
	let counter = new Counter({value: 0})

	console.log("Initial value:", counter!.GetValue())

	// Test method binding when passed as parameter
	callFunction(counter!.Increment.bind(counter!))
	console.log("After calling Increment via parameter:", counter!.GetValue())

	// Test method binding when assigned to variable
	let incrementFunc = counter!.Increment.bind(counter!)
	incrementFunc!()
	console.log("After calling Increment via variable:", counter!.GetValue())

	// Test method with return value
	let getValueFunc = counter!.GetValue.bind(counter!)
	let value = getValueFunc!()
	console.log("Value from assigned method:", value)

	// Test with return value via parameter
	let value2 = callFunctionWithReturn(counter!.GetValue.bind(counter!))
	console.log("Value from method via parameter:", value2)

	// Test with value receiver methods
	let counter2 = $.markAsStructValue(new Counter({value: 10}))

	console.log("Initial value2:", counter2.GetValueByValue())

	// This should NOT modify the original counter2 since it's a value receiver
	callFunction(counter2.IncrementValue.bind($.markAsStructValue(counter2.clone())))
	console.log("After calling IncrementValue via parameter (should be unchanged):", counter2.GetValueByValue())

	// This should also NOT modify the original counter2
	let incrementValueFunc = counter2.IncrementValue.bind($.markAsStructValue(counter2.clone()))
	incrementValueFunc!()
	console.log("After calling IncrementValue via variable (should be unchanged):", counter2.GetValueByValue())

	// Test method with return value on value receiver
	let getValueByValueFunc = counter2.GetValueByValue.bind($.markAsStructValue(counter2.clone()))
	let value3 = getValueByValueFunc!()
	console.log("Value from assigned value method:", value3)
}


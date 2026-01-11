// Generated file based on promise_return_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as sync from "@goscript/sync/index.js"

export class AsyncData {
	public get mu(): sync.Mutex {
		return this._fields.mu.value
	}
	public set mu(value: sync.Mutex) {
		this._fields.mu.value = value
	}

	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		mu: $.VarRef<sync.Mutex>;
		value: $.VarRef<number>;
	}

	constructor(init?: Partial<{mu?: sync.Mutex, value?: number}>) {
		this._fields = {
			mu: $.varRef(init?.mu ? $.markAsStructValue(init.mu.clone()) : new sync.Mutex()),
			value: $.varRef(init?.value ?? 0)
		}
	}

	public clone(): AsyncData {
		const cloned = new AsyncData()
		cloned._fields = {
			mu: $.varRef($.markAsStructValue(this._fields.mu.value.clone())),
			value: $.varRef(this._fields.value.value)
		}
		return cloned
	}

	// This returns a value and should be async due to mutex
	public async GetValue(): Promise<number> {
		const d = this
		using __defer = new $.DisposableStack();
		await d.mu.Lock()
		__defer.defer(() => {
			d.mu.Unlock()
		});
		return d.value
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.AsyncData',
	  new AsyncData(),
	  [{ name: "GetValue", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }],
	  AsyncData,
	  {"mu": "Mutex", "value": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

// This should handle the Promise return type correctly
export async function processData(d: AsyncData | null): Promise<void> {
	// This should await the async method call
	let result = await d!.GetValue()
	fmt.Printf("Result: %d\n", result)
}

export async function main(): Promise<void> {
	let data = new AsyncData({value: 42})
	await processData(data)
}


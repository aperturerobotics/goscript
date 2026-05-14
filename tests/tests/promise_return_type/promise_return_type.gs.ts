// Generated file based on promise_return_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as fmt from "@goscript/fmt/index.ts"

import * as sync from "@goscript/sync/index.ts"

export class AsyncData {
	public get mu(): Mutex {
		return this._fields.mu.value
	}
	public set mu(value: Mutex) {
		this._fields.mu.value = value
	}

	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		mu: $.VarRef<Mutex>
		value: $.VarRef<number>
	}

	constructor(init?: Partial<{mu?: Mutex, value?: number}>) {
		this._fields = {
			mu: $.varRef(init?.mu ? $.markAsStructValue(init.mu.clone()) : $.markAsStructValue(new Mutex())),
			value: $.varRef(init?.value ?? 0)
		}
	}

	public clone(): AsyncData {
		const cloned = new AsyncData()
		cloned._fields = {
			mu: $.varRef($.markAsStructValue(this._fields.mu.value.clone())),
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async GetValue(): Promise<number> {
		const d = this
		using __defer = new $.DisposableStack()
		await $.pointerValue(d).mu.Lock()
		__defer.defer(() => { $.pointerValue(d).mu.Unlock() })
		return $.pointerValue(d).value
	}

	static __typeInfo = $.registerStructType(
		"main.AsyncData",
		new AsyncData(),
		[{ name: "GetValue", args: [], returns: [] }],
		AsyncData,
		{"mu": "sync.Mutex", "value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function processData(d: AsyncData | $.VarRef<AsyncData> | null): Promise<void> {
	let result = await $.pointerValue(d).GetValue()
	fmt.Printf("Result: %d\n", result)
}

export async function main(): Promise<void> {
	let data = new AsyncData({value: 42})
	await processData(data)
}


if ($.isMainScript(import.meta)) {
	await main()
}

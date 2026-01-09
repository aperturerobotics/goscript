// Generated file based on defer_async_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class AsyncResource {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		name: $.VarRef<string>;
	}

	constructor(init?: Partial<{name?: string}>) {
		this._fields = {
			name: $.varRef(init?.name ?? "")
		}
	}

	public clone(): AsyncResource {
		const cloned = new AsyncResource()
		cloned._fields = {
			name: $.varRef(this._fields.name.value)
		}
		return cloned
	}

	// Release is an async method that contains channel operations
	public async Release(): Promise<void> {
		const r = this
		let ch = $.makeChannel<boolean>(1, false, 'both')
		queueMicrotask(async () => {
			await $.chanSend(ch, true)
		})
		await $.chanRecv(ch)
		$.println("Released", r.name)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.AsyncResource',
	  new AsyncResource(),
	  [{ name: "Release", args: [], returns: [] }],
	  AsyncResource,
	  {"name": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export async function main(): Promise<void> {
	await using __defer = new $.AsyncDisposableStack();
	let res = new AsyncResource({name: "test"})
	__defer.defer(async () => {
		await res!.Release()
	});
	$.println("main function")
}


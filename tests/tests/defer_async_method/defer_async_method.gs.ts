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
		name: $.VarRef<string>
	}

	constructor(init?: Partial<{name?: string}>) {
		this._fields = {
			name: $.varRef(init?.name ?? ("" as unknown as string))
		}
	}

	public clone(): AsyncResource {
		const cloned = new AsyncResource()
		cloned._fields = {
			name: $.varRef(this._fields.name.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Release(): globalThis.Promise<void> {
		const r: AsyncResource | $.VarRef<AsyncResource> | null = this
		let ch: $.Channel<boolean> | null = $.makeChannel<boolean>(1, false, "both")
		queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
			await $.chanSend(ch, true)
		})() })
		await $.chanRecv(ch)
		$.println("Released", $.pointerValue<AsyncResource>(r).name)
	}

	static __typeInfo = $.registerStructType(
		"main.AsyncResource",
		() => new AsyncResource(),
		[{ name: "Release", args: [], returns: [] }],
		AsyncResource,
		[{ name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let res: AsyncResource | $.VarRef<AsyncResource> | null = new AsyncResource({name: "test"})
	__defer.defer(async () => { await AsyncResource.prototype.Release.call(res) })
	$.println("main function")
}

if ($.isMainScript(import.meta)) {
	await main()
}

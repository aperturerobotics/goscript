// Generated file based on goroutines_selector.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Foo {
	public get done(): $.Channel<boolean> | null {
		return this._fields.done.value
	}
	public set done(value: $.Channel<boolean> | null) {
		this._fields.done.value = value
	}

	public _fields: {
		done: $.VarRef<$.Channel<boolean> | null>
	}

	constructor(init?: Partial<{done?: $.Channel<boolean> | null}>) {
		this._fields = {
			done: $.varRef(init?.done ?? null)
		}
	}

	public clone(): Foo {
		const cloned = new Foo()
		cloned._fields = {
			done: $.varRef(this._fields.done.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Bar(): globalThis.Promise<void> {
		const f: Foo | $.VarRef<Foo> | null = this
		$.println("Foo.Bar called")
		await $.chanSend($.pointerValue<Foo>(f).done, true)
	}

	static __typeInfo = $.registerStructType(
		"main.Foo",
		() => new Foo(),
		[{ name: "Bar", args: [], returns: [] }],
		Foo,
		{"done": { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "bool" } }}
	)
}

export function NewFoo(): Foo | $.VarRef<Foo> | null {
	return new Foo({done: $.makeChannel<boolean>(0, false, "both")})
}

export async function main(): globalThis.Promise<void> {
	let f: Foo | $.VarRef<Foo> | null = NewFoo()
	queueMicrotask(async () => { await Foo.prototype.Bar.call(f) })
	await $.chanRecv($.pointerValue<Foo>(f).done)
	$.println("main done")
}

if ($.isMainScript(import.meta)) {
	await main()
}

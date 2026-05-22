// Generated file based on nested_async_method_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Spawner = null | {
	Spawn(): $.GoError
}

$.registerInterfaceType(
	"main.Spawner",
	null,
	[{ name: "Spawn", args: [], returns: [{ name: "_r0", type: "error" }] }]
)

export class Worker {
	public get ch(): $.Channel<number> | null {
		return this._fields.ch.value
	}
	public set ch(value: $.Channel<number> | null) {
		this._fields.ch.value = value
	}

	public _fields: {
		ch: $.VarRef<$.Channel<number> | null>
	}

	constructor(init?: Partial<{ch?: $.Channel<number> | null}>) {
		this._fields = {
			ch: $.varRef(init?.ch ?? null)
		}
	}

	public clone(): Worker {
		const cloned = new Worker()
		cloned._fields = {
			ch: $.varRef(this._fields.ch.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Spawn(): $.GoError {
		const w: Worker | $.VarRef<Worker> | null = this
		queueMicrotask(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
			await $.chanRecv($.pointerValue<Worker>(w).ch)
		}, { kind: $.TypeKind.Function, params: [], results: [] }))() })
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.Worker",
		new Worker(),
		[{ name: "Spawn", args: [], returns: [] }],
		Worker,
		{"ch": { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export async function run(fn: (() => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<void> {
	let err = await fn!()
	if (err == null) {
		$.println("func value err: nil")
	} else {
		$.println("func value err: non-nil")
	}
}

export async function main(): globalThis.Promise<void> {
	let w: Worker | $.VarRef<Worker> | null = new Worker({ch: $.makeChannel<number>(1, 0, "both")})
	await run(((__receiver) => () => __receiver.Spawn())($.pointerValue<Worker>(w)))

	let s: Spawner | null = $.interfaceValue<Spawner | null>(w, "*main.Worker")
	let err = $.pointerValue<Exclude<Spawner, null>>(s).Spawn()
	if (err == null) {
		$.println("iface err: nil")
	} else {
		$.println("iface err: non-nil")
	}
	await $.chanSend($.pointerValue<Worker>(w).ch, 1)
}


if ($.isMainScript(import.meta)) {
	await main()
}

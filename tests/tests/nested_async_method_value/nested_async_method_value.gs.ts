// Generated file based on nested_async_method_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

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

	public Spawn(): error {
		const w = this
		queueMicrotask(async () => { await (async (): Promise<void> => {
	await $.chanRecv($.pointerValue(w).ch)
})() })
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

export type Spawner = null | {
	Spawn(): error
}

$.registerInterfaceType(
	"main.Spawner",
	null,
	[{ name: "Spawn", args: [], returns: [{ name: "_r0", type: "error" }] }]
)

export function run(fn: () => error): void {
	let err = fn()
	if (err == null) {
		$.println("func value err: nil")
	} else {
		$.println("func value err: non-nil")
	}
}

export async function main(): Promise<void> {
	let w = new Worker({ch: $.makeChannel<number>(1, 0, "both")})
	run(((__receiver) => (...args: any[]) => __receiver.Spawn(...args))($.pointerValue(w)))
	let s: Spawner = w
	let err = s.Spawn()
	if (err == null) {
		$.println("iface err: nil")
	} else {
		$.println("iface err: non-nil")
	}
	await $.chanSend($.pointerValue(w).ch, 1)
}


if ($.isMainScript(import.meta)) {
	await main()
}

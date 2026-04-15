// Generated file based on nested_async_method_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Spawner = null | {
	Spawn(): $.GoError
}

$.registerInterfaceType(
  'main.Spawner',
  null, // Zero value for interface is null
  [{ name: "Spawn", args: [], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }]
);

export class Worker {
	public get ch(): $.Channel<number> | null {
		return this._fields.ch.value
	}
	public set ch(value: $.Channel<number> | null) {
		this._fields.ch.value = value
	}

	public _fields: {
		ch: $.VarRef<$.Channel<number> | null>;
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
		return cloned
	}

	public Spawn(): $.GoError {
		const w = this
		queueMicrotask(async () => {
			await $.chanRecv(w.ch)
		})
		return null
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Worker',
	  new Worker(),
	  [{ name: "Spawn", args: [], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  Worker,
	  {"ch": { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	);
}

export function run(fn: (() => $.GoError) | null): void {
	let err = fn!()
	if (err == null) {
		$.println("func value err: nil")
	} else {
		$.println("func value err: non-nil")
	}
}

export async function main(): Promise<void> {
	let w = new Worker({ch: $.makeChannel<number>(1, 0, 'both')})
	run(w!.Spawn.bind(w!))

	let s: Spawner = w
	let err = s!.Spawn()
	if (err == null) {
		$.println("iface err: nil")
	} else {
		$.println("iface err: non-nil")
	}
	await $.chanSend(w!.ch, 1)
}


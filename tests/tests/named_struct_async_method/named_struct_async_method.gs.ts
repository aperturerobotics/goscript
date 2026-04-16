// Generated file based on named_struct_async_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class coder {
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

	public clone(): coder {
		const cloned = new coder()
		cloned._fields = {
			ch: $.varRef(this._fields.ch.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.coder',
	  new coder(),
	  [],
	  coder,
	  {"ch": { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	);
}

export class decoder {
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
		const base = new coder(init)
		this._fields = base._fields
	}

	public clone(): decoder {
		const cloned = new decoder()
		cloned._fields = {
			ch: $.varRef(this._fields.ch.value)
		}
		return cloned
	}

	public async next(): Promise<void> {
		const d = this
		await $.chanRecv(d.ch)
	}

	public async value(n: number): Promise<void> {
		const d = this
		for (let i = 0; i < n; i++) {
			await d.value(0)
		}
		await d.next()
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  "main.decoder",
	  new decoder(),
	  [{ name: "next", args: [], returns: [] }, { name: "value", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }],
	  decoder,
	  {"ch": { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	);
}

export async function main(): Promise<void> {
	let d = new decoder({ch: $.makeChannel<number>(2, 0, 'both')})
	await $.chanSend(d!.ch, 1)
	await $.chanSend(d!.ch, 2)
	await d!.value(1)
	$.println("ok")
}


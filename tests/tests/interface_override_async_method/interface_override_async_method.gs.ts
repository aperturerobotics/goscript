// Generated file based on interface_override_async_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/io/index.js"

export class asyncReader {
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

	public clone(): asyncReader {
		const cloned = new asyncReader()
		cloned._fields = {
			ch: $.varRef(this._fields.ch.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Read(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const r = this
		await $.chanSend(r.ch, $.len(b))
		return [await $.chanRecv(r.ch), null]
	}

	static __typeInfo = $.registerStructType(
		"main.asyncReader",
		() => new asyncReader(),
		[{ name: "Read", args: [], returns: [] }],
		asyncReader,
		{"ch": { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export let Reader: io.Reader | null = $.interfaceValue<io.Reader | null>($.markAsStructValue(new asyncReader({ch: $.makeChannel<number>(1, 0, "both")})), "main.asyncReader")

export function __goscript_set_Reader(value: io.Reader | null): void {
	Reader = value
}

export async function main(): globalThis.Promise<void> {
	if (Reader == null) {
		$.println(0)
		return
	}
	$.println(3)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on map_interface_key_pointer_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Node = {
	Key(): string
}

$.registerInterfaceType(
	"main.Node",
	null,
	[{ name: "Key", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export class Table {
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
			name: $.varRef(init?.name ?? ("" as string))
		}
	}

	public clone(): Table {
		const cloned = new Table()
		cloned._fields = {
			name: $.varRef(this._fields.name.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Key(): string {
		const t: Table | $.VarRef<Table> | null = this
		return $.pointerValue<Table>(t).name
	}

	static __typeInfo = $.registerStructType(
		"main.Table",
		() => new Table(),
		[{ name: "Key", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		Table,
		[{ name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let node: Node | null = $.interfaceValue<Node | null>(new Table({name: "users"}), "*main.Table")
	let seen: globalThis.Map<Node | null, boolean> | null = new globalThis.Map<Node | null, boolean>([[node, true]])
	{
		let __goscriptTuple0: any = $.typeAssertTuple<Table | $.VarRef<Table> | null>(node, { kind: $.TypeKind.Pointer, elemType: "main.Table" })
		let table: Table | $.VarRef<Table> | null = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (ok) {
			let [value, found] = $.mapGet<Node | null, boolean, boolean>(seen, $.interfaceValue<Node | null>(table, "*main.Table"), false)
			$.println(value, found)
		}
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

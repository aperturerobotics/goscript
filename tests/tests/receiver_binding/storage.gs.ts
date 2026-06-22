// Generated file based on storage.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_methods from "./methods.gs.ts"
import "./methods.gs.ts"

export class storage {
	public get bytes(): $.Slice<number> {
		return this._fields.bytes.value
	}
	public set bytes(value: $.Slice<number>) {
		this._fields.bytes.value = value
	}

	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		bytes: $.VarRef<$.Slice<number>>
		name: $.VarRef<string>
	}

	constructor(init?: Partial<{bytes?: $.Slice<number>, name?: string}>) {
		this._fields = {
			bytes: $.varRef(init?.bytes ?? (null as unknown as $.Slice<number>)),
			name: $.varRef(init?.name ?? ("" as unknown as string))
		}
	}

	public clone(): storage {
		const cloned = new storage()
		cloned._fields = {
			bytes: $.varRef(this._fields.bytes.value),
			name: $.varRef(this._fields.name.value)
		}
		return $.markAsStructValue(cloned)
	}

	public IsEmpty(): boolean {
		const s: storage | $.VarRef<storage> | null = this
		return $.len($.pointerValue<storage>(s).bytes) == 0
	}

	public Len(): number {
		const s: storage | $.VarRef<storage> | null = this
		return $.len($.pointerValue<storage>(s).bytes)
	}

	public Name(): string {
		const s: storage | $.VarRef<storage> | null = this
		return $.pointerValue<storage>(s).name
	}

	public SetName(name: string): void {
		let s: storage | $.VarRef<storage> | null = this
		$.pointerValue<storage>(s).name = name
	}

	public Truncate(): void {
		let s: storage | $.VarRef<storage> | null = this
		$.pointerValue<storage>(s).bytes = $.makeSlice<number>(0, undefined, "byte")
	}

	static __typeInfo = $.registerStructType(
		"main.storage",
		() => new storage(),
		[{ name: "IsEmpty", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Len", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Name", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "SetName", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "Truncate", args: [], returns: [] }],
		storage,
		[{ name: "bytes", key: "bytes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let s: storage | $.VarRef<storage> | null = new storage({bytes: $.makeSlice<number>(5, undefined, "byte"), name: "test"})

	$.println("Name:", storage.prototype.Name.call(s))
	$.println("Length:", storage.prototype.Len.call(s))
	$.println("Empty:", storage.prototype.IsEmpty.call(s))

	storage.prototype.Truncate.call(s)
	$.println("Length after truncate:", storage.prototype.Len.call(s))

	storage.prototype.SetName.call(s, "new_name")
	$.println("New name:", storage.prototype.Name.call(s))
}

if ($.isMainScript(import.meta)) {
	await main()
}

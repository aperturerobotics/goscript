// Generated file based on storage.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_methods from "./methods.gs.ts"

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
			bytes: $.varRef(init?.bytes ?? null),
			name: $.varRef(init?.name ?? "")
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
		[{ name: "IsEmpty", args: [], returns: [] }, { name: "Len", args: [], returns: [] }, { name: "Name", args: [], returns: [] }, { name: "SetName", args: [], returns: [] }, { name: "Truncate", args: [], returns: [] }],
		storage,
		{"bytes": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "name": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export async function main(): globalThis.Promise<void> {
	let s: storage | $.VarRef<storage> | null = new storage({bytes: $.makeSlice<number>(5, undefined, "byte"), name: "test"})

	$.println("Name:", $.pointerValue<storage>(s).Name())
	$.println("Length:", $.pointerValue<storage>(s).Len())
	$.println("Empty:", $.pointerValue<storage>(s).IsEmpty())

	$.pointerValue<storage>(s).Truncate()
	$.println("Length after truncate:", $.pointerValue<storage>(s).Len())

	$.pointerValue<storage>(s).SetName("new_name")
	$.println("New name:", $.pointerValue<storage>(s).Name())
}

if ($.isMainScript(import.meta)) {
	await main()
}

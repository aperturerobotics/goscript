// Generated file based on address_taken_param_struct.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Format {
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public get Ext(): $.Slice<string> {
		return this._fields.Ext.value
	}
	public set Ext(value: $.Slice<string>) {
		this._fields.Ext.value = value
	}

	public _fields: {
		Name: $.VarRef<string>
		Ext: $.VarRef<$.Slice<string>>
	}

	constructor(init?: Partial<{Name?: string, Ext?: $.Slice<string>}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ""),
			Ext: $.varRef(init?.Ext ?? null)
		}
	}

	public clone(): Format {
		const cloned = new Format()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value),
			Ext: $.varRef(this._fields.Ext.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Format",
		new Format(),
		[],
		Format,
		{"Name": { kind: $.TypeKind.Basic, name: "string" }, "Ext": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }}
	)
}

export let byName: Map<string, Format | $.VarRef<Format> | null> | null = $.makeMap<string, Format | $.VarRef<Format> | null>()

export let byExt: Map<string, Format | $.VarRef<Format> | null> | null = $.makeMap<string, Format | $.VarRef<Format> | null>()

export function registerFormat(__goscriptParam0: Format): void {
	let f: $.VarRef<Format> = $.varRef(__goscriptParam0)
	$.mapSet(byName, f.value.Name, f)
	for (let __rangeIndex = 0; __rangeIndex < $.len(f.value.Ext); __rangeIndex++) {
		let ext = f.value.Ext![__rangeIndex]
		$.mapSet(byExt, ext, f)
	}
	f.value.Name = f.value.Name + "-updated"
}

export async function main(): Promise<void> {
	registerFormat($.markAsStructValue(new Format({Name: "json", Ext: $.arrayToSlice<string>(["json"])})))
	$.println($.pointerValue<Format>($.mapGet(byName, "json", null)[0]).Name)
	$.println($.pointerValue<Format>($.mapGet(byExt, "json", null)[0]).Name)
	$.pointerValue<Format>($.mapGet(byName, "json", null)[0]).Name = "mutated"
	$.println($.pointerValue<Format>($.mapGet(byExt, "json", null)[0]).Name)
}


if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on address_of_pointer_deref.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Col {
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public get Default(): $.VarRef<number> | null {
		return this._fields.Default.value
	}
	public set Default(value: $.VarRef<number> | null) {
		this._fields.Default.value = value
	}

	public _fields: {
		Name: $.VarRef<string>
		Default: $.VarRef<$.VarRef<number> | null>
	}

	constructor(init?: Partial<{Name?: string, Default?: $.VarRef<number> | null}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ("" as string)),
			Default: $.varRef(init?.Default ?? (null as $.VarRef<number> | null))
		}
	}

	public clone(): Col {
		const cloned = new Col()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value),
			Default: $.varRef(this._fields.Default.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Col",
		() => new Col(),
		[],
		Col,
		[{ name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "Default", key: "Default", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int" } } }]
	)
}

export function cloneColField(c: Col | $.VarRef<Col> | null): Col | $.VarRef<Col> | null {
	let out = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<Col>(c))))
	if (out.value.Default != null) {
		out.value.Default = out.value.Default
	}
	return out
}

export async function main(): globalThis.Promise<void> {
	let v = $.varRef(10)
	let p = v

	// Local: q := &*p must alias v, so writing through q changes v.
	let q = p
	q!.value = 20
	$.println("alias write through &*p:", v.value)

	// Field selector: out.Default = &(*out.Default) keeps the same pointee.
	let c: Col | $.VarRef<Col> | null = new Col({Name: "c", Default: v})
	let out: Col | $.VarRef<Col> | null = cloneColField(c)
	$.println("field alias same pointee:", $.pointerValue<Col>(out).Default == $.pointerValue<Col>(c).Default)
	$.pointerValue<Col>(out).Default!.value = 30
	$.println("field alias write:", v.value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

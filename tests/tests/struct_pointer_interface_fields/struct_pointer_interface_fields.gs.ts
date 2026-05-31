// Generated file based on struct_pointer_interface_fields.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyInterface = {
	Method(): void
}

$.registerInterfaceType(
	"main.MyInterface",
	null,
	[{ name: "Method", args: [], returns: [] }]
);

export class MyStruct {
	public get PointerField(): $.VarRef<number> | null {
		return this._fields.PointerField.value
	}
	public set PointerField(value: $.VarRef<number> | null) {
		this._fields.PointerField.value = value
	}

	public get interfaceField(): MyInterface | null {
		return this._fields.interfaceField.value
	}
	public set interfaceField(value: MyInterface | null) {
		this._fields.interfaceField.value = value
	}

	public _fields: {
		PointerField: $.VarRef<$.VarRef<number> | null>
		interfaceField: $.VarRef<MyInterface | null>
	}

	constructor(init?: Partial<{PointerField?: $.VarRef<number> | null, interfaceField?: MyInterface | null}>) {
		this._fields = {
			PointerField: $.varRef(init?.PointerField ?? null),
			interfaceField: $.varRef(init?.interfaceField ?? null)
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			PointerField: $.varRef(this._fields.PointerField.value),
			interfaceField: $.varRef(this._fields.interfaceField.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		[],
		MyStruct,
		[{ name: "PointerField", key: "PointerField", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int" } }, index: [0], offset: 0, exported: true }, { name: "interfaceField", key: "interfaceField", type: "main.MyInterface", pkgPath: "github.com/aperturerobotics/goscript/tests/tests/struct_pointer_interface_fields", index: [1], offset: 8, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	let s = $.markAsStructValue(new MyStruct())
	$.println(s.PointerField == null)
	$.println(s.interfaceField == null)

	let i = $.varRef(10)
	s.PointerField = i
	$.println(s.PointerField != null)
	$.println($.pointerValue<number>(s.PointerField))
	i.value = 15
	$.println($.pointerValue<number>(s.PointerField))

	let mi: MyInterface | null = null as MyInterface | null
	s.interfaceField = mi
	$.println(s.interfaceField == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}

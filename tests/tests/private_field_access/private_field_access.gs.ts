// Generated file based on private_field_access.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MyStruct {
	public get publicField(): string {
		return this._fields.publicField.value
	}
	public set publicField(value: string) {
		this._fields.publicField.value = value
	}

	public get privateField(): number {
		return this._fields.privateField.value
	}
	public set privateField(value: number) {
		this._fields.privateField.value = value
	}

	public _fields: {
		publicField: $.VarRef<string>
		privateField: $.VarRef<number>
	}

	constructor(init?: Partial<{publicField?: string, privateField?: number}>) {
		this._fields = {
			publicField: $.varRef(init?.publicField ?? ("" as unknown as string)),
			privateField: $.varRef(init?.privateField ?? (0 as unknown as number))
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			publicField: $.varRef(this._fields.publicField.value),
			privateField: $.varRef(this._fields.privateField.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		[],
		MyStruct,
		[{ name: "publicField", key: "publicField", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/private_field_access", index: [0], offset: 0, exported: false }, { name: "privateField", key: "privateField", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/private_field_access", index: [1], offset: 16, exported: false }]
	)
}

export function NewMyStruct(pub: string, priv: number): MyStruct {
	return $.markAsStructValue(new MyStruct({publicField: pub, privateField: priv}))
}

export function accessPrivateField(s: MyStruct): void {
	// Accessing privateField directly from a function in the same package
	// This should trigger the generation of the _private field
	$.println("Accessing privateField:", s.privateField)
}

export async function main(): globalThis.Promise<void> {
	let s = $.markAsStructValue($.cloneStructValue(NewMyStruct("hello", 123)))
	accessPrivateField($.markAsStructValue($.cloneStructValue(s)))
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on struct_private_field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MyStruct {
	public get myPrivate(): number {
		return this._fields.myPrivate.value
	}
	public set myPrivate(value: number) {
		this._fields.myPrivate.value = value
	}

	public _fields: {
		myPrivate: $.VarRef<number>
	}

	constructor(init?: Partial<{myPrivate?: number}>) {
		this._fields = {
			myPrivate: $.varRef(init?.myPrivate ?? (0 as unknown as number))
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			myPrivate: $.varRef(this._fields.myPrivate.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		[],
		MyStruct,
		[{ name: "myPrivate", key: "myPrivate", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let myStruct: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({myPrivate: 4})
	$.pointerValue<MyStruct>(myStruct).myPrivate = 10
	$.println($.pointerValue<MyStruct>(myStruct).myPrivate)
}

if ($.isMainScript(import.meta)) {
	await main()
}

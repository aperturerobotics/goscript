// Generated file based on reflect_struct_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as reflect from "@goscript/reflect/index.js"
import "@goscript/fmt/index.js"
import "@goscript/reflect/index.js"

export class Person {
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public get Age(): number {
		return this._fields.Age.value
	}
	public set Age(value: number) {
		this._fields.Age.value = value
	}

	public _fields: {
		Name: $.VarRef<string>
		Age: $.VarRef<number>
	}

	constructor(init?: Partial<{Name?: string, Age?: number}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ("" as string)),
			Age: $.varRef(init?.Age ?? (0 as number))
		}
	}

	public clone(): Person {
		const cloned = new Person()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value),
			Age: $.varRef(this._fields.Age.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Person",
		() => new Person(),
		[],
		Person,
		[{ name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "Age", key: "Age", type: { kind: $.TypeKind.Basic, name: "int" }, index: [1], offset: 16, exported: true }]
	)
}

export async function main(): globalThis.Promise<void> {
	let p = $.markAsStructValue(new Person({Name: "Alice", Age: 30}))
	let v = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(p)), "main.Person"))))
	if ($.markAsStructValue($.cloneStructValue(v)).Kind() == reflect.Struct) {
		let f = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Field(0)))
		fmt.Println($.markAsStructValue($.cloneStructValue(f)).String())
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

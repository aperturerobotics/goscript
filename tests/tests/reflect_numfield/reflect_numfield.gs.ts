// Generated file based on reflect_numfield.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as reflect from "@goscript/reflect/index.ts"

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

	public get Active(): boolean {
		return this._fields.Active.value
	}
	public set Active(value: boolean) {
		this._fields.Active.value = value
	}

	public _fields: {
		Name: $.VarRef<string>
		Age: $.VarRef<number>
		Active: $.VarRef<boolean>
	}

	constructor(init?: Partial<{Name?: string, Age?: number, Active?: boolean}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ""),
			Age: $.varRef(init?.Age ?? 0),
			Active: $.varRef(init?.Active ?? false)
		}
	}

	public clone(): Person {
		const cloned = new Person()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value),
			Age: $.varRef(this._fields.Age.value),
			Active: $.varRef(this._fields.Active.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Person",
		new Person(),
		[],
		Person,
		{"Name": { kind: $.TypeKind.Basic, name: "string" }, "Age": { kind: $.TypeKind.Basic, name: "int" }, "Active": { kind: $.TypeKind.Basic, name: "bool" }}
	)
}

export async function main(): Promise<void> {
	let t = reflect.TypeFor({T: { zero: () => new Person() }})
	$.println("Type:", t.Name())
	$.println("Kind:", reflect.Kind_String(t.Kind()))
	$.println("NumField:", t.NumField())
	for (let i = 0; i < t.NumField(); i++) {
		let f = $.markAsStructValue(t.Field(i).clone())
		$.println("Field", i, "Name:", f.Name)
		$.println("Field", i, "Tag:", f.Tag)
		let jsonTag = reflect.StructTag_Get(f.Tag, "json")
		$.println("Field", i, "JsonTag:", jsonTag)
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

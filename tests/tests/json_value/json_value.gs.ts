// Generated file based on json_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

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
		{"Name": { type: { kind: $.TypeKind.Basic, name: "string" }, tag: "json:\"name\"" }, "Age": { type: { kind: $.TypeKind.Basic, name: "int" }, tag: "json:\"age\"" }, "Active": { type: { kind: $.TypeKind.Basic, name: "bool" }, tag: "json:\"active\"" }}
	)
}

export async function main(): Promise<void> {
	let p = $.markAsStructValue(new Person({Name: "Alice", Age: 30, Active: true}))
	let v = $.markAsStructValue(reflect.ValueOf(p).clone())
	let t = $.markAsStructValue(v.clone()).Type()

	$.println("Type:", t!.Name())
	$.println("Kind:", reflect.Kind_String(t!.Kind()))
	$.println("NumField:", t!.NumField())

	for (let i = 0; i < t!.NumField(); i++) {
		let sf = $.markAsStructValue(t!.Field(i).clone())
		let fv = $.markAsStructValue($.markAsStructValue(v.clone()).Field(i).clone())

		$.println("Field", i, ":", sf.Name)
		$.println("  FieldValue Kind:", reflect.Kind_String($.markAsStructValue(fv.clone()).Kind()))
		$.println("  FieldValue CanInterface:", $.markAsStructValue(fv.clone()).CanInterface())

		switch ($.markAsStructValue(fv.clone()).Kind()) {
			case reflect.String:
			{
				$.println("  Value:", $.markAsStructValue(fv.clone()).String())
				break
			}
			case reflect.Int:
			case reflect.Int8:
			case reflect.Int16:
			case reflect.Int32:
			case reflect.Int64:
			{
				$.println("  Value:", $.markAsStructValue(fv.clone()).Int())
				break
			}
			case reflect.Bool:
			{
				$.println("  Value:", $.markAsStructValue(fv.clone()).Bool())
				break
			}
		}
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

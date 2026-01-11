// Generated file based on json_debug.go
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
		Name: $.VarRef<string>;
		Age: $.VarRef<number>;
		Active: $.VarRef<boolean>;
	}

	constructor(init?: Partial<{Active?: boolean, Age?: number, Name?: string}>) {
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
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Person',
	  new Person(),
	  [],
	  Person,
	  {"Name": { type: { kind: $.TypeKind.Basic, name: "string" }, tag: "json:\"name\"" }, "Age": { type: { kind: $.TypeKind.Basic, name: "int" }, tag: "json:\"age\"" }, "Active": { type: { kind: $.TypeKind.Basic, name: "bool" }, tag: "json:\"active\"" }}
	);
}

export async function main(): Promise<void> {
	let p = $.markAsStructValue(new Person({Active: true, Age: 30, Name: "Alice"}))
	let t = reflect.TypeOf(p)

	// Simulate what typeFields does
	$.println("NumField:", t!.NumField())

	// Simple tag parsing (similar to parseTag)
	for (let i = 0; i < t!.NumField(); i++) {
		let sf = $.markAsStructValue(t!.Field(i).clone())
		$.println("Field", i)
		$.println("  Name:", sf.Name)
		$.println("  Anonymous:", sf.Anonymous)
		$.println("  IsExported:", sf.IsExported())

		let tag = reflect.StructTag_Get(sf.Tag, "json")
		$.println("  Tag.Get(json):", tag)

		if (tag == "-") {
			$.println("  Skipping (tag is -)")
			continue
		}

		// Simple tag parsing (similar to parseTag)
		let name = tag
		{
			let idx = 0
			if (idx < $.len(tag)) {
				for (let i = 0; i < $.len(tag); i++) {
					if ($.indexString(tag, i) == 44) {
						name = $.sliceString(tag, undefined, i)
						break
					}
				}
			}
		}
		$.println("  Parsed name:", name)
	}
}


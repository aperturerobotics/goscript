// Generated file based on json_typefields.go
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

// Simulate what encoding/json typeFields does
export async function main(): Promise<void> {
	let t = reflect.TypeOf($.markAsStructValue(new Person({})))
	$.println("Type:", t!.Name())

	// Simulate typeFields logic
	class field {
		public get name(): string {
			return this._fields.name.value
		}
		public set name(value: string) {
			this._fields.name.value = value
		}

		public get tag(): boolean {
			return this._fields.tag.value
		}
		public set tag(value: boolean) {
			this._fields.tag.value = value
		}

		public _fields: {
			name: $.VarRef<string>;
			tag: $.VarRef<boolean>;
		}

		constructor(init?: Partial<{name?: string, tag?: boolean}>) {
			this._fields = {
				name: $.varRef(init?.name ?? ""),
				tag: $.varRef(init?.tag ?? false)
			}
		}

		public clone(): field {
			const cloned = new field()
			cloned._fields = {
				name: $.varRef(this._fields.name.value),
				tag: $.varRef(this._fields.tag.value)
			}
			return cloned
		}

		// Register this type with the runtime type system
		static __typeInfo = $.registerStructType(
		  'main.field',
		  new field(),
		  [],
		  field,
		  {"name": { kind: $.TypeKind.Basic, name: "string" }, "tag": { kind: $.TypeKind.Basic, name: "bool" }}
		);
	}

	let fields: $.Slice<field> = null

	// Parse tag to extract name before comma
	for (let i = 0; i < t!.NumField(); i++) {
		let sf = $.markAsStructValue(t!.Field(i).clone())
		$.println("Processing field", i, ":", sf.Name)
		$.println("  Anonymous:", sf.Anonymous)
		$.println("  IsExported:", sf.IsExported())

		if (sf.Anonymous) {
			$.println("  Skipping: Anonymous field")
			continue
		}
		if (!sf.IsExported()) {
			$.println("  Skipping: Unexported non-embedded field")
			continue
		}

		let tag = reflect.StructTag_Get(sf.Tag, "json")
		$.println("  Tag.Get(json):", tag)

		if (tag == "-") {
			$.println("  Skipping: Tag is -")
			continue
		}

		let name = tag
		// Parse tag to extract name before comma
		for (let j = 0; j < $.len(tag); j++) {
			if ($.indexString(tag, j) == 44) {
				name = $.sliceString(tag, undefined, j)
				break
			}
		}
		if (name == "") {
			name = sf.Name
		}
		$.println("  Final name:", name)

		fields = $.append(fields, $.markAsStructValue(new field({name: name, tag: tag != ""})))
	}

	$.println("=== Fields found ===")
	for (let i = 0; i < $.len(fields); i++) {
		let f = fields![i]
		{
			$.println("Field", i, "name:", f.name, "tagged:", f.tag)
		}
	}
}


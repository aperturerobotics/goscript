// Generated file based on json_typefields_flow.go
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

export class field {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public get typ(): null | reflect.Type {
		return this._fields.typ.value
	}
	public set typ(value: null | reflect.Type) {
		this._fields.typ.value = value
	}

	public _fields: {
		name: $.VarRef<string>;
		typ: $.VarRef<null | reflect.Type>;
	}

	constructor(init?: Partial<{name?: string, typ?: null | reflect.Type}>) {
		this._fields = {
			name: $.varRef(init?.name ?? ""),
			typ: $.varRef(init?.typ ?? null)
		}
	}

	public clone(): field {
		const cloned = new field()
		cloned._fields = {
			name: $.varRef(this._fields.name.value),
			typ: $.varRef(this._fields.typ.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.field',
	  new field(),
	  [],
	  field,
	  {"name": { kind: $.TypeKind.Basic, name: "string" }, "typ": "Type"}
	);
}

export async function main(): Promise<void> {
	let t = reflect.TypeOf($.markAsStructValue(new Person({})))

	// Mimic the exact flow of typeFields
	let next = $.arrayToSlice<field>([$.markAsStructValue(new field({typ: t}))])
	$.println("Initial next len:", $.len(next))
	$.println("next[0].typ:", next![0].typ!.Name())
	$.println("next[0].typ.NumField():", next![0].typ!.NumField())

	for (; $.len(next) > 0; ) {
		let current = next
		next = null

		$.println("Loop iteration, current len:", $.len(current))

		for (let _i = 0; _i < $.len(current); _i++) {
			let f = current![_i]
			{
				$.println("Processing field, typ:", f.typ!.Name())
				$.println("  NumField:", f.typ!.NumField())

				for (let i = 0; i < f.typ!.NumField(); i++) {
					let sf = $.markAsStructValue(f.typ!.Field(i).clone())
					$.println("  Struct field", i, ":", sf.Name)
					let tag = reflect.StructTag_Get(sf.Tag, "json")
					$.println("    Tag:", tag)
				}
			}
		}
	}
}


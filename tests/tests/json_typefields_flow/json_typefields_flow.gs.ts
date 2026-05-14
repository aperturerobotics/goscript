// Generated file based on json_typefields_flow.go
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

export class field {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public get typ(): Type {
		return this._fields.typ.value
	}
	public set typ(value: Type) {
		this._fields.typ.value = value
	}

	public _fields: {
		name: $.VarRef<string>
		typ: $.VarRef<Type>
	}

	constructor(init?: Partial<{name?: string, typ?: Type}>) {
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
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.field",
		new field(),
		[],
		field,
		{"name": { kind: $.TypeKind.Basic, name: "string" }, "typ": "reflect.Type"}
	)
}

export async function main(): Promise<void> {
	let t = reflect.TypeFor({T: { zero: () => new Person() }})
	let next = [$.markAsStructValue(new field({typ: t}))]
	$.println("Initial next len:", $.len(next))
	$.println("next[0].typ:", next[0].typ.Name())
	$.println("next[0].typ.NumField():", next[0].typ.NumField())
	while ($.len(next) > 0) {
		let current = next
		next = null
		$.println("Loop iteration, current len:", $.len(current))
		for (let __rangeIndex = 0; __rangeIndex < $.len(current); __rangeIndex++) {
			let f = current[__rangeIndex]
			$.println("Processing field, typ:", f.typ.Name())
			$.println("  NumField:", f.typ.NumField())
			for (let i = 0; i < f.typ.NumField(); i++) {
				let sf = $.markAsStructValue(f.typ.Field(i).clone())
				$.println("  Struct field", i, ":", sf.Name)
				let tag = reflect.StructTag_Get(sf.Tag, "json")
				$.println("    Tag:", tag)
			}
		}
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

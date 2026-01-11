// Generated file based on reflect_struct_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

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

	public _fields: {
		Name: $.VarRef<string>;
		Age: $.VarRef<number>;
	}

	constructor(init?: Partial<{Age?: number, Name?: string}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ""),
			Age: $.varRef(init?.Age ?? 0)
		}
	}

	public clone(): Person {
		const cloned = new Person()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value),
			Age: $.varRef(this._fields.Age.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Person',
	  new Person(),
	  [],
	  Person,
	  {"Name": { kind: $.TypeKind.Basic, name: "string" }, "Age": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export async function main(): Promise<void> {
	let p = $.markAsStructValue(new Person({Age: 30, Name: "Alice"}))
	let v = $.markAsStructValue(reflect.ValueOf(p).clone())
	if (v.Kind() == reflect.Struct) {
		let f = $.markAsStructValue(v.Field(0).clone())
		fmt.Println(f.String())
	}
}


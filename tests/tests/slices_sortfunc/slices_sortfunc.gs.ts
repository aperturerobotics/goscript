// Generated file based on slices_sortfunc.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"

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
	let people = $.arrayToSlice<Person>([$.markAsStructValue(new Person({Age: 30, Name: "Charlie"})), $.markAsStructValue(new Person({Age: 25, Name: "Alice"})), $.markAsStructValue(new Person({Age: 35, Name: "Bob"}))])

	slices.SortFunc(people, (a: Person, b: Person): number => {
		if (a.Age < b.Age) {
			return -1
		}
		if (a.Age > b.Age) {
			return 1
		}
		return 0
	})

	for (let _i = 0; _i < $.len(people); _i++) {
		let p = people![_i]
		{
			$.println(p.Name, p.Age)
		}
	}
}


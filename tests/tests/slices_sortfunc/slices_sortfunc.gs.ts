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
		Name: $.VarRef<string>
		Age: $.VarRef<number>
	}

	constructor(init?: Partial<{Name?: string, Age?: number}>) {
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
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Person",
		new Person(),
		[],
		Person,
		{"Name": { kind: $.TypeKind.Basic, name: "string" }, "Age": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): globalThis.Promise<void> {
	let people = $.arrayToSlice<Person>([$.markAsStructValue(new Person({Name: "Charlie", Age: 30})), $.markAsStructValue(new Person({Name: "Alice", Age: 25})), $.markAsStructValue(new Person({Name: "Bob", Age: 35}))])

	slices.SortFunc(people, $.functionValue((a: Person, b: Person): number => {
		if (a.Age < b.Age) {
			return -1
		}
		if (a.Age > b.Age) {
			return 1
		}
		return 0
	}, { kind: $.TypeKind.Function, params: ["main.Person", "main.Person"], results: [{ kind: $.TypeKind.Basic, name: "int" }] }))

	for (let __rangeIndex = 0; __rangeIndex < $.len(people); __rangeIndex++) {
		let p = people![__rangeIndex]
		$.println(p.Name, p.Age)
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

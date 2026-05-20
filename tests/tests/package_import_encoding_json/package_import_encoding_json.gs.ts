// Generated file based on package_import_encoding_json.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as json from "@goscript/encoding/json/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strconv from "@goscript/strconv/index.js"

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
	let results: $.Slice<string> = null

	// Marshal a simple struct
	let p = $.markAsStructValue(new Person({Name: "Alice", Age: 30, Active: true}))
	let [b, err] = json.Marshal(p)
	if (err != null) {
		results = $.append(results, "Marshal error: " + err!.Error())
	} else {
		results = $.append(results, "Marshal: " + $.bytesToString(b))
	}

	// Unmarshal into a struct
	let q: $.VarRef<Person> = $.varRef($.markAsStructValue(new Person()))
	{
		let err = json.Unmarshal($.stringToBytes("{\"name\":\"Bob\",\"age\":25,\"active\":false}"), q)
		if (err != null) {
			results = $.append(results, "Unmarshal struct error: " + err!.Error())
		} else {
			results = $.append(results, (((("Unmarshal struct: Name=" + q.value.Name) + ", Age=") + strconv.Itoa(q.value.Age)) + ", Active=") + strconv.FormatBool(q.value.Active))
		}
	}

	// Unmarshal into a map[string]any
	let m: $.VarRef<Map<string, any> | null> = $.varRef(null)
	{
		let err = json.Unmarshal($.stringToBytes("{\"name\":\"Carol\",\"age\":22,\"active\":true}"), m)
		if (err != null) {
			results = $.append(results, "Unmarshal map error: " + err!.Error())
		} else {
			let name = $.mustTypeAssert<string>($.mapGet(m.value, "name", null)[0], { kind: $.TypeKind.Basic, name: "string" })
			let age = $.int($.mustTypeAssert<number>($.mapGet(m.value, "age", null)[0], { kind: $.TypeKind.Basic, name: "int" }))
			let active = $.mustTypeAssert<boolean>($.mapGet(m.value, "active", null)[0], { kind: $.TypeKind.Basic, name: "bool" })
			results = $.append(results, (((("Unmarshal map: name=" + name) + ", age=") + strconv.Itoa(age)) + ", active=") + strconv.FormatBool(active))
		}
	}

	// Sort results for deterministic output
	slices.Sort(results)

	for (let __rangeIndex = 0; __rangeIndex < $.len(results); __rangeIndex++) {
		let r = results![__rangeIndex]
		$.println("JSON result:", r)
	}

	$.println("encoding/json test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}

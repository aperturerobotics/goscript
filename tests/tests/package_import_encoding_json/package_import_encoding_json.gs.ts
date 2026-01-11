// Generated file based on package_import_encoding_json.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as json from "@goscript/encoding/json/index.js"

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
	let results: $.Slice<string> = null

	// Marshal a simple struct
	let p = $.markAsStructValue(new Person({Active: true, Age: 30, Name: "Alice"}))
	let [b, err] = await json.Marshal(p)
	if (err != null) {
		results = $.append(results, "Marshal error: " + err!.Error())
	} else {
		results = $.append(results, "Marshal: " + $.bytesToString(b))
	}

	// Unmarshal into a struct
	let q: $.VarRef<Person> = $.varRef(new Person())
	{
		let err = await json.Unmarshal($.stringToBytes(`{"name":"Bob","age":25,"active":false}`), q)
		if (err != null) {
			results = $.append(results, "Unmarshal struct error: " + err!.Error())
		} else {
			results = $.append(results, "Unmarshal struct: Name=" + q!.value.Name + ", Age=" + itoa(q!.value.Age) + ", Active=" + boolstr(q!.value.Active))
		}
	}

	// Unmarshal into a map[string]any
	let m: $.VarRef<Map<string, null | any> | null> = $.varRef(null)
	{
		let err = await json.Unmarshal($.stringToBytes(`{"name":"Carol","age":22,"active":true}`), m)
		if (err != null) {
			results = $.append(results, "Unmarshal map error: " + err!.Error())
		} else {
			let name = $.mustTypeAssert<string>($.mapGet(m!.value, "name", null)[0], {kind: $.TypeKind.Basic, name: 'string'})
			let age = $.int($.mustTypeAssert<number>($.mapGet(m!.value, "age", null)[0], {kind: $.TypeKind.Basic, name: 'number'}))
			let active = $.mustTypeAssert<boolean>($.mapGet(m!.value, "active", null)[0], {kind: $.TypeKind.Basic, name: 'boolean'})
			results = $.append(results, "Unmarshal map: name=" + name + ", age=" + itoa(age) + ", active=" + boolstr(active))
		}
	}

	// Sort results for deterministic output
	slices.Sort(results)

	for (let _i = 0; _i < $.len(results); _i++) {
		let r = results![_i]
		{
			$.println("JSON result:", r)
		}
	}

	$.println("encoding/json test finished")
}

// minimal helpers to avoid imports
export function itoa(i: number): string {
	// simple positive int conversion sufficient for this test
	if (i == 0) {
		return "0"
	}
	let neg = false
	if (i < 0) {
		neg = true
		i = -i
	}
	let buf = $.makeSlice<number>(0, 20, 'byte')
	for (; i > 0; ) {
		let d = $.byte(i % 10)
		buf = $.append(buf, 48 + d)
		i = Math.trunc(i / 10)
	}
	// reverse
	for (let l = 0, r = $.len(buf) - 1; l < r; [l, r] = [l + 1, r - 1]) {
		;[buf![l], buf![r]] = [buf![r], buf![l]]
	}
	if (neg) {
		return "-" + $.bytesToString(buf)
	}
	return $.bytesToString(buf)
}

export function boolstr(b: boolean): string {
	if (b) {
		return "true"
	}
	return "false"
}


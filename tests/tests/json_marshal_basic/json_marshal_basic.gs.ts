// Generated file based on json_marshal_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as json from "@goscript/encoding/json/index.js"
import "@goscript/encoding/json/index.js"

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
			Name: $.varRef(init?.Name ?? ("" as unknown as string)),
			Age: $.varRef(init?.Age ?? (0 as unknown as number)),
			Active: $.varRef(init?.Active ?? (false as unknown as boolean))
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
		() => new Person(),
		[],
		Person,
		[{ name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" }, tag: "json:\"name\"", index: [0], offset: 0, exported: true }, { name: "Age", key: "Age", type: { kind: $.TypeKind.Basic, name: "int" }, tag: "json:\"age\"", index: [1], offset: 16, exported: true }, { name: "Active", key: "Active", type: { kind: $.TypeKind.Basic, name: "bool" }, tag: "json:\"active\"", index: [2], offset: 24, exported: true }]
	)
}

export async function main(): globalThis.Promise<void> {
	let p = $.markAsStructValue(new Person({Name: "Alice", Age: 30, Active: true}))
	let __goscriptTuple0: any = json.Marshal($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(p)), "main.Person"))
	let b: $.Slice<number> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		$.println("Marshal error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	} else {
		$.println("Marshal:", $.bytesToString(b))
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

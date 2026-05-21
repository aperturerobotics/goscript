// Generated file based on package_import_unique.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as _unique from "@goscript/unique/index.js"

export class zone {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		name: $.VarRef<string>
	}

	constructor(init?: Partial<{name?: string}>) {
		this._fields = {
			name: $.varRef(init?.name ?? "")
		}
	}

	public clone(): zone {
		const cloned = new zone()
		cloned._fields = {
			name: $.varRef(this._fields.name.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.zone",
		new zone(),
		[],
		zone,
		{"name": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export async function main(): Promise<void> {
	let a = $.markAsStructValue(_unique.Make($.markAsStructValue(new zone({name: "eth0"}))).clone())
	let b = $.markAsStructValue(_unique.Make($.markAsStructValue(new zone({name: "eth0"}))).clone())
	let c = $.markAsStructValue(_unique.Make($.markAsStructValue(new zone({name: "eth1"}))).clone())

	$.println(a == b)
	$.println(a == c)
	$.println($.markAsStructValue(a.clone()).Value().name)
}


if ($.isMainScript(import.meta)) {
	await main()
}

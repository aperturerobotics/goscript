// Generated file based on package_import_unique.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as _unique from "@goscript/unique/index.js"
import "@goscript/unique/index.js"

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
		() => new zone(),
		[],
		zone,
		{"name": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export async function main(): globalThis.Promise<void> {
	let a = $.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new zone({name: "eth0"})))))
	let b = $.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new zone({name: "eth0"})))))
	let c = $.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new zone({name: "eth1"})))))

	$.println(a == b)
	$.println(a == c)
	$.println($.markAsStructValue($.cloneStructValue(a)).Value().name)
}

if ($.isMainScript(import.meta)) {
	await main()
}

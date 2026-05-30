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
		[{ name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_import_unique", index: [0], offset: 0, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	let a = ($.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new zone({name: "eth0"}))))) as _unique.Handle<zone>)
	let b = ($.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new zone({name: "eth0"}))))) as _unique.Handle<zone>)
	let c = ($.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new zone({name: "eth1"}))))) as _unique.Handle<zone>)

	$.println($.comparableEqual(a, b))
	$.println($.comparableEqual(a, c))
	$.println($.markAsStructValue($.cloneStructValue(a)).Value().name)
}

if ($.isMainScript(import.meta)) {
	await main()
}

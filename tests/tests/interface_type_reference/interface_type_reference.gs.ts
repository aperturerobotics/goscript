// Generated file based on interface_type_reference.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as os from "@goscript/os/index.ts"

export type Basic = null | {
	Stat(filename: string): [FileInfo, error]
}

$.registerInterfaceType(
	"main.Basic",
	null,
	[{ name: "Stat", args: [{ name: "filename", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "fs.FileInfo" }, { name: "_r1", type: "error" }] }]
)

export class MyStorage {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): MyStorage {
		const cloned = new MyStorage()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Stat(filename: string): void {
		const s = this
		return [null, null]
	}

	static __typeInfo = $.registerStructType(
		"main.MyStorage",
		new MyStorage(),
		[{ name: "Stat", args: [], returns: [] }],
		MyStorage,
		{}
	)
}

export async function main(): Promise<void> {
	let b: Basic = $.markAsStructValue($.markAsStructValue(new MyStorage()).clone())
	let [, err] = b.Stat("test.txt")
	if (err == null) {
		$.println("Stat call successful")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

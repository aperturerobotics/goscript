// Generated file based on imported_interface_field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/io/index.js"

export class holder {
	public get w(): io.Writer | null {
		return this._fields.w.value
	}
	public set w(value: io.Writer | null) {
		this._fields.w.value = value
	}

	public _fields: {
		w: $.VarRef<io.Writer | null>
	}

	constructor(init?: Partial<{w?: io.Writer | null}>) {
		this._fields = {
			w: $.varRef(init?.w ?? null)
		}
	}

	public clone(): holder {
		const cloned = new holder()
		cloned._fields = {
			w: $.varRef(this._fields.w.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		[],
		holder,
		[{ name: "w", key: "w", type: "io.Writer", pkgPath: "github.com/aperturerobotics/goscript/tests/tests/imported_interface_field", index: [0], offset: 0, exported: false }]
	)
}

export function newHolder(w: io.Writer | null): holder | $.VarRef<holder> | null {
	return new holder({w: w})
}

export async function main(): globalThis.Promise<void> {
	let h: holder | $.VarRef<holder> | null = newHolder(null)
	if ($.pointerValue<holder>(h).w == null) {
		$.println("nil writer")
		return
	}
	$.println("writer present")
}

if ($.isMainScript(import.meta)) {
	await main()
}

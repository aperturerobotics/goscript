// Generated file based on package_import_reserved_alias.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as _unique from "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_reserved_alias/unique/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_reserved_alias/unique/index.js"

export class Holder {
	public get Box(): _unique.Box | $.VarRef<_unique.Box> | null {
		return this._fields.Box.value
	}
	public set Box(value: _unique.Box | $.VarRef<_unique.Box> | null) {
		this._fields.Box.value = value
	}

	public _fields: {
		Box: $.VarRef<_unique.Box | $.VarRef<_unique.Box> | null>
	}

	constructor(init?: Partial<{Box?: _unique.Box | $.VarRef<_unique.Box> | null}>) {
		this._fields = {
			Box: $.varRef(init?.Box ?? null)
		}
	}

	public clone(): Holder {
		const cloned = new Holder()
		cloned._fields = {
			Box: $.varRef(this._fields.Box.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Holder",
		() => new Holder(),
		[],
		Holder,
		[{ name: "Box", key: "Box", type: { kind: $.TypeKind.Pointer, elemType: "unique.Box" }, index: [0], offset: 0, exported: true }]
	)
}

export async function main(): globalThis.Promise<void> {
	let holder = (() => { const __goscriptLiteralField0 = _unique.NewBox(7); return $.markAsStructValue(new Holder({Box: __goscriptLiteralField0})) })()
	$.println("box:", $.pointerValue<_unique.Box>(holder.Box).Value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

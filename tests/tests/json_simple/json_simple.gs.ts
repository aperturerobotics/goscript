// Generated file based on json_simple.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as json from "@goscript/encoding/json/index.js"
import "@goscript/encoding/json/index.js"

export class Simple {
	public get X(): number {
		return this._fields.X.value
	}
	public set X(value: number) {
		this._fields.X.value = value
	}

	public _fields: {
		X: $.VarRef<number>
	}

	constructor(init?: Partial<{X?: number}>) {
		this._fields = {
			X: $.varRef(init?.X ?? (0 as unknown as number))
		}
	}

	public clone(): Simple {
		const cloned = new Simple()
		cloned._fields = {
			X: $.varRef(this._fields.X.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Simple",
		() => new Simple(),
		[],
		Simple,
		[{ name: "X", key: "X", type: { kind: $.TypeKind.Basic, name: "int" }, tag: "json:\"x\"" }]
	)
}

export async function main(): globalThis.Promise<void> {
	let s = $.markAsStructValue(new Simple({X: 42}))
	let __goscriptTuple0: any = json.Marshal($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(s)), "main.Simple"))
	let b: $.Slice<number> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		$.println("Error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	} else {
		$.println("Result:", $.bytesToString(b))
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

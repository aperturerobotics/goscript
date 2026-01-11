// Generated file based on json_simple.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as json from "@goscript/encoding/json/index.js"

export class Simple {
	public get X(): number {
		return this._fields.X.value
	}
	public set X(value: number) {
		this._fields.X.value = value
	}

	public _fields: {
		X: $.VarRef<number>;
	}

	constructor(init?: Partial<{X?: number}>) {
		this._fields = {
			X: $.varRef(init?.X ?? 0)
		}
	}

	public clone(): Simple {
		const cloned = new Simple()
		cloned._fields = {
			X: $.varRef(this._fields.X.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Simple',
	  new Simple(),
	  [],
	  Simple,
	  {"X": { type: { kind: $.TypeKind.Basic, name: "int" }, tag: "json:\"x\"" }}
	);
}

export async function main(): Promise<void> {
	let s = $.markAsStructValue(new Simple({X: 42}))
	let [b, err] = await json.Marshal(s)
	if (err != null) {
		$.println("Error:", err!.Error())
	} else {
		$.println("Result:", $.bytesToString(b))
	}
}


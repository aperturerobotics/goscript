// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class S {
	public get V(): number {
		return this._fields.V.value
	}
	public set V(value: number) {
		this._fields.V.value = value
	}

	public _fields: {
		V: $.VarRef<number>;
	}

	constructor(init?: Partial<{V?: number}>) {
		this._fields = {
			V: $.varRef(init?.V ?? 0)
		}
	}

	public clone(): S {
		const cloned = new S()
		cloned._fields = {
			V: $.varRef(this._fields.V.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'S',
	  new S(),
	  [],
	  S,
	  {"V": { kind: $.TypeKind.Basic, name: "number" }}
	);
}

let ch: $.Channel<number> | null = $.makeChannel<number>(1, 0, 'both')

// F is async due to channel send and returns *S
export async function F(): Promise<S | null> {
	await $.chanSend(ch, 1)
	return new S({V: 42})
}

export async function main(): Promise<void> {
	// Access field on call expression base
	// Should compile to (await F())!.V
	console.log((await F())!.V)
}


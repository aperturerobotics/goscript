// Generated file based on method_receiver_async_paren.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Thing {
	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<number>;
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: $.varRef(init?.value ?? 0)
		}
	}

	public clone(): Thing {
		const cloned = new Thing()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return cloned
	}

	// Use channels to make this async
	public async callIt(x: number): Promise<void> {
		const t = this
		let done = $.makeChannel<{  }>(0, {}, 'both')
		queueMicrotask(() => {
			;getFunc()!(t, x)
			done.close()
		})
		await $.chanRecv(done)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Thing',
	  new Thing(),
	  [{ name: "callIt", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }],
	  Thing,
	  {"value": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export function getFunc(): ((p0: Thing | null, p1: number) => void) | null {
	return (t: Thing | null, x: number): void => {
		t!.value += x
	}
}

export async function main(): Promise<void> {
	let thing = new Thing({value: 10})
	await thing!.callIt(32)
	$.println("Result:", thing!.value)
}


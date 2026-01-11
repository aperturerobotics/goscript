// Generated file based on method_async_dependency.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Decoder {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {}
	}

	public clone(): Decoder {
		const cloned = new Decoder()
		cloned._fields = {
		}
		return cloned
	}

	// value is async because it uses channels
	public async value(): Promise<$.GoError> {
		let ch = $.makeChannel<number>(1, 0, 'both') // Buffered channel to avoid deadlock
		await $.chanSend(ch, 42)
		return null
	}

	// array calls value, so it should also be async
	public async array(): Promise<$.GoError> {
		const d = this
		{
			let err = await d.value()
			if (err != null) {
				return err
			}
		}
		return null
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Decoder',
	  new Decoder(),
	  [{ name: "value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "array", args: [], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  Decoder,
	  {}
	);
}

export async function main(): Promise<void> {
	let d = new Decoder({})
	{
		let err = await d!.array()
		if (err != null) {
			$.println("Error:", err!.Error())
		} else {
			$.println("Success")
		}
	}
}


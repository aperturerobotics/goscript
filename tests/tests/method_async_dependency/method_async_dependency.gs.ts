// Generated file based on method_async_dependency.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class Decoder {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): Decoder {
		const cloned = new Decoder()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public async array(): Promise<error> {
		const d = this
		{
			let err = await $.pointerValue(d).value()
			if (err != null) {
				return err
			}
		}
		return null
	}

	public async value(): Promise<error> {
		const d = this
		let ch = $.makeChannel<number>(1, 0, "both")
		await $.chanSend(ch, 42)
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.Decoder",
		new Decoder(),
		[{ name: "array", args: [], returns: [] }, { name: "value", args: [], returns: [] }],
		Decoder,
		{}
	)
}

export async function main(): Promise<void> {
	let d = new Decoder()
	{
		let err = await $.pointerValue(d).array()
		if (err != null) {
			$.println("Error:", err.Error())
		} else {
			$.println("Success")
		}
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

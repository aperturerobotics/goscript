// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	class result {
		public get value(): number {
			return this._fields.value.value
		}
		public set value(value: number) {
			this._fields.value.value = value
		}

		public _fields: {
			value: $.VarRef<number>
		}

		constructor(init?: Partial<{value?: number}>) {
			this._fields = {
				value: $.varRef(init?.value ?? 0)
			}
		}

		public clone(): result {
			const cloned = new result()
			cloned._fields = {
				value: $.varRef(this._fields.value.value)
			}
			return $.markAsStructValue(cloned)
		}

		static __typeInfo = $.registerStructType(
			"main.result",
			new result(),
			[],
			result,
			{"value": { kind: $.TypeKind.Basic, name: "int" }}
		)
	}

	let ch = $.makeChannel<result>(1, $.markAsStructValue(new result()), "both")
	await $.chanSend(ch, $.markAsStructValue(new result({value: 7})))
	let got = await $.chanRecv(ch)
	$.println(got.value)
}


if ($.isMainScript(import.meta)) {
	await main()
}

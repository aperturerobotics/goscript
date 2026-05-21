// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
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
	let fn: (() => result | Promise<result>) | null = null
	fn = $.functionValue(async (): Promise<result> => {
		return $.markAsStructValue($.cloneStructValue(await $.chanRecv(ch)))
	}, { kind: $.TypeKind.Function, params: [], results: ["main.result"] })
	await $.chanSend(ch, $.markAsStructValue(new result({value: 8})))
	let got = $.markAsStructValue($.cloneStructValue(await fn!()))
	$.println(got.value)
}


if ($.isMainScript(import.meta)) {
	await main()
}

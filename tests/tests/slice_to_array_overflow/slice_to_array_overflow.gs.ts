// Generated file based on slice_to_array_overflow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function recoverMsg(label: string, fn: (() => void) | null): globalThis.Promise<void> {
	try {
		using __defer = new $.DisposableStack()
		__defer.defer(() => { ((): void => {
			{
				let r = $.recover()
				if (r != null) {
					{
						let [err, ok] = $.typeAssertTuple<$.GoError>(r, "error")
						if (ok) {
							$.println(label, $.pointerValue<Exclude<$.GoError, null>>(err).Error())
						} else {
							$.println(label, "non-error panic")
						}
					}
				}
			}
		})() })
		await fn!()
	} catch (e) {
		if (!$.recovered(e)) {
			throw e
		}
	}
}

export async function main(): globalThis.Promise<void> {
	await recoverMsg("array:", $.functionValue((): void => {
		let values: $.Slice<number> = $.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8)])
		let arr = ($.sliceToArray<number>(values, 4, "byte") as Uint8Array)
		$.println($.uint($.arrayIndex(arr, 0), 8))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await recoverMsg("pointer:", $.functionValue((): void => {
		let values: $.Slice<number> = $.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8)])
		let arr: $.VarRef<Uint8Array> | null = ($.sliceToArrayPointer<number>(values, 4, "byte") as $.VarRef<Uint8Array> | null)
		$.println($.uint($.arrayIndex($.pointerValue<Uint8Array>(arr), 0), 8))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	$.println("done")
}

if ($.isMainScript(import.meta)) {
	await main()
}

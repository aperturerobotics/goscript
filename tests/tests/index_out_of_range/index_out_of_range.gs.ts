// Generated file based on index_out_of_range.go
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
	await recoverMsg("slice:", $.functionValue((): void => {
		let s: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3])
		let i = 5
		$.println($.arrayIndex(s!, i))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await recoverMsg("array:", $.functionValue((): void => {
		let a: number[] = Array.from({ length: 3 }, () => 0)
		let i = 7
		$.println($.arrayIndex(a, i))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await recoverMsg("negative:", $.functionValue((): void => {
		let s: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3])
		let i = -1
		$.println($.arrayIndex(s!, i))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await recoverMsg("string:", $.functionValue((): void => {
		let s = "abc"
		let i = 9
		$.println($.uint($.indexStringOrBytes(s, i), 8))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await recoverMsg("string-negative:", $.functionValue((): void => {
		let s = "abc"
		let i = -1
		$.println($.uint($.indexStringOrBytes(s, i), 8))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await recoverMsg("bytes-negative:", $.functionValue((): void => {
		let b: $.Slice<number> = new Uint8Array([97, 98, 99])
		let i = -1
		$.println($.uint($.arrayIndex(b!, i), 8))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	$.println("done")
}

if ($.isMainScript(import.meta)) {
	await main()
}

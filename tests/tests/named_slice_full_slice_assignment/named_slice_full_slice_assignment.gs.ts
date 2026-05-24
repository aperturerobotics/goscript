// Generated file based on named_slice_full_slice_assignment.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type filters = $.Slice<number>

export function filters_size(f: filters): number {
	return $.len((f as filters))
}

export async function main(): globalThis.Promise<void> {
	let out: filters = null as filters
	let value = $.namedValueInterfaceValue<any>($.arrayToSlice<number>([1, 2, 3]), "main.filters", {size: (receiver: any, ...args: any[]) => (filters_size as any)($.pointerValue(receiver), ...args)})
	{
		let __goscriptTuple0: any = $.typeAssertTuple<filters>(value, "main.filters")
		let c: filters = (__goscriptTuple0[0] as filters)
		let ok = __goscriptTuple0[1]
		if (ok) {
			out = ($.goSlice(c, undefined, $.len((c as filters)), $.len((c as filters))) as filters)
		}
	}
	let raw: $.Slice<number> = $.arrayToSlice<number>([4, 5])
	let size = filters_size((raw as filters))
	$.println("len:", $.len((out as filters)))
	$.println("cap:", $.cap((out as filters)))
	$.println("size:", size)
}

if ($.isMainScript(import.meta)) {
	await main()
}

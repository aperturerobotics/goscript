// Generated file based on assign_op_asi_barrier.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function consume(v: $.VarRef<$.Slice<$.Slice<number>>> | null, n: number): void {
	while ($.len($.pointerValue<$.Slice<$.Slice<number>>>(v)) > 0) {
		let ln0 = $.int($.len(($.pointerValue<$.Slice<$.Slice<number>>>(v))![0]))
		if (ln0 > n) {
			($.pointerValue<$.Slice<$.Slice<number>>>(v))![0] = $.goSlice(($.pointerValue<$.Slice<$.Slice<number>>>(v))![0], n, undefined)
			return
		}
		n = $.uint64Sub(n, ln0);
		($.pointerValue<$.Slice<$.Slice<number>>>(v))![0] = null
		v!.value = $.goSlice(($.pointerValue<$.Slice<$.Slice<number>>>(v)), 1, undefined)
	}
}

export async function main(): globalThis.Promise<void> {
	let values: $.VarRef<$.Slice<$.Slice<number>>> = $.varRef($.arrayToSlice<$.Slice<number>>([$.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8)]), $.arrayToSlice<number>([$.uint(3, 8)])]))
	consume(values, 2)
	$.println($.len(values.value), values.value![0] == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}

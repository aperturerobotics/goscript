// Generated file based on star_compound_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let x: $.VarRef<number> = $.varRef(2)
	let p: $.VarRef<number> | null = x

	p!.value += 3
	$.println(x.value)

	p!.value = p!.value & ~(1)
	// 5 (0101) &^ 1 (0001) = 4 (0100)
	$.println(x.value)

	p!.value <<= 2
	$.println(x.value)

	p!.value >>= 1
	$.println(x.value)

	p!.value |= 3
	$.println(x.value)

	p!.value++
	$.println(x.value)

	p!.value--
	$.println(x.value)
}


if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on package_import_math_bits.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bits from "@goscript/math/bits/index.js"
import "@goscript/math/bits/index.js"

export async function main(): globalThis.Promise<void> {
	$.println(bits.UintSize)
	$.println(bits.Len($.uint("18446744073709551615", 64)))
	$.println(bits.LeadingZeros($.uint(1, 64)))
	let [lo, carry] = bits.Add($.uint("18446744073709551615", 64), 1, 0)
	$.println(lo == 0, carry)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on wide_and_not_constant.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// A wide (int64/uint64) &^ or &^= whose right operand is an untyped constant
	// lowers that constant to a JS number, while the left operand is a runtime
	// bigint. The raw "left & ~(right)" path mixed bigint and number and threw at
	// runtime, so wide AND-NOT must route through the typed helper. 1<<63 is the
	// exact math/rand/v2 Rand.Int64 pattern (clear the sign bit).
	let x: bigint = 18446744073709551615n
	let cleared = $.uint64AndNot(x, (9223372036854775808))
	$.println("cleared:", cleared)

	let y: bigint = 18446744073709551615n
	y = $.uint64AndNot(y, 4611686018427387904n)
	$.println("y:", y)

	let z: bigint = -1n
	z = $.int64AndNot(z, 4611686018427387904n)
	$.println("z:", z)
}

if ($.isMainScript(import.meta)) {
	await main()
}

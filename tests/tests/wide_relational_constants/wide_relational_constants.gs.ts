// Generated file based on wide_relational_constants.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Signed = bigint

export type Unsigned = bigint

export async function main(): globalThis.Promise<void> {
	let s: Signed = -9007199254740993n
	$.println("signed <", s < -9007199254740992n)
	$.println("signed <=", s <= -9007199254740993n)
	$.println("signed >", s > -9223372036854775808n)
	$.println("signed >=", s >= -9007199254740993n)

	let u: Unsigned = 9223372036854775808n
	$.println("unsigned <", u < 9223372036854775809n)
	$.println("unsigned <=", u <= 9223372036854775808n)
	$.println("unsigned >", u > 9007199254740993n)
	$.println("unsigned >=", u >= 9223372036854775808n)
}

if ($.isMainScript(import.meta)) {
	await main()
}

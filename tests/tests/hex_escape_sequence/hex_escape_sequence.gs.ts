// Generated file based on hex_escape_sequence.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let buf: $.Slice<number> = null
	buf = $.append(buf, `\x`)
	$.println("Appended raw string with \\x:", $.bytesToString(buf))
	let s1 = `\x`
	$.println("Raw string with \\x:", s1)
	let s2 = `\xG`
	$.println("Raw string with \\xG:", s2)
	let s3 = "\x41"
	$.println("Interpreted string:", s3)
}


if ($.isMainScript(import.meta)) {
	await main()
}

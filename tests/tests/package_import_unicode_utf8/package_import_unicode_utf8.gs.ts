// Generated file based on package_import_unicode_utf8.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as utf8 from "@goscript/unicode/utf8/index.ts"

export async function main(): Promise<void> {
	let s = "Hello, 世界"
	let count = utf8.RuneCountInString(s)
	$.println("Rune count:", count)
	let [r, size] = utf8.DecodeRuneInString(s)
	$.println("First rune:", r, "size:", size)
	let valid = utf8.ValidString(s)
	$.println("Valid UTF-8:", valid)
	let b = $.stringToBytes(s)
	let byteCount = utf8.RuneCount(b)
	$.println("Byte rune count:", byteCount)
	let [br, bsize] = utf8.DecodeRune(b)
	$.println("First rune from bytes:", br, "size:", bsize)
	let bvalid = utf8.Valid(b)
	$.println("Valid UTF-8 bytes:", bvalid)
	let buf: number[] = Array.from({ length: 4 }, () => 0)
	let n = utf8.EncodeRune($.goSlice(buf, undefined, undefined), 19990)
	$.println("Encoded rune size:", n)
	let runeLen = utf8.RuneLen(19990)
	$.println("Rune length:", runeLen)
	let validRune = utf8.ValidRune(19990)
	$.println("Valid rune:", validRune)
	$.println("RuneSelf:", utf8.RuneSelf)
	$.println("MaxRune:", utf8.MaxRune)
	$.println("UTFMax:", utf8.UTFMax)
}


if ($.isMainScript(import.meta)) {
	await main()
}

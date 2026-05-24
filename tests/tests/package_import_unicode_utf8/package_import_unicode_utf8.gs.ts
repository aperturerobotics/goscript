// Generated file based on package_import_unicode_utf8.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

export function checkBytes(label: string, b: $.Slice<number>): void {
	$.println(label, "RuneCount:", utf8.RuneCount(b))
	$.println(label, "Valid:", utf8.Valid(b))
	let __goscriptTuple0: any = utf8.DecodeLastRune(b)
	let r = $.int(__goscriptTuple0[0], 32)
	let size = __goscriptTuple0[1]
	$.println(label, "Last rune:", $.int(r, 32), "size:", size)
}

export async function main(): globalThis.Promise<void> {
	// Test basic UTF-8 functions
	let s = "Hello, 世界"

	// Test RuneCountInString
	let count = utf8.RuneCountInString(s)
	$.println("Rune count:", count)

	// Test DecodeRuneInString
	let __goscriptTuple1: any = utf8.DecodeRuneInString(s)
	let r = $.int(__goscriptTuple1[0], 32)
	let size = __goscriptTuple1[1]
	$.println("First rune:", $.int(r, 32), "size:", size)

	// Test ValidString
	let valid = utf8.ValidString(s)
	$.println("Valid UTF-8:", valid)

	// Test with bytes
	let b: $.Slice<number> = $.stringToBytes(s)

	// Test RuneCount
	let byteCount = utf8.RuneCount(b)
	$.println("Byte rune count:", byteCount)

	// Test DecodeRune
	let __goscriptTuple2: any = utf8.DecodeRune(b)
	let br = $.int(__goscriptTuple2[0], 32)
	let bsize = __goscriptTuple2[1]
	$.println("First rune from bytes:", $.int(br, 32), "size:", bsize)

	// Test Valid
	let bvalid = utf8.Valid(b)
	$.println("Valid UTF-8 bytes:", bvalid)
	checkBytes("param bytes", b)

	// Test EncodeRune
	let buf: Uint8Array = new Uint8Array(4)
	let n = utf8.EncodeRune($.goSlice(buf, undefined, undefined), $.int(19990, 32))
	$.println("Encoded rune size:", n)

	// Test RuneLen
	let runeLen = utf8.RuneLen($.int(19990, 32))
	$.println("Rune length:", runeLen)

	// Test ValidRune
	let validRune = utf8.ValidRune($.int(19990, 32))
	$.println("Valid rune:", validRune)

	// Test constants
	$.println("RuneSelf:", utf8.RuneSelf)
	$.println("MaxRune:", $.int(utf8.MaxRune, 32))
	$.println("UTFMax:", utf8.UTFMax)
}

if ($.isMainScript(import.meta)) {
	await main()
}

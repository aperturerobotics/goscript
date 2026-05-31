// Generated file based on unsafe_pointer_storage.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export function writeBytes(words: $.Slice<number>, bytes: $.Slice<number>): void {
	for (let __goscriptRangeTarget0 = bytes, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let b = __goscriptRangeTarget0![i]
		$.unsafePointerRef<number>(($.uint64Add($.indexByteAddress(words!, 0, 8), $.uint(i, 64)) as any)).value = $.uint(b, 8)
	}
}

export async function main(): globalThis.Promise<void> {
	$.println("unsafe pointer storage compiles")
}

if ($.isMainScript(import.meta)) {
	await main()
}

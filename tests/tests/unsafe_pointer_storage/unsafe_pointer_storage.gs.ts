// Generated file based on unsafe_pointer_storage.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"

export function writeBytes(words: $.Slice<number>, bytes: $.Slice<number>): void {
	for (let i = 0; i < $.len(bytes); i++) {
		let b = bytes![i]
		$.unsupportedPointerRef<number>(undefined).value = b
	}
}

export async function main(): Promise<void> {
	$.println("unsafe pointer storage compiles")
}


if ($.isMainScript(import.meta)) {
	await main()
}

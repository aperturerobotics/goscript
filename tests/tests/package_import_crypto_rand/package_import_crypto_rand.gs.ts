// Generated file based on package_import_crypto_rand.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as rand from "@goscript/crypto/rand/index.js"

import * as io from "@goscript/io/index.js"

export async function main(): Promise<void> {
	let buf = $.makeSlice<number>(32, undefined, "byte")
	let [n, err] = rand.Read(buf)
	$.println("read len", n)
	$.println("read err nil", err == null)
	$.println("read has data", hasData(buf))

	let r: io.Reader | null = rand.Reader
	let small = $.makeSlice<number>(4, undefined, "byte")
	let __goscriptTuple0 = $.pointerValue(r).Read(small)
	n = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	$.println("reader len", n)
	$.println("reader err nil", err == null)
	$.println("reader has data", hasData(small))

	let token = rand.Text()
	$.println("text len", $.len(token))
	$.println("text alphabet", isBase32(token))
}


if ($.isMainScript(import.meta)) {
	await main()
}

export function hasData(buf: $.Slice<number>): boolean {
	for (let __rangeIndex = 0; __rangeIndex < $.len(buf); __rangeIndex++) {
		let b = buf![__rangeIndex]
		if (b != 0) {
			return true
		}
	}
	return false
}

export function isBase32(token: string): boolean {
	for (let i = 0; i < $.len(token); i++) {
		let c = $.indexStringOrBytes(token, i)
		if (!(((c >= 65) && (c <= 90)) || ((c >= 50) && (c <= 55)))) {
			return false
		}
	}
	return true
}

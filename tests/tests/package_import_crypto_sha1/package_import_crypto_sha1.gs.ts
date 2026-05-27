// Generated file based on package_import_crypto_sha1.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sha1 from "@goscript/crypto/sha1/index.js"

import * as hash from "@goscript/hash/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/crypto/sha1/index.js"
import "@goscript/hash/index.js"
import "@goscript/io/index.js"

export async function main(): globalThis.Promise<void> {
	let sum = await sha1.Sum(new Uint8Array([97, 98, 99]))
	$.println("sum len", $.len(sum))
	$.println("sum first", $.uint(sum[0], 8))
	$.println("sum last", $.uint(sum[19], 8))

	let h: hash.Hash | null = sha1.New()
	let [n, err] = $.pointerValue<Exclude<hash.Hash, null>>(h).Write(new Uint8Array([97]))
	$.println("write a", n, err == null)
	let __goscriptTuple0: any = $.pointerValue<Exclude<hash.Hash, null>>(h).Write(new Uint8Array([98, 99]))
	n = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	$.println("write bc", n, err == null)
	let stream: $.Slice<number> = await $.pointerValue<Exclude<hash.Hash, null>>(h).Sum($.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8)]))
	$.println("stream len", $.len(stream))
	$.println("stream prefix", $.uint(stream![0], 8), $.uint(stream![1], 8))
	$.println("stream digest", $.uint(stream![2], 8), $.uint(stream![21], 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}

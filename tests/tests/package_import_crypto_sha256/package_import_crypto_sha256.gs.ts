// Generated file based on package_import_crypto_sha256.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sha256 from "@goscript/crypto/sha256/index.js"

import * as hash from "@goscript/hash/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/crypto/sha256/index.js"
import "@goscript/hash/index.js"
import "@goscript/io/index.js"

export async function main(): globalThis.Promise<void> {
	let sum = await sha256.Sum256(new Uint8Array([97, 98, 99]))
	$.println("sum len", $.len(sum))
	$.println("sum first", $.uint($.arrayIndex(sum, 0), 8))
	$.println("sum last", $.uint($.arrayIndex(sum, 31), 8))

	let h: hash.Hash | null = sha256.New()
	let [n, err] = await $.pointerValue<Exclude<hash.Hash, null>>(h).Write(new Uint8Array([97]))
	$.println("write a", n, err == null)
	let __goscriptTuple0: any = await $.pointerValue<Exclude<hash.Hash, null>>(h).Write(new Uint8Array([98, 99]))
	n = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	$.println("write bc", n, err == null)
	let stream: $.Slice<number> = await $.pointerValue<Exclude<hash.Hash, null>>(h).Sum($.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8)]))
	$.println("stream len", $.len(stream))
	$.println("stream prefix", $.uint($.arrayIndex(stream!, 0), 8), $.uint($.arrayIndex(stream!, 1), 8))
	$.println("stream digest", $.uint($.arrayIndex(stream!, 2), 8), $.uint($.arrayIndex(stream!, 33), 8))

	let backing: $.Slice<number> = $.makeSlice<number>(sha256.Size, undefined, "byte")
	let backed: $.Slice<number> = await $.pointerValue<Exclude<hash.Hash, null>>(h).Sum($.goSlice(backing, undefined, 0))
	$.println("backed len", $.len(backed), $.len(backing))
	$.println("backed digest", $.uint($.arrayIndex(backing!, 0), 8), $.uint($.arrayIndex(backing!, 31), 8), $.uint($.arrayIndex(backed!, 0), 8), $.uint($.arrayIndex(backed!, 31), 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}

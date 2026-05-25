// Generated file based on anonymous_struct_zero_unsafe.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export let linkinfo: {"Magic": Uint8Array, "Self": number, "Sects": {"Start": any, "End": any}[]} = {"Magic": new Uint8Array(2), "Self": 0, "Sects": Array.from({ length: 1 }, () => ({"Start": null, "End": null}))}

export function __goscript_set_linkinfo(value: {"Magic": Uint8Array, "Self": number, "Sects": {"Start": any, "End": any}[]}): void {
	linkinfo = value
}

export async function main(): globalThis.Promise<void> {
	$.println("magic len:", $.len(linkinfo.Magic))
	$.println("magic zero:", $.uint(linkinfo.Magic[0], 8))
	$.println("sects len:", $.len(linkinfo.Sects))
	$.println("pointer diff:", $.uint($.uint64Sub($.uint(linkinfo.Sects[0].End, 64), $.uint(linkinfo.Sects[0].Start, 64)), 64))
	$.println("start nil:", linkinfo.Sects[0].Start == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}

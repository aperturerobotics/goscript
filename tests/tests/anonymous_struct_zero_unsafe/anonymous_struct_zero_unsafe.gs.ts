// Generated file based on anonymous_struct_zero_unsafe.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"

export let linkinfo: {"Magic": number[], "Self": number, "Sects": {"Start": any, "End": any}[]} = {"Magic": Array.from({ length: 2 }, () => 0), "Self": 0, "Sects": Array.from({ length: 1 }, () => ({"Start": null, "End": null}))}

export async function main(): globalThis.Promise<void> {
	$.println("magic len:", $.len(linkinfo.Magic))
	$.println("magic zero:", linkinfo.Magic[0])
	$.println("sects len:", $.len(linkinfo.Sects))
	$.println("pointer diff:", $.int(linkinfo.Sects[0].End) - $.int(linkinfo.Sects[0].Start))
	$.println("start nil:", linkinfo.Sects[0].Start == null)
}


if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on build_tags.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as __goscript_build_tags_generic from "./build_tags_generic.gs.ts"

import * as __goscript_build_tags_js from "./build_tags_js.gs.ts"

export async function main(): Promise<void> {
	$.println("=== Build Tags Test ===")
	__goscript_build_tags_js.testJSWasm()
	__goscript_build_tags_generic.testGeneric()
	$.println("=== End Build Tags Test ===")
}


if ($.isMainScript(import.meta)) {
	await main()
}

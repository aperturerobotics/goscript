// Generated file based on build_tags.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_build_tags_generic from "./build_tags_generic.gs.ts"

import * as __goscript_build_tags_js from "./build_tags_js.gs.ts"

export async function main(): globalThis.Promise<void> {
	$.println("=== Build Tags Test ===")

	// Test that platform-specific files are handled correctly
	// This should only compile files with js/wasm build tags
	// and exclude files with other platform tags

	__goscript_build_tags_js.testJSWasm()
	__goscript_build_tags_generic.testGeneric()

	$.println("=== End Build Tags Test ===")
}

if ($.isMainScript(import.meta)) {
	await main()
}

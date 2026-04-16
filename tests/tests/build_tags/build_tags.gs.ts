// Generated file based on build_tags.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"
import { testGeneric } from "./build_tags_generic.gs.ts";
import { testJSWasm } from "./build_tags_js.gs.ts";

export async function main(): Promise<void> {
	$.println("=== Build Tags Test ===")

	// Test that platform-specific files are handled correctly
	// This should only compile files with js/wasm build tags
	// and exclude files with other platform tags

	testJSWasm()
	testGeneric()

	$.println("=== End Build Tags Test ===")
}


// Generated file based on package_import.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subpkg from "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import/subpkg/index.js"

export async function main(): Promise<void> {
	$.println(subpkg.Greet("world"))
}


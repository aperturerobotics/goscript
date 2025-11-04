// Generated file based on package_import_go_scanner.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as scanner from "@goscript/go/scanner/index.js"

import * as token from "@goscript/go/token/index.js"

export async function main(): Promise<void> {
	// Use scanner package functionality that should generate imports
	let errorList: $.VarRef<scanner.ErrorList> = $.varRef(null)

	// This should require importing both scanner and token packages
	let pos = $.markAsStructValue(new token.Position({Column: 1, Filename: "test.go", Line: 1}))
	scanner.ErrorList_Add(errorList, pos, "test error")

	fmt.Printf("ErrorList length: %d\n", $.len(errorList!.value))
}


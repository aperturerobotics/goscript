// Generated file based on import_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"

import * as filepath from "@goscript/path/filepath/index.js"

// This test demonstrates the issue where os.FileInfo gets expanded
// to its full type definition instead of preserving the interface name
export function walkFunction(path: string, info: null | os.FileInfo, walkFn: filepath.WalkFunc | null): $.GoError {
	// Simple test function that takes os.FileInfo as parameter
	if (info != null) {
		$.println("File:", info!.Name())
	}
	;[, ] = [path, walkFn]
	return null
}

// Also test as a return type
export function getFileInfo(): [null | os.FileInfo, $.GoError] {
	return [null, null]
}

export async function main(): Promise<void> {
	// Test os.FileInfo interface is preserved in function signatures
	$.println("Testing os.FileInfo interface preservation")
	walkFunction(".", null, null)

	let [info, err] = getFileInfo()
	if (err == null && info != null) {
		$.println("Got FileInfo:", info!.Name())
	}
}


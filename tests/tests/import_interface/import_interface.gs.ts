// Generated file based on import_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as os from "@goscript/os/index.ts"

import * as filepath from "@goscript/path/filepath/index.ts"

export function walkFunction(path: string, info: FileInfo, walkFn: WalkFunc): error {
	if (info != null) {
		$.println("File:", info.Name())
	}
	let __goscriptAssign4194051_0 = path
	let __goscriptAssign4194051_1 = walkFn
	return null
}

export function getFileInfo(): void {
	return [null, null]
}

export async function main(): Promise<void> {
	$.println("Testing os.FileInfo interface preservation")
	walkFunction(".", null, null)
	let [info, err] = getFileInfo()
	if (err == null && info != null) {
		$.println("Got FileInfo:", info.Name())
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

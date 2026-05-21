// Generated file based on type_separate_files.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_memory from "./memory.gs.ts"

import * as __goscript_storage from "./storage.gs.ts"

export async function main(): Promise<void> {
	let s = $.markAsStructValue(new __goscript_storage.storage({files: $.makeMap<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null>(), children: $.makeMap<string, Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null>()}))

	let f: __goscript_memory.file | $.VarRef<__goscript_memory.file> | null = new __goscript_memory.file({name: "test.txt", data: $.stringToBytes("hello world")})

	$.mapSet(s.files, "test", f)

	$.println("Created storage with file:", $.pointerValue<__goscript_memory.file>($.mapGet(s.files, "test", null)[0]).name)
}


if ($.isMainScript(import.meta)) {
	await main()
}

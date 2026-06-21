// Generated file based on type_separate_files.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_memory from "./memory.gs.ts"

import * as __goscript_storage from "./storage.gs.ts"
import "./memory.gs.ts"
import "./storage.gs.ts"

export async function main(): globalThis.Promise<void> {
	let s = $.markAsStructValue(new __goscript_storage.storage({files: $.makeMap<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null>(), children: $.makeMap<string, globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null>()}))

	let f: __goscript_memory.file | $.VarRef<__goscript_memory.file> | null = new __goscript_memory.file({name: "test.txt", data: new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100])})

	$.mapSet(s.files, "test", f)

	$.println("Created storage with file:", $.pointerValue<__goscript_memory.file>($.mapGet<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null>(s.files, "test", null)[0]).name)
}

if ($.isMainScript(import.meta)) {
	await main()
}

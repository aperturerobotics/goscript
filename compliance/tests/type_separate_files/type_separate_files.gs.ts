// Generated file based on type_separate_files.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import { file } from "./memory.gs.js";
import { storage } from "./storage.gs.js";

export async function main(): Promise<void> {
	let s = $.markAsStructValue(new storage({children: $.makeMap<string, Map<string, file | null> | null>(), files: $.makeMap<string, file | null>()}))

	let f = new file({data: $.stringToBytes("hello world"), name: "test.txt"})

	$.mapSet(s.files, "test", f)

	$.println("Created storage with file:", $.mapGet(s.files, "test", null)[0]!.name)
}


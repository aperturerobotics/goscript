// Generated file based on package_import_path.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as path from "@goscript/path/index.ts"

export async function main(): Promise<void> {
	let cleaned = path.Clean("/a/b/../c/./d")
	$.println("Clean result:", cleaned)
	let joined = path.Join("a", "b", "c")
	$.println("Join result:", joined)
	let base = path.Base("/a/b/c.txt")
	$.println("Base result:", base)
	let dir = path.Dir("/a/b/c.txt")
	$.println("Dir result:", dir)
	let ext = path.Ext("/a/b/c.txt")
	$.println("Ext result:", ext)
	let isAbs = path.IsAbs("/a/b/c")
	$.println("IsAbs result:", isAbs)
	let [dir2, file] = path.Split("/a/b/c.txt")
	$.println("Split dir:", dir2)
	$.println("Split file:", file)
	let [matched, err] = path.Match("*.txt", "file.txt")
	if (err != null) {
		$.println("Match error:", err!.Error())
	} else {
		$.println("Match result:", matched)
	}
	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}

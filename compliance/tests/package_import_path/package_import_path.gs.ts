// Generated file based on package_import_path.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as path from "@goscript/path/index.js"

export async function main(): Promise<void> {
	// Test Clean function
	let cleaned = path.Clean("/a/b/../c/./d")
	$.println("Clean result:", cleaned)

	// Test Join function
	let joined = path.Join("a", "b", "c")
	$.println("Join result:", joined)

	// Test Base function
	let base = path.Base("/a/b/c.txt")
	$.println("Base result:", base)

	// Test Dir function
	let dir = path.Dir("/a/b/c.txt")
	$.println("Dir result:", dir)

	// Test Ext function
	let ext = path.Ext("/a/b/c.txt")
	$.println("Ext result:", ext)

	// Test IsAbs function
	let isAbs = path.IsAbs("/a/b/c")
	$.println("IsAbs result:", isAbs)

	// Test Split function
	let [dir2, file] = path.Split("/a/b/c.txt")
	$.println("Split dir:", dir2)
	$.println("Split file:", file)

	// Test Match function
	let [matched, err] = path.Match("*.txt", "file.txt")
	if (err != null) {
		$.println("Match error:", err!.Error())
	} else {
		$.println("Match result:", matched)
	}

	$.println("test finished")
}


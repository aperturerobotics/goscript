// Generated file based on package_import_path_filepath.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as filepath from "@goscript/path/filepath/index.ts"

export async function main(): Promise<void> {
	let path = "dir/subdir/file.txt"
	let base = filepath.Base(path)
	$.println("Base:", base)
	let dir = filepath.Dir(path)
	$.println("Dir:", dir)
	let ext = filepath.Ext(path)
	$.println("Ext:", ext)
	let dirty = "dir//subdir/../subdir/./file.txt"
	let clean = filepath.Clean(dirty)
	$.println("Clean:", clean)
	let joined = filepath.Join("dir", "subdir", "file.txt")
	$.println("Join:", joined)
	let [dir2, file] = filepath.Split(path)
	$.println("Split dir:", dir2)
	$.println("Split file:", file)
	let abs = filepath.IsAbs("/absolute/path")
	$.println("IsAbs /absolute/path:", abs)
	let rel = filepath.IsAbs("relative/path")
	$.println("IsAbs relative/path:", rel)
	let windowsPath = "dir\\subdir\\file.txt"
	let slashed = filepath.ToSlash(windowsPath)
	$.println("ToSlash:", slashed)
	let backslashed = filepath.FromSlash("dir/subdir/file.txt")
	$.println("FromSlash:", backslashed)
	let vol = filepath.VolumeName("C:\\Windows\\System32")
	$.println("VolumeName:", vol)
	let [matched, err] = filepath.Match("*.txt", "file.txt")
	if (err == null) {
		$.println("Match *.txt file.txt:", matched)
	}
	let [matched2, err2] = filepath.Match("dir/*", "dir/file.txt")
	if (err2 == null) {
		$.println("Match dir/* dir/file.txt:", matched2)
	}
	let hasPrefix = filepath.HasPrefix("/usr/local/bin", "/usr/local")
	$.println("HasPrefix /usr/local/bin /usr/local:", hasPrefix)
	let local = filepath.IsLocal("file.txt")
	$.println("IsLocal file.txt:", local)
	let nonLocal = filepath.IsLocal("../file.txt")
	$.println("IsLocal ../file.txt:", nonLocal)
	let pathList = "/usr/bin:/usr/local/bin:/bin"
	let split = filepath.SplitList(pathList)
	$.println("SplitList length:", $.len(split))
	for (let i = 0; i < $.len(split); i++) {
		let p = split![i]
		$.println("SplitList", i, ":", p)
	}
	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}

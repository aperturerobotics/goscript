// Generated file based on package_import_io_fs.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fs from "@goscript/io/fs/index.js"

export async function main(): Promise<void> {
	// Test ValidPath function
	let valid1 = fs.ValidPath("hello/world.txt")
	$.println("ValidPath('hello/world.txt'):", valid1)

	let valid2 = fs.ValidPath("../invalid")
	$.println("ValidPath('../invalid'):", valid2)

	let valid3 = fs.ValidPath(".")
	$.println("ValidPath('.'):", valid3)

	let valid4 = fs.ValidPath("")
	$.println("ValidPath(''):", valid4)

	// Test error constants
	$.println("ErrInvalid:", fs.ErrInvalid!.Error())
	$.println("ErrNotExist:", fs.ErrNotExist!.Error())
	$.println("ErrExist:", fs.ErrExist!.Error())
	$.println("ErrPermission:", fs.ErrPermission!.Error())
	$.println("ErrClosed:", fs.ErrClosed!.Error())

	// Test all FileMode constants
	$.println("ModeDir:", $.int(fs.ModeDir))
	$.println("ModeAppend:", $.int(fs.ModeAppend))
	$.println("ModeExclusive:", $.int(fs.ModeExclusive))
	$.println("ModeTemporary:", $.int(fs.ModeTemporary))
	$.println("ModeSymlink:", $.int(fs.ModeSymlink))
	$.println("ModeDevice:", $.int(fs.ModeDevice))
	$.println("ModeNamedPipe:", $.int(fs.ModeNamedPipe))
	$.println("ModeSocket:", $.int(fs.ModeSocket))
	$.println("ModeSetuid:", $.int(fs.ModeSetuid))
	$.println("ModeSetgid:", $.int(fs.ModeSetgid))
	$.println("ModeCharDevice:", $.int(fs.ModeCharDevice))
	$.println("ModeSticky:", $.int(fs.ModeSticky))
	$.println("ModeIrregular:", $.int(fs.ModeIrregular))
	$.println("ModeType:", $.int(fs.ModeType))
	$.println("ModePerm:", $.int(fs.ModePerm))

	// Test FileMode methods
	let mode = ((fs.ModeDir | 0o755) as fs.FileMode)
	$.println("FileMode.IsDir():", fs.FileMode_IsDir(mode))
	$.println("FileMode.IsRegular():", fs.FileMode_IsRegular(mode))
	$.println("FileMode.Perm():", $.int(fs.FileMode_Perm(mode)))
	$.println("FileMode.Type():", $.int(fs.FileMode_Type(mode)))
	$.println("FileMode.String():", fs.FileMode_String(mode))

	let regularMode = (0o644 as fs.FileMode)
	$.println("Regular file IsDir():", fs.FileMode_IsDir(regularMode))
	$.println("Regular file IsRegular():", fs.FileMode_IsRegular(regularMode))

	$.println("test finished")
}


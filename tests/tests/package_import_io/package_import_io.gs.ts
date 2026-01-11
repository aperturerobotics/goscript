// Generated file based on package_import_io.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

export async function main(): Promise<void> {
	// Test basic error variables
	$.println("EOF:", io.EOF!.Error())
	$.println("ErrClosedPipe:", io.ErrClosedPipe!.Error())
	$.println("ErrShortWrite:", io.ErrShortWrite!.Error())
	$.println("ErrUnexpectedEOF:", io.ErrUnexpectedEOF!.Error())

	// Test seek constants
	$.println("SeekStart:", io.SeekStart)
	$.println("SeekCurrent:", io.SeekCurrent)
	$.println("SeekEnd:", io.SeekEnd)

	// Test Discard writer
	let [n, err] = io.WriteString(io.Discard, "hello world")
	$.println("WriteString to Discard - bytes:", n, "err:", err == null)

	$.println("test finished")
}


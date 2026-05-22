// Generated file based on package_import_os.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"

import * as fs from "@goscript/io/fs/index.js"

export async function main(): globalThis.Promise<void> {
	{
		let [wd, err] = os.Getwd()
		if (err == null) {
			if (wd != "") {
				$.println("Current working directory ok")
			}
		} else {
			$.println("Error getting working directory:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		}
	}

	// Test Environment variables - these work
	os.Setenv("TEST_VAR", "test_value")
	$.println("Set environment variable TEST_VAR")

	{
		let val = os.Getenv("TEST_VAR")
		if (val != "") {
			$.println("Got environment variable TEST_VAR:", val)
		}
	}

	os.Unsetenv("TEST_VAR")
	{
		let val = os.Getenv("TEST_VAR")
		if (val == "") {
			$.println("Environment variable TEST_VAR unset successfully")
		}
	}

	// Test Hostname - works with mock data
	{
		let [hostname, err] = os.Hostname()
		if (err == null) {
			$.println("Hostname:", hostname)
		} else {
			$.println("Error getting hostname:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		}
	}

	let [n, err] = $.pointerValue<os.File>(os.Stdout).Write($.stringToBytes("stdout write works\n"))
	if (err == null) {
		$.println("Stdout write bytes:", n)
	} else {
		$.println("Stdout write error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	}

	let fileName = "os-runtime-file.txt"
	let writeErr = os.WriteFile(fileName, $.stringToBytes("runtime file contents"), 0o644)
	if (writeErr == null) {
		$.println("WriteFile ok")
	} else {
		$.println("WriteFile error:", $.pointerValue<Exclude<$.GoError, null>>(writeErr).Error())
	}

	{
		let [data, readErr] = os.ReadFile(fileName)
		if (readErr == null) {
			$.println("ReadFile data:", $.bytesToString(data))
		} else {
			$.println("ReadFile error:", $.pointerValue<Exclude<$.GoError, null>>(readErr).Error())
		}
	}

	{
		let [info, statErr] = os.Stat(fileName)
		if (statErr == null) {
			$.println("Stat name:", $.pointerValue<Exclude<fs.FileInfo, null>>(info).Name())
			$.println("Stat size:", $.pointerValue<Exclude<fs.FileInfo, null>>(info).Size())
		} else {
			$.println("Stat error:", $.pointerValue<Exclude<$.GoError, null>>(statErr).Error())
		}
	}

	let removeErr = os.Remove(fileName)
	if (removeErr == null) {
		$.println("Remove ok")
	} else {
		$.println("Remove error:", $.pointerValue<Exclude<$.GoError, null>>(removeErr).Error())
	}

	{
		let [tempDir, __goscriptShadow0] = os.MkdirTemp("", "os-temp-dir-*")
		if (__goscriptShadow0 == null) {
			$.println("MkdirTemp ok")
			os.RemoveAll(tempDir)
		} else {
			$.println("MkdirTemp error:", $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow0).Error())
		}
	}

	{
		let __goscriptTuple0 = os.CreateTemp("", "os-temp-file-*")
		let tempFile: os.File | $.VarRef<os.File> | null = __goscriptTuple0[0]
		let __goscriptShadow1 = __goscriptTuple0[1]
		if (__goscriptShadow1 == null) {
			$.println("CreateTemp ok")
			$.println("CreateTemp name empty:", $.pointerValue<os.File>(tempFile).Name() == "")
			$.pointerValue<os.File>(tempFile).Close()
			os.Remove($.pointerValue<os.File>(tempFile).Name())
		} else {
			$.println("CreateTemp error:", $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow1).Error())
		}
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

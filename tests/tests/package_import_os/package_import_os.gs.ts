// Generated file based on package_import_os.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as os from "@goscript/os/index.ts"

export async function main(): Promise<void> {
	{
		let [wd, err] = os.Getwd()
		if (err == null) {
			if (wd != "") {
				$.println("Current working directory ok")
			}
		} else {
			$.println("Error getting working directory:", err!.Error())
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
			$.println("Error getting hostname:", err!.Error())
		}
	}

	let [n, err] = os.Stdout!.Write($.stringToBytes("stdout write works\n"))
	if (err == null) {
		$.println("Stdout write bytes:", n)
	} else {
		$.println("Stdout write error:", err!.Error())
	}

	let fileName = "os-runtime-file.txt"
	let writeErr = os.WriteFile(fileName, $.stringToBytes("runtime file contents"), 0o644)
	if (writeErr == null) {
		$.println("WriteFile ok")
	} else {
		$.println("WriteFile error:", writeErr!.Error())
	}

	{
		let [data, readErr] = os.ReadFile(fileName)
		if (readErr == null) {
			$.println("ReadFile data:", $.bytesToString(data))
		} else {
			$.println("ReadFile error:", readErr!.Error())
		}
	}

	{
		let [info, statErr] = os.Stat(fileName)
		if (statErr == null) {
			$.println("Stat name:", info!.Name())
			$.println("Stat size:", info!.Size())
		} else {
			$.println("Stat error:", statErr!.Error())
		}
	}

	let removeErr = os.Remove(fileName)
	if (removeErr == null) {
		$.println("Remove ok")
	} else {
		$.println("Remove error:", removeErr!.Error())
	}

	{
		let [tempDir, err] = os.MkdirTemp("", "os-temp-dir-*")
		if (err == null) {
			$.println("MkdirTemp ok")
			os.RemoveAll(tempDir)
		} else {
			$.println("MkdirTemp error:", err!.Error())
		}
	}

	{
		let [tempFile, err] = os.CreateTemp("", "os-temp-file-*")
		if (err == null) {
			$.println("CreateTemp ok")
			$.println("CreateTemp name empty:", tempFile!.Name() == "")
			tempFile!.Close()
			os.Remove(tempFile!.Name())
		} else {
			$.println("CreateTemp error:", err!.Error())
		}
	}
}


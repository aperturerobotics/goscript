// Generated file based on package_import_os.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"

export async function main(): Promise<void> {
	// Test Getwd - works with mock data
	{
		let [wd, err] = os.Getwd()
		if (err == null) {
			$.println("Current working directory:", wd)
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
}


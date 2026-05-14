// Generated file based on package_import_strconv.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

export async function main(): Promise<void> {
	// Test Atoi
	let [i, err] = strconv.Atoi("42")
	if (err == null) {
		$.println("Atoi result:", i)
	}

	// Test Itoa
	let s = strconv.Itoa(123)
	$.println("Itoa result:", s)

	// Test ParseInt
	let __goscriptTuple3148803 = strconv.ParseInt("456", 10, 64)
	let i64 = __goscriptTuple3148803[0]
	err = __goscriptTuple3148803[1]
	if (err == null) {
		$.println("ParseInt result:", i64)
	}

	// Test FormatInt
	let formatted = strconv.FormatInt(789, 10)
	$.println("FormatInt result:", formatted)

	// Test ParseFloat
	let __goscriptTuple3149026 = strconv.ParseFloat("3.14", 64)
	let f = __goscriptTuple3149026[0]
	err = __goscriptTuple3149026[1]
	if (err == null) {
		$.println("ParseFloat result:", strconv.FormatFloat(f, 102, 2, 64))
	}

	// Test FormatFloat
	let floatStr = strconv.FormatFloat(2.718, 102, 3, 64)
	$.println("FormatFloat result:", floatStr)

	// Test ParseBool
	let __goscriptTuple3149292 = strconv.ParseBool("true")
	let b = __goscriptTuple3149292[0]
	err = __goscriptTuple3149292[1]
	if (err == null) {
		$.println("ParseBool result:", b)
	}

	// Test FormatBool
	let boolStr = strconv.FormatBool(false)
	$.println("FormatBool result:", boolStr)

	// Test Quote
	let quoted = strconv.Quote("hello world")
	$.println("Quote result:", quoted)

	// Test Unquote
	let __goscriptTuple3149590 = strconv.Unquote(`"hello world"`)
	let unquoted = __goscriptTuple3149590[0]
	err = __goscriptTuple3149590[1]
	if (err == null) {
		$.println("Unquote result:", unquoted)
	}

	// Test error cases
	let __goscriptTuple3149722 = strconv.Atoi("invalid")
	err = __goscriptTuple3149722[1]
	if (err != null) {
		$.println("Atoi error handled")
	}

	let __goscriptTuple3149809 = strconv.ParseFloat("invalid", 64)
	err = __goscriptTuple3149809[1]
	if (err != null) {
		$.println("ParseFloat error handled")
	}

	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}

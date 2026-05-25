// Generated file based on package_import_strconv.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"
import "@goscript/strconv/index.js"

export async function main(): globalThis.Promise<void> {
	// Test Atoi
	let [i, err] = strconv.Atoi("42")
	if (err == null) {
		$.println("Atoi result:", i)
	}

	// Test Itoa
	let s = strconv.Itoa(123)
	$.println("Itoa result:", s)

	// Test ParseInt
	let __goscriptTuple0: any = strconv.ParseInt("456", 10, 64)
	let i64 = $.int(__goscriptTuple0[0])
	err = __goscriptTuple0[1]
	if (err == null) {
		$.println("ParseInt result:", $.int(i64))
	}

	// Test FormatInt
	let formatted = strconv.FormatInt($.int(789), 10)
	$.println("FormatInt result:", formatted)

	// Test ParseFloat
	let __goscriptTuple1: any = strconv.ParseFloat("3.14", 64)
	let f = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	if (err == null) {
		$.println("ParseFloat result:", strconv.FormatFloat(f, $.uint(102, 8), 2, 64))
	}

	// Test FormatFloat
	let floatStr = strconv.FormatFloat(2.718, $.uint(102, 8), 3, 64)
	$.println("FormatFloat result:", floatStr)

	// Test ParseBool
	let __goscriptTuple2: any = strconv.ParseBool("true")
	let b = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
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
	let __goscriptTuple3: any = strconv.Unquote("\"hello world\"")
	let unquoted = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	if (err == null) {
		$.println("Unquote result:", unquoted)
	}

	// Test error cases
	let __goscriptTuple4: any = strconv.Atoi("invalid")
	err = __goscriptTuple4[1]
	if (err != null) {
		$.println("Atoi error handled")
	}

	let __goscriptTuple5: any = strconv.ParseFloat("invalid", 64)
	err = __goscriptTuple5[1]
	if (err != null) {
		$.println("ParseFloat error handled")
	}

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}

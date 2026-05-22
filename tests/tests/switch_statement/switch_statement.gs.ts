// Generated file based on switch_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let i = 2
	$.println("Integer switch:")
	switch (i) {
		case 1:
		{
			$.println("one")
			break
		}
		case 2:
		{
			$.println("two")
			break
		}
		case 3:
		{
			$.println("three")
			break
		}
		default:
		{
			$.println("other integer")
			break
		}
	}

	let s = "hello"
	$.println("\nString switch:")
	switch (s) {
		case "world":
		{
			$.println("world")
			break
		}
		case "hello":
		{
			$.println("hello")
			break
		}
		default:
		{
			$.println("other string")
			break
		}
	}
	let x = -5
	$.println("\nSwitch without expression:")
	switch (true) {
		case x < 0:
		{
			$.println("negative")
			break
		}
		case x == 0:
		{
			$.println("zero")
			break
		}
		default:
		{
			$.println("positive")
			break
		}
	}

	x = 0
	$.println("\nSwitch without expression (zero):")
	switch (true) {
		case x < 0:
		{
			$.println("negative")
			break
		}
		case x == 0:
		{
			$.println("zero")
			break
		}
		default:
		{
			$.println("positive")
			break
		}
	}

	x = 10
	$.println("\nSwitch without expression (positive):")
	switch (true) {
		case x < 0:
		{
			$.println("negative")
			break
		}
		case x == 0:
		{
			$.println("zero")
			break
		}
		default:
		{
			$.println("positive")
			break
		}
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

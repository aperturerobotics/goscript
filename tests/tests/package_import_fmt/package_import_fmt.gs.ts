// Generated file based on package_import_fmt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as fmt from "@goscript/fmt/index.ts"

export async function main(): Promise<void> {
	fmt.Print("Hello")
	fmt.Print(" ")
	fmt.Print("World")
	fmt.Println()
	let name = "Go"
	let version = 1.21
	fmt.Printf("Welcome to %s %.2f\n", name, version)
	fmt.Println("This is println")
	let result = fmt.Sprint("Sprint", " ", "result")
	fmt.Println("Sprint result:", result)
	let formatted = fmt.Sprintf("Number: %d, String: %s", 42, "test")
	fmt.Println("Sprintf result:", formatted)
	let sprintln_result = fmt.Sprintln("Sprintln", "result")
	fmt.Print("Sprintln result:", sprintln_result)
	let err = fmt.Errorf("error code: %d", 404)
	fmt.Println("Error:", err)
	fmt.Printf("Boolean: %t\n", true)
	fmt.Printf("Integer: %d\n", 123)
	fmt.Printf("Float: %f\n", 3.14159)
	fmt.Printf("String: %s\n", "hello")
	fmt.Printf("Type: %T\n", 42)
	fmt.Printf("Value: %v\n", $.arrayToSlice<number>([1, 2, 3]))
	fmt.Printf("Width: '%5s'\n", "hi")
	fmt.Printf("Precision: '%.2f'\n", 3.14159)
	fmt.Printf("Both: '%5.2f'\n", 3.14159)
	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}

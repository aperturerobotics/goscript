// Generated file based on debug_simple.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as json from "@goscript/encoding/json/index.js"

import * as fmt from "@goscript/fmt/index.js"

export async function main(): Promise<void> {
	// Test basic types
	let s = "hello"
	let [b1, err1] = await json.Marshal(s)
	if (err1 != null) {
		fmt.Println("String marshal error:", err1)
	} else {
		fmt.Printf("String marshal: %q\n", $.bytesToString(b1))
	}

	let n = 42
	let [b2, err2] = await json.Marshal(n)
	if (err2 != null) {
		fmt.Println("Int marshal error:", err2)
	} else {
		fmt.Printf("Int marshal: %q\n", $.bytesToString(b2))
	}
}


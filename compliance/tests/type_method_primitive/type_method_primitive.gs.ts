// Generated file based on type_method_primitive.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyInt = number;

export function MyInt_Double(m: MyInt): number {
	return m * 2
}


export async function main(): Promise<void> {
	// Test direct method call on type conversion
	let result = MyInt_Double((5 as MyInt))
	console.log("Direct call:", result)

	// Test storing method reference (this is the failing case)
	let fn = (() => MyInt_Double((10 as MyInt)))
	console.log("Method ref call:", fn!())
}


// Generated file based on type_method_primitive.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type MyInt = number

export function MyInt_Double(m: MyInt): number {
	return $.int(m) * 2
}

export async function main(): Promise<void> {
	let result = MyInt_Double(5)
	$.println("Direct call:", result)
	let fn = ((__receiver) => (...args: any[]) => MyInt_Double(__receiver, ...args))(10)
	$.println("Method ref call:", fn())
}


if ($.isMainScript(import.meta)) {
	await main()
}

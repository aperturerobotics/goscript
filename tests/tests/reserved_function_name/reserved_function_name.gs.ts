// Generated file based on reserved_function_name.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function _throw(value: string): string {
	return value + "!"
}

export async function main(): globalThis.Promise<void> {
	$.println(_throw("ok"))
}


if ($.isMainScript(import.meta)) {
	await main()
}

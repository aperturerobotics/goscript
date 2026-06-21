// Generated file based on strict_mode_identifiers.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function choose(_arguments: number): number {
	let _eval: number = 0
	_eval = _arguments + 1
	_arguments = _eval + _arguments
	return _eval
}

export async function main(): globalThis.Promise<void> {
	let _eval = choose(1)
	let _arguments = _eval + 1
	$.println(_eval, _arguments)
}

if ($.isMainScript(import.meta)) {
	await main()
}

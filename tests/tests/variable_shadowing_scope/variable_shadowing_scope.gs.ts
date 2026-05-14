// Generated file based on variable_shadowing_scope.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function firstFunc(): void {
	return ["", 42]
}

export function secondFunc(x: number): number {
	if (x != 0) {
		$.println("Got value:", x)
		return 0
	}
	return 99
}

export async function main(): Promise<void> {
	let [, x] = firstFunc()
	{
		let x = secondFunc(x)
		if (x != 0) {
			$.println("Function returned value")
			return
		}
	}
	$.println("Completed successfully")
}


if ($.isMainScript(import.meta)) {
	await main()
}

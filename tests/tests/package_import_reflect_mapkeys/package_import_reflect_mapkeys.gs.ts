// Generated file based on package_import_reflect_mapkeys.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

export async function main(): globalThis.Promise<void> {
	let keys = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>(new Map<string, number>([["alpha", 1], ["beta", 2]]), "map[string]int")))).MapKeys()

	let seen: Map<string, boolean> | null = new Map<string, boolean>([])
	for (let __rangeIndex = 0; __rangeIndex < $.len(keys); __rangeIndex++) {
		let key = keys![__rangeIndex]
		$.mapSet(seen, $.markAsStructValue($.cloneStructValue(key)).String(), true)
	}

	$.println("keys:", $.len(keys))
	$.println("alpha:", $.mapGet(seen, "alpha", false)[0])
	$.println("beta:", $.mapGet(seen, "beta", false)[0])
}

if ($.isMainScript(import.meta)) {
	await main()
}

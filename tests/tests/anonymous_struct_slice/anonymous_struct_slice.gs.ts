// Generated file based on anonymous_struct_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	for (let __rangeIndex = 0; __rangeIndex < $.len($.arrayToSlice<{"name": string, "input": string, "count": number}>([{name: "first", input: "alpha", count: 1}, {name: "second", input: "beta", count: 2}])); __rangeIndex++) {
		let tt = $.arrayToSlice<{"name": string, "input": string, "count": number}>([{name: "first", input: "alpha", count: 1}, {name: "second", input: "beta", count: 2}])![__rangeIndex]
		$.println(tt.name, tt.input, tt.count)
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

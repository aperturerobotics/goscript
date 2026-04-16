// Generated file based on replace_directive.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as replaced from "@goscript/github.com/example/replaced/index.ts"

export async function main(): Promise<void> {
	$.println(replaced.Hello())
}


if ($.isMainScript(import.meta)) {
	await main()
}

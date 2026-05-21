// Generated file based on named_channel_zero_value_cross_file.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_create from "./create.gs.ts"

import * as __goscript_types from "./types.gs.ts"

export async function main(): Promise<void> {
	let jobs = __goscript_create.MakeJobs()
	$.println(jobs != null)
}


if ($.isMainScript(import.meta)) {
	await main()
}

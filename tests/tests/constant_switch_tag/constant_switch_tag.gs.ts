// Generated file based on constant_switch_tag.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_constants from "./constants.gs.ts"
import "./constants.gs.ts"

export async function main(): globalThis.Promise<void> {
	switch ((64 as number)) {
		case 32:
		{
			$.println("word: 32")
			break
		}
		case 64:
		{
			$.println("word: 64")
			break
		}
		default:
		{
			$.println("word: other")
			break
		}
	}

	switch ((false as boolean)) {
		case true:
		{
			$.println("cgo: on")
			break
		}
		case false:
		{
			$.println("cgo: off")
			break
		}
	}

	if ((64 as number) == 32) {
		$.println("compare: 32")
	} else {
		$.println("compare: not 32")
	}

	switch ((true as boolean)) {
		case false || !false:
		{
			$.println("resolver: go")
			break
		}
		case false:
		{
			$.println("resolver: cgo")
			break
		}
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

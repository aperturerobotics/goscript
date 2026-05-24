// Generated file based on runtime_const_platform_compare.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as runtime from "@goscript/runtime/index.js"
import "@goscript/runtime/index.js"

export function platform(): string {
	switch ((true as boolean)) {
		case $.stringEqual(runtime.GOARCH, "wasm"):
		{
			return "wasm"
			break
		}
		case ($.stringEqual(runtime.GOOS, "windows")) && ($.stringEqual(runtime.GOARCH, "386")):
		{
			return "windows386"
			break
		}
		case $.stringEqual(runtime.GOOS, "openbsd"):
		{
			return "openbsd"
			break
		}
		case $.stringEqual(runtime.GOOS, "aix"):
		{
			return "aix"
			break
		}
		default:
		{
			return "other"
			break
		}
	}
}

export async function main(): globalThis.Promise<void> {
	$.println(platform())
}

if ($.isMainScript(import.meta)) {
	await main()
}

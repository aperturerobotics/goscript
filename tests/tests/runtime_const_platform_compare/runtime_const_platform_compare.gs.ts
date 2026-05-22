// Generated file based on runtime_const_platform_compare.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as runtime from "@goscript/runtime/index.js"

export function platform(): string {
	switch ((true as boolean)) {
		case ((runtime.GOARCH as string) as string) == "wasm":
		{
			return "wasm"
			break
		}
		case (((runtime.GOOS as string) as string) == "windows") && (((runtime.GOARCH as string) as string) == "386"):
		{
			return "windows386"
			break
		}
		case ((runtime.GOOS as string) as string) == "openbsd":
		{
			return "openbsd"
			break
		}
		case ((runtime.GOOS as string) as string) == "aix":
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

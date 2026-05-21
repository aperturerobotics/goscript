// Generated file based on runtime_const_platform_compare.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as runtime from "@goscript/runtime/index.js"

export function platform(): string {
	switch (true) {
		case runtime.GOARCH == "wasm":
		{
			return "wasm"
			break
		}
		case (runtime.GOOS == "windows") && (runtime.GOARCH == "386"):
		{
			return "windows386"
			break
		}
		case runtime.GOOS == "openbsd":
		{
			return "openbsd"
			break
		}
		case runtime.GOOS == "aix":
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

export async function main(): Promise<void> {
	$.println(platform())
}


if ($.isMainScript(import.meta)) {
	await main()
}

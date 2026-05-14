// Generated file based on package_import_runtime.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as runtime from "@goscript/runtime/index.ts"

export async function main(): Promise<void> {
	$.println("GOOS:", runtime.GOOS)
	$.println("GOARCH:", runtime.GOARCH)
	let procs = runtime.GOMAXPROCS(0)
	$.println("GOMAXPROCS(-1):", runtime.GOMAXPROCS(-1))
	$.println("GOMAXPROCS(0):", procs)
	$.println("NumGoroutine:", runtime.NumGoroutine())
	runtime.GC()
	$.println("GC called successfully")
}


if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on testing_async_subtest.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as testing from "@goscript/testing/index.js"

export async function RunSubtest(t: testing.T | $.VarRef<testing.T> | null, ch: $.Channel<string> | null): Promise<boolean> {
	return await $.pointerValue<testing.T>(t).Run("child", $.functionValue(async (t: testing.T | $.VarRef<testing.T> | null): Promise<void> => {
		if (await $.chanRecv(ch) != "ok") {
			$.pointerValue<testing.T>(t).Fatalf("unexpected value")
		}
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "testing.T" }], results: [] }))
}

export async function main(): Promise<void> {
	$.println("testing async subtest compiled")
}


if ($.isMainScript(import.meta)) {
	await main()
}

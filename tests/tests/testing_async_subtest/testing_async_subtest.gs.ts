// Generated file based on testing_async_subtest.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as testing from "@goscript/testing/index.js"
import "@goscript/testing/index.js"

export async function RunSubtest(t: testing.T | $.VarRef<testing.T> | null, ch: $.Channel<string> | null): globalThis.Promise<boolean> {
	return await testing.T.prototype.Run.call(t, "child", $.functionValue(async (t: testing.T | $.VarRef<testing.T> | null): globalThis.Promise<void> => {
		if (!$.stringEqual(await $.chanRecv(ch), "ok")) {
			$.pointerValue<testing.T>(t).Fatalf("unexpected value")
		}
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "testing.T" }], results: [] }))
}

export async function main(): globalThis.Promise<void> {
	$.println("testing async subtest compiled")
}

if ($.isMainScript(import.meta)) {
	await main()
}

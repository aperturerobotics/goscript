// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/aperturerobotics/goscript/tests/tests/import_package_var_assign/dep/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/import_package_var_assign/dep/index.js"

export async function main(): globalThis.Promise<void> {
	dep.__goscript_set_Count(7)
	$.println(dep.Current())
	dep.__goscript_set_Hook($.functionValue(async (): globalThis.Promise<$.GoError> => {
		return await dep.Wait()
	}, { kind: $.TypeKind.Function, params: [], results: ["error"] }))
	{
		let err = await dep.Run()
		if (err != null) {
			$.println("hook error")
			return
		}
	}
	$.println("hook ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}

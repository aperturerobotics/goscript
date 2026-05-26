// Generated file based on import_inferred_external_type_func_lit.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"

import * as fs from "@goscript/io/fs/index.js"
import "@goscript/os/index.js"
import "@goscript/io/fs/index.js"

export async function main(): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	let fileName = "external-type-func-lit.txt"
	{
		let err = os.WriteFile(fileName, new Uint8Array([99, 111, 110, 116, 101, 110, 116, 115]), $.uint(0o644, 32))
		if (err != null) {
			$.println("write error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
	}
	__defer.defer(() => { os.Remove(fileName) })

	void ($.functionValue((): void => {
		let [info, err] = os.Stat(fileName)
		if (err != null) {
			$.println("stat error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
		if (false) {
			$.println("size:", $.int($.pointerValue<Exclude<fs.FileInfo, null>>(info).Size()))
		} else {
			$.println("stat closure ok")
		}
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))()
}

if ($.isMainScript(import.meta)) {
	await main()
}

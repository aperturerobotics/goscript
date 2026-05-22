// Generated file based on import_inferred_external_type_func_lit.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"

import * as fs from "@goscript/io/fs/index.js"

export async function main(): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	let fileName = "external-type-func-lit.txt"
	{
		let err = os.WriteFile(fileName, $.stringToBytes("contents"), 0o644)
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
			$.println("size:", $.pointerValue<Exclude<fs.FileInfo, null>>(info).Size())
		} else {
			$.println("stat closure ok")
		}
	}, { kind: $.TypeKind.Function, params: [], results: [] }))()
}

if ($.isMainScript(import.meta)) {
	await main()
}

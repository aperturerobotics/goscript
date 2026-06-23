// Generated file based on import_inferred_external_type_func_lit.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"

import * as fs from "@goscript/io/fs/index.js"
import "@goscript/os/index.js"
import "@goscript/io/fs/index.js"

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let fileName = "external-type-func-lit.txt"
	{
		let err = os.WriteFile(fileName, new Uint8Array([99, 111, 110, 116, 101, 110, 116, 115]), $.uint(0o644, 32))
		if (err != null) {
			$.println("write error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
	}
	__defer.defer(() => { os.Remove(fileName) })

	await (async (): globalThis.Promise<void> => {
		let [info, err] = os.Stat(fileName)
		if (err != null) {
			$.println("stat error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
		if (false) {
			$.println("size:", await $.pointerValue<Exclude<fs.FileInfo, null>>(info).Size())
		} else {
			$.println("stat closure ok")
		}
	})()
}

if ($.isMainScript(import.meta)) {
	await main()
}

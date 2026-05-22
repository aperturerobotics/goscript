// Generated file based on subpkg.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function Run(name: string, fn: (() => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<void> {
	let err = await fn!()
	if (err != null) {
		$.println(name, "error")
		return
	}
	$.println(name, "ok")
}

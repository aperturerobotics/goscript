// Generated file based on subpkg.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function Next(): globalThis.Promise<number> {
	let ch = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch, 42)
	return await $.chanRecv(ch)
}

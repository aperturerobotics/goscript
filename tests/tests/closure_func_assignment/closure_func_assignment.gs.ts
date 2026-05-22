// Generated file based on closure_func_assignment.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function run(_set: ((_p0: (() => void) | null) => void) | null): globalThis.Promise<void> {
	let cb: $.VarRef<(() => void) | null> = $.varRef(null)
	await _set!($.functionValue(async (): globalThis.Promise<void> => {
		await _set!($.functionValue((): void => {
			cb.value = $.functionValue((): void => {
				$.println("called")
			}, { kind: $.TypeKind.Function, params: [], results: [] })
		}, { kind: $.TypeKind.Function, params: [], results: [] }))
	}, { kind: $.TypeKind.Function, params: [], results: [] }))
	if (cb.value != null) {
		await cb.value!()
	}
}

export async function main(): globalThis.Promise<void> {
	await run($.functionValue(async (fn: (() => void) | null): globalThis.Promise<void> => {
		await fn!()
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }], results: [] }))
}


if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on func_lit_pointer_receiver_named_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type state = number

export function state__set(s: $.VarRef<state> | null, v: number): void {
	s!.value = v
}

export async function call(fn: (() => void) | null): globalThis.Promise<void> {
	await fn!()
}

export async function main(): globalThis.Promise<void> {
	let s: $.VarRef<state> = $.varRef(0)
	await call($.functionValue((): void => {
		state__set(s, 7)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	$.println($.int(s.value))
}

if ($.isMainScript(import.meta)) {
	await main()
}

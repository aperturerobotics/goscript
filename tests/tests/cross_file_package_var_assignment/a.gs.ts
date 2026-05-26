// Generated file based on a.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export let hook: (() => number | globalThis.Promise<number>) | null = $.functionValue((): number => {
	return 1
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))

export function __goscript_set_hook(value: (() => number | globalThis.Promise<number>) | null): void {
	hook = value
}

export async function read(): globalThis.Promise<number> {
	return await hook!()
}

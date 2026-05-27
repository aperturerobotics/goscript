// Generated file based on a.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export var hook: (() => number | globalThis.Promise<number>) | null = undefined as unknown as (() => number | globalThis.Promise<number>) | null

export function __goscript_init_hook(): void {
	if (((hook) as any) === undefined) {
		hook = $.functionValue((): number => {
	return 1
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	}
}

export function __goscript_get_hook(): (() => number | globalThis.Promise<number>) | null {
	if (((hook) as any) === undefined) {
		__goscript_init_hook()
	}
	return hook
}

export function __goscript_set_hook(__goscriptValue: (() => number | globalThis.Promise<number>) | null): void {
	hook = __goscriptValue
}

export async function read(): globalThis.Promise<number> {
	return await __goscript_get_hook()!()
}

// Generated file based on func_lit_outer_function_tuple.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type opener = ((_p0: string) => [string, $.GoError] | globalThis.Promise<[string, $.GoError]>) | null

export type wrapper = ((_p0: string) => [string, $.GoError] | globalThis.Promise<[string, $.GoError]>) | null

export type updater = (() => $.GoError | globalThis.Promise<$.GoError>) | null

export function wrap(open: opener | null): wrapper | null {
	return $.functionValue(async (path: string): globalThis.Promise<[string, $.GoError]> => {
		let [value, err] = await open!(path)
		if (err != null) {
			return ["", err]
		}
		return ["wrapped:" + value, null]
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }, "error"] } as $.FunctionTypeInfo))
}

export function open(path: string): [string, $.GoError] {
	return [path, null]
}

export async function run(update: (() => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	let err = await (async (): globalThis.Promise<$.GoError> => {
		return update!()
	})()
	if (err != null) {
		return err
	}
	return null
}

export function noop(): $.GoError {
	return null
}

export async function main(): globalThis.Promise<void> {
	let wrapped = wrap(open)
	let [value, err] = await wrapped!("ok")
	if (err != null) {
		$.println("err")
		return
	}
	$.println(value)
	if (await run(noop) == null) {
		$.println("run ok")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

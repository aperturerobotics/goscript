// Generated file based on async_function_alias.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Callback = (() => $.GoError | Promise<$.GoError>) | null

export type Opener = ((_p0: (() => $.GoError | Promise<$.GoError>) | null) => $.GoError | Promise<$.GoError>) | null

export function newOpener(ch: $.Channel<$.GoError> | null): ((_p0: Callback) => $.GoError | Promise<$.GoError>) | null {
	return $.functionValue(async (cb: (() => $.GoError | Promise<$.GoError>) | null): Promise<$.GoError> => {
		{
			let err = await cb!()
			if (err != null) {
				return err
			}
		}
		return await $.chanRecv(ch)
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: ["error"] }], results: ["error"] })
}

export async function use(op: ((_p0: Callback) => $.GoError | Promise<$.GoError>) | null, cb: (() => $.GoError | Promise<$.GoError>) | null): Promise<$.GoError> {
	return await op!(cb)
}

export async function main(): Promise<void> {
	let ch = $.makeChannel<$.GoError>(1, null, "both")
	await $.chanSend(ch, null)
	let err = await use(newOpener(ch), $.functionValue((): $.GoError => {
		return null
	}, { kind: $.TypeKind.Function, params: [], results: ["error"] }))
	$.println("alias opener ok", err == null)
}


if ($.isMainScript(import.meta)) {
	await main()
}

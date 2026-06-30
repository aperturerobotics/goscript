// Generated file based on defer_recover.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function safeDivide(a: number, b: number): [number, boolean] {
	let result: number = 0
	let ok: boolean = false
	const __defer = new $.DisposableStack()
	try {
		__defer.defer(() => { ((): void => {
			{
				let r = $.recover()
				if (r != null) {
					result = -1
					ok = false
				}
			}
		})() })
		if (b == 0) {
			$.panic("division by zero")
		}
		const __goscriptReturn0: [number, boolean] = [Math.trunc(a / b), true]
		result = __goscriptReturn0[0]
		ok = __goscriptReturn0[1]
		__defer.dispose()
		return [result, ok]
		__defer.dispose()
	} catch (e) {
		__defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
	return [result, ok]
}

export function mustPanic(): void {
	const __defer = new $.DisposableStack()
	try {
		__defer.defer(() => { ((): void => {
			{
				let r = $.recover()
				if (r != null) {
					$.println("recovered:", $.mustTypeAssert<string>(r, { kind: $.TypeKind.Basic, name: "string" }))
				}
			}
		})() })
		$.panic("boom")
		__defer.dispose()
	} catch (e) {
		__defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

export function noPanic(): void {
	const __defer = new $.DisposableStack()
	try {
		__defer.defer(() => { ((): void => {
			{
				let r = $.recover()
				if (r != null) {
					$.println("should not happen")
				} else {
					$.println("nothing to recover")
				}
			}
		})() })
		$.println("noPanic body")
		__defer.dispose()
	} catch (e) {
		__defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

export async function main(): globalThis.Promise<void> {
	let [q, ok] = safeDivide(10, 2)
	$.println("10/2 =", q, ok)
	let __goscriptTuple0: any = safeDivide(1, 0)
	q = __goscriptTuple0[0]
	ok = __goscriptTuple0[1]
	$.println("1/0 =", q, ok)
	mustPanic()
	noPanic()
	$.println("main done")
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on complex_constant_return.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function zeroComplex(): [$.Complex, $.GoError] {
	return [$.complex(0, 0), null]
}

export function oneComplex(): $.Complex {
	return $.complex(1, 0)
}

export async function main(): globalThis.Promise<void> {
	let [z, err] = zeroComplex()
	$.println($.int($.real(z)), $.int($.imag(z)), err == null)
	let o = oneComplex()
	$.println($.int($.real(o)), $.int($.imag(o)))
}

if ($.isMainScript(import.meta)) {
	await main()
}

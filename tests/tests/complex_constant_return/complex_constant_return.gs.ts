// Generated file based on complex_constant_return.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function zeroComplex(): [$.Complex, $.GoError] {
	return [$.complex(0, 0), null]
}

export function oneComplex(): $.Complex {
	return $.complex(1, 0)
}

export function zeroImag(): $.Complex {
	return $.complex(0, 0)
}

export function complexPair(): [$.Complex, $.Complex] {
	return [$.complex(1, 2), $.complex(0, -1)]
}

export async function main(): globalThis.Promise<void> {
	let [z, err] = zeroComplex()
	$.println($.int($.real(z)), $.int($.imag(z)), err == null)
	let o = oneComplex()
	$.println($.int($.real(o)), $.int($.imag(o)))
	let zi = zeroImag()
	$.println($.int($.real(zi)), $.int($.imag(zi)), $.arrayEqual(zi, ($.complex(0, 0))))
	let [a, b] = complexPair()
	$.println($.int($.real(a)), $.int($.imag(a)), $.int($.real(b)), $.int($.imag(b)), !$.arrayEqual(a, b))
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on port.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function parsePort(service: string): [number, boolean] {
	let port: number = 0
	let needsLookup: boolean = false
	if ($.stringEqual(service, "")) {
		// Lock in the legacy behavior that an empty string
		// means port 0. See golang.org/issue/13610.
		return [0, false]
	}
	const max: number = 4294967295
	const cutoff: number = 1073741824
	let neg = false
	if ($.uint($.indexStringOrBytes(service, 0), 8) == $.uint(43, 8)) {
		service = $.sliceStringOrBytes(service, 1, undefined)
	} else {
		if ($.uint($.indexStringOrBytes(service, 0), 8) == $.uint(45, 8)) {
			neg = true
			service = $.sliceStringOrBytes(service, 1, undefined)
		}
	}
	let n: number = 0
	for (let [__rangeIndex, d] of $.rangeString(service)) {
		if (($.int(48, 32) <= $.int(d, 32)) && ($.int(d, 32) <= $.int(57, 32))) {
			d = d - ($.int(48, 32))
		} else {
			return [0, true]
		}
		if ($.uint(n, 32) >= $.uint(1073741824, 32)) {
			n = $.uint(4294967295, 32)
			break
		}
		n = n * ($.uint(10, 32))
		let nn = $.uint(n + $.uint(d, 32), 32)
		if (($.uint(nn, 32) < $.uint(n, 32)) || ($.uint(nn, 32) > $.uint(4294967295, 32))) {
			n = $.uint(4294967295, 32)
			break
		}
		n = $.uint(nn, 32)
	}
	if (!neg && ($.uint(n, 32) >= $.uint(1073741824, 32))) {
		port = $.int(1073741824 - 1)
	} else {
		if (neg && ($.uint(n, 32) > $.uint(1073741824, 32))) {
			port = $.int(1073741824)
		} else {
			port = $.int(n)
		}
	}
	if (neg) {
		port = -port
	}
	return [port, false]
}

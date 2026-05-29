// Generated file based on strip-prefix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strings from "@goscript/strings/index.js"
import "@goscript/strings/index.js"

export function CheckStripPrefix(id: string, matchPrefixes: $.Slice<string>): [string, string] {
	let strippedID: string = ""
	let matchedPrefix: string = ""
	if ($.len(matchPrefixes) == 0) {
		return [id, ""]
	}

	let matched: boolean = false
	for (let __goscriptRangeTarget0 = matchPrefixes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let prefix = __goscriptRangeTarget0![__rangeIndex]
		matched = strings.HasPrefix(id, prefix)
		if (matched) {
			matchedPrefix = prefix
			break
		}
	}
	if (!matched) {
		return [id, ""]
	}
	return [$.sliceStringOrBytes(id, $.len(matchedPrefix), undefined), matchedPrefix]
}

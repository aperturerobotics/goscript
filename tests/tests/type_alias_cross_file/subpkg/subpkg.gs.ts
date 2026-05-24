// Generated file based on subpkg.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Value = $.Slice<number>

export function Value_Clone(v: Value): Value {
	if (v == null) {
		return (null as Value)
	}
	let p: Value = ($.makeSlice<number>($.len((v as Value)), undefined, "byte") as Value)
	$.copy((p as Value), (v as Value))
	return (p as Value)
}

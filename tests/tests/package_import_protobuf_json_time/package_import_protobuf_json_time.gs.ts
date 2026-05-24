// Generated file based on package_import_protobuf_json_time.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as time from "@goscript/time/index.js"

import * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"
import "@goscript/time/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

export function readTime(s: json.UnmarshalState | $.VarRef<json.UnmarshalState> | null): time.Time {
	let t: time.Time | $.VarRef<time.Time> | null = json.UnmarshalState.prototype.ReadTime.call(s)
	return $.markAsStructValue($.cloneStructValue($.pointerValue<time.Time>(t)))
}

export async function main(): globalThis.Promise<void> {
	let state: json.UnmarshalState | $.VarRef<json.UnmarshalState> | null = json.NewUnmarshalState(new Uint8Array([34, 50, 48, 50, 53, 45, 48, 53, 45, 49, 53, 84, 48, 49, 58, 49, 48, 58, 52, 50, 90, 34]), $.markAsStructValue($.cloneStructValue(json.DefaultUnmarshalerConfig)))
	let t = $.markAsStructValue($.cloneStructValue(readTime(state)))
	$.println("read time", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t)).UTC())).Format(time.RFC3339), json.UnmarshalState.prototype.Err.call(state) == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}

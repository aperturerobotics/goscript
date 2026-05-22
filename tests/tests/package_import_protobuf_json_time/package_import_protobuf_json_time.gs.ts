// Generated file based on package_import_protobuf_json_time.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as time from "@goscript/time/index.js"

import * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

export function readTime(s: json.UnmarshalState | $.VarRef<json.UnmarshalState> | null): time.Time {
	let t: time.Time | $.VarRef<time.Time> | null = $.pointerValue<json.UnmarshalState>(s).ReadTime()
	return $.markAsStructValue($.cloneStructValue($.pointerValue<time.Time>(t)))
}

export async function main(): Promise<void> {
	let state: json.UnmarshalState | $.VarRef<json.UnmarshalState> | null = json.NewUnmarshalState($.stringToBytes("\"2025-05-15T01:10:42Z\""), $.markAsStructValue($.cloneStructValue(json.DefaultUnmarshalerConfig)))
	let t = $.markAsStructValue($.cloneStructValue(readTime(state)))
	$.println("read time", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t)).UTC())).Format(time.RFC3339), $.pointerValue<json.UnmarshalState>(state).Err() == null)
}


if ($.isMainScript(import.meta)) {
	await main()
}

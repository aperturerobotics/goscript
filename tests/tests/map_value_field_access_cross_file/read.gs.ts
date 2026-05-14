// Generated file based on read.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as __goscript_types from "./types.gs.ts"

export function ReadValue(key: string): string {
	return $.mapGet(__goscript_types.Storage, key, $.markAsStructValue(new Foo()))[0].Value
}

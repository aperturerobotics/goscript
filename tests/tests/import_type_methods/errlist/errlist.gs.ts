// Generated file based on errlist/errlist.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type ErrorList = $.Slice<string>;

export function ErrorList_Add(p: ErrorList, msg: string): ErrorList {
	return $.append(p, msg)
}



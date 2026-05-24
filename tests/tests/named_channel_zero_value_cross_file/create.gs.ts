// Generated file based on create.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_types from "./types.gs.ts"
import "./types.gs.ts"

export function MakeJobs(): __goscript_types.Jobs {
	return $.makeChannel<__goscript_types.Job>(0, $.markAsStructValue(new __goscript_types.Job()), "both")
}

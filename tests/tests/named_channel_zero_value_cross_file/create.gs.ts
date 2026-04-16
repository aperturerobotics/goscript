// Generated file based on create.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"
import { Job, Jobs } from "./types.gs.ts";

export function MakeJobs(): Jobs {
	return $.makeChannel<Job>(0, new Job(), 'both')
}


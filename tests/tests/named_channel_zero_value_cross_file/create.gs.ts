// Generated file based on create.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import { Jobs } from "./types.gs.js";

export function MakeJobs(): Jobs {
	return $.makeChannel<Job>(0, new Job(), 'both')
}


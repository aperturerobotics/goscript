import * as $ from "@goscript/builtin/index.js";
import { getDeno } from "./types_js.gs.js";

export function runtime_args(): $.Slice<string> {
	const denoObj = getDeno()
	if (Array.isArray(denoObj?.args)) {
		return $.arrayToSlice<string>(denoObj.args)
	}
	const processObj = (globalThis as any).process
	if (Array.isArray(processObj?.argv)) {
		return $.arrayToSlice<string>(processObj.argv.slice(2))
	}
	return $.arrayToSlice<string>([])
}

export function runtime_beforeExit(exitCode: number): void {
	// No-op in JavaScript.
}

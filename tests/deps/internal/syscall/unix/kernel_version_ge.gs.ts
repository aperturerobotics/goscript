// Generated file based on kernel_version_ge.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_kernel_version_other from "./kernel_version_other.gs.ts"
import "./kernel_version_other.gs.ts"

export function KernelVersionGE(x: number, y: number): boolean {
	let [xx, yy] = __goscript_kernel_version_other.KernelVersion()

	return (xx > x) || ((xx == x) && (yy >= y))
}

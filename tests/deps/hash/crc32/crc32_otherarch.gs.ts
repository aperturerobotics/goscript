// Generated file based on crc32_otherarch.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function archAvailableIEEE(): boolean {
	return false
}

export function archInitIEEE(): void {
	$.panic("not available")
}

export function archUpdateIEEE(crc: number, p: $.Slice<number>): number {
	$.panic("not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function archAvailableCastagnoli(): boolean {
	return false
}

export function archInitCastagnoli(): void {
	$.panic("not available")
}

export function archUpdateCastagnoli(crc: number, p: $.Slice<number>): number {
	$.panic("not available")
	throw new globalThis.Error("goscript: unreachable return")
}

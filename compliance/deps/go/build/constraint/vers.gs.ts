import * as $ from "@goscript/builtin/index.js"
import { AndExpr, Expr, NotExpr, OrExpr, TagExpr } from "./expr.gs.js";

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"

// GoVersion returns the minimum Go version implied by a given build expression.
// If the expression can be satisfied without any Go version tags, GoVersion returns an empty string.
//
// For example:
//
//	GoVersion(linux && go1.22) = "go1.22"
//	GoVersion((linux && go1.22) || (windows && go1.20)) = "go1.20" => go1.20
//	GoVersion(linux) = ""
//	GoVersion(linux || (windows && go1.22)) = ""
//	GoVersion(!go1.22) = ""
//
// GoVersion assumes that any tag or negated tag may independently be true,
// so that its analysis can be purely structural, without SAT solving.
// “Impossible” subexpressions may therefore affect the result.
//
// For example:
//
//	GoVersion((linux && !linux && go1.20) || go1.21) = "go1.20"
export function GoVersion(x: Expr): string {
	let v = minVersion(x, +1)
	if (v < 0) {
		return ""
	}
	if (v == 0) {
		return "go1"
	}
	return "go1." + strconv.Itoa(v)
}

// minVersion returns the minimum Go major version (9 for go1.9)
// implied by expression z, or if sign < 0, by expression !z.
export function minVersion(z: Expr, sign: number): number {

	// !foo implies nothing

	// not a go1.N tag
	$.typeSwitch(z, [,
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'AndExpr'}], body: (z) => {
		let op = andVersion
		if (sign < 0) {
			op = orVersion
		}
		return op!(minVersion(z!.X, sign), minVersion(z!.Y, sign))
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'OrExpr'}], body: (z) => {
		let op = orVersion
		if (sign < 0) {
			op = andVersion
		}
		return op!(minVersion(z!.X, sign), minVersion(z!.Y, sign))
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'NotExpr'}], body: (z) => {
		return minVersion(z!.X, -sign)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'TagExpr'}], body: (z) => {
		if (sign < 0) {
			// !foo implies nothing
			return -1
		}
		if (z!.Tag == "go1") {
			return 0
		}
		let [, v, ] = strings.Cut(z!.Tag, "go1.")
		let [n, err] = strconv.Atoi(v)
		if (err != null) {
			// not a go1.N tag
			return -1
		}
		return n
	}}], () => {
		return -1
	})
}

// andVersion returns the minimum Go version
// implied by the AND of two minimum Go versions,
// which is the max of the versions.
export function andVersion(x: number, y: number): number {
	if (x > y) {
		return x
	}
	return y
}

// orVersion returns the minimum Go version
// implied by the OR of two minimum Go versions,
// which is the min of the versions.
export function orVersion(x: number, y: number): number {
	if (x < y) {
		return x
	}
	return y
}


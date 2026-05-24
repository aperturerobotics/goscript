// Generated file based on package_import_regexp.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as regexp from "@goscript/regexp/index.js"
import "@goscript/regexp/index.js"

export async function main(): globalThis.Promise<void> {
	let label: regexp.Regexp | $.VarRef<regexp.Regexp> | null = await regexp.MustCompile("^[a-z0-9]([-a-z0-9]*[a-z0-9])?$")
	let anchored: regexp.Regexp | $.VarRef<regexp.Regexp> | null = await regexp.MustCompile("^a$")
	let suffix: regexp.Regexp | $.VarRef<regexp.Regexp> | null = await regexp.MustCompile("a$")

	$.println("label spacewave-web:", regexp.Regexp.prototype.MatchString.call(label, "spacewave-web"))
	$.println("anchored a:", regexp.Regexp.prototype.MatchString.call(anchored, "a"))
	$.println("suffix ba:", regexp.Regexp.prototype.MatchString.call(suffix, "ba"))
}

if ($.isMainScript(import.meta)) {
	await main()
}

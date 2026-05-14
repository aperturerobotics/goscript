// Generated file based on path_error_constructor.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as fmt from "@goscript/fmt/index.ts"

import * as os from "@goscript/os/index.ts"

export async function main(): Promise<void> {
	let err = new PathError({Op: "readlink", Path: "/some/path", Err: fmt.Errorf("not a symlink")})
	$.println($.pointerValue(err).Op)
	$.println($.pointerValue(err).Path)
	$.println($.pointerValue(err).Err.Error())
}


if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on map_value_field_access_cross_file.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"
import { ReadValue } from "./read.gs.ts";

export async function main(): Promise<void> {
	$.println(ReadValue("foo"))
}


if ($.isMainScript(import.meta)) {
	await main()
}

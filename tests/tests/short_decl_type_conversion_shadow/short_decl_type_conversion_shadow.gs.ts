// Generated file based on short_decl_type_conversion_shadow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export const blockTypeRaw: blockType = 0

export const blockTypeRLE: blockType = 1

export type blockType = number

export async function main(): globalThis.Promise<void> {
	let __goscriptShadow0 = $.uint(1, 8)
	switch (__goscriptShadow0) {
		case blockTypeRaw:
		{
			$.println("raw")
			break
		}
		case blockTypeRLE:
		{
			$.println("rle")
			break
		}
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

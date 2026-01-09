// Generated file based on range_const_reassign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let s = "abc"
	{
		const _runes = $.stringToRunes(s)
		for (let i = 0; i < _runes.length; i++) {
			let c = _runes[i]
			{
				if (c >= 97) {
					c = c - 97 + 10
				}
				$.println($.int(c))
			}
		}
	}
}


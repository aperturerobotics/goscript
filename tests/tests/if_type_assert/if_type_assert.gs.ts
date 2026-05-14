// Generated file based on if_type_assert.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let a: any = null
	a = "this is a string"
	{
		let [, ok] = $.typeAssertTuple<string>(a, { kind: $.TypeKind.Basic, name: "string" })
		if (ok) {
			$.println("Expected: string")
		} else {
			$.println("Not Expected: should be a string")
		}
	}
	let list: $.Slice<any> = null
	let kv = new KV({Key: "string"})
	list = [kv]
	for (let __rangeIndex = 0; __rangeIndex < $.len(list); __rangeIndex++) {
		let exp = list[__rangeIndex]
		$.typeSwitch(
			exp,
			[
				{
					types: [{ kind: $.TypeKind.Pointer, elemType: "main.KV" }],
					body: (x) => {
						{
							let [x, ok] = $.typeAssertTuple<string>($.pointerValue(x).Key, { kind: $.TypeKind.Basic, name: "string" })
							if (ok) {
								$.println("got string:", x)
							} else {
								$.println("fail: should be string")
							}
						}
					}
				}
			],
			() => {
				let x = exp
				$.println("fail: should be KV")
			}
		)
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

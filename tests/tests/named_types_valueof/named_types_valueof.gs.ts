// Generated file based on named_types_valueof.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as subpkg from "@goscript/github.com/aperturerobotics/goscript/tests/tests/named_types_valueof/subpkg/index.ts"

export type LocalInt = number

export type LocalUint = number

export type LocalFloat = number

export type LocalString = string

export type LocalBool = boolean

export type LocalLevel1 = number

export type LocalLevel2 = number

export type LocalLevel3 = number

export async function main(): Promise<void> {
	let myInt: LocalInt = 10
	let myUint: LocalUint = 5
	$.println("Local bitwise operations:")
	let result1 = myInt | 3
	$.println("LocalInt | 3:", $.int(result1))
	let result2 = myUint & 7
	$.println("LocalUint & 7:", $.int(result2))
	let result3 = myInt ^ 15
	$.println("LocalInt ^ 15:", $.int(result3))
	const localConst: LocalInt = 20
	let result4 = localConst | myInt
	$.println("localConst | myInt:", $.int(result4))
	let level: LocalLevel1 = 100
	let result5 = level | 7
	$.println("LocalLevel1 | 7:", $.int(result5))
	$.println("\nCross-package operations:")
	$.println("subpkg.IntValue:", $.int(subpkg.IntValue))
	$.println("subpkg.UintValue:", $.int(subpkg.UintValue))
	$.println("subpkg.FloatValue:", $.int(subpkg.FloatValue))
	$.println("subpkg.StringValue:", subpkg.StringValue)
	$.println("subpkg.BoolValue:", subpkg.BoolValue)
	let result6 = subpkg.UintValue | 0x20
	$.println("subpkg.UintValue | 0x20:", $.int(result6))
	let result7 = subpkg.LevelValue & 0xFFF
	$.println("subpkg.LevelValue & 0xFFF:", $.int(result7))
	let combined = subpkg.GetCombinedFlags()
	$.println("subpkg.GetCombinedFlags():", $.int(combined))
	let directLevel = subpkg.LevelValue | 0x0F
	$.println("subpkg.LevelValue | 0x0F:", $.int(directLevel))
	let mixedResult = subpkg.UintValue | myUint
	$.println("Mixed operation result:", $.int(mixedResult))
	$.println("\nTesting all bitwise operators:")
	let base = 42
	$.println("base:", $.int(base))
	$.println("base | 8:", $.int(base | 8))
	$.println("base & 15:", $.int(base & 15))
	$.println("base ^ 31:", $.int(base ^ 31))
	$.println("base << 2:", $.int(base << 2))
	$.println("base >> 1:", $.int(base >> 1))
	$.println("base &^ 7:", $.int(base &^ 7))
	$.println("\nDifferent underlying types:")
	let f: LocalFloat = 2.5
	let s: LocalString = "test"
	let b: LocalBool = true
	$.println("LocalFloat:", $.int(f))
	$.println("LocalString:", s)
	$.println("LocalBool:", b)
	let f2 = f * 2.0
	$.println("LocalFloat * 2.0:", $.int(f2))
	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on named_types_valueof.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subpkg from "@goscript/github.com/aperturerobotics/goscript/tests/tests/named_types_valueof/subpkg/index.js"

export type LocalBool = boolean;

export type LocalFloat = number;

export type LocalInt = number;

export type LocalLevel3 = number;

export type LocalString = string;

export type LocalUint = number;

export type LocalLevel2 = LocalLevel3;

export type LocalLevel1 = LocalLevel2;

export async function main(): Promise<void> {
	// Test basic named numeric types with bitwise operations
	let myInt: LocalInt = 10
	let myUint: LocalUint = 5

	// Test bitwise operations with local named types
	$.println("Local bitwise operations:")
	let result1 = (myInt | 3)
	$.println("LocalInt | 3:", $.int(result1))

	let result2 = (myUint & 7)
	$.println("LocalUint & 7:", $.int(result2))

	let result3 = (myInt ^ 15)
	$.println("LocalInt ^ 15:", $.int(result3))

	// Test with constants
	let localConst: LocalInt = 20
	let result4 = (20 | myInt)
	$.println("localConst | myInt:", $.int(result4))

	// Test multi-level indirection
	let level: LocalLevel1 = 100
	let result5 = (level | 7)
	$.println("LocalLevel1 | 7:", result5)

	// Test cross-package named types
	$.println("\nCross-package operations:")

	// Test imported constants
	$.println("subpkg.IntValue:", subpkg.IntValue)
	$.println("subpkg.UintValue:", $.int(subpkg.UintValue))
	$.println("subpkg.FloatValue:", subpkg.FloatValue)
	$.println("subpkg.StringValue:", subpkg.StringValue)
	$.println("subpkg.BoolValue:", subpkg.BoolValue)

	// Test bitwise operations with imported types
	let result6 = (subpkg.UintValue | 0x20)
	$.println("subpkg.UintValue | 0x20:", $.int(result6))

	let result7 = (subpkg.LevelValue & 0xFFF)
	$.println("subpkg.LevelValue & 0xFFF:", $.int(result7))

	// Test function calls that return named types
	let combined = subpkg.GetCombinedFlags()
	$.println("subpkg.GetCombinedFlags():", $.int(combined))

	// Test multi-level indirection directly
	let directLevel = (subpkg.LevelValue | 0x0F)
	$.println("subpkg.LevelValue | 0x0F:", $.int(directLevel))

	// Test mixed operations between local and imported types
	let mixedResult = ((subpkg.UintValue as LocalUint) | myUint)
	$.println("Mixed operation result:", $.int(mixedResult))

	// Test various bitwise operators
	$.println("\nTesting all bitwise operators:")
	let base = (42 as LocalInt)

	$.println("base:", $.int(base))
	$.println("base | 8:", $.int((base | 8)))
	$.println("base & 15:", $.int((base & 15)))
	$.println("base ^ 31:", $.int((base ^ 31)))
	$.println("base << 2:", $.int((base << 2)))
	$.println("base >> 1:", $.int((base >> 1)))
	$.println("base &^ 7:", $.int((base & ~ 7))) // AND NOT

	// Test with different underlying types
	$.println("\nDifferent underlying types:")

	let f: LocalFloat = 2.5
	let s: LocalString = "test"
	let b: LocalBool = true

	$.println("LocalFloat:", f)
	$.println("LocalString:", s)
	$.println("LocalBool:", b)

	// Test arithmetic operations that might need valueOf
	let f2 = f * 2.0
	$.println("LocalFloat * 2.0:", f2)

	$.println("test finished")
}


// Generated file based on subpkg/types.go
// Updated when compliance tests are re-run, DO NOT EDIT!

// Generated file based on types.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type MyInt = number

export type MyUint = number

export type MyFloat = number

export type MyString = string

export type MyBool = boolean

export type Level1 = number

export type Level2 = number

export type Level3 = number

export const IntValue: MyInt = 42

export const UintValue: MyUint = 0xFF

export const FloatValue: MyFloat = 3.14

export const StringValue: MyString = "hello"

export const BoolValue: MyBool = true

export const LevelValue: Level1 = 0x1000

export function GetCombinedFlags(): MyUint {
	return UintValue | 0x10
}

export function GetLevelValue(): Level1 {
	return LevelValue | 0x0F
}

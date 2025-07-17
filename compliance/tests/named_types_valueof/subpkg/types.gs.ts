// Generated file based on subpkg/types.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js";

export let IntValue: MyInt = 42

export let UintValue: MyUint = 0xFF

export let FloatValue: MyFloat = 3.14

export let StringValue: MyString = "hello"

export let BoolValue: MyBool = true

export let LevelValue: Level1 = 0x1000

export type MyInt = number;

export type MyFloat = number;

export type MyBool = boolean;

export type MyString = string;

export type Level3 = number;

export type MyUint = number;

export type Level2 = Level3;

export type Level1 = Level2;

// Helper function that uses bitwise operations
export function GetCombinedFlags(): MyUint {
	return (255 | 0x10)
}

// Function that tests multi-level indirection
export function GetLevelValue(): Level1 {
	return (4096 | 0x0F)
}


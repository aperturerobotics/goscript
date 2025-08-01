// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type StrOrBytes = null | string | $.Bytes

$.registerInterfaceType(
  'StrOrBytes',
  null, // Zero value for interface is null
  []
);

// T constrained to string
export function toStringString<T extends string>(v: T): string {
	return v
}

// T constrained to []byte
export function toStringBytes<T extends $.Bytes>(v: T): string {
	return $.bytesToString(v)
}

export function toStringGeneric<T extends StrOrBytes>(v: T): string {
	return $.genericBytesOrStringToString(v)
}

export async function main(): Promise<void> {
	// string-only
	console.log(toStringString("hello"))

	// bytes-only
	console.log(toStringBytes(new Uint8Array([119, 111, 114, 108, 100])))

	// union: string
	console.log(toStringGeneric("foo"))
	// union: []byte
	console.log(toStringGeneric(new Uint8Array([98, 97, 114])))
}


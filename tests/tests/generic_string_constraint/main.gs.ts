// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function toStringString(__typeArgs: $.GenericTypeArgs | undefined, v: any): string {
	return $.genericBytesOrStringToString(v)
}

export function toStringBytes(__typeArgs: $.GenericTypeArgs | undefined, v: any): string {
	return $.genericBytesOrStringToString(v)
}

export type StrOrBytes = any

$.registerInterfaceType(
	"main.StrOrBytes",
	null,
	[]
)

export function toStringGeneric(__typeArgs: $.GenericTypeArgs | undefined, v: any): string {
	return $.genericBytesOrStringToString(v)
}

export async function main(): Promise<void> {
	$.println(toStringString({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, "hello"))
	$.println(toStringBytes({T: { type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, zero: () => null }}, $.arrayToSlice<number>([119, 111, 114, 108, 100])))
	$.println(toStringGeneric({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, "foo"))
	$.println(toStringGeneric({T: { type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, zero: () => null }}, $.arrayToSlice<number>([98, 97, 114])))
}


if ($.isMainScript(import.meta)) {
	await main()
}

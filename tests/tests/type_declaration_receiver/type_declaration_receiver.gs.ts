// Generated file based on type_declaration_receiver.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as strings from "@goscript/strings/index.ts"

export type FileMode = number

export function FileMode_String(fm: FileMode): string {
	if (fm == 0) {
		return "none"
	}
	return "some"
}

export function FileMode_IsZero(fm: FileMode): boolean {
	return fm == 0
}

export function FileMode_Add(fm: FileMode, val: number): FileMode {
	return $.int(fm) + val
}

export type CustomString = string

export function CustomString_Length(cs: CustomString): number {
	return $.len(cs)
}

export function CustomString_Upper(cs: CustomString): string {
	let s = cs
	let result: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
	for (let __rangeIndex = 0; __rangeIndex < $.len(s); __rangeIndex++) {
		let r = s[__rangeIndex]
		if (r >= 97 && r <= 122) {
			result.value.WriteString(String.fromCodePoint(r - 32))
		} else {
			result.value.WriteString(String.fromCodePoint(r))
		}
	}
	return result.value.String()
}

export async function main(): Promise<void> {
	let fm: FileMode = 0
	$.println("FileMode(0).String():", FileMode_String(fm))
	$.println("FileMode(0).IsZero():", FileMode_IsZero(fm))
	$.println("FileMode(5).String():", FileMode_String(5))
	$.println("FileMode(5).IsZero():", FileMode_IsZero(5))
	let result = FileMode_Add(3, 2)
	$.println("FileMode(3).Add(2):", $.int(result))
	$.println("FileMode(3).Add(2).String():", FileMode_String(result))
	let cs: CustomString = "hello"
	$.println("CustomString(\"hello\").Length():", CustomString_Length(cs))
	$.println("CustomString(\"hello\").Upper():", CustomString_Upper(cs))
	$.println("CustomString(\"world\").Length():", CustomString_Length("world"))
	$.println("CustomString(\"world\").Upper():", CustomString_Upper("world"))
}


if ($.isMainScript(import.meta)) {
	await main()
}

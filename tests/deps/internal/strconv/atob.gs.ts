// Generated file based on atob.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_atoi from "./atoi.gs.ts"
import "./atoi.gs.ts"

export function ParseBool(str: string): [boolean, $.GoError] {
	switch (str) {
		case "1":
		case "t":
		case "T":
		case "true":
		case "TRUE":
		case "True":
		{
			return [true, null]
			break
		}
		case "0":
		case "f":
		case "F":
		case "false":
		case "FALSE":
		case "False":
		{
			return [false, null]
			break
		}
	}
	return [false, $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": __goscript_atoi.Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
}

export function FormatBool(b: boolean): string {
	if (b) {
		return "true"
	}
	return "false"
}

export function AppendBool(dst: $.Slice<number>, b: boolean): $.Slice<number> {
	if (b) {
		return $.append(dst, ...($.stringToBytes("true") ?? []))
	}
	return $.append(dst, ...($.stringToBytes("false") ?? []))
}

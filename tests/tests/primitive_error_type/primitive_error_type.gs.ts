// Generated file based on primitive_error_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyError = number

export const ErrNegative: MyError = -1

export function MyError_Error(e: MyError): string {
	if (e == 0) {
		return "no error"
	}
	return "error occurred"
}

export function mayFail(n: number): $.GoError {
	if (n < 0) {
		return $.namedValueInterfaceValue<$.GoError>($.int(n), "main.MyError", {"Error": MyError_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "main.MyError" })
	}
	return null
}

export async function main(): globalThis.Promise<void> {
	let err = mayFail(5)
	if (err == null) {
		$.println("mayFail(5): no error")
	} else {
		$.println("mayFail(5):", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	}

	err = mayFail(-1)
	if (err == null) {
		$.println("mayFail(-1): no error")
	} else {
		$.println("mayFail(-1):", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	}

	{
		let __goscriptSwitch0 = err
		switch (true) {
			case $.comparableEqual(__goscriptSwitch0, $.namedValueInterfaceValue<$.GoError>(-1, "main.MyError", {"Error": MyError_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "main.MyError" })):
			{
				$.println("switch: matched primitive error")
				break
			}
			default:
			{
				$.println("switch: missed primitive error")
				break
			}
		}
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

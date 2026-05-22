// Generated file based on package_import_errors.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

export class customErr {
	public get msg(): string {
		return this._fields.msg.value
	}
	public set msg(value: string) {
		this._fields.msg.value = value
	}

	public _fields: {
		msg: $.VarRef<string>
	}

	constructor(init?: Partial<{msg?: string}>) {
		this._fields = {
			msg: $.varRef(init?.msg ?? "")
		}
	}

	public clone(): customErr {
		const cloned = new customErr()
		cloned._fields = {
			msg: $.varRef(this._fields.msg.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: customErr | $.VarRef<customErr> | null = this
		return $.pointerValue<customErr>(e).msg
	}

	static __typeInfo = $.registerStructType(
		"main.customErr",
		new customErr(),
		[{ name: "Error", args: [], returns: [] }],
		customErr,
		{"msg": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export class wrappedErr {
	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public _fields: {
		err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{err?: $.GoError}>) {
		this._fields = {
			err: $.varRef(init?.err ?? null)
		}
	}

	public clone(): wrappedErr {
		const cloned = new wrappedErr()
		cloned._fields = {
			err: $.varRef(this._fields.err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e = this
		return "wrapped: " + $.pointerValue<Exclude<$.GoError, null>>(e.err).Error()
	}

	public Unwrap(): $.GoError {
		const e = this
		return e.err
	}

	static __typeInfo = $.registerStructType(
		"main.wrappedErr",
		new wrappedErr(),
		[{ name: "Error", args: [], returns: [] }, { name: "Unwrap", args: [], returns: [] }],
		wrappedErr,
		{"err": "error"}
	)
}

export async function main(): Promise<void> {
	// Test basic error creation
	let err1 = errors.New("first error")
	let err2 = errors.New("second error")

	$.println("err1:", $.pointerValue<Exclude<$.GoError, null>>(err1).Error())
	$.println("err2:", $.pointerValue<Exclude<$.GoError, null>>(err2).Error())

	// Test error comparison
	$.println("err1 == err2:", err1 == err2)
	$.println("err1 == nil:", err1 == null)

	// Test nil error
	let nilErr: $.GoError = null
	$.println("nilErr == nil:", nilErr == null)

	let typedErr: customErr | $.VarRef<customErr> | null = new customErr({msg: "typed error"})
	let __goscriptTuple0 = errors.AsType({E: { type: { kind: $.TypeKind.Pointer, elemType: "main.customErr" }, zero: () => null }}, $.interfaceValue<$.GoError>($.markAsStructValue(new wrappedErr({err: $.interfaceValue<$.GoError>(typedErr, "*main.customErr")})), "main.wrappedErr"))
	let matched: customErr | $.VarRef<customErr> | null = __goscriptTuple0[0]
	let ok = __goscriptTuple0[1]
	$.println("AsType matched:", ok)
	if (ok) {
		$.println("AsType message:", $.pointerValue<customErr>(matched).msg)
	}
	let __goscriptTuple1 = errors.AsType({E: { type: { kind: $.TypeKind.Pointer, elemType: "main.customErr" }, zero: () => null }}, $.pointerValue(err1))
	ok = __goscriptTuple1[1]
	$.println("AsType missing:", ok)

	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}

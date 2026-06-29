// Generated file based on package_import_errors_as_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"
import "@goscript/errors/index.js"

export class wrappedHealthError {
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
			err: $.varRef(init?.err ?? (null as $.GoError))
		}
	}

	public clone(): wrappedHealthError {
		const cloned = new wrappedHealthError()
		cloned._fields = {
			err: $.varRef(this._fields.err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: wrappedHealthError | $.VarRef<wrappedHealthError> | null = this
		return $.pointerValue<Exclude<$.GoError, null>>($.pointerValue<wrappedHealthError>(e).err).Error()
	}

	public Health(): string {
		const e: wrappedHealthError | $.VarRef<wrappedHealthError> | null = this
		return "closed"
	}

	public Unwrap(): $.GoError {
		const e: wrappedHealthError | $.VarRef<wrappedHealthError> | null = this
		return $.pointerValue<wrappedHealthError>(e).err
	}

	static __typeInfo = $.registerStructType(
		"main.wrappedHealthError",
		() => new wrappedHealthError(),
		[{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Health", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Unwrap", args: [], returns: [{ type: "error" }] }],
		wrappedHealthError,
		[{ name: "err", key: "err", type: "error" }]
	)
}

export type healthError = {
	Error(): string
	Health(): string
}

$.registerInterfaceType(
	"main.healthError",
	null,
	[{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Health", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export async function main(): globalThis.Promise<void> {
	let err: wrappedHealthError | $.VarRef<wrappedHealthError> | null = (() => { const __goscriptLiteralField0 = errors.New("root"); return new wrappedHealthError({err: __goscriptLiteralField0}) })()

	let target: $.VarRef<healthError | null> = $.varRef(null as healthError | null)
	let ok = errors.As($.pointerValueOrNil($.interfaceValue<$.GoError>(err, "*main.wrappedHealthError"))!, $.interfaceValue<any>(target, "*main.healthError"))
	$.println("matched:", ok)
	if (ok) {
		$.println("health:", await $.pointerValue<Exclude<healthError, null>>(target.value).Health())
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

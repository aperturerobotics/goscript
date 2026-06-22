// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class hiddenError {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): hiddenError {
		const cloned = new hiddenError()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		return "closed"
	}

	static __typeInfo = $.registerStructType(
		"dep.hiddenError",
		() => new hiddenError(),
		[{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		hiddenError,
		[]
	)
}

export let ErrClosed: hiddenError = $.markAsStructValue(new hiddenError())

export function __goscript_set_ErrClosed(__goscriptValue: hiddenError): void {
	ErrClosed = __goscriptValue
}

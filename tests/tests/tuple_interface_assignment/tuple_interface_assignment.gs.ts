// Generated file based on tuple_interface_assignment.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class concrete {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): concrete {
		const cloned = new concrete()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Read(): number {
		return 7
	}

	static __typeInfo = $.registerStructType(
		"main.concrete",
		() => new concrete(),
		[{ name: "Read", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		concrete,
		[]
	)
}

export type reader = {
	Read(): number
}

$.registerInterfaceType(
	"main.reader",
	null,
	[{ name: "Read", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export function makeReader(): [concrete | $.VarRef<concrete> | null, $.GoError] {
	return [new concrete(), null]
}

export async function main(): globalThis.Promise<void> {
	let r: reader | null = null as reader | null
	let err: $.GoError = null as $.GoError
	let __goscriptTuple0: any = makeReader()
	r = $.interfaceValue<reader | null>(__goscriptTuple0[0], "*main.concrete")
	err = __goscriptTuple0[1]
	$.println("ok", ($.pointerValue<Exclude<reader, null>>(r).Read() == 7) && (err == null))
}

if ($.isMainScript(import.meta)) {
	await main()
}

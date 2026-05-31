// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/aperturerobotics/goscript/tests/tests/interface_embedded_parent_async/dep/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/interface_embedded_parent_async/dep/index.js"

export type Specific = {
	Name(): string | globalThis.Promise<string>
	Validate(): $.GoError | globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"main.Specific",
	null,
	[{ name: "Name", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Validate", args: [], returns: [{ name: "_r0", type: "error" }] }]
);

export class impl {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): impl {
		const cloned = new impl()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public async Name(): globalThis.Promise<string> {
		const i: impl | $.VarRef<impl> | null = this
		await $.chanSend(ready, true)
		await $.chanRecv(ready)
		return "ok"
	}

	public async Validate(): globalThis.Promise<$.GoError> {
		const i: impl | $.VarRef<impl> | null = this
		await $.chanSend(ready, true)
		await $.chanRecv(ready)
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.impl",
		() => new impl(),
		[{ name: "Name", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Validate", args: [], returns: [{ name: "_r0", type: "error" }] }],
		impl,
		[]
	)
}

export let ready: $.Channel<boolean> | null = $.makeChannel<boolean>(1, false, "both")

export function __goscript_set_ready(__goscriptValue: $.Channel<boolean> | null): void {
	ready = __goscriptValue
}

export function NewSpecific(): Specific | null {
	return $.interfaceValue<Specific | null>(new impl(), "*main.impl")
}

export async function main(): globalThis.Promise<void> {
	let s = NewSpecific()
	$.println("embedded directive", dep.Accept((s as dep.Directive | null)), await $.pointerValue<Exclude<Specific, null>>(s).Name())
}

if ($.isMainScript(import.meta)) {
	await main()
}

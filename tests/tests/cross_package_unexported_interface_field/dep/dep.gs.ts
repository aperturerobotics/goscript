// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

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

	public Ping(): string {
		return "pong"
	}

	static __typeInfo = $.registerStructType(
		"dep.impl",
		() => new impl(),
		[{ name: "Ping", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		impl,
		[]
	)
}

export class Holder {
	public get Hidden(): hidden | null {
		return this._fields.Hidden.value
	}
	public set Hidden(value: hidden | null) {
		this._fields.Hidden.value = value
	}

	public _fields: {
		Hidden: $.VarRef<hidden | null>
	}

	constructor(init?: Partial<{Hidden?: hidden | null}>) {
		this._fields = {
			Hidden: $.varRef(init?.Hidden ?? (null as unknown as hidden | null))
		}
	}

	public clone(): Holder {
		const cloned = new Holder()
		cloned._fields = {
			Hidden: $.varRef(this._fields.Hidden.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"dep.Holder",
		() => new Holder(),
		[],
		Holder,
		[{ name: "Hidden", key: "Hidden", type: "dep.hidden" }]
	)
}

export type hidden = {
	Ping(): string
}

$.registerInterfaceType(
	"dep.hidden",
	null,
	[{ name: "Ping", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export function NewHolder(): Holder {
	return $.markAsStructValue(new Holder({Hidden: $.interfaceValue<hidden | null>($.markAsStructValue(new impl()), "dep.impl")}))
}

// Generated file based on nil_pointer_receiver_field_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class child {
	public get value(): string {
		return this._fields.value.value
	}
	public set value(value: string) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<string>
	}

	constructor(init?: Partial<{value?: string}>) {
		this._fields = {
			value: $.varRef(init?.value ?? ("" as unknown as string))
		}
	}

	public clone(): child {
		const cloned = new child()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Clone(): child | $.VarRef<child> | null {
		const c: child | $.VarRef<child> | null = this
		if (c == null) {
			return null
		}
		return new child({value: $.pointerValue<child>(c).value})
	}

	static __typeInfo = $.registerStructType(
		"main.child",
		() => new child(),
		[{ name: "Clone", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "main.child" } }] }],
		child,
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export class parent {
	public get child(): child | $.VarRef<child> | null {
		return this._fields.child.value
	}
	public set child(value: child | $.VarRef<child> | null) {
		this._fields.child.value = value
	}

	public _fields: {
		child: $.VarRef<child | $.VarRef<child> | null>
	}

	constructor(init?: Partial<{child?: child | $.VarRef<child> | null}>) {
		this._fields = {
			child: $.varRef(init?.child ?? (null as unknown as child | $.VarRef<child> | null))
		}
	}

	public clone(): parent {
		const cloned = new parent()
		cloned._fields = {
			child: $.varRef(this._fields.child.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.parent",
		() => new parent(),
		[],
		parent,
		[{ name: "child", key: "child", type: { kind: $.TypeKind.Pointer, elemType: "main.child" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let p: parent = $.markAsStructValue(new parent())
	if (child.prototype.Clone.call(p.child) == null) {
		$.println("nil clone")
	}
	p.child = new child({value: "ok"})
	$.println($.pointerValue<child>(child.prototype.Clone.call(p.child)).value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

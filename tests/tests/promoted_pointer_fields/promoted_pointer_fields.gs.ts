// Generated file based on promoted_pointer_fields.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class counter {
	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<number>
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: $.varRef(init?.value ?? 0)
		}
	}

	public clone(): counter {
		const cloned = new counter()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Load(): number {
		const c: counter | $.VarRef<counter> | null = this
		return $.pointerValue<counter>(c).value
	}

	static __typeInfo = $.registerStructType(
		"main.counter",
		new counter(),
		[{ name: "Load", args: [], returns: [] }],
		counter,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class inner {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public get count(): counter {
		return this._fields.count.value
	}
	public set count(value: counter) {
		this._fields.count.value = value
	}

	public _fields: {
		name: $.VarRef<string>
		count: $.VarRef<counter>
	}

	constructor(init?: Partial<{name?: string, count?: counter}>) {
		this._fields = {
			name: $.varRef(init?.name ?? ""),
			count: $.varRef(init?.count ? $.markAsStructValue(init.count.clone()) : $.markAsStructValue(new counter()))
		}
	}

	public clone(): inner {
		const cloned = new inner()
		cloned._fields = {
			name: $.varRef(this._fields.name.value),
			count: $.varRef($.markAsStructValue(this._fields.count.value.clone()))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.inner",
		new inner(),
		[],
		inner,
		{"name": { kind: $.TypeKind.Basic, name: "string" }, "count": "main.counter"}
	)
}

export class outer {
	public get inner(): inner | $.VarRef<inner> | null {
		return this._fields.inner.value
	}
	public set inner(value: inner | $.VarRef<inner> | null) {
		this._fields.inner.value = value
	}

	public _fields: {
		inner: $.VarRef<inner | $.VarRef<inner> | null>
	}

	constructor(init?: Partial<{inner?: inner | $.VarRef<inner> | null}>) {
		this._fields = {
			inner: $.varRef(init?.inner ?? null)
		}
	}

	public clone(): outer {
		const cloned = new outer()
		cloned._fields = {
			inner: $.varRef(this._fields.inner.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.outer",
		new outer(),
		[],
		outer,
		{"inner": { kind: $.TypeKind.Pointer, elemType: "main.inner" }}
	)
}

export async function main(): globalThis.Promise<void> {
	let o: outer | $.VarRef<outer> | null = new outer({inner: new inner({name: "ready", count: $.markAsStructValue(new counter({value: 7}))})})

	$.println("name:", $.pointerValue<inner>($.pointerValue<outer>(o).inner).name)
	$.pointerValue<inner>($.pointerValue<outer>(o).inner).name = "done"
	$.println("renamed:", $.pointerValue<inner>($.pointerValue<outer>(o).inner).name, $.pointerValue<inner>($.pointerValue<outer>(o).inner).name)
	$.println("count:", $.pointerValue<inner>($.pointerValue<outer>(o).inner).count.Load())
}


if ($.isMainScript(import.meta)) {
	await main()
}

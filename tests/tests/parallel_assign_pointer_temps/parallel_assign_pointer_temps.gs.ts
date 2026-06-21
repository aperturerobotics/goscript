// Generated file based on parallel_assign_pointer_temps.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class node {
	public get next(): number {
		return this._fields.next.value
	}
	public set next(value: number) {
		this._fields.next.value = value
	}

	public _fields: {
		next: $.VarRef<number>
	}

	constructor(init?: Partial<{next?: number}>) {
		this._fields = {
			next: $.varRef(init?.next ?? (0 as unknown as number))
		}
	}

	public clone(): node {
		const cloned = new node()
		cloned._fields = {
			next: $.varRef(this._fields.next.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.node",
		() => new node(),
		[],
		node,
		[{ name: "next", key: "next", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/s4wave/goscript/tests/tests/parallel_assign_pointer_temps", index: [0], offset: 0, exported: false }]
	)
}

export class queue {
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
			value: $.varRef(init?.value ?? (0 as unknown as number))
		}
	}

	public clone(): queue {
		const cloned = new queue()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.queue",
		() => new queue(),
		[],
		queue,
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/s4wave/goscript/tests/tests/parallel_assign_pointer_temps", index: [0], offset: 0, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	let left: queue | $.VarRef<queue> | null = new queue({value: 1})
	let right: queue | $.VarRef<queue> | null = new queue({value: 2})
	let __goscriptAssign0_0: queue | $.VarRef<queue> | null = right
	let __goscriptAssign0_1: queue | $.VarRef<queue> | null = left
	left = __goscriptAssign0_0
	right = __goscriptAssign0_1
	$.println($.pointerValue<queue>(left).value, $.pointerValue<queue>(right).value)

	let nodes = [$.markAsStructValue(new node({next: 1})), $.markAsStructValue(new node({next: 0}))]
	let pc = 0
	let inst: node | $.VarRef<node> | null = $.indexRef(nodes, pc)
	let __goscriptAssign1_0: number = $.pointerValue<node>(inst).next
	let __goscriptAssign1_1: node | $.VarRef<node> | null = $.indexRef(nodes, $.pointerValue<node>(inst).next)
	pc = __goscriptAssign1_0
	inst = __goscriptAssign1_1
	$.println(pc, $.pointerValue<node>(inst).next)
}

if ($.isMainScript(import.meta)) {
	await main()
}

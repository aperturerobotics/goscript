// Generated file based on type_switch_varref_suffix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class branch {
	public get n(): number {
		return this._fields.n.value
	}
	public set n(value: number) {
		this._fields.n.value = value
	}

	public _fields: {
		n: $.VarRef<number>
	}

	constructor(init?: Partial<{n?: number}>) {
		this._fields = {
			n: $.varRef(init?.n ?? (0 as number))
		}
	}

	public clone(): branch {
		const cloned = new branch()
		cloned._fields = {
			n: $.varRef(this._fields.n.value)
		}
		return $.markAsStructValue(cloned)
	}

	public value(): number {
		const b: branch | $.VarRef<branch> | null = this
		return $.pointerValue<branch>(b).n
	}

	static __typeInfo = $.registerStructType(
		"main.branch",
		() => new branch(),
		[{ name: "value", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		branch,
		[{ name: "n", key: "n", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export type node = {
	value(): number
}

$.registerInterfaceType(
	"main.node",
	null,
	[{ name: "value", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export function accept(b: branch | $.VarRef<branch> | null): number {
	return $.pointerValue<branch>(b).n
}

export async function main(): globalThis.Promise<void> {
	let v: node | null = $.interfaceValue<node | null>(new branch({n: 3}), "*main.branch")
	{
		const __goscriptTypeSwitchValue = v
		switch (true) {
			case $.typeAssert<branch | $.VarRef<branch> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "main.branch" }).ok:
				{
					let e: branch | $.VarRef<branch> | null = $.typeAssert<branch | $.VarRef<branch> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "main.branch" }).value
					let imprecise = $.varRef(0)
					let ptr = imprecise
					ptr!.value = 4
					$.println("branch", accept(e), imprecise.value)
				}
				break
			default:
				{
					let e: any = __goscriptTypeSwitchValue
					$.println("other")
				}
				break
		}
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

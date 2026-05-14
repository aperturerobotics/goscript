// Generated file based on varref_composite_lit.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class MockInode {
	public get Value(): number {
		return this._fields.Value.value
	}
	public set Value(value: number) {
		this._fields.Value.value = value
	}

	public _fields: {
		Value: $.VarRef<number>
	}

	constructor(init?: Partial<{Value?: number}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? 0)
		}
	}

	public clone(): MockInode {
		const cloned = new MockInode()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public getValue(): number {
		const m = this
		return $.pointerValue(m).Value
	}

	static __typeInfo = $.registerStructType(
		"main.MockInode",
		new MockInode(),
		[{ name: "getValue", args: [], returns: [] }],
		MockInode,
		{"Value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): Promise<void> {
	let childInode: MockInode | $.VarRef<MockInode> | null = new MockInode({Value: 42})
	$.println("childInode.Value:", $.pointerValue(childInode).Value)
	$.println("childInode.getValue():", $.pointerValue(childInode).getValue())
}


if ($.isMainScript(import.meta)) {
	await main()
}

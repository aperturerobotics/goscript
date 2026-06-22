// Generated file based on varref_composite_lit.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

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
			Value: $.varRef(init?.Value ?? (0 as unknown as number))
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
		const m: MockInode | $.VarRef<MockInode> | null = this
		return $.pointerValue<MockInode>(m).Value
	}

	static __typeInfo = $.registerStructType(
		"main.MockInode",
		() => new MockInode(),
		[{ name: "getValue", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		MockInode,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	// This should generate: let childInode: MockInode | null = new MockInode({Value: 42})
	// Not: let childInode: MockInode | null = $.varRef(new MockInode({Value: 42}))
	// Because we're taking the address of a composite literal, not a variable
	let childInode: MockInode | $.VarRef<MockInode> | null = new MockInode({Value: 42})

	// Use the pointer
	$.println("childInode.Value:", $.pointerValue<MockInode>(childInode).Value)
	$.println("childInode.getValue():", MockInode.prototype.getValue.call(childInode))
}

if ($.isMainScript(import.meta)) {
	await main()
}

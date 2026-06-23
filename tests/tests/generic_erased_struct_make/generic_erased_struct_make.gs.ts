// Generated file based on generic_erased_struct_make.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class queue {
	public get buf(): $.Slice<any> {
		return this._fields.buf.value
	}
	public set buf(value: $.Slice<any>) {
		this._fields.buf.value = value
	}

	public _fields: {
		buf: $.VarRef<$.Slice<any>>
	}

	constructor(init?: Partial<{buf?: $.Slice<any>}>) {
		this._fields = {
			buf: $.varRef(init?.buf ?? (null as unknown as $.Slice<any>))
		}
	}

	public clone(): queue {
		const cloned = new queue()
		cloned._fields = {
			buf: $.varRef(this._fields.buf.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.queue",
		() => new queue(),
		[],
		queue,
		[{ name: "buf", key: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }]
	)
}

export function newQueue(__typeArgs: $.GenericTypeArgs | undefined, capacity: number): queue | $.VarRef<queue> | null {
	return new queue({buf: $.makeSlice<any>(capacity)})
}

export async function main(): globalThis.Promise<void> {
	let q: queue | $.VarRef<queue> | null = (newQueue({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, 2) as queue | $.VarRef<queue> | null)
	$.pointerValue<queue>(q).buf![0] = 7
	$.println($.len($.pointerValue<queue>(q).buf), $.arrayIndex($.pointerValue<queue>(q).buf!, 0))
}

if ($.isMainScript(import.meta)) {
	await main()
}

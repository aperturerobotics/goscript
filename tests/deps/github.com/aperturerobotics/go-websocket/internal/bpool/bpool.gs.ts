// Generated file based on bpool.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/bytes/index.js"
import "@goscript/sync/index.js"

export let bpool: $.VarRef<sync.Pool> = $.varRef($.markAsStructValue(new sync.Pool({New: $.functionValue((): any => {
	return $.interfaceValue<any>(new bytes.Buffer(), "*bytes.Buffer")
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))})))

export function __goscript_set_bpool(__goscriptValue: sync.Pool): void {
	bpool.value = __goscriptValue
}

export async function Get(): globalThis.Promise<bytes.Buffer | $.VarRef<bytes.Buffer> | null> {
	let b = await bpool.value.Get()
	return $.mustTypeAssert<bytes.Buffer | $.VarRef<bytes.Buffer> | null>(b, { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" })
}

export function Put(b: bytes.Buffer | $.VarRef<bytes.Buffer> | null): void {
	bytes.Buffer.prototype.Reset.call($.pointerValue<bytes.Buffer>(b))
	bpool.value.Put($.interfaceValue<any>(b, "*bytes.Buffer"))
}

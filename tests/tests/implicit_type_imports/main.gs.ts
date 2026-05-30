// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as io from "@goscript/io/index.js"

import * as __goscript_server from "./server.gs.ts"
import "./server.gs.ts"

export class localReadWriteCloser {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): localReadWriteCloser {
		const cloned = new localReadWriteCloser()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Close(): $.GoError {
		return null
	}

	public Read(_p0: $.Slice<number>): [number, $.GoError] {
		return [0, null]
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		return [$.len(p), null]
	}

	static __typeInfo = $.registerStructType(
		"main.localReadWriteCloser",
		() => new localReadWriteCloser(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Read", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }],
		localReadWriteCloser,
		[]
	)
}

export async function main(): globalThis.Promise<void> {
	let server: __goscript_server.Server | $.VarRef<__goscript_server.Server> | null = new __goscript_server.Server()
	__goscript_server.Server.prototype.Handle.call(server, $.interfaceValue<io.ReadWriteCloser | null>(new localReadWriteCloser(), "*main.localReadWriteCloser"))
	$.println("ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}

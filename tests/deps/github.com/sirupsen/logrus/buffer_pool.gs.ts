// Generated file based on buffer_pool.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/bytes/index.js"
import "@goscript/sync/index.js"

export type BufferPool = {
	Get(): bytes.Buffer | $.VarRef<bytes.Buffer> | null | globalThis.Promise<bytes.Buffer | $.VarRef<bytes.Buffer> | null>
	Put(_p0: bytes.Buffer | $.VarRef<bytes.Buffer> | null): void
}

$.registerInterfaceType(
	"logrus.BufferPool",
	null,
	[{ name: "Get", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" } }] }, { name: "Put", args: [{ name: "_p0", type: { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" } }], returns: [] }]
);

export class defaultPool {
	public get pool(): sync.Pool | $.VarRef<sync.Pool> | null {
		return this._fields.pool.value
	}
	public set pool(value: sync.Pool | $.VarRef<sync.Pool> | null) {
		this._fields.pool.value = value
	}

	public _fields: {
		pool: $.VarRef<sync.Pool | $.VarRef<sync.Pool> | null>
	}

	constructor(init?: Partial<{pool?: sync.Pool | $.VarRef<sync.Pool> | null}>) {
		this._fields = {
			pool: $.varRef(init?.pool ?? (null as sync.Pool | $.VarRef<sync.Pool> | null))
		}
	}

	public clone(): defaultPool {
		const cloned = new defaultPool()
		cloned._fields = {
			pool: $.varRef(this._fields.pool.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Get(): globalThis.Promise<bytes.Buffer | $.VarRef<bytes.Buffer> | null> {
		const p: defaultPool | $.VarRef<defaultPool> | null = this
		return $.mustTypeAssert<bytes.Buffer | $.VarRef<bytes.Buffer> | null>(await sync.Pool.prototype.Get.call($.pointerValue<sync.Pool>($.pointerValue<defaultPool>(p).pool)), { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" })
	}

	public Put(buf: bytes.Buffer | $.VarRef<bytes.Buffer> | null): void {
		const p: defaultPool | $.VarRef<defaultPool> | null = this
		sync.Pool.prototype.Put.call($.pointerValue<sync.Pool>($.pointerValue<defaultPool>(p).pool), $.interfaceValue<any>(buf, "*bytes.Buffer"))
	}

	static __typeInfo = $.registerStructType(
		"logrus.defaultPool",
		() => new defaultPool(),
		[{ name: "Get", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" } }] }, { name: "Put", args: [{ name: "buf", type: { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" } }], returns: [] }],
		defaultPool,
		[{ name: "pool", key: "pool", type: { kind: $.TypeKind.Pointer, elemType: "sync.Pool" }, pkgPath: "github.com/sirupsen/logrus", index: [0], offset: 0, exported: false }]
	)
}

export let bufferPool: BufferPool | null = $.interfaceValue<BufferPool | null>(new defaultPool({pool: new sync.Pool({New: $.functionValue((): any => {
	return $.interfaceValue<any>(new bytes.Buffer(), "*bytes.Buffer")
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))})}), "*logrus.defaultPool")

export function __goscript_set_bufferPool(__goscriptValue: BufferPool | null): void {
	bufferPool = __goscriptValue
}

export function SetBufferPool(bp: BufferPool | null): void {
	bufferPool = bp
}

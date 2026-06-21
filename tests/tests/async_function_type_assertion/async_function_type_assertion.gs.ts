// Generated file based on async_function_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Worker {
	public get ch(): $.Channel<number> | null {
		return this._fields.ch.value
	}
	public set ch(value: $.Channel<number> | null) {
		this._fields.ch.value = value
	}

	public _fields: {
		ch: $.VarRef<$.Channel<number> | null>
	}

	constructor(init?: Partial<{ch?: $.Channel<number> | null}>) {
		this._fields = {
			ch: $.varRef(init?.ch ?? (null as unknown as $.Channel<number> | null))
		}
	}

	public clone(): Worker {
		const cloned = new Worker()
		cloned._fields = {
			ch: $.varRef(this._fields.ch.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async lookup(network: string): globalThis.Promise<number> {
		const w: Worker | $.VarRef<Worker> | null = this
		await $.chanSend($.pointerValue<Worker>(w).ch, $.len(network))
		return await $.chanRecv($.pointerValue<Worker>(w).ch)
	}

	static __typeInfo = $.registerStructType(
		"main.Worker",
		() => new Worker(),
		[{ name: "lookup", args: [{ name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		Worker,
		[{ name: "ch", key: "ch", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "int" } }, pkgPath: "github.com/s4wave/goscript/tests/tests/async_function_type_assertion", index: [0], offset: 0, exported: false }]
	)
}

export async function callLookup(fn: ((_p0: string) => number | globalThis.Promise<number>) | null, network: string): globalThis.Promise<number> {
	return await fn!(network)
}

export function syncLookup(network: string): number {
	return $.len(network)
}

export function chooseLookup(value: any, worker: Worker | $.VarRef<Worker> | null): number {
	let resolver: ((network: string) => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => (network: string) => __receiver.lookup(network))($.pointerValue<Worker>(worker)), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	{
		let [alt, ] = $.typeAssertTuple<((_p0: string) => number | globalThis.Promise<number>) | null>(value, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
		if (alt != null) {
			resolver = alt
		}
	}
	resolver
	return 2
}

export async function main(): globalThis.Promise<void> {
	let worker: Worker | $.VarRef<Worker> | null = new Worker({ch: $.makeChannel<number>(1, 0, "both")})
	$.println("lookup:", chooseLookup(null, worker))

	await $.chanSend($.pointerValue<Worker>(worker).ch, 1)
	await $.chanRecv($.pointerValue<Worker>(worker).ch)
	$.println("call:", await callLookup($.functionValue(((__receiver) => (network: string) => __receiver.lookup(network))($.pointerValue<Worker>(worker)), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)), "tcp"))

	let hook: ((fn: ((_p0: string) => number | globalThis.Promise<number>) | null, network: string) => number | globalThis.Promise<number>) | null = $.functionValue(async (fn: ((_p0: string) => number | globalThis.Promise<number>) | null, network: string): globalThis.Promise<number> => {
		return await fn!(network)
	}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo), { kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	$.println("hook:", await hook!(syncLookup, "ip"))
	$.pointerValue<Worker>(worker).ch!.close()
}

if ($.isMainScript(import.meta)) {
	await main()
}

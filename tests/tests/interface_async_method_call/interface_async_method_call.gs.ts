// Generated file based on interface_async_method_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type AsyncProcessor = {
	GetResult(): number
	Process(data: number): number | globalThis.Promise<number>
}

$.registerInterfaceType(
	"main.AsyncProcessor",
	null,
	[{ name: "GetResult", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Process", args: [{ name: "data", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
)

export type GenericStore = {
	Load(): any | globalThis.Promise<any>
}

$.registerInterfaceType(
	"main.GenericStore",
	null,
	[{ name: "Load", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }]
)

export class ChannelProcessor {
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
			ch: $.varRef(init?.ch ?? null)
		}
	}

	public clone(): ChannelProcessor {
		const cloned = new ChannelProcessor()
		cloned._fields = {
			ch: $.varRef(this._fields.ch.value)
		}
		return $.markAsStructValue(cloned)
	}

	public GetResult(): number {
		const p: ChannelProcessor | $.VarRef<ChannelProcessor> | null = this
		// This method is sync
		return 42
	}

	public async Process(data: number): globalThis.Promise<number> {
		const p: ChannelProcessor | $.VarRef<ChannelProcessor> | null = this
		// Channel operation makes this function async
		await $.chanSend($.pointerValue<ChannelProcessor>(p).ch, data)
		let result = await $.chanRecv($.pointerValue<ChannelProcessor>(p).ch)
		return result * 2
	}

	static __typeInfo = $.registerStructType(
		"main.ChannelProcessor",
		() => new ChannelProcessor(),
		[{ name: "GetResult", args: [], returns: [] }, { name: "Process", args: [], returns: [] }],
		ChannelProcessor,
		[{ name: "ch", key: "ch", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "int" } }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/interface_async_method_call", index: [0], offset: 0, exported: false }]
	)
}

export class SimpleProcessor {
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

	public clone(): SimpleProcessor {
		const cloned = new SimpleProcessor()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public GetResult(): number {
		const p: SimpleProcessor | $.VarRef<SimpleProcessor> | null = this
		return $.pointerValue<SimpleProcessor>(p).value
	}

	public Process(data: number): number {
		const p: SimpleProcessor | $.VarRef<SimpleProcessor> | null = this
		// Simple operation, but must be async due to interface constraint
		return data + 10
	}

	static __typeInfo = $.registerStructType(
		"main.SimpleProcessor",
		() => new SimpleProcessor(),
		[{ name: "GetResult", args: [], returns: [] }, { name: "Process", args: [], returns: [] }],
		SimpleProcessor,
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/interface_async_method_call", index: [0], offset: 0, exported: false }]
	)
}

export class GenericChannelStore {
	public get ch(): $.Channel<any> | null {
		return this._fields.ch.value
	}
	public set ch(value: $.Channel<any> | null) {
		this._fields.ch.value = value
	}

	public get value(): any {
		return this._fields.value.value
	}
	public set value(value: any) {
		this._fields.value.value = value
	}

	public _fields: {
		ch: $.VarRef<$.Channel<any> | null>
		value: $.VarRef<any>
	}

	constructor(init?: Partial<{ch?: $.Channel<any> | null, value?: any}>) {
		this._fields = {
			ch: $.varRef(init?.ch ?? null),
			value: $.varRef(init?.value ?? null)
		}
	}

	public clone(): GenericChannelStore {
		const cloned = new GenericChannelStore()
		cloned._fields = {
			ch: $.varRef(this._fields.ch.value),
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Load(): globalThis.Promise<any> {
		const s: GenericChannelStore | $.VarRef<GenericChannelStore> | null = this
		await $.chanSend($.pointerValue<GenericChannelStore>(s).ch, $.pointerValue<GenericChannelStore>(s).value)
		return await $.chanRecv($.pointerValue<GenericChannelStore>(s).ch)
	}

	static __typeInfo = $.registerStructType(
		"main.GenericChannelStore",
		() => new GenericChannelStore(),
		[{ name: "Load", args: [], returns: [] }],
		GenericChannelStore,
		[{ name: "ch", key: "ch", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Interface, methods: [] } }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/interface_async_method_call", index: [0], offset: 0, exported: false }, { name: "value", key: "value", type: { kind: $.TypeKind.Interface, methods: [] }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/interface_async_method_call", index: [1], offset: 0, exported: false }]
	)
}

export async function processViaInterface(processor: AsyncProcessor | null, input: number): globalThis.Promise<number> {
	// This call should be awaited in TypeScript since Process is async
	let result = await $.pointerValue<Exclude<AsyncProcessor, null>>(processor).Process(input)

	// This call should NOT be awaited since GetResult is sync
	let baseResult = $.pointerValue<Exclude<AsyncProcessor, null>>(processor).GetResult()

	return result + baseResult
}

export function newGenericStore(__typeArgs: $.GenericTypeArgs | undefined, value: any): GenericStore | null {
	return $.interfaceValue<GenericStore | null>(new GenericChannelStore({ch: $.makeChannel<any>(1, null, "both"), value: value}), "*main.GenericChannelStore[V]")
}

export async function loadGenericStore(store: GenericStore | null): globalThis.Promise<number> {
	return (await $.pointerValue<Exclude<GenericStore, null>>(store).Load() as number)
}

export async function main(): globalThis.Promise<void> {
	// Create a buffered channel
	let ch = $.makeChannel<number>(1, 0, "both")

	// Test with ChannelProcessor (naturally async)
	let channelProc: ChannelProcessor | $.VarRef<ChannelProcessor> | null = new ChannelProcessor({ch: ch})
	let result1 = await processViaInterface($.interfaceValue<AsyncProcessor | null>(channelProc, "*main.ChannelProcessor"), 5)
	$.println("ChannelProcessor result:", result1)

	// Test with SimpleProcessor (forced async for compatibility)
	let simpleProc: SimpleProcessor | $.VarRef<SimpleProcessor> | null = new SimpleProcessor({value: 100})
	let result2 = await processViaInterface($.interfaceValue<AsyncProcessor | null>(simpleProc, "*main.SimpleProcessor"), 5)
	$.println("SimpleProcessor result:", result2)

	let genericStore = (newGenericStore({V: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, 7) as GenericStore | null)
	$.println("GenericStore result:", await loadGenericStore(genericStore))

	ch!.close()
}

if ($.isMainScript(import.meta)) {
	await main()
}

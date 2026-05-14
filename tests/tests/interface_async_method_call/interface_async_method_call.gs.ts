// Generated file based on interface_async_method_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type AsyncProcessor = null | {
	GetResult(): number
	Process(data: number): Promise<number>
}

$.registerInterfaceType(
	"main.AsyncProcessor",
	null,
	[{ name: "GetResult", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Process", args: [{ name: "data", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
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
		const p = this
		return 42
	}

	public async Process(data: number): Promise<number> {
		const p = this
		await $.chanSend($.pointerValue(p).ch, data)
		let result = await $.chanRecv($.pointerValue(p).ch)
		return result * 2
	}

	static __typeInfo = $.registerStructType(
		"main.ChannelProcessor",
		new ChannelProcessor(),
		[{ name: "GetResult", args: [], returns: [] }, { name: "Process", args: [], returns: [] }],
		ChannelProcessor,
		{"ch": { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "int" } }}
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
		const p = this
		return $.pointerValue(p).value
	}

	public Process(data: number): number {
		const p = this
		return data + 10
	}

	static __typeInfo = $.registerStructType(
		"main.SimpleProcessor",
		new SimpleProcessor(),
		[{ name: "GetResult", args: [], returns: [] }, { name: "Process", args: [], returns: [] }],
		SimpleProcessor,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function processViaInterface(processor: AsyncProcessor, input: number): Promise<number> {
	let result = await processor.Process(input)
	let baseResult = processor.GetResult()
	return result + baseResult
}

export async function main(): Promise<void> {
	let ch = $.makeChannel<number>(1, 0, "both")
	let channelProc = new ChannelProcessor({ch: ch})
	let result1 = await processViaInterface(channelProc, 5)
	$.println("ChannelProcessor result:", result1)
	let simpleProc = new SimpleProcessor({value: 100})
	let result2 = await processViaInterface(simpleProc, 5)
	$.println("SimpleProcessor result:", result2)
	ch.close()
}


if ($.isMainScript(import.meta)) {
	await main()
}

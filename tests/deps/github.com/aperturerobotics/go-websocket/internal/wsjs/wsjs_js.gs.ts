// Generated file based on wsjs_js.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as js from "@goscript/syscall/js/index.js"
import "@goscript/syscall/js/index.js"

export class WebSocket {
	public get v(): js.Value {
		return this._fields.v.value
	}
	public set v(value: js.Value) {
		this._fields.v.value = value
	}

	public _fields: {
		v: $.VarRef<js.Value>
	}

	constructor(init?: Partial<{v?: js.Value}>) {
		this._fields = {
			v: $.varRef(init?.v ? $.markAsStructValue($.cloneStructValue(init.v)) : $.markAsStructValue(new js.Value()))
		}
	}

	public clone(): WebSocket {
		const cloned = new WebSocket()
		cloned._fields = {
			v: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.v.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(code: number, reason: string): globalThis.Promise<$.GoError> {
		const c = this
		let err: $.VarRef<$.GoError> = $.varRef(null as $.GoError)
		await using __defer = new $.AsyncDisposableStack()
		__defer.defer(async () => { await handleJSError(err, (null as (() => void) | null)) })
		$.markAsStructValue($.cloneStructValue(c.v)).Call("close", $.namedValueInterfaceValue<any>(code, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), reason)
		const __goscriptReturn1: $.GoError = err.value
		err.value = __goscriptReturn1
		await __defer[Symbol.asyncDispose]()
		return err.value
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async OnClose(fn: ((_p0: CloseEvent) => void) | null): globalThis.Promise<(() => void) | null> {
		const c = this
		let remove: (() => void) | null = null as unknown as (() => void) | null
		return await $.markAsStructValue($.cloneStructValue(c)).addEventListener("close", $.functionValue(async (e: js.Value): globalThis.Promise<void> => {
			let ce = (() => { const __goscriptLiteralField1 = $.uint($.uint($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(e)).Get("code"))).Int(), 16), 16); const __goscriptLiteralField2 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(e)).Get("reason"))).String(); const __goscriptLiteralField3 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(e)).Get("wasClean"))).Bool(); return $.markAsStructValue(new CloseEvent({Code: __goscriptLiteralField1, Reason: __goscriptLiteralField2, WasClean: __goscriptLiteralField3})) })()
			await fn!($.markAsStructValue($.cloneStructValue(ce)))
		}, ({ kind: $.TypeKind.Function, params: ["js.Value"], results: [] } as $.FunctionTypeInfo)))
	}

	public async OnError(fn: ((e: js.Value) => void) | null): globalThis.Promise<(() => void) | null> {
		const c = this
		let remove: (() => void) | null = null as unknown as (() => void) | null
		return await $.markAsStructValue($.cloneStructValue(c)).addEventListener("error", fn)
	}

	public async OnMessage(fn: ((m: MessageEvent) => void) | null): globalThis.Promise<(() => void) | null> {
		const c = this
		let remove: (() => void) | null = null as unknown as (() => void) | null
		return await $.markAsStructValue($.cloneStructValue(c)).addEventListener("message", $.functionValue(async (e: js.Value): globalThis.Promise<void> => {
			let data: any = null as any

			let arrayBuffer = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(e)).Get("data")))
			if ($.markAsStructValue($.cloneStructValue(arrayBuffer)).Type() == js.TypeString) {
				data = $.markAsStructValue($.cloneStructValue(arrayBuffer)).String()
			} else {
				data = $.interfaceValue<any>(extractArrayBuffer($.markAsStructValue($.cloneStructValue(arrayBuffer))), "[]byte")
			}

			let me = $.markAsStructValue(new MessageEvent({Data: data}))
			await fn!($.markAsStructValue($.cloneStructValue(me)))
		}, ({ kind: $.TypeKind.Function, params: ["js.Value"], results: [] } as $.FunctionTypeInfo)))
	}

	public async OnOpen(fn: ((e: js.Value) => void) | null): globalThis.Promise<(() => void) | null> {
		const c = this
		let remove: (() => void) | null = null as unknown as (() => void) | null
		return await $.markAsStructValue($.cloneStructValue(c)).addEventListener("open", fn)
	}

	public async SendBytes(v: $.Slice<number>): globalThis.Promise<$.GoError> {
		const c = this
		let err: $.VarRef<$.GoError> = $.varRef(null as $.GoError)
		await using __defer = new $.AsyncDisposableStack()
		__defer.defer(async () => { await handleJSError(err, (null as (() => void) | null)) })
		$.markAsStructValue($.cloneStructValue(c.v)).Call("send", $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(uint8Array(v))), "js.Value"))
		const __goscriptReturn2: $.GoError = err.value
		err.value = __goscriptReturn2
		await __defer[Symbol.asyncDispose]()
		return err.value
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async SendText(v: string): globalThis.Promise<$.GoError> {
		const c = this
		let err: $.VarRef<$.GoError> = $.varRef(null as $.GoError)
		await using __defer = new $.AsyncDisposableStack()
		__defer.defer(async () => { await handleJSError(err, (null as (() => void) | null)) })
		$.markAsStructValue($.cloneStructValue(c.v)).Call("send", v)
		const __goscriptReturn3: $.GoError = err.value
		err.value = __goscriptReturn3
		await __defer[Symbol.asyncDispose]()
		return err.value
		throw new globalThis.Error("goscript: unreachable return")
	}

	public Subprotocol(): string {
		const c = this
		return $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(c.v)).Get("protocol"))).String()
	}

	public async addEventListener(eventType: string, fn: ((e: js.Value) => void) | null): globalThis.Promise<(() => void) | null> {
		const c = this
		let f = $.markAsStructValue($.cloneStructValue(js.FuncOf($.functionValue(async (_this: js.Value, args: $.Slice<js.Value>): globalThis.Promise<any> => {
			await fn!($.markAsStructValue($.cloneStructValue(args![0])))
			return null
		}, ({ kind: $.TypeKind.Function, params: ["js.Value", { kind: $.TypeKind.Slice, elemType: "js.Value" }], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo)))))
		$.markAsStructValue($.cloneStructValue(c.v)).Call("addEventListener", eventType, $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(f)), "js.Func"))

		return $.functionValue((): void => {
			$.markAsStructValue($.cloneStructValue(c.v)).Call("removeEventListener", eventType, $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(f)), "js.Func"))
			$.markAsStructValue($.cloneStructValue(f)).Release()
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
	}

	public setBinaryType(typ: string): void {
		const c = this
		$.markAsStructValue($.cloneStructValue(c.v)).Set("binaryType", typ)
	}

	static __typeInfo = $.registerStructType(
		"wsjs.WebSocket",
		() => new WebSocket(),
		[{ name: "Close", args: [{ name: "code", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "reason", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "err", type: "error" }] }, { name: "OnClose", args: [{ name: "fn", type: ({ kind: $.TypeKind.Function, params: ["wsjs.CloseEvent"], results: [] } as $.FunctionTypeInfo) }], returns: [{ name: "remove", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo) }] }, { name: "OnError", args: [{ name: "fn", type: ({ kind: $.TypeKind.Function, params: ["js.Value"], results: [] } as $.FunctionTypeInfo) }], returns: [{ name: "remove", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo) }] }, { name: "OnMessage", args: [{ name: "fn", type: ({ kind: $.TypeKind.Function, params: ["wsjs.MessageEvent"], results: [] } as $.FunctionTypeInfo) }], returns: [{ name: "remove", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo) }] }, { name: "OnOpen", args: [{ name: "fn", type: ({ kind: $.TypeKind.Function, params: ["js.Value"], results: [] } as $.FunctionTypeInfo) }], returns: [{ name: "remove", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo) }] }, { name: "SendBytes", args: [{ name: "v", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "err", type: "error" }] }, { name: "SendText", args: [{ name: "v", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "err", type: "error" }] }, { name: "Subprotocol", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "addEventListener", args: [{ name: "eventType", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "fn", type: ({ kind: $.TypeKind.Function, params: ["js.Value"], results: [] } as $.FunctionTypeInfo) }], returns: [{ name: "_r0", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo) }] }, { name: "setBinaryType", args: [{ name: "typ", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }],
		WebSocket,
		[{ name: "v", key: "v", type: "js.Value", pkgPath: "github.com/aperturerobotics/go-websocket/internal/wsjs", index: [0], offset: 0, exported: false }]
	)
}

export class CloseEvent {
	public get Code(): number {
		return this._fields.Code.value
	}
	public set Code(value: number) {
		this._fields.Code.value = value
	}

	public get Reason(): string {
		return this._fields.Reason.value
	}
	public set Reason(value: string) {
		this._fields.Reason.value = value
	}

	public get WasClean(): boolean {
		return this._fields.WasClean.value
	}
	public set WasClean(value: boolean) {
		this._fields.WasClean.value = value
	}

	public _fields: {
		Code: $.VarRef<number>
		Reason: $.VarRef<string>
		WasClean: $.VarRef<boolean>
	}

	constructor(init?: Partial<{Code?: number, Reason?: string, WasClean?: boolean}>) {
		this._fields = {
			Code: $.varRef(init?.Code ?? 0),
			Reason: $.varRef(init?.Reason ?? ""),
			WasClean: $.varRef(init?.WasClean ?? false)
		}
	}

	public clone(): CloseEvent {
		const cloned = new CloseEvent()
		cloned._fields = {
			Code: $.varRef(this._fields.Code.value),
			Reason: $.varRef(this._fields.Reason.value),
			WasClean: $.varRef(this._fields.WasClean.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"wsjs.CloseEvent",
		() => new CloseEvent(),
		[],
		CloseEvent,
		[{ name: "Code", key: "Code", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [0], offset: 0, exported: true }, { name: "Reason", key: "Reason", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 8, exported: true }, { name: "WasClean", key: "WasClean", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [2], offset: 24, exported: true }]
	)
}

export class MessageEvent {
	// string or []byte.
	public get Data(): any {
		return this._fields.Data.value
	}
	public set Data(value: any) {
		this._fields.Data.value = value
	}

	public _fields: {
		Data: $.VarRef<any>
	}

	constructor(init?: Partial<{Data?: any}>) {
		this._fields = {
			Data: $.varRef(init?.Data ?? null)
		}
	}

	public clone(): MessageEvent {
		const cloned = new MessageEvent()
		cloned._fields = {
			Data: $.varRef(this._fields.Data.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"wsjs.MessageEvent",
		() => new MessageEvent(),
		[],
		MessageEvent,
		[{ name: "Data", key: "Data", type: { kind: $.TypeKind.Interface, methods: [] }, index: [0], offset: 0, exported: true }]
	)
}

export async function handleJSError(err: $.VarRef<$.GoError> | null, onErr: (() => void) | null): globalThis.Promise<void> {
	let r = $.recover()

	{
		let [jsErr, ok] = $.typeAssertTuple<js.Error>(r, "js.Error")
		if (ok) {
			err!.value = $.interfaceValue<$.GoError>($.markAsStructValue($.cloneStructValue(jsErr)), "js.Error")

			if (onErr != null) {
				await onErr!()
			}
			return
		}
	}

	if (r != null) {
		$.panic(r)
	}
}

export async function New(url: string, protocols: $.Slice<string>): globalThis.Promise<[WebSocket, $.GoError]> {
	let c: WebSocket = $.markAsStructValue(new WebSocket())
	let err: $.VarRef<$.GoError> = $.varRef(null as $.GoError)
	await using __defer = new $.AsyncDisposableStack()
	__defer.defer(async () => { await handleJSError(err, $.functionValue((): void => {
		c = $.markAsStructValue(new WebSocket())
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))) })

	let jsProtocols: $.Slice<any> = $.makeSlice<any>($.len(protocols))
	for (let __goscriptRangeTarget0 = protocols, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let p = __goscriptRangeTarget0![i]
		jsProtocols![i] = p
	}

	c = (() => { const __goscriptLiteralField0 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(js.Global())).Get("WebSocket"))).New(url, $.interfaceValue<any>(jsProtocols, "[]any")))); return $.markAsStructValue(new WebSocket({v: __goscriptLiteralField0})) })()

	$.markAsStructValue($.cloneStructValue(c)).setBinaryType("arraybuffer")

	const __goscriptReturn0: [WebSocket, $.GoError] = [$.markAsStructValue($.cloneStructValue(c)), null]
	c = __goscriptReturn0[0]
	err.value = __goscriptReturn0[1]
	await __defer[Symbol.asyncDispose]()
	return [c, err.value]
	throw new globalThis.Error("goscript: unreachable return")
}

export function extractArrayBuffer(arrayBuffer: js.Value): $.Slice<number> {
	let uint8Array = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(js.Global())).Get("Uint8Array"))).New($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(arrayBuffer)), "js.Value"))))
	let dst: $.Slice<number> = $.makeSlice<number>($.markAsStructValue($.cloneStructValue(uint8Array)).Length(), undefined, "byte")
	js.CopyBytesToGo(dst, $.markAsStructValue($.cloneStructValue(uint8Array)))
	return dst
}

export function uint8Array(src: $.Slice<number>): js.Value {
	let __goscriptShadow0 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(js.Global())).Get("Uint8Array"))).New($.namedValueInterfaceValue<any>($.len(src), "int", {}, { kind: $.TypeKind.Basic, name: "int" }))))
	js.CopyBytesToJS($.markAsStructValue($.cloneStructValue(__goscriptShadow0)), src)
	return $.markAsStructValue($.cloneStructValue(__goscriptShadow0))
}

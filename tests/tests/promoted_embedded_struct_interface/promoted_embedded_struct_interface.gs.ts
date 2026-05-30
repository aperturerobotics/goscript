// Generated file based on promoted_embedded_struct_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class stream {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		name: $.VarRef<string>
	}

	constructor(init?: Partial<{name?: string}>) {
		this._fields = {
			name: $.varRef(init?.name ?? "")
		}
	}

	public clone(): stream {
		const cloned = new stream()
		cloned._fields = {
			name: $.varRef(this._fields.name.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Close(): string {
		const s = this
		return "close:" + s.name
	}

	static __typeInfo = $.registerStructType(
		"main.stream",
		() => new stream(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		stream,
		[{ name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/promoted_embedded_struct_interface", index: [0], offset: 0, exported: false }]
	)
}

export class stopStream {
	public get stream(): stream {
		return this._fields.stream.value
	}
	public set stream(value: stream) {
		this._fields.stream.value = value
	}

	public _fields: {
		stream: $.VarRef<stream>
	}

	constructor(init?: Partial<{stream?: stream}>) {
		this._fields = {
			stream: $.varRef(init?.stream ? $.markAsStructValue($.cloneStructValue(init.stream)) : $.markAsStructValue(new stream()))
		}
	}

	public clone(): stopStream {
		const cloned = new stopStream()
		cloned._fields = {
			stream: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.stream.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Close(): any {
		return $.pointerValue<stream>(this.stream).Close()
	}

	static __typeInfo = $.registerStructType(
		"main.stopStream",
		() => new stopStream(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		stopStream,
		[{ name: "stream", key: "stream", type: "main.stream", pkgPath: "github.com/aperturerobotics/goscript/tests/tests/promoted_embedded_struct_interface", anonymous: true, index: [0], offset: 0, exported: false }]
	)
}

export class pointerStopStream {
	public get stream(): stream | $.VarRef<stream> | null {
		return this._fields.stream.value
	}
	public set stream(value: stream | $.VarRef<stream> | null) {
		this._fields.stream.value = value
	}

	public _fields: {
		stream: $.VarRef<stream | $.VarRef<stream> | null>
	}

	constructor(init?: Partial<{stream?: stream | $.VarRef<stream> | null}>) {
		this._fields = {
			stream: $.varRef(init?.stream ?? null)
		}
	}

	public clone(): pointerStopStream {
		const cloned = new pointerStopStream()
		cloned._fields = {
			stream: $.varRef(this._fields.stream.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Close(): any {
		return $.pointerValue<stream>(this.stream).Close()
	}

	static __typeInfo = $.registerStructType(
		"main.pointerStopStream",
		() => new pointerStopStream(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		pointerStopStream,
		[{ name: "stream", key: "stream", type: { kind: $.TypeKind.Pointer, elemType: "main.stream" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/promoted_embedded_struct_interface", anonymous: true, index: [0], offset: 0, exported: false }]
	)
}

export type closer = {
	Close(): string
}

$.registerInterfaceType(
	"main.closer",
	null,
	[{ name: "Close", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export function closeIt(c: closer | null): void {
	$.println($.pointerValue<Exclude<closer, null>>(c).Close())
}

export async function main(): globalThis.Promise<void> {
	let value = $.markAsStructValue(new stopStream({stream: $.markAsStructValue(new stream({name: "value"}))}))
	closeIt($.interfaceValue<closer | null>($.markAsStructValue($.cloneStructValue(value)), "main.stopStream"))

	let ptr: stopStream | $.VarRef<stopStream> | null = new stopStream({stream: $.markAsStructValue(new stream({name: "pointer"}))})
	closeIt($.interfaceValue<closer | null>(ptr, "*main.stopStream"))

	let promotedPtr = $.markAsStructValue(new pointerStopStream({stream: new stream({name: "embedded pointer"})}))
	closeIt($.interfaceValue<closer | null>($.markAsStructValue($.cloneStructValue(promotedPtr)), "main.pointerStopStream"))
}

if ($.isMainScript(import.meta)) {
	await main()
}

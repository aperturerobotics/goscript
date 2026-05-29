// Generated file based on message.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "@goscript/errors/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

export type Message = protobuf_go_lite.Message | null

export class RawMessage {
	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public get copy(): boolean {
		return this._fields.copy.value
	}
	public set copy(value: boolean) {
		this._fields.copy.value = value
	}

	public _fields: {
		data: $.VarRef<$.Slice<number>>
		copy: $.VarRef<boolean>
	}

	constructor(init?: Partial<{data?: $.Slice<number>, copy?: boolean}>) {
		this._fields = {
			data: $.varRef(init?.data ?? null),
			copy: $.varRef(init?.copy ?? false)
		}
	}

	public clone(): RawMessage {
		const cloned = new RawMessage()
		cloned._fields = {
			data: $.varRef(this._fields.data.value),
			copy: $.varRef(this._fields.copy.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Clear(): void {
		let m: RawMessage | $.VarRef<RawMessage> | null = this
		$.pointerValue<RawMessage>(m).data = $.goSlice($.pointerValue<RawMessage>(m).data, undefined, 0)
	}

	public GetData(): $.Slice<number> {
		const m: RawMessage | $.VarRef<RawMessage> | null = this
		return $.pointerValue<RawMessage>(m).data
	}

	public MarshalToSizedBufferVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: RawMessage | $.VarRef<RawMessage> | null = this
		if ($.len(dAtA) != $.len($.pointerValue<RawMessage>(m).data)) {
			return [0, errors.New("invalid buffer length")]
		}
		$.copy(dAtA, $.pointerValue<RawMessage>(m).data)
		return [$.len(dAtA), null]
	}

	public MarshalVT(): [$.Slice<number>, $.GoError] {
		const m: RawMessage | $.VarRef<RawMessage> | null = this
		if (!$.pointerValue<RawMessage>(m).copy) {
			return [$.pointerValue<RawMessage>(m).data, null]
		}

		let data: $.Slice<number> = $.makeSlice<number>($.len($.pointerValue<RawMessage>(m).data), undefined, "byte")
		$.copy(data, $.pointerValue<RawMessage>(m).data)
		return [data, null]
	}

	public Reset(): void {
		let m: RawMessage | $.VarRef<RawMessage> | null = this
		$.pointerValue<RawMessage>(m).data = null
	}

	public SetData(data: $.Slice<number>): void {
		let m: RawMessage | $.VarRef<RawMessage> | null = this
		if ($.pointerValue<RawMessage>(m).copy) {
			if ($.cap($.pointerValue<RawMessage>(m).data) >= $.len(data)) {
				$.pointerValue<RawMessage>(m).data = $.goSlice($.pointerValue<RawMessage>(m).data, undefined, $.len(data))
			} else {
				$.pointerValue<RawMessage>(m).data = $.makeSlice<number>($.len(data), undefined, "byte")
			}
			$.copy($.pointerValue<RawMessage>(m).data, data)
		} else {
			$.pointerValue<RawMessage>(m).data = data
		}
	}

	public SizeVT(): number {
		const m: RawMessage | $.VarRef<RawMessage> | null = this
		return $.len($.pointerValue<RawMessage>(m).data)
	}

	public UnmarshalVT(data: $.Slice<number>): $.GoError {
		const m: RawMessage | $.VarRef<RawMessage> | null = this
		RawMessage.prototype.SetData.call(m, data)
		return null
	}

	static __typeInfo = $.registerStructType(
		"srpc.RawMessage",
		() => new RawMessage(),
		[{ name: "Clear", args: [], returns: [] }, { name: "GetData", args: [], returns: [] }, { name: "MarshalToSizedBufferVT", args: [], returns: [] }, { name: "MarshalVT", args: [], returns: [] }, { name: "Reset", args: [], returns: [] }, { name: "SetData", args: [], returns: [] }, { name: "SizeVT", args: [], returns: [] }, { name: "UnmarshalVT", args: [], returns: [] }],
		RawMessage,
		{"data": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "copy": { kind: $.TypeKind.Basic, name: "bool" }}
	)
}

export function NewRawMessage(data: $.Slice<number>, copy: boolean): RawMessage | $.VarRef<RawMessage> | null {
	return new RawMessage({data: data, copy: copy})
}

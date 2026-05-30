// Generated file based on pushable_js.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as js from "@goscript/syscall/js/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import type * as __goscript_packet from "./packet.gs.ts"

import * as __goscript_rpcproto_pb from "./rpcproto.pb.gs.ts"

import type * as __goscript_writer from "./writer.gs.ts"
import "@goscript/io/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/syscall/js/index.js"
import "./rpcproto.pb.gs.ts"

export class PushablePacketWriter {
	public get closed(): atomic.Bool {
		return this._fields.closed.value
	}
	public set closed(value: atomic.Bool) {
		this._fields.closed.value = value
	}

	public get pushable(): js.Value {
		return this._fields.pushable.value
	}
	public set pushable(value: js.Value) {
		this._fields.pushable.value = value
	}

	public _fields: {
		closed: $.VarRef<atomic.Bool>
		pushable: $.VarRef<js.Value>
	}

	constructor(init?: Partial<{closed?: atomic.Bool, pushable?: js.Value}>) {
		this._fields = {
			closed: $.varRef(init?.closed ? $.markAsStructValue($.cloneStructValue(init.closed)) : $.markAsStructValue(new atomic.Bool())),
			pushable: $.varRef(init?.pushable ? $.markAsStructValue($.cloneStructValue(init.pushable)) : $.markAsStructValue(new js.Value()))
		}
	}

	public clone(): PushablePacketWriter {
		const cloned = new PushablePacketWriter()
		cloned._fields = {
			closed: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.closed.value))),
			pushable: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.pushable.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Close(): $.GoError {
		const w: PushablePacketWriter | $.VarRef<PushablePacketWriter> | null = this
		if (!$.pointerValue<PushablePacketWriter>(w).closed.Swap(true)) {
			$.markAsStructValue($.cloneStructValue($.pointerValue<PushablePacketWriter>(w).pushable)).Call("end")
		}
		return null
	}

	public WritePacket(pkt: __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null): $.GoError {
		const w: PushablePacketWriter | $.VarRef<PushablePacketWriter> | null = this
		if ($.pointerValue<PushablePacketWriter>(w).closed.Load()) {
			return io.ErrClosedPipe
		}

		let __goscriptTuple0: any = __goscript_rpcproto_pb.Packet.prototype.MarshalVT.call(pkt)
		let data: $.Slice<number> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return err
		}

		let a = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(js.Global())).Get("Uint8Array"))).New($.namedValueInterfaceValue<any>($.len(data), "int", {}, { kind: $.TypeKind.Basic, name: "int" }))))
		js.CopyBytesToJS($.markAsStructValue($.cloneStructValue(a)), data)
		$.markAsStructValue($.cloneStructValue($.pointerValue<PushablePacketWriter>(w).pushable)).Call("push", $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(a)), "js.Value"))
		return null
	}

	static __typeInfo = $.registerStructType(
		"srpc.PushablePacketWriter",
		() => new PushablePacketWriter(),
		[{ name: "Close", args: [], returns: [] }, { name: "WritePacket", args: [], returns: [] }],
		PushablePacketWriter,
		[{ name: "closed", key: "closed", type: "atomic.Bool", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "pushable", key: "pushable", type: "js.Value", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 8, exported: false }]
	)
}

export function NewPushablePacketWriter(pushable: js.Value): PushablePacketWriter | $.VarRef<PushablePacketWriter> | null {
	return new PushablePacketWriter({pushable: $.markAsStructValue($.cloneStructValue(pushable))})
}

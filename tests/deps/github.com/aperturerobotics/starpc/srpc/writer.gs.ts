// Generated file based on writer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import type * as __goscript_packet from "./packet.gs.ts"

import * as __goscript_rpcproto_pb from "./rpcproto.pb.gs.ts"
import "./rpcproto.pb.gs.ts"

export type PacketWriter = {
	Close(): $.GoError | globalThis.Promise<$.GoError>
	WritePacket(p: __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null): $.GoError | globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"srpc.PacketWriter",
	null,
	[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "WritePacket", args: [{ name: "p", type: { kind: $.TypeKind.Pointer, elemType: "srpc.Packet" } }], returns: [{ name: "_r0", type: "error" }] }]
);

export class packetWriterWithClose {
	public get PacketWriter(): PacketWriter | null {
		return this._fields.PacketWriter.value
	}
	public set PacketWriter(value: PacketWriter | null) {
		this._fields.PacketWriter.value = value
	}

	public get closeFn(): (() => $.GoError | globalThis.Promise<$.GoError>) | null {
		return this._fields.closeFn.value
	}
	public set closeFn(value: (() => $.GoError | globalThis.Promise<$.GoError>) | null) {
		this._fields.closeFn.value = value
	}

	public _fields: {
		PacketWriter: $.VarRef<PacketWriter | null>
		closeFn: $.VarRef<(() => $.GoError | globalThis.Promise<$.GoError>) | null>
	}

	constructor(init?: Partial<{PacketWriter?: PacketWriter | null, closeFn?: (() => $.GoError | globalThis.Promise<$.GoError>) | null}>) {
		this._fields = {
			PacketWriter: $.varRef(init?.PacketWriter ?? (null as unknown as PacketWriter | null)),
			closeFn: $.varRef(init?.closeFn ?? (null as unknown as (() => $.GoError | globalThis.Promise<$.GoError>) | null))
		}
	}

	public clone(): packetWriterWithClose {
		const cloned = new packetWriterWithClose()
		cloned._fields = {
			PacketWriter: $.varRef(this._fields.PacketWriter.value),
			closeFn: $.varRef(this._fields.closeFn.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const s: packetWriterWithClose | $.VarRef<packetWriterWithClose> | null = this
		let err = await $.pointerValue<Exclude<PacketWriter, null>>($.pointerValue<packetWriterWithClose>(s).PacketWriter).Close()
		let err2 = await $.pointerValue<packetWriterWithClose>(s).closeFn!()
		if (err != null) {
			return err
		}
		return err2
	}

	public async WritePacket(p: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<PacketWriter | null, null>>(this.PacketWriter).WritePacket(p)
	}

	static __typeInfo = $.registerStructType(
		"srpc.packetWriterWithClose",
		() => new packetWriterWithClose(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "WritePacket", args: [{ name: "p", type: { kind: $.TypeKind.Pointer, elemType: "srpc.Packet" } }], returns: [{ name: "_r0", type: "error" }] }],
		packetWriterWithClose,
		[{ name: "PacketWriter", key: "PacketWriter", type: "srpc.PacketWriter", anonymous: true, index: [0], offset: 0, exported: true }, { name: "closeFn", key: "closeFn", type: ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo), pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 16, exported: false }]
	)
}

export function NewPacketWriterWithClose(prw: PacketWriter | null, close: (() => $.GoError | globalThis.Promise<$.GoError>) | null): PacketWriter | null {
	return $.interfaceValue<PacketWriter | null>(new packetWriterWithClose({PacketWriter: prw, closeFn: close}), "*srpc.packetWriterWithClose")
}

// Generated file based on packet-rw.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as context from "@goscript/context/index.js"

import * as binary from "@goscript/encoding/binary/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"

import * as errors from "@goscript/github.com/pkg/errors/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as __goscript_packet from "./packet.gs.ts"

import * as __goscript_rpcproto_pb from "./rpcproto.pb.gs.ts"

import type * as __goscript_writer from "./writer.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/context/index.js"
import "@goscript/encoding/binary/index.js"
import "@goscript/io/index.js"
import "@goscript/sync/index.js"
import "@goscript/github.com/pkg/errors/index.js"
import "./packet.gs.ts"
import "./rpcproto.pb.gs.ts"

export class writeBuffer {
	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public _fields: {
		data: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{data?: $.Slice<number>}>) {
		this._fields = {
			data: $.varRef(init?.data ?? (null as $.Slice<number>))
		}
	}

	public clone(): writeBuffer {
		const cloned = new writeBuffer()
		cloned._fields = {
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"srpc.writeBuffer",
		() => new writeBuffer(),
		[],
		writeBuffer,
		[{ name: "data", key: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }]
	)
}

export class PacketReadWriter {
	// rw is the io.ReadWriterCloser
	public get rw(): io.ReadWriteCloser | null {
		return this._fields.rw.value
	}
	public set rw(value: io.ReadWriteCloser | null) {
		this._fields.rw.value = value
	}

	// buf is the buffered data
	public get buf(): bytes.Buffer {
		return this._fields.buf.value
	}
	public set buf(value: bytes.Buffer) {
		this._fields.buf.value = value
	}

	// writeMtx is the write mutex
	public get writeMtx(): sync.Mutex {
		return this._fields.writeMtx.value
	}
	public set writeMtx(value: sync.Mutex) {
		this._fields.writeMtx.value = value
	}

	public _fields: {
		rw: $.VarRef<io.ReadWriteCloser | null>
		buf: $.VarRef<bytes.Buffer>
		writeMtx: $.VarRef<sync.Mutex>
	}

	constructor(init?: Partial<{rw?: io.ReadWriteCloser | null, buf?: bytes.Buffer, writeMtx?: sync.Mutex}>) {
		this._fields = {
			rw: $.varRef(init?.rw ?? (null as io.ReadWriteCloser | null)),
			buf: $.varRef(init?.buf ? $.markAsStructValue($.cloneStructValue(init.buf)) : $.markAsStructValue(new bytes.Buffer())),
			writeMtx: $.varRef(init?.writeMtx ? $.markAsStructValue($.cloneStructValue(init.writeMtx)) : $.markAsStructValue(new sync.Mutex()))
		}
	}

	public clone(): PacketReadWriter {
		const cloned = new PacketReadWriter()
		cloned._fields = {
			rw: $.varRef(this._fields.rw.value),
			buf: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.buf.value))),
			writeMtx: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.writeMtx.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const r: PacketReadWriter | $.VarRef<PacketReadWriter> | null = this
		return await $.pointerValue<Exclude<io.ReadWriteCloser, null>>($.pointerValue<PacketReadWriter>(r).rw).Close()
	}

	public async ReadPump(cb: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null, closed: ((closeErr: $.GoError) => void) | null): globalThis.Promise<void> {
		const r: PacketReadWriter | $.VarRef<PacketReadWriter> | null = this
		let err = await PacketReadWriter.prototype.ReadToHandler.call(r, cb)
		// signal that the stream is now closed.
		if (closed != null) {
			await closed!(err)
		}
	}

	public async ReadToHandler(cb: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
		const r: PacketReadWriter | $.VarRef<PacketReadWriter> | null = this
		using __defer = new $.DisposableStack()
		let currLen: number = 0
		let bufPtr: $.VarRef<Uint8Array> | null = $.mustTypeAssert<$.VarRef<Uint8Array> | null>(await readBufferPool.value.Get(), { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 2048 } })
		__defer.defer(() => { readBufferPool.value.Put($.interfaceValue<any>(bufPtr, "*[2048]byte")) })
		let buf: $.Slice<number> = $.goSlice($.pointerValue<Uint8Array>(bufPtr), undefined, undefined)
		let isOpen = true

		__goscriptLoop0: while (isOpen) {
			// read some data into the buffer
			let [n, err] = await $.pointerValue<Exclude<io.ReadWriteCloser, null>>($.pointerValue<PacketReadWriter>(r).rw).Read(buf)
			if (err != null) {
				if (($.comparableEqual(err, io.EOF)) || ($.comparableEqual(err, context.Canceled))) {
					isOpen = false
				} else {
					return err
				}
			}

			// push the data to r.buf
			let __goscriptTuple0: any = $.pointerValue<PacketReadWriter>(r).buf.Write($.goSlice(buf, undefined, n))
			err = __goscriptTuple0[1]
			if (err != null) {
				return err
			}

			EmitIfEnough: while (true) {
				var bufLen = $.pointerValue<PacketReadWriter>(r).buf.Len()

				// check if we have enough data for a length prefix

				if (bufLen < 4) {
					continue __goscriptLoop0
				}

				// parse the length prefix if not done already
				if ($.uint(currLen, 32) == $.uint(0, 32)) {
					currLen = $.uint(PacketReadWriter.prototype.readLengthPrefix.call(r, $.goSlice($.pointerValue<PacketReadWriter>(r).buf.Bytes(), undefined, 4)), 32)
					if ($.uint(currLen, 32) == $.uint(0, 32)) {
						return errors.New("unexpected zero len prefix")
					}
					if ($.uint(currLen, 32) > $.uint($.uint(10000000, 32), 32)) {
						return errors.Errorf("message size %v greater than maximum %v", $.namedValueInterfaceValue<any>(currLen, "uint32", {}, { kind: $.TypeKind.Basic, name: "uint32" }), $.namedValueInterfaceValue<any>(10000000, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
				}

				// emit the packet if fully buffered
				if (($.uint(currLen, 32) != $.uint(0, 32)) && (bufLen >= ($.int(currLen) + 4))) {
					let pkt: $.Slice<number> = $.goSlice($.pointerValue<PacketReadWriter>(r).buf.Next($.int(currLen + 4)), 4, undefined)
					currLen = $.uint(0, 32)
					{
						let __goscriptShadow0 = await cb!(pkt)
						if (__goscriptShadow0 != null) {
							return __goscriptShadow0
						}
					}

					// check if there's still enough in the buffer
					continue EmitIfEnough
				}
				break
			}
		}

		// closed
		return null
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const r: PacketReadWriter | $.VarRef<PacketReadWriter> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		using __defer = new $.DisposableStack()
		await $.pointerValue<PacketReadWriter>(r).writeMtx.Lock()
		__defer.defer(() => { $.pointerValue<PacketReadWriter>(r).writeMtx.Unlock() })
		const __goscriptReturn1: [number, $.GoError] = await $.pointerValue<Exclude<io.ReadWriteCloser, null>>($.pointerValue<PacketReadWriter>(r).rw).Write(p)
		n = __goscriptReturn1[0]
		err = __goscriptReturn1[1]
		__defer[Symbol.dispose]()
		return [n, err]
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async WritePacket(p: __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null): globalThis.Promise<$.GoError> {
		const r: PacketReadWriter | $.VarRef<PacketReadWriter> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<PacketReadWriter>(r).writeMtx.Lock()
		__defer.defer(() => { $.pointerValue<PacketReadWriter>(r).writeMtx.Unlock() })

		let msgSize = await __goscript_rpcproto_pb.Packet.prototype.SizeVT.call(p)
		if ((msgSize < 0) || (msgSize > 10000000)) {
			return errors.Errorf("message size %v greater than maximum %v", $.namedValueInterfaceValue<any>(msgSize, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(10000000, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
		}

		let writeBuf: writeBuffer | $.VarRef<writeBuffer> | null = await getWriteBuffer(4 + msgSize)
		__defer.defer(() => { putWriteBuffer(writeBuf) })
		let data: $.Slice<number> = $.pointerValue<writeBuffer>(writeBuf).data
		$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint32(data, $.uint($.uint(msgSize, 32), 32))

		let [, err] = await __goscript_rpcproto_pb.Packet.prototype.MarshalToSizedBufferVT.call(p, $.goSlice(data, 4, undefined))
		if (err != null) {
			return err
		}

		let written: number = 0
		let n: number = 0
		while (written < $.len(data)) {
			let __goscriptTuple1: any = await $.pointerValue<Exclude<io.ReadWriteCloser, null>>($.pointerValue<PacketReadWriter>(r).rw).Write($.goSlice(data, written, undefined))
			n = __goscriptTuple1[0]
			err = __goscriptTuple1[1]
			if (err != null) {
				return err
			}
			if (n == 0) {
				return io.ErrShortWrite
			}
			written = written + (n)
		}

		return null
	}

	public readLengthPrefix(b: $.Slice<number>): number {
		const r: PacketReadWriter | $.VarRef<PacketReadWriter> | null = this
		if ($.len(b) < 4) {
			return $.uint(0, 32)
		}
		return $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint32(b), 32)
	}

	static __typeInfo = $.registerStructType(
		"srpc.PacketReadWriter",
		() => new PacketReadWriter(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "ReadPump", args: [{ name: "cb", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["error"] } as $.FunctionTypeInfo) }, { name: "closed", type: ({ kind: $.TypeKind.Function, params: ["error"], results: [] } as $.FunctionTypeInfo) }], returns: [] }, { name: "ReadToHandler", args: [{ name: "cb", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["error"] } as $.FunctionTypeInfo) }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "WritePacket", args: [{ name: "p", type: { kind: $.TypeKind.Pointer, elemType: "srpc.Packet" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "readLengthPrefix", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint32" } }] }],
		PacketReadWriter,
		[{ name: "rw", key: "rw", type: "io.ReadWriteCloser", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "buf", key: "buf", type: "bytes.Buffer", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 16, exported: false }, { name: "writeMtx", key: "writeMtx", type: "sync.Mutex", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [2], offset: 56, exported: false }]
	)
}

export const maxMessageSize: number = 10000000

export const readBufferSize: number = 2048

export const pooledWriteBufferMaxSize: number = 65536

export let readBufferPool: $.VarRef<sync.Pool> = $.varRef($.markAsStructValue(new sync.Pool({New: $.functionValue((): any => {
	return $.interfaceValue<any>($.varRef<Uint8Array>(new Uint8Array(2048)), "*[2048]byte")
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))})))

export function __goscript_set_readBufferPool(__goscriptValue: sync.Pool): void {
	readBufferPool.value = __goscriptValue
}

export let writeBufferPool: $.VarRef<sync.Pool> = $.varRef($.markAsStructValue(new sync.Pool({New: $.functionValue((): any => {
	return $.interfaceValue<any>(new writeBuffer(), "*srpc.writeBuffer")
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))})))

export function __goscript_set_writeBufferPool(__goscriptValue: sync.Pool): void {
	writeBufferPool.value = __goscriptValue
}

export function NewPacketReadWriter(rw: io.ReadWriteCloser | null): PacketReadWriter | $.VarRef<PacketReadWriter> | null {
	return new PacketReadWriter({rw: rw})
}

export async function getWriteBuffer(size: number): globalThis.Promise<writeBuffer | $.VarRef<writeBuffer> | null> {
	if (size > 65536) {
		return new writeBuffer({data: $.makeSlice<number>(size, undefined, "byte")})
	}
	let buf: writeBuffer | $.VarRef<writeBuffer> | null = $.mustTypeAssert<writeBuffer | $.VarRef<writeBuffer> | null>(await writeBufferPool.value.Get(), { kind: $.TypeKind.Pointer, elemType: "srpc.writeBuffer" })
	if ($.cap($.pointerValue<writeBuffer>(buf).data) < size) {
		$.pointerValue<writeBuffer>(buf).data = $.makeSlice<number>(size, undefined, "byte")
	}
	$.pointerValue<writeBuffer>(buf).data = $.goSlice($.pointerValue<writeBuffer>(buf).data, undefined, size)
	return buf
}

export function putWriteBuffer(buf: writeBuffer | $.VarRef<writeBuffer> | null): void {
	if ($.cap($.pointerValue<writeBuffer>(buf).data) <= 65536) {
		$.clear($.pointerValue<writeBuffer>(buf).data)
		$.pointerValue<writeBuffer>(buf).data = $.goSlice($.pointerValue<writeBuffer>(buf).data, undefined, 0)
		writeBufferPool.value.Put($.interfaceValue<any>(buf, "*srpc.writeBuffer"))
	}
}

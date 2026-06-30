// Generated file based on net_fake.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as os from "@goscript/os/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as time from "@goscript/time/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import type * as fs from "@goscript/io/fs/index.js"

import type * as netip from "@goscript/net/netip/index.js"

import * as __goscript_fd_fake from "./fd_fake.gs.ts"

import * as __goscript_fd_js from "./fd_js.gs.ts"

import * as __goscript_ip from "./ip.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"

import * as __goscript_tcpsock from "./tcpsock.gs.ts"

import * as __goscript_tcpsock_posix from "./tcpsock_posix.gs.ts"

import * as __goscript_udpsock from "./udpsock.gs.ts"

import * as __goscript_udpsock_posix from "./udpsock_posix.gs.ts"

import * as __goscript_unixsock from "./unixsock.gs.ts"

import * as __goscript_unixsock_posix from "./unixsock_posix.gs.ts"
import "@goscript/context/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/os/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/syscall/index.js"
import "@goscript/time/index.js"
import "@goscript/internal/poll/index.js"
import "./fd_fake.gs.ts"
import "./fd_js.gs.ts"
import "./ip.gs.ts"
import "./net.gs.ts"
import "./sockaddr_posix.gs.ts"
import "./tcpsock.gs.ts"
import "./tcpsock_posix.gs.ts"
import "./udpsock.gs.ts"
import "./udpsock_posix.gs.ts"
import "./unixsock.gs.ts"
import "./unixsock_posix.gs.ts"

export class fakeSockAddr {
	public get family(): number {
		return this._fields.family.value
	}
	public set family(value: number) {
		this._fields.family.value = value
	}

	public get address(): string {
		return this._fields.address.value
	}
	public set address(value: string) {
		this._fields.address.value = value
	}

	public _fields: {
		family: $.VarRef<number>
		address: $.VarRef<string>
	}

	constructor(init?: Partial<{family?: number, address?: string}>) {
		this._fields = {
			family: $.varRef(init?.family ?? (0 as number)),
			address: $.varRef(init?.address ?? ("" as string))
		}
	}

	public clone(): fakeSockAddr {
		const cloned = new fakeSockAddr()
		cloned._fields = {
			family: $.varRef(this._fields.family.value),
			address: $.varRef(this._fields.address.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"net.fakeSockAddr",
		() => new fakeSockAddr(),
		[],
		fakeSockAddr,
		[{ name: "family", key: "family", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "address", key: "address", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net", index: [1], offset: 8, exported: false }]
	)
}

export class fakeNetFD {
	public get fd(): __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null {
		return this._fields.fd.value
	}
	public set fd(value: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null) {
		this._fields.fd.value = value
	}

	public get assignedPort(): number {
		return this._fields.assignedPort.value
	}
	public set assignedPort(value: number) {
		this._fields.assignedPort.value = value
	}

	public get queue(): packetQueue | $.VarRef<packetQueue> | null {
		return this._fields.queue.value
	}
	public set queue(value: packetQueue | $.VarRef<packetQueue> | null) {
		this._fields.queue.value = value
	}

	public get peer(): __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null {
		return this._fields.peer.value
	}
	public set peer(value: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null) {
		this._fields.peer.value = value
	}

	public get readDeadline(): atomic.Pointer<deadlineTimer> {
		return this._fields.readDeadline.value
	}
	public set readDeadline(value: atomic.Pointer<deadlineTimer>) {
		this._fields.readDeadline.value = value
	}

	public get writeDeadline(): atomic.Pointer<deadlineTimer> {
		return this._fields.writeDeadline.value
	}
	public set writeDeadline(value: atomic.Pointer<deadlineTimer>) {
		this._fields.writeDeadline.value = value
	}

	public get fakeAddr(): fakeSockAddr {
		return this._fields.fakeAddr.value
	}
	public set fakeAddr(value: fakeSockAddr) {
		this._fields.fakeAddr.value = value
	}

	// The incoming channels hold incoming connections that have not yet been accepted.
	// All of these channels are 1-buffered.
	public get incoming(): $.Channel<$.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>> | null {
		return this._fields.incoming.value
	}
	public set incoming(value: $.Channel<$.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>> | null) {
		this._fields.incoming.value = value
	}

	public get incomingFull(): $.Channel<$.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>> | null {
		return this._fields.incomingFull.value
	}
	public set incomingFull(value: $.Channel<$.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>> | null) {
		this._fields.incomingFull.value = value
	}

	public get incomingEmpty(): $.Channel<boolean> | null {
		return this._fields.incomingEmpty.value
	}
	public set incomingEmpty(value: $.Channel<boolean> | null) {
		this._fields.incomingEmpty.value = value
	}

	public _fields: {
		fd: $.VarRef<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>
		assignedPort: $.VarRef<number>
		queue: $.VarRef<packetQueue | $.VarRef<packetQueue> | null>
		peer: $.VarRef<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>
		readDeadline: $.VarRef<atomic.Pointer<deadlineTimer>>
		writeDeadline: $.VarRef<atomic.Pointer<deadlineTimer>>
		fakeAddr: $.VarRef<fakeSockAddr>
		incoming: $.VarRef<$.Channel<$.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>> | null>
		incomingFull: $.VarRef<$.Channel<$.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>> | null>
		incomingEmpty: $.VarRef<$.Channel<boolean> | null>
	}

	constructor(init?: Partial<{fd?: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, assignedPort?: number, queue?: packetQueue | $.VarRef<packetQueue> | null, peer?: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, readDeadline?: atomic.Pointer<deadlineTimer>, writeDeadline?: atomic.Pointer<deadlineTimer>, fakeAddr?: fakeSockAddr, incoming?: $.Channel<$.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>> | null, incomingFull?: $.Channel<$.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>> | null, incomingEmpty?: $.Channel<boolean> | null}>) {
		this._fields = {
			fd: $.varRef(init?.fd ?? (null as __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null)),
			assignedPort: $.varRef(init?.assignedPort ?? (0 as number)),
			queue: $.varRef(init?.queue ?? (null as packetQueue | $.VarRef<packetQueue> | null)),
			peer: $.varRef(init?.peer ?? (null as __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null)),
			readDeadline: $.varRef(init?.readDeadline ? $.markAsStructValue($.cloneStructValue(init.readDeadline)) : $.markAsStructValue(new atomic.Pointer<deadlineTimer>())),
			writeDeadline: $.varRef(init?.writeDeadline ? $.markAsStructValue($.cloneStructValue(init.writeDeadline)) : $.markAsStructValue(new atomic.Pointer<deadlineTimer>())),
			fakeAddr: $.varRef(init?.fakeAddr ? $.markAsStructValue($.cloneStructValue(init.fakeAddr)) : $.markAsStructValue(new fakeSockAddr())),
			incoming: $.varRef(init?.incoming ?? (null as $.Channel<$.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>> | null)),
			incomingFull: $.varRef(init?.incomingFull ?? (null as $.Channel<$.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>> | null)),
			incomingEmpty: $.varRef(init?.incomingEmpty ?? (null as $.Channel<boolean> | null))
		}
	}

	public clone(): fakeNetFD {
		const cloned = new fakeNetFD()
		cloned._fields = {
			fd: $.varRef(this._fields.fd.value),
			assignedPort: $.varRef(this._fields.assignedPort.value),
			queue: $.varRef(this._fields.queue.value),
			peer: $.varRef(this._fields.peer.value),
			readDeadline: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.readDeadline.value))),
			writeDeadline: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.writeDeadline.value))),
			fakeAddr: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.fakeAddr.value))),
			incoming: $.varRef(this._fields.incoming.value),
			incomingFull: $.varRef(this._fields.incomingFull.value),
			incomingEmpty: $.varRef(this._fields.incomingEmpty.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let err: $.GoError = null as $.GoError
		if (!$.comparableEqual($.pointerValue<fakeNetFD>(ffd).fakeAddr, ($.markAsStructValue(new fakeSockAddr())))) {
			await sockets.value.CompareAndDelete($.interfaceValue<any>($.markAsStructValue($.cloneStructValue($.pointerValue<fakeNetFD>(ffd).fakeAddr)), "net.fakeSockAddr"), $.interfaceValue<any>($.pointerValue<fakeNetFD>(ffd).fd, "*net.netFD"))
		}

		if ($.pointerValue<fakeNetFD>(ffd).queue != null) {
			{
				let closeErr = await packetQueue.prototype.closeRead.call($.pointerValue<fakeNetFD>(ffd).queue)
				if (err == null) {
					err = closeErr
				}
			}
		}
		if ($.pointerValue<fakeNetFD>(ffd).peer != null) {
			{
				let closeErr = await packetQueue.prototype.closeWrite.call($.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).peer).fakeNetFD).queue)
				if (err == null) {
					err = closeErr
				}
			}
		}
		await deadlineTimer.prototype.Reset.call($.pointerValue<fakeNetFD>(ffd).readDeadline.Load(), $.markAsStructValue($.cloneStructValue(__goscript_net.noDeadline)))
		await deadlineTimer.prototype.Reset.call($.pointerValue<fakeNetFD>(ffd).writeDeadline.Load(), $.markAsStructValue($.cloneStructValue(__goscript_net.noDeadline)))

		if ($.pointerValue<fakeNetFD>(ffd).incoming != null) {
			let incoming: $.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null> = null as $.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>
			let ok: boolean = false
			const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, $.GoError>([
				{
					id: 0,
					isSend: false,
					channel: $.pointerValue<fakeNetFD>(ffd).incomingEmpty,
					onSelected: async (__goscriptSelect0Result) => {
						ok = __goscriptSelect0Result.ok
					}
				},
				{
					id: 1,
					isSend: false,
					channel: $.pointerValue<fakeNetFD>(ffd).incoming,
					onSelected: async (__goscriptSelect0Result) => {
						incoming = __goscriptSelect0Result.value
						ok = __goscriptSelect0Result.ok
					}
				},
				{
					id: 2,
					isSend: false,
					channel: $.pointerValue<fakeNetFD>(ffd).incomingFull,
					onSelected: async (__goscriptSelect0Result) => {
						incoming = __goscriptSelect0Result.value
						ok = __goscriptSelect0Result.ok
					}
				}
			], false)
			if (__goscriptSelect0HasReturn) {
				return __goscriptSelect0Value
			}
			if (ok) {
				// Sends on ffd.incoming require a receive first.
				// Since we successfully received, no other goroutine may
				// send on it at this point, and we may safely close it.
				$.pointerValue<fakeNetFD>(ffd).incoming!.close()

				for (let __goscriptRangeTarget0 = incoming, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
					let c = __goscriptRangeTarget0![__rangeIndex]
					await __goscript_fd_fake.netFD.prototype.Close.call(c)
				}
			}
		}

		if ($.pointerValue<fakeNetFD>(ffd).assignedPort != 0) {
			await fakePorts.value.CompareAndDelete($.namedValueInterfaceValue<any>($.pointerValue<fakeNetFD>(ffd).assignedPort, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.interfaceValue<any>($.pointerValue<fakeNetFD>(ffd).fd, "*net.netFD"))
		}

		return err
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		let __goscriptTuple3: any = await packetQueue.prototype.recvfrom.call($.pointerValue<fakeNetFD>(ffd).queue, $.pointerValue<fakeNetFD>(ffd).readDeadline.Load(), p, false, (null as ((_p0: __goscript_sockaddr_posix.sockaddr | null) => $.GoError | globalThis.Promise<$.GoError>) | null))
		n = __goscriptTuple3[0]
		err = __goscriptTuple3[2]
		return [n, err]
	}

	public async SetDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let err1 = await fakeNetFD.prototype.SetReadDeadline.call(ffd, $.markAsStructValue($.cloneStructValue(t)))
		let err2 = await fakeNetFD.prototype.SetWriteDeadline.call(ffd, $.markAsStructValue($.cloneStructValue(t)))
		if (err1 != null) {
			return err1
		}
		return err2
	}

	public async SetReadDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let dt: deadlineTimer | $.VarRef<deadlineTimer> | null = ($.pointerValue<fakeNetFD>(ffd).readDeadline.Load() as deadlineTimer | $.VarRef<deadlineTimer> | null)
		if (!await deadlineTimer.prototype.Reset.call(dt, $.markAsStructValue($.cloneStructValue(t)))) {
			$.pointerValue<fakeNetFD>(ffd).readDeadline.Store(await newDeadlineTimer($.markAsStructValue($.cloneStructValue(t))))
		}
		return null
	}

	public async SetWriteDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let dt: deadlineTimer | $.VarRef<deadlineTimer> | null = ($.pointerValue<fakeNetFD>(ffd).writeDeadline.Load() as deadlineTimer | $.VarRef<deadlineTimer> | null)
		if (!await deadlineTimer.prototype.Reset.call(dt, $.markAsStructValue($.cloneStructValue(t)))) {
			$.pointerValue<fakeNetFD>(ffd).writeDeadline.Store(await newDeadlineTimer($.markAsStructValue($.cloneStructValue(t))))
		}
		return null
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let nn: number = 0
		let err: $.GoError = null as $.GoError
		let peer: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = $.pointerValue<fakeNetFD>(ffd).peer
		if (peer == null) {
			if ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).raddr == null) {
				return [0, os.NewSyscallError("write", $.namedValueInterfaceValue<$.GoError>(syscall.ENOTCONN, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
			}
			let [peeri, ] = await sockets.value.Load($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(await fakeAddr($.mustTypeAssert<__goscript_sockaddr_posix.sockaddr | null>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).raddr, "net.sockaddr")))), "net.fakeSockAddr"))
			if (peeri == null) {
				return [0, os.NewSyscallError("write", $.namedValueInterfaceValue<$.GoError>(syscall.ECONNRESET, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
			}
			peer = $.mustTypeAssert<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>(peeri, { kind: $.TypeKind.Pointer, elemType: "net.netFD" })
			if ($.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(peer).fakeNetFD).queue == null) {
				return [0, os.NewSyscallError("write", $.namedValueInterfaceValue<$.GoError>(syscall.ECONNRESET, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
			}
		}

		if ($.pointerValue<__goscript_fd_fake.netFD>(peer).fakeNetFD == null) {
			return [0, os.NewSyscallError("write", $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
		}
		return await packetQueue.prototype.write.call($.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(peer).fakeNetFD).queue, $.pointerValue<fakeNetFD>(ffd).writeDeadline.Load(), p, $.mustTypeAssert<__goscript_sockaddr_posix.sockaddr | null>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).laddr, "net.sockaddr"))
	}

	public async accept(laddr: __goscript_net.Addr | null): globalThis.Promise<[__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		if ($.pointerValue<fakeNetFD>(ffd).incoming == null) {
			return [null, os.NewSyscallError("accept", $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
		}

		let incoming: $.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null> = null as $.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>
		let ok: boolean = false
		let expired: $.Channel<{}> | null = $.pointerValue<deadlineTimer>($.pointerValue<fakeNetFD>(ffd).readDeadline.Load()).expired
		const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, [__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, $.GoError]>([
			{
				id: 0,
				isSend: false,
				channel: expired,
				onSelected: async (__goscriptSelect1Result) => {
					return [null, os.ErrDeadlineExceeded]
				}
			},
			{
				id: 1,
				isSend: false,
				channel: $.pointerValue<fakeNetFD>(ffd).incoming,
				onSelected: async (__goscriptSelect1Result) => {
					incoming = __goscriptSelect1Result.value
					ok = __goscriptSelect1Result.ok
					if (!ok) {
						return [null, __goscript_net.ErrClosed]
					}
					const [__goscriptSelect2HasReturn, __goscriptSelect2Value] = await $.selectStatement<any, [__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, $.GoError]>([
						{
							id: 0,
							isSend: false,
							channel: expired,
							onSelected: async (__goscriptSelect2Result) => {
								await $.chanSend($.pointerValue<fakeNetFD>(ffd).incoming, incoming)
								return [null, os.ErrDeadlineExceeded]
							}
						},
						{
							id: -1,
							isSend: false,
							channel: null,
							onSelected: async (__goscriptSelect2Result) => {
							}
						}
					], true)
					if (__goscriptSelect2HasReturn) {
						return __goscriptSelect2Value
					}
				}
			},
			{
				id: 2,
				isSend: false,
				channel: $.pointerValue<fakeNetFD>(ffd).incomingFull,
				onSelected: async (__goscriptSelect1Result) => {
					incoming = __goscriptSelect1Result.value
					ok = __goscriptSelect1Result.ok
					const [__goscriptSelect3HasReturn, __goscriptSelect3Value] = await $.selectStatement<any, [__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, $.GoError]>([
						{
							id: 0,
							isSend: false,
							channel: expired,
							onSelected: async (__goscriptSelect3Result) => {
								await $.chanSend($.pointerValue<fakeNetFD>(ffd).incomingFull, incoming)
								return [null, os.ErrDeadlineExceeded]
							}
						},
						{
							id: -1,
							isSend: false,
							channel: null,
							onSelected: async (__goscriptSelect3Result) => {
							}
						}
					], true)
					if (__goscriptSelect3HasReturn) {
						return __goscriptSelect3Value
					}
				}
			}
		], false)
		if (__goscriptSelect1HasReturn) {
			return __goscriptSelect1Value
		}

		let peer: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = $.arrayIndex(incoming!, 0)
		incoming = $.goSlice(incoming, 1, undefined)
		if ($.len(incoming) == 0) {
			await $.chanSend($.pointerValue<fakeNetFD>(ffd).incomingEmpty, true)
		} else {
			await $.chanSend($.pointerValue<fakeNetFD>(ffd).incoming, incoming)
		}
		return [peer, null]
	}

	public async assignFakeAddr(addr: __goscript_sockaddr_posix.sockaddr | null): globalThis.Promise<$.GoError> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let validate: ((sa: __goscript_sockaddr_posix.sockaddr | null) => $.GoError | globalThis.Promise<$.GoError>) | null = $.functionValue(async (sa: __goscript_sockaddr_posix.sockaddr | null): globalThis.Promise<$.GoError> => {
			{
				let err = await validateResolvedAddr($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).net, $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).family, sa)
				if (err != null) {
					return err
				}
			}
			$.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).laddr = (sa as __goscript_net.Addr | null)
			return null
		}, ({ kind: $.TypeKind.Function, params: ["net.sockaddr"], results: ["error"] } as $.FunctionTypeInfo))

		let assignIP: ((addr: __goscript_sockaddr_posix.sockaddr | null) => $.GoError | globalThis.Promise<$.GoError>) | null = $.functionValue(async (addr: __goscript_sockaddr_posix.sockaddr | null): globalThis.Promise<$.GoError> => {
			let ip: __goscript_ip.IP = null as __goscript_ip.IP
			let port: number = 0
			let zone: string = ""
			{
				const __goscriptTypeSwitchValue = addr
				switch (true) {
					case $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).ok:
						{
							let addr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null = $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).value
							if (addr != null) {
								ip = ($.pointerValue<__goscript_tcpsock.TCPAddr>(addr).IP as __goscript_ip.IP)
								port = $.pointerValue<__goscript_tcpsock.TCPAddr>(addr).Port
								zone = $.pointerValue<__goscript_tcpsock.TCPAddr>(addr).Zone
							}
						}
						break
					case $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).ok:
						{
							let addr: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null = $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).value
							if (addr != null) {
								ip = ($.pointerValue<__goscript_udpsock.UDPAddr>(addr).IP as __goscript_ip.IP)
								port = $.pointerValue<__goscript_udpsock.UDPAddr>(addr).Port
								zone = $.pointerValue<__goscript_udpsock.UDPAddr>(addr).Zone
							}
						}
						break
					default:
						{
							let addr: any = __goscriptTypeSwitchValue
							return await validate!(addr)
						}
						break
				}
			}

			if (ip == null) {
				ip = (__goscript_ip.IPv4($.uint(127, 8), $.uint(0, 8), $.uint(0, 8), $.uint(1, 8)) as __goscript_ip.IP)
			}
			switch ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).family) {
				case syscall.AF_INET:
				{
					{
						let ip4: __goscript_ip.IP = (__goscript_ip.IP_To4(ip) as __goscript_ip.IP)
						if (ip4 != null) {
							ip = (ip4 as __goscript_ip.IP)
						}
					}
					break
				}
				case syscall.AF_INET6:
				{
					{
						let ip16: __goscript_ip.IP = (__goscript_ip.IP_To16(ip) as __goscript_ip.IP)
						if (ip16 != null) {
							ip = (ip16 as __goscript_ip.IP)
						}
					}
					break
				}
			}
			if (ip == null) {
				return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
			}

			if (port == 0) {
				let prevPort: number = 0
				let portWrapped = false
				let nextPort: (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null = $.functionValue((): [number, boolean] => {
					while (true) {
						let __goscriptShadow6 = $.int(nextPortCounter.value.Add($.int(1, 32)), 32)
						if (($.int(__goscriptShadow6, 32) <= $.int(0, 32)) || ($.int(__goscriptShadow6, 32) >= $.int((65536), 32))) {
							// nextPortCounter ran off the end of the port space.
							// Bump it back into range.
							while (true) {
								if (nextPortCounter.value.CompareAndSwap($.int(__goscriptShadow6, 32), $.int(0, 32))) {
									break
								}
								{
									__goscriptShadow6 = $.int(nextPortCounter.value.Load(), 32)
									if (($.int(__goscriptShadow6, 32) >= $.int(0, 32)) && ($.int(__goscriptShadow6, 32) < $.int((65536), 32))) {
										break
									}
								}
							}
							if (portWrapped) {
								// This is the second wraparound, so we've scanned the whole port space
								// at least once already and it's time to give up.
								return [0, false]
							}
							portWrapped = true
							prevPort = $.int(0, 32)
							continue
						}

						if ($.int(__goscriptShadow6, 32) <= $.int(prevPort, 32)) {
							// nextPortCounter has wrapped around since the last time we read it.
							if (portWrapped) {
								// This is the second wraparound, so we've scanned the whole port space
								// at least once already and it's time to give up.
								return [0, false]
							} else {
								portWrapped = true
							}
						}

						prevPort = $.int(__goscriptShadow6, 32)
						return [$.int(__goscriptShadow6), true]
					}
				}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))

				while (true) {
					let ok: boolean = false
					let __goscriptTuple4: any = await nextPort!()
					port = __goscriptTuple4[0]
					ok = __goscriptTuple4[1]
					if (!ok) {
						$.pointerValue<fakeNetFD>(ffd).assignedPort = 0
						return $.namedValueInterfaceValue<$.GoError>(syscall.EADDRINUSE, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
					}

					$.pointerValue<fakeNetFD>(ffd).assignedPort = $.int(port)
					{
						let [, dup] = await fakePorts.value.LoadOrStore($.namedValueInterfaceValue<any>($.pointerValue<fakeNetFD>(ffd).assignedPort, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.interfaceValue<any>($.pointerValue<fakeNetFD>(ffd).fd, "*net.netFD"))
						if (!dup) {
							break
						}
					}
				}
			}

			{
				const __goscriptTypeSwitchValue = addr
				switch (true) {
					case $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).ok:
						{
							return await validate!($.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(new __goscript_tcpsock.TCPAddr({IP: (ip as __goscript_ip.IP), Port: port, Zone: zone}), "*net.TCPAddr"))
						}
						break
					case $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).ok:
						{
							return await validate!($.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(new __goscript_udpsock.UDPAddr({IP: (ip as __goscript_ip.IP), Port: port, Zone: zone}), "*net.UDPAddr"))
						}
						break
					default:
						{
							$.panic("unreachable")
						}
						break
				}
			}
		}, ({ kind: $.TypeKind.Function, params: ["net.sockaddr"], results: ["error"] } as $.FunctionTypeInfo))

		switch ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).net) {
			case "tcp":
			case "tcp4":
			case "tcp6":
			{
				if (addr == null) {
					return await assignIP!($.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(new __goscript_tcpsock.TCPAddr(), "*net.TCPAddr"))
				}
				return await assignIP!(addr)
				break
			}
			case "udp":
			case "udp4":
			case "udp6":
			{
				if (addr == null) {
					return await assignIP!($.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(new __goscript_udpsock.UDPAddr(), "*net.UDPAddr"))
				}
				return await assignIP!(addr)
				break
			}
			case "unix":
			case "unixgram":
			case "unixpacket":
			{
				let __goscriptTuple5: any = $.typeAssertTuple<__goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null>(addr, { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" })
				let uaddr: __goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null = __goscriptTuple5[0]
				let ok = __goscriptTuple5[1]
				if (!ok && (addr != null)) {
					return $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField12 = await $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(addr).String(); return new __goscript_net.AddrError({Err: ("non-Unix address for " + $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).net) + " network", Addr: __goscriptLiteralField12}) })()), "*net.AddrError")
				}
				if (uaddr == null) {
					return await validate!($.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(new __goscript_unixsock.UnixAddr({Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).net}), "*net.UnixAddr"))
				}
				return await validate!($.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(new __goscript_unixsock.UnixAddr({Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).net, Name: $.pointerValue<__goscript_unixsock.UnixAddr>(uaddr).Name}), "*net.UnixAddr"))
				break
			}
			default:
			{
				return $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField13 = syscall.Errno_Error(syscall.EAFNOSUPPORT); const __goscriptLiteralField14 = await $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(addr).String(); return new __goscript_net.AddrError({Err: __goscriptLiteralField13, Addr: __goscriptLiteralField14}) })()), "*net.AddrError")
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async closeRead(): globalThis.Promise<$.GoError> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		return await packetQueue.prototype.closeRead.call($.pointerValue<fakeNetFD>(ffd).queue)
	}

	public async closeWrite(): globalThis.Promise<$.GoError> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		if ($.pointerValue<fakeNetFD>(ffd).peer == null) {
			return os.NewSyscallError("closeWrite", $.namedValueInterfaceValue<$.GoError>(syscall.ENOTCONN, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
		}
		return await packetQueue.prototype.closeWrite.call($.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).peer).fakeNetFD).queue)
	}

	public dup(): [os.File | $.VarRef<os.File> | null, $.GoError] {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let f: os.File | $.VarRef<os.File> | null = null as os.File | $.VarRef<os.File> | null
		let err: $.GoError = null as $.GoError
		return [null, os.NewSyscallError("dup", $.namedValueInterfaceValue<$.GoError>(syscall.ENOSYS, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
	}

	public async readFrom(p: $.Slice<number>): globalThis.Promise<[number, syscall.Sockaddr | null, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let n: number = 0
		let sa: syscall.Sockaddr | null = null as syscall.Sockaddr | null
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<fakeNetFD>(ffd).queue == null) {
			return [0, null, os.NewSyscallError("readFrom", $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
		}

		let __goscriptTuple6: any = await packetQueue.prototype.recvfrom.call($.pointerValue<fakeNetFD>(ffd).queue, $.pointerValue<fakeNetFD>(ffd).readDeadline.Load(), p, true, (null as ((_p0: __goscript_sockaddr_posix.sockaddr | null) => $.GoError | globalThis.Promise<$.GoError>) | null))
		n = __goscriptTuple6[0]
		let _from = __goscriptTuple6[1]
		err = __goscriptTuple6[2]

		if (_from != null) {
			// Convert the net.sockaddr to a syscall.Sockaddr type.
			let saErr: $.GoError = null as $.GoError
			let __goscriptTuple7: any = await $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(_from).sockaddr($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).family)
			sa = __goscriptTuple7[0]
			saErr = __goscriptTuple7[1]
			if (err == null) {
				err = saErr
			}
		}

		return [n, sa, err]
	}

	public async readFromInet4(p: $.Slice<number>, sa: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null): globalThis.Promise<[number, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		let __goscriptTuple8: any = await packetQueue.prototype.recvfrom.call($.pointerValue<fakeNetFD>(ffd).queue, $.pointerValue<fakeNetFD>(ffd).readDeadline.Load(), p, true, $.functionValue(async (_from: __goscript_sockaddr_posix.sockaddr | null): globalThis.Promise<$.GoError> => {
			let [fromSA, __goscriptShadow7] = await $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(_from).sockaddr(syscall.AF_INET)
			if (__goscriptShadow7 != null) {
				return __goscriptShadow7
			}
			if (fromSA == null) {
				return os.NewSyscallError("readFromInet4", $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
			}
			$.assignStruct($.pointerValue<syscall.SockaddrInet4>(sa), $.markAsStructValue($.cloneStructValue($.pointerValue<syscall.SockaddrInet4>(($.mustTypeAssert<syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null>(fromSA, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" }))))))
			return null
		}, ({ kind: $.TypeKind.Function, params: ["net.sockaddr"], results: ["error"] } as $.FunctionTypeInfo)))
		n = __goscriptTuple8[0]
		err = __goscriptTuple8[2]
		return [n, err]
	}

	public async readFromInet6(p: $.Slice<number>, sa: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null): globalThis.Promise<[number, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		let __goscriptTuple9: any = await packetQueue.prototype.recvfrom.call($.pointerValue<fakeNetFD>(ffd).queue, $.pointerValue<fakeNetFD>(ffd).readDeadline.Load(), p, true, $.functionValue(async (_from: __goscript_sockaddr_posix.sockaddr | null): globalThis.Promise<$.GoError> => {
			let [fromSA, __goscriptShadow8] = await $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(_from).sockaddr(syscall.AF_INET6)
			if (__goscriptShadow8 != null) {
				return __goscriptShadow8
			}
			if (fromSA == null) {
				return os.NewSyscallError("readFromInet6", $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
			}
			$.assignStruct($.pointerValue<syscall.SockaddrInet6>(sa), $.markAsStructValue($.cloneStructValue($.pointerValue<syscall.SockaddrInet6>(($.mustTypeAssert<syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null>(fromSA, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" }))))))
			return null
		}, ({ kind: $.TypeKind.Function, params: ["net.sockaddr"], results: ["error"] } as $.FunctionTypeInfo)))
		n = __goscriptTuple9[0]
		err = __goscriptTuple9[2]
		return [n, err]
	}

	public async readMsg(p: $.Slice<number>, oob: $.Slice<number>, flags: number): globalThis.Promise<[number, number, number, syscall.Sockaddr | null, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let n: number = 0
		let oobn: number = 0
		let retflags: number = 0
		let sa: syscall.Sockaddr | null = null as syscall.Sockaddr | null
		let err: $.GoError = null as $.GoError
		if (flags != 0) {
			return [0, 0, 0, null, os.NewSyscallError("readMsg", $.namedValueInterfaceValue<$.GoError>(syscall.ENOTSUP, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
		}
		let __goscriptTuple10: any = await fakeNetFD.prototype.readFrom.call(ffd, p)
		n = __goscriptTuple10[0]
		sa = __goscriptTuple10[1]
		err = __goscriptTuple10[2]
		return [n, 0, 0, sa, err]
	}

	public async readMsgInet4(p: $.Slice<number>, oob: $.Slice<number>, flags: number, sa: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null): globalThis.Promise<[number, number, number, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let n: number = 0
		let oobn: number = 0
		let retflags: number = 0
		let err: $.GoError = null as $.GoError
		if (flags != 0) {
			return [0, 0, 0, os.NewSyscallError("readMsgInet4", $.namedValueInterfaceValue<$.GoError>(syscall.ENOTSUP, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
		}
		let __goscriptTuple11: any = await fakeNetFD.prototype.readFromInet4.call(ffd, p, sa)
		n = __goscriptTuple11[0]
		err = __goscriptTuple11[1]
		return [n, 0, 0, err]
	}

	public async readMsgInet6(p: $.Slice<number>, oob: $.Slice<number>, flags: number, sa: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null): globalThis.Promise<[number, number, number, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let n: number = 0
		let oobn: number = 0
		let retflags: number = 0
		let err: $.GoError = null as $.GoError
		if (flags != 0) {
			return [0, 0, 0, os.NewSyscallError("readMsgInet6", $.namedValueInterfaceValue<$.GoError>(syscall.ENOTSUP, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
		}
		let __goscriptTuple12: any = await fakeNetFD.prototype.readFromInet6.call(ffd, p, sa)
		n = __goscriptTuple12[0]
		err = __goscriptTuple12[1]
		return [n, 0, 0, err]
	}

	public async setLinger(sec: number): globalThis.Promise<$.GoError> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		if ((sec < 0) || ($.pointerValue<fakeNetFD>(ffd).peer == null)) {
			return os.NewSyscallError("setLinger", $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
		}
		await packetQueue.prototype.setLinger.call($.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).peer).fakeNetFD).queue, sec > 0)
		return null
	}

	public async setReadBuffer(bytes: number): globalThis.Promise<$.GoError> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		if ($.pointerValue<fakeNetFD>(ffd).queue == null) {
			return os.NewSyscallError("setReadBuffer", $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
		}
		await packetQueue.prototype.setReadBuffer.call($.pointerValue<fakeNetFD>(ffd).queue, bytes)
		return null
	}

	public setWriteBuffer(bytes: number): $.GoError {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		return os.NewSyscallError("setWriteBuffer", $.namedValueInterfaceValue<$.GoError>(syscall.ENOTSUP, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
	}

	public async writeMsg(p: $.Slice<number>, oob: $.Slice<number>, sa: syscall.Sockaddr | null): globalThis.Promise<[number, number, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let n: number = 0
		let oobn: number = 0
		let err: $.GoError = null as $.GoError
		if ($.len(oob) > 0) {
			return [0, 0, os.NewSyscallError("writeMsg", $.namedValueInterfaceValue<$.GoError>(syscall.ENOTSUP, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
		}
		let __goscriptTuple13: any = await fakeNetFD.prototype.writeTo.call(ffd, p, sa)
		n = __goscriptTuple13[0]
		err = __goscriptTuple13[1]
		return [n, 0, err]
	}

	public async writeMsgInet4(p: $.Slice<number>, oob: $.Slice<number>, sa4: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null): globalThis.Promise<[number, number, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let n: number = 0
		let oobn: number = 0
		let err: $.GoError = null as $.GoError
		let sa: syscall.Sockaddr | null = null as syscall.Sockaddr | null
		if (sa4 != null) {
			sa = $.interfaceValue<syscall.Sockaddr | null>(sa4, "*syscall.SockaddrInet4")
		}
		return await fakeNetFD.prototype.writeMsg.call(ffd, p, oob, sa)
	}

	public async writeMsgInet6(p: $.Slice<number>, oob: $.Slice<number>, sa6: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null): globalThis.Promise<[number, number, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let n: number = 0
		let oobn: number = 0
		let err: $.GoError = null as $.GoError
		let sa: syscall.Sockaddr | null = null as syscall.Sockaddr | null
		if (sa6 != null) {
			sa = $.interfaceValue<syscall.Sockaddr | null>(sa6, "*syscall.SockaddrInet6")
		}
		return await fakeNetFD.prototype.writeMsg.call(ffd, p, oob, sa)
	}

	public async writeTo(p: $.Slice<number>, sa: syscall.Sockaddr | null): globalThis.Promise<[number, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		let raddr = $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).raddr
		if (sa != null) {
			if ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).isConnected) {
				return [0, os.NewSyscallError("writeTo", $.namedValueInterfaceValue<$.GoError>(syscall.EISCONN, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
			}
			raddr = await __goscript_fd_fake.netFD.prototype.addrFunc.call($.pointerValue<fakeNetFD>(ffd).fd)!(sa)
		}
		if (raddr == null) {
			return [0, os.NewSyscallError("writeTo", $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
		}

		let [peeri, ] = await sockets.value.Load($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(await fakeAddr($.mustTypeAssert<__goscript_sockaddr_posix.sockaddr | null>(raddr, "net.sockaddr")))), "net.fakeSockAddr"))
		if (peeri == null) {
			if (($.len($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).net) >= 3) && ($.stringEqual($.sliceStringOrBytes($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).net, undefined, 3), "udp"))) {
				return [$.len(p), null]
			}
			return [0, os.NewSyscallError("writeTo", $.namedValueInterfaceValue<$.GoError>(syscall.ECONNRESET, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
		}
		let peer: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = $.mustTypeAssert<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>(peeri, { kind: $.TypeKind.Pointer, elemType: "net.netFD" })
		if ($.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(peer).fakeNetFD).queue == null) {
			if (($.len($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).net) >= 3) && ($.stringEqual($.sliceStringOrBytes($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).net, undefined, 3), "udp"))) {
				return [$.len(p), null]
			}
			return [0, os.NewSyscallError("writeTo", $.namedValueInterfaceValue<$.GoError>(syscall.ECONNRESET, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
		}

		let block = true
		if (($.len($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).net) >= 3) && ($.stringEqual($.sliceStringOrBytes($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).net, undefined, 3), "udp"))) {
			block = false
		}
		return await packetQueue.prototype.send.call($.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(peer).fakeNetFD).queue, $.pointerValue<fakeNetFD>(ffd).writeDeadline.Load(), p, $.mustTypeAssert<__goscript_sockaddr_posix.sockaddr | null>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<fakeNetFD>(ffd).fd).laddr, "net.sockaddr"), block)
	}

	public async writeToInet4(p: $.Slice<number>, sa: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null): globalThis.Promise<[number, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		return await fakeNetFD.prototype.writeTo.call(ffd, p, $.interfaceValue<syscall.Sockaddr | null>(sa, "*syscall.SockaddrInet4"))
	}

	public async writeToInet6(p: $.Slice<number>, sa: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null): globalThis.Promise<[number, $.GoError]> {
		const ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		return await fakeNetFD.prototype.writeTo.call(ffd, p, $.interfaceValue<syscall.Sockaddr | null>(sa, "*syscall.SockaddrInet6"))
	}

	static __typeInfo = $.registerStructType(
		"net.fakeNetFD",
		() => new fakeNetFD(),
		[{ name: "Close", args: [], returns: [{ name: "err", type: "error" }] }, { name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "nn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "accept", args: [{ name: "laddr", type: "net.Addr" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.netFD" } }, { name: "_r1", type: "error" }] }, { name: "assignFakeAddr", args: [{ name: "addr", type: "net.sockaddr" }], returns: [{ name: "_r0", type: "error" }] }, { name: "closeRead", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "closeWrite", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "dup", args: [], returns: [{ name: "f", type: { kind: $.TypeKind.Pointer, elemType: "os.File" } }, { name: "err", type: "error" }] }, { name: "readFrom", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "sa", type: "syscall.Sockaddr" }, { name: "err", type: "error" }] }, { name: "readFromInet4", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "readFromInet6", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "readMsg", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "flags", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "retflags", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "sa", type: "syscall.Sockaddr" }, { name: "err", type: "error" }] }, { name: "readMsgInet4", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "flags", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "sa", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "retflags", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "readMsgInet6", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "flags", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "sa", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "retflags", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "setLinger", args: [{ name: "sec", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "setReadBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "setWriteBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "writeMsg", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa", type: "syscall.Sockaddr" }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "writeMsgInet4", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa4", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "writeMsgInet6", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa6", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "writeTo", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa", type: "syscall.Sockaddr" }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "writeToInet4", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "writeToInet6", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		fakeNetFD,
		[{ name: "fd", key: "fd", type: { kind: $.TypeKind.Pointer, elemType: "net.netFD" }, pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "assignedPort", key: "assignedPort", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "net", index: [1], offset: 8, exported: false }, { name: "queue", key: "queue", type: { kind: $.TypeKind.Pointer, elemType: "net.packetQueue" }, pkgPath: "net", index: [2], offset: 16, exported: false }, { name: "peer", key: "peer", type: { kind: $.TypeKind.Pointer, elemType: "net.netFD" }, pkgPath: "net", index: [3], offset: 24, exported: false }, { name: "readDeadline", key: "readDeadline", type: "atomic.Pointer", pkgPath: "net", index: [4], offset: 32, exported: false }, { name: "writeDeadline", key: "writeDeadline", type: "atomic.Pointer", pkgPath: "net", index: [5], offset: 40, exported: false }, { name: "fakeAddr", key: "fakeAddr", type: "net.fakeSockAddr", pkgPath: "net", index: [6], offset: 48, exported: false }, { name: "incoming", key: "incoming", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.netFD" } } }, pkgPath: "net", index: [7], offset: 72, exported: false }, { name: "incomingFull", key: "incomingFull", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.netFD" } } }, pkgPath: "net", index: [8], offset: 80, exported: false }, { name: "incomingEmpty", key: "incomingEmpty", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "bool" } }, pkgPath: "net", index: [9], offset: 88, exported: false }]
	)
}

export class packet {
	public get buf(): $.Slice<number> {
		return this._fields.buf.value
	}
	public set buf(value: $.Slice<number>) {
		this._fields.buf.value = value
	}

	public get bufOffset(): number {
		return this._fields.bufOffset.value
	}
	public set bufOffset(value: number) {
		this._fields.bufOffset.value = value
	}

	public get next(): packet | $.VarRef<packet> | null {
		return this._fields.next.value
	}
	public set next(value: packet | $.VarRef<packet> | null) {
		this._fields.next.value = value
	}

	public get _from(): __goscript_sockaddr_posix.sockaddr | null {
		return this._fields._from.value
	}
	public set _from(value: __goscript_sockaddr_posix.sockaddr | null) {
		this._fields._from.value = value
	}

	public _fields: {
		buf: $.VarRef<$.Slice<number>>
		bufOffset: $.VarRef<number>
		next: $.VarRef<packet | $.VarRef<packet> | null>
		_from: $.VarRef<__goscript_sockaddr_posix.sockaddr | null>
	}

	constructor(init?: Partial<{buf?: $.Slice<number>, bufOffset?: number, next?: packet | $.VarRef<packet> | null, _from?: __goscript_sockaddr_posix.sockaddr | null}>) {
		this._fields = {
			buf: $.varRef(init?.buf ?? (null as $.Slice<number>)),
			bufOffset: $.varRef(init?.bufOffset ?? (0 as number)),
			next: $.varRef(init?.next ?? (null as packet | $.VarRef<packet> | null)),
			_from: $.varRef(init?._from ?? (null as __goscript_sockaddr_posix.sockaddr | null))
		}
	}

	public clone(): packet {
		const cloned = new packet()
		cloned._fields = {
			buf: $.varRef(this._fields.buf.value),
			bufOffset: $.varRef(this._fields.bufOffset.value),
			next: $.varRef(this._fields.next.value),
			_from: $.varRef(this._fields._from.value)
		}
		return $.markAsStructValue(cloned)
	}

	public clear(): void {
		let p: packet | $.VarRef<packet> | null = this
		$.pointerValue<packet>(p).buf = $.goSlice($.pointerValue<packet>(p).buf, undefined, 0)
		$.pointerValue<packet>(p).bufOffset = 0
		$.pointerValue<packet>(p).next = null
		$.pointerValue<packet>(p)._from = null
	}

	static __typeInfo = $.registerStructType(
		"net.packet",
		() => new packet(),
		[{ name: "clear", args: [], returns: [] }],
		packet,
		[{ name: "buf", key: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "bufOffset", key: "bufOffset", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "net", index: [1], offset: 24, exported: false }, { name: "next", key: "next", type: { kind: $.TypeKind.Pointer, elemType: "net.packet" }, pkgPath: "net", index: [2], offset: 32, exported: false }, { name: "from", key: "_from", type: "net.sockaddr", pkgPath: "net", index: [3], offset: 40, exported: false }]
	)
}

export class packetQueueState {
	public get head(): packet | $.VarRef<packet> | null {
		return this._fields.head.value
	}
	public set head(value: packet | $.VarRef<packet> | null) {
		this._fields.head.value = value
	}

	public get tail(): packet | $.VarRef<packet> | null {
		return this._fields.tail.value
	}
	public set tail(value: packet | $.VarRef<packet> | null) {
		this._fields.tail.value = value
	}

	public get nBytes(): number {
		return this._fields.nBytes.value
	}
	public set nBytes(value: number) {
		this._fields.nBytes.value = value
	}

	public get readBufferBytes(): number {
		return this._fields.readBufferBytes.value
	}
	public set readBufferBytes(value: number) {
		this._fields.readBufferBytes.value = value
	}

	public get readClosed(): boolean {
		return this._fields.readClosed.value
	}
	public set readClosed(value: boolean) {
		this._fields.readClosed.value = value
	}

	public get writeClosed(): boolean {
		return this._fields.writeClosed.value
	}
	public set writeClosed(value: boolean) {
		this._fields.writeClosed.value = value
	}

	public get noLinger(): boolean {
		return this._fields.noLinger.value
	}
	public set noLinger(value: boolean) {
		this._fields.noLinger.value = value
	}

	public _fields: {
		head: $.VarRef<packet | $.VarRef<packet> | null>
		tail: $.VarRef<packet | $.VarRef<packet> | null>
		nBytes: $.VarRef<number>
		readBufferBytes: $.VarRef<number>
		readClosed: $.VarRef<boolean>
		writeClosed: $.VarRef<boolean>
		noLinger: $.VarRef<boolean>
	}

	constructor(init?: Partial<{head?: packet | $.VarRef<packet> | null, tail?: packet | $.VarRef<packet> | null, nBytes?: number, readBufferBytes?: number, readClosed?: boolean, writeClosed?: boolean, noLinger?: boolean}>) {
		this._fields = {
			head: $.varRef(init?.head ?? (null as packet | $.VarRef<packet> | null)),
			tail: $.varRef(init?.tail ?? (null as packet | $.VarRef<packet> | null)),
			nBytes: $.varRef(init?.nBytes ?? (0 as number)),
			readBufferBytes: $.varRef(init?.readBufferBytes ?? (0 as number)),
			readClosed: $.varRef(init?.readClosed ?? (false as boolean)),
			writeClosed: $.varRef(init?.writeClosed ?? (false as boolean)),
			noLinger: $.varRef(init?.noLinger ?? (false as boolean))
		}
	}

	public clone(): packetQueueState {
		const cloned = new packetQueueState()
		cloned._fields = {
			head: $.varRef(this._fields.head.value),
			tail: $.varRef(this._fields.tail.value),
			nBytes: $.varRef(this._fields.nBytes.value),
			readBufferBytes: $.varRef(this._fields.readBufferBytes.value),
			readClosed: $.varRef(this._fields.readClosed.value),
			writeClosed: $.varRef(this._fields.writeClosed.value),
			noLinger: $.varRef(this._fields.noLinger.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"net.packetQueueState",
		() => new packetQueueState(),
		[],
		packetQueueState,
		[{ name: "head", key: "head", type: { kind: $.TypeKind.Pointer, elemType: "net.packet" }, pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "tail", key: "tail", type: { kind: $.TypeKind.Pointer, elemType: "net.packet" }, pkgPath: "net", index: [1], offset: 8, exported: false }, { name: "nBytes", key: "nBytes", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "net", index: [2], offset: 16, exported: false }, { name: "readBufferBytes", key: "readBufferBytes", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "net", index: [3], offset: 24, exported: false }, { name: "readClosed", key: "readClosed", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [4], offset: 32, exported: false }, { name: "writeClosed", key: "writeClosed", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [5], offset: 33, exported: false }, { name: "noLinger", key: "noLinger", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [6], offset: 34, exported: false }]
	)
}

export class packetQueue {
	public get empty(): $.Channel<packetQueueState> | null {
		return this._fields.empty.value
	}
	public set empty(value: $.Channel<packetQueueState> | null) {
		this._fields.empty.value = value
	}

	public get ready(): $.Channel<packetQueueState> | null {
		return this._fields.ready.value
	}
	public set ready(value: $.Channel<packetQueueState> | null) {
		this._fields.ready.value = value
	}

	public get full(): $.Channel<packetQueueState> | null {
		return this._fields.full.value
	}
	public set full(value: $.Channel<packetQueueState> | null) {
		this._fields.full.value = value
	}

	public _fields: {
		empty: $.VarRef<$.Channel<packetQueueState> | null>
		ready: $.VarRef<$.Channel<packetQueueState> | null>
		full: $.VarRef<$.Channel<packetQueueState> | null>
	}

	constructor(init?: Partial<{empty?: $.Channel<packetQueueState> | null, ready?: $.Channel<packetQueueState> | null, full?: $.Channel<packetQueueState> | null}>) {
		this._fields = {
			empty: $.varRef(init?.empty ?? (null as $.Channel<packetQueueState> | null)),
			ready: $.varRef(init?.ready ?? (null as $.Channel<packetQueueState> | null)),
			full: $.varRef(init?.full ?? (null as $.Channel<packetQueueState> | null))
		}
	}

	public clone(): packetQueue {
		const cloned = new packetQueue()
		cloned._fields = {
			empty: $.varRef(this._fields.empty.value),
			ready: $.varRef(this._fields.ready.value),
			full: $.varRef(this._fields.full.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async closeRead(): globalThis.Promise<$.GoError> {
		const pq: packetQueue | $.VarRef<packetQueue> | null = this
		let q = $.markAsStructValue($.cloneStructValue(await packetQueue.prototype.get.call(pq)))
		q.readClosed = true
		await packetQueue.prototype.put.call(pq, $.markAsStructValue($.cloneStructValue(q)))
		return null
	}

	public async closeWrite(): globalThis.Promise<$.GoError> {
		const pq: packetQueue | $.VarRef<packetQueue> | null = this
		let q = $.markAsStructValue($.cloneStructValue(await packetQueue.prototype.get.call(pq)))
		q.writeClosed = true
		await packetQueue.prototype.put.call(pq, $.markAsStructValue($.cloneStructValue(q)))
		return null
	}

	public async ["get"](): globalThis.Promise<packetQueueState> {
		const pq: packetQueue | $.VarRef<packetQueue> | null = this
		let q: packetQueueState = $.markAsStructValue(new packetQueueState())
		const [__goscriptSelect4HasReturn, __goscriptSelect4Value] = await $.selectStatement<any, packetQueueState>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<packetQueue>(pq).empty,
				onSelected: async (__goscriptSelect4Result) => {
					q = __goscriptSelect4Result.value
				}
			},
			{
				id: 1,
				isSend: false,
				channel: $.pointerValue<packetQueue>(pq).ready,
				onSelected: async (__goscriptSelect4Result) => {
					q = __goscriptSelect4Result.value
				}
			},
			{
				id: 2,
				isSend: false,
				channel: $.pointerValue<packetQueue>(pq).full,
				onSelected: async (__goscriptSelect4Result) => {
					q = __goscriptSelect4Result.value
				}
			}
		], false)
		if (__goscriptSelect4HasReturn) {
			return __goscriptSelect4Value
		}
		return $.markAsStructValue($.cloneStructValue(q))
	}

	public async put(q: packetQueueState): globalThis.Promise<void> {
		const pq: packetQueue | $.VarRef<packetQueue> | null = this
		using __defer = new $.DisposableStack()
		switch (true) {
			case q.readClosed || q.writeClosed:
			{
				await $.chanSend($.pointerValue<packetQueue>(pq).ready, $.markAsStructValue($.cloneStructValue(q)))
				break
			}
			case q.nBytes >= q.readBufferBytes:
			{
				await $.chanSend($.pointerValue<packetQueue>(pq).full, $.markAsStructValue($.cloneStructValue(q)))
				break
			}
			case q.head == null:
			{
				if (q.nBytes > 0) {
					__defer.defer(() => { $.panic("net: put with nil packet list and nonzero nBytes") })
				}
				await $.chanSend($.pointerValue<packetQueue>(pq).empty, $.markAsStructValue($.cloneStructValue(q)))
				break
			}
			default:
			{
				await $.chanSend($.pointerValue<packetQueue>(pq).ready, $.markAsStructValue($.cloneStructValue(q)))
				break
			}
		}
	}

	public async recvfrom(dt: deadlineTimer | $.VarRef<deadlineTimer> | null, b: $.Slice<number>, wholePacket: boolean, checkFrom: ((_p0: __goscript_sockaddr_posix.sockaddr | null) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<[number, __goscript_sockaddr_posix.sockaddr | null, $.GoError]> {
		const pq: packetQueue | $.VarRef<packetQueue> | null = this
		let n: number = 0
		let _from: __goscript_sockaddr_posix.sockaddr | null = null as __goscript_sockaddr_posix.sockaddr | null
		let err: $.GoError = null as $.GoError
		await using __defer = new $.AsyncDisposableStack()
		let q: packetQueueState = $.markAsStructValue(new packetQueueState())
		let empty: $.Channel<packetQueueState> | null = null as $.Channel<packetQueueState> | null
		if ($.len(b) == 0) {
			// For consistency with the implementation on Unix platforms,
			// allow a zero-length Read to proceed if the queue is empty.
			// (Without this, TestZeroByteRead deadlocks.)
			empty = $.pointerValue<packetQueue>(pq).empty
		}

		const [__goscriptSelect5HasReturn, __goscriptSelect5Value] = await $.selectStatement<any, [number, __goscript_sockaddr_posix.sockaddr | null, $.GoError]>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<deadlineTimer>(dt).expired,
				onSelected: async (__goscriptSelect5Result) => {
					return [0, null, os.ErrDeadlineExceeded]
				}
			},
			{
				id: 1,
				isSend: false,
				channel: empty,
				onSelected: async (__goscriptSelect5Result) => {
					q = __goscriptSelect5Result.value
				}
			},
			{
				id: 2,
				isSend: false,
				channel: $.pointerValue<packetQueue>(pq).ready,
				onSelected: async (__goscriptSelect5Result) => {
					q = __goscriptSelect5Result.value
				}
			},
			{
				id: 3,
				isSend: false,
				channel: $.pointerValue<packetQueue>(pq).full,
				onSelected: async (__goscriptSelect5Result) => {
					q = __goscriptSelect5Result.value
				}
			}
		], false)
		if (__goscriptSelect5HasReturn) {
			return __goscriptSelect5Value
		}
		__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
			await packetQueue.prototype.put.call(pq, $.markAsStructValue($.cloneStructValue(q)))
		})() })

		if (q.readClosed) {
			const __goscriptReturn6: [number, __goscript_sockaddr_posix.sockaddr | null, $.GoError] = [0, null, __goscript_net.ErrClosed]
			n = __goscriptReturn6[0]
			_from = __goscriptReturn6[1]
			err = __goscriptReturn6[2]
			await __defer[Symbol.asyncDispose]()
			return [n, _from, err]
		}

		let p: packet | $.VarRef<packet> | null = q.head
		if (p == null) {
			switch (true) {
				case q.writeClosed:
				{
					if (q.noLinger) {
						const __goscriptReturn7: [number, __goscript_sockaddr_posix.sockaddr | null, $.GoError] = [0, null, os.NewSyscallError("recvfrom", $.namedValueInterfaceValue<$.GoError>(syscall.ECONNRESET, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
						n = __goscriptReturn7[0]
						_from = __goscriptReturn7[1]
						err = __goscriptReturn7[2]
						await __defer[Symbol.asyncDispose]()
						return [n, _from, err]
					}
					const __goscriptReturn8: [number, __goscript_sockaddr_posix.sockaddr | null, $.GoError] = [0, null, io.EOF]
					n = __goscriptReturn8[0]
					_from = __goscriptReturn8[1]
					err = __goscriptReturn8[2]
					await __defer[Symbol.asyncDispose]()
					return [n, _from, err]
					break
				}
				case $.len(b) == 0:
				{
					const __goscriptReturn9: [number, __goscript_sockaddr_posix.sockaddr | null, $.GoError] = [0, null, null]
					n = __goscriptReturn9[0]
					_from = __goscriptReturn9[1]
					err = __goscriptReturn9[2]
					await __defer[Symbol.asyncDispose]()
					return [n, _from, err]
					break
				}
				default:
				{
					$.panic("net: nil packet list from non-closed packetQueue")
					break
				}
			}
		}

		const [__goscriptSelect6HasReturn, __goscriptSelect6Value] = await $.selectStatement<any, [number, __goscript_sockaddr_posix.sockaddr | null, $.GoError]>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<deadlineTimer>(dt).expired,
				onSelected: async (__goscriptSelect6Result) => {
					const __goscriptReturn10: [number, __goscript_sockaddr_posix.sockaddr | null, $.GoError] = [0, null, os.ErrDeadlineExceeded]
					n = __goscriptReturn10[0]
					_from = __goscriptReturn10[1]
					err = __goscriptReturn10[2]
					await __defer[Symbol.asyncDispose]()
					return [n, _from, err]
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect6Result) => {
				}
			}
		], true)
		if (__goscriptSelect6HasReturn) {
			return __goscriptSelect6Value
		}

		if (checkFrom != null) {
			{
				let __goscriptShadow9 = await checkFrom!($.pointerValue<packet>(p)._from)
				if (__goscriptShadow9 != null) {
					const __goscriptReturn11: [number, __goscript_sockaddr_posix.sockaddr | null, $.GoError] = [0, null, __goscriptShadow9]
					n = __goscriptReturn11[0]
					_from = __goscriptReturn11[1]
					err = __goscriptReturn11[2]
					await __defer[Symbol.asyncDispose]()
					return [n, _from, err]
				}
			}
		}

		n = $.copy(b, $.goSlice($.pointerValue<packet>(p).buf, $.pointerValue<packet>(p).bufOffset, undefined))
		_from = $.pointerValue<packet>(p)._from
		if (wholePacket || (($.pointerValue<packet>(p).bufOffset + n) == $.len($.pointerValue<packet>(p).buf))) {
			q.head = $.pointerValue<packet>(p).next
			q.nBytes = q.nBytes - ($.len($.pointerValue<packet>(p).buf))
			packet.prototype.clear.call(p)
			packetPool.value.Put($.interfaceValue<any>(p, "*net.packet"))
		} else {
			$.pointerValue<packet>(p).bufOffset = $.pointerValue<packet>(p).bufOffset + (n)
		}

		const __goscriptReturn12: [number, __goscript_sockaddr_posix.sockaddr | null, $.GoError] = [n, _from, null]
		n = __goscriptReturn12[0]
		_from = __goscriptReturn12[1]
		err = __goscriptReturn12[2]
		await __defer[Symbol.asyncDispose]()
		return [n, _from, err]
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async send(dt: deadlineTimer | $.VarRef<deadlineTimer> | null, b: $.Slice<number>, _from: __goscript_sockaddr_posix.sockaddr | null, block: boolean): globalThis.Promise<[number, $.GoError]> {
		const pq: packetQueue | $.VarRef<packetQueue> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		await using __defer = new $.AsyncDisposableStack()
		if (_from == null) {
			return [0, os.NewSyscallError("send", $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
		}
		if ($.len(b) > 65535) {
			return [0, os.NewSyscallError("send", $.namedValueInterfaceValue<$.GoError>(syscall.EMSGSIZE, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
		}

		let q: packetQueueState = $.markAsStructValue(new packetQueueState())
		let full: $.Channel<packetQueueState> | null = null as $.Channel<packetQueueState> | null
		if (!block) {
			full = $.pointerValue<packetQueue>(pq).full
		}

		const [__goscriptSelect7HasReturn, __goscriptSelect7Value] = await $.selectStatement<any, [number, $.GoError]>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<deadlineTimer>(dt).expired,
				onSelected: async (__goscriptSelect7Result) => {
					return [0, os.ErrDeadlineExceeded]
				}
			},
			{
				id: 1,
				isSend: false,
				channel: full,
				onSelected: async (__goscriptSelect7Result) => {
					q = __goscriptSelect7Result.value
					await packetQueue.prototype.put.call(pq, $.markAsStructValue($.cloneStructValue(q)))
					return [0, os.NewSyscallError("send", $.namedValueInterfaceValue<$.GoError>(syscall.ENOBUFS, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
				}
			},
			{
				id: 2,
				isSend: false,
				channel: $.pointerValue<packetQueue>(pq).empty,
				onSelected: async (__goscriptSelect7Result) => {
					q = __goscriptSelect7Result.value
				}
			},
			{
				id: 3,
				isSend: false,
				channel: $.pointerValue<packetQueue>(pq).ready,
				onSelected: async (__goscriptSelect7Result) => {
					q = __goscriptSelect7Result.value
				}
			}
		], false)
		if (__goscriptSelect7HasReturn) {
			return __goscriptSelect7Value
		}
		__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
			await packetQueue.prototype.put.call(pq, $.markAsStructValue($.cloneStructValue(q)))
		})() })

		// Don't allow a packet to be sent if the deadline has expired,
		// even if the select above chose a different branch.
		const [__goscriptSelect8HasReturn, __goscriptSelect8Value] = await $.selectStatement<any, [number, $.GoError]>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<deadlineTimer>(dt).expired,
				onSelected: async (__goscriptSelect8Result) => {
					const __goscriptReturn13: [number, $.GoError] = [0, os.ErrDeadlineExceeded]
					n = __goscriptReturn13[0]
					err = __goscriptReturn13[1]
					await __defer[Symbol.asyncDispose]()
					return [n, err]
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect8Result) => {
				}
			}
		], true)
		if (__goscriptSelect8HasReturn) {
			return __goscriptSelect8Value
		}
		if (q.writeClosed) {
			const __goscriptReturn14: [number, $.GoError] = [0, __goscript_net.ErrClosed]
			n = __goscriptReturn14[0]
			err = __goscriptReturn14[1]
			await __defer[Symbol.asyncDispose]()
			return [n, err]
		} else {
			if (q.readClosed && (q.nBytes >= q.readBufferBytes)) {
				const __goscriptReturn15: [number, $.GoError] = [0, os.NewSyscallError("send", $.namedValueInterfaceValue<$.GoError>(syscall.ECONNRESET, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
				n = __goscriptReturn15[0]
				err = __goscriptReturn15[1]
				await __defer[Symbol.asyncDispose]()
				return [n, err]
			}
		}

		let p: packet | $.VarRef<packet> | null = $.mustTypeAssert<packet | $.VarRef<packet> | null>(await packetPool.value.Get(), { kind: $.TypeKind.Pointer, elemType: "net.packet" })
		$.pointerValue<packet>(p).buf = $.appendSlice($.goSlice($.pointerValue<packet>(p).buf, undefined, 0), b)
		$.pointerValue<packet>(p)._from = _from

		if (q.head == null) {
			q.head = p
		} else {
			$.pointerValue<packet>(q.tail).next = p
		}
		q.tail = p
		q.nBytes = q.nBytes + ($.len($.pointerValue<packet>(p).buf))

		const __goscriptReturn16: [number, $.GoError] = [$.len(b), null]
		n = __goscriptReturn16[0]
		err = __goscriptReturn16[1]
		await __defer[Symbol.asyncDispose]()
		return [n, err]
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async setLinger(linger: boolean): globalThis.Promise<$.GoError> {
		const pq: packetQueue | $.VarRef<packetQueue> | null = this
		await using __defer = new $.AsyncDisposableStack()
		let q = $.markAsStructValue($.cloneStructValue(await packetQueue.prototype.get.call(pq)))
		__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
			await packetQueue.prototype.put.call(pq, $.markAsStructValue($.cloneStructValue(q)))
		})() })

		if (q.writeClosed) {
			return __goscript_net.ErrClosed
		}
		q.noLinger = !linger
		return null
	}

	public async setReadBuffer(bytes: number): globalThis.Promise<$.GoError> {
		const pq: packetQueue | $.VarRef<packetQueue> | null = this
		if (bytes <= 0) {
			return os.NewSyscallError("setReadBuffer", $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
		}
		let q = $.markAsStructValue($.cloneStructValue(await packetQueue.prototype.get.call(pq)))
		q.readBufferBytes = bytes
		await packetQueue.prototype.put.call(pq, $.markAsStructValue($.cloneStructValue(q)))
		return null
	}

	public async write(dt: deadlineTimer | $.VarRef<deadlineTimer> | null, b: $.Slice<number>, _from: __goscript_sockaddr_posix.sockaddr | null): globalThis.Promise<[number, $.GoError]> {
		const pq: packetQueue | $.VarRef<packetQueue> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		while (true) {
			let dn = $.len(b)
			if (dn > 65535) {
				dn = 65535
			}

			let __goscriptTuple14: any = await packetQueue.prototype.send.call(pq, dt, $.goSlice(b, undefined, dn), _from, true)
			dn = __goscriptTuple14[0]
			err = __goscriptTuple14[1]
			n = n + (dn)
			if (err != null) {
				return [n, err]
			}

			b = $.goSlice(b, dn, undefined)
			if ($.len(b) == 0) {
				return [n, null]
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"net.packetQueue",
		() => new packetQueue(),
		[{ name: "closeRead", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "closeWrite", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "get", args: [], returns: [{ name: "_r0", type: "net.packetQueueState" }] }, { name: "put", args: [{ name: "q", type: "net.packetQueueState" }], returns: [] }, { name: "recvfrom", args: [{ name: "dt", type: { kind: $.TypeKind.Pointer, elemType: "net.deadlineTimer" } }, { name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "wholePacket", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "checkFrom", type: ({ kind: $.TypeKind.Function, params: ["net.sockaddr"], results: ["error"] } as $.FunctionTypeInfo) }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "from", type: "net.sockaddr" }, { name: "err", type: "error" }] }, { name: "send", args: [{ name: "dt", type: { kind: $.TypeKind.Pointer, elemType: "net.deadlineTimer" } }, { name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "from", type: "net.sockaddr" }, { name: "block", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "setLinger", args: [{ name: "linger", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "setReadBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "write", args: [{ name: "dt", type: { kind: $.TypeKind.Pointer, elemType: "net.deadlineTimer" } }, { name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "from", type: "net.sockaddr" }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		packetQueue,
		[{ name: "empty", key: "empty", type: { kind: $.TypeKind.Channel, direction: "both", elemType: "net.packetQueueState" }, pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "ready", key: "ready", type: { kind: $.TypeKind.Channel, direction: "both", elemType: "net.packetQueueState" }, pkgPath: "net", index: [1], offset: 8, exported: false }, { name: "full", key: "full", type: { kind: $.TypeKind.Channel, direction: "both", elemType: "net.packetQueueState" }, pkgPath: "net", index: [2], offset: 16, exported: false }]
	)
}

export class deadlineTimer {
	public get timer(): $.Channel<time.Timer | $.VarRef<time.Timer> | null> | null {
		return this._fields.timer.value
	}
	public set timer(value: $.Channel<time.Timer | $.VarRef<time.Timer> | null> | null) {
		this._fields.timer.value = value
	}

	public get expired(): $.Channel<{}> | null {
		return this._fields.expired.value
	}
	public set expired(value: $.Channel<{}> | null) {
		this._fields.expired.value = value
	}

	public _fields: {
		timer: $.VarRef<$.Channel<time.Timer | $.VarRef<time.Timer> | null> | null>
		expired: $.VarRef<$.Channel<{}> | null>
	}

	constructor(init?: Partial<{timer?: $.Channel<time.Timer | $.VarRef<time.Timer> | null> | null, expired?: $.Channel<{}> | null}>) {
		this._fields = {
			timer: $.varRef(init?.timer ?? (null as $.Channel<time.Timer | $.VarRef<time.Timer> | null> | null)),
			expired: $.varRef(init?.expired ?? (null as $.Channel<{}> | null))
		}
	}

	public clone(): deadlineTimer {
		const cloned = new deadlineTimer()
		cloned._fields = {
			timer: $.varRef(this._fields.timer.value),
			expired: $.varRef(this._fields.expired.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Reset(deadline: time.Time): globalThis.Promise<boolean> {
		const dt: deadlineTimer | $.VarRef<deadlineTimer> | null = this
		await using __defer = new $.AsyncDisposableStack()
		let timer: time.Timer | $.VarRef<time.Timer> | null = await $.chanRecv($.pointerValue<deadlineTimer>(dt).timer)
		__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
			await $.chanSend($.pointerValue<deadlineTimer>(dt).timer, timer)
		})() })

		if ($.markAsStructValue($.cloneStructValue(deadline)).Equal($.markAsStructValue($.cloneStructValue(__goscript_net.noDeadline)))) {
			if ((timer != null) && time.Timer.prototype.Stop.call($.pointerValue<time.Timer>(timer))) {
				timer = null
			}
			return timer == null
		}

		let d = time.Until($.markAsStructValue($.cloneStructValue(deadline)))
		if (d < 0n) {
			// Ensure that a deadline in the past takes effect immediately.
			__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
				await $.chanRecv($.pointerValue<deadlineTimer>(dt).expired)
			})() })
		}

		if (timer == null) {
			timer = time.AfterFunc(d, $.functionValue((): void => {
				$.pointerValue<deadlineTimer>(dt).expired!.close()
			}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
			return true
		}
		if (!time.Timer.prototype.Stop.call($.pointerValue<time.Timer>(timer))) {
			return false
		}
		time.Timer.prototype.Reset.call($.pointerValue<time.Timer>(timer), d)
		return true
	}

	static __typeInfo = $.registerStructType(
		"net.deadlineTimer",
		() => new deadlineTimer(),
		[{ name: "Reset", args: [{ name: "deadline", type: "time.Time" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		deadlineTimer,
		[{ name: "timer", key: "timer", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Pointer, elemType: "time.Timer" } }, pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "expired", key: "expired", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "net", index: [1], offset: 8, exported: false }]
	)
}

export const defaultBuffer: number = 65535

export const maxPacketSize: number = 65535

export let sockets: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export function __goscript_set_sockets(__goscriptValue: sync.Map): void {
	sockets.value = __goscriptValue
}

export let fakePorts: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export function __goscript_set_fakePorts(__goscriptValue: sync.Map): void {
	fakePorts.value = __goscriptValue
}

export let nextPortCounter: $.VarRef<atomic.Int32> = $.varRef($.markAsStructValue(new atomic.Int32()))

export function __goscript_set_nextPortCounter(__goscriptValue: atomic.Int32): void {
	nextPortCounter.value = __goscriptValue
}

export async function fakeAddr(sa: __goscript_sockaddr_posix.sockaddr | null): globalThis.Promise<fakeSockAddr> {
	return (await (async () => { const __goscriptLiteralField0 = await $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(sa).family(); const __goscriptLiteralField1 = await $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(sa).String(); return $.markAsStructValue(new fakeSockAddr({family: __goscriptLiteralField0, address: __goscriptLiteralField1})) })())
}

export async function socket(ctx: context.Context | null, net: string, family: number, sotype: number, proto: number, ipv6only: boolean, laddr: __goscript_sockaddr_posix.sockaddr | null, raddr: __goscript_sockaddr_posix.sockaddr | null, ctrlCtxFn: ((_p0: context.Context | null, _p1: string, _p2: string, _p3: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<[__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, $.GoError]> {
	if ((raddr != null) && (ctrlCtxFn != null)) {
		return [null, os.NewSyscallError("socket", $.namedValueInterfaceValue<$.GoError>(syscall.ENOTSUP, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
	}
	switch (sotype) {
		case syscall.SOCK_STREAM:
		case syscall.SOCK_SEQPACKET:
		case syscall.SOCK_DGRAM:
		{
			break
		}
		default:
		{
			return [null, os.NewSyscallError("socket", $.namedValueInterfaceValue<$.GoError>(syscall.ENOTSUP, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
			break
		}
	}

	let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = new __goscript_fd_fake.netFD({family: family, sotype: sotype, net: net})
	$.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD = await newFakeNetFD(fd)

	if (raddr == null) {
		{
			let err = await fakeListen(fd, laddr)
			if (err != null) {
				await __goscript_fd_fake.netFD.prototype.Close.call(fd)
				return [null, err]
			}
		}
		return [fd, null]
	}

	{
		let err = await fakeConnect(ctx, fd, laddr, raddr)
		if (err != null) {
			await __goscript_fd_fake.netFD.prototype.Close.call(fd)
			return [null, err]
		}
	}
	return [fd, null]
}

export async function validateResolvedAddr(net: string, family: number, sa: __goscript_sockaddr_posix.sockaddr | null): globalThis.Promise<$.GoError> {
	let validateIP: ((ip: __goscript_ip.IP) => $.GoError | globalThis.Promise<$.GoError>) | null = $.functionValue((ip: __goscript_ip.IP): $.GoError => {
		switch (family) {
			case syscall.AF_INET:
			{
				if ($.len((ip as __goscript_ip.IP)) != 4) {
					return $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField2 = __goscript_ip.IP_String(ip); return new __goscript_net.AddrError({Err: "non-IPv4 address", Addr: __goscriptLiteralField2}) })(), "*net.AddrError")
				}
				break
			}
			case syscall.AF_INET6:
			{
				if ($.len((ip as __goscript_ip.IP)) != 16) {
					return $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField3 = __goscript_ip.IP_String(ip); return new __goscript_net.AddrError({Err: "non-IPv6 address", Addr: __goscriptLiteralField3}) })(), "*net.AddrError")
				}
				break
			}
			default:
			{
				$.panic("net: unexpected address family in validateResolvedAddr")
				break
			}
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: ["net.IP"], results: ["error"] } as $.FunctionTypeInfo))

	switch (net) {
		case "tcp":
		case "tcp4":
		case "tcp6":
		{
			let __goscriptShadow0 = sa
			let __goscriptTuple0: any = $.typeAssertTuple<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptShadow0, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" })
			let __goscriptShadow1: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null = __goscriptTuple0[0]
			let ok = __goscriptTuple0[1]
			if (!ok) {
				return $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField4 = __goscript_tcpsock.TCPAddr.prototype.String.call(__goscriptShadow1); return new __goscript_net.AddrError({Err: ("non-TCP address for " + net) + " network", Addr: __goscriptLiteralField4}) })(), "*net.AddrError")
			}
			{
				let err = await validateIP!(($.pointerValue<__goscript_tcpsock.TCPAddr>(__goscriptShadow1).IP as __goscript_ip.IP))
				if (err != null) {
					return err
				}
			}
			if (($.pointerValue<__goscript_tcpsock.TCPAddr>(__goscriptShadow1).Port <= 0) || ($.pointerValue<__goscript_tcpsock.TCPAddr>(__goscriptShadow1).Port >= (65536))) {
				return $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField5 = __goscript_tcpsock.TCPAddr.prototype.String.call(__goscriptShadow1); return new __goscript_net.AddrError({Err: "port out of range", Addr: __goscriptLiteralField5}) })(), "*net.AddrError")
			}
			return null
			break
		}
		case "udp":
		case "udp4":
		case "udp6":
		{
			let __goscriptShadow2 = sa
			let __goscriptTuple1: any = $.typeAssertTuple<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptShadow2, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" })
			let __goscriptShadow3: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null = __goscriptTuple1[0]
			let ok = __goscriptTuple1[1]
			if (!ok) {
				return $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField6 = __goscript_udpsock.UDPAddr.prototype.String.call(__goscriptShadow3); return new __goscript_net.AddrError({Err: ("non-UDP address for " + net) + " network", Addr: __goscriptLiteralField6}) })(), "*net.AddrError")
			}
			{
				let err = await validateIP!(($.pointerValue<__goscript_udpsock.UDPAddr>(__goscriptShadow3).IP as __goscript_ip.IP))
				if (err != null) {
					return err
				}
			}
			if (($.pointerValue<__goscript_udpsock.UDPAddr>(__goscriptShadow3).Port <= 0) || ($.pointerValue<__goscript_udpsock.UDPAddr>(__goscriptShadow3).Port >= (65536))) {
				return $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField7 = __goscript_udpsock.UDPAddr.prototype.String.call(__goscriptShadow3); return new __goscript_net.AddrError({Err: "port out of range", Addr: __goscriptLiteralField7}) })(), "*net.AddrError")
			}
			return null
			break
		}
		case "unix":
		case "unixgram":
		case "unixpacket":
		{
			let __goscriptShadow4 = sa
			let __goscriptTuple2: any = $.typeAssertTuple<__goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null>(__goscriptShadow4, { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" })
			let __goscriptShadow5: __goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null = __goscriptTuple2[0]
			let ok = __goscriptTuple2[1]
			if (!ok) {
				return $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField8 = __goscript_unixsock.UnixAddr.prototype.String.call(__goscriptShadow5); return new __goscript_net.AddrError({Err: ("non-Unix address for " + net) + " network", Addr: __goscriptLiteralField8}) })(), "*net.AddrError")
			}
			if (!$.stringEqual($.pointerValue<__goscript_unixsock.UnixAddr>(__goscriptShadow5).Name, "")) {
				let i = $.len($.pointerValue<__goscript_unixsock.UnixAddr>(__goscriptShadow5).Name) - 1
				while ((i > 0) && !os.IsPathSeparator($.uint($.indexStringOrBytes($.pointerValue<__goscript_unixsock.UnixAddr>(__goscriptShadow5).Name, i), 8))) {
					i--
				}
				while ((i > 0) && os.IsPathSeparator($.uint($.indexStringOrBytes($.pointerValue<__goscript_unixsock.UnixAddr>(__goscriptShadow5).Name, i), 8))) {
					i--
				}
				if (i <= 0) {
					return $.interfaceValue<$.GoError>(new __goscript_net.AddrError({Err: "unix socket name missing path component", Addr: $.pointerValue<__goscript_unixsock.UnixAddr>(__goscriptShadow5).Name}), "*net.AddrError")
				}
				{
					let [, err] = os.Stat($.sliceStringOrBytes($.pointerValue<__goscript_unixsock.UnixAddr>(__goscriptShadow5).Name, undefined, i + 1))
					if (err != null) {
						return $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField9 = $.pointerValue<Exclude<$.GoError, null>>(err).Error(); return new __goscript_net.AddrError({Err: __goscriptLiteralField9, Addr: $.pointerValue<__goscript_unixsock.UnixAddr>(__goscriptShadow5).Name}) })(), "*net.AddrError")
					}
				}
			}
			return null
			break
		}
		default:
		{
			return $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField10 = syscall.Errno_Error(syscall.EAFNOSUPPORT); const __goscriptLiteralField11 = await $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(sa).String(); return new __goscript_net.AddrError({Err: __goscriptLiteralField10, Addr: __goscriptLiteralField11}) })()), "*net.AddrError")
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function matchIPFamily(family: number, addr: __goscript_sockaddr_posix.sockaddr | null): globalThis.Promise<__goscript_sockaddr_posix.sockaddr | null> {
	let convertIP: ((ip: __goscript_ip.IP) => __goscript_ip.IP | globalThis.Promise<__goscript_ip.IP>) | null = $.functionValue((ip: __goscript_ip.IP): __goscript_ip.IP => {
		switch (family) {
			case syscall.AF_INET:
			{
				return (__goscript_ip.IP_To4(ip) as __goscript_ip.IP)
				break
			}
			case syscall.AF_INET6:
			{
				return (__goscript_ip.IP_To16(ip) as __goscript_ip.IP)
				break
			}
			default:
			{
				return (ip as __goscript_ip.IP)
				break
			}
		}
	}, ({ kind: $.TypeKind.Function, params: ["net.IP"], results: ["net.IP"] } as $.FunctionTypeInfo))

	{
		const __goscriptTypeSwitchValue = addr
		switch (true) {
			case $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).ok:
				{
					let addr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null = $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).value
					let ip: __goscript_ip.IP = (await convertIP!(($.pointerValue<__goscript_tcpsock.TCPAddr>(addr).IP as __goscript_ip.IP)) as __goscript_ip.IP)
					if ((ip == null) || ($.len((ip as __goscript_ip.IP)) == $.len(($.pointerValue<__goscript_tcpsock.TCPAddr>(addr).IP as __goscript_ip.IP)))) {
						return $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(addr, "*net.TCPAddr")
					}
					return $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(new __goscript_tcpsock.TCPAddr({IP: (ip as __goscript_ip.IP), Port: $.pointerValue<__goscript_tcpsock.TCPAddr>(addr).Port, Zone: $.pointerValue<__goscript_tcpsock.TCPAddr>(addr).Zone}), "*net.TCPAddr")
				}
				break
			case $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).ok:
				{
					let addr: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null = $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).value
					let ip: __goscript_ip.IP = (await convertIP!(($.pointerValue<__goscript_udpsock.UDPAddr>(addr).IP as __goscript_ip.IP)) as __goscript_ip.IP)
					if ((ip == null) || ($.len((ip as __goscript_ip.IP)) == $.len(($.pointerValue<__goscript_udpsock.UDPAddr>(addr).IP as __goscript_ip.IP)))) {
						return $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(addr, "*net.UDPAddr")
					}
					return $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(new __goscript_udpsock.UDPAddr({IP: (ip as __goscript_ip.IP), Port: $.pointerValue<__goscript_udpsock.UDPAddr>(addr).Port, Zone: $.pointerValue<__goscript_udpsock.UDPAddr>(addr).Zone}), "*net.UDPAddr")
				}
				break
			default:
				{
					let addr: any = __goscriptTypeSwitchValue
					return addr
				}
				break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function newFakeNetFD(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null): globalThis.Promise<fakeNetFD | $.VarRef<fakeNetFD> | null> {
	let ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = new fakeNetFD({fd: fd})
	$.pointerValue<fakeNetFD>(ffd).readDeadline.Store(await newDeadlineTimer($.markAsStructValue($.cloneStructValue(__goscript_net.noDeadline))))
	$.pointerValue<fakeNetFD>(ffd).writeDeadline.Store(await newDeadlineTimer($.markAsStructValue($.cloneStructValue(__goscript_net.noDeadline))))
	return ffd
}

export let packetPool: $.VarRef<sync.Pool> = $.varRef($.markAsStructValue(new sync.Pool({New: $.functionValue((): any => {
	return $.interfaceValue<any>(new packet(), "*net.packet")
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))})))

export function __goscript_set_packetPool(__goscriptValue: sync.Pool): void {
	packetPool.value = __goscriptValue
}

export async function newPacketQueue(readBufferBytes: number): globalThis.Promise<packetQueue | $.VarRef<packetQueue> | null> {
	let pq: packetQueue | $.VarRef<packetQueue> | null = new packetQueue({empty: $.makeChannel<packetQueueState>(1, $.markAsStructValue(new packetQueueState()), "both"), ready: $.makeChannel<packetQueueState>(1, $.markAsStructValue(new packetQueueState()), "both"), full: $.makeChannel<packetQueueState>(1, $.markAsStructValue(new packetQueueState()), "both")})
	await packetQueue.prototype.put.call(pq, $.markAsStructValue(new packetQueueState({readBufferBytes: readBufferBytes})))
	return pq
}

export async function newDeadlineTimer(deadline: time.Time): globalThis.Promise<deadlineTimer | $.VarRef<deadlineTimer> | null> {
	let dt: deadlineTimer | $.VarRef<deadlineTimer> | null = new deadlineTimer({timer: $.makeChannel<time.Timer | $.VarRef<time.Timer> | null>(1, null, "both"), expired: $.makeChannel<{}>(0, {}, "both")})
	await $.chanSend($.pointerValue<deadlineTimer>(dt).timer, null)
	await deadlineTimer.prototype.Reset.call(dt, $.markAsStructValue($.cloneStructValue(deadline)))
	return dt
}

export function sysSocket(family: number, sotype: number, proto: number): [number, $.GoError] {
	return [0, os.NewSyscallError("sysSocket", $.namedValueInterfaceValue<$.GoError>(syscall.ENOSYS, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))]
}

export async function fakeListen(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, laddr: __goscript_sockaddr_posix.sockaddr | null): globalThis.Promise<$.GoError> {
	let err: $.GoError = null as $.GoError
	await using __defer = new $.AsyncDisposableStack()
	let wrapErr: ((err: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null = $.functionValue(async (err: $.GoError): globalThis.Promise<$.GoError> => {
		{
			let [errno, ok] = $.typeAssertTuple<syscall.Errno>(err, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
			if (ok) {
				err = os.NewSyscallError("listen", $.namedValueInterfaceValue<$.GoError>(errno, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
			}
		}
		if (errors.Is($.pointerValueOrNil(err)!, $.namedValueInterfaceValue<$.GoError>(syscall.EADDRINUSE, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))) {
			return err
		}
		if (laddr != null) {
			{
				let [, ok] = $.typeAssertTuple<__goscript_net.AddrError | $.VarRef<__goscript_net.AddrError> | null>(err, { kind: $.TypeKind.Pointer, elemType: "net.AddrError" })
				if (!ok) {
					err = $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField15 = $.pointerValue<Exclude<$.GoError, null>>(err).Error(); const __goscriptLiteralField16 = await $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(laddr).String(); return new __goscript_net.AddrError({Err: __goscriptLiteralField15, Addr: __goscriptLiteralField16}) })()), "*net.AddrError")
				}
			}
		}
		return err
	}, ({ kind: $.TypeKind.Function, params: ["error"], results: ["error"] } as $.FunctionTypeInfo))

	let ffd: fakeNetFD | $.VarRef<fakeNetFD> | null = await newFakeNetFD(fd)
	__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
		if ($.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD != ffd) {
			// Failed to register listener; clean up.
			await fakeNetFD.prototype.Close.call(ffd)
		}
	})() })

	{
		let __goscriptShadow10 = await fakeNetFD.prototype.assignFakeAddr.call(ffd, await matchIPFamily($.pointerValue<__goscript_fd_fake.netFD>(fd).family, laddr))
		if (__goscriptShadow10 != null) {
			const __goscriptReturn17: $.GoError = await wrapErr!(__goscriptShadow10)
			err = __goscriptReturn17
			await __defer[Symbol.asyncDispose]()
			return err
		}
	}

	$.pointerValue<fakeNetFD>(ffd).fakeAddr = $.markAsStructValue($.cloneStructValue(await fakeAddr($.mustTypeAssert<__goscript_sockaddr_posix.sockaddr | null>($.pointerValue<__goscript_fd_fake.netFD>(fd).laddr, "net.sockaddr"))))
	switch ($.pointerValue<__goscript_fd_fake.netFD>(fd).sotype) {
		case syscall.SOCK_STREAM:
		case syscall.SOCK_SEQPACKET:
		{
			$.pointerValue<fakeNetFD>(ffd).incoming = $.makeChannel<$.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>>(1, null, "both")
			$.pointerValue<fakeNetFD>(ffd).incomingFull = $.makeChannel<$.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>>(1, null, "both")
			$.pointerValue<fakeNetFD>(ffd).incomingEmpty = $.makeChannel<boolean>(1, false, "both")
			await $.chanSend($.pointerValue<fakeNetFD>(ffd).incomingEmpty, true)
			break
		}
		case syscall.SOCK_DGRAM:
		{
			$.pointerValue<fakeNetFD>(ffd).queue = await newPacketQueue(65535)
			break
		}
		default:
		{
			const __goscriptReturn18: $.GoError = await wrapErr!($.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
			err = __goscriptReturn18
			await __defer[Symbol.asyncDispose]()
			return err
			break
		}
	}

	$.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD = ffd
	{
		let [, dup] = await sockets.value.LoadOrStore($.interfaceValue<any>($.markAsStructValue($.cloneStructValue($.pointerValue<fakeNetFD>(ffd).fakeAddr)), "net.fakeSockAddr"), $.interfaceValue<any>(fd, "*net.netFD"))
		if (dup) {
			$.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD = null
			const __goscriptReturn19: $.GoError = await wrapErr!($.namedValueInterfaceValue<$.GoError>(syscall.EADDRINUSE, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
			err = __goscriptReturn19
			await __defer[Symbol.asyncDispose]()
			return err
		}
	}

	const __goscriptReturn20: $.GoError = null
	err = __goscriptReturn20
	await __defer[Symbol.asyncDispose]()
	return err
	throw new globalThis.Error("goscript: unreachable return")
}

export async function fakeConnect(ctx: context.Context | null, fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, laddr: __goscript_sockaddr_posix.sockaddr | null, raddr: __goscript_sockaddr_posix.sockaddr | null): globalThis.Promise<$.GoError> {
	await using __defer = new $.AsyncDisposableStack()
	let wrapErr: ((err: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null = $.functionValue(async (err: $.GoError): globalThis.Promise<$.GoError> => {
		{
			let [errno, ok] = $.typeAssertTuple<syscall.Errno>(err, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
			if (ok) {
				err = os.NewSyscallError("connect", $.namedValueInterfaceValue<$.GoError>(errno, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
			}
		}
		if (errors.Is($.pointerValueOrNil(err)!, $.namedValueInterfaceValue<$.GoError>(syscall.EADDRINUSE, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))) {
			return err
		}
		{
			let [terr, ok] = $.typeAssertTuple<any>(err, { kind: $.TypeKind.Interface, methods: [{ name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] })
			if (!ok || !await $.pointerValue<any>(terr).Timeout()) {
				// For consistency with the net implementation on other platforms,
				// if we don't need to preserve the Timeout-ness of err we should
				// wrap it in an AddrError. (Unfortunately we can't wrap errors
				// that convey structured information, because AddrError reduces
				// the wrapped Err to a flat string.)
				{
					let [, __goscriptShadow11] = $.typeAssertTuple<__goscript_net.AddrError | $.VarRef<__goscript_net.AddrError> | null>(err, { kind: $.TypeKind.Pointer, elemType: "net.AddrError" })
					if (!__goscriptShadow11) {
						err = $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField17 = $.pointerValue<Exclude<$.GoError, null>>(err).Error(); const __goscriptLiteralField18 = await $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(raddr).String(); return new __goscript_net.AddrError({Err: __goscriptLiteralField17, Addr: __goscriptLiteralField18}) })()), "*net.AddrError")
					}
				}
			}
		}
		return err
	}, ({ kind: $.TypeKind.Function, params: ["error"], results: ["error"] } as $.FunctionTypeInfo))

	if ($.pointerValue<__goscript_fd_fake.netFD>(fd).isConnected) {
		return await wrapErr!($.namedValueInterfaceValue<$.GoError>(syscall.EISCONN, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
	}
	if (await $.pointerValue<Exclude<context.Context, null>>(ctx).Err() != null) {
		return await wrapErr!($.namedValueInterfaceValue<$.GoError>(syscall.ETIMEDOUT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
	}

	$.pointerValue<__goscript_fd_fake.netFD>(fd).raddr = (await matchIPFamily($.pointerValue<__goscript_fd_fake.netFD>(fd).family, raddr) as __goscript_net.Addr | null)
	{
		let err = await validateResolvedAddr($.pointerValue<__goscript_fd_fake.netFD>(fd).net, $.pointerValue<__goscript_fd_fake.netFD>(fd).family, $.mustTypeAssert<__goscript_sockaddr_posix.sockaddr | null>($.pointerValue<__goscript_fd_fake.netFD>(fd).raddr, "net.sockaddr"))
		if (err != null) {
			return await wrapErr!(err)
		}
	}

	{
		let err = await fakeNetFD.prototype.assignFakeAddr.call($.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD, laddr)
		if (err != null) {
			return await wrapErr!(err)
		}
	}
	$.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD).queue = await newPacketQueue(65535)

	switch ($.pointerValue<__goscript_fd_fake.netFD>(fd).sotype) {
		case syscall.SOCK_DGRAM:
		{
			{
				let __goscriptTuple15: any = $.typeAssertTuple<__goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null>($.pointerValue<__goscript_fd_fake.netFD>(fd).laddr, { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" })
				let ua: __goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null = __goscriptTuple15[0]
				let ok = __goscriptTuple15[1]
				if (!ok || (!$.stringEqual($.pointerValue<__goscript_unixsock.UnixAddr>(ua).Name, ""))) {
					$.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD).fakeAddr = $.markAsStructValue($.cloneStructValue(await fakeAddr($.mustTypeAssert<__goscript_sockaddr_posix.sockaddr | null>($.pointerValue<__goscript_fd_fake.netFD>(fd).laddr, "net.sockaddr"))))
					{
						let [, dup] = await sockets.value.LoadOrStore($.interfaceValue<any>($.markAsStructValue($.cloneStructValue($.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD).fakeAddr)), "net.fakeSockAddr"), $.interfaceValue<any>(fd, "*net.netFD"))
						if (dup) {
							return await wrapErr!($.namedValueInterfaceValue<$.GoError>(syscall.EADDRINUSE, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
						}
					}
				}
			}
			$.pointerValue<__goscript_fd_fake.netFD>(fd).isConnected = true
			return null
			break
		}
		case syscall.SOCK_STREAM:
		case syscall.SOCK_SEQPACKET:
		{
			break
		}
		default:
		{
			return await wrapErr!($.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
			break
		}
	}

	let fa = $.markAsStructValue($.cloneStructValue(await fakeAddr(raddr)))
	let [lni, ok] = await sockets.value.Load($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(fa)), "net.fakeSockAddr"))
	if (!ok) {
		return await wrapErr!($.namedValueInterfaceValue<$.GoError>(syscall.ECONNREFUSED, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
	}
	let ln: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = $.mustTypeAssert<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>(lni, { kind: $.TypeKind.Pointer, elemType: "net.netFD" })
	if ($.pointerValue<__goscript_fd_fake.netFD>(ln).sotype != $.pointerValue<__goscript_fd_fake.netFD>(fd).sotype) {
		return await wrapErr!($.namedValueInterfaceValue<$.GoError>(syscall.EPROTOTYPE, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
	}
	if ($.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(ln).fakeNetFD).incoming == null) {
		return await wrapErr!($.namedValueInterfaceValue<$.GoError>(syscall.ECONNREFUSED, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
	}

	let peer: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = new __goscript_fd_fake.netFD({family: $.pointerValue<__goscript_fd_fake.netFD>(ln).family, sotype: $.pointerValue<__goscript_fd_fake.netFD>(ln).sotype, net: $.pointerValue<__goscript_fd_fake.netFD>(ln).net, laddr: $.pointerValue<__goscript_fd_fake.netFD>(ln).laddr, raddr: $.pointerValue<__goscript_fd_fake.netFD>(fd).laddr, isConnected: true})
	$.pointerValue<__goscript_fd_fake.netFD>(peer).fakeNetFD = await newFakeNetFD(fd)
	$.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(peer).fakeNetFD).queue = await newPacketQueue(65535)
	__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
		if ($.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD).peer != peer) {
			// Failed to connect; clean up.
			await __goscript_fd_fake.netFD.prototype.Close.call(peer)
		}
	})() })

	let incoming: $.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null> = null as $.Slice<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>
	const [__goscriptSelect9HasReturn, __goscriptSelect9Value] = await $.selectStatement<any, $.GoError>([
		{
			id: 0,
			isSend: false,
			channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
			onSelected: async (__goscriptSelect9Result) => {
				return await wrapErr!($.namedValueInterfaceValue<$.GoError>(syscall.ETIMEDOUT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
			}
		},
		{
			id: 1,
			isSend: false,
			channel: $.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(ln).fakeNetFD).incomingEmpty,
			onSelected: async (__goscriptSelect9Result) => {
				ok = __goscriptSelect9Result.value
			}
		},
		{
			id: 2,
			isSend: false,
			channel: $.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(ln).fakeNetFD).incoming,
			onSelected: async (__goscriptSelect9Result) => {
				incoming = __goscriptSelect9Result.value
				ok = __goscriptSelect9Result.ok
			}
		}
	], false)
	if (__goscriptSelect9HasReturn) {
		return __goscriptSelect9Value
	}
	if (!ok) {
		return await wrapErr!($.namedValueInterfaceValue<$.GoError>(syscall.ECONNREFUSED, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
	}

	$.pointerValue<__goscript_fd_fake.netFD>(fd).isConnected = true
	$.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(fd).fakeNetFD).peer = peer
	$.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(peer).fakeNetFD).peer = fd

	incoming = $.append(incoming, peer)
	if ($.len(incoming) >= await __goscript_net.listenerBacklog()) {
		await $.chanSend($.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(ln).fakeNetFD).incomingFull, incoming)
	} else {
		await $.chanSend($.pointerValue<fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>(ln).fakeNetFD).incoming, incoming)
	}
	return null
}

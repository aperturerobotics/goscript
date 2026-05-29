// Generated file based on fd_unix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import * as io from "@goscript/io/index.js"

import * as strconv from "@goscript/internal/strconv/index.js"

import * as unix from "@goscript/internal/syscall/unix/index.js"

import * as __goscript_fd from "./fd.gs.ts"

import * as __goscript_fd_fsync_posix from "./fd_fsync_posix.gs.ts"

import * as __goscript_fd_mutex from "./fd_mutex.gs.ts"

import * as __goscript_fd_poll_js from "./fd_poll_js.gs.ts"

import * as __goscript_fd_posix from "./fd_posix.gs.ts"

import * as __goscript_fd_unixjs from "./fd_unixjs.gs.ts"

import * as __goscript_sys_cloexec from "./sys_cloexec.gs.ts"
import "@goscript/syscall/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "@goscript/io/index.js"
import "@goscript/internal/strconv/index.js"
import "@goscript/internal/syscall/unix/index.js"
import "./fd.gs.ts"
import "./fd_fsync_posix.gs.ts"
import "./fd_mutex.gs.ts"
import "./fd_poll_js.gs.ts"
import "./fd_posix.gs.ts"
import "./fd_unixjs.gs.ts"
import "./sys_cloexec.gs.ts"

export class FD {
	// Lock sysfd and serialize access to Read and Write methods.
	public get fdmu(): __goscript_fd_mutex.fdMutex {
		return this._fields.fdmu.value
	}
	public set fdmu(value: __goscript_fd_mutex.fdMutex) {
		this._fields.fdmu.value = value
	}

	// System file descriptor. Immutable until Close.
	public get Sysfd(): number {
		return this._fields.Sysfd.value
	}
	public set Sysfd(value: number) {
		this._fields.Sysfd.value = value
	}

	public get SysFile(): __goscript_fd_unixjs.SysFile {
		return this._fields.SysFile.value
	}
	public set SysFile(value: __goscript_fd_unixjs.SysFile) {
		this._fields.SysFile.value = value
	}

	// I/O poller.
	public get pd(): __goscript_fd_poll_js.pollDesc {
		return this._fields.pd.value
	}
	public set pd(value: __goscript_fd_poll_js.pollDesc) {
		this._fields.pd.value = value
	}

	// Semaphore signaled when file is closed.
	public get csema(): number {
		return this._fields.csema.value
	}
	public set csema(value: number) {
		this._fields.csema.value = value
	}

	// Non-zero if this file has been set to blocking mode.
	public get isBlocking(): number {
		return this._fields.isBlocking.value
	}
	public set isBlocking(value: number) {
		this._fields.isBlocking.value = value
	}

	// Whether this is a streaming descriptor, as opposed to a
	// packet-based descriptor like a UDP socket. Immutable.
	public get IsStream(): boolean {
		return this._fields.IsStream.value
	}
	public set IsStream(value: boolean) {
		this._fields.IsStream.value = value
	}

	// Whether a zero byte read indicates EOF. This is false for a
	// message based socket connection.
	public get ZeroReadIsEOF(): boolean {
		return this._fields.ZeroReadIsEOF.value
	}
	public set ZeroReadIsEOF(value: boolean) {
		this._fields.ZeroReadIsEOF.value = value
	}

	// Whether this is a file rather than a network socket.
	public get isFile(): boolean {
		return this._fields.isFile.value
	}
	public set isFile(value: boolean) {
		this._fields.isFile.value = value
	}

	public _fields: {
		fdmu: $.VarRef<__goscript_fd_mutex.fdMutex>
		Sysfd: $.VarRef<number>
		SysFile: $.VarRef<__goscript_fd_unixjs.SysFile>
		pd: $.VarRef<__goscript_fd_poll_js.pollDesc>
		csema: $.VarRef<number>
		isBlocking: $.VarRef<number>
		IsStream: $.VarRef<boolean>
		ZeroReadIsEOF: $.VarRef<boolean>
		isFile: $.VarRef<boolean>
	}

	constructor(init?: Partial<{fdmu?: __goscript_fd_mutex.fdMutex, Sysfd?: number, SysFile?: __goscript_fd_unixjs.SysFile, pd?: __goscript_fd_poll_js.pollDesc, csema?: number, isBlocking?: number, IsStream?: boolean, ZeroReadIsEOF?: boolean, isFile?: boolean}>) {
		this._fields = {
			fdmu: $.varRef(init?.fdmu ? $.markAsStructValue($.cloneStructValue(init.fdmu)) : $.markAsStructValue(new __goscript_fd_mutex.fdMutex())),
			Sysfd: $.varRef(init?.Sysfd ?? 0),
			SysFile: $.varRef(init?.SysFile ? $.markAsStructValue($.cloneStructValue(init.SysFile)) : $.markAsStructValue(new __goscript_fd_unixjs.SysFile())),
			pd: $.varRef(init?.pd ? $.markAsStructValue($.cloneStructValue(init.pd)) : $.markAsStructValue(new __goscript_fd_poll_js.pollDesc())),
			csema: $.varRef(init?.csema ?? 0),
			isBlocking: $.varRef(init?.isBlocking ?? 0),
			IsStream: $.varRef(init?.IsStream ?? false),
			ZeroReadIsEOF: $.varRef(init?.ZeroReadIsEOF ?? false),
			isFile: $.varRef(init?.isFile ?? false)
		}
	}

	public clone(): FD {
		const cloned = new FD()
		cloned._fields = {
			fdmu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.fdmu.value))),
			Sysfd: $.varRef(this._fields.Sysfd.value),
			SysFile: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.SysFile.value))),
			pd: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.pd.value))),
			csema: $.varRef(this._fields.csema.value),
			isBlocking: $.varRef(this._fields.isBlocking.value),
			IsStream: $.varRef(this._fields.IsStream.value),
			ZeroReadIsEOF: $.varRef(this._fields.ZeroReadIsEOF.value),
			isFile: $.varRef(this._fields.isFile.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Accept(): globalThis.Promise<[number, syscall.Sockaddr | null, string, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.readLock.call(fd)
			if (err != null) {
				return [-1, null, "", err]
			}
		}
		__defer.defer(async () => { await FD.prototype.readUnlock.call(fd) })

		{
			let err = $.pointerValue<FD>(fd).pd.prepareRead($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [-1, null, "", err]
			}
		}
		while (true) {
			let [s, rsa, errcall, err] = await __goscript_sys_cloexec.accept($.pointerValue<FD>(fd).Sysfd)
			if (err == null) {
				return [s, rsa, "", err]
			}
			{
				let __goscriptSwitch0 = err
				switch (true) {
					case $.comparableEqual(__goscriptSwitch0, $.namedValueInterfaceValue<$.GoError>(syscall.EINTR, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })):
					{
						continue
						break
					}
					case $.comparableEqual(__goscriptSwitch0, $.namedValueInterfaceValue<$.GoError>(syscall.EAGAIN, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })):
					{
						if ($.pointerValue<FD>(fd).pd.pollable()) {
							{
								err = $.pointerValue<FD>(fd).pd.waitRead($.pointerValue<FD>(fd).isFile)
								if (err == null) {
									continue
								}
							}
						}
						break
					}
					case $.comparableEqual(__goscriptSwitch0, $.namedValueInterfaceValue<$.GoError>(syscall.ECONNABORTED, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })):
					{
						continue
						break
					}
				}
			}
			return [-1, null, errcall, err]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		if (!$.pointerValue<FD>(fd).fdmu.increfAndClose()) {
			return __goscript_fd.errClosing($.pointerValue<FD>(fd).isFile)
		}

		// Unblock any I/O.  Once it all unblocks and returns,
		// so that it cannot be referring to fd.sysfd anymore,
		// the final decref will close fd.sysfd. This should happen
		// fairly quickly, since all the I/O is non-blocking, and any
		// attempts to block in the pollDesc will return errClosing(fd.isFile).
		$.pointerValue<FD>(fd).pd.evict()

		// The call to decref will call destroy if there are no other
		// references.
		let err = await FD.prototype.decref.call(fd)

		// Wait until the descriptor is closed. If this was the only
		// reference, it is already closed. Only wait if the file has
		// not been set to blocking mode, as otherwise any current I/O
		// may be blocking, and that would block the Close.
		// No need for an atomic read of isBlocking, increfAndClose means
		// we have exclusive access to fd.
		if ($.uint($.pointerValue<FD>(fd).isBlocking, 32) == $.uint(0, 32)) {
			__goscript_fd_mutex.runtime_Semacquire($.pointerValue<FD>(fd)._fields.csema)
		}

		return err
	}

	public async Dup(): globalThis.Promise<[number, string, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.incref.call(fd)
			if (err != null) {
				return [-1, "", err]
			}
		}
		__defer.defer(async () => { await FD.prototype.decref.call(fd) })
		return await DupCloseOnExec($.pointerValue<FD>(fd).Sysfd)
	}

	public async Fchdir(): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.incref.call(fd)
			if (err != null) {
				return err
			}
		}
		__defer.defer(async () => { await FD.prototype.decref.call(fd) })
		return syscall.Fchdir($.pointerValue<FD>(fd).Sysfd)
	}

	public async Fchmod(mode: number): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.incref.call(fd)
			if (err != null) {
				return err
			}
		}
		__defer.defer(async () => { await FD.prototype.decref.call(fd) })
		return await __goscript_fd_posix.ignoringEINTR($.functionValue((): $.GoError => {
			return syscall.Fchmod($.pointerValue<FD>(fd).Sysfd, $.uint(mode, 32))
		}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
	}

	public async Fchown(uid: number, gid: number): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.incref.call(fd)
			if (err != null) {
				return err
			}
		}
		__defer.defer(async () => { await FD.prototype.decref.call(fd) })
		return await __goscript_fd_posix.ignoringEINTR($.functionValue((): $.GoError => {
			return syscall.Fchown($.pointerValue<FD>(fd).Sysfd, uid, gid)
		}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
	}

	public async Fstat(s: syscall.Stat_t | $.VarRef<syscall.Stat_t> | null): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.incref.call(fd)
			if (err != null) {
				return err
			}
		}
		__defer.defer(async () => { await FD.prototype.decref.call(fd) })
		return await __goscript_fd_posix.ignoringEINTR($.functionValue((): $.GoError => {
			return syscall.Fstat($.pointerValue<FD>(fd).Sysfd, s)
		}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
	}

	public async Fsync(): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.incref.call(fd)
			if (err != null) {
				return err
			}
		}
		__defer.defer(async () => { await FD.prototype.decref.call(fd) })
		return await __goscript_fd_posix.ignoringEINTR($.functionValue((): $.GoError => {
			return syscall.Fsync($.pointerValue<FD>(fd).Sysfd)
		}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
	}

	public async Ftruncate(size: number): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.incref.call(fd)
			if (err != null) {
				return err
			}
		}
		__defer.defer(async () => { await FD.prototype.decref.call(fd) })
		return await __goscript_fd_posix.ignoringEINTR($.functionValue((): $.GoError => {
			return syscall.Ftruncate($.pointerValue<FD>(fd).Sysfd, $.int(size))
		}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
	}

	public Init(net: string, pollable: boolean): $.GoError {
		let fd: FD | $.VarRef<FD> | null = this
		$.pointerValue<FD>(fd).SysFile.init()

		// We don't actually care about the various network types.
		if ($.stringEqual(net, "file")) {
			$.pointerValue<FD>(fd).isFile = true
		}
		if (!pollable) {
			$.pointerValue<FD>(fd).isBlocking = $.uint(1, 32)
			return null
		}
		let err = $.pointerValue<FD>(fd).pd.init(fd)
		if (err != null) {
			// If we could not initialize the runtime poller,
			// assume we are using blocking mode.
			$.pointerValue<FD>(fd).isBlocking = $.uint(1, 32)
		}
		return err
	}

	public async Pread(p: $.Slice<number>, off: number): globalThis.Promise<[number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		// Call incref, not readLock, because since pread specifies the
		// offset it is independent from other reads.
		// Similarly, using the poller doesn't make sense for pread.
		{
			let err = FD.prototype.incref.call(fd)
			if (err != null) {
				return [0, err]
			}
		}
		if ($.pointerValue<FD>(fd).IsStream && ($.len(p) > 1073741824)) {
			p = $.goSlice(p, undefined, 1073741824)
		}
		let __goscriptTuple0: any = await __goscript_fd_posix.ignoringEINTR2(undefined, $.functionValue((): [number, $.GoError] => {
			return syscall.Pread($.pointerValue<FD>(fd).Sysfd, p, $.int(off))
		}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Basic, name: "int" }, "error"] } as $.FunctionTypeInfo)))
		let n = (__goscriptTuple0[0] as number)
		let err = __goscriptTuple0[1]
		if (err != null) {
			n = 0
		}
		await FD.prototype.decref.call(fd)
		err = FD.prototype.eofError.call(fd, n, err)
		return [n, err]
	}

	public async Pwrite(p: $.Slice<number>, off: number): globalThis.Promise<[number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		// Call incref, not writeLock, because since pwrite specifies the
		// offset it is independent from other writes.
		// Similarly, using the poller doesn't make sense for pwrite.
		{
			let err = FD.prototype.incref.call(fd)
			if (err != null) {
				return [0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.decref.call(fd) })
		let nn: number = 0
		while (true) {
			let max = $.len(p)
			if ($.pointerValue<FD>(fd).IsStream && ((max - nn) > 1073741824)) {
				max = nn + 1073741824
			}
			let [n, err] = syscall.Pwrite($.pointerValue<FD>(fd).Sysfd, $.goSlice(p, nn, max), $.int($.int64Add(off, $.int(nn))))
			if ($.comparableEqual(err, syscall.EINTR)) {
				continue
			}
			if (n > 0) {
				nn = nn + (n)
			}
			if (nn == $.len(p)) {
				return [nn, err]
			}
			if (err != null) {
				return [nn, err]
			}
			if (n == 0) {
				return [nn, io.ErrUnexpectedEOF]
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async RawControl(f: ((_p0: number) => void) | null): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.incref.call(fd)
			if (err != null) {
				return err
			}
		}
		__defer.defer(async () => { await FD.prototype.decref.call(fd) })
		await f!($.uint($.uint($.pointerValue<FD>(fd).Sysfd, 64), 64))
		return null
	}

	public async RawRead(f: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.readLock.call(fd)
			if (err != null) {
				return err
			}
		}
		__defer.defer(async () => { await FD.prototype.readUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareRead($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return err
			}
		}
		while (true) {
			if (await f!($.uint($.uint($.pointerValue<FD>(fd).Sysfd, 64), 64))) {
				return null
			}
			{
				let err = $.pointerValue<FD>(fd).pd.waitRead($.pointerValue<FD>(fd).isFile)
				if (err != null) {
					return err
				}
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async RawWrite(f: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.writeLock.call(fd)
			if (err != null) {
				return err
			}
		}
		__defer.defer(async () => { await FD.prototype.writeUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareWrite($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return err
			}
		}
		while (true) {
			if (await f!($.uint($.uint($.pointerValue<FD>(fd).Sysfd, 64), 64))) {
				return null
			}
			{
				let err = $.pointerValue<FD>(fd).pd.waitWrite($.pointerValue<FD>(fd).isFile)
				if (err != null) {
					return err
				}
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.readLock.call(fd)
			if (err != null) {
				return [0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.readUnlock.call(fd) })
		if ($.len(p) == 0) {
			// If the caller wanted a zero byte read, return immediately
			// without trying (but after acquiring the readLock).
			// Otherwise syscall.Read returns 0, nil which looks like
			// io.EOF.
			// TODO(bradfitz): make it wait for readability? (Issue 15735)
			return [0, null]
		}
		{
			let err = $.pointerValue<FD>(fd).pd.prepareRead($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [0, err]
			}
		}
		if ($.pointerValue<FD>(fd).IsStream && ($.len(p) > 1073741824)) {
			p = $.goSlice(p, undefined, 1073741824)
		}
		while (true) {
			let [n, err] = await ignoringEINTRIO(syscall.Read, $.pointerValue<FD>(fd).Sysfd, p)
			if (err != null) {
				n = 0
				if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
					{
						err = $.pointerValue<FD>(fd).pd.waitRead($.pointerValue<FD>(fd).isFile)
						if (err == null) {
							continue
						}
					}
				}
			}
			err = FD.prototype.eofError.call(fd, n, err)
			return [n, err]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async ReadDirent(buf: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.incref.call(fd)
			if (err != null) {
				return [0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.decref.call(fd) })
		while (true) {
			let [n, err] = await ignoringEINTRIO(syscall.ReadDirent, $.pointerValue<FD>(fd).Sysfd, buf)
			if (err != null) {
				n = 0
				if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
					{
						err = $.pointerValue<FD>(fd).pd.waitRead($.pointerValue<FD>(fd).isFile)
						if (err == null) {
							continue
						}
					}
				}
			}

			return [n, err]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async ReadFrom(p: $.Slice<number>): globalThis.Promise<[number, syscall.Sockaddr | null, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.readLock.call(fd)
			if (err != null) {
				return [0, null, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.readUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareRead($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [0, null, err]
			}
		}
		while (true) {
			let [n, sa, err] = syscall.Recvfrom($.pointerValue<FD>(fd).Sysfd, p, 0)
			if (err != null) {
				if ($.comparableEqual(err, syscall.EINTR)) {
					continue
				}
				n = 0
				if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
					{
						err = $.pointerValue<FD>(fd).pd.waitRead($.pointerValue<FD>(fd).isFile)
						if (err == null) {
							continue
						}
					}
				}
			}
			err = FD.prototype.eofError.call(fd, n, err)
			return [n, sa, err]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async ReadFromInet4(p: $.Slice<number>, _from: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null): globalThis.Promise<[number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.readLock.call(fd)
			if (err != null) {
				return [0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.readUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareRead($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [0, err]
			}
		}
		while (true) {
			let [n, err] = unix.RecvfromInet4($.pointerValue<FD>(fd).Sysfd, p, 0, _from)
			if (err != null) {
				if ($.comparableEqual(err, syscall.EINTR)) {
					continue
				}
				n = 0
				if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
					{
						err = $.pointerValue<FD>(fd).pd.waitRead($.pointerValue<FD>(fd).isFile)
						if (err == null) {
							continue
						}
					}
				}
			}
			err = FD.prototype.eofError.call(fd, n, err)
			return [n, err]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async ReadFromInet6(p: $.Slice<number>, _from: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null): globalThis.Promise<[number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.readLock.call(fd)
			if (err != null) {
				return [0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.readUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareRead($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [0, err]
			}
		}
		while (true) {
			let [n, err] = unix.RecvfromInet6($.pointerValue<FD>(fd).Sysfd, p, 0, _from)
			if (err != null) {
				if ($.comparableEqual(err, syscall.EINTR)) {
					continue
				}
				n = 0
				if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
					{
						err = $.pointerValue<FD>(fd).pd.waitRead($.pointerValue<FD>(fd).isFile)
						if (err == null) {
							continue
						}
					}
				}
			}
			err = FD.prototype.eofError.call(fd, n, err)
			return [n, err]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async ReadMsg(p: $.Slice<number>, oob: $.Slice<number>, flags: number): globalThis.Promise<[number, number, number, syscall.Sockaddr | null, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.readLock.call(fd)
			if (err != null) {
				return [0, 0, 0, null, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.readUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareRead($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [0, 0, 0, null, err]
			}
		}
		while (true) {
			let [n, oobn, sysflags, sa, err] = syscall.Recvmsg($.pointerValue<FD>(fd).Sysfd, p, oob, flags)
			if (err != null) {
				if ($.comparableEqual(err, syscall.EINTR)) {
					continue
				}
				// TODO(dfc) should n and oobn be set to 0
				if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
					{
						err = $.pointerValue<FD>(fd).pd.waitRead($.pointerValue<FD>(fd).isFile)
						if (err == null) {
							continue
						}
					}
				}
			}
			err = FD.prototype.eofError.call(fd, n, err)
			return [n, oobn, sysflags, sa, err]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async ReadMsgInet4(p: $.Slice<number>, oob: $.Slice<number>, flags: number, sa4: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null): globalThis.Promise<[number, number, number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.readLock.call(fd)
			if (err != null) {
				return [0, 0, 0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.readUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareRead($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [0, 0, 0, err]
			}
		}
		while (true) {
			let [n, oobn, sysflags, err] = unix.RecvmsgInet4($.pointerValue<FD>(fd).Sysfd, p, oob, flags, sa4)
			if (err != null) {
				if ($.comparableEqual(err, syscall.EINTR)) {
					continue
				}
				// TODO(dfc) should n and oobn be set to 0
				if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
					{
						err = $.pointerValue<FD>(fd).pd.waitRead($.pointerValue<FD>(fd).isFile)
						if (err == null) {
							continue
						}
					}
				}
			}
			err = FD.prototype.eofError.call(fd, n, err)
			return [n, oobn, sysflags, err]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async ReadMsgInet6(p: $.Slice<number>, oob: $.Slice<number>, flags: number, sa6: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null): globalThis.Promise<[number, number, number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.readLock.call(fd)
			if (err != null) {
				return [0, 0, 0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.readUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareRead($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [0, 0, 0, err]
			}
		}
		while (true) {
			let [n, oobn, sysflags, err] = unix.RecvmsgInet6($.pointerValue<FD>(fd).Sysfd, p, oob, flags, sa6)
			if (err != null) {
				if ($.comparableEqual(err, syscall.EINTR)) {
					continue
				}
				// TODO(dfc) should n and oobn be set to 0
				if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
					{
						err = $.pointerValue<FD>(fd).pd.waitRead($.pointerValue<FD>(fd).isFile)
						if (err == null) {
							continue
						}
					}
				}
			}
			err = FD.prototype.eofError.call(fd, n, err)
			return [n, oobn, sysflags, err]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Seek(offset: number, whence: number): globalThis.Promise<[number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.incref.call(fd)
			if (err != null) {
				return [$.int(0), err]
			}
		}
		__defer.defer(async () => { await FD.prototype.decref.call(fd) })
		const __goscriptReturn2 = syscall.Seek($.pointerValue<FD>(fd).Sysfd, $.int(offset), whence)
		return [$.int(__goscriptReturn2[0]), __goscriptReturn2[1]]
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async SetBlocking(): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.incref.call(fd)
			if (err != null) {
				return err
			}
		}
		__defer.defer(async () => { await FD.prototype.decref.call(fd) })
		// Atomic store so that concurrent calls to SetBlocking
		// do not cause a race condition. isBlocking only ever goes
		// from 0 to 1 so there is no real race here.
		atomic.StoreUint32($.pointerValue<FD>(fd)._fields.isBlocking, $.uint(1, 32))
		return syscall.SetNonblock($.pointerValue<FD>(fd).Sysfd, false)
	}

	public async SetDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		return await __goscript_fd_poll_js.setDeadlineImpl(fd, $.markAsStructValue($.cloneStructValue(t)), 114 + 119)
	}

	public async SetReadDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		return await __goscript_fd_poll_js.setDeadlineImpl(fd, $.markAsStructValue($.cloneStructValue(t)), 114)
	}

	public async SetWriteDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		return await __goscript_fd_poll_js.setDeadlineImpl(fd, $.markAsStructValue($.cloneStructValue(t)), 119)
	}

	public async Shutdown(how: number): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.incref.call(fd)
			if (err != null) {
				return err
			}
		}
		__defer.defer(async () => { await FD.prototype.decref.call(fd) })
		return syscall.Shutdown($.pointerValue<FD>(fd).Sysfd, how)
	}

	public WaitWrite(): $.GoError {
		const fd: FD | $.VarRef<FD> | null = this
		return $.pointerValue<FD>(fd).pd.waitWrite($.pointerValue<FD>(fd).isFile)
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.writeLock.call(fd)
			if (err != null) {
				return [0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.writeUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareWrite($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [0, err]
			}
		}
		let nn: number = 0
		while (true) {
			let max = $.len(p)
			if ($.pointerValue<FD>(fd).IsStream && ((max - nn) > 1073741824)) {
				max = nn + 1073741824
			}
			let [n, err] = await ignoringEINTRIO(syscall.Write, $.pointerValue<FD>(fd).Sysfd, $.goSlice(p, nn, max))
			if (n > 0) {
				if (n > (max - nn)) {
					// This can reportedly happen when using
					// some VPN software. Issue #61060.
					// If we don't check this we will panic
					// with slice bounds out of range.
					// Use a more informative panic.
					$.panic((("invalid return from write: got " + strconv.Itoa(n)) + " from a write of ") + strconv.Itoa(max - nn))
				}
				nn = nn + (n)
			}
			if (nn == $.len(p)) {
				return [nn, err]
			}
			if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
				{
					err = $.pointerValue<FD>(fd).pd.waitWrite($.pointerValue<FD>(fd).isFile)
					if (err == null) {
						continue
					}
				}
			}
			if (err != null) {
				return [nn, err]
			}
			if (n == 0) {
				return [nn, io.ErrUnexpectedEOF]
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async WriteMsg(p: $.Slice<number>, oob: $.Slice<number>, sa: syscall.Sockaddr | null): globalThis.Promise<[number, number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.writeLock.call(fd)
			if (err != null) {
				return [0, 0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.writeUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareWrite($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [0, 0, err]
			}
		}
		while (true) {
			let [n, err] = syscall.SendmsgN($.pointerValue<FD>(fd).Sysfd, p, oob, sa, 0)
			if ($.comparableEqual(err, syscall.EINTR)) {
				continue
			}
			if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
				{
					err = $.pointerValue<FD>(fd).pd.waitWrite($.pointerValue<FD>(fd).isFile)
					if (err == null) {
						continue
					}
				}
			}
			if (err != null) {
				return [n, 0, err]
			}
			return [n, $.len(oob), err]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async WriteMsgInet4(p: $.Slice<number>, oob: $.Slice<number>, sa: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null): globalThis.Promise<[number, number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.writeLock.call(fd)
			if (err != null) {
				return [0, 0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.writeUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareWrite($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [0, 0, err]
			}
		}
		while (true) {
			let [n, err] = unix.SendmsgNInet4($.pointerValue<FD>(fd).Sysfd, p, oob, sa, 0)
			if ($.comparableEqual(err, syscall.EINTR)) {
				continue
			}
			if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
				{
					err = $.pointerValue<FD>(fd).pd.waitWrite($.pointerValue<FD>(fd).isFile)
					if (err == null) {
						continue
					}
				}
			}
			if (err != null) {
				return [n, 0, err]
			}
			return [n, $.len(oob), err]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async WriteMsgInet6(p: $.Slice<number>, oob: $.Slice<number>, sa: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null): globalThis.Promise<[number, number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.writeLock.call(fd)
			if (err != null) {
				return [0, 0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.writeUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareWrite($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [0, 0, err]
			}
		}
		while (true) {
			let [n, err] = unix.SendmsgNInet6($.pointerValue<FD>(fd).Sysfd, p, oob, sa, 0)
			if ($.comparableEqual(err, syscall.EINTR)) {
				continue
			}
			if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
				{
					err = $.pointerValue<FD>(fd).pd.waitWrite($.pointerValue<FD>(fd).isFile)
					if (err == null) {
						continue
					}
				}
			}
			if (err != null) {
				return [n, 0, err]
			}
			return [n, $.len(oob), err]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async WriteOnce(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.writeLock.call(fd)
			if (err != null) {
				return [0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.writeUnlock.call(fd) })
		return await ignoringEINTRIO(syscall.Write, $.pointerValue<FD>(fd).Sysfd, p)
	}

	public async WriteTo(p: $.Slice<number>, sa: syscall.Sockaddr | null): globalThis.Promise<[number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.writeLock.call(fd)
			if (err != null) {
				return [0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.writeUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareWrite($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [0, err]
			}
		}
		while (true) {
			let err = syscall.Sendto($.pointerValue<FD>(fd).Sysfd, p, 0, sa)
			if ($.comparableEqual(err, syscall.EINTR)) {
				continue
			}
			if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
				{
					err = $.pointerValue<FD>(fd).pd.waitWrite($.pointerValue<FD>(fd).isFile)
					if (err == null) {
						continue
					}
				}
			}
			if (err != null) {
				return [0, err]
			}
			return [$.len(p), null]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async WriteToInet4(p: $.Slice<number>, sa: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null): globalThis.Promise<[number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.writeLock.call(fd)
			if (err != null) {
				return [0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.writeUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareWrite($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [0, err]
			}
		}
		while (true) {
			let err = unix.SendtoInet4($.pointerValue<FD>(fd).Sysfd, p, 0, sa)
			if ($.comparableEqual(err, syscall.EINTR)) {
				continue
			}
			if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
				{
					err = $.pointerValue<FD>(fd).pd.waitWrite($.pointerValue<FD>(fd).isFile)
					if (err == null) {
						continue
					}
				}
			}
			if (err != null) {
				return [0, err]
			}
			return [$.len(p), null]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async WriteToInet6(p: $.Slice<number>, sa: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null): globalThis.Promise<[number, $.GoError]> {
		const fd: FD | $.VarRef<FD> | null = this
		await using __defer = new $.AsyncDisposableStack()
		{
			let err = FD.prototype.writeLock.call(fd)
			if (err != null) {
				return [0, err]
			}
		}
		__defer.defer(async () => { await FD.prototype.writeUnlock.call(fd) })
		{
			let err = $.pointerValue<FD>(fd).pd.prepareWrite($.pointerValue<FD>(fd).isFile)
			if (err != null) {
				return [0, err]
			}
		}
		while (true) {
			let err = unix.SendtoInet6($.pointerValue<FD>(fd).Sysfd, p, 0, sa)
			if ($.comparableEqual(err, syscall.EINTR)) {
				continue
			}
			if (($.comparableEqual(err, syscall.EAGAIN)) && $.pointerValue<FD>(fd).pd.pollable()) {
				{
					err = $.pointerValue<FD>(fd).pd.waitWrite($.pointerValue<FD>(fd).isFile)
					if (err == null) {
						continue
					}
				}
			}
			if (err != null) {
				return [0, err]
			}
			return [$.len(p), null]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public closing(): boolean {
		const fd: FD | $.VarRef<FD> | null = this
		return $.uint(($.uint64And(atomic.LoadUint64($.pointerValue<FD>(fd).fdmu._fields.state), 1)), 64) != $.uint(0, 64)
	}

	public async decref(): globalThis.Promise<$.GoError> {
		const fd: FD | $.VarRef<FD> | null = this
		if ($.pointerValue<FD>(fd).fdmu.decref()) {
			return await FD.prototype.destroy.call(fd)
		}
		return null
	}

	public async destroy(): globalThis.Promise<$.GoError> {
		let fd: FD | $.VarRef<FD> | null = this
		// Poller may want to unregister fd in readiness notification mechanism,
		// so this must be executed before CloseFunc.
		$.pointerValue<FD>(fd).pd.close()

		let err = await $.pointerValue<FD>(fd).SysFile.destroy($.pointerValue<FD>(fd).Sysfd)

		$.pointerValue<FD>(fd).Sysfd = -1
		__goscript_fd_mutex.runtime_Semrelease($.pointerValue<FD>(fd)._fields.csema)
		return err
	}

	public eofError(n: number, err: $.GoError): $.GoError {
		const fd: FD | $.VarRef<FD> | null = this
		if (((n == 0) && (err == null)) && $.pointerValue<FD>(fd).ZeroReadIsEOF) {
			return io.EOF
		}
		return err
	}

	public incref(): $.GoError {
		const fd: FD | $.VarRef<FD> | null = this
		if (!$.pointerValue<FD>(fd).fdmu.incref()) {
			return __goscript_fd.errClosing($.pointerValue<FD>(fd).isFile)
		}
		return null
	}

	public readLock(): $.GoError {
		const fd: FD | $.VarRef<FD> | null = this
		if (!$.pointerValue<FD>(fd).fdmu.rwlock(true)) {
			return __goscript_fd.errClosing($.pointerValue<FD>(fd).isFile)
		}
		return null
	}

	public async readUnlock(): globalThis.Promise<void> {
		const fd: FD | $.VarRef<FD> | null = this
		if ($.pointerValue<FD>(fd).fdmu.rwunlock(true)) {
			await FD.prototype.destroy.call(fd)
		}
	}

	public readWriteLock(): $.GoError {
		const fd: FD | $.VarRef<FD> | null = this
		if (!$.pointerValue<FD>(fd).fdmu.rwlock(true) || !$.pointerValue<FD>(fd).fdmu.rwlock(false)) {
			return __goscript_fd.errClosing($.pointerValue<FD>(fd).isFile)
		}
		return null
	}

	public async readWriteUnlock(): globalThis.Promise<void> {
		const fd: FD | $.VarRef<FD> | null = this
		$.pointerValue<FD>(fd).fdmu.rwunlock(true)
		if ($.pointerValue<FD>(fd).fdmu.rwunlock(false)) {
			await FD.prototype.destroy.call(fd)
		}
	}

	public writeLock(): $.GoError {
		const fd: FD | $.VarRef<FD> | null = this
		if (!$.pointerValue<FD>(fd).fdmu.rwlock(false)) {
			return __goscript_fd.errClosing($.pointerValue<FD>(fd).isFile)
		}
		return null
	}

	public async writeUnlock(): globalThis.Promise<void> {
		const fd: FD | $.VarRef<FD> | null = this
		if ($.pointerValue<FD>(fd).fdmu.rwunlock(false)) {
			await FD.prototype.destroy.call(fd)
		}
	}

	public init(): any {
		return $.pointerValue<__goscript_fd_unixjs.SysFile>(this.SysFile).init()
	}

	static __typeInfo = $.registerStructType(
		"poll.FD",
		() => new FD(),
		[{ name: "Accept", args: [], returns: [] }, { name: "Close", args: [], returns: [] }, { name: "Dup", args: [], returns: [] }, { name: "Fchdir", args: [], returns: [] }, { name: "Fchmod", args: [], returns: [] }, { name: "Fchown", args: [], returns: [] }, { name: "Fstat", args: [], returns: [] }, { name: "Fsync", args: [], returns: [] }, { name: "Ftruncate", args: [], returns: [] }, { name: "Init", args: [], returns: [] }, { name: "Pread", args: [], returns: [] }, { name: "Pwrite", args: [], returns: [] }, { name: "RawControl", args: [], returns: [] }, { name: "RawRead", args: [], returns: [] }, { name: "RawWrite", args: [], returns: [] }, { name: "Read", args: [], returns: [] }, { name: "ReadDirent", args: [], returns: [] }, { name: "ReadFrom", args: [], returns: [] }, { name: "ReadFromInet4", args: [], returns: [] }, { name: "ReadFromInet6", args: [], returns: [] }, { name: "ReadMsg", args: [], returns: [] }, { name: "ReadMsgInet4", args: [], returns: [] }, { name: "ReadMsgInet6", args: [], returns: [] }, { name: "Seek", args: [], returns: [] }, { name: "SetBlocking", args: [], returns: [] }, { name: "SetDeadline", args: [], returns: [] }, { name: "SetReadDeadline", args: [], returns: [] }, { name: "SetWriteDeadline", args: [], returns: [] }, { name: "Shutdown", args: [], returns: [] }, { name: "WaitWrite", args: [], returns: [] }, { name: "Write", args: [], returns: [] }, { name: "WriteMsg", args: [], returns: [] }, { name: "WriteMsgInet4", args: [], returns: [] }, { name: "WriteMsgInet6", args: [], returns: [] }, { name: "WriteOnce", args: [], returns: [] }, { name: "WriteTo", args: [], returns: [] }, { name: "WriteToInet4", args: [], returns: [] }, { name: "WriteToInet6", args: [], returns: [] }, { name: "closing", args: [], returns: [] }, { name: "decref", args: [], returns: [] }, { name: "destroy", args: [], returns: [] }, { name: "eofError", args: [], returns: [] }, { name: "incref", args: [], returns: [] }, { name: "readLock", args: [], returns: [] }, { name: "readUnlock", args: [], returns: [] }, { name: "readWriteLock", args: [], returns: [] }, { name: "readWriteUnlock", args: [], returns: [] }, { name: "writeLock", args: [], returns: [] }, { name: "writeUnlock", args: [], returns: [] }, { name: "init", args: [], returns: [] }],
		FD,
		{"fdmu": "poll.fdMutex", "Sysfd": { kind: $.TypeKind.Basic, name: "int" }, "SysFile": "poll.SysFile", "pd": "poll.pollDesc", "csema": { kind: $.TypeKind.Basic, name: "uint32" }, "isBlocking": { kind: $.TypeKind.Basic, name: "uint32" }, "IsStream": { kind: $.TypeKind.Basic, name: "bool" }, "ZeroReadIsEOF": { kind: $.TypeKind.Basic, name: "bool" }, "isFile": { kind: $.TypeKind.Basic, name: "bool" }}
	)
}

export const maxRW: number = 1073741824

export let dupCloexecUnsupported: $.VarRef<atomic.Bool> = $.varRef($.markAsStructValue(new atomic.Bool()))

export function __goscript_set_dupCloexecUnsupported(__goscriptValue: atomic.Bool): void {
	dupCloexecUnsupported.value = __goscriptValue
}

export async function DupCloseOnExec(fd: number): globalThis.Promise<[number, string, $.GoError]> {
	if (((syscall.F_DUPFD_CLOEXEC as number) != 0) && !dupCloexecUnsupported.value.Load()) {
		let [r0, err] = unix.Fcntl(fd, syscall.F_DUPFD_CLOEXEC, 0)
		if (err == null) {
			return [r0, "", null]
		}
		{
			let __goscriptSwitch1 = err
			switch (true) {
				case $.comparableEqual(__goscriptSwitch1, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })):
				case $.comparableEqual(__goscriptSwitch1, $.namedValueInterfaceValue<$.GoError>(syscall.ENOSYS, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })):
				{
					dupCloexecUnsupported.value.Store(true)
					break
				}
				default:
				{
					return [-1, "fcntl", err]
					break
				}
			}
		}
	}
	return await __goscript_fd_unixjs.dupCloseOnExecOld(fd)
}

export async function ignoringEINTRIO(fn: ((fd: number, p: $.Slice<number>) => [number, $.GoError] | globalThis.Promise<[number, $.GoError]>) | null, fd: number, p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
	while (true) {
		let [n, err] = await fn!(fd, p)
		if (!$.comparableEqual(err, syscall.EINTR)) {
			return [n, err]
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

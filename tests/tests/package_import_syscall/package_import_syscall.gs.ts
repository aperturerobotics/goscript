// Generated file based on package_import_syscall.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as netip from "@goscript/net/netip/index.js"

import * as syscall from "@goscript/syscall/index.js"

import type * as sync from "@goscript/sync/index.js"
import "@goscript/fmt/index.js"
import "@goscript/net/netip/index.js"
import "@goscript/syscall/index.js"

export async function main(): globalThis.Promise<void> {
	syscall.CloseOnExec(1)
	{
		let err = syscall.SetNonblock(1, true)
		if (err != null) {
			fmt.Println("set true:", (err as any))
			return
		}
	}
	{
		let err = syscall.SetNonblock(1, false)
		if (err != null) {
			fmt.Println("set false:", (err as any))
			return
		}
	}
	if ((syscall.F_DUPFD_CLOEXEC as number) != 0) {
		fmt.Println("cloexec supported")
	}
	if (false) {
		let st: $.VarRef<syscall.Stat_t> = $.varRef($.markAsStructValue(new syscall.Stat_t()))
		let buf: $.Slice<number> = null as $.Slice<number>
		let iovecs: $.Slice<syscall.Iovec> = null as $.Slice<syscall.Iovec>
		syscall.Accept(-1)
		syscall.Close(-1)
		syscall.Dup(-1)
		syscall.Fchdir(-1)
		syscall.Fchmod(-1, $.uint(0, 32))
		syscall.Fchown(-1, 0, 0)
		syscall.Fstat(-1, st)
		syscall.Fsync(-1)
		syscall.Ftruncate(-1, $.int(0))
		syscall.Pread(-1, buf, $.int(0))
		syscall.Pwrite(-1, buf, $.int(0))
		syscall.Read(-1, buf)
		syscall.ReadDirent(-1, buf)
		syscall.Recvfrom(-1, buf, 0)
		syscall.Recvmsg(-1, buf, buf, 0)
		syscall.Seek(-1, $.int(0), 0)
		syscall.SendmsgN(-1, buf, buf, null, 0)
		syscall.Sendto(-1, buf, 0, null)
		syscall.Shutdown(-1, 0)
		syscall.Write(-1, buf)
		syscall.F_DUPFD_CLOEXEC
		$.pointerValue<sync.RWMutex>(syscall.ForkLock)
		iovecs
	}
	let sa4: syscall.SockaddrInet4 = $.markAsStructValue(new syscall.SockaddrInet4())
	let addr4 = $.markAsStructValue($.cloneStructValue(netip.AddrFrom4(sa4.Addr)))
	sa4.Addr = $.markAsStructValue($.cloneStructValue(addr4)).As4()

	let sa6: syscall.SockaddrInet6 = $.markAsStructValue(new syscall.SockaddrInet6())
	let addr6 = $.markAsStructValue($.cloneStructValue(netip.AddrFrom16(sa6.Addr)))
	sa6.Addr = $.markAsStructValue($.cloneStructValue(addr6)).As16()

	fmt.Println("set nonblock ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}

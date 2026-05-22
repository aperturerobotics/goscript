// Generated file based on package_import_syscall.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as sync from "@goscript/sync/index.js"

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
	if (syscall.F_DUPFD_CLOEXEC != 0) {
		fmt.Println("cloexec supported")
	}
	if (false) {
		let st: $.VarRef<syscall.Stat_t> = $.varRef($.markAsStructValue(new syscall.Stat_t()))
		let buf: $.Slice<number> = null
		let iovecs: $.Slice<syscall.Iovec> = null
		syscall.Accept(-1)
		syscall.Close(-1)
		syscall.Dup(-1)
		syscall.Fchdir(-1)
		syscall.Fchmod(-1, 0)
		syscall.Fchown(-1, 0, 0)
		syscall.Fstat(-1, st)
		syscall.Fsync(-1)
		syscall.Ftruncate(-1, 0)
		syscall.Pread(-1, buf, 0)
		syscall.Pwrite(-1, buf, 0)
		syscall.Read(-1, buf)
		syscall.ReadDirent(-1, buf)
		syscall.Recvfrom(-1, buf, 0)
		syscall.Recvmsg(-1, buf, buf, 0)
		syscall.Seek(-1, 0, 0)
		syscall.SendmsgN(-1, buf, buf, null, 0)
		syscall.Sendto(-1, buf, 0, null)
		syscall.Shutdown(-1, 0)
		syscall.Write(-1, buf)
		syscall.F_DUPFD_CLOEXEC
		syscall.ForkLock
		iovecs
	}
	fmt.Println("set nonblock ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}

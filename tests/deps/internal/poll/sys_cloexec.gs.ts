// Generated file based on sys_cloexec.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as __goscript_hook_unix from "./hook_unix.gs.ts"
import "@goscript/syscall/index.js"
import "./hook_unix.gs.ts"

export async function accept(s: number): globalThis.Promise<[number, syscall.Sockaddr | null, string, $.GoError]> {
	// See ../syscall/exec_unix.go for description of ForkLock.
	// It is probably okay to hold the lock across syscall.Accept
	// because we have put fd.sysfd into non-blocking mode.
	// However, a call to the File method will put it back into
	// blocking mode. We can't take that risk, so no use of ForkLock here.
	let [ns, sa, err] = await __goscript_hook_unix.AcceptFunc!(s)
	if (err == null) {
		syscall.CloseOnExec(ns)
	}
	if (err != null) {
		return [-1, null, "accept", err]
	}
	{
		err = syscall.SetNonblock(ns, true)
		if (err != null) {
			await __goscript_hook_unix.CloseFunc!(ns)
			return [-1, null, "setnonblock", err]
		}
	}
	return [ns, sa, "", null]
}

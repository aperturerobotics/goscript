// Generated file based on error_unix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syscall from "@goscript/syscall/index.js"
import "@goscript/syscall/index.js"

export function isConnError(err: $.GoError): boolean {
	{
		let [se, ok] = $.typeAssertTuple<syscall.Errno>(err, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		if (ok) {
			return (se == syscall.ECONNRESET) || (se == syscall.ECONNABORTED)
		}
	}
	return false
}

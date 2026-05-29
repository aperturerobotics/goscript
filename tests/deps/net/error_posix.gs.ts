// Generated file based on error_posix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"

import * as syscall from "@goscript/syscall/index.js"
import "@goscript/os/index.js"
import "@goscript/syscall/index.js"

export function wrapSyscallError(name: string, err: $.GoError): $.GoError {
	{
		let [, ok] = $.typeAssertTuple<syscall.Errno>(err, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		if (ok) {
			err = os.NewSyscallError(name, $.pointerValueOrNil(err)!)
		}
	}
	return err
}

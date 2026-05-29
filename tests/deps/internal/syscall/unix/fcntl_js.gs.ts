// Generated file based on fcntl_js.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syscall from "@goscript/syscall/index.js"
import "@goscript/syscall/index.js"

export function Fcntl(fd: number, cmd: number, arg: number): [number, $.GoError] {
	return [0, $.namedValueInterfaceValue<$.GoError>(syscall.ENOSYS, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
}

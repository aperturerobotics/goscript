// Generated file based on sendfile.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syscall from "@goscript/syscall/index.js"

import type * as time from "@goscript/time/index.js"

import * as __goscript_fd_fsync_posix from "./fd_fsync_posix.gs.ts"

import * as __goscript_fd_mutex from "./fd_mutex.gs.ts"

import * as __goscript_fd_poll_js from "./fd_poll_js.gs.ts"

import * as __goscript_fd_posix from "./fd_posix.gs.ts"

import * as __goscript_fd_unix from "./fd_unix.gs.ts"

import * as __goscript_fd_unixjs from "./fd_unixjs.gs.ts"
import "@goscript/syscall/index.js"
import "./fd_fsync_posix.gs.ts"
import "./fd_mutex.gs.ts"
import "./fd_poll_js.gs.ts"
import "./fd_posix.gs.ts"
import "./fd_unix.gs.ts"
import "./fd_unixjs.gs.ts"

export var TestHookDidSendFile: ((dstFD: __goscript_fd_unix.FD | $.VarRef<__goscript_fd_unix.FD> | null, src: number, written: number, err: $.GoError, handled: boolean) => void) | null

export function __goscript_init_TestHookDidSendFile(): void {
	if (((TestHookDidSendFile) as any) === undefined) {
		TestHookDidSendFile = $.functionValue((dstFD: __goscript_fd_unix.FD | $.VarRef<__goscript_fd_unix.FD> | null, src: number, written: number, err: $.GoError, handled: boolean): void => {
}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "poll.FD" }, { kind: $.TypeKind.Basic, name: "uintptr" }, { kind: $.TypeKind.Basic, name: "int64" }, "error", { kind: $.TypeKind.Basic, name: "bool" }], results: [] } as $.FunctionTypeInfo))
	}
}

export function __goscript_get_TestHookDidSendFile(): ((dstFD: __goscript_fd_unix.FD | $.VarRef<__goscript_fd_unix.FD> | null, src: number, written: number, err: $.GoError, handled: boolean) => void) | null {
	if (((TestHookDidSendFile) as any) === undefined) {
		__goscript_init_TestHookDidSendFile()
	}
	return TestHookDidSendFile
}

export function __goscript_set_TestHookDidSendFile(__goscriptValue: ((dstFD: __goscript_fd_unix.FD | $.VarRef<__goscript_fd_unix.FD> | null, src: number, written: number, err: $.GoError, handled: boolean) => void) | null): void {
	TestHookDidSendFile = __goscriptValue
}

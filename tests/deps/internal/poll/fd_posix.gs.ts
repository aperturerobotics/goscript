// Generated file based on fd_posix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as syscall from "@goscript/syscall/index.js"

import type * as time from "@goscript/time/index.js"

import * as __goscript_fd_fsync_posix from "./fd_fsync_posix.gs.ts"

import * as __goscript_fd_mutex from "./fd_mutex.gs.ts"

import * as __goscript_fd_poll_js from "./fd_poll_js.gs.ts"

import * as __goscript_fd_unix from "./fd_unix.gs.ts"

import * as __goscript_fd_unixjs from "./fd_unixjs.gs.ts"
import "@goscript/io/index.js"
import "@goscript/syscall/index.js"
import "./fd_fsync_posix.gs.ts"
import "./fd_mutex.gs.ts"
import "./fd_poll_js.gs.ts"
import "./fd_unix.gs.ts"
import "./fd_unixjs.gs.ts"

export async function ignoringEINTR(fn: (() => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	while (true) {
		let err = await fn!()
		if (!$.comparableEqual(err, syscall.EINTR)) {
			return err
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function ignoringEINTR2(__typeArgs: $.GenericTypeArgs | undefined, fn: (() => [any, $.GoError] | globalThis.Promise<[any, $.GoError]>) | null): globalThis.Promise<[any, $.GoError]> {
	while (true) {
		let [v, err] = await fn!()
		if (!$.comparableEqual(err, syscall.EINTR)) {
			return [v, err]
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

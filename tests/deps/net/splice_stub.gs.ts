// Generated file based on splice_stub.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import type * as os from "@goscript/os/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import type * as syscall from "@goscript/syscall/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_fd_fake from "./fd_fake.gs.ts"

import * as __goscript_fd_js from "./fd_js.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_net_fake from "./net_fake.gs.ts"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"
import "@goscript/io/index.js"
import "@goscript/internal/poll/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "./fd_fake.gs.ts"
import "./fd_js.gs.ts"
import "./net.gs.ts"
import "./net_fake.gs.ts"
import "./sockaddr_posix.gs.ts"

export function spliceFrom(_p0: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, _p1: io.Reader | null): [number, $.GoError, boolean] {
	return [$.int(0), null, false]
}

export function spliceTo(_p0: io.Writer | null, _p1: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null): [number, $.GoError, boolean] {
	return [$.int(0), null, false]
}

// Generated file based on sock_stub.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syscall from "@goscript/syscall/index.js"
import "@goscript/syscall/index.js"

export function maxListenerBacklog(): number {
	// TODO: Implement this
	// NOTE: Never return a number bigger than 1<<16 - 1. See issue 5030.
	return syscall.SOMAXCONN
}

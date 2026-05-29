// Generated file based on hook_unix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syscall from "@goscript/syscall/index.js"
import "@goscript/syscall/index.js"

export let CloseFunc: ((_p0: number) => $.GoError | globalThis.Promise<$.GoError>) | null = syscall.Close

export function __goscript_set_CloseFunc(__goscriptValue: ((_p0: number) => $.GoError | globalThis.Promise<$.GoError>) | null): void {
	CloseFunc = __goscriptValue
}

export let AcceptFunc: ((_p0: number) => [number, syscall.Sockaddr | null, $.GoError] | globalThis.Promise<[number, syscall.Sockaddr | null, $.GoError]>) | null = syscall.Accept

export function __goscript_set_AcceptFunc(__goscriptValue: ((_p0: number) => [number, syscall.Sockaddr | null, $.GoError] | globalThis.Promise<[number, syscall.Sockaddr | null, $.GoError]>) | null): void {
	AcceptFunc = __goscriptValue
}

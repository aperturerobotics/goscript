// Generated file based on hook_unix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syscall from "@goscript/syscall/index.js"
import "@goscript/syscall/index.js"

export let testHookCanceledDial: (() => void) | null = $.functionValue((): void => {
}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))

export function __goscript_set_testHookCanceledDial(__goscriptValue: (() => void) | null): void {
	testHookCanceledDial = __goscriptValue
}

export let hostsFilePath: string = "/etc/hosts"

export function __goscript_set_hostsFilePath(__goscriptValue: string): void {
	hostsFilePath = __goscriptValue
}

export let socketFunc: ((_p0: number, _p1: number, _p2: number) => [number, $.GoError] | globalThis.Promise<[number, $.GoError]>) | null = syscall.Socket

export function __goscript_set_socketFunc(__goscriptValue: ((_p0: number, _p1: number, _p2: number) => [number, $.GoError] | globalThis.Promise<[number, $.GoError]>) | null): void {
	socketFunc = __goscriptValue
}

export let connectFunc: ((_p0: number, _p1: syscall.Sockaddr | null) => $.GoError | globalThis.Promise<$.GoError>) | null = syscall.Connect

export function __goscript_set_connectFunc(__goscriptValue: ((_p0: number, _p1: syscall.Sockaddr | null) => $.GoError | globalThis.Promise<$.GoError>) | null): void {
	connectFunc = __goscriptValue
}

export let listenFunc: ((_p0: number, _p1: number) => $.GoError | globalThis.Promise<$.GoError>) | null = syscall.Listen

export function __goscript_set_listenFunc(__goscriptValue: ((_p0: number, _p1: number) => $.GoError | globalThis.Promise<$.GoError>) | null): void {
	listenFunc = __goscriptValue
}

export let getsockoptIntFunc: ((_p0: number, _p1: number, _p2: number) => [number, $.GoError] | globalThis.Promise<[number, $.GoError]>) | null = syscall.GetsockoptInt

export function __goscript_set_getsockoptIntFunc(__goscriptValue: ((_p0: number, _p1: number, _p2: number) => [number, $.GoError] | globalThis.Promise<[number, $.GoError]>) | null): void {
	getsockoptIntFunc = __goscriptValue
}

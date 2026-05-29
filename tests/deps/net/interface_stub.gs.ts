// Generated file based on interface_stub.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript__interface from "./interface.gs.ts"

import * as __goscript_mac from "./mac.gs.ts"

import type * as __goscript_net from "./net.gs.ts"
import "./interface.gs.ts"
import "./mac.gs.ts"

export function interfaceTable(ifindex: number): [$.Slice<__goscript__interface.Interface>, $.GoError] {
	return [null, null]
}

export function interfaceAddrTable(ifi: __goscript__interface.Interface | $.VarRef<__goscript__interface.Interface> | null): [$.Slice<__goscript_net.Addr | null>, $.GoError] {
	return [null, null]
}

export function interfaceMulticastAddrTable(ifi: __goscript__interface.Interface | $.VarRef<__goscript__interface.Interface> | null): [$.Slice<__goscript_net.Addr | null>, $.GoError] {
	return [null, null]
}

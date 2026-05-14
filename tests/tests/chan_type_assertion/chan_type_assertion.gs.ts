// Generated file based on chan_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let ch1 = $.makeChannel<number>(0, 0, "both")
	let ch2 = $.makeChannel<string>(0, "", "send")
	let ch3 = $.makeChannel<number>(0, 0, "receive")
	let ch4 = $.makeChannel<Record<string, unknown>>(0, null, "both")
	let i: any = ch1
	{
		let [, ok] = $.typeAssertTuple<$.Channel<number> | null>(i, { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "int" } })
		if (ok) {
			$.println("i is chan int: ok")
		} else {
			$.println("i is chan int: failed")
		}
	}
	let s: any = ch2
	{
		let [, ok] = $.typeAssertTuple<$.Channel<string> | null>(s, { kind: $.TypeKind.Channel, direction: "send", elemType: { kind: $.TypeKind.Basic, name: "string" } })
		if (ok) {
			$.println("s is chan<- string: ok")
		} else {
			$.println("s is chan<- string: failed")
		}
	}
	let r: any = ch3
	{
		let [, ok] = $.typeAssertTuple<$.Channel<number> | null>(r, { kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Basic, name: "int" } })
		if (ok) {
			$.println("r is <-chan float64: ok")
		} else {
			$.println("r is <-chan float64: failed")
		}
	}
	let e: any = ch4
	{
		let [, ok] = $.typeAssertTuple<$.Channel<Record<string, unknown>> | null>(e, { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } })
		if (ok) {
			$.println("e is chan struct{}: ok")
		} else {
			$.println("e is chan struct{}: failed")
		}
	}
	{
		let [, ok] = $.typeAssertTuple<$.Channel<string> | null>(i, { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "string" } })
		if (ok) {
			$.println("i is chan string: incorrect")
		} else {
			$.println("i is chan string: correctly failed")
		}
	}
	{
		let [, ok] = $.typeAssertTuple<$.Channel<number> | null>(i, { kind: $.TypeKind.Channel, direction: "send", elemType: { kind: $.TypeKind.Basic, name: "int" } })
		if (ok) {
			$.println("i is chan<- int: incorrect")
		} else {
			$.println("i is chan<- int: correctly failed")
		}
	}
	{
		let [, ok] = $.typeAssertTuple<$.Channel<number> | null>(i, { kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Basic, name: "int" } })
		if (ok) {
			$.println("i is <-chan int: incorrect")
		} else {
			$.println("i is <-chan int: correctly failed")
		}
	}
	{
		let [, ok] = $.typeAssertTuple<$.Channel<number> | null>(i, { kind: $.TypeKind.Channel, direction: "send", elemType: { kind: $.TypeKind.Basic, name: "int" } })
		if (ok) {
			$.println("bidirectional can be used as send-only: ok")
		} else {
			$.println("bidirectional can be used as send-only: failed")
		}
	}
	{
		let [, ok] = $.typeAssertTuple<$.Channel<number> | null>(i, { kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Basic, name: "int" } })
		if (ok) {
			$.println("bidirectional can be used as receive-only: ok")
		} else {
			$.println("bidirectional can be used as receive-only: failed")
		}
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

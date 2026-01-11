// Generated file based on chan_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let ch1 = $.makeChannel<number>(0, 0, 'both') // bidirectional int channel
	let ch2 = $.makeChannel<string>(0, "", 'send') // send-only string channel
	let ch3 = $.makeChannel<number>(0, 0, 'receive') // receive-only float64 channel
	let ch4 = $.makeChannel<{  }>(0, {}, 'both') // bidirectional struct{} channel

	let i: null | any = ch1
	{
		let { ok: ok } = $.typeAssert<$.Channel<number> | null>(i, {kind: $.TypeKind.Channel, elemType: 'number', direction: 'both'})
		if (ok) {
			$.println("i is chan int: ok")
		} else {
			$.println("i is chan int: failed")
		}
	}

	let s: null | any = ch2
	{
		let { ok: ok } = $.typeAssert<$.Channel<string> | null>(s, {kind: $.TypeKind.Channel, elemType: 'string', direction: 'send'})
		if (ok) {
			$.println("s is chan<- string: ok")
		} else {
			$.println("s is chan<- string: failed")
		}
	}

	let r: null | any = ch3
	{
		let { ok: ok } = $.typeAssert<$.Channel<number> | null>(r, {kind: $.TypeKind.Channel, elemType: 'number', direction: 'receive'})
		if (ok) {
			$.println("r is <-chan float64: ok")
		} else {
			$.println("r is <-chan float64: failed")
		}
	}

	let e: null | any = ch4
	{
		let { ok: ok } = $.typeAssert<$.Channel<{  }> | null>(e, {kind: $.TypeKind.Channel, elemType: {kind: $.TypeKind.Struct, fields: {}, methods: []}, direction: 'both'})
		if (ok) {
			$.println("e is chan struct{}: ok")
		} else {
			$.println("e is chan struct{}: failed")
		}
	}

	{
		let { ok: ok } = $.typeAssert<$.Channel<string> | null>(i, {kind: $.TypeKind.Channel, elemType: 'string', direction: 'both'})
		if (ok) {
			$.println("i is chan string: incorrect")
		} else {
			$.println("i is chan string: correctly failed")
		}
	}

	{
		let { ok: ok } = $.typeAssert<$.Channel<number> | null>(i, {kind: $.TypeKind.Channel, elemType: 'number', direction: 'send'})
		if (ok) {
			$.println("i is chan<- int: incorrect")
		} else {
			$.println("i is chan<- int: correctly failed")
		}
	}

	{
		let { ok: ok } = $.typeAssert<$.Channel<number> | null>(i, {kind: $.TypeKind.Channel, elemType: 'number', direction: 'receive'})
		if (ok) {
			$.println("i is <-chan int: incorrect")
		} else {
			$.println("i is <-chan int: correctly failed")
		}
	}

	{
		let { ok: ok } = $.typeAssert<$.Channel<number> | null>(i, {kind: $.TypeKind.Channel, elemType: 'number', direction: 'send'})
		if (ok) {
			$.println("bidirectional can be used as send-only: ok")
		} else {
			$.println("bidirectional can be used as send-only: failed")
		}
	}

	{
		let { ok: ok } = $.typeAssert<$.Channel<number> | null>(i, {kind: $.TypeKind.Channel, elemType: 'number', direction: 'receive'})
		if (ok) {
			$.println("bidirectional can be used as receive-only: ok")
		} else {
			$.println("bidirectional can be used as receive-only: failed")
		}
	}
}


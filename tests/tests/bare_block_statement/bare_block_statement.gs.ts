// Generated file based on bare_block_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function scopedTotal(seed: number): number {
	let total = seed
	{
		total += 1
		let inner = total * 2
		$.println("inner:", inner)
	}
	{
		total += 3
	}
	return total
}

export function shadowedValue(): number {
	let value = 7
	{
		let __goscriptShadow0 = 11
		$.println("block value:", __goscriptShadow0)
	}
	return value
}

export function emptyBodies(limit: number): number {
	let count = 0
	if (limit > 0) {
	}
	for (; count < limit; count++) {
	}
	return count
}

export async function main(): globalThis.Promise<void> {
	$.println("scoped total:", scopedTotal(1))
	$.println("outer value:", shadowedValue())
	$.println("empty bodies:", emptyBodies(3))
}


if ($.isMainScript(import.meta)) {
	await main()
}

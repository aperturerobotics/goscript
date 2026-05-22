// Generated file based on named_array_value_receiver_pointer_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type flags = number[]

export function flags_set(f: $.VarRef<flags> | null, idx: number): void {
	$.pointerValue<number[]>(f)[idx] = idx + 1
}

export function flags_values(__goscriptReceiver0: flags): [number, number] {
	let f: $.VarRef<flags> = $.varRef(__goscriptReceiver0)
	flags_set(f, 0)
	flags_set(f, 1)
	return [f.value[0], f.value[1] + 1]
}

export async function main(): globalThis.Promise<void> {
	let [left, right] = flags_values([0, 0])
	$.println(left)
	$.println(right)
}

if ($.isMainScript(import.meta)) {
	await main()
}

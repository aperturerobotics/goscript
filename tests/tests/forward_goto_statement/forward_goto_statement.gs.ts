// Generated file based on forward_goto_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function skipToLabel(v: number): number {
	let total = 0
	done: {
		if (v < 0) {
			break done
		}
		total += 1
	}
	total += 10
	return total
}

export function skipLoop(v: number): number {
	let total = 0
	afterLoop: {
		if (v == 0) {
			break afterLoop
		}
		for (let i = 0; i < 3; i++) {
			total += i
		}
	}
	return total + 1
}

export async function main(): Promise<void> {
	$.println("skip negative:", skipToLabel(-1))
	$.println("skip positive:", skipToLabel(1))
	$.println("loop skipped:", skipLoop(0))
	$.println("loop included:", skipLoop(2))
}


if ($.isMainScript(import.meta)) {
	await main()
}

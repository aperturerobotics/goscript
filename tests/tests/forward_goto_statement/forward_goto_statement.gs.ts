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

export function mixedForwardBackward(limit: number): number {
	let total = 0
	__goscriptLoop328: while (total < limit) {
		total++
		let __goscriptSkip376 = true
		checkAndLoop: while (true) {
			if (!__goscriptSkip376) {
				if (total >= limit) {
					continue __goscriptLoop328
				}
			}
			__goscriptSkip376 = false

			skipVisit: {
				switch (total % 3) {
					case 0:
					{
						total += 2
						continue checkAndLoop
						break
					}
					case 1:
					{
						total += 3
						continue checkAndLoop
						break
					}
				}
			}
			break
		}
		break __goscriptLoop328
	}
	return total
}

export async function main(): Promise<void> {
	$.println("skip negative:", skipToLabel(-1))
	$.println("skip positive:", skipToLabel(1))
	$.println("loop skipped:", skipLoop(0))
	$.println("loop included:", skipLoop(2))
	$.println("mixed small:", mixedForwardBackward(1))
	$.println("mixed large:", mixedForwardBackward(5))
}


if ($.isMainScript(import.meta)) {
	await main()
}

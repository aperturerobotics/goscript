// Generated file based on forward_goto_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function skipToLabel(v: number): number {
	let total = 0
	done: {
		if (v < 0) {
			break done
		}
		total = total + (1)
	}
	total = total + (10)
	return total
}

export function skipLoop(v: number): number {
	let total = 0
	afterLoop: {
		if (v == 0) {
			break afterLoop
		}
		for (let i = 0; i < 3; i++) {
			total = total + (i)
		}
	}
	return total + 1
}

export function mixedForwardBackward(limit: number): number {
	let total = 0
	__goscriptLoop0: while (total < limit) {
		total++
		let __goscriptGotoState0 = "__entry"
		__goscriptGotoLoop0: while (true) {
			switch (__goscriptGotoState0) {
				case "__entry":
				{
					__goscriptGotoState0 = "skipVisit"
					continue __goscriptGotoLoop0
					__goscriptGotoState0 = "checkAndLoop"
					continue __goscriptGotoLoop0
					break
				}
				case "checkAndLoop":
				{
					if (total >= limit) {
						continue __goscriptLoop0
					}
					__goscriptGotoState0 = "skipVisit"
					continue __goscriptGotoLoop0
					break
				}
				case "skipVisit":
				{
					switch (total % 3) {
						case 0:
						{
							total = total + (2)
							__goscriptGotoState0 = "checkAndLoop"
							continue __goscriptGotoLoop0
							break
						}
						case 1:
						{
							total = total + (3)
							__goscriptGotoState0 = "checkAndLoop"
							continue __goscriptGotoLoop0
							break
						}
					}
					break __goscriptGotoLoop0
					break
				}
			}
			break
		}
		break __goscriptLoop0
	}
	return total
}

export function labelBeforeShortDecl(v: number): number {
	skip: {
		if (v > 0) {
			break skip
		}
		return 0
	}
	let x = v + 1
	return x
}

export function overlappingSequentialForward(v: number): number {
	let total = 1
	exit: {
		exponent: {
			if (v == 1) {
				break exponent
			}
			if (v == 2) {
				total = total + (10)
				break exit
			}
			total = total + (100)
		}
		total = total * (2)
		if (v == 3) {
			break exit
		}
		total = total + (3)
	}
	return total + 5
}

export function mixedForwardBackwardDecl(limit: number): number {
	let total = 0
	__goscriptLoop1: while (total < limit) {
		let __goscriptGotoState1 = "__entry"
		__goscriptGotoLoop1: while (true) {
			switch (__goscriptGotoState1) {
				case "__entry":
				{
					__goscriptGotoState1 = "skip"
					continue __goscriptGotoLoop1
					__goscriptGotoState1 = "check"
					continue __goscriptGotoLoop1
					break
				}
				case "check":
				{
					if (total >= limit) {
						continue __goscriptLoop1
					}
					__goscriptGotoState1 = "skip"
					continue __goscriptGotoLoop1
					break
				}
				case "skip":
				{
					var x = total + 1
					total = x
					__goscriptGotoState1 = "check"
					continue __goscriptGotoLoop1
					break __goscriptGotoLoop1
					break
				}
			}
			break
		}
	}
	return total
}

export function stateMachineGoto(start: number): number {
	let total = start
	let __goscriptGotoState2 = "__entry"
	__goscriptGotoLoop2: while (true) {
		switch (__goscriptGotoState2) {
			case "__entry":
			{
				if (start == 0) {
					__goscriptGotoState2 = "readLiteral"
					continue __goscriptGotoLoop2
				}
				__goscriptGotoState2 = "copyHistory"
				continue __goscriptGotoLoop2
				__goscriptGotoState2 = "readLiteral"
				continue __goscriptGotoLoop2
				break
			}
			case "readLiteral":
			{
				{
					total++
					if (total < 2) {
						__goscriptGotoState2 = "readLiteral"
						continue __goscriptGotoLoop2
					}
					__goscriptGotoState2 = "copyHistory"
					continue __goscriptGotoLoop2
				}
				__goscriptGotoState2 = "copyHistory"
				continue __goscriptGotoLoop2
				break
			}
			case "copyHistory":
			{
				{
					total = total + (10)
					if (total < 15) {
						__goscriptGotoState2 = "readLiteral"
						continue __goscriptGotoLoop2
					}
				}
				break __goscriptGotoLoop2
				break
			}
		}
		break
	}
	return total
}

export function nestedBackwardGoto(limit: number): number {
	let total = 0
	restart: while (true) {
		if (total >= limit) {
			return total
		}

		__goscriptLoop2: while (true) {
			next: while (true) {
				total++

				if ((total % 2) == 0) {
					continue restart
				}
				if (total < limit) {
					continue next
				}
				return total
				break
			}
		}
		break
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function nestedInnerBreakWithGoto(limit: number): number {
	let total = 0
	restart: while (true) {
		if (total >= limit) {
			return total
		}

		__goscriptLoop3: while (true) {
			next: while (true) {
				for (let i = 0; i < 3; i++) {
					if (i == 1) {
						break
					}
					total = total + (10)
				}

				total++
				if (total < limit) {
					continue next
				}
				break
			}
			if (total < (limit + 3)) {
				continue restart
			}
			return total
		}
		break
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function rangeFuncBreakIterator(_yield: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<void> {
	for (let i = 0; i < 3; i++) {
		if (!await _yield!(i)) {
			return
		}
	}
}

export async function main(): globalThis.Promise<void> {
	$.println("skip negative:", skipToLabel(-1))
	$.println("skip positive:", skipToLabel(1))
	$.println("loop skipped:", skipLoop(0))
	$.println("loop included:", skipLoop(2))
	$.println("mixed small:", mixedForwardBackward(1))
	$.println("mixed large:", mixedForwardBackward(5))
	$.println("label decl:", labelBeforeShortDecl(2))
	$.println("overlap fallthrough:", overlappingSequentialForward(0))
	$.println("overlap exponent:", overlappingSequentialForward(1))
	$.println("overlap exit:", overlappingSequentialForward(2))
	$.println("mixed decl:", mixedForwardBackwardDecl(2))
	$.println("state zero:", stateMachineGoto(0))
	$.println("state one:", stateMachineGoto(1))
	$.println("nested restart:", nestedBackwardGoto(5))
	$.println("nested break:", nestedInnerBreakWithGoto(25))

	let rangeTotal = 0
	let __goscriptGotoState3 = "rangeRestart"
	__goscriptGotoLoop3: while (true) {
		switch (__goscriptGotoState3) {
			case "rangeRestart":
			{
				if (rangeTotal >= 25) {
					__goscriptGotoState3 = "rangeDone"
					continue __goscriptGotoLoop3
				}
				__goscriptLoop4: while (true) {
					rangeNext: while (true) {
						let __goscriptRangeReturn0 = false
						;await (async () => {
							await rangeFuncBreakIterator!(async (v) => {
								if (v == 0) {
									rangeTotal = rangeTotal + (5)
									return true
								}
								if (v == 1) {
									return false
								}
								rangeTotal = rangeTotal + (10)
								return true
							})
						})()
						if (__goscriptRangeReturn0) {
							return
						}

						rangeTotal++
						if (rangeTotal < 25) {
							continue rangeNext
						}
						break
					}
					if (rangeTotal < 28) {
						__goscriptGotoState3 = "rangeRestart"
						continue __goscriptGotoLoop3
					}
					break __goscriptLoop4
				}
				__goscriptGotoState3 = "rangeDone"
				continue __goscriptGotoLoop3
				break
			}
			case "rangeDone":
			{
				$.println("range func break:", rangeTotal)
				break __goscriptGotoLoop3
				break
			}
		}
		break
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

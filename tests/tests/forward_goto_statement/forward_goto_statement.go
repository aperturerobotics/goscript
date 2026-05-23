package main

func skipToLabel(v int) int {
	total := 0
	if v < 0 {
		goto done
	}
	total += 1
done:
	total += 10
	return total
}

func skipLoop(v int) int {
	total := 0
	if v == 0 {
		goto afterLoop
	}
	for i := range 3 {
		total += i
	}
afterLoop:
	return total + 1
}

func mixedForwardBackward(limit int) int {
	total := 0
	for total < limit {
		total++
		goto skipVisit
	checkAndLoop:
		if total >= limit {
			continue
		}
	skipVisit:
		switch total % 3 {
		case 0:
			total += 2
			goto checkAndLoop
		case 1:
			total += 3
			goto checkAndLoop
		}
		break
	}
	return total
}

func labelBeforeShortDecl(v int) int {
	if v > 0 {
		goto skip
	}
	return 0

skip:
	x := v + 1
	return x
}

func mixedForwardBackwardDecl(limit int) int {
	total := 0
	for total < limit {
		goto skip
	check:
		if total >= limit {
			continue
		}
	skip:
		x := total + 1
		total = x
		goto check
	}
	return total
}

func stateMachineGoto(start int) int {
	total := start
	if start == 0 {
		goto readLiteral
	}
	goto copyHistory

readLiteral:
	{
		total++
		if total < 2 {
			goto readLiteral
		}
		goto copyHistory
	}

copyHistory:
	{
		total += 10
		if total < 15 {
			goto readLiteral
		}
	}
	return total
}

func nestedBackwardGoto(limit int) int {
	total := 0
restart:
	if total >= limit {
		return total
	}
	for {
	next:
		total++
		if total%2 == 0 {
			goto restart
		}
		if total < limit {
			goto next
		}
		return total
	}
}

func nestedInnerBreakWithGoto(limit int) int {
	total := 0
restart:
	if total >= limit {
		return total
	}
	for {
	next:
		for i := range 3 {
			if i == 1 {
				break
			}
			total += 10
		}
		total++
		if total < limit {
			goto next
		}
		if total < limit+3 {
			goto restart
		}
		return total
	}
}

func rangeFuncBreakIterator(yield func(int) bool) {
	for i := range 3 {
		if !yield(i) {
			return
		}
	}
}

func main() {
	println("skip negative:", skipToLabel(-1))
	println("skip positive:", skipToLabel(1))
	println("loop skipped:", skipLoop(0))
	println("loop included:", skipLoop(2))
	println("mixed small:", mixedForwardBackward(1))
	println("mixed large:", mixedForwardBackward(5))
	println("label decl:", labelBeforeShortDecl(2))
	println("mixed decl:", mixedForwardBackwardDecl(2))
	println("state zero:", stateMachineGoto(0))
	println("state one:", stateMachineGoto(1))
	println("nested restart:", nestedBackwardGoto(5))
	println("nested break:", nestedInnerBreakWithGoto(25))

	rangeTotal := 0
rangeRestart:
	if rangeTotal >= 25 {
		goto rangeDone
	}
	for {
	rangeNext:
		for v := range rangeFuncBreakIterator {
			if v == 0 {
				rangeTotal += 5
				continue
			}
			if v == 1 {
				break
			}
			rangeTotal += 10
		}
		rangeTotal++
		if rangeTotal < 25 {
			goto rangeNext
		}
		if rangeTotal < 28 {
			goto rangeRestart
		}
		break
	}
rangeDone:
	println("range func break:", rangeTotal)
}

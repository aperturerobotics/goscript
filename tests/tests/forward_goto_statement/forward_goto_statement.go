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
}

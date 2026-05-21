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

func main() {
	println("skip negative:", skipToLabel(-1))
	println("skip positive:", skipToLabel(1))
	println("loop skipped:", skipLoop(0))
	println("loop included:", skipLoop(2))
	println("mixed small:", mixedForwardBackward(1))
	println("mixed large:", mixedForwardBackward(5))
}

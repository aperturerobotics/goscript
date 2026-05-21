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

func main() {
	println("skip negative:", skipToLabel(-1))
	println("skip positive:", skipToLabel(1))
	println("loop skipped:", skipLoop(0))
	println("loop included:", skipLoop(2))
}

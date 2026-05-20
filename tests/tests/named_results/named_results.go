package main

func pair(ok bool) (n int, label string) {
	n = 3
	if ok {
		label = "ok"
		return
	}
	label = "fallback"
	return n + 1, label
}

func single() (value int) {
	value = 9
	return
}

func main() {
	n, label := pair(true)
	println("pair true:", n, label)

	n, label = pair(false)
	println("pair false:", n, label)

	println("single:", single())
}

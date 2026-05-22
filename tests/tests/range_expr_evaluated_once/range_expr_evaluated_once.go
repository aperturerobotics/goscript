package main

var calls int

func values() []byte {
	calls++
	return []byte{1, 4, 5}
}

func main() {
	sum := 0
	for _, value := range values()[1:] {
		sum += int(value)
	}
	println("calls:", calls)
	println("sum:", sum)
}

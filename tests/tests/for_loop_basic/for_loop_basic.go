package main

func main() {
	println("Starting loop")
	for i := range 3 {
		println("Iteration:", i)
	}
	println("Loop finished")

	println("Starting loop")
	x := 0
	for range 5 {
		println("Iteration:", x)
		x++
	}
	println("Loop finished")
}

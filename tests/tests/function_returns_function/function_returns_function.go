package main

func getAdder(x int) func(int) int {
	return func(y int) int {
		return x + y
	}
}

func main() {
	adder := getAdder(5)
	result := adder(3)
	println("Result:", result)
}

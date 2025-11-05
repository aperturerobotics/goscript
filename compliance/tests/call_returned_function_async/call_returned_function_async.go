package main

func getAdder(x int) func(int) int {
	return func(y int) int {
		return x + y
	}
}

func asyncAdd(a, b int) int {
	return a + b
}

func getAsyncAdder(x int) func(int) int {
	return func(y int) int {
		return asyncAdd(x, y)
	}
}

func main() {
	// Direct call of returned function - not async
	result1 := getAdder(5)(3)
	println("Result 1:", result1)

	// Direct call of returned function - with async call inside
	result2 := getAsyncAdder(10)(7)
	println("Result 2:", result2)
}

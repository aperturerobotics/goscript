package main

// addSub returns sum and difference with named returns of same type
func addSub(a, b int) (sum, diff int) {
	sum = a + b
	diff = a - b
	return
}

// swap returns two values of the same type
func swap(a, b int) (x, y int) {
	return b, a
}

// minmax returns min and max from two values
func minmax(a, b int) (min, max int) {
	if a < b {
		return a, b
	}
	return b, a
}

func main() {
	sum, diff := addSub(17, 5)
	println("addSub(17, 5):", sum, diff) // 22, 12

	x, y := swap(10, 20)
	println("swap(10, 20):", x, y) // 20, 10

	min, max := minmax(7, 3)
	println("minmax(7, 3):", min, max) // 3, 7
}

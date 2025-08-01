package main

func main() {
	var x int = 2
	var p *int = &x

	*p += 3
	println(x) // Expected: 5

	*p &^= 1
	// 5 (0101) &^ 1 (0001) = 4 (0100)
	println(x) // Expected: 4
}

package main

func main() {
	var x int = 2
	var p *int = &x

	*p += 3
	println(x) // Expected: 5

	*p &^= 1
	// 5 (0101) &^ 1 (0001) = 4 (0100)
	println(x) // Expected: 4

	*p <<= 2
	println(x) // Expected: 16

	*p >>= 1
	println(x) // Expected: 8

	*p |= 3
	println(x) // Expected: 11

	(*p)++
	println(x) // Expected: 12

	(*p)--
	println(x) // Expected: 11
}

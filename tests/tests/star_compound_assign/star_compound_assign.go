package main

type holder struct {
	values *[]int
}

func trim(h *holder) {
	*h.values = (*h.values)[:len(*h.values)-1]
}

func trimParen(h *holder) {
	(*h.values) = (*h.values)[:len(*h.values)-1]
}

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

	values := []int{1, 2, 3, 4}
	h := &holder{values: &values}
	trim(h)
	println("len after star:", len(*h.values)) // Expected: 3
	trimParen(h)
	println("len after paren star:", len(*h.values)) // Expected: 2
}

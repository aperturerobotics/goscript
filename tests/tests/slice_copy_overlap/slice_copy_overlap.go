package main

func main() {
	right := []int{1, 2, 3, 4, 5}
	n := copy(right[2:], right[1:4])
	println("right count:", n)
	println("right:", right[0], right[1], right[2], right[3], right[4])

	left := []int{1, 2, 3, 4, 5}
	n = copy(left[1:], left[2:])
	println("left count:", n)
	println("left:", left[0], left[1], left[2], left[3], left[4])
}

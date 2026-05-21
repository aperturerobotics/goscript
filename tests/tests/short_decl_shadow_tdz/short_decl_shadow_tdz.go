package main

func pair() (int, int) {
	return 2, 3
}

func main() {
	x := 0
	for range 1 {
		x = 1
		y, x := pair()
		println("inner:", y, x)
	}
	println("outer:", x)
}

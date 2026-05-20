package main

func valid(n1, n2, n3, n4 int) bool {
	return n1|n2|n3|n4 == 7
}

func main() {
	if valid(1, 2, 4, 0) {
		println("or equals")
	} else {
		println("or differs")
	}
}

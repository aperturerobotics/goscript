package main

func main() {
	x := 1

	switch x {
	case 1:
		y, z := 10, 20
		println(y + z)
	case 2:
		y, z := 30, 40
		println(y + z)
	}

	println("done")
}

package main

func main() {
	// Test variable shadowing that causes "used before declaration" errors
	for i := 0; i < 3; i++ {
		switch i {
		case 0:
			var x int = 10
			println("Case 0:", x)
		case 1:
			var x string = "hello"
			println("Case 1:", x)
		case 2:
			var x float64 = 3.14
			println("Case 2:", x)
		}
	}

	// Test redeclaration in different scopes
	{
		pos := 1
		println("Block 1 pos:", pos)
	}
	{
		pos := "position"
		println("Block 2 pos:", pos)
	}
}

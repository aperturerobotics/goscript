package main

func pair(a, b int) (int, int) {
	return a, b
}

func sum(a, b int) int {
	return a + b
}

type point struct {
	x int
	y int
}

func triple(a, b, c int) (int, int, int) {
	return a, b, c
}

func makePoint(x, y, z int) *point {
	return &point{x: x + z, y: y}
}

func shift(p *point) (*point, *point, *point) {
	return &point{x: p.x + 1, y: p.y}, &point{x: p.x + 2, y: p.y}, &point{x: p.x + 3, y: p.y}
}

func main() {
	println("sum:", sum(pair(2, 3)))
	p := makePoint(triple(4, 5, 6))
	println("point:", p.x, p.y)
	x, y, z := new(point), new(point), new(point)
	x, y, z = shift(p)
	println("shift:", x.x, y.x, z.x)
}

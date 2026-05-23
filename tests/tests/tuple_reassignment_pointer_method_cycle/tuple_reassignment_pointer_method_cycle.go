package main

type box struct {
	value int
}

type cursor struct{}

func (*cursor) rotate(a, b, c *box) (*box, *box, *box) {
	return b, c, a
}

func main() {
	cursor := &cursor{}
	x := &box{value: 1}
	y := &box{value: 2}
	z := &box{value: 3}

	for range 1 {
		x, y, z = cursor.rotate(x, y, z)
	}

	println(x.value, y.value, z.value)
}

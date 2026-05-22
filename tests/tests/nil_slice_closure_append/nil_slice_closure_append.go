package main

type item struct {
	Value int
}

func fill(fn func(int)) {
	fn(3)
}

func main() {
	var values []item
	fill(func(value int) {
		values = append(values, item{Value: value})
	})
	if len(values) != 0 {
		println("first:", values[0].Value)
	}
}

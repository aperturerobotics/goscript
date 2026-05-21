package main

type item struct {
	values []int
}

func main() {
	items := map[string]item{
		"one": {values: []int{1, 2, 3}},
	}
	if item, ok := items["one"]; ok {
		println("values:", len(item.values))
	}
}

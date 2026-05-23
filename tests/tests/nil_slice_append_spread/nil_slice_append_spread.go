package main

type item struct {
	value string
}

func clone(items []*item) []*item {
	return append([]*item(nil), items...)
}

func main() {
	first := &item{value: "first"}
	second := &item{value: "second"}
	items := []*item{first, second}
	cloned := clone(items)
	println(len(cloned), cloned[0].value, cloned[1].value)
}

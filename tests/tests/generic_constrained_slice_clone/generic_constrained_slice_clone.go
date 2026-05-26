package main

type clonable[T any] interface {
	CloneVT() T
}

type item struct {
	value string
}

func (i *item) CloneVT() *item {
	if i == nil {
		return nil
	}
	return &item{value: i.value}
}

func cloneSlice[T clonable[T]](items []T) []T {
	cloned := make([]T, 0, len(items))
	for _, item := range items {
		cloned = append(cloned, item.CloneVT())
	}
	return cloned
}

func main() {
	items := []*item{{value: "first"}, {value: "second"}}
	cloned := cloneSlice(items)
	println(len(cloned), cloned[0].value, cloned[1].value, cloned[0] == items[0])
}

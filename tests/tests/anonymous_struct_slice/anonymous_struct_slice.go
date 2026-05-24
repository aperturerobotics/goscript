package main

type namedItem struct {
	key  string
	data []byte
}

func main() {
	for _, tt := range []struct {
		name  string
		input string
		count int
	}{
		{name: "first", input: "alpha", count: 1},
		{name: "second", input: "beta", count: 2},
	} {
		println(tt.name, tt.input, tt.count)
	}

	x := struct {
		Name    string
		Offsets []int
		Count   int
	}{
		Name:  "third",
		Count: 3,
	}
	x.Offsets = append(x.Offsets, 5)
	println(x.Name, x.Offsets[0], x.Count)

	items, _ := buildNamedItems()
	for _, item := range items[1:] {
		println(item.key, len(item.data))
	}
}

func buildNamedItems() ([]namedItem, bool) {
	return []namedItem{
		{key: "skip", data: []byte{0}},
		{key: "keep", data: []byte{1, 2, 3}},
	}, true
}

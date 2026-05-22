package main

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
}

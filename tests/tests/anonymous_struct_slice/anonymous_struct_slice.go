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
}

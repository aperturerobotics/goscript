package main

type filters []int

func (f filters) size() int {
	return len(f)
}

func main() {
	var out filters
	value := any(filters{1, 2, 3})
	if c, ok := value.(filters); ok {
		out = c[:len(c):len(c)]
	}
	raw := []int{4, 5}
	size := filters(raw).size()
	println("len:", len(out))
	println("cap:", cap(out))
	println("size:", size)
}

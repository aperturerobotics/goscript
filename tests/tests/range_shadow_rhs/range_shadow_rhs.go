package main

type holder struct {
	values map[string]int
}

func main() {
	k := holder{values: map[string]int{"a": 1, "b": 2}}
	sum := 0
	for k, v := range k.values {
		sum += len(k) + v
	}
	println(sum)
}

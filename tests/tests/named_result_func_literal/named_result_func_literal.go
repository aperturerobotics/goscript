package main

func makeLookup() func(bool) (int, string) {
	return func(ok bool) (value int, label string) {
		if !ok {
			return
		}
		value = 7
		label = "set"
		return
	}
}

func main() {
	lookup := makeLookup()

	value, label := lookup(false)
	println(value)
	println(label == "")

	value, label = lookup(true)
	println(value)
	println(label)
}

package main

func returnsOneIntOneBool() (int, bool) {
	return 7, true
}

func shadowTupleInput(value string) (string, bool) {
	return value + "-inner", true
}

func shadowCallbackInput(fn func(int) int) (int, bool) {
	return fn(5), true
}

func main() {
	var i int
	println("initial i:", i) /* Use i to avoid unused error before := */

	// i already exists from the var declaration above.
	// err is a new variable being declared.
	i, err := returnsOneIntOneBool()

	println("after assign i:", i) // Use i
	if err {                      // Use err
		println("err is true")
	} else {
		println("err is false")
	}

	value := "outer"
	{
		value, ok := shadowTupleInput(value)
		println("shadow tuple:", value, ok)
	}

	{
		k, ok := shadowCallbackInput(func(k int) int {
			return k + 1
		})
		println("callback shadow:", k, ok)
	}
}

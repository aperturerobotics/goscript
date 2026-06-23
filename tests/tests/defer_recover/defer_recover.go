package main

// safeDivide recovers a panic and reports the failure through its named results,
// proving a deferred recover() both stops the panic and observes the named
// result variables the function returns afterward.
func safeDivide(a, b int) (result int, ok bool) {
	defer func() {
		if r := recover(); r != nil {
			result = -1
			ok = false
		}
	}()
	if b == 0 {
		panic("division by zero")
	}
	return a / b, true
}

// mustPanic recovers a panic in a void function and prints the recovered value.
func mustPanic() {
	defer func() {
		if r := recover(); r != nil {
			println("recovered:", r.(string))
		}
	}()
	panic("boom")
}

// noPanic proves recover() returns nil when the function exits without panicking.
func noPanic() {
	defer func() {
		if r := recover(); r != nil {
			println("should not happen")
		} else {
			println("nothing to recover")
		}
	}()
	println("noPanic body")
}

func main() {
	q, ok := safeDivide(10, 2)
	println("10/2 =", q, ok)
	q, ok = safeDivide(1, 0)
	println("1/0 =", q, ok)
	mustPanic()
	noPanic()
	println("main done")
}

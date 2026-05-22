package main

var hook = func() int {
	return 1
}

func read() int {
	return hook()
}

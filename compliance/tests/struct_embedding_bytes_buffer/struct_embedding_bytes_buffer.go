package main

import "bytes"

type MyWriter struct {
	bytes.Buffer // Embedded Buffer
	count        int
}

func main() {
	var w MyWriter

	// Call promoted method WriteString from bytes.Buffer
	w.WriteString("Hello ")
	w.WriteString("World")

	println("Content:", w.String())
	println("Length:", w.Len())

	println("test finished")
}

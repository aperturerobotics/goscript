package main

import "strings"

func main() {
	// This should trigger the unhandled make call error
	// strings.Builder uses make internally for its buffer
	var builder strings.Builder
	builder.WriteString("Hello")
	builder.WriteString(" ")
	builder.WriteString("World")
	n, err := builder.Write([]byte("!"))
	println("Write:", n, err == nil)

	result := builder.String()
	println("Result:", result)
	printBuilderPointer(&builder)
	println("After pointer:", builder.String())

	// Also test direct make with strings.Builder
	builderPtr := &strings.Builder{}
	builderPtr.WriteString("Direct make test")
	println("Direct:", builderPtr.String())
	println("LastIndexByte:", strings.LastIndexByte("hello", 'l'))
	println("LastIndex:", strings.LastIndex("hello", "l"))
}

func printBuilderPointer(builder *strings.Builder) {
	println("Pointer Len Before:", builder.Len())
	builder.WriteString(" Pointer")
	println("Pointer Len After:", builder.Len())
}

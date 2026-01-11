package main

import (
	"fmt"
	"go/scanner"
	"go/token"
)

func main() {
	// Use scanner package functionality that should generate imports
	var errorList scanner.ErrorList

	// This should require importing both scanner and token packages
	pos := token.Position{Filename: "test.go", Line: 1, Column: 1}
	errorList.Add(pos, "test error")

	fmt.Printf("ErrorList length: %d\n", len(errorList))
}

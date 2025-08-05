package main

import (
	"go/scanner"
	"io"
	"os"
)

func main() {
	// Test type compatibility issues

	// Issue 1: Null assignment to non-nullable types
	var output io.Writer = os.Stdout
	output.Write([]byte("test\n"))

	// Issue 2: VarRef type mismatches
	var s scanner.Scanner
	var eh scanner.ErrorHandler

	// This should cause type compatibility issues in generated TypeScript
	s.Init(nil, []byte("test code"), eh, scanner.ScanComments)

	pos, tok, lit := s.Scan()
	println("Token:", tok.String(), "at pos", int(pos), "literal:", lit)
}

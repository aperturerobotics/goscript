package main

import (
	"go/ast"
	"go/parser"
	"go/token"
	"slices"
)

func main() {
	// Create a new token file set
	fset := token.NewFileSet()

	// Test parsing expressions
	var results []string

	// Parse some simple expressions
	expressions := []string{
		"42",
		"x + y",
		"len(slice)",
		"map[string]int{}",
	}

	for _, expr := range expressions {
		node, err := parser.ParseExpr(expr)
		if err != nil {
			results = append(results, "Error parsing "+expr+": "+err.Error())
			continue
		}

		// Extract type information from the parsed expression
		switch n := node.(type) {
		case *ast.BasicLit:
			results = append(results, "BasicLit: "+n.Value)
		case *ast.BinaryExpr:
			results = append(results, "BinaryExpr with operator: "+n.Op.String())
		case *ast.CallExpr:
			if ident, ok := n.Fun.(*ast.Ident); ok {
				results = append(results, "CallExpr: "+ident.Name)
			}
		case *ast.CompositeLit:
			results = append(results, "CompositeLit (composite literal)")
		default:
			results = append(results, "Unknown expression type")
		}
	}

	// Test parsing a simple Go source file
	src := `package main
	
func add(a, b int) int {
	return a + b
}

func main() {
	result := add(1, 2)
	println(result)
}`

	// Parse the source code
	file, err := parser.ParseFile(fset, "test.go", src, parser.ParseComments)
	if err != nil {
		results = append(results, "Error parsing file: "+err.Error())
	} else {
		// Extract function names
		for _, decl := range file.Decls {
			if fn, ok := decl.(*ast.FuncDecl); ok {
				results = append(results, "Function: "+fn.Name.Name)
			}
		}

		// Check package name
		results = append(results, "Package: "+file.Name.Name)
	}

	// Sort results for deterministic output
	slices.Sort(results)

	// Print results
	for _, result := range results {
		println("Parse result:", result)
	}

	println("go/parser test finished")
}

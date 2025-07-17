// Generated file based on package_import_go_parser.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js";

import * as ast from "@goscript/go/ast/index.js"

import * as parser from "@goscript/go/parser/index.js"

import * as token from "@goscript/go/token/index.js"

import * as slices from "@goscript/slices/index.js"

export async function main(): Promise<void> {
	// Create a new token file set
	let fset = token.NewFileSet()

	// Test parsing expressions
	let results: $.Slice<string> = null

	// Parse some simple expressions
	let expressions = $.arrayToSlice<string>(["42", "x + y", "len(slice)", "map[string]int{}"])

	// Extract type information from the parsed expression
	for (let _i = 0; _i < $.len(expressions); _i++) {
		const expr = expressions![_i]
		{
			let [node, err] = parser.ParseExpr(expr)
			if (err != null) {
				results = $.append(results, "Error parsing " + expr + ": " + err!.Error())
				continue
			}

			// Extract type information from the parsed expression
			$.typeSwitch(node, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.BasicLit'}], body: (n) => {
				results = $.append(results, "BasicLit: " + n.Value)
			}},
			{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.BinaryExpr'}], body: (n) => {
				results = $.append(results, "BinaryExpr with operator: " + token.Token_String(n.Op))
			}},
			{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.CallExpr'}], body: (n) => {
				{
					let { value: ident, ok: ok } = $.typeAssert<ast.Ident | null>(n.Fun, {kind: $.TypeKind.Pointer, elemType: 'ast.Ident'})
					if (ok) {
						results = $.append(results, "CallExpr: " + ident!.Name)
					}
				}
			}},
			{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.CompositeLit'}], body: (n) => {
				results = $.append(results, "CompositeLit (composite literal)")
			}}], () => {
				results = $.append(results, "Unknown expression type")
			})
		}
	}

	// Test parsing a simple Go source file
	let src = `package main
	
func add(a, b int) int {
	return a + b
}

func main() {
	result := add(1, 2)
	println(result)
}`

	// Parse the source code
	let [file, err] = parser.ParseFile(fset, "test.go", src, parser.ParseComments)

	// Extract function names

	// Check package name
	if (err != null) {
		results = $.append(results, "Error parsing file: " + err!.Error())
	}
	 else {
		// Extract function names
		for (let _i = 0; _i < $.len(file!.Decls); _i++) {
			const decl = file!.Decls![_i]
			{
				{
					let { value: fn, ok: ok } = $.typeAssert<ast.FuncDecl | null>(decl, {kind: $.TypeKind.Pointer, elemType: 'ast.FuncDecl'})
					if (ok) {
						results = $.append(results, "Function: " + fn!.Name!.Name)
					}
				}
			}
		}

		// Check package name
		results = $.append(results, "Package: " + file!.Name!.Name)
	}

	// Sort results for deterministic output
	slices.Sort(results)

	// Print results
	for (let _i = 0; _i < $.len(results); _i++) {
		const result = results![_i]
		{
			console.log("Parse result:", result)
		}
	}

	console.log("go/parser test finished")
}


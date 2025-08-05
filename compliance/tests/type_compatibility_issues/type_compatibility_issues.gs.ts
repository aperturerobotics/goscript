// Generated file based on type_compatibility_issues.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as scanner from "@goscript/go/scanner/index.js"

import * as io from "@goscript/io/index.js"

import * as os from "@goscript/os/index.js"

export async function main(): Promise<void> {
	// Test type compatibility issues

	// Issue 1: Null assignment to non-nullable types
	let output: io.Writer = os.Stdout
	output!.Write($.stringToBytes("test\n"))

	// Issue 2: VarRef type mismatches
	let s: scanner.Scanner = new scanner.Scanner()
	let eh: scanner.ErrorHandler | null = null

	// This should cause type compatibility issues in generated TypeScript
	s.Init(null, $.stringToBytes("test code"), eh, scanner.ScanComments)

	let [pos, tok, lit] = s.Scan()
	console.log("Token:", Token_String(tok), "at pos", pos, "literal:", lit)
}


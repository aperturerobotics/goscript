// Generated file based on octal_literals.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	// Test octal literals that cause TypeScript compilation errors
	let perm1 = 0o777
	let perm2 = 0o666
	let perm3 = 0o644
	let perm4 = 0o755

	$.println("perm1:", perm1)
	$.println("perm2:", perm2)
	$.println("perm3:", perm3)
	$.println("perm4:", perm4)

	$.println("test finished")
}


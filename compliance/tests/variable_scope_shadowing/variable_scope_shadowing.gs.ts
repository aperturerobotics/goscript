// Generated file based on variable_scope_shadowing.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	// Test variable shadowing that causes "used before declaration" errors
	for (let i = 0; i < 3; i++) {
		switch (i) {
			case 0:
				let x: number = 10
				console.log("Case 0:", x)
				break
			case 1:
				let x: string = "hello"
				console.log("Case 1:", x)
				break
			case 2:
				let x: number = 3.14
				console.log("Case 2:", x)
				break
		}
	}

	// Test redeclaration in different scopes
	{
		let pos = 1
		console.log("Block 1 pos:", pos)
	}
	{
		let pos = "position"
		console.log("Block 2 pos:", pos)
	}
}


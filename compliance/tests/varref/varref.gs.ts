// Generated file based on varref.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	console.log("setting x to 10")
	// x is varrefed as p1 takes the address
	let x: $.VarRef<number> = $.varRef(10)

	// p1 is varrefed as p2 takes the address
	let p1: $.VarRef<$.VarRef<number> | null> = $.varRef(x)
	// p2 is varrefed as p3 takes the address
	let p2: $.VarRef<$.VarRef<$.VarRef<number> | null> | null> = $.varRef(p1)
	// p3 is not varrefed as nothing takes its address
	let p3: $.VarRef<$.VarRef<$.VarRef<number> | null> | null> | null = p2

	console.log("***p3 ==", p3!.value!.value!.value)
	console.log()

	console.log("setting ***p3 to 12")
	p3!.value!.value!.value = 12
	console.log("***p3 ==", p3!.value!.value!.value)
	console.log()

	console.log("setting y to 15, p1 to &y")
	// should be: let y: $.VarRef<number> = $.varRef(15)
	// y is varrefed as p1 takes the address
	let y: $.VarRef<number> = $.varRef(15)
	// should be: p1.value = y
	p1!.value = y

	console.log("***p3 ==", p3!.value!.value!.value)
	console.log()
}


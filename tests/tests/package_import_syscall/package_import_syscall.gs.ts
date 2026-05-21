// Generated file based on package_import_syscall.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as syscall from "@goscript/syscall/index.js"

export async function main(): Promise<void> {
	syscall.CloseOnExec(1)
	{
		let err = syscall.SetNonblock(1, true)
		if (err != null) {
			fmt.Println("set true:", err)
			return
		}
	}
	{
		let err = syscall.SetNonblock(1, false)
		if (err != null) {
			fmt.Println("set false:", err)
			return
		}
	}
	fmt.Println("set nonblock ok")
}


if ($.isMainScript(import.meta)) {
	await main()
}

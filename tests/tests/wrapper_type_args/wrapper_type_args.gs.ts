// Generated file based on wrapper_type_args.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as fmt from "@goscript/fmt/index.ts"

import * as os from "@goscript/os/index.ts"

export type MyMode = number

export function MyMode_IsExecutable(m: MyMode): boolean {
	return (m & 0o111) != 0
}

export function MyMode_String(m: MyMode): string {
	return fmt.Sprintf("%o", $.int(m))
}

export type DirInterface = null | {
	MkdirAll(path: string, perm: FileMode): error
}

$.registerInterfaceType(
	"main.DirInterface",
	null,
	[{ name: "MkdirAll", args: [{ name: "path", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "perm", type: "fs.FileMode" }], returns: [{ name: "_r0", type: "error" }] }]
)

export class MyDir {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): MyDir {
		const cloned = new MyDir()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public MkdirAll(path: string, perm: FileMode): error {
		const d = this
		fmt.Printf("MkdirAll called with path=%s, perm=%s\n", path, perm.String())
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.MyDir",
		new MyDir(),
		[{ name: "MkdirAll", args: [], returns: [] }],
		MyDir,
		{}
	)
}

export function TestFileMode(mode: FileMode): void {
	fmt.Printf("TestFileMode called with mode=%s\n", mode.String())
}

export function TestMyMode(mode: MyMode): void {
	fmt.Printf("TestMyMode called with mode=%s, executable=%t\n", MyMode_String(mode), MyMode_IsExecutable(mode))
}

export async function main(): Promise<void> {
	TestFileMode(0o644)
	TestFileMode(0o755)
	TestMyMode(0o755)
	TestMyMode(0o600)
	let dir: DirInterface = new MyDir()
	dir.MkdirAll("/tmp/test", 0o700)
	let existingMode = 0o644
	TestFileMode(existingMode)
	let combined = 0o755 | 0o022
	TestFileMode(combined)
	fmt.Println("Test completed")
}


if ($.isMainScript(import.meta)) {
	await main()
}

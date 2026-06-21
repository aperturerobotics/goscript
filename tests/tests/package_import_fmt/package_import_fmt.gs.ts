// Generated file based on package_import_fmt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fmt from "@goscript/fmt/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/fmt/index.js"

export class byteFormatter {
	public get prefix(): $.Slice<number> {
		return this._fields.prefix.value
	}
	public set prefix(value: $.Slice<number>) {
		this._fields.prefix.value = value
	}

	public _fields: {
		prefix: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{prefix?: $.Slice<number>}>) {
		this._fields = {
			prefix: $.varRef(init?.prefix ?? (null as unknown as $.Slice<number>))
		}
	}

	public clone(): byteFormatter {
		const cloned = new byteFormatter()
		cloned._fields = {
			prefix: $.varRef(this._fields.prefix.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Format(state: fmt.State | null, verb: number): globalThis.Promise<void> {
		const b = this
		let buf: $.Slice<number> = $.appendSlice($.arrayToSlice<number>([]), b.prefix)
		buf = $.append(buf, $.uint($.uint(verb, 8), 8))
		await $.pointerValue<Exclude<fmt.State, null>>(state).Write(buf)
	}

	static __typeInfo = $.registerStructType(
		"main.byteFormatter",
		() => new byteFormatter(),
		[{ name: "Format", args: [{ name: "state", type: "fmt.State" }, { name: "verb", type: { kind: $.TypeKind.Basic, name: "int32" } }], returns: [] }],
		byteFormatter,
		[{ name: "prefix", key: "prefix", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_fmt", index: [0], offset: 0, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Test basic Print functions
	fmt.Print("Hello")
	fmt.Print(" ")
	fmt.Print("World")
	fmt.Println()

	// Test Printf with basic formatting
	let name = "Go"
	let version = 1.21
	fmt.Printf("Welcome to %s %.2f\n", name, $.namedValueInterfaceValue<any>(version, "float64", {}, { kind: $.TypeKind.Basic, name: "float64" }))

	// Test Println
	fmt.Println("This is println")

	// Test Sprint functions
	let result = fmt.Sprint("Sprint", " ", "result")
	fmt.Println("Sprint result:", result)
	let parts: $.Slice<any> = $.arrayToSlice<any>(["Spread", " ", "result"])
	let spreadResult = fmt.Sprint(...(parts ?? []))
	fmt.Println("Sprint spread result:", spreadResult)

	// Test Sprintf
	let formatted = fmt.Sprintf("Number: %d, String: %s", $.namedValueInterfaceValue<any>(42, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), "test")
	fmt.Println("Sprintf result:", formatted)
	let formatArgs: $.Slice<any> = $.arrayToSlice<any>([$.namedValueInterfaceValue<any>(7, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), "spread"])
	let formattedSpread = fmt.Sprintf("Spread Number: %d, String: %s", ...(formatArgs ?? []))
	fmt.Println("Sprintf spread result:", formattedSpread)

	// Test Sprintln
	let sprintln_result = fmt.Sprintln("Sprintln", "result")
	fmt.Print("Sprintln result:", sprintln_result)

	// Test Errorf
	let err = fmt.Errorf("error code: %d", $.namedValueInterfaceValue<any>(404, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
	fmt.Println("Error:", (err as any))

	// Test various format verbs
	fmt.Printf("Boolean: %t\n", true)
	fmt.Printf("Integer: %d\n", $.namedValueInterfaceValue<any>(123, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
	fmt.Printf("Float: %f\n", $.namedValueInterfaceValue<any>(3.14159, "float64", {}, { kind: $.TypeKind.Basic, name: "float64" }))
	fmt.Printf("String: %s\n", "hello")
	fmt.Printf("Type: %T\n", $.namedValueInterfaceValue<any>(42, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
	fmt.Printf("Value: %v\n", $.interfaceValue<any>($.arrayToSlice<number>([1, 2, 3]), "[]int"))

	// Test width and precision
	fmt.Printf("Width: '%5s'\n", "hi")
	fmt.Printf("Precision: '%.2f'\n", $.namedValueInterfaceValue<any>(3.14159, "float64", {}, { kind: $.TypeKind.Basic, name: "float64" }))
	fmt.Printf("Both: '%5.2f'\n", $.namedValueInterfaceValue<any>(3.14159, "float64", {}, { kind: $.TypeKind.Basic, name: "float64" }))
	fmt.Printf("Formatter: %v\n", $.interfaceValue<any>($.markAsStructValue(new byteFormatter({prefix: new Uint8Array([98, 121, 116, 101, 45])})), "main.byteFormatter"))
	let appended: $.Slice<number> = fmt.Append(new Uint8Array([98, 97, 115, 101, 45]), "tail")
	fmt.Println("Append bytes:", $.bytesToString(appended))
	let buf: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	await fmt.Fprintln($.pointerValueOrNil($.interfaceValue<io.Writer | null>(buf, "*bytes.Buffer"))!, "Buffered writer")
	fmt.Print(buf.value.String())

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}

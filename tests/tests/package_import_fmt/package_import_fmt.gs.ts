// Generated file based on package_import_fmt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

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
			prefix: $.varRef(init?.prefix ?? null)
		}
	}

	public clone(): byteFormatter {
		const cloned = new byteFormatter()
		cloned._fields = {
			prefix: $.varRef(this._fields.prefix.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Format(state: fmt.State | null, verb: number): void {
		const b = this
		let buf = $.append($.arrayToSlice<number>([]), b.prefix)
		buf = $.append(buf, $.int(verb))
		$.pointerValue<Exclude<fmt.State, null>>(state).Write(buf)
	}

	static __typeInfo = $.registerStructType(
		"main.byteFormatter",
		new byteFormatter(),
		[{ name: "Format", args: [], returns: [] }],
		byteFormatter,
		{"prefix": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
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
	fmt.Printf("Welcome to %s %.2f\n", name, version)

	// Test Println
	fmt.Println("This is println")

	// Test Sprint functions
	let result = fmt.Sprint("Sprint", " ", "result")
	fmt.Println("Sprint result:", result)

	// Test Sprintf
	let formatted = fmt.Sprintf("Number: %d, String: %s", 42, "test")
	fmt.Println("Sprintf result:", formatted)

	// Test Sprintln
	let sprintln_result = fmt.Sprintln("Sprintln", "result")
	fmt.Print("Sprintln result:", sprintln_result)

	// Test Errorf
	let err = fmt.Errorf("error code: %d", 404)
	fmt.Println("Error:", err)

	// Test various format verbs
	fmt.Printf("Boolean: %t\n", true)
	fmt.Printf("Integer: %d\n", 123)
	fmt.Printf("Float: %f\n", 3.14159)
	fmt.Printf("String: %s\n", "hello")
	fmt.Printf("Type: %T\n", 42)
	fmt.Printf("Value: %v\n", $.arrayToSlice<number>([1, 2, 3]))

	// Test width and precision
	fmt.Printf("Width: '%5s'\n", "hi")
	fmt.Printf("Precision: '%.2f'\n", 3.14159)
	fmt.Printf("Both: '%5.2f'\n", 3.14159)
	fmt.Printf("Formatter: %v\n", $.markAsStructValue(new byteFormatter({prefix: $.stringToBytes("byte-")})))
	let appended = fmt.Append($.stringToBytes("base-"), "tail")
	fmt.Println("Append bytes:", $.bytesToString(appended))

	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}

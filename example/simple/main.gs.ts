// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class MyStruct {
	public get MyInt(): number {
		return this._fields.MyInt.value
	}
	public set MyInt(value: number) {
		this._fields.MyInt.value = value
	}

	public get MyString(): string {
		return this._fields.MyString.value
	}
	public set MyString(value: string) {
		this._fields.MyString.value = value
	}

	public get myBool(): boolean {
		return this._fields.myBool.value
	}
	public set myBool(value: boolean) {
		this._fields.myBool.value = value
	}

	public _fields: {
		MyInt: $.VarRef<number>
		MyString: $.VarRef<string>
		myBool: $.VarRef<boolean>
	}

	constructor(init?: Partial<{MyInt?: number, MyString?: string, myBool?: boolean}>) {
		this._fields = {
			MyInt: $.varRef(init?.MyInt ?? 0),
			MyString: $.varRef(init?.MyString ?? ""),
			myBool: $.varRef(init?.myBool ?? false)
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			MyInt: $.varRef(this._fields.MyInt.value),
			MyString: $.varRef(this._fields.MyString.value),
			myBool: $.varRef(this._fields.myBool.value)
		}
		return $.markAsStructValue(cloned)
	}

	public GetMyBool(): boolean {
		const m = this
		return $.pointerValue(m).myBool
	}

	public GetMyString(): string {
		const m = this
		return $.pointerValue(m).MyString
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		new MyStruct(),
		[{ name: "GetMyBool", args: [], returns: [] }, { name: "GetMyString", args: [], returns: [] }],
		MyStruct,
		{"MyInt": { kind: $.TypeKind.Basic, name: "int" }, "MyString": { kind: $.TypeKind.Basic, name: "string" }, "myBool": { kind: $.TypeKind.Basic, name: "bool" }}
	)
}

export function NewMyStruct(s: string): MyStruct {
	return $.markAsStructValue(new MyStruct({MyString: s}))
}

export function vals(): void {
	return [1, 2]
}

export async function main(): Promise<void> {
	$.println("Hello from GoScript example!")
	let a = 10
	let b = 3
	$.println("Addition:", a + b, "Subtraction:", a - b, "Multiplication:", a * b, "Division:", a / b, "Modulo:", a % b)
	$.println("Logic &&:", true && false, "||:", true || false, "!:!", !true)
	$.println("Comparisons:", a == b, a != b, a < b, a > b, a <= b, a >= b)
	let r: number = 88
	let s = String.fromCodePoint(r)
	$.println("string('X'):", s)
	let r2: number = 121
	let s2 = String.fromCodePoint(r2)
	$.println("string(121):", s2)
	let r3: number = 0x221A
	let s3 = String.fromCodePoint(r3)
	$.println("string(0x221A):", s3)
	let arr = [1, 2, 3]
	$.println("Array elements:", arr[0], arr[1], arr[2])
	let slice = [4, 5, 6]
	$.println("Slice elements:", slice[0], slice[1], slice[2])
	$.println("Slice length:", $.len(slice), "capacity:", $.cap(slice))
	let sliceWithCap = $.makeSlice<number>(3, 5, "number")
	$.println("\nSlice created with make([]int, 3, 5):")
	$.println("Length:", $.len(sliceWithCap), "Capacity:", $.cap(sliceWithCap))
	$.println("\nAppend and capacity growth:")
	let growingSlice = $.makeSlice<number>(0, 2, "number")
	$.println("Initial - Length:", $.len(growingSlice), "Capacity:", $.cap(growingSlice))
	for (let i = 1; i <= 4; i++) {
		growingSlice = $.append(growingSlice, i)
		$.println("After append", i, "- Length:", $.len(growingSlice), "Capacity:", $.cap(growingSlice))
	}
	$.println("\nSlicing operations and shared backing arrays:")
	let original = [10, 20, 30, 40, 50]
	$.println("Original slice - Length:", $.len(original), "Capacity:", $.cap(original))
	let slice1 = $.goSlice(original, 1, 3)
	$.println("slice1 := original[1:3] - Values:", slice1[0], slice1[1])
	$.println("slice1 - Length:", $.len(slice1), "Capacity:", $.cap(slice1))
	let slice2 = $.goSlice(original, 1, 3, 4)
	$.println("slice2 := original[1:3:4] - Values:", slice2[0], slice2[1])
	$.println("slice2 - Length:", $.len(slice2), "Capacity:", $.cap(slice2))
	$.println("\nShared backing arrays:")
	slice1[0] = 999
	$.println("After slice1[0] = 999:")
	$.println("original[1]:", original[1], "slice1[0]:", slice1[0], "slice2[0]:", slice2[0])
	let sum = 0
	for (let idx = 0; idx < $.len(slice); idx++) {
		let val = slice[idx]
		sum += val
		$.println("Range idx:", idx, "val:", val)
	}
	$.println("Range sum:", sum)
	let prod = 1
	for (let i = 1; i <= 3; i++) {
		prod *= i
	}
	$.println("Product via for:", prod)
	let instance = $.varRef($.markAsStructValue(NewMyStruct("go-script").clone()))
	$.println("instance.MyString:", instance.value.GetMyString())
	instance.value.MyInt = 42
	let copyInst = $.markAsStructValue(instance.value.clone())
	copyInst.MyInt = 7
	$.println("instance.MyInt:", instance.value.MyInt, "copyInst.MyInt:", copyInst.MyInt)
	let ptr = new MyStruct()
	$.pointerValue(ptr).MyInt = 9
	$.println("ptr.MyInt:", $.pointerValue(ptr).MyInt)
	let deref = $.markAsStructValue($.pointerValue(ptr).clone())
	deref.MyInt = 8
	$.println("After deref assign, ptr.MyInt:", $.pointerValue(ptr).MyInt, "deref.MyInt:", deref.MyInt)
	$.pointerValue(ptr).myBool = true
	$.println("ptr.GetMyBool():", $.pointerValue(ptr).GetMyBool())
	let comp = $.varRef($.markAsStructValue(new MyStruct({MyInt: 100, MyString: "composite", myBool: false})))
	$.println("comp fields:", comp.value.MyInt, comp.value.GetMyString(), comp.value.GetMyBool())
	let [x, ] = vals()
	let [, y] = vals()
	$.println("vals x:", x, "y:", y)
	if (a > b) {
		$.println("If branch: a>b")
	} else {
		$.println("Else branch: a<=b")
	}
	$.println("\nGoroutines and Channels:")
	let ch = $.makeChannel<string>(0, "", "both")
	queueMicrotask(async () => { await (async (): Promise<void> => {
	$.println("Goroutine: Sending message")
	await $.chanSend(ch, "Hello from goroutine!")
})() })
	let msg = await $.chanRecv(ch)
	$.println("Main goroutine: Received message:", msg)
	$.println("\nSelect statement:")
	let selectCh = $.makeChannel<string>(0, "", "both")
	queueMicrotask(async () => { await (async (): Promise<void> => {
	await $.chanSend(selectCh, "Message from select goroutine!")
})() })
	let anotherCh = $.makeChannel<string>(0, "", "both")
	const [__goscriptSelectHasReturn4514, __goscriptSelectValue4514] = await $.selectStatement([
		{
			id: 0,
			isSend: false,
			channel: selectCh,
			onSelected: async (result) => {
				let selectMsg = result.value
				$.println("Select received:", selectMsg)
			}
		},
		{
			id: 1,
			isSend: false,
			channel: anotherCh,
			onSelected: async (result) => {
				let anotherMsg = result.value
				$.println("Select received from another channel:", anotherMsg)
			}
		}
	], false)
	if (__goscriptSelectHasReturn4514) {
		return __goscriptSelectValue4514
	}
	$.println("\nFunction Literals:")
	let add = (x: number, y: number): number => {
	return x + y
}
	sum = add(5, 7)
	$.println("Function literal result:", sum)
}


if ($.isMainScript(import.meta)) {
	await main()
}

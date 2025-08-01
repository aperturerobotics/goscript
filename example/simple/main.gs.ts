import * as $ from "@goscript/builtin/index.js";

export class MyStruct {
	// MyInt is a public integer field, initialized to zero.
	public get MyInt(): number {
		return this._fields.MyInt.value
	}
	public set MyInt(value: number) {
		this._fields.MyInt.value = value
	}

	// MyString is a public string field, initialized to empty string.
	public get MyString(): string {
		return this._fields.MyString.value
	}
	public set MyString(value: string) {
		this._fields.MyString.value = value
	}

	// myBool is a private boolean field, initialized to false.
	public get myBool(): boolean {
		return this._fields.myBool.value
	}
	public set myBool(value: boolean) {
		this._fields.myBool.value = value
	}

	public _fields: {
		MyInt: $.VarRef<number>;
		MyString: $.VarRef<string>;
		myBool: $.VarRef<boolean>;
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
		return cloned
	}

	// GetMyString returns the MyString field.
	public GetMyString(): string {
		const m = this
		return m.MyString
	}

	// GetMyBool returns the myBool field.
	public GetMyBool(): boolean {
		const m = this
		return m.myBool
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'MyStruct',
	  new MyStruct(),
	  [{ name: "GetMyString", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "GetMyBool", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "boolean" } }] }],
	  MyStruct,
	  {"MyInt": { kind: $.TypeKind.Basic, name: "number" }, "MyString": { kind: $.TypeKind.Basic, name: "string" }, "myBool": { kind: $.TypeKind.Basic, name: "boolean" }}
	);
}

// NewMyStruct creates a new MyStruct instance.
export function NewMyStruct(s: string): MyStruct {
	return $.markAsStructValue(new MyStruct({MyString: s}))
}

export function vals(): [number, number] {
	return [1, 2]
}

export async function main(): Promise<void> {
	console.log("Hello from GoScript example!")

	// Basic arithmetic
	let [a, b] = [10, 3]
	console.log("Addition:", a + b, "Subtraction:", a - b, "Multiplication:", a * b, "Division:", a / b, "Modulo:", a % b)

	// Boolean logic and comparisons
	console.log("Logic &&:", true && false, "||:", true || false, "!:!", !true)
	console.log("Comparisons:", a == b, a != b, a < b, a > b, a <= b, a >= b)

	// string(rune) conversion
	let r: number = 88
	let s = $.runeOrStringToString(r)
	console.log("string('X'):", s)

	// 'y'
	let r2: number = 121
	let s2 = $.runeOrStringToString(r2)
	console.log("string(121):", s2)

	// '√'
	let r3: number = 0x221A
	let s3 = $.runeOrStringToString(r3)
	console.log("string(0x221A):", s3)

	// Arrays
	let arr = $.arrayToSlice<number>([1, 2, 3])
	console.log("Array elements:", arr![0], arr![1], arr![2])

	// Slices - Basic initialization and access
	let slice = $.arrayToSlice<number>([4, 5, 6])
	console.log("Slice elements:", slice![0], slice![1], slice![2])
	console.log("Slice length:", $.len(slice), "capacity:", $.cap(slice))

	let sliceWithCap = $.makeSlice<number>(3, 5, 'number')
	console.log("\nSlice created with make([]int, 3, 5):")
	console.log("Length:", $.len(sliceWithCap), "Capacity:", $.cap(sliceWithCap))

	console.log("\nAppend and capacity growth:")
	let growingSlice = $.makeSlice<number>(0, 2, 'number')
	console.log("Initial - Length:", $.len(growingSlice), "Capacity:", $.cap(growingSlice))

	for (let i = 1; i <= 4; i++) {
		growingSlice = $.append(growingSlice, i)
		console.log("After append", i, "- Length:", $.len(growingSlice), "Capacity:", $.cap(growingSlice))
	}

	console.log("\nSlicing operations and shared backing arrays:")
	let original = $.arrayToSlice<number>([10, 20, 30, 40, 50])
	console.log("Original slice - Length:", $.len(original), "Capacity:", $.cap(original))

	let slice1 = $.goSlice(original, 1, 3)
	console.log("slice1 := original[1:3] - Values:", slice1![0], slice1![1])
	console.log("slice1 - Length:", $.len(slice1), "Capacity:", $.cap(slice1))

	let slice2 = $.goSlice(original, 1, 3, 4)
	console.log("slice2 := original[1:3:4] - Values:", slice2![0], slice2![1])
	console.log("slice2 - Length:", $.len(slice2), "Capacity:", $.cap(slice2))

	console.log("\nShared backing arrays:")
	slice1![0] = 999
	console.log("After slice1[0] = 999:")
	console.log("original[1]:", original![1], "slice1[0]:", slice1![0], "slice2[0]:", slice2![0])

	let sum = 0
	for (let idx = 0; idx < $.len(slice); idx++) {
		const val = slice![idx]
		{
			sum += val
			console.log("Range idx:", idx, "val:", val)
		}
	}
	console.log("Range sum:", sum)

	// Basic for loop
	let prod = 1
	for (let i = 1; i <= 3; i++) {
		prod *= i
	}
	console.log("Product via for:", prod)

	// Struct, pointers, copy independence
	let instance = $.markAsStructValue(NewMyStruct("go-script").clone())
	console.log("instance.MyString:", instance.GetMyString())
	instance.MyInt = 42
	let copyInst = $.markAsStructValue(instance.clone())
	copyInst.MyInt = 7
	console.log("instance.MyInt:", instance.MyInt, "copyInst.MyInt:", copyInst.MyInt)

	// Pointer initialization and dereference assignment
	let ptr = new MyStruct()
	ptr!.MyInt = 9
	console.log("ptr.MyInt:", ptr!.MyInt)
	let deref = $.markAsStructValue(ptr!.clone())
	deref.MyInt = 8
	console.log("After deref assign, ptr.MyInt:", ptr!.MyInt, "deref.MyInt:", deref.MyInt)

	// Method calls on pointer receiver
	ptr!.myBool = true
	console.log("ptr.GetMyBool():", ptr!.GetMyBool())

	// Composite literal assignment
	let comp = $.markAsStructValue(new MyStruct({MyInt: 100, MyString: "composite", myBool: false}))
	console.log("comp fields:", comp.MyInt, comp.GetMyString(), comp.GetMyBool())

	// Multiple return values and blank identifier
	let [x, ] = vals()
	let [, y] = vals()
	console.log("vals x:", x, "y:", y)

	// If/else
	if (a > b) {
		console.log("If branch: a>b")
	}
	 else {
		console.log("Else branch: a<=b")
	}

	// Switch statement
	switch (a) {
		case 10:
			console.log("Switch case 10")
			break
		default:
			console.log("Switch default")
			break
	}

	// Goroutines and Channels
	console.log("\nGoroutines and Channels:")
	let ch = $.makeChannel<string>(0, "", 'both')
	queueMicrotask(async () => {
		console.log("Goroutine: Sending message")
		await $.chanSend(ch, "Hello from goroutine!")
	})

	let msg = await $.chanRecv(ch)
	console.log("Main goroutine: Received message:", msg)

	// Select statement
	console.log("\nSelect statement:")
	let selectCh = $.makeChannel<string>(0, "", 'both')
	queueMicrotask(async () => {
		await $.chanSend(selectCh, "Message from select goroutine!")
	})
	let anotherCh = $.makeChannel<string>(0, "", 'both')

	// Add another case
	const [_select_has_return_5969, _select_value_5969] = await $.selectStatement([
		{
			id: 0,
			isSend: false,
			channel: selectCh,
			onSelected: async (result) => {
				const selectMsg = result.value
				console.log("Select received:", selectMsg)
			}
		},
		{
			id: 1,
			isSend: false,
			channel: anotherCh,
			onSelected: async (result) => {
				const anotherMsg = result.value
				console.log("Select received from another channel:", anotherMsg)
			}
		},
	], false)
	if (_select_has_return_5969) {
		return _select_value_5969!
	}
	// If _select_has_return_5969 is false, continue execution

	// Function Literals
	console.log("\nFunction Literals:")
	let add = (x: number, y: number): number => {
		return x + y
	}
	sum = add!(5, 7)
	console.log("Function literal result:", sum)
}


import * as $ from "@goscript/builtin/index.js"

import * as json from "@goscript/encoding/json/index.js"

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
	  'main.MyStruct',
	  new MyStruct(),
	  [{ name: "GetMyString", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "GetMyBool", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
	  MyStruct,
	  {"MyInt": { kind: $.TypeKind.Basic, name: "int" }, "MyString": { kind: $.TypeKind.Basic, name: "string" }, "myBool": { kind: $.TypeKind.Basic, name: "bool" }}
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
	$.println("Hello from GoScript example!")

	// Basic arithmetic
	let [a, b] = [10, 3]
	$.println("Addition:", a + b, "Subtraction:", a - b, "Multiplication:", a * b, "Division:", Math.trunc(a / b), "Modulo:", a % b)

	// Boolean logic and comparisons
	$.println("Logic &&:", true && false, "||:", true || false, "!:!", !true)
	$.println("Comparisons:", a == b, a != b, a < b, a > b, a <= b, a >= b)

	// string(rune) conversion
	let r: number = 88
	let s = $.runeOrStringToString(r)
	$.println("string('X'):", s)

	// 'y'
	let r2: number = 121
	let s2 = $.runeOrStringToString(r2)
	$.println("string(121):", s2)

	// '√'
	let r3: number = 0x221A
	let s3 = $.runeOrStringToString(r3)
	$.println("string(0x221A):", s3)

	// Arrays
	let arr = $.arrayToSlice<number>([1, 2, 3])
	$.println("Array elements:", arr![0], arr![1], arr![2])

	// Slices - Basic initialization and access
	let slice = $.arrayToSlice<number>([4, 5, 6])
	$.println("Slice elements:", slice![0], slice![1], slice![2])
	$.println("Slice length:", $.len(slice), "capacity:", $.cap(slice))

	let sliceWithCap = $.makeSlice<number>(3, 5, 'number')
	$.println("\nSlice created with make([]int, 3, 5):")
	$.println("Length:", $.len(sliceWithCap), "Capacity:", $.cap(sliceWithCap))

	$.println("\nAppend and capacity growth:")
	let growingSlice = $.makeSlice<number>(0, 2, 'number')
	$.println("Initial - Length:", $.len(growingSlice), "Capacity:", $.cap(growingSlice))

	for (let i = 1; i <= 4; i++) {
		growingSlice = $.append(growingSlice, i)
		$.println("After append", i, "- Length:", $.len(growingSlice), "Capacity:", $.cap(growingSlice))
	}

	$.println("\nSlicing operations and shared backing arrays:")
	let original = $.arrayToSlice<number>([10, 20, 30, 40, 50])
	$.println("Original slice - Length:", $.len(original), "Capacity:", $.cap(original))

	let slice1 = $.goSlice(original, 1, 3)
	$.println("slice1 := original[1:3] - Values:", slice1![0], slice1![1])
	$.println("slice1 - Length:", $.len(slice1), "Capacity:", $.cap(slice1))

	let slice2 = $.goSlice(original, 1, 3, 4)
	$.println("slice2 := original[1:3:4] - Values:", slice2![0], slice2![1])
	$.println("slice2 - Length:", $.len(slice2), "Capacity:", $.cap(slice2))

	$.println("\nShared backing arrays:")
	slice1![0] = 999
	$.println("After slice1[0] = 999:")
	$.println("original[1]:", original![1], "slice1[0]:", slice1![0], "slice2[0]:", slice2![0])

	let sum = 0
	for (let idx = 0; idx < $.len(slice); idx++) {
		let val = slice![idx]
		{
			sum += val
			$.println("Range idx:", idx, "val:", val)
		}
	}
	$.println("Range sum:", sum)

	// Basic for loop
	let prod = 1
	for (let i = 1; i <= 3; i++) {
		prod *= i
	}
	$.println("Product via for:", prod)

	// Struct, pointers, copy independence
	let instance = $.varRef(NewMyStruct("go-script"))
	$.println("instance.MyString:", instance!.value.GetMyString())
	instance!.value.MyInt = 42
	let copyInst = $.markAsStructValue(instance!.value.clone())
	copyInst.MyInt = 7
	$.println("instance.MyInt:", instance!.value.MyInt, "copyInst.MyInt:", copyInst.MyInt)

	// Pointer initialization and dereference assignment
	let ptr = new MyStruct()
	ptr!.MyInt = 9
	$.println("ptr.MyInt:", ptr!.MyInt)
	let deref = $.markAsStructValue(ptr!.clone())
	deref.MyInt = 8
	$.println("After deref assign, ptr.MyInt:", ptr!.MyInt, "deref.MyInt:", deref.MyInt)

	// Method calls on pointer receiver
	ptr!.myBool = true
	$.println("ptr.GetMyBool():", ptr!.GetMyBool())

	// Composite literal assignment
	let comp = $.varRef($.markAsStructValue(new MyStruct({MyInt: 100, MyString: "composite", myBool: false})))
	$.println("comp fields:", comp!.value.MyInt, comp!.value.GetMyString(), comp!.value.GetMyBool())

	// Multiple return values and blank identifier
	let [x, ] = vals()
	let [, y] = vals()
	$.println("vals x:", x, "y:", y)

	// If/else
	if (a > b) {
		$.println("If branch: a>b")
	} else {
		$.println("Else branch: a<=b")
	}

	// Switch statement
	switch (a) {
		case 10: {
			$.println("Switch case 10")
			break
		}
		default: {
			$.println("Switch default")
			break
		}
	}

	// Goroutines and Channels
	$.println("\nGoroutines and Channels:")
	let ch = $.makeChannel<string>(0, "", 'both')
	queueMicrotask(async () => {
		$.println("Goroutine: Sending message")
		await $.chanSend(ch, "Hello from goroutine!")
	})

	let msg = await $.chanRecv(ch)
	$.println("Main goroutine: Received message:", msg)

	// Select statement
	$.println("\nSelect statement:")
	let selectCh = $.makeChannel<string>(0, "", 'both')
	queueMicrotask(async () => {
		await $.chanSend(selectCh, "Message from select goroutine!")
	})
	let anotherCh = $.makeChannel<string>(0, "", 'both')

	// Add another case
	const [_select_has_return_6f59, _select_value_6f59] = await $.selectStatement([
		{
			id: 0,
			isSend: false,
			channel: selectCh,
			onSelected: async (result) => {
				const selectMsg = result.value
				$.println("Select received:", selectMsg)
			}
		},
		{
			id: 1,
			isSend: false,
			channel: anotherCh,
			onSelected: async (result) => {
				const anotherMsg = result.value
				$.println("Select received from another channel:", anotherMsg)
			}
		},
	], false)
	if (_select_has_return_6f59) {
		return _select_value_6f59!
	}
	// If _select_has_return_6f59 is false, continue execution

	// Function Literals
	$.println("\nFunction Literals:")
	let add = (x: number, y: number): number => {
		return x + y
	}
	sum = add!(5, 7)
	$.println("Function literal result:", sum)

	// JSON encoding/decoding
	$.println("\nJSON encoding/decoding:")
	class Person {
		public get Name(): string {
			return this._fields.Name.value
		}
		public set Name(value: string) {
			this._fields.Name.value = value
		}

		public get Age(): number {
			return this._fields.Age.value
		}
		public set Age(value: number) {
			this._fields.Age.value = value
		}

		public _fields: {
			Name: $.VarRef<string>;
			Age: $.VarRef<number>;
		}

		constructor(init?: Partial<{Age?: number, Name?: string}>) {
			this._fields = {
				Name: $.varRef(init?.Name ?? ""),
				Age: $.varRef(init?.Age ?? 0)
			}
		}

		public clone(): Person {
			const cloned = new Person()
			cloned._fields = {
				Name: $.varRef(this._fields.Name.value),
				Age: $.varRef(this._fields.Age.value)
			}
			return cloned
		}

		// Register this type with the runtime type system
		static __typeInfo = $.registerStructType(
		  'main.Person',
		  new Person(),
		  [],
		  Person,
		  {"Name": { type: { kind: $.TypeKind.Basic, name: "string" }, tag: "json:\"name\"" }, "Age": { type: { kind: $.TypeKind.Basic, name: "int" }, tag: "json:\"age\"" }}
		);
	}

	// Marshal struct to JSON
	let person = $.markAsStructValue(new Person({Age: 30, Name: "Alice"}))
	let [jsonData, err] = await json.Marshal(person)
	if (err != null) {
		$.println("Marshal error:", err!.Error())
	} else {
		$.println("Marshaled JSON:", $.bytesToString(jsonData))
	}

	// Unmarshal JSON to struct
	let jsonStr = `{"name":"Bob","age":25}`
	let person2: $.VarRef<Person> = $.varRef(new Person())
	err = await json.Unmarshal($.stringToBytes(jsonStr), person2)
	if (err != null) {
		$.println("Unmarshal error:", err!.Error())
	} else {
		$.println("Unmarshaled:", person2!.value.Name, person2!.value.Age)
	}
}


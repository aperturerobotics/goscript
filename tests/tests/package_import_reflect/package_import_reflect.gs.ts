// Generated file based on package_import_reflect.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

export class Person {
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
	  {"Name": { kind: $.TypeKind.Basic, name: "string" }, "Age": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export type Stringer = null | {
	String(): string
}

$.registerInterfaceType(
  'main.Stringer',
  null, // Zero value for interface is null
  [{ name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export async function main(): Promise<void> {
	// Test basic reflect functions
	let x = 42
	let v = $.markAsStructValue(reflect.ValueOf(x).clone())
	$.println("Type:", reflect.TypeOf(x)!.String())
	$.println("Value:", v.Int())
	$.println("Kind:", reflect.Kind_String(v.Kind()))

	// Test with string
	let s = "hello"
	let sv = $.markAsStructValue(reflect.ValueOf(s).clone())
	$.println("String type:", reflect.TypeOf(s)!.String())
	$.println("String value:", sv.String())
	$.println("String kind:", reflect.Kind_String(sv.Kind()))

	// Test with slice
	let slice = $.arrayToSlice<number>([1, 2, 3])
	let sliceV = $.markAsStructValue(reflect.ValueOf(slice).clone())
	$.println("Slice type:", reflect.TypeOf(slice)!.String())
	$.println("Slice len:", sliceV.Len())
	$.println("Slice kind:", reflect.Kind_String(sliceV.Kind()))

	// Test DeepEqual
	let a = $.arrayToSlice<number>([1, 2, 3])
	let b = $.arrayToSlice<number>([1, 2, 3])
	let c = $.arrayToSlice<number>([1, 2, 4])
	$.println("DeepEqual a==b:", reflect.DeepEqual(a, b))
	$.println("DeepEqual a==c:", reflect.DeepEqual(a, c))

	// Test Zero value
	let zeroInt = $.markAsStructValue(reflect.Zero(reflect.TypeOf(42)).clone())
	$.println("Zero int:", zeroInt.Int())

	// Test type construction functions
	let intType = reflect.TypeOf(0)
	let sliceType = reflect.SliceOf(intType)
	$.println("SliceOf int:", sliceType!.String())
	$.println("SliceOf kind:", reflect.Kind_String(sliceType!.Kind()))

	let arrayType = reflect.ArrayOf(5, intType)
	$.println("ArrayOf 5 int:", arrayType!.String())
	$.println("ArrayOf kind:", reflect.Kind_String(arrayType!.Kind()))

	let ptrType = reflect.PointerTo(intType)
	$.println("PointerTo int:", ptrType!.String())
	$.println("PointerTo kind:", reflect.Kind_String(ptrType!.Kind()))

	// Test PtrTo (alias for PointerTo)
	let ptrType2 = reflect.PtrTo(intType)
	$.println("PtrTo int:", ptrType2!.String())

	// Test New and Indirect
	let newVal = $.markAsStructValue(reflect.New(intType).clone())
	$.println("New int type:", newVal.Type()!.String())
	let indirectVal = $.markAsStructValue(reflect.Indirect(newVal).clone())
	$.println("Indirect type:", indirectVal.Type()!.String())

	// Test Zero values for different types
	let zeroString = $.markAsStructValue(reflect.Zero(reflect.TypeOf("")).clone())
	$.println("Zero string:", zeroString.String())

	let zeroBool = $.markAsStructValue(reflect.Zero(reflect.TypeOf(true)).clone())
	$.println("Zero bool:", zeroBool.String()) // Should show the type since it's not a string

	// Test Swapper function
	let testSlice = $.arrayToSlice<number>([1, 2, 3, 4, 5])
	let swapper = reflect.Swapper(testSlice)
	$.println("Before swap:", testSlice![0], testSlice![4])
	swapper!(0, 4)
	$.println("After swap:", testSlice![0], testSlice![4])

	// Test Copy function
	let src = $.arrayToSlice<number>([10, 20, 30])
	let dst = $.makeSlice<number>(2, undefined, 'number')
	let srcVal = $.markAsStructValue(reflect.ValueOf(src).clone())
	let dstVal = $.markAsStructValue(reflect.ValueOf(dst).clone())
	let copied = reflect.Copy(dstVal, srcVal)
	$.println("Copied elements:", copied)
	$.println("Dst after copy:", dst![0], dst![1])

	// Test struct reflection
	let person = $.markAsStructValue(new Person({Age: 30, Name: "Alice"}))
	let personType = reflect.TypeOf(person)
	$.println("Struct type:", personType!.String())
	$.println("Struct kind:", reflect.Kind_String(personType!.Kind()))

	let personVal = $.markAsStructValue(reflect.ValueOf(person).clone())
	$.println("Struct value type:", personVal.Type()!.String())

	// Test with different kinds
	let f: number = 3.14
	let fVal = $.markAsStructValue(reflect.ValueOf(f).clone())
	$.println("Float kind:", reflect.Kind_String(fVal.Kind()))

	let boolVal: boolean = true
	let bVal = $.markAsStructValue(reflect.ValueOf(boolVal).clone())
	$.println("Bool kind:", reflect.Kind_String(bVal.Kind()))

	// Test type equality
	let intType1 = reflect.TypeOf(1)
	let intType2 = reflect.TypeOf(2)
	$.println("Same int types:", intType1!.String() == intType2!.String())

	let stringType = reflect.TypeOf("test")
	$.println("Different types:", intType1!.String() == stringType!.String())

	// Test map type construction
	let mapType = reflect.MapOf(reflect.TypeOf(""), reflect.TypeOf(0))
	$.println("MapOf string->int:", mapType!.String())
	$.println("MapOf kind:", reflect.Kind_String(mapType!.Kind()))

	// Test channel direction constants
	$.println("Chan kinds available")

	// Test pointer operations
	// Note: Pointer-to-pointer reflection has a compiler limitation
	// var ptr *int = &x
	// ptrVal := reflect.ValueOf(&ptr)
	// println("Pointer type:", ptrVal.Type().String())
	// println("Pointer kind:", ptrVal.Kind().String())

	// Test interface type
	let iface: null | any = "hello"
	let ifaceVal = $.markAsStructValue(reflect.ValueOf(iface).clone())
	$.println("Interface value type:", ifaceVal.Type()!.String())
	$.println("Interface kind:", reflect.Kind_String(ifaceVal.Kind()))

	// Test function type
	let fn = (() => {
		const fn = (): string => {
			return ""
		}
		fn.__typeInfo = {
			kind: $.TypeKind.Function,
			params: ['int'],
			results: ['string'],
		}
		return fn
	})()
	let fnVal = $.markAsStructValue(reflect.ValueOf(fn).clone())
	$.println("Function type:", fnVal.Type()!.String())
	$.println("Function kind:", reflect.Kind_String(fnVal.Kind()))

	// Test more complex types
	let complexSlice = $.arrayToSlice<$.Slice<number>>([[ 1, 2 ], [ 3, 4 ]], 2)
	let complexVal = $.markAsStructValue(reflect.ValueOf(complexSlice).clone())
	$.println("Complex slice type:", complexVal.Type()!.String())
	$.println("Complex slice kind:", reflect.Kind_String(complexVal.Kind()))
	$.println("Complex slice len:", complexVal.Len())

	// Test type methods
	$.println("Type size methods:")
	$.println("Int size:", reflect.TypeOf(0)!.Size())
	$.println("String size:", reflect.TypeOf("")!.Size())
	$.println("Slice size:", reflect.TypeOf($.arrayToSlice<number>([]))!.Size())

	// Test enhanced API surface - functions to implement
	$.println("Enhanced API tests:")

	// Test MakeSlice
	let sliceTypeInt = reflect.SliceOf(reflect.TypeOf(0))
	let newSlice = $.markAsStructValue(reflect.MakeSlice(sliceTypeInt, 3, 5).clone())
	$.println("MakeSlice len:", newSlice.Len())
	$.println("MakeSlice type:", newSlice.Type()!.String())

	// Test MakeMap
	let mapTypeStr = reflect.MapOf(reflect.TypeOf(""), reflect.TypeOf(0))
	let newMap = $.markAsStructValue(reflect.MakeMap(mapTypeStr).clone())
	$.println("MakeMap type:", newMap.Type()!.String())

	// Test Append
	let originalSlice = $.markAsStructValue(reflect.ValueOf($.arrayToSlice<number>([1, 2])).clone())
	let appendedSlice = $.markAsStructValue(reflect.Append(originalSlice, reflect.ValueOf(3)).clone())
	$.println("Append result len:", appendedSlice.Len())

	// Test channel types
	let chanType = reflect.ChanOf(reflect.BothDir, reflect.TypeOf(0))
	$.println("ChanOf type:", chanType!.String())
	$.println("ChanOf kind:", reflect.Kind_String(chanType!.Kind()))

	// Test MakeChan
	let newChan = $.markAsStructValue(reflect.MakeChan(chanType, 0).clone())
	$.println("MakeChan type:", newChan.Type()!.String())

	// Test different channel directions
	let sendOnlyChan = reflect.ChanOf(reflect.SendDir, reflect.TypeOf(""))
	$.println("SendOnly chan type:", sendOnlyChan!.String())

	let recvOnlyChan = reflect.ChanOf(reflect.RecvDir, reflect.TypeOf(true))
	$.println("RecvOnly chan type:", recvOnlyChan!.String())

	// Test channels with different element types
	let stringChanType = reflect.ChanOf(reflect.BothDir, reflect.TypeOf(""))
	let stringChan = $.markAsStructValue(reflect.MakeChan(stringChanType, 5).clone())
	$.println("String chan type:", stringChan.Type()!.String())
	$.println("String chan elem type:", stringChan.Type()!.Elem()!.String())

	// Test buffered vs unbuffered channels
	let unbufferedChan = $.markAsStructValue(reflect.MakeChan(chanType, 0).clone())
	let bufferedChan = $.markAsStructValue(reflect.MakeChan(chanType, 10).clone())
	$.println("Unbuffered chan type:", unbufferedChan.Type()!.String())
	$.println("Buffered chan type:", bufferedChan.Type()!.String())

	// Test channel reflection properties
	$.println("Chan elem type:", chanType!.Elem()!.String())
	$.println("Chan elem kind:", reflect.Kind_String(chanType!.Elem()!.Kind()))
	$.println("Chan size:", chanType!.Size())

	// Test Select functionality
	let intChan = $.markAsStructValue(reflect.MakeChan(reflect.ChanOf(reflect.BothDir, reflect.TypeOf(0)), 1).clone())
	let strChan = $.markAsStructValue(reflect.MakeChan(reflect.ChanOf(reflect.BothDir, reflect.TypeOf("")), 1).clone())

	// Send values to only the string channel to make select deterministic
	strChan.Send(reflect.ValueOf("hello"))

	let cases = $.arrayToSlice<reflect.SelectCase>([$.markAsStructValue(new reflect.SelectCase({Chan: intChan, Dir: reflect.SelectRecv})), $.markAsStructValue(new reflect.SelectCase({Chan: strChan, Dir: reflect.SelectRecv})), $.markAsStructValue(new reflect.SelectCase({Dir: reflect.SelectDefault}))])
	let [chosen, recv, recvOK] = reflect.Select(cases)
	$.println("Select chosen:", chosen, "recvOK:", recvOK)

	// Print the actual received value
	if (recv.IsValid()) {
		$.println("Select recv type:", recv.Type()!.String())
		// Print the actual received value
		if (chosen == 0) {
			$.println("Select recv value:", recv.Int())
		} else if (chosen == 1) {
			$.println("Select recv value:", recv.String())
		}
	} else {
		$.println("Select recv type: invalid")
	}
}


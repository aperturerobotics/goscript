// Generated file based on package_import_reflect.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

export type Stringer = null | {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

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
		Name: $.VarRef<string>
		Age: $.VarRef<number>
	}

	constructor(init?: Partial<{Name?: string, Age?: number}>) {
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
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Person",
		new Person(),
		[],
		Person,
		{"Name": { kind: $.TypeKind.Basic, name: "string" }, "Age": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): Promise<void> {
	// Test basic reflect functions
	let x = 42
	let v = $.markAsStructValue((reflect.ValueOf(x)).clone())
	$.println("Type:", $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})).String())
	$.println("Value:", $.markAsStructValue((v).clone()).Int())
	$.println("Kind:", reflect.Kind_String($.markAsStructValue((v).clone()).Kind()))

	// Test with string
	let s = "hello"
	let sv = $.markAsStructValue((reflect.ValueOf(s)).clone())
	$.println("String type:", $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})).String())
	$.println("String value:", $.markAsStructValue((sv).clone()).String())
	$.println("String kind:", reflect.Kind_String($.markAsStructValue((sv).clone()).Kind()))

	// Test with slice
	let slice = $.arrayToSlice<number>([1, 2, 3])
	let sliceV = $.markAsStructValue((reflect.ValueOf($.interfaceValue<any>(slice, "[]int"))).clone())
	$.println("Slice type:", $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, zero: () => null }})).String())
	$.println("Slice len:", $.markAsStructValue((sliceV).clone()).Len())
	$.println("Slice kind:", reflect.Kind_String($.markAsStructValue((sliceV).clone()).Kind()))

	// Test DeepEqual
	let a = $.arrayToSlice<number>([1, 2, 3])
	let b = $.arrayToSlice<number>([1, 2, 3])
	let c = $.arrayToSlice<number>([1, 2, 4])
	$.println("DeepEqual a==b:", reflect.DeepEqual($.interfaceValue<any>(a, "[]int"), $.interfaceValue<any>(b, "[]int")))
	$.println("DeepEqual a==c:", reflect.DeepEqual($.interfaceValue<any>(a, "[]int"), $.interfaceValue<any>(c, "[]int")))

	// Test Zero value
	let zeroInt = $.markAsStructValue((reflect.Zero($.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})))).clone())
	$.println("Zero int:", $.markAsStructValue((zeroInt).clone()).Int())

	// Test type construction functions
	let intType = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})
	let sliceType = reflect.SliceOf($.pointerValue(intType))
	$.println("SliceOf int:", $.pointerValue(sliceType).String())
	$.println("SliceOf kind:", reflect.Kind_String($.pointerValue(sliceType).Kind()))

	let arrayType = reflect.ArrayOf(5, $.pointerValue(intType))
	$.println("ArrayOf 5 int:", $.pointerValue(arrayType).String())
	$.println("ArrayOf kind:", reflect.Kind_String($.pointerValue(arrayType).Kind()))

	let ptrType = reflect.PointerTo($.pointerValue(intType))
	$.println("PointerTo int:", $.pointerValue(ptrType).String())
	$.println("PointerTo kind:", reflect.Kind_String($.pointerValue(ptrType).Kind()))

	// Test PtrTo (alias for PointerTo)
	let ptrType2 = reflect.PtrTo($.pointerValue(intType))
	$.println("PtrTo int:", $.pointerValue(ptrType2).String())

	// Test New and Indirect
	let newVal = $.markAsStructValue((reflect.New($.pointerValue(intType))).clone())
	$.println("New int type:", $.pointerValue($.markAsStructValue((newVal).clone()).Type()).String())
	let indirectVal = $.markAsStructValue((reflect.Indirect($.markAsStructValue((newVal).clone()))).clone())
	$.println("Indirect type:", $.pointerValue($.markAsStructValue((indirectVal).clone()).Type()).String())

	// Test Zero values for different types
	let zeroString = $.markAsStructValue((reflect.Zero($.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})))).clone())
	$.println("Zero string:", $.markAsStructValue((zeroString).clone()).String())

	let zeroBool = $.markAsStructValue((reflect.Zero($.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "bool" }, zero: () => false }})))).clone())
	$.println("Zero bool:", $.markAsStructValue((zeroBool).clone()).String())

	// Test Swapper function
	let testSlice = $.arrayToSlice<number>([1, 2, 3, 4, 5])
	let swapper = reflect.Swapper($.interfaceValue<any>(testSlice, "[]int"))
	$.println("Before swap:", testSlice![0], testSlice![4])
	await swapper!(0, 4)
	$.println("After swap:", testSlice![0], testSlice![4])

	// Test Copy function
	let src = $.arrayToSlice<number>([10, 20, 30])
	let dst = $.makeSlice<number>(2, undefined, "number")
	let srcVal = $.markAsStructValue((reflect.ValueOf($.interfaceValue<any>(src, "[]int"))).clone())
	let dstVal = $.markAsStructValue((reflect.ValueOf($.interfaceValue<any>(dst, "[]int"))).clone())
	let copied = reflect.Copy($.markAsStructValue((dstVal).clone()), $.markAsStructValue((srcVal).clone()))
	$.println("Copied elements:", copied)
	$.println("Dst after copy:", dst![0], dst![1])

	// Test struct reflection
	let person = $.markAsStructValue(new Person({Name: "Alice", Age: 30}))
	let personType = reflect.TypeFor({T: { type: "main.Person", zero: () => $.markAsStructValue(new Person()) }})
	$.println("Struct type:", $.pointerValue(personType).String())
	$.println("Struct kind:", reflect.Kind_String($.pointerValue(personType).Kind()))

	let personVal = $.markAsStructValue((reflect.ValueOf($.interfaceValue<any>($.markAsStructValue((person).clone()), "main.Person"))).clone())
	$.println("Struct value type:", $.pointerValue($.markAsStructValue((personVal).clone()).Type()).String())

	// Test with different kinds
	let f: number = 3.14
	let fVal = $.markAsStructValue((reflect.ValueOf(f)).clone())
	$.println("Float kind:", reflect.Kind_String($.markAsStructValue((fVal).clone()).Kind()))

	let boolVal: boolean = true
	let bVal = $.markAsStructValue((reflect.ValueOf(boolVal)).clone())
	$.println("Bool kind:", reflect.Kind_String($.markAsStructValue((bVal).clone()).Kind()))

	// Test type equality
	let intType1 = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})
	let intType2 = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})
	$.println("Same int types:", $.pointerValue(intType1).String() == $.pointerValue(intType2).String())

	let stringType = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})
	$.println("Different types:", $.pointerValue(intType1).String() == $.pointerValue(stringType).String())

	// Test map type construction
	let mapType = reflect.MapOf($.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})), $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})))
	$.println("MapOf string->int:", $.pointerValue(mapType).String())
	$.println("MapOf kind:", reflect.Kind_String($.pointerValue(mapType).Kind()))

	// Test channel direction constants
	$.println("Chan kinds available")

	// Test pointer operations
	// Note: Pointer-to-pointer reflection has a compiler limitation
	// var ptr *int = &x
	// ptrVal := reflect.ValueOf(&ptr)
	// println("Pointer type:", ptrVal.Type().String())
	// println("Pointer kind:", ptrVal.Kind().String())

	// Test interface type
	let iface: any = "hello"
	let ifaceVal = $.markAsStructValue((reflect.ValueOf(iface)).clone())
	$.println("Interface value type:", $.pointerValue($.markAsStructValue((ifaceVal).clone()).Type()).String())
	$.println("Interface kind:", reflect.Kind_String($.markAsStructValue((ifaceVal).clone()).Kind()))

	// Test function type
	let fn = $.functionValue((_p0: number): string => {
		return ""
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] })
	let fnVal = $.markAsStructValue((reflect.ValueOf($.interfaceValue<any>(fn, "func(int) string"))).clone())
	$.println("Function type:", $.pointerValue($.markAsStructValue((fnVal).clone()).Type()).String())
	$.println("Function kind:", reflect.Kind_String($.markAsStructValue((fnVal).clone()).Kind()))

	// Test more complex types
	let complexSlice = $.arrayToSlice<$.Slice<number>>([$.arrayToSlice<number>([1, 2]), $.arrayToSlice<number>([3, 4])])
	let complexVal = $.markAsStructValue((reflect.ValueOf($.interfaceValue<any>(complexSlice, "[][]int"))).clone())
	$.println("Complex slice type:", $.pointerValue($.markAsStructValue((complexVal).clone()).Type()).String())
	$.println("Complex slice kind:", reflect.Kind_String($.markAsStructValue((complexVal).clone()).Kind()))
	$.println("Complex slice len:", $.markAsStructValue((complexVal).clone()).Len())

	// Test type methods
	$.println("Type size methods:")
	$.println("Int size:", $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})).Size())
	$.println("String size:", $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})).Size())
	$.println("Slice size:", $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, zero: () => null }})).Size())

	// Test enhanced API surface - functions to implement
	$.println("Enhanced API tests:")

	// Test MakeSlice
	let sliceTypeInt = reflect.SliceOf($.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})))
	let newSlice = $.markAsStructValue((reflect.MakeSlice($.pointerValue(sliceTypeInt), 3, 5)).clone())
	$.println("MakeSlice len:", $.markAsStructValue((newSlice).clone()).Len())
	$.println("MakeSlice type:", $.pointerValue($.markAsStructValue((newSlice).clone()).Type()).String())

	// Test MakeMap
	let mapTypeStr = reflect.MapOf($.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})), $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})))
	let newMap = $.markAsStructValue((reflect.MakeMap($.pointerValue(mapTypeStr))).clone())
	$.println("MakeMap type:", $.pointerValue($.markAsStructValue((newMap).clone()).Type()).String())

	// Test Append
	let originalSlice = $.markAsStructValue((reflect.ValueOf($.interfaceValue<any>($.arrayToSlice<number>([1, 2]), "[]int"))).clone())
	let appendedSlice = $.markAsStructValue((reflect.Append($.markAsStructValue((originalSlice).clone()), reflect.ValueOf(3))).clone())
	$.println("Append result len:", $.markAsStructValue((appendedSlice).clone()).Len())

	// Test channel types
	let chanType = reflect.ChanOf(reflect.BothDir, $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})))
	$.println("ChanOf type:", $.pointerValue(chanType).String())
	$.println("ChanOf kind:", reflect.Kind_String($.pointerValue(chanType).Kind()))

	// Test MakeChan
	let newChan = $.markAsStructValue((reflect.MakeChan($.pointerValue(chanType), 0)).clone())
	$.println("MakeChan type:", $.pointerValue($.markAsStructValue((newChan).clone()).Type()).String())

	// Test different channel directions
	let sendOnlyChan = reflect.ChanOf(reflect.SendDir, $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})))
	$.println("SendOnly chan type:", $.pointerValue(sendOnlyChan).String())

	let recvOnlyChan = reflect.ChanOf(reflect.RecvDir, $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "bool" }, zero: () => false }})))
	$.println("RecvOnly chan type:", $.pointerValue(recvOnlyChan).String())

	// Test channels with different element types
	let stringChanType = reflect.ChanOf(reflect.BothDir, $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})))
	let stringChan = $.markAsStructValue((reflect.MakeChan($.pointerValue(stringChanType), 5)).clone())
	$.println("String chan type:", $.pointerValue($.markAsStructValue((stringChan).clone()).Type()).String())
	$.println("String chan elem type:", $.pointerValue($.pointerValue($.markAsStructValue((stringChan).clone()).Type()).Elem()).String())

	// Test buffered vs unbuffered channels
	let unbufferedChan = $.markAsStructValue((reflect.MakeChan($.pointerValue(chanType), 0)).clone())
	let bufferedChan = $.markAsStructValue((reflect.MakeChan($.pointerValue(chanType), 10)).clone())
	$.println("Unbuffered chan type:", $.pointerValue($.markAsStructValue((unbufferedChan).clone()).Type()).String())
	$.println("Buffered chan type:", $.pointerValue($.markAsStructValue((bufferedChan).clone()).Type()).String())

	// Test channel reflection properties
	$.println("Chan elem type:", $.pointerValue($.pointerValue(chanType).Elem()).String())
	$.println("Chan elem kind:", reflect.Kind_String($.pointerValue($.pointerValue(chanType).Elem()).Kind()))
	$.println("Chan size:", $.pointerValue(chanType).Size())

	// Test Select functionality
	let intChan = $.markAsStructValue((reflect.MakeChan($.pointerValue(reflect.ChanOf(reflect.BothDir, $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})))), 1)).clone())
	let strChan = $.markAsStructValue((reflect.MakeChan($.pointerValue(reflect.ChanOf(reflect.BothDir, $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})))), 1)).clone())

	// Send values to only the string channel to make select deterministic
	$.markAsStructValue((strChan).clone()).Send($.markAsStructValue((reflect.ValueOf("hello")).clone()))

	let cases = $.arrayToSlice<reflect.SelectCase>([$.markAsStructValue(new reflect.SelectCase({Dir: reflect.SelectRecv, Chan: $.markAsStructValue((intChan).clone())})), $.markAsStructValue(new reflect.SelectCase({Dir: reflect.SelectRecv, Chan: $.markAsStructValue((strChan).clone())})), $.markAsStructValue(new reflect.SelectCase({Dir: reflect.SelectDefault}))])
	let [chosen, recv, recvOK] = reflect.Select(cases)
	$.println("Select chosen:", chosen, "recvOK:", recvOK)
	if ($.markAsStructValue((recv).clone()).IsValid()) {
		$.println("Select recv type:", $.pointerValue($.markAsStructValue((recv).clone()).Type()).String())
		// Print the actual received value
		if (chosen == 0) {
			$.println("Select recv value:", $.markAsStructValue((recv).clone()).Int())
		} else {
			if (chosen == 1) {
				$.println("Select recv value:", $.markAsStructValue((recv).clone()).String())
			}
		}
	} else {
		$.println("Select recv type: invalid")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

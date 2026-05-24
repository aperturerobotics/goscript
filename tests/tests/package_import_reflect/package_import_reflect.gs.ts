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
		() => new Person(),
		[],
		Person,
		{"Name": { kind: $.TypeKind.Basic, name: "string" }, "Age": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function reflectOverlap(x: $.Slice<number>, y: $.Slice<number>): boolean {
	return ((($.len(x) > 0) && ($.len(y) > 0)) && ($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>($.indexRef(x!, 0), "*byte")))).Pointer() <= $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>($.indexRef(y!, $.len(y) - 1), "*byte")))).Pointer())) && ($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>($.indexRef(y!, 0), "*byte")))).Pointer() <= $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>($.indexRef(x!, $.len(x) - 1), "*byte")))).Pointer())
}

export function reflectSameStart(x: $.Slice<number>, y: $.Slice<number>): boolean {
	return (($.len(x) > 0) && ($.len(y) > 0)) && ($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>($.indexRef(x!, 0), "*byte")))).Pointer() == $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>($.indexRef(y!, 0), "*byte")))).Pointer())
}

export async function main(): globalThis.Promise<void> {
	// Test basic reflect functions
	let x = 42
	let v = $.markAsStructValue($.cloneStructValue(reflect.ValueOf(x)))
	$.println("Type:", $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})).String())
	$.println("Value:", $.markAsStructValue($.cloneStructValue(v)).Int())
	$.println("Kind:", reflect.Kind_String($.markAsStructValue($.cloneStructValue(v)).Kind()))

	// Test with string
	let s = "hello"
	let sv = $.markAsStructValue($.cloneStructValue(reflect.ValueOf(s)))
	$.println("String type:", $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})).String())
	$.println("String value:", $.markAsStructValue($.cloneStructValue(sv)).String())
	$.println("String kind:", reflect.Kind_String($.markAsStructValue($.cloneStructValue(sv)).Kind()))

	// Test with slice
	let slice: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3])
	let sliceV = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>(slice, "[]int"))))
	$.println("Slice type:", $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({T: { type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, zero: () => null }})).String())
	$.println("Slice len:", $.markAsStructValue($.cloneStructValue(sliceV)).Len())
	$.println("Slice kind:", reflect.Kind_String($.markAsStructValue($.cloneStructValue(sliceV)).Kind()))

	// Test DeepEqual
	let a: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3])
	let b: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3])
	let c: $.Slice<number> = $.arrayToSlice<number>([1, 2, 4])
	$.println("DeepEqual a==b:", reflect.DeepEqual($.interfaceValue<any>(a, "[]int"), $.interfaceValue<any>(b, "[]int")))
	$.println("DeepEqual a==c:", reflect.DeepEqual($.interfaceValue<any>(a, "[]int"), $.interfaceValue<any>(c, "[]int")))

	// Test Zero value
	let zeroInt = $.markAsStructValue($.cloneStructValue(reflect.Zero($.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})))))
	$.println("Zero int:", $.markAsStructValue($.cloneStructValue(zeroInt)).Int())

	// Test type construction functions
	let intType = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})
	let sliceType = reflect.SliceOf($.pointerValue(intType))
	$.println("SliceOf int:", $.pointerValue<Exclude<reflect.Type, null>>(sliceType).String())
	$.println("SliceOf kind:", reflect.Kind_String($.pointerValue<Exclude<reflect.Type, null>>(sliceType).Kind()))

	let arrayType = reflect.ArrayOf(5, $.pointerValue(intType))
	$.println("ArrayOf 5 int:", $.pointerValue<Exclude<reflect.Type, null>>(arrayType).String())
	$.println("ArrayOf kind:", reflect.Kind_String($.pointerValue<Exclude<reflect.Type, null>>(arrayType).Kind()))

	let ptrType = reflect.PointerTo($.pointerValue(intType))
	$.println("PointerTo int:", $.pointerValue<Exclude<reflect.Type, null>>(ptrType).String())
	$.println("PointerTo kind:", reflect.Kind_String($.pointerValue<Exclude<reflect.Type, null>>(ptrType).Kind()))

	// Test PtrTo (alias for PointerTo)
	let ptrType2 = reflect.PtrTo($.pointerValue(intType))
	$.println("PtrTo int:", $.pointerValue<Exclude<reflect.Type, null>>(ptrType2).String())

	// Test New and Indirect
	let newVal = $.markAsStructValue($.cloneStructValue(reflect.New($.pointerValue(intType))))
	$.println("New int type:", $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(newVal)).Type()).String())
	let indirectVal = $.markAsStructValue($.cloneStructValue(reflect.Indirect($.markAsStructValue($.cloneStructValue(newVal)))))
	$.println("Indirect type:", $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(indirectVal)).Type()).String())

	// Test Zero values for different types
	let zeroString = $.markAsStructValue($.cloneStructValue(reflect.Zero($.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})))))
	$.println("Zero string:", $.markAsStructValue($.cloneStructValue(zeroString)).String())

	let zeroBool = $.markAsStructValue($.cloneStructValue(reflect.Zero($.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "bool" }, zero: () => false }})))))
	$.println("Zero bool:", $.markAsStructValue($.cloneStructValue(zeroBool)).String())

	// Test Swapper function
	let testSlice: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3, 4, 5])
	let swapper = reflect.Swapper($.interfaceValue<any>(testSlice, "[]int"))
	$.println("Before swap:", testSlice![0], testSlice![4])
	await swapper!(0, 4)
	$.println("After swap:", testSlice![0], testSlice![4])

	// Test Copy function
	let src: $.Slice<number> = $.arrayToSlice<number>([10, 20, 30])
	let dst: $.Slice<number> = $.makeSlice<number>(2, undefined, "number")
	let srcVal = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>(src, "[]int"))))
	let dstVal = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>(dst, "[]int"))))
	let copied = reflect.Copy($.markAsStructValue($.cloneStructValue(dstVal)), $.markAsStructValue($.cloneStructValue(srcVal)))
	$.println("Copied elements:", copied)
	$.println("Dst after copy:", dst![0], dst![1])

	// Test struct reflection
	let person = $.markAsStructValue(new Person({Name: "Alice", Age: 30}))
	let personType = reflect.TypeFor({T: { type: "main.Person", zero: () => $.markAsStructValue(new Person()) }})
	$.println("Struct type:", $.pointerValue<Exclude<reflect.Type, null>>(personType).String())
	$.println("Struct kind:", reflect.Kind_String($.pointerValue<Exclude<reflect.Type, null>>(personType).Kind()))

	let personVal = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(person)), "main.Person"))))
	$.println("Struct value type:", $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(personVal)).Type()).String())

	// Test with different kinds
	let f: number = 3.14
	let fVal = $.markAsStructValue($.cloneStructValue(reflect.ValueOf(f)))
	$.println("Float kind:", reflect.Kind_String($.markAsStructValue($.cloneStructValue(fVal)).Kind()))

	let boolVal: boolean = true
	let bVal = $.markAsStructValue($.cloneStructValue(reflect.ValueOf(boolVal)))
	$.println("Bool kind:", reflect.Kind_String($.markAsStructValue($.cloneStructValue(bVal)).Kind()))

	// Test type equality
	let intType1 = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})
	let intType2 = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})
	$.println("Same int types:", $.stringEqual($.pointerValue<Exclude<reflect.Type, null>>(intType1).String(), $.pointerValue<Exclude<reflect.Type, null>>(intType2).String()))

	let stringType = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})
	$.println("Different types:", $.stringEqual($.pointerValue<Exclude<reflect.Type, null>>(intType1).String(), $.pointerValue<Exclude<reflect.Type, null>>(stringType).String()))

	// Test map type construction
	let mapType = reflect.MapOf($.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})), $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})))
	$.println("MapOf string->int:", $.pointerValue<Exclude<reflect.Type, null>>(mapType).String())
	$.println("MapOf kind:", reflect.Kind_String($.pointerValue<Exclude<reflect.Type, null>>(mapType).Kind()))

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
	let ifaceVal = $.markAsStructValue($.cloneStructValue(reflect.ValueOf(iface)))
	$.println("Interface value type:", $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(ifaceVal)).Type()).String())
	$.println("Interface kind:", reflect.Kind_String($.markAsStructValue($.cloneStructValue(ifaceVal)).Kind()))
	let __goscriptTuple0: any = reflect.TypeAssert({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, $.markAsStructValue($.cloneStructValue(reflect.ValueOf("typed"))))
	let assertedString = (__goscriptTuple0[0] as string)
	let assertedOK = __goscriptTuple0[1]
	$.println("TypeAssert string:", assertedString, assertedOK)
	let [, assertedIntOK] = reflect.TypeAssert({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, $.markAsStructValue($.cloneStructValue(reflect.ValueOf("typed"))))
	$.println("TypeAssert int:", assertedIntOK)
	let complexValue = $.complex(3, -2)
	let complexReflect = $.markAsStructValue($.cloneStructValue(reflect.ValueOf(complexValue)))
	$.println("Complex value kind:", reflect.Kind_String($.markAsStructValue($.cloneStructValue(complexReflect)).Kind()))
	$.println("Complex real:", $.int($.real($.markAsStructValue($.cloneStructValue(complexReflect)).Complex())))
	$.println("Complex imag:", $.int($.imag($.markAsStructValue($.cloneStructValue(complexReflect)).Complex())))
	let complexTarget: $.VarRef<$.Complex> = $.varRef($.complex(0, 0))
	let complexTargetValue = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>(complexTarget, "*complex128")))).Elem()))
	$.markAsStructValue($.cloneStructValue(complexTargetValue)).SetComplex($.complex(7, 8))
	$.println("SetComplex real:", $.int($.real($.markAsStructValue($.cloneStructValue(complexTargetValue)).Complex())))
	$.println("SetComplex imag:", $.int($.imag($.markAsStructValue($.cloneStructValue(complexTargetValue)).Complex())))
	$.println("Array type len:", $.pointerValue<Exclude<reflect.Type, null>>(reflect.ArrayOf(3, $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})))).Len())

	// Test function type
	let fn = $.functionValue((_p0: number): string => {
		return ""
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] })
	let fnVal = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>(fn, "func(int) string"))))
	$.println("Function type:", $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(fnVal)).Type()).String())
	$.println("Function kind:", reflect.Kind_String($.markAsStructValue($.cloneStructValue(fnVal)).Kind()))

	// Test more complex types
	let complexSlice: $.Slice<$.Slice<number>> = $.arrayToSlice<$.Slice<number>>([$.arrayToSlice<number>([1, 2]), $.arrayToSlice<number>([3, 4])])
	let complexVal = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>(complexSlice, "[][]int"))))
	$.println("Complex slice type:", $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(complexVal)).Type()).String())
	$.println("Complex slice kind:", reflect.Kind_String($.markAsStructValue($.cloneStructValue(complexVal)).Kind()))
	$.println("Complex slice len:", $.markAsStructValue($.cloneStructValue(complexVal)).Len())

	// Test type methods
	$.println("Type size methods:")
	$.println("Int size:", $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})).Size())
	$.println("String size:", $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})).Size())
	$.println("Slice size:", $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({T: { type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, zero: () => null }})).Size())

	// Test enhanced API surface - functions to implement
	$.println("Enhanced API tests:")

	// Test MakeSlice
	let sliceTypeInt = reflect.SliceOf($.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})))
	let newSlice = $.markAsStructValue($.cloneStructValue(reflect.MakeSlice($.pointerValue(sliceTypeInt), 3, 5)))
	$.println("MakeSlice len:", $.markAsStructValue($.cloneStructValue(newSlice)).Len())
	$.println("MakeSlice type:", $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(newSlice)).Type()).String())

	// Test MakeMap
	let mapTypeStr = reflect.MapOf($.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})), $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})))
	let newMap = $.markAsStructValue($.cloneStructValue(reflect.MakeMap($.pointerValue(mapTypeStr))))
	$.println("MakeMap type:", $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(newMap)).Type()).String())

	// Test Append
	let originalSlice = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>($.arrayToSlice<number>([1, 2]), "[]int"))))
	let appendedSlice = $.markAsStructValue($.cloneStructValue(reflect.Append($.markAsStructValue($.cloneStructValue(originalSlice)), $.markAsStructValue($.cloneStructValue(reflect.ValueOf(3))))))
	$.println("Append result len:", $.markAsStructValue($.cloneStructValue(appendedSlice)).Len())

	// Test channel types
	let chanType = reflect.ChanOf(reflect.BothDir, $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})))
	$.println("ChanOf type:", $.pointerValue<Exclude<reflect.Type, null>>(chanType).String())
	$.println("ChanOf kind:", reflect.Kind_String($.pointerValue<Exclude<reflect.Type, null>>(chanType).Kind()))

	// Test MakeChan
	let newChan = $.markAsStructValue($.cloneStructValue(reflect.MakeChan($.pointerValue(chanType), 0)))
	$.println("MakeChan type:", $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(newChan)).Type()).String())

	// Test different channel directions
	let sendOnlyChan = reflect.ChanOf(reflect.SendDir, $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})))
	$.println("SendOnly chan type:", $.pointerValue<Exclude<reflect.Type, null>>(sendOnlyChan).String())

	let recvOnlyChan = reflect.ChanOf(reflect.RecvDir, $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "bool" }, zero: () => false }})))
	$.println("RecvOnly chan type:", $.pointerValue<Exclude<reflect.Type, null>>(recvOnlyChan).String())

	// Test channels with different element types
	let stringChanType = reflect.ChanOf(reflect.BothDir, $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})))
	let stringChan = $.markAsStructValue($.cloneStructValue(reflect.MakeChan($.pointerValue(stringChanType), 5)))
	$.println("String chan type:", $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(stringChan)).Type()).String())
	$.println("String chan elem type:", $.pointerValue<Exclude<reflect.Type, null>>($.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(stringChan)).Type()).Elem()).String())

	// Test buffered vs unbuffered channels
	let unbufferedChan = $.markAsStructValue($.cloneStructValue(reflect.MakeChan($.pointerValue(chanType), 0)))
	let bufferedChan = $.markAsStructValue($.cloneStructValue(reflect.MakeChan($.pointerValue(chanType), 10)))
	$.println("Unbuffered chan type:", $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(unbufferedChan)).Type()).String())
	$.println("Buffered chan type:", $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(bufferedChan)).Type()).String())

	// Test channel reflection properties
	$.println("Chan elem type:", $.pointerValue<Exclude<reflect.Type, null>>($.pointerValue<Exclude<reflect.Type, null>>(chanType).Elem()).String())
	$.println("Chan elem kind:", reflect.Kind_String($.pointerValue<Exclude<reflect.Type, null>>($.pointerValue<Exclude<reflect.Type, null>>(chanType).Elem()).Kind()))
	$.println("Chan size:", $.pointerValue<Exclude<reflect.Type, null>>(chanType).Size())

	// Test Value.Pointer on addressable slice elements.
	let pointerBuf: $.Slice<number> = $.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8), $.uint(4, 8)])
	let pointerLeft: $.Slice<number> = $.goSlice(pointerBuf, 1, 3)
	let pointerRight: $.Slice<number> = $.goSlice(pointerBuf, 2, 4)
	let pointerOther: $.Slice<number> = $.arrayToSlice<number>([$.uint(8, 8), $.uint(9, 8)])
	$.println("Pointer overlap:", reflectOverlap(pointerLeft, pointerRight))
	$.println("Pointer separate:", reflectOverlap(pointerLeft, pointerOther))
	$.println("Pointer same:", reflectSameStart(pointerLeft, $.goSlice(pointerBuf, 1, undefined)))
	$.println("Pointer different:", reflectSameStart(pointerLeft, pointerRight))

	// Test Select functionality
	let intChan = $.markAsStructValue($.cloneStructValue(reflect.MakeChan($.pointerValue(reflect.ChanOf(reflect.BothDir, $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})))), 1)))
	let strChan = $.markAsStructValue($.cloneStructValue(reflect.MakeChan($.pointerValue(reflect.ChanOf(reflect.BothDir, $.pointerValue(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})))), 1)))

	// Send values to only the string channel to make select deterministic
	$.markAsStructValue($.cloneStructValue(strChan)).Send($.markAsStructValue($.cloneStructValue(reflect.ValueOf("hello"))))

	let cases: $.Slice<reflect.SelectCase> = $.arrayToSlice<reflect.SelectCase>([$.markAsStructValue(new reflect.SelectCase({Dir: reflect.SelectRecv, Chan: $.markAsStructValue($.cloneStructValue(intChan))})), $.markAsStructValue(new reflect.SelectCase({Dir: reflect.SelectRecv, Chan: $.markAsStructValue($.cloneStructValue(strChan))})), $.markAsStructValue(new reflect.SelectCase({Dir: reflect.SelectDefault}))])
	let [chosen, recv, recvOK] = reflect.Select(cases)
	$.println("Select chosen:", chosen, "recvOK:", recvOK)
	if ($.markAsStructValue($.cloneStructValue(recv)).IsValid()) {
		$.println("Select recv type:", $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(recv)).Type()).String())
		// Print the actual received value
		if (chosen == 0) {
			$.println("Select recv value:", $.markAsStructValue($.cloneStructValue(recv)).Int())
		} else {
			if (chosen == 1) {
				$.println("Select recv value:", $.markAsStructValue($.cloneStructValue(recv)).String())
			}
		}
	} else {
		$.println("Select recv type: invalid")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on package_import_reflect.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as reflect from "@goscript/reflect/index.ts"

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

export type Stringer = null | {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export async function main(): Promise<void> {
	let x = 42
	let v = $.markAsStructValue(reflect.ValueOf(x).clone())
	$.println("Type:", reflect.TypeFor({T: { zero: () => 0 }}).String())
	$.println("Value:", $.markAsStructValue(v.clone()).Int())
	$.println("Kind:", reflect.Kind_String($.markAsStructValue(v.clone()).Kind()))
	let s = "hello"
	let sv = $.markAsStructValue(reflect.ValueOf(s).clone())
	$.println("String type:", reflect.TypeFor({T: { zero: () => "" }}).String())
	$.println("String value:", $.markAsStructValue(sv.clone()).String())
	$.println("String kind:", reflect.Kind_String($.markAsStructValue(sv.clone()).Kind()))
	let slice = [1, 2, 3]
	let sliceV = $.markAsStructValue(reflect.ValueOf(slice).clone())
	$.println("Slice type:", reflect.TypeFor({T: { zero: () => null }}).String())
	$.println("Slice len:", $.markAsStructValue(sliceV.clone()).Len())
	$.println("Slice kind:", reflect.Kind_String($.markAsStructValue(sliceV.clone()).Kind()))
	let a = [1, 2, 3]
	let b = [1, 2, 3]
	let c = [1, 2, 4]
	$.println("DeepEqual a==b:", reflect.DeepEqual(a, b))
	$.println("DeepEqual a==c:", reflect.DeepEqual(a, c))
	let zeroInt = $.markAsStructValue(reflect.Zero(reflect.TypeFor({T: { zero: () => 0 }})).clone())
	$.println("Zero int:", $.markAsStructValue(zeroInt.clone()).Int())
	let intType = reflect.TypeFor({T: { zero: () => 0 }})
	let sliceType = reflect.SliceOf(intType)
	$.println("SliceOf int:", sliceType.String())
	$.println("SliceOf kind:", reflect.Kind_String(sliceType.Kind()))
	let arrayType = reflect.ArrayOf(5, intType)
	$.println("ArrayOf 5 int:", arrayType.String())
	$.println("ArrayOf kind:", reflect.Kind_String(arrayType.Kind()))
	let ptrType = reflect.PointerTo(intType)
	$.println("PointerTo int:", ptrType.String())
	$.println("PointerTo kind:", reflect.Kind_String(ptrType.Kind()))
	let ptrType2 = reflect.PtrTo(intType)
	$.println("PtrTo int:", ptrType2.String())
	let newVal = $.markAsStructValue(reflect.New(intType).clone())
	$.println("New int type:", $.markAsStructValue(newVal.clone()).Type().String())
	let indirectVal = $.markAsStructValue(reflect.Indirect(newVal).clone())
	$.println("Indirect type:", $.markAsStructValue(indirectVal.clone()).Type().String())
	let zeroString = $.markAsStructValue(reflect.Zero(reflect.TypeFor({T: { zero: () => "" }})).clone())
	$.println("Zero string:", $.markAsStructValue(zeroString.clone()).String())
	let zeroBool = $.markAsStructValue(reflect.Zero(reflect.TypeFor({T: { zero: () => false }})).clone())
	$.println("Zero bool:", $.markAsStructValue(zeroBool.clone()).String())
	let testSlice = [1, 2, 3, 4, 5]
	let swapper = reflect.Swapper(testSlice)
	$.println("Before swap:", testSlice[0], testSlice[4])
	swapper(0, 4)
	$.println("After swap:", testSlice[0], testSlice[4])
	let src = [10, 20, 30]
	let dst = $.makeSlice<number>(2, undefined, "number")
	let srcVal = $.markAsStructValue(reflect.ValueOf(src).clone())
	let dstVal = $.markAsStructValue(reflect.ValueOf(dst).clone())
	let copied = reflect.Copy(dstVal, srcVal)
	$.println("Copied elements:", copied)
	$.println("Dst after copy:", dst[0], dst[1])
	let person = $.markAsStructValue(new Person({Name: "Alice", Age: 30}))
	let personType = reflect.TypeFor({T: { zero: () => new Person() }})
	$.println("Struct type:", personType.String())
	$.println("Struct kind:", reflect.Kind_String(personType.Kind()))
	let personVal = $.markAsStructValue(reflect.ValueOf(person).clone())
	$.println("Struct value type:", $.markAsStructValue(personVal.clone()).Type().String())
	let f: number = 3.14
	let fVal = $.markAsStructValue(reflect.ValueOf(f).clone())
	$.println("Float kind:", reflect.Kind_String($.markAsStructValue(fVal.clone()).Kind()))
	let boolVal: boolean = true
	let bVal = $.markAsStructValue(reflect.ValueOf(boolVal).clone())
	$.println("Bool kind:", reflect.Kind_String($.markAsStructValue(bVal.clone()).Kind()))
	let intType1 = reflect.TypeFor({T: { zero: () => 0 }})
	let intType2 = reflect.TypeFor({T: { zero: () => 0 }})
	$.println("Same int types:", intType1.String() == intType2.String())
	let stringType = reflect.TypeFor({T: { zero: () => "" }})
	$.println("Different types:", intType1.String() == stringType.String())
	let mapType = reflect.MapOf(reflect.TypeFor({T: { zero: () => "" }}), reflect.TypeFor({T: { zero: () => 0 }}))
	$.println("MapOf string->int:", mapType.String())
	$.println("MapOf kind:", reflect.Kind_String(mapType.Kind()))
	$.println("Chan kinds available")
	let iface: any = "hello"
	let ifaceVal = $.markAsStructValue(reflect.ValueOf(iface).clone())
	$.println("Interface value type:", $.markAsStructValue(ifaceVal.clone()).Type().String())
	$.println("Interface kind:", reflect.Kind_String($.markAsStructValue(ifaceVal.clone()).Kind()))
	let fn = (_p0: number): string => {
	return ""
}
	let fnVal = $.markAsStructValue(reflect.ValueOf(fn).clone())
	$.println("Function type:", $.markAsStructValue(fnVal.clone()).Type().String())
	$.println("Function kind:", reflect.Kind_String($.markAsStructValue(fnVal.clone()).Kind()))
	let complexSlice = [[1, 2], [3, 4]]
	let complexVal = $.markAsStructValue(reflect.ValueOf(complexSlice).clone())
	$.println("Complex slice type:", $.markAsStructValue(complexVal.clone()).Type().String())
	$.println("Complex slice kind:", reflect.Kind_String($.markAsStructValue(complexVal.clone()).Kind()))
	$.println("Complex slice len:", $.markAsStructValue(complexVal.clone()).Len())
	$.println("Type size methods:")
	$.println("Int size:", reflect.TypeFor({T: { zero: () => 0 }}).Size())
	$.println("String size:", reflect.TypeFor({T: { zero: () => "" }}).Size())
	$.println("Slice size:", reflect.TypeFor({T: { zero: () => null }}).Size())
	$.println("Enhanced API tests:")
	let sliceTypeInt = reflect.SliceOf(reflect.TypeFor({T: { zero: () => 0 }}))
	let newSlice = $.markAsStructValue(reflect.MakeSlice(sliceTypeInt, 3, 5).clone())
	$.println("MakeSlice len:", $.markAsStructValue(newSlice.clone()).Len())
	$.println("MakeSlice type:", $.markAsStructValue(newSlice.clone()).Type().String())
	let mapTypeStr = reflect.MapOf(reflect.TypeFor({T: { zero: () => "" }}), reflect.TypeFor({T: { zero: () => 0 }}))
	let newMap = $.markAsStructValue(reflect.MakeMap(mapTypeStr).clone())
	$.println("MakeMap type:", $.markAsStructValue(newMap.clone()).Type().String())
	let originalSlice = $.markAsStructValue(reflect.ValueOf([1, 2]).clone())
	let appendedSlice = $.markAsStructValue(reflect.Append(originalSlice, reflect.ValueOf(3)).clone())
	$.println("Append result len:", $.markAsStructValue(appendedSlice.clone()).Len())
	let chanType = reflect.ChanOf(reflect.BothDir, reflect.TypeFor({T: { zero: () => 0 }}))
	$.println("ChanOf type:", chanType.String())
	$.println("ChanOf kind:", reflect.Kind_String(chanType.Kind()))
	let newChan = $.markAsStructValue(reflect.MakeChan(chanType, 0).clone())
	$.println("MakeChan type:", $.markAsStructValue(newChan.clone()).Type().String())
	let sendOnlyChan = reflect.ChanOf(reflect.SendDir, reflect.TypeFor({T: { zero: () => "" }}))
	$.println("SendOnly chan type:", sendOnlyChan.String())
	let recvOnlyChan = reflect.ChanOf(reflect.RecvDir, reflect.TypeFor({T: { zero: () => false }}))
	$.println("RecvOnly chan type:", recvOnlyChan.String())
	let stringChanType = reflect.ChanOf(reflect.BothDir, reflect.TypeFor({T: { zero: () => "" }}))
	let stringChan = $.markAsStructValue(reflect.MakeChan(stringChanType, 5).clone())
	$.println("String chan type:", $.markAsStructValue(stringChan.clone()).Type().String())
	$.println("String chan elem type:", $.markAsStructValue(stringChan.clone()).Type().Elem().String())
	let unbufferedChan = $.markAsStructValue(reflect.MakeChan(chanType, 0).clone())
	let bufferedChan = $.markAsStructValue(reflect.MakeChan(chanType, 10).clone())
	$.println("Unbuffered chan type:", $.markAsStructValue(unbufferedChan.clone()).Type().String())
	$.println("Buffered chan type:", $.markAsStructValue(bufferedChan.clone()).Type().String())
	$.println("Chan elem type:", chanType.Elem().String())
	$.println("Chan elem kind:", reflect.Kind_String(chanType.Elem().Kind()))
	$.println("Chan size:", chanType.Size())
	let intChan = $.markAsStructValue(reflect.MakeChan(reflect.ChanOf(reflect.BothDir, reflect.TypeFor({T: { zero: () => 0 }})), 1).clone())
	let strChan = $.markAsStructValue(reflect.MakeChan(reflect.ChanOf(reflect.BothDir, reflect.TypeFor({T: { zero: () => "" }})), 1).clone())
	$.markAsStructValue(strChan.clone()).Send(reflect.ValueOf("hello"))
	let cases = [$.markAsStructValue(new reflect.SelectCase({Dir: reflect.SelectRecv, Chan: $.markAsStructValue(intChan.clone())})), $.markAsStructValue(new reflect.SelectCase({Dir: reflect.SelectRecv, Chan: $.markAsStructValue(strChan.clone())})), $.markAsStructValue(new reflect.SelectCase({Dir: reflect.SelectDefault}))]
	let [chosen, recv, recvOK] = reflect.Select(cases)
	$.println("Select chosen:", chosen, "recvOK:", recvOK)
	if ($.markAsStructValue(recv.clone()).IsValid()) {
		$.println("Select recv type:", $.markAsStructValue(recv.clone()).Type().String())
		if (chosen == 0) {
			$.println("Select recv value:", $.markAsStructValue(recv.clone()).Int())
		} else {
			if (chosen == 1) {
				$.println("Select recv value:", $.markAsStructValue(recv.clone()).String())
			}
		}
	} else {
		$.println("Select recv type: invalid")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on package_import_reflect.go
// Updated when compliance tests are re-run, DO NOT EDIT!
import * as $ from "@goscript/builtin/index.js";
import * as reflect from "@goscript/reflect/index.js";

export class Person {
    get Name() {
        return this._fields.Name.value;
    }
    set Name(value) {
        this._fields.Name.value = value;
    }
    get Age() {
        return this._fields.Age.value;
    }
    set Age(value) {
        this._fields.Age.value = value;
    }
    constructor(init) {
        this._fields = {
            Name: $.varRef(init?.Name ?? ""),
            Age: $.varRef(init?.Age ?? 0)
        };
    }
    clone() {
        const cloned = new Person();
        cloned._fields = {
            Name: $.varRef(this._fields.Name.value),
            Age: $.varRef(this._fields.Age.value)
        };
        return cloned;
    }
}
// Register this type with the runtime type system
Person.__typeInfo = $.registerStructType('Person', new Person(), [], Person, { "Name": { kind: $.TypeKind.Basic, name: "string" }, "Age": { kind: $.TypeKind.Basic, name: "number" } });
$.registerInterfaceType('Stringer', null, // Zero value for interface is null
[{ name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]);
export async function main() {
    // Test basic reflect functions
    let x = 42;
    let v = reflect.ValueOf(x).clone();
    console.log("Type:", reflect.TypeOf(x).String());
    console.log("Value:", v.Int());
    console.log("Kind:", v.Kind().String());
    // Test with string
    let s = "hello";
    let sv = reflect.ValueOf(s).clone();
    console.log("String type:", reflect.TypeOf(s).String());
    console.log("String value:", sv.String());
    console.log("String kind:", sv.Kind().String());
    // Test with slice
    let slice = $.arrayToSlice([1, 2, 3]);
    let sliceV = reflect.ValueOf(slice).clone();
    console.log("Slice type:", reflect.TypeOf(slice).String());
    console.log("Slice len:", sliceV.Len());
    console.log("Slice kind:", sliceV.Kind().String());
    // Test DeepEqual
    let a = $.arrayToSlice([1, 2, 3]);
    let b = $.arrayToSlice([1, 2, 3]);
    let c = $.arrayToSlice([1, 2, 4]);
    console.log("DeepEqual a==b:", reflect.DeepEqual(a, b));
    console.log("DeepEqual a==c:", reflect.DeepEqual(a, c));
    // Test Zero value
    let zeroInt = reflect.Zero(reflect.TypeOf(42)).clone();
    console.log("Zero int:", zeroInt.Int());
    // Test type construction functions
    let intType = reflect.TypeOf(0);
    let sliceType = reflect.SliceOf(intType);
    console.log("SliceOf int:", sliceType.String());
    console.log("SliceOf kind:", sliceType.Kind().String());
    let arrayType = reflect.ArrayOf(5, intType);
    console.log("ArrayOf 5 int:", arrayType.String());
    console.log("ArrayOf kind:", arrayType.Kind().String());
    let ptrType = reflect.PointerTo(intType);
    console.log("PointerTo int:", ptrType.String());
    console.log("PointerTo kind:", ptrType.Kind().String());
    // Test PtrTo (alias for PointerTo)
    let ptrType2 = reflect.PtrTo(intType);
    console.log("PtrTo int:", ptrType2.String());
    // Test New and Indirect
    let newVal = reflect.New(intType).clone();
    console.log("New int type:", newVal.Type().String());
    let indirectVal = reflect.Indirect(newVal).clone();
    console.log("Indirect type:", indirectVal.Type().String());
    // Test Zero values for different types
    let zeroString = reflect.Zero(reflect.TypeOf("")).clone();
    console.log("Zero string:", zeroString.String());
    let zeroBool = reflect.Zero(reflect.TypeOf(true)).clone();
    console.log("Zero bool:", zeroBool.String()); // Should show the type since it's not a string
    // Test Swapper function
    let testSlice = $.arrayToSlice([1, 2, 3, 4, 5]);
    let swapper = reflect.Swapper(testSlice);
    console.log("Before swap:", testSlice[0], testSlice[4]);
    swapper(0, 4);
    console.log("After swap:", testSlice[0], testSlice[4]);
    // Test Copy function
    let src = $.arrayToSlice([10, 20, 30]);
    let dst = $.makeSlice(2, undefined, 'number');
    let srcVal = reflect.ValueOf(src).clone();
    let dstVal = reflect.ValueOf(dst).clone();
    let copied = reflect.Copy(dstVal, srcVal);
    console.log("Copied elements:", copied);
    console.log("Dst after copy:", dst[0], dst[1]);
    // Test struct reflection
    let person = new Person({ Age: 30, Name: "Alice" });
    let personType = reflect.TypeOf(person);
    console.log("Struct type:", personType.String());
    console.log("Struct kind:", personType.Kind().String());
    let personVal = reflect.ValueOf(person).clone();
    console.log("Struct value type:", personVal.Type().String());
    // Test with different kinds
    let f = 3.14;
    let fVal = reflect.ValueOf(f).clone();
    console.log("Float kind:", fVal.Kind().String());
    let boolVal = true;
    let bVal = reflect.ValueOf(boolVal).clone();
    console.log("Bool kind:", bVal.Kind().String());
    // Test type equality
    let intType1 = reflect.TypeOf(1);
    let intType2 = reflect.TypeOf(2);
    console.log("Same int types:", intType1.String() == intType2.String());
    let stringType = reflect.TypeOf("test");
    console.log("Different types:", intType1.String() == stringType.String());
    // Test map type construction
    let mapType = reflect.MapOf(reflect.TypeOf(""), reflect.TypeOf(0));
    console.log("MapOf string->int:", mapType.String());
    console.log("MapOf kind:", mapType.Kind().String());
    // Test channel direction constants
    console.log("Chan kinds available");
    // Test pointer operations
    // Note: Pointer-to-pointer reflection has a compiler limitation
    // var ptr *int = &x
    // ptrVal := reflect.ValueOf(&ptr)
    // println("Pointer type:", ptrVal.Type().String())
    // println("Pointer kind:", ptrVal.Kind().String())
    // Test interface type
    let iface = "hello";
    let ifaceVal = reflect.ValueOf(iface).clone();
    console.log("Interface value type:", ifaceVal.Type().String());
    console.log("Interface kind:", ifaceVal.Kind().String());
    // Test function type
    let fn = () => {
        return "";
    };
    let fnVal = reflect.ValueOf(fn).clone();
    console.log("Function type:", fnVal.Type().String());
    console.log("Function kind:", fnVal.Kind().String());
    // Test more complex types
    let complexSlice = $.arrayToSlice([[1, 2], [3, 4]], 2);
    let complexVal = reflect.ValueOf(complexSlice).clone();
    console.log("Complex slice type:", complexVal.Type().String());
    console.log("Complex slice kind:", complexVal.Kind().String());
    console.log("Complex slice len:", complexVal.Len());
    // Test type methods
    console.log("Type size methods:");
    console.log("Int size:", reflect.TypeOf(0).Size());
    console.log("String size:", reflect.TypeOf("").Size());
    console.log("Slice size:", reflect.TypeOf($.arrayToSlice([])).Size());
}

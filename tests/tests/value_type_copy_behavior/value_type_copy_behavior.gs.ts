// Generated file based on value_type_copy_behavior.go
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

	public _fields: {
		MyInt: $.VarRef<number>
		MyString: $.VarRef<string>
	}

	constructor(init?: Partial<{MyInt?: number, MyString?: string}>) {
		this._fields = {
			MyInt: $.varRef(init?.MyInt ?? 0),
			MyString: $.varRef(init?.MyString ?? "")
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			MyInt: $.varRef(this._fields.MyInt.value),
			MyString: $.varRef(this._fields.MyString.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		new MyStruct(),
		[],
		MyStruct,
		{"MyInt": { kind: $.TypeKind.Basic, name: "int" }, "MyString": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export class NestedStruct {
	public get Value(): number {
		return this._fields.Value.value
	}
	public set Value(value: number) {
		this._fields.Value.value = value
	}

	public get InnerStruct(): MyStruct {
		return this._fields.InnerStruct.value
	}
	public set InnerStruct(value: MyStruct) {
		this._fields.InnerStruct.value = value
	}

	public _fields: {
		Value: $.VarRef<number>
		InnerStruct: $.VarRef<MyStruct>
	}

	constructor(init?: Partial<{Value?: number, InnerStruct?: MyStruct}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? 0),
			InnerStruct: $.varRef(init?.InnerStruct ? $.markAsStructValue(init.InnerStruct.clone()) : $.markAsStructValue(new MyStruct()))
		}
	}

	public clone(): NestedStruct {
		const cloned = new NestedStruct()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value),
			InnerStruct: $.varRef($.markAsStructValue(this._fields.InnerStruct.value.clone()))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.NestedStruct",
		new NestedStruct(),
		[],
		NestedStruct,
		{"Value": { kind: $.TypeKind.Basic, name: "int" }, "InnerStruct": "main.MyStruct"}
	)
}

export async function main(): Promise<void> {
	$.println("----------------------------------------------------------")
	$.println("VALUE TYPE COPY BEHAVIOR TEST")
	$.println("----------------------------------------------------------")
	let original = $.varRef($.markAsStructValue(new MyStruct({MyInt: 42, MyString: "original"})))
	let valueCopy1 = $.markAsStructValue(original.value.clone())
	let valueCopy2 = $.markAsStructValue(original.value.clone())
	let pointerCopy = original
	valueCopy1.MyString = "value copy 1"
	original.value.MyString = "original modified"
	valueCopy2.MyString = "value copy 2"
	$.println("Value Copy Test:")
	$.println("  valueCopy1.MyString: " + valueCopy1.MyString)
	$.println("  original.MyString: " + original.value.MyString)
	$.println("  valueCopy2.MyString: " + valueCopy2.MyString)
	$.println("\nPointer Behavior Test:")
	$.println("  Before pointer modification - original.MyString: " + original.value.MyString)
	$.pointerValue(pointerCopy).MyString = "modified through pointer"
	$.pointerValue(pointerCopy).MyInt = 100
	$.println("  After pointer modification - original.MyString:", original.value.MyString)
	$.println("  After pointer modification - original.MyInt:", original.value.MyInt)
	$.println("\nNested Struct Test:")
	let nestedOriginal = $.markAsStructValue(new NestedStruct({Value: 10, InnerStruct: $.markAsStructValue(new MyStruct({MyInt: 20, MyString: "inner original"}))}))
	let nestedCopy = $.markAsStructValue(nestedOriginal.clone())
	nestedCopy.InnerStruct.MyString = "inner modified"
	nestedCopy.Value = 30
	$.println("  nestedCopy.Value: ", nestedCopy.Value)
	$.println("  nestedOriginal.Value: ", nestedOriginal.Value)
	$.println("  nestedCopy.InnerStruct.MyString: " + nestedCopy.InnerStruct.MyString)
	$.println("  nestedOriginal.InnerStruct.MyString: " + nestedOriginal.InnerStruct.MyString)
	$.println("----------------------------------------------------------")
}


if ($.isMainScript(import.meta)) {
	await main()
}

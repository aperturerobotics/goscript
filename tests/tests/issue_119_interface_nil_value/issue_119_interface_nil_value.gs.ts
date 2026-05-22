// Generated file based on issue_119_interface_nil_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Animal = null | {
	Name(): string
}

$.registerInterfaceType(
	"main.Animal",
	null,
	[{ name: "Name", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export class Dog {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		name: $.VarRef<string>
	}

	constructor(init?: Partial<{name?: string}>) {
		this._fields = {
			name: $.varRef(init?.name ?? "")
		}
	}

	public clone(): Dog {
		const cloned = new Dog()
		cloned._fields = {
			name: $.varRef(this._fields.name.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Name(): string {
		const d: Dog | $.VarRef<Dog> | null = this
		if (d == null) {
			return "unknown dog"
		}
		return $.pointerValue<Dog>(d).name
	}

	static __typeInfo = $.registerStructType(
		"main.Dog",
		() => new Dog(),
		[{ name: "Name", args: [], returns: [] }],
		Dog,
		{"name": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export class Cat {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		name: $.VarRef<string>
	}

	constructor(init?: Partial<{name?: string}>) {
		this._fields = {
			name: $.varRef(init?.name ?? "")
		}
	}

	public clone(): Cat {
		const cloned = new Cat()
		cloned._fields = {
			name: $.varRef(this._fields.name.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Name(): string {
		const c: Cat | $.VarRef<Cat> | null = this
		if (c == null) {
			return "unknown cat"
		}
		return $.pointerValue<Cat>(c).name
	}

	static __typeInfo = $.registerStructType(
		"main.Cat",
		() => new Cat(),
		[{ name: "Name", args: [], returns: [] }],
		Cat,
		{"name": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export function FindDog(): Dog | $.VarRef<Dog> | null {
	return null
}

export function FindCat(): Cat | $.VarRef<Cat> | null {
	return new Cat({name: "Whiskers"})
}

export function FindAnimal(): Animal | null {
	// This is a common bug pattern in Go:
	// dog is a *Dog with value nil
	// When assigned to Animal interface, the interface is NOT nil
	// because it has type *Dog (even though value is nil)
	{
		let dog = $.interfaceValue<Animal | null>(FindDog(), "*main.Dog")
		if (dog != null) {
			// In Go, this branch IS taken because dog != nil
			// The interface has type=*Dog, value=nil
			return dog
		}
	}
	return $.interfaceValue<Animal | null>(FindCat(), "*main.Cat")
}

export async function main(): globalThis.Promise<void> {
	let animal = FindAnimal()

	// Test 1: The interface should NOT be nil
	if (animal == null) {
		$.println("animal is nil")
	} else {
		$.println("animal is not nil")
	}

	// Test 2: Calling method on nil receiver should work
	// The method dispatch uses the type (*Dog) to find Name()
	// Then passes nil as the receiver
	$.println($.pointerValue<Exclude<Animal, null>>(animal).Name())
	let directNilDog: Dog | $.VarRef<Dog> | null = null as Dog | $.VarRef<Dog> | null
	$.println(Dog.prototype.Name.call(directNilDog))

	// Test 3: Type assertions preserve the typed nil pointer
	{
		let __goscriptTuple0 = $.typeAssertTuple<Dog | $.VarRef<Dog> | null>(animal, { kind: $.TypeKind.Pointer, elemType: "main.Dog" })
		let d: Dog | $.VarRef<Dog> | null = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (ok && (d == null)) {
			$.println("typed nil dog assertion ok")
		} else {
			$.println("typed nil dog assertion failed")
		}
	}
	{
		let __goscriptTuple1 = $.typeAssertTuple<Cat | $.VarRef<Cat> | null>(animal, { kind: $.TypeKind.Pointer, elemType: "main.Cat" })
		let c: Cat | $.VarRef<Cat> | null = __goscriptTuple1[0]
		let ok = __goscriptTuple1[1]
		if (ok || (c != null)) {
			$.println("typed nil cat assertion accepted")
		} else {
			$.println("typed nil cat assertion rejected")
		}
	}

	// Test 4: Direct nil pointer to interface assignment
	let dog: Dog | $.VarRef<Dog> | null = null
	let a: Animal | null = $.interfaceValue<Animal | null>(dog, "*main.Dog")

	if (a == null) {
		$.println("a is nil")
	} else {
		$.println("a is not nil")
	}

	// Test 5: Truly nil interface
	let b: Animal | null = null
	if (b == null) {
		$.println("b is nil")
	} else {
		$.println("b is not nil")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on issue_119_interface_nil_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Animal = null | {
	Name(): string
}

$.registerInterfaceType(
  'main.Animal',
  null, // Zero value for interface is null
  [{ name: "Name", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export class Cat {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		name: $.VarRef<string>;
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
		return cloned
	}

	public Name(): string {
		const c = this
		if (c == null) {
			return "unknown cat"
		}
		return c.name
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Cat',
	  new Cat(),
	  [{ name: "Name", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  Cat,
	  {"name": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export class Dog {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		name: $.VarRef<string>;
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
		return cloned
	}

	public Name(): string {
		const d = this
		if (d == null) {
			return "unknown dog"
		}
		return d.name
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Dog',
	  new Dog(),
	  [{ name: "Name", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  Dog,
	  {"name": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export function FindDog(): Dog | null {
	return null
}

export function FindCat(): Cat | null {
	return new Cat({name: "Whiskers"})
}

export function FindAnimal(): Animal {
	// This is a common bug pattern in Go:
	// dog is a *Dog with value nil
	// When assigned to Animal interface, the interface is NOT nil
	// because it has type *Dog (even though value is nil)

	// In Go, this branch IS taken because dog != nil
	// The interface has type=*Dog, value=nil
	{
		let dog = (FindDog() as Animal)
		if (dog != null) {
			// In Go, this branch IS taken because dog != nil
			// The interface has type=*Dog, value=nil
			return dog
		}
	}
	return FindCat()
}

export async function main(): Promise<void> {
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
	$.println(animal!.Name())

	// Test 3: Direct nil pointer to interface assignment
	let dog: Dog | null = null
	let a: Animal = dog

	if (a == null) {
		$.println("a is nil")
	} else {
		$.println("a is not nil")
	}

	// Test 4: Truly nil interface
	let b: Animal = null
	if (b == null) {
		$.println("b is nil")
	} else {
		$.println("b is not nil")
	}
}


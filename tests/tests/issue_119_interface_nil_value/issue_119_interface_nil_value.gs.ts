// Generated file based on issue_119_interface_nil_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

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
		const d = this
		if (d == null) {
			return "unknown dog"
		}
		return $.pointerValue(d).name
	}

	static __typeInfo = $.registerStructType(
		"main.Dog",
		new Dog(),
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
		const c = this
		if (c == null) {
			return "unknown cat"
		}
		return $.pointerValue(c).name
	}

	static __typeInfo = $.registerStructType(
		"main.Cat",
		new Cat(),
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

export function FindAnimal(): Animal {
	{
		let dog = FindDog()
		if (dog != null) {
			return dog
		}
	}
	return FindCat()
}

export async function main(): Promise<void> {
	let animal = FindAnimal()
	if (animal == null) {
		$.println("animal is nil")
	} else {
		$.println("animal is not nil")
	}
	$.println(animal.Name())
	let dog: Dog | $.VarRef<Dog> | null = null
	let a: Animal = dog
	if (a == null) {
		$.println("a is nil")
	} else {
		$.println("a is not nil")
	}
	let b: Animal = null
	if (b == null) {
		$.println("b is nil")
	} else {
		$.println("b is not nil")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

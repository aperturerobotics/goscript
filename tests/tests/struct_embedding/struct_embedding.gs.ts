// Generated file based on struct_embedding.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

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

	public Greet(): void {
		const p = this
		$.println("Hello, my name is " + p.Name)
	}

	static __typeInfo = $.registerStructType(
		"main.Person",
		new Person(),
		[{ name: "Greet", args: [], returns: [] }],
		Person,
		{"Name": { kind: $.TypeKind.Basic, name: "string" }, "Age": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class Employee {
	public get Person(): Person {
		return this._fields.Person.value
	}
	public set Person(value: Person) {
		this._fields.Person.value = value
	}

	public get ID(): number {
		return this._fields.ID.value
	}
	public set ID(value: number) {
		this._fields.ID.value = value
	}

	public _fields: {
		Person: $.VarRef<Person>
		ID: $.VarRef<number>
	}

	constructor(init?: Partial<{Person?: Person, ID?: number}>) {
		this._fields = {
			Person: $.varRef(init?.Person ? $.markAsStructValue(init.Person.clone()) : $.markAsStructValue(new Person())),
			ID: $.varRef(init?.ID ?? 0)
		}
	}

	public clone(): Employee {
		const cloned = new Employee()
		cloned._fields = {
			Person: $.varRef($.markAsStructValue(this._fields.Person.value.clone())),
			ID: $.varRef(this._fields.ID.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Employee",
		new Employee(),
		[],
		Employee,
		{"Person": "main.Person", "ID": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class Address {
	public get Street(): string {
		return this._fields.Street.value
	}
	public set Street(value: string) {
		this._fields.Street.value = value
	}

	public get City(): string {
		return this._fields.City.value
	}
	public set City(value: string) {
		this._fields.City.value = value
	}

	public _fields: {
		Street: $.VarRef<string>
		City: $.VarRef<string>
	}

	constructor(init?: Partial<{Street?: string, City?: string}>) {
		this._fields = {
			Street: $.varRef(init?.Street ?? ""),
			City: $.varRef(init?.City ?? "")
		}
	}

	public clone(): Address {
		const cloned = new Address()
		cloned._fields = {
			Street: $.varRef(this._fields.Street.value),
			City: $.varRef(this._fields.City.value)
		}
		return $.markAsStructValue(cloned)
	}

	public FullAddress(): string {
		const a = this
		return a.Street + ", " + a.City
	}

	static __typeInfo = $.registerStructType(
		"main.Address",
		new Address(),
		[{ name: "FullAddress", args: [], returns: [] }],
		Address,
		{"Street": { kind: $.TypeKind.Basic, name: "string" }, "City": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export class Contact {
	public get Phone(): string {
		return this._fields.Phone.value
	}
	public set Phone(value: string) {
		this._fields.Phone.value = value
	}

	public _fields: {
		Phone: $.VarRef<string>
	}

	constructor(init?: Partial<{Phone?: string}>) {
		this._fields = {
			Phone: $.varRef(init?.Phone ?? "")
		}
	}

	public clone(): Contact {
		const cloned = new Contact()
		cloned._fields = {
			Phone: $.varRef(this._fields.Phone.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Call(): void {
		const c = this
		$.println("Calling " + c.Phone)
	}

	static __typeInfo = $.registerStructType(
		"main.Contact",
		new Contact(),
		[{ name: "Call", args: [], returns: [] }],
		Contact,
		{"Phone": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export class Manager {
	public get Person(): Person {
		return this._fields.Person.value
	}
	public set Person(value: Person) {
		this._fields.Person.value = value
	}

	public get Address(): Address {
		return this._fields.Address.value
	}
	public set Address(value: Address) {
		this._fields.Address.value = value
	}

	public get Contact(): Contact {
		return this._fields.Contact.value
	}
	public set Contact(value: Contact) {
		this._fields.Contact.value = value
	}

	public get Level(): number {
		return this._fields.Level.value
	}
	public set Level(value: number) {
		this._fields.Level.value = value
	}

	public _fields: {
		Person: $.VarRef<Person>
		Address: $.VarRef<Address>
		Contact: $.VarRef<Contact>
		Level: $.VarRef<number>
	}

	constructor(init?: Partial<{Person?: Person, Address?: Address, Contact?: Contact, Level?: number}>) {
		this._fields = {
			Person: $.varRef(init?.Person ? $.markAsStructValue(init.Person.clone()) : $.markAsStructValue(new Person())),
			Address: $.varRef(init?.Address ? $.markAsStructValue(init.Address.clone()) : $.markAsStructValue(new Address())),
			Contact: $.varRef(init?.Contact ? $.markAsStructValue(init.Contact.clone()) : $.markAsStructValue(new Contact())),
			Level: $.varRef(init?.Level ?? 0)
		}
	}

	public clone(): Manager {
		const cloned = new Manager()
		cloned._fields = {
			Person: $.varRef($.markAsStructValue(this._fields.Person.value.clone())),
			Address: $.varRef($.markAsStructValue(this._fields.Address.value.clone())),
			Contact: $.varRef($.markAsStructValue(this._fields.Contact.value.clone())),
			Level: $.varRef(this._fields.Level.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Manager",
		new Manager(),
		[],
		Manager,
		{"Person": "main.Person", "Address": "main.Address", "Contact": "main.Contact", "Level": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): Promise<void> {
	let e = $.markAsStructValue(new Employee({Person: $.markAsStructValue(new Person({Name: "Alice", Age: 30})), ID: 123}))
	$.println("Employee Name:", e.Name)
	$.println("Employee Age:", e.Age)
	$.println("Employee ID:", e.ID)
	$.markAsStructValue(e.clone()).Greet()
	let ep = new Employee({Person: $.markAsStructValue(new Person({Name: "Bob", Age: 25})), ID: 456})
	$.println("Employee Pointer Name:", $.pointerValue(ep).Name)
	$.println("Employee Pointer Age:", $.pointerValue(ep).Age)
	$.println("Employee Pointer ID:", $.pointerValue(ep).ID)
	$.markAsStructValue($.pointerValue(ep).clone()).Greet()
	$.println("\n--- Multiple Embedding ---")
	let m = $.varRef($.markAsStructValue(new Manager({Person: $.markAsStructValue(new Person({Name: "Charlie", Age: 40})), Address: $.markAsStructValue(new Address({Street: "123 Main St", City: "Anytown"})), Contact: $.markAsStructValue(new Contact({Phone: "555-1234"})), Level: 5})))
	$.println("Manager Name:", m.value.Name)
	$.println("Manager Age:", m.value.Age)
	$.println("Manager Street:", m.value.Street)
	$.println("Manager City:", m.value.City)
	$.println("Manager Phone:", m.value.Phone)
	$.println("Manager Level:", m.value.Level)
	$.markAsStructValue(m.value.clone()).Greet()
	$.println("Manager Full Address:", $.markAsStructValue(m.value.clone()).FullAddress())
	$.markAsStructValue(m.value.clone()).Call()
	let mp = m
	$.println("\n--- Multiple Embedding (Pointer) ---")
	$.println("Manager Pointer Name:", $.pointerValue(mp).Name)
	$.markAsStructValue($.pointerValue(mp).clone()).Greet()
	$.println("Manager Pointer Full Address:", $.markAsStructValue($.pointerValue(mp).clone()).FullAddress())
	$.markAsStructValue($.pointerValue(mp).clone()).Call()
	$.pointerValue(mp).Age = 41
	$.pointerValue(mp).City = "New City"
	$.println("Modified Manager Age:", m.value.Age)
	$.println("Modified Manager City:", m.value.City)
}


if ($.isMainScript(import.meta)) {
	await main()
}

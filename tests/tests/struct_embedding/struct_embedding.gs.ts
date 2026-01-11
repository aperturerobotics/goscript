// Generated file based on struct_embedding.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

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
		Street: $.VarRef<string>;
		City: $.VarRef<string>;
	}

	constructor(init?: Partial<{City?: string, Street?: string}>) {
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
		return cloned
	}

	public FullAddress(): string {
		const a = this
		return a.Street + ", " + a.City
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Address',
	  new Address(),
	  [{ name: "FullAddress", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  Address,
	  {"Street": { kind: $.TypeKind.Basic, name: "string" }, "City": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export class Contact {
	public get Phone(): string {
		return this._fields.Phone.value
	}
	public set Phone(value: string) {
		this._fields.Phone.value = value
	}

	public _fields: {
		Phone: $.VarRef<string>;
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
		return cloned
	}

	public Call(): void {
		const c = this
		$.println("Calling " + c.Phone)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Contact',
	  new Contact(),
	  [{ name: "Call", args: [], returns: [] }],
	  Contact,
	  {"Phone": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

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

	public Greet(): void {
		const p = this
		$.println("Hello, my name is " + p.Name)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Person',
	  new Person(),
	  [{ name: "Greet", args: [], returns: [] }],
	  Person,
	  {"Name": { kind: $.TypeKind.Basic, name: "string" }, "Age": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export class Employee {
	public get ID(): number {
		return this._fields.ID.value
	}
	public set ID(value: number) {
		this._fields.ID.value = value
	}

	public get Person(): Person {
		return this._fields.Person.value
	}
	public set Person(value: Person) {
		this._fields.Person.value = value
	}

	public _fields: {
		Person: $.VarRef<Person>;
		ID: $.VarRef<number>;
	}

	constructor(init?: Partial<{ID?: number, Person?: Partial<ConstructorParameters<typeof Person>[0]>}>) {
		this._fields = {
			Person: $.varRef(new Person(init?.Person)),
			ID: $.varRef(init?.ID ?? 0)
		}
	}

	public clone(): Employee {
		const cloned = new Employee()
		cloned._fields = {
			Person: $.varRef($.markAsStructValue(this._fields.Person.value.clone())),
			ID: $.varRef(this._fields.ID.value)
		}
		return cloned
	}

	public get Name(): string {
		return this.Person.Name
	}
	public set Name(value: string) {
		this.Person.Name = value
	}

	public get Age(): number {
		return this.Person.Age
	}
	public set Age(value: number) {
		this.Person.Age = value
	}

	public Greet(): void {
		this.Person.Greet()
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Employee',
	  new Employee(),
	  [],
	  Employee,
	  {"Person": "Person", "ID": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export class Manager {
	public get Level(): number {
		return this._fields.Level.value
	}
	public set Level(value: number) {
		this._fields.Level.value = value
	}

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

	public _fields: {
		Person: $.VarRef<Person>;
		Address: $.VarRef<Address>;
		Contact: $.VarRef<Contact>;
		Level: $.VarRef<number>;
	}

	constructor(init?: Partial<{Address?: Partial<ConstructorParameters<typeof Address>[0]>, Contact?: Partial<ConstructorParameters<typeof Contact>[0]>, Level?: number, Person?: Partial<ConstructorParameters<typeof Person>[0]>}>) {
		this._fields = {
			Person: $.varRef(new Person(init?.Person)),
			Address: $.varRef(new Address(init?.Address)),
			Contact: $.varRef(new Contact(init?.Contact)),
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
		return cloned
	}

	public get Name(): string {
		return this.Person.Name
	}
	public set Name(value: string) {
		this.Person.Name = value
	}

	public get Age(): number {
		return this.Person.Age
	}
	public set Age(value: number) {
		this.Person.Age = value
	}

	public Greet(): void {
		this.Person.Greet()
	}

	public get Street(): string {
		return this.Address.Street
	}
	public set Street(value: string) {
		this.Address.Street = value
	}

	public get City(): string {
		return this.Address.City
	}
	public set City(value: string) {
		this.Address.City = value
	}

	public FullAddress(): string {
		return this.Address.FullAddress()
	}

	public get Phone(): string {
		return this.Contact.Phone
	}
	public set Phone(value: string) {
		this.Contact.Phone = value
	}

	public Call(): void {
		this.Contact.Call()
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Manager',
	  new Manager(),
	  [],
	  Manager,
	  {"Person": "Person", "Address": "Address", "Contact": "Contact", "Level": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export async function main(): Promise<void> {
	// --- Single Embedding Tests ---
	let e = $.markAsStructValue(new Employee({ID: 123, Person: {Name: "Alice", Age: 30}}))

	// Accessing embedded fields
	$.println("Employee Name:", e.Name)
	$.println("Employee Age:", e.Age)
	$.println("Employee ID:", e.ID)

	// Calling embedded method
	e.Greet()

	// Test with a pointer to Employee
	let ep = new Employee({ID: 456, Person: {Name: "Bob", Age: 25}})

	// Accessing embedded fields via pointer
	$.println("Employee Pointer Name:", ep!.Name)
	$.println("Employee Pointer Age:", ep!.Age)
	$.println("Employee Pointer ID:", ep!.ID)

	// Calling embedded method via pointer
	ep!.Greet()

	// --- Multiple Embedding Tests ---
	$.println("\n--- Multiple Embedding ---")
	let m = $.varRef($.markAsStructValue(new Manager({Level: 5, Address: {Street: "123 Main St", City: "Anytown"}, Contact: {Phone: "555-1234"}, Person: {Name: "Charlie", Age: 40}})))

	// Accessing fields from all embedded structs and the outer struct
	$.println("Manager Name:", m!.value.Name) // From Person
	$.println("Manager Age:", m!.value.Age) // From Person
	$.println("Manager Street:", m!.value.Street) // From Address
	$.println("Manager City:", m!.value.City) // From Address
	$.println("Manager Phone:", m!.value.Phone) // From Contact
	$.println("Manager Level:", m!.value.Level) // From Manager

	// Calling methods from embedded structs
	m!.value.Greet() // From Person
	$.println("Manager Full Address:", m!.value.FullAddress()) // From Address
	m!.value.Call() // From Contact

	// Test with a pointer
	let mp = m
	$.println("\n--- Multiple Embedding (Pointer) ---")
	$.println("Manager Pointer Name:", mp!.value!.Name)
	mp!.value!.Greet()
	$.println("Manager Pointer Full Address:", mp!.value!.FullAddress())
	mp!.value!.Call()

	// Modify through pointer
	mp!.value!.Age = 41
	mp!.value!.City = "New City"
	$.println("Modified Manager Age:", m!.value.Age)
	$.println("Modified Manager City:", m!.value.City)
}


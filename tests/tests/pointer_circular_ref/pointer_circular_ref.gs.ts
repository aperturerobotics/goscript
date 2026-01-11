// Generated file based on pointer_circular_ref.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Employee {
	public get id(): number {
		return this._fields.id.value
	}
	public set id(value: number) {
		this._fields.id.value = value
	}

	// Pointer back to Person
	public get person(): Person | null {
		return this._fields.person.value
	}
	public set person(value: Person | null) {
		this._fields.person.value = value
	}

	public _fields: {
		id: $.VarRef<number>;
		person: $.VarRef<Person | null>;
	}

	constructor(init?: Partial<{id?: number, person?: Person | null}>) {
		this._fields = {
			id: $.varRef(init?.id ?? 0),
			person: $.varRef(init?.person ?? null)
		}
	}

	public clone(): Employee {
		const cloned = new Employee()
		cloned._fields = {
			id: $.varRef(this._fields.id.value),
			person: $.varRef(this._fields.person.value ? $.markAsStructValue(this._fields.person.value.clone()) : null)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Employee',
	  new Employee(),
	  [],
	  Employee,
	  {"id": { kind: $.TypeKind.Basic, name: "int" }, "person": { kind: $.TypeKind.Pointer, elemType: "Person" }}
	);
}

export class Node {
	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	// Pointer to Node - this should NOT create a dependency
	public get next(): Node | null {
		return this._fields.next.value
	}
	public set next(value: Node | null) {
		this._fields.next.value = value
	}

	// Another pointer - also should NOT create a dependency
	public get parent(): Node | null {
		return this._fields.parent.value
	}
	public set parent(value: Node | null) {
		this._fields.parent.value = value
	}

	//nolint:unused // Slice of pointers - also should NOT create a dependency
	public get children(): $.Slice<Node | null> {
		return this._fields.children.value
	}
	public set children(value: $.Slice<Node | null>) {
		this._fields.children.value = value
	}

	public _fields: {
		value: $.VarRef<number>;
		next: $.VarRef<Node | null>;
		parent: $.VarRef<Node | null>;
		children: $.VarRef<$.Slice<Node | null>>;
	}

	constructor(init?: Partial<{children?: $.Slice<Node | null>, next?: Node | null, parent?: Node | null, value?: number}>) {
		this._fields = {
			value: $.varRef(init?.value ?? 0),
			next: $.varRef(init?.next ?? null),
			parent: $.varRef(init?.parent ?? null),
			children: $.varRef(init?.children ?? null)
		}
	}

	public clone(): Node {
		const cloned = new Node()
		cloned._fields = {
			value: $.varRef(this._fields.value.value),
			next: $.varRef(this._fields.next.value ? $.markAsStructValue(this._fields.next.value.clone()) : null),
			parent: $.varRef(this._fields.parent.value ? $.markAsStructValue(this._fields.parent.value.clone()) : null),
			children: $.varRef(this._fields.children.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Node',
	  new Node(),
	  [],
	  Node,
	  {"value": { kind: $.TypeKind.Basic, name: "int" }, "next": { kind: $.TypeKind.Pointer, elemType: "Node" }, "parent": { kind: $.TypeKind.Pointer, elemType: "Node" }, "children": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "Node" } }}
	);
}

export class Person {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	// Pointer to Employee
	public get spouse(): Employee | null {
		return this._fields.spouse.value
	}
	public set spouse(value: Employee | null) {
		this._fields.spouse.value = value
	}

	public _fields: {
		name: $.VarRef<string>;
		spouse: $.VarRef<Employee | null>;
	}

	constructor(init?: Partial<{name?: string, spouse?: Employee | null}>) {
		this._fields = {
			name: $.varRef(init?.name ?? ""),
			spouse: $.varRef(init?.spouse ?? null)
		}
	}

	public clone(): Person {
		const cloned = new Person()
		cloned._fields = {
			name: $.varRef(this._fields.name.value),
			spouse: $.varRef(this._fields.spouse.value ? $.markAsStructValue(this._fields.spouse.value.clone()) : null)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Person',
	  new Person(),
	  [],
	  Person,
	  {"name": { kind: $.TypeKind.Basic, name: "string" }, "spouse": { kind: $.TypeKind.Pointer, elemType: "Employee" }}
	);
}

export class TreeNode {
	//nolint:unused
	public get data(): string {
		return this._fields.data.value
	}
	public set data(value: string) {
		this._fields.data.value = value
	}

	//nolint:unused
	public get left(): TreeNode | null {
		return this._fields.left.value
	}
	public set left(value: TreeNode | null) {
		this._fields.left.value = value
	}

	//nolint:unused
	public get right(): TreeNode | null {
		return this._fields.right.value
	}
	public set right(value: TreeNode | null) {
		this._fields.right.value = value
	}

	//nolint:unused
	public get parent(): TreeNode | null {
		return this._fields.parent.value
	}
	public set parent(value: TreeNode | null) {
		this._fields.parent.value = value
	}

	public _fields: {
		data: $.VarRef<string>;
		left: $.VarRef<TreeNode | null>;
		right: $.VarRef<TreeNode | null>;
		parent: $.VarRef<TreeNode | null>;
	}

	constructor(init?: Partial<{data?: string, left?: TreeNode | null, parent?: TreeNode | null, right?: TreeNode | null}>) {
		this._fields = {
			data: $.varRef(init?.data ?? ""),
			left: $.varRef(init?.left ?? null),
			right: $.varRef(init?.right ?? null),
			parent: $.varRef(init?.parent ?? null)
		}
	}

	public clone(): TreeNode {
		const cloned = new TreeNode()
		cloned._fields = {
			data: $.varRef(this._fields.data.value),
			left: $.varRef(this._fields.left.value ? $.markAsStructValue(this._fields.left.value.clone()) : null),
			right: $.varRef(this._fields.right.value ? $.markAsStructValue(this._fields.right.value.clone()) : null),
			parent: $.varRef(this._fields.parent.value ? $.markAsStructValue(this._fields.parent.value.clone()) : null)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.TreeNode',
	  new TreeNode(),
	  [],
	  TreeNode,
	  {"data": { kind: $.TypeKind.Basic, name: "string" }, "left": { kind: $.TypeKind.Pointer, elemType: "TreeNode" }, "right": { kind: $.TypeKind.Pointer, elemType: "TreeNode" }, "parent": { kind: $.TypeKind.Pointer, elemType: "TreeNode" }}
	);
}

export async function main(): Promise<void> {
	// Create a simple linked list
	let node1 = new Node({value: 1})
	let node2 = new Node({value: 2})
	node1!.next = node2
	node2!.parent = node1

	$.println("Node 1 value:", node1!.value)
	$.println("Node 2 value:", node2!.value)

	// Create person/employee relationship
	let person = new Person({name: "John"})
	let employee = new Employee({id: 123})
	person!.spouse = employee
	employee!.person = person

	$.println("Person name:", person!.name)
	$.println("Employee ID:", employee!.id)

	$.println("Pointer circular references work fine!")
}


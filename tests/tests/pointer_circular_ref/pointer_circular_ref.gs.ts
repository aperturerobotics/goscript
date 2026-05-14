// Generated file based on pointer_circular_ref.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class Node {
	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public get next(): Node | $.VarRef<Node> | null {
		return this._fields.next.value
	}
	public set next(value: Node | $.VarRef<Node> | null) {
		this._fields.next.value = value
	}

	public get parent(): Node | $.VarRef<Node> | null {
		return this._fields.parent.value
	}
	public set parent(value: Node | $.VarRef<Node> | null) {
		this._fields.parent.value = value
	}

	public get children(): $.Slice<Node | $.VarRef<Node> | null> {
		return this._fields.children.value
	}
	public set children(value: $.Slice<Node | $.VarRef<Node> | null>) {
		this._fields.children.value = value
	}

	public _fields: {
		value: $.VarRef<number>
		next: $.VarRef<Node | $.VarRef<Node> | null>
		parent: $.VarRef<Node | $.VarRef<Node> | null>
		children: $.VarRef<$.Slice<Node | $.VarRef<Node> | null>>
	}

	constructor(init?: Partial<{value?: number, next?: Node | $.VarRef<Node> | null, parent?: Node | $.VarRef<Node> | null, children?: $.Slice<Node | $.VarRef<Node> | null>}>) {
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
			next: $.varRef(this._fields.next.value),
			parent: $.varRef(this._fields.parent.value),
			children: $.varRef(this._fields.children.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Node",
		new Node(),
		[],
		Node,
		{"value": { kind: $.TypeKind.Basic, name: "int" }, "next": { kind: $.TypeKind.Pointer, elemType: "main.Node" }, "parent": { kind: $.TypeKind.Pointer, elemType: "main.Node" }, "children": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "main.Node" } }}
	)
}

export class TreeNode {
	public get data(): string {
		return this._fields.data.value
	}
	public set data(value: string) {
		this._fields.data.value = value
	}

	public get left(): TreeNode | $.VarRef<TreeNode> | null {
		return this._fields.left.value
	}
	public set left(value: TreeNode | $.VarRef<TreeNode> | null) {
		this._fields.left.value = value
	}

	public get right(): TreeNode | $.VarRef<TreeNode> | null {
		return this._fields.right.value
	}
	public set right(value: TreeNode | $.VarRef<TreeNode> | null) {
		this._fields.right.value = value
	}

	public get parent(): TreeNode | $.VarRef<TreeNode> | null {
		return this._fields.parent.value
	}
	public set parent(value: TreeNode | $.VarRef<TreeNode> | null) {
		this._fields.parent.value = value
	}

	public _fields: {
		data: $.VarRef<string>
		left: $.VarRef<TreeNode | $.VarRef<TreeNode> | null>
		right: $.VarRef<TreeNode | $.VarRef<TreeNode> | null>
		parent: $.VarRef<TreeNode | $.VarRef<TreeNode> | null>
	}

	constructor(init?: Partial<{data?: string, left?: TreeNode | $.VarRef<TreeNode> | null, right?: TreeNode | $.VarRef<TreeNode> | null, parent?: TreeNode | $.VarRef<TreeNode> | null}>) {
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
			left: $.varRef(this._fields.left.value),
			right: $.varRef(this._fields.right.value),
			parent: $.varRef(this._fields.parent.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.TreeNode",
		new TreeNode(),
		[],
		TreeNode,
		{"data": { kind: $.TypeKind.Basic, name: "string" }, "left": { kind: $.TypeKind.Pointer, elemType: "main.TreeNode" }, "right": { kind: $.TypeKind.Pointer, elemType: "main.TreeNode" }, "parent": { kind: $.TypeKind.Pointer, elemType: "main.TreeNode" }}
	)
}

export class Person {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public get spouse(): Employee | $.VarRef<Employee> | null {
		return this._fields.spouse.value
	}
	public set spouse(value: Employee | $.VarRef<Employee> | null) {
		this._fields.spouse.value = value
	}

	public _fields: {
		name: $.VarRef<string>
		spouse: $.VarRef<Employee | $.VarRef<Employee> | null>
	}

	constructor(init?: Partial<{name?: string, spouse?: Employee | $.VarRef<Employee> | null}>) {
		this._fields = {
			name: $.varRef(init?.name ?? ""),
			spouse: $.varRef(init?.spouse ?? null)
		}
	}

	public clone(): Person {
		const cloned = new Person()
		cloned._fields = {
			name: $.varRef(this._fields.name.value),
			spouse: $.varRef(this._fields.spouse.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Person",
		new Person(),
		[],
		Person,
		{"name": { kind: $.TypeKind.Basic, name: "string" }, "spouse": { kind: $.TypeKind.Pointer, elemType: "main.Employee" }}
	)
}

export class Employee {
	public get id(): number {
		return this._fields.id.value
	}
	public set id(value: number) {
		this._fields.id.value = value
	}

	public get person(): Person | $.VarRef<Person> | null {
		return this._fields.person.value
	}
	public set person(value: Person | $.VarRef<Person> | null) {
		this._fields.person.value = value
	}

	public _fields: {
		id: $.VarRef<number>
		person: $.VarRef<Person | $.VarRef<Person> | null>
	}

	constructor(init?: Partial<{id?: number, person?: Person | $.VarRef<Person> | null}>) {
		this._fields = {
			id: $.varRef(init?.id ?? 0),
			person: $.varRef(init?.person ?? null)
		}
	}

	public clone(): Employee {
		const cloned = new Employee()
		cloned._fields = {
			id: $.varRef(this._fields.id.value),
			person: $.varRef(this._fields.person.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Employee",
		new Employee(),
		[],
		Employee,
		{"id": { kind: $.TypeKind.Basic, name: "int" }, "person": { kind: $.TypeKind.Pointer, elemType: "main.Person" }}
	)
}

export async function main(): Promise<void> {
	let node1 = new Node({value: 1})
	let node2 = new Node({value: 2})
	$.pointerValue(node1).next = node2
	$.pointerValue(node2).parent = node1
	$.println("Node 1 value:", $.pointerValue(node1).value)
	$.println("Node 2 value:", $.pointerValue(node2).value)
	let person = new Person({name: "John"})
	let employee = new Employee({id: 123})
	$.pointerValue(person).spouse = employee
	$.pointerValue(employee).person = person
	$.println("Person name:", $.pointerValue(person).name)
	$.println("Employee ID:", $.pointerValue(employee).id)
	$.println("Pointer circular references work fine!")
}


if ($.isMainScript(import.meta)) {
	await main()
}

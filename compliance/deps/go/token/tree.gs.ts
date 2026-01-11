import * as $ from "@goscript/builtin/index.js"
import { File } from "./position.gs.js";

import * as fmt from "@goscript/fmt/index.js"

import * as iter from "@goscript/iter/index.js"

export class key {
	public get start(): number {
		return this._fields.start.value
	}
	public set start(value: number) {
		this._fields.start.value = value
	}

	public get end(): number {
		return this._fields.end.value
	}
	public set end(value: number) {
		this._fields.end.value = value
	}

	public _fields: {
		start: $.VarRef<number>;
		end: $.VarRef<number>;
	}

	constructor(init?: Partial<{end?: number, start?: number}>) {
		this._fields = {
			start: $.varRef(init?.start ?? 0),
			end: $.varRef(init?.end ?? 0)
		}
	}

	public clone(): key {
		const cloned = new key()
		cloned._fields = {
			start: $.varRef(this._fields.start.value),
			end: $.varRef(this._fields.end.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'go/token.key',
	  new key(),
	  [],
	  key,
	  {"start": { kind: $.TypeKind.Basic, name: "int" }, "end": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export class tree {
	public get root(): node | null {
		return this._fields.root.value
	}
	public set root(value: node | null) {
		this._fields.root.value = value
	}

	public _fields: {
		root: $.VarRef<node | null>;
	}

	constructor(init?: Partial<{root?: node | null}>) {
		this._fields = {
			root: $.varRef(init?.root ?? null)
		}
	}

	public clone(): tree {
		const cloned = new tree()
		cloned._fields = {
			root: $.varRef(this._fields.root.value ? $.markAsStructValue(this._fields.root.value.clone()) : null)
		}
		return cloned
	}

	// locate returns a pointer to the variable that holds the node
	// identified by k, along with its parent, if any. If the key is not
	// present, it returns a pointer to the node where the key should be
	// inserted by a subsequent call to [tree.set].
	public locate(k: key): [$.VarRef<node | null> | null, node | null] {
		const t = this
		let pos: $.VarRef<node | null> | null = null
		let parent: node | null = null
		let [pos, x] = [t.root, t.root]
		for (; x != null; ) {
			let sign = compareKey(k, x!.key)
			if (sign < 0) {
				;[pos, x, parent] = [x!.left, x!.left, x]
			} else if (sign > 0) {
				;[pos, x, parent] = [x!.right, x!.right, x]
			} else {
				break
			}
		}
		return [pos, parent]
	}

	// all returns an iterator over the tree t.
	// If t is modified during the iteration,
	// some files may not be visited.
	// No file will be visited multiple times.
	public all(): iter.Seq<File | null> | null {
		const t = this
		return (_yield: ((p0: File | null) => boolean) | null): void => {
			if (t == null) {
				return 
			}
			let x = t.root
			if (x != null) {
				for (; x!.left != null; ) {
					x = x!.left
				}
			}

			// still in tree

			// deleted
			for (; x != null && _yield!(x!.file); ) {

				// still in tree

				// deleted
				if (x!.height >= 0) {
					// still in tree
					x = x!.next()
				} else {
					// deleted
					x = t.nextAfter(t.locate(x!.key))
				}
			}
		}
	}

	// nextAfter returns the node in the key sequence following
	// (pos, parent), a result pair from [tree.locate].
	public nextAfter(pos: $.VarRef<node | null> | null, parent: node | null): node | null {
		switch (true) {
			case pos!.value != null: {
				return (pos!.value)!.next()
				break
			}
			case parent == null: {
				return null
				break
			}
			case (pos === parent!.left): {
				return parent
				break
			}
			default: {
				return parent!.next()
				break
			}
		}
	}

	public setRoot(x: node | null): void {
		const t = this
		t.root = x
		if (x != null) {
			x!.parent = null
		}
	}

	public replaceChild(parent: node | null, old: node | null, _new: node | null): void {
		const t = this
		switch (true) {
			case parent == null: {
				if ((t.root !== old)) {
					$.panic("corrupt tree")
				}
				t.setRoot(_new)
				break
			}
			case (parent!.left === old): {
				parent!.setLeft(_new)
				break
			}
			case (parent!.right === old): {
				parent!.setRight(_new)
				break
			}
			default: {
				$.panic("corrupt tree")
				break
			}
		}
	}

	// rebalanceUp visits each excessively unbalanced ancestor
	// of x, restoring balance by rotating it.
	//
	// x is a node that has just been mutated, and so the height and
	// balance of x and its ancestors may be stale, but the children of x
	// must be in a valid state.
	public rebalanceUp(x: node | null): void {
		const t = this
		for (; x != null; ) {
			let h = x!.height
			x!.update()
			switch (x!.balance) {
				case -2: {
					if (Number(x!.left!.balance) == 1) {
						t.rotateLeft(x!.left)
					}
					x = t.rotateRight(x)
					break
				}
				case +2: {
					if (x!.right!.balance == -1) {
						t.rotateRight(x!.right)
					}
					x = t.rotateLeft(x)
					break
				}
			}

			// x's height has not changed, so the height
			// and balance of its ancestors have not changed;
			// no further rebalancing is required.
			if (x!.height == h) {
				// x's height has not changed, so the height
				// and balance of its ancestors have not changed;
				// no further rebalancing is required.
				return 
			}
			x = x!.parent
		}
	}

	// rotateRight rotates the subtree rooted at node y.
	// turning (y (x a b) c) into (x a (y b c)).
	public rotateRight(y: node | null): node | null {
		const t = this
		let p = y!.parent
		let x = y!.left
		let b = x!.right
		x!.checkBalance()
		y!.checkBalance()
		x!.setRight(y)
		y!.setLeft(b)
		t.replaceChild(p, y, x)
		y!.update()
		x!.update()
		return x
	}

	// rotateLeft rotates the subtree rooted at node x.
	// turning (x a (y b c)) into (y (x a b) c).
	public rotateLeft(x: node | null): node | null {
		const t = this
		let p = x!.parent
		let y = x!.right
		let b = y!.left
		x!.checkBalance()
		y!.checkBalance()
		y!.setLeft(x)
		x!.setRight(b)
		t.replaceChild(p, x, y)
		x!.update()
		y!.update()
		return y
	}

	// add inserts file into the tree, if not present.
	// It panics if file overlaps with another.
	public add(file: File | null): void {
		const t = this
		let [pos, parent] = t.locate(file!.key())
		if (pos!.value == null) {
			t._set(file, pos, parent) // missing; insert
			return 
		}
		{
			let prev = (pos!.value)!.file
			if ((prev !== file)) {
				$.panic(fmt.Sprintf("file %s (%d-%d) overlaps with file %s (%d-%d)", prev!.Name(), prev!.Base(), prev!.Base() + prev!.Size(), file!.Name(), file!.Base(), file!.Base() + file!.Size()))
			}
		}
	}

	// set updates the existing node at (pos, parent) if present, or
	// inserts a new node if not, so that it refers to file.
	public _set(file: File | null, pos: $.VarRef<node | null> | null, parent: node | null): void {
		const t = this
		{
			let x = pos!.value
			if (x != null) {
				// This code path isn't currently needed
				// because FileSet never updates an existing entry.
				// Remove this assertion if things change.
				if (true) {
					$.panic("unreachable according to current FileSet requirements")
				}
				x!.file = file
				return 
			}
		}
		let x = new node({file: file, height: -1, key: file!.key(), parent: parent})
		pos!.value = x
		t.rebalanceUp(x)
	}

	// delete deletes the node at pos.
	public _delete(pos: $.VarRef<node | null> | null): void {
		const t = this
		t.root!.check(null)
		let x = pos!.value
		switch (true) {
			case x == null: {
				if (true) {
					$.panic("unreachable according to current FileSet requirements")
				}
				return 
				break
			}
			case x!.left == null: {
				{
					pos!.value = x!.right
					if (pos!.value != null) {
						;(pos!.value)!.parent = x!.parent
					}
				}
				t.rebalanceUp(x!.parent)
				break
			}
			case x!.right == null: {
				pos!.value = x!.left
				x!.left!.parent = x!.parent
				t.rebalanceUp(x!.parent)
				break
			}
			default: {
				t.deleteSwap(pos)
				break
			}
		}
		x!.balance = -100
		x!.parent = null
		x!.left = null
		x!.right = null
		x!.height = -1
		t.root!.check(null)
	}

	// deleteSwap deletes a node that has two children by replacing
	// it by its in-order successor, then triggers a rebalance.
	public deleteSwap(pos: $.VarRef<node | null> | null): void {
		const t = this
		let x = pos!.value
		let z = t.deleteMin(x!.right)
		pos!.value = z
		let unbalanced = z!.parent // lowest potentially unbalanced node
		if ((unbalanced === x)) {
			unbalanced = z // (x a (z nil b)) -> (z a b)
		}
		z!.parent = x!.parent
		z!.height = x!.height
		z!.balance = x!.balance
		z!.setLeft(x!.left)
		z!.setRight(x!.right)
		t.rebalanceUp(unbalanced)
	}

	// deleteMin updates the subtree rooted at *zpos to delete its minimum
	// (leftmost) element, which may be *zpos itself. It returns the
	// deleted node.
	public deleteMin(zpos: $.VarRef<node | null> | null): node | null {
		let z: node | null = null
		for (; (zpos!.value)!.left != null; ) {
			zpos = (zpos!.value)!.left
		}
		z = zpos!.value
		zpos!.value = z!.right
		if (zpos!.value != null) {
			;(zpos!.value)!.parent = z!.parent
		}
		return z
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'go/token.tree',
	  new tree(),
	  [{ name: "locate", args: [{ name: "k", type: "key" }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Pointer, elemType: "node" } } }, { type: { kind: $.TypeKind.Pointer, elemType: "node" } }] }, { name: "all", args: [], returns: [{ type: "Seq" }] }, { name: "nextAfter", args: [{ name: "pos", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Pointer, elemType: "node" } } }, { name: "parent", type: { kind: $.TypeKind.Pointer, elemType: "node" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "node" } }] }, { name: "setRoot", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "node" } }], returns: [] }, { name: "replaceChild", args: [{ name: "parent", type: { kind: $.TypeKind.Pointer, elemType: "node" } }, { name: "old", type: { kind: $.TypeKind.Pointer, elemType: "node" } }, { name: "new", type: { kind: $.TypeKind.Pointer, elemType: "node" } }], returns: [] }, { name: "rebalanceUp", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "node" } }], returns: [] }, { name: "rotateRight", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "node" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "node" } }] }, { name: "rotateLeft", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "node" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "node" } }] }, { name: "add", args: [{ name: "file", type: { kind: $.TypeKind.Pointer, elemType: "File" } }], returns: [] }, { name: "set", args: [{ name: "file", type: { kind: $.TypeKind.Pointer, elemType: "File" } }, { name: "pos", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Pointer, elemType: "node" } } }, { name: "parent", type: { kind: $.TypeKind.Pointer, elemType: "node" } }], returns: [] }, { name: "delete", args: [{ name: "pos", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Pointer, elemType: "node" } } }], returns: [] }, { name: "deleteSwap", args: [{ name: "pos", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Pointer, elemType: "node" } } }], returns: [] }, { name: "deleteMin", args: [{ name: "zpos", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Pointer, elemType: "node" } } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "node" } }] }],
	  tree,
	  {"root": { kind: $.TypeKind.Pointer, elemType: "node" }}
	);
}

export class node {
	// We use the notation (parent left right) in many comments.
	public get parent(): node | null {
		return this._fields.parent.value
	}
	public set parent(value: node | null) {
		this._fields.parent.value = value
	}

	public get left(): node | null {
		return this._fields.left.value
	}
	public set left(value: node | null) {
		this._fields.left.value = value
	}

	public get right(): node | null {
		return this._fields.right.value
	}
	public set right(value: node | null) {
		this._fields.right.value = value
	}

	public get file(): File | null {
		return this._fields.file.value
	}
	public set file(value: File | null) {
		this._fields.file.value = value
	}

	// = file.key(), but improves locality (25% faster)
	public get key(): key {
		return this._fields.key.value
	}
	public set key(value: key) {
		this._fields.key.value = value
	}

	// at most ±2
	public get balance(): number {
		return this._fields.balance.value
	}
	public set balance(value: number) {
		this._fields.balance.value = value
	}

	public get height(): number {
		return this._fields.height.value
	}
	public set height(value: number) {
		this._fields.height.value = value
	}

	public _fields: {
		parent: $.VarRef<node | null>;
		left: $.VarRef<node | null>;
		right: $.VarRef<node | null>;
		file: $.VarRef<File | null>;
		key: $.VarRef<key>;
		balance: $.VarRef<number>;
		height: $.VarRef<number>;
	}

	constructor(init?: Partial<{balance?: number, file?: File | null, height?: number, key?: key, left?: node | null, parent?: node | null, right?: node | null}>) {
		this._fields = {
			parent: $.varRef(init?.parent ?? null),
			left: $.varRef(init?.left ?? null),
			right: $.varRef(init?.right ?? null),
			file: $.varRef(init?.file ?? null),
			key: $.varRef(init?.key ? $.markAsStructValue(init.key.clone()) : new key()),
			balance: $.varRef(init?.balance ?? 0),
			height: $.varRef(init?.height ?? 0)
		}
	}

	public clone(): node {
		const cloned = new node()
		cloned._fields = {
			parent: $.varRef(this._fields.parent.value ? $.markAsStructValue(this._fields.parent.value.clone()) : null),
			left: $.varRef(this._fields.left.value ? $.markAsStructValue(this._fields.left.value.clone()) : null),
			right: $.varRef(this._fields.right.value ? $.markAsStructValue(this._fields.right.value.clone()) : null),
			file: $.varRef(this._fields.file.value ? $.markAsStructValue(this._fields.file.value.clone()) : null),
			key: $.varRef($.markAsStructValue(this._fields.key.value.clone())),
			balance: $.varRef(this._fields.balance.value),
			height: $.varRef(this._fields.height.value)
		}
		return cloned
	}

	// check asserts that each node's height, subtree, and parent link is
	// correct.
	public check(parent: node | null): void {
		const n = this
		let debugging: boolean = false
		if (false) {
			if (n == null) {
				return 
			}
			if ((n.parent !== parent)) {
				$.panic("bad parent")
			}
			n.left!.check(n)
			n.right!.check(n)
			n.checkBalance()
		}
	}

	public checkBalance(): void {
		const n = this
		let [lheight, rheight] = [n.left!.safeHeight(), n.right!.safeHeight()]
		let balance = rheight - lheight
		if (balance != n.balance) {
			$.panic("bad node.balance")
		}
		if (!(-2 <= balance && balance <= +2)) {
			$.panic(fmt.Sprintf("node.balance out of range: %d", balance))
		}
		let h = 1 + Math.max(lheight, rheight)
		if (h != n.height) {
			$.panic("bad node.height")
		}
	}

	public next(): node | null {
		const x = this
		if (x.right == null) {
			for (; x.parent != null && (x.parent!.right === x); ) {
				x = x.parent
			}
			return x.parent
		}
		x = x.right
		for (; x.left != null; ) {
			x = x.left
		}
		return x
	}

	public setLeft(y: node | null): void {
		const x = this
		x.left = y
		if (y != null) {
			y!.parent = x
		}
	}

	public setRight(y: node | null): void {
		const x = this
		x.right = y
		if (y != null) {
			y!.parent = x
		}
	}

	public safeHeight(): number {
		const n = this
		if (n == null) {
			return -1
		}
		return n.height
	}

	public update(): void {
		const n = this
		let [lheight, rheight] = [n.left!.safeHeight(), n.right!.safeHeight()]
		n.height = Math.max(lheight, rheight) + 1
		n.balance = rheight - lheight
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'go/token.node',
	  new node(),
	  [{ name: "check", args: [{ name: "parent", type: { kind: $.TypeKind.Pointer, elemType: "node" } }], returns: [] }, { name: "checkBalance", args: [], returns: [] }, { name: "next", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "node" } }] }, { name: "setLeft", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "node" } }], returns: [] }, { name: "setRight", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "node" } }], returns: [] }, { name: "safeHeight", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int32" } }] }, { name: "update", args: [], returns: [] }],
	  node,
	  {"parent": { kind: $.TypeKind.Pointer, elemType: "node" }, "left": { kind: $.TypeKind.Pointer, elemType: "node" }, "right": { kind: $.TypeKind.Pointer, elemType: "node" }, "file": { kind: $.TypeKind.Pointer, elemType: "File" }, "key": "key", "balance": { kind: $.TypeKind.Basic, name: "int32" }, "height": { kind: $.TypeKind.Basic, name: "int32" }}
	);
}

// compareKey reports whether x is before y (-1),
// after y (+1), or overlapping y (0).
// This is a total order so long as all
// files in the tree have disjoint ranges.
//
// All files are separated by at least one unit.
// This allows us to use strict < comparisons.
// Use key{p, p} to search for a zero-width position
// even at the start or end of a file.
export function compareKey(x: key, y: key): number {
	switch (true) {
		case x.end < y.start: {
			return -1
			break
		}
		case y.end < x.start: {
			return +1
			break
		}
	}
	return 0
}

